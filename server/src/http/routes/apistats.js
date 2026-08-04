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

const JOURS_SEMAINE = {
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
  7: "Dimanche",
};

const LABELS_CATEGORIES = {
  formations: "Formations",
  organismes: "Organismes de formation",
  recherche: "Recherche",
  connexion: "Connexion au catalogue",
  pilotage: "Pilotage / administration",
  rapports: "Rapports",
  autre: "Autres consultations",
};

const categoriserEndpoint = (endpoint = "") => {
  const e = String(endpoint).toLowerCase();
  if (e.includes("formation")) return "formations";
  if (e.includes("etablissement")) return "organismes";
  if (e.includes("/search") || e.includes("/es/search")) return "recherche";
  if (e.includes("/auth") || e.includes("/password")) return "connexion";
  if (e.includes("/admin") || e.includes("/upload") || e.includes("/stats")) return "pilotage";
  if (e.includes("report")) return "rapports";
  return "autre";
};

module.exports = () => {
  const router = express.Router();

  /**
   * Synthèse lisible pour non-techniciens (regard métier)
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
      const debutPeriodePrec = daysAgo(jours * 2 - 1);
      const finPeriodePrec = daysAgo(jours);
      const matchPeriode = { date_appel: { $gte: depuis } };

      const [totaux, parJour, topEndpoints, topConsommateurs, parEndpoint, parJourSemaine, periodePrecedente] =
        await Promise.all([
          ApiStat.aggregate([
            { $match: matchPeriode },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                succes: {
                  $sum: { $cond: [{ $and: [{ $gte: ["$code_http", 200] }, { $lt: ["$code_http", 400] }] }, 1, 0] },
                },
                erreurs_client: {
                  $sum: { $cond: [{ $and: [{ $gte: ["$code_http", 400] }, { $lt: ["$code_http", 500] }] }, 1, 0] },
                },
                erreurs_serveur: { $sum: { $cond: [{ $gte: ["$code_http", 500] }, 1, 0] } },
                duree_moyenne_ms: { $avg: "$duree_ms" },
                aujourdhui: { $sum: { $cond: [{ $gte: ["$date_appel", aujourdhui] }, 1, 0] } },
                public: { $sum: { $cond: [{ $eq: ["$consommateur", null] }, 1, 0] } },
                connectes: { $sum: { $cond: [{ $ne: ["$consommateur", null] }, 1, 0] } },
                utilisateurs: { $addToSet: "$consommateur" },
              },
            },
          ]),
          ApiStat.aggregate([
            { $match: matchPeriode },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_appel" } },
                total: { $sum: 1 },
                succes: {
                  $sum: { $cond: [{ $and: [{ $gte: ["$code_http", 200] }, { $lt: ["$code_http", 400] }] }, 1, 0] },
                },
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
          ApiStat.aggregate([
            { $match: matchPeriode },
            { $group: { _id: "$endpoint", total: { $sum: 1 } } },
          ]),
          ApiStat.aggregate([
            { $match: matchPeriode },
            {
              $group: {
                _id: { $isoDayOfWeek: "$date_appel" },
                total: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]),
          ApiStat.countDocuments({
            date_appel: { $gte: debutPeriodePrec, $lt: finPeriodePrec },
          }),
        ]);

      const t = totaux[0] || {
        total: 0,
        succes: 0,
        erreurs_client: 0,
        erreurs_serveur: 0,
        duree_moyenne_ms: 0,
        aujourdhui: 0,
        public: 0,
        connectes: 0,
        utilisateurs: [],
      };

      const total = t.total || 0;
      const tauxSucces = total ? Math.round((t.succes / total) * 1000) / 10 : 100;
      const tauxErreur = total ? Math.round(((t.erreurs_client + t.erreurs_serveur) / total) * 1000) / 10 : 0;
      const moyenneParJour = Math.round(total / jours);
      const nbUtilisateursConnectes = (t.utilisateurs || []).filter(Boolean).length;

      let evolution_pct = null;
      if (periodePrecedente > 0) {
        evolution_pct = Math.round(((total - periodePrecedente) / periodePrecedente) * 1000) / 10;
      } else if (total > 0) {
        evolution_pct = 100;
      }

      const parJourMapped = parJour.map((j) => ({
        jour: j._id,
        total: j.total,
        succes: j.succes,
        erreurs: j.erreurs,
      }));

      const jourLePlusActif = parJourMapped.reduce(
        (best, cur) => (!best || cur.total > best.total ? cur : best),
        null
      );
      const jourLeMoinsActif = parJourMapped.reduce(
        (best, cur) => (!best || cur.total < best.total ? cur : best),
        null
      );

      const categoriesMap = {};
      (parEndpoint || []).forEach((row) => {
        const code = categoriserEndpoint(row._id);
        categoriesMap[code] = (categoriesMap[code] || 0) + row.total;
      });
      const categories = Object.keys(categoriesMap)
        .map((code) => ({
          code,
          label: LABELS_CATEGORIES[code] || code,
          total: categoriesMap[code],
          part_pct: total ? Math.round((categoriesMap[code] / total) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.total - a.total);

      const joursSemaine = parJourSemaine.map((j) => ({
        jour: JOURS_SEMAINE[j._id] || `Jour ${j._id}`,
        total: j.total,
      }));

      const duree = t.duree_moyenne_ms || 0;
      const fluidite = duree < 200 ? "Très fluide" : duree < 800 ? "Fluide" : duree < 2000 ? "Correcte" : "Lente";

      return res.json({
        periode_jours: jours,
        depuis,
        total_appels: total,
        appels_aujourdhui: t.aujourdhui || 0,
        moyenne_par_jour: moyenneParJour,
        evolution_pct,
        periode_precedente_total: periodePrecedente,
        taux_succes: tauxSucces,
        taux_erreur: tauxErreur,
        duree_moyenne_ms: Math.round(duree),
        fluidite,
        acces: {
          public: t.public || 0,
          connectes: t.connectes || 0,
          utilisateurs_distincts: nbUtilisateursConnectes,
          part_public_pct: total ? Math.round(((t.public || 0) / total) * 1000) / 10 : 0,
          part_connectes_pct: total ? Math.round(((t.connectes || 0) / total) * 1000) / 10 : 0,
        },
        repartition: {
          succes: t.succes || 0,
          erreurs_client: t.erreurs_client || 0,
          erreurs_serveur: t.erreurs_serveur || 0,
        },
        par_jour: parJourMapped,
        jour_le_plus_actif: jourLePlusActif,
        jour_le_moins_actif: jourLeMoinsActif,
        par_jour_semaine: joursSemaine,
        categories,
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
