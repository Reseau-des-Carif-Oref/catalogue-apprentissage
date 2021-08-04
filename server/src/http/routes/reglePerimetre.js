const express = require("express");
const Boom = require("boom");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { toBePublishedRules } = require("../../common/utils/referenceUtils");
const { getQueryFromRule } = require("../../common/utils/rulesUtils");
const { getNiveauxDiplomesTree } = require("@mission-apprentissage/tco-service-node");
const { ReglePerimetre, ConvertedFormation } = require("../../common/model");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/perimetre/niveau",
    tryCatch(async (req, res) => {
      const tree = await getNiveauxDiplomesTree();

      const diplomesCounts = await ConvertedFormation.aggregate([
        {
          $match: {
            ...toBePublishedRules,
          },
        },
        {
          $group: {
            _id: {
              niveau: "$niveau",
              diplome: "$diplome",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      const counts = diplomesCounts.reduce((acc, { _id, count }) => {
        acc[_id.niveau] = acc[_id.niveau] ?? 0;
        acc[_id.niveau] += count;

        acc[`${_id.niveau}-${_id.diplome}`] = count;
        return acc;
      }, {});

      const niveauxTree = Object.entries(tree).map(([niveau, diplomes]) => {
        return {
          niveau: {
            value: niveau,
            count: counts[niveau] ?? 0,
          },
          diplomes: diplomes.map((diplome) => {
            return {
              value: diplome,
              count: counts[`${niveau}-${diplome}`] ?? 0,
            };
          }),
        };
      });

      return res.json(niveauxTree);
    })
  );

  router.get(
    "/perimetre/regles",
    tryCatch(async (req, res) => {
      const plateforme = req.query?.plateforme;
      const condition_integration = req.query?.condition_integration;
      const nom_regle_complementaire = req.query?.nom_regle_complementaire;
      if (!plateforme) {
        throw Boom.badRequest();
      }

      const filter = {
        plateforme,
        is_deleted: { $ne: true },
      };

      if (condition_integration) {
        filter.condition_integration = condition_integration;
      }

      if (nom_regle_complementaire) {
        filter.nom_regle_complementaire = nom_regle_complementaire === "null" ? null : nom_regle_complementaire;
      }

      const result = await ReglePerimetre.find(filter).lean();
      return res.json(result);
    })
  );

  router.get(
    "/perimetre/regle/count",
    tryCatch(async (req, res) => {
      const niveau = req.query?.niveau;
      const diplome = req.query?.diplome;
      const regle_complementaire = req.query?.regle_complementaire;
      const num_academie = req.query?.num_academie === "null" ? null : req.query?.num_academie;

      if (!niveau) {
        throw Boom.badRequest();
      }

      const result = await ConvertedFormation.countDocuments(
        getQueryFromRule({ niveau, diplome, regle_complementaire, num_academie })
      );
      return res.json(result);
    })
  );

  router.get(
    "/perimetre/regles/integration/count",
    tryCatch(async (req, res) => {
      const plateforme = req.query?.plateforme;

      if (!plateforme) {
        throw Boom.badRequest();
      }

      const rules = await ReglePerimetre.find({
        plateforme,
        condition_integration: { $in: ["peut intégrer", "doit intégrer"] },
        is_deleted: { $ne: true },
      }).lean();

      const result = await ConvertedFormation.countDocuments({
        $or: rules.map(getQueryFromRule),
      });
      return res.json(result);
    })
  );

  return router;
};
