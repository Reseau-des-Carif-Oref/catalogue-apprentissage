const express = require("express");
const Joi = require("joi");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { ApiStat } = require("../../common/model");
const { paginate } = require("../../common/utils/mongooseUtils");
const { sanitize } = require("../../common/utils/sanitizeUtils");

module.exports = () => {
  const router = express.Router();

  /**
   * Liste paginée des appels API (collection apistats)
   */
  router.get(
    "/apistats",
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

      const { find, pagination } = await paginate(ApiStat, filter, {
        page,
        limit,
        sort: { date_appel: -1 },
      });

      const apistats = await find;

      return res.json({ apistats, pagination });
    })
  );

  return router;
};
