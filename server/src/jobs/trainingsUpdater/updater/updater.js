const logger = require("../../../common/logger");
const { mnaFormationUpdater } = require("../../../logic/updaters/mnaFormationUpdater");
// const report = require("../../../logic/reporter/report");
// const config = require("config");
const { paginator } = require("../../common/utils/paginator");
// const { findRcoFormationFromConvertedId } = require("../../common/utils/rcoUtils");
// const { storeByChunks } = require("../../common/utils/reportUtils");
const { RcoFormation, ConvertedFormation } = require("../../../common/model/index");

const run = async (filter = {}, withCodePostalUpdate = false, limit = 10, maxItems = 100, offset = 0) => {
  const result = await performUpdates(filter, withCodePostalUpdate, limit, maxItems, offset);

  // const mergeResult = result;
  // const mergeResult = {
  //   invalidFormations: [...t1.invalidFormations, ...t2.invalidFormations],
  //   updatedFormations: [...t1.updatedFormations, ...t2.updatedFormations],
  //   notUpdatedFormations: [...t1.notUpdatedFormations, ...t2.notUpdatedFormations],
  // };

  // await createReport(mergeResult);

  return result;
};

const performUpdates = async (filter = {}, withCodePostalUpdate = false, limit = 10, maxItems = 100, offset = 0) => {
  const invalidFormations = [];
  const updatedFormations = [];
  let notUpdatedCount = 0;
  const cfdInfosCache = new Map();

  await paginator(ConvertedFormation, { filter, limit, maxItems, offset }, async (formation) => {
    const cfdInfoCache = cfdInfosCache.get(formation._doc.formation.cfd) || null;
    const { updates, formation: updatedFormation, error, serviceAvailable = true, cfdInfo } = await mnaFormationUpdater(
      formation._doc,
      {
        // no need to check cp info in trainingsUpdater since it was successfully done once at converter
        withCodePostalUpdate,
        cfdInfo: cfdInfoCache,
      }
    );

    if (cfdInfo && !cfdInfoCache) {
      cfdInfosCache.set(formation._doc.formation.cfd, cfdInfo);
    }

    if (error) {
      formation.update_error = error;

      if (serviceAvailable) {
        // unpublish in case of errors
        // but don't do it if service tco is unavailable
        if (formation.published === true) {
          formation.published = false;
          // flag rco formation as not converted so that it retries during nightly jobs
          await RcoFormation.findOneAndUpdate(
            { id_rco_formation: formation?.id_rco_formation },
            { converted_to_mna: false }
          );
        }
      }

      await ConvertedFormation.findOneAndUpdate({ _id: formation._id }, formation, { new: true });
      invalidFormations.push({ id: formation._id, cfd: formation.cfd, error });
      return;
    }

    if (!updates) {
      notUpdatedCount += 1;
      return;
    }

    try {
      updatedFormation.last_update_at = Date.now();
      await ConvertedFormation.findOneAndUpdate({ _id: formation._id }, updatedFormation, { new: true });
      updatedFormations.push({ id: formation._id, cfd: formation.cfd, updates: JSON.stringify(updates) });
    } catch (error) {
      logger.error(error);
    }
  });

  return { invalidFormations, updatedFormations, notUpdatedCount };
};

// const createReport = async ({ invalidFormations, updatedFormations, notUpdatedCount }) => {
//   const summary = {
//     invalidCount: invalidFormations.length,
//     updatedCount: updatedFormations.length,
//     notUpdatedCount: notUpdatedCount,
//   };

//   // save report in db
//   const date = Date.now();
//   const type = "trainingsUpdate";

//   await storeByChunks(type, date, summary, "updated", updatedFormations);
//   await storeByChunks(`${type}.error`, date, summary, "errors", invalidFormations);

//   const link = `${config.publicUrl}/report?type=${type}&date=${date}`;
//   const data = {
//     invalid: invalidFormations,
//     updated: updatedFormations,
//     summary,
//     link,
//   };
//   const title = "Rapport de mise à jour";
//   const to = config.reportMailingList.split(",");
//   await report.generate(data, title, to, "trainingsUpdateReport");
// };

module.exports = { run, performUpdates };
