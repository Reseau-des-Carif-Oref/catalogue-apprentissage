const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const permissionsMiddleware = require("../middlewares/permissionsMiddleware");
const {
  Statistique,
  DualControlFormation,
  DualControlReport,
  DualControlEtablissement,
  Log,
} = require("../../common/model");

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

        // Récupérer l'établissement le plus récent
        const lastEtablissement = await DualControlEtablissement.findOne({}, {}, { sort: { _id: -1 } });

        // Récupérer le dernier rapport d'import
        const lastReport = await DualControlReport.findOne({}, {}, { sort: { date: -1 } });

        // Compter le total des formations et établissements
        const totalFormations = await DualControlFormation.countDocuments();
        const totalEtablissements = await DualControlEtablissement.countDocuments();

        // Analyser tous les tags disponibles pour comprendre leur structure
        const allTagsAggregation = await DualControlFormation.aggregate([
          { $unwind: "$tags" },
          { $group: { _id: "$tags", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]);

        // Analyser les tags pour trouver des patterns de date (plusieurs formats possibles)
        const tagsAggregation = await DualControlFormation.aggregate([
          { $unwind: "$tags" },
          {
            $match: {
              $or: [
                { tags: { $regex: /^20\d{6}$/ } }, // Pattern YYYYMMDD
                { tags: { $regex: /^20\d{2}-\d{2}-\d{2}$/ } }, // Pattern YYYY-MM-DD
                { tags: { $regex: /^20\d{2}_\d{2}_\d{2}$/ } }, // Pattern YYYY_MM_DD
                { tags: { $regex: /^\d{8}$/ } }, // Pattern DDMMYYYY ou YYYYMMDD
                { tags: { $regex: /^mna.*20\d{2}/i } }, // Pattern contenant mna et année
                { tags: { $regex: /^catalogue.*20\d{2}/i } }, // Pattern contenant catalogue et année
              ],
            },
          },
          { $group: { _id: "$tags", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
          { $limit: 5 },
        ]);

        const lastDateTag = tagsAggregation.length > 0 ? tagsAggregation[0]._id : null;

        // Calculer des indicateurs supplémentaires
        const dataQualityStats = await DualControlFormation.aggregate([
          {
            $group: {
              _id: null,
              totalFormations: { $sum: 1 },
              formationsWithSiret: { $sum: { $cond: [{ $ne: ["$etablissement_formateur_siret", null] }, 1, 0] } },
              uniqueEstablishments: { $addToSet: "$etablissement_formateur_siret" },
              formationsWithEmail: { $sum: { $cond: [{ $ne: ["$email", null] }, 1, 0] } },
            },
          },
          {
            $project: {
              totalFormations: 1,
              completeness: {
                $round: [
                  {
                    $multiply: [{ $divide: ["$formationsWithSiret", "$totalFormations"] }, 100],
                  },
                  1,
                ],
              },
              uniqueEstablishments: { $size: "$uniqueEstablishments" },
              averageFormationsPerEstablishment: {
                $round: [
                  {
                    $divide: ["$totalFormations", { $size: "$uniqueEstablishments" }],
                  },
                  1,
                ],
              },
            },
          },
        ]);

        const qualityData = dataQualityStats[0] || {};

        // Calculer l'âge des données
        const now = new Date();
        const lastImportDate = lastFormation ? lastFormation._id.getTimestamp() : null;
        let dataAge = { text: "N/A", color: "gray.500" };

        if (lastImportDate) {
          const diffHours = Math.floor((now - lastImportDate) / (1000 * 60 * 60));
          const diffDays = Math.floor(diffHours / 24);

          if (diffHours < 24) {
            dataAge = { text: `${diffHours}h`, color: "green.500" };
          } else if (diffDays < 7) {
            dataAge = { text: `${diffDays}j`, color: "yellow.500" };
          } else {
            dataAge = { text: `${diffDays}j`, color: "red.500" };
          }
        }

        // Estimer la taille du fichier
        const estimatedSizeMB = Math.round((totalFormations * 2) / 1000); // Estimation: 2KB par formation
        const fileSize = estimatedSizeMB > 0 ? `~${estimatedSizeMB} MB` : "< 1 MB";

        // Calculer la fréquence d'import (basée sur les rapports)
        const recentReports = await DualControlReport.find({}).sort({ date: -1 }).limit(5);

        let importFrequency = "Non déterminée";
        if (recentReports.length >= 2) {
          const daysBetween = Math.floor((recentReports[0].date - recentReports[1].date) / (1000 * 60 * 60 * 24));
          if (daysBetween <= 1) importFrequency = "Quotidienne";
          else if (daysBetween <= 7) importFrequency = "Hebdomadaire";
          else if (daysBetween <= 31) importFrequency = "Mensuelle";
          else importFrequency = "Irrégulière";
        }

        // Compter les imports de ce mois de façon plus simple
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Méthode 1: Compter les rapports d'import de ce mois
        const reportsThisMonth = await DualControlReport.countDocuments({
          date: { $gte: startOfMonth },
        });

        // Méthode 2: Compter les jours uniques d'import ce mois (plus précis)
        const { ObjectId } = require("mongodb");
        const startOfMonthObjectId = ObjectId.createFromTime(Math.floor(startOfMonth.getTime() / 1000));

        const uniqueImportDays = await DualControlFormation.aggregate([
          { $match: { _id: { $gte: startOfMonthObjectId } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $toDate: "$_id" },
                },
              },
            },
          },
          { $count: "uniqueDays" },
        ]);

        const importsThisMonth = uniqueImportDays.length > 0 ? uniqueImportDays[0].uniqueDays : 0;

        // Même calcul pour les établissements
        const uniqueEtablissementImportDays = await DualControlEtablissement.aggregate([
          { $match: { _id: { $gte: startOfMonthObjectId } } },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $toDate: "$_id" },
                },
              },
            },
          },
          { $count: "uniqueDays" },
        ]);

        const etablissementImportsThisMonth =
          uniqueEtablissementImportDays.length > 0 ? uniqueEtablissementImportDays[0].uniqueDays : 0;

        // Extraire les dates du timestamp de l'_id
        const lastImportTimestamp = lastFormation ? lastFormation._id.getTimestamp() : null;
        const lastEtablissementImportTimestamp = lastEtablissement ? lastEtablissement._id.getTimestamp() : null;

        // Déterminer le statut du système
        let systemStatus = { text: "Opérationnel", color: "green" };
        if (dataAge.color === "red.500") {
          systemStatus = { text: "Données obsolètes", color: "red" };
        } else if (dataAge.color === "yellow.500") {
          systemStatus = { text: "Attention", color: "yellow" };
        }

        // Récupérer les noms des fichiers depuis les logs système (formations et établissements)
        let actualFileName = null;
        let actualEtablissementFileName = null;
        let extractedDate = null;

        try {
          const { exec } = require("child_process");
          const { promisify } = require("util");
          const execAsync = promisify(exec);

          // Commande pour les formations (fichiers JSON)
          const formationCommand =
            "grep -r \"Fichier dans l'archive:\" /var/log/ | grep '\\.json' | tail -1 | sed 's/.*Fichier dans l.archive: \\([^ ]*\\).*/\\1/'";

          // Commande pour les établissements (fichiers catalogue_etablissement_apprentissage)
          const etablissementCommand =
            "grep -r \"catalogue_etablissement_apprentissage_.*\\.json\" /var/log/ 2>/dev/null | tail -1 | sed -E 's/.*catalogue_etablissement_apprentissage_([0-9]+\\.json).*/catalogue_etablissement_apprentissage_\\1/'";

          // Récupérer le fichier des formations
          try {
            const { stdout: formationStdout } = await execAsync(formationCommand);
            if (formationStdout && formationStdout.trim()) {
              actualFileName = formationStdout.trim();

              // Essayer d'extraire une date du nom de fichier
              const dateMatch = actualFileName.match(/(\d{8})/);
              if (dateMatch) {
                extractedDate = dateMatch[1];
              }
            }
          } catch (formationError) {
            console.error("Erreur récupération fichier formations:", formationError.message);
          }

          // Récupérer le fichier des établissements
          try {
            const { stdout: etablissementStdout } = await execAsync(etablissementCommand);
            if (etablissementStdout && etablissementStdout.trim()) {
              actualEtablissementFileName = etablissementStdout.trim();
            }
          } catch (etablissementError) {
            console.error("Erreur récupération fichier établissements:", etablissementError.message);
          }

          // Si aucun fichier spécifique trouvé, utiliser la commande générale
          if (!actualFileName && !actualEtablissementFileName) {
            const generalCommand =
              "grep -r \"Fichier dans l'archive:\" /var/log/ | tail -1 | sed 's/.*Fichier dans l.archive: \\([^ ]*\\).*/\\1/'";

            const { stdout } = await execAsync(generalCommand);
            if (stdout && stdout.trim()) {
              const fileName = stdout.trim();
              if (fileName.includes(".json")) {
                actualFileName = fileName;
              } else {
                actualEtablissementFileName = fileName;
              }
            }
          }
        } catch (logError) {
          console.error("Erreur lors de la récupération des noms de fichiers depuis les logs système:", logError);

          // Fallback: essayer avec les logs MongoDB
          try {
            const fileNameLog = await Log.findOne(
              {
                msg: { $regex: /Fichier dans l'archive:/ },
                time: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
              },
              {},
              { sort: { time: -1 } }
            );

            if (fileNameLog && fileNameLog.msg) {
              const fileNameMatch = fileNameLog.msg.match(/Fichier dans l'archive:\s*([^\s]+)/);
              if (fileNameMatch) {
                actualFileName = fileNameMatch[1];
                const dateMatch = actualFileName.match(/(\d{8})/);
                if (dateMatch) {
                  extractedDate = dateMatch[1];
                }
              }
            }
          } catch (mongoError) {
            console.error("Erreur fallback MongoDB:", mongoError);
          }
        }

        // Fallback: si on n'a pas trouvé le nom dans les logs, utiliser l'ancienne méthode
        if (!actualFileName) {
          if (lastDateTag) {
            const dateMatch = lastDateTag.match(/20\d{6}/); // YYYYMMDD
            if (dateMatch) {
              extractedDate = dateMatch[0];
              actualFileName = `_catalogue_mna_2022__${extractedDate}.zip`;
            } else {
              actualFileName = `_catalogue_mna_2022__${lastDateTag}.zip`;
            }
          } else if (lastImportTimestamp) {
            const importDate = new Date(lastImportTimestamp);
            const year = importDate.getFullYear();
            const month = String(importDate.getMonth() + 1).padStart(2, "0");
            const day = String(importDate.getDate()).padStart(2, "0");
            extractedDate = `${year}${month}${day}`;
            actualFileName = `_catalogue_mna_2022__${extractedDate}.zip`;
          } else {
            actualFileName = "_catalogue_mna_2022__date_inconnue.zip";
          }
        }

        const responseData = {
          // Données formations
          lastImportDate: lastImportTimestamp,
          lastReportDate: lastReport?.date || null,
          totalFormations,
          totalDualControlFormations: lastReport?.totalDualControlFormation || totalFormations,
          actualFileName,
          lastDateTag,
          lastFormationId: lastFormation?._id || null,
          importsThisMonth,

          // Données établissements
          totalEtablissements,
          lastEtablissementImportDate: lastEtablissementImportTimestamp,
          lastEtablissementId: lastEtablissement?._id || null,
          etablissementImportsThisMonth,
          actualEtablissementFileName,

          // Indicateurs généraux
          fileSize,
          dataAge,
          dataQuality: {
            completeness: qualityData.completeness || 0,
            uniqueEstablishments: qualityData.uniqueEstablishments || 0,
            averageFormationsPerEstablishment: qualityData.averageFormationsPerEstablishment || 0,
          },
          importFrequency,
          lastSuccessfulImport: lastImportTimestamp,
          systemStatus,
          metadata: {
            lastFormationTags: lastFormation?.tags || [],
            reportDiscriminator: lastReport?.discriminator || null,
            // Informations de debug
            debug: {
              allTagsSample: allTagsAggregation,
              dateTagsFound: tagsAggregation,
              extractedDate,
              lastDateTag,
              grepResult: actualFileName,
              grepExtractedDate: extractedDate,
              startOfMonth: startOfMonth.toISOString(),
              reportsThisMonth,
              uniqueImportDaysResult: uniqueImportDays,
              finalImportsThisMonth: importsThisMonth,
            },
          },
        };

        return res.json({
          success: true,
          data: responseData,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des informations MNA:", error);
        return res.status(500).json({
          success: false,
          error: "Erreur lors de la récupération des informations du dernier import MNA",
        });
      }
    })
  );

  return router;
};
