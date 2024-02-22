const { getModels } = require("@mission-apprentissage/tco-service-node");
const logger = require("../../common/logger");

const completeDateFermetureMefs = async (mefs) => {
  const Models = await getModels();
  return await Promise.all(
    mefs.map(async (mef) => {
      try {
        const { DATE_FERMETURE } = await Models.BcnNMef.findOne({ MEF: mef.mef10 });

        const dateParts = DATE_FERMETURE?.split("/");

        return {
          ...mef,
          date_fermeture: DATE_FERMETURE ? new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]) : null,
        };
      } catch (error) {
        logger.error({ type: "logic" }, `${mef.mef10} not found in BcnNMef`);
        return mef;
      }
    })
  );
};

const computeMefs = async (fields) => {
  let bcn_mefs_10 = fields.bcn_mefs_10;
  let duree_incoherente = false;
  let annee_incoherente = false;

  // filter bcn_mefs_10 with data received from RCO
  const duree = fields.duree;
  if (duree && duree !== "X") {
    bcn_mefs_10 = bcn_mefs_10?.filter(({ modalite }) => {
      return modalite.duree === duree;
    });

    duree_incoherente =
      !!fields.bcn_mefs_10.length &&
      fields.bcn_mefs_10.every(({ modalite }) => {
        return modalite.duree !== duree;
      });
  }

  const annee = fields.annee;
  if (annee && annee !== "X") {
    bcn_mefs_10 = bcn_mefs_10?.filter(({ modalite }) => {
      return modalite.annee === annee;
    });

    annee_incoherente =
      !!fields.bcn_mefs_10.length &&
      fields.bcn_mefs_10.every(({ modalite }) => {
        return modalite.annee !== annee;
      });
  }

  bcn_mefs_10 = await completeDateFermetureMefs(bcn_mefs_10);

  return {
    bcn_mefs_10,
    duree_incoherente,
    annee_incoherente,
  };
};

module.exports = { computeMefs };
