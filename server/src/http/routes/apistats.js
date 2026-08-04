const express = require("express");
const Joi = require("joi");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { ApiStat } = require("../../common/model");
const { sanitize } = require("../../common/utils/sanitizeUtils");

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const daysAgo = (n) => {
  const d = startOfDay();
  d.setDate(d.getDate() - n);
  return d;
};

module.exports = () => {
  const router = express.Router();

  /**
   * Synthèse lisible pour non-techniciens
   */
  router.get(
    "/summary",
    tryCatch(async (req, res) => {
      const sanitizedQuery = sanitize(req.query);
      const { jours } = await Joi.object({
        jours: Joi.number().integer().valid(7, 30, 90).default(7),
      }).validateAsync(sanitizedQuery, { abortEarly: false });

      const depuis = daysAgo(jours - 1);
      const aujourdhui = startOfDay();
      const matchPeriode = { date_appel: { $gte: depuis } };

      const [totaux, parJour, topEndpoints, topConsommateurs] = await Promise.all([
        ApiStat.aggregate([
          { $match: matchPeriode },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              succes: { $sum: { $cond: [{ $and: [{ $gte: ["$code_http", 200] }, { $lt: ["$code_http", 400] }] }, 1, 0] } },
              erreurs_client: {
                $sum: { $cond: [{ $and: [{ $gte: ["$code_http", 400] }, { $lt: ["$code_http", 500] }] }, 1, 0] },
              },
              erreurs_serveur: { $sum: { $cond: [{ $gte: ["$code_http", 500] }, 1, 0] } },
              duree_moyenne_ms: { $avg: "$duree_ms" },
              aujourdhui: { $sum: { $cond: [{ $gte: ["$date_appel", aujourdhui] }, 1, 0] } },
            },
          },
        ]),
        ApiStat.aggregate([
          { $match: matchPeriode },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_appel" } },
              total: { $sum: 1 },
              succes: { $sum: { $cond: [{ $and: [{ $gte: ["$code_http", 200] }, { $lt: ["$code_http", 400] }] }, 1, 0] } },
              erreurs: { $sum: { $cond: [{ $gte: ["$code_http", 400] }, 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        ApiStat.aggregate([
          { $match: matchPeriode },
          { $group: { _id: "$endpoint", total: { $sum: 1 } } },
          { $sort: { total: -1 } },
          { $limit: 8 },
        ]),
        ApiStat.aggregate([
          { $match: matchPeriode },
          {
            $group: {
              _id: { $ifNull: ["$consommateur", "Public (non connecté)"] },
              total: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
          { $limit: 8 },
        ]),
      ]);

      const t = totaux[0] || {
        total: 0,
        succes: 0,
        erreurs_client: 0,
        erreurs_serveur: 0,
        duree_moyenne_ms: 0,
        aujourdhui: 0,
      };

      const total = t.total || 0;
      const tauxSucces = total ? Math.round((t.succes / total) * 1000) / 10 : 100;
      const tauxErreur = total ? Math.round(((t.erreurs_client + t.erreurs_serveur) / total) * 1000) / 10 : 0;

      return res.json({
        periode_jours: jours,
        depuis,
        total_appels: total,
        appels_aujourdhui: t.aujourdhui || 0,
        taux_succes: tauxSucces,
        taux_erreur: tauxErreur,
        duree_moyenne_ms: Math.round(t.duree_moyenne_ms || 0),
        repartition: {
          succes: t.succes || 0,
          erreurs_client: t.erreurs_client || 0,
          erreurs_serveur: t.erreurs_serveur || 0,
        },
        par_jour: parJour.map((j) => ({
          jour: j._id,
          total: j.total,
          succes: j.succes,
          erreurs: j.erreurs,
        })),
        top_services: topEndpoints.map((e) => ({
          endpoint: e._id,
          total: e.total,
        })),
        top_utilisateurs: topConsommateurs.map((c) => ({
          consommateur: c._id,
          total: c.total,
        })),
      });
    })
  );

  /**
   * Liste paginée des appels API (collection apistats)
   */
  router.get(
    "/",
    tryCatch(async (req, res) => {
      const sanitizedQuery = sanitize(req.query);

      const { page, limit, endpoint, consommateur, methode, code_http } = await Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(50),
        endpoint: Joi.string().allow("").optional(),
        consommateur: Joi.string().allow("").optional(),
        methode: Joi.string().allow("").optional(),
        code_http: Joi.number().integer().optional(),
      }).validateAsync(sanitizedQuery, { abortEarly: false });

      const filter = {};

      if (endpoint) {
        filter.endpoint = { $regex: endpoint, $options: "i" };
      }
      if (consommateur) {
        filter.consommateur = { $regex: consommateur, $options: "i" };
      }
      if (methode) {
        filter.methode = methode.toUpperCase();
      }
      if (code_http !== undefined) {
        filter.code_http = code_http;
      }

      const skip = (page - 1) * limit;
      const [total, apistats] = await Promise.all([
        ApiStat.countDocuments(filter),
        ApiStat.find(filter).sort({ date_appel: -1 }).skip(skip).limit(limit).lean(),
      ]);

      return res.json({
        apistats,
        pagination: {
          page,
          resultats_par_page: limit,
          nombre_de_page: Math.ceil(total / limit) || 1,
          total,
        },
      });
    })
  );

  return router;
};
