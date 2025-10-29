const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const permissionsMiddleware = require("../middlewares/permissionsMiddleware");
const { Statistique, DualControlFormation, DualControlReport } = require("../../common/model");
const { sanitize } = require("../../common/utils/sanitizeUtils");

module.exports = () => {
  const router = express.Router();

  /**
   * Route utilisée par LBA pour mesurer le nombre de formations du catalogue vues sur LBA
   */
  router.post(
    "/",
    tryCatch(async (req, res) => {
      const payload = sanitize(req.body);

      const { source } = payload;

      if (!source) {
        return res.status(400).json({ error: "source is mandatory" });
      }

      await Statistique.findOneAndUpdate({ source }, { $inc: { count: 1 } }, { upsert: true });

      return res.sendStatus(200);
    })
  );

  /**
   * Route pour récupérer les informations du dernier import MNA
   * Accessible uniquement aux utilisateurs avec la permission page_import_status
   */
  router.get(
    "/last-mna-import",
    permissionsMiddleware({}, ["page_import_status"]),
    tryCatch(async (req, res) => {
      try {
        // Récupérer la formation la plus récente (basée sur _id qui contient timestamp)
        const lastFormation = await DualControlFormation.findOne({}, {}, { sort: { _id: -1 } });
        
        // Récupérer le dernier rapport d'import
        const lastReport = await DualControlReport.findOne({}, {}, { sort: { date: -1 } });
        
        // Compter le total des formations
        const totalFormations = await DualControlFormation.countDocuments();
        
        // Analyser les tags pour trouver des patterns de date
        const tagsAggregation = await DualControlFormation.aggregate([
          { $unwind: "$tags" },
          { $match: { tags: { $regex: /^20\d{6}$/ } } }, // Pattern YYYYMMDD
          { $group: { _id: "$tags", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
          { $limit: 1 }
        ]);
        
        const lastDateTag = tagsAggregation.length > 0 ? tagsAggregation[0]._id : null;
        
        // Construire le nom du fichier probable
        let probableFileName = null;
        if (lastDateTag) {
          probableFileName = `_catalogue_mna_2022__${lastDateTag}.zip`;
        }
        
        // Extraire la date du timestamp de l'_id
        const lastImportTimestamp = lastFormation ? lastFormation._id.getTimestamp() : null;
        
        return res.json({
          success: true,
          data: {
            lastImportDate: lastImportTimestamp,
            lastReportDate: lastReport?.date || null,
            totalFormations,
            totalDualControlFormations: lastReport?.totalDualControlFormation || totalFormations,
            probableFileName,
            lastDateTag,
            lastFormationId: lastFormation?._id || null,
            metadata: {
              lastFormationTags: lastFormation?.tags || [],
              reportDiscriminator: lastReport?.discriminator || null
            }
          }
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des informations MNA:", error);
        return res.status(500).json({
          success: false,
          error: "Erreur lors de la récupération des informations du dernier import MNA"
        });
      }
    })
  );

  return router;
};
