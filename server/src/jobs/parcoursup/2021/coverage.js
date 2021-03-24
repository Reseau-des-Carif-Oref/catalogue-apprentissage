const { getParcoursupCoverage, getEtablissementCoverage } = require("../../../logic/controller/coverage");
const { paginator } = require("../../common/utils/paginator");
const { PsFormation2021, Etablissement } = require("../../../common/model");
const { runScript } = require("../../scriptWrapper");
const logger = require("../../../common/logger");

const updateMatchedFormation = async (matching) => {
  let {
    formation: { _id },
  } = matching;

  let { matching_strength, data } = matching.match[0];

  await PsFormation2021.findByIdAndUpdate(_id, { matching_type: matching_strength, matching_mna_formation: data });
};

const formation = async () => {
  await paginator(
    PsFormation2021,
    { filter: { code_cfd: { $ne: null } }, lean: true, limit: 150 },
    async (formation) => {
      let match = await getParcoursupCoverage(formation, { published: true, tags: "2021" });

      if (!match) return;

      let payload = { formation, match };

      await updateMatchedFormation(payload);
    }
  );
};

const etablissement = async () => {
  await paginator(
    PsFormation2021,
    { filter: { matching_type: { $ne: null } }, lean: true },
    async ({ matching_mna_formation, _id }) => {
      let match = await getEtablissementCoverage(matching_mna_formation);

      if (!match) return;

      await PsFormation2021.findByIdAndUpdate(_id, {
        matching_mna_etablissement: match,
      });
    }
  );
};

const psCoverage = async () => {
  logger.info("Start Parcoursup coverage");
  let check = await Etablissement.find({}).countDocuments();

  if (check === 0) {
    logger.error("No establishment found, please import collection first");

    return;
  }
  logger.info("Start formation coverage");
  await formation();

  logger.info("Start etablissement coverage");
  await etablissement();

  logger.info("End Parcoursup coverage");
};

module.exports = psCoverage;

if (process.env.standalone) {
  runScript(async () => {
    await psCoverage();
  });
}
