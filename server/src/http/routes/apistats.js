const express = require("express");
const Joi = require("joi");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { ApiStat } = require("../../common/model");
const { sanitize } = require("../../common/utils/sanitizeUtils");

module.exports = () => {
  const router = express.Router();

  /**
   * Liste paginée des appels API (collection apistats)
   * Monté sur /admin/apistats — ne passe pas par les ACL "gestion utilisateurs"
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
