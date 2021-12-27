const afCoverage = require("./coverage");
const afReconciliation = require("./reconciliation");
const afReference = require("./reference");
const afPerimetre = require("./perimetre");
const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");

const affelnetJobs = async () => {
  try {
    logger.info(`Start Affelnet jobs`);

    await afCoverage();
    await afReconciliation();
    await afReference();
    await afPerimetre();

    logger.info(`End Affelnet jobs`);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = affelnetJobs;

if (process.env.standaloneJobs) {
  runScript(async () => {
    await affelnetJobs();
  });
}
