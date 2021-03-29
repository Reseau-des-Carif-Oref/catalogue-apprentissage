const logger = require("../../common/logger");
const Joi = require("joi");
const { aPublierRules, aPublierSoumisAValidationRules } = require("../../jobs/pertinence/affelnet/rules");
const { asyncForEach } = require("../../common/utils/asyncUtils");
const { getPeriodeTags } = require("../../jobs/common/utils/rcoUtils");
const { cfdMapper } = require("../mappers/cfdMapper");
const { codePostalMapper } = require("../mappers/codePostalMapper");
const { etablissementsMapper } = require("../mappers/etablissementsMapper");
const { diffFormation } = require("../common/utils/diffUtils");
const { PendingRcoFormation, SandboxFormation, RcoFormation } = require("../../common/model");

const formationSchema = Joi.object({
  cfd: Joi.string().required(),
  etablissement_gestionnaire_siret: Joi.string().required(),
  etablissement_formateur_siret: Joi.string().required(),
  code_postal: Joi.string().required(),
}).unknown();

/*
 * Build updates history
 */
const buildUpdatesHistory = (formation, updates, keys) => {
  const from = keys.reduce((acc, key) => {
    acc[key] = formation[key];
    return acc;
  }, {});
  return [...formation.updates_history, { from, to: { ...updates }, updated_at: Date.now() }];
};

const parseErrors = (messages) => {
  if (!messages) {
    return "";
  }
  return Object.entries(messages)
    .filter(([key, value]) => key === "error" || `${value}`.toLowerCase().includes("erreur"))
    .reduce((acc, [key, value]) => `${acc}${acc ? " " : ""}${key}: ${value}.`, "");
};

const findMefsForAffelnet = async (rules) => {
  const results = await SandboxFormation.find(
    {
      $or: [rules],
    },
    { bcn_mefs_10: 1 }
  ).lean();

  if (results && results.length > 0) {
    return results.reduce((acc, { bcn_mefs_10 }) => {
      return [...acc, ...bcn_mefs_10];
    }, []);
  }

  return null;
};

const mnaFormationUpdater = async (
  formation,
  { withHistoryUpdate = true, withCodePostalUpdate = true, cfdInfo = null } = {}
) => {
  try {
    await formationSchema.validateAsync(formation, { abortEarly: false });

    const currentCfdInfo = cfdInfo || (await cfdMapper(formation.cfd));
    const { result: cfdMapping, messages: cfdMessages } = currentCfdInfo;

    let error = parseErrors(cfdMessages);
    if (error) {
      return { updates: null, formation, error, cfdInfo };
    }

    const { result: cpMapping = {}, messages: cpMessages } = withCodePostalUpdate
      ? await codePostalMapper(formation.code_postal)
      : {};
    error = parseErrors(cpMessages);
    if (error) {
      return { updates: null, formation, error, cfdInfo };
    }

    const rncpInfo = {
      rncp_code: cfdMapping?.rncp_code,
      rncp_intitule: cfdMapping?.rncp_intitule,
      rncp_eligible_apprentissage: cfdMapping?.rncp_eligible_apprentissage,
      ...cfdMapping?.rncp_details,
    };
    const { result: etablissementsMapping, messages: etablissementsMessages } = await etablissementsMapper(
      formation.etablissement_gestionnaire_siret,
      formation.etablissement_formateur_siret,
      rncpInfo
    );

    error = parseErrors(etablissementsMessages);
    if (error) {
      return { updates: null, formation, error, cfdInfo };
    }

    const rcoFormation = await RcoFormation.findOne({ id_rco_formation: formation.id_rco_formation });
    let published = rcoFormation?.published ?? false; // not found in rco should not be published

    let update_error = null;
    if (etablissementsMapping?.etablissement_reference_published === false) {
      published = false;
      if (rcoFormation?.published) {
        update_error = "Formation not published because of etablissement_reference_published";
      }
    }

    // set tags
    let tags = [];
    try {
      const periode = JSON.parse(formation.periode);
      tags = getPeriodeTags(periode);
    } catch (e) {
      logger.error("unable to set tags", e);
    }

    let uai_formation = formation.uai_formation;
    if (!uai_formation) {
      // no uai ? check if it was set by user
      const pendingFormation = await PendingRcoFormation.findOne(
        { id_rco_formation: formation.id_rco_formation },
        { uai_formation: 1 }
      ).lean();
      if (pendingFormation) {
        uai_formation = pendingFormation.uai_formation;
      }

      // still no uai ? try to fill it with etablissement formateur
      if (!uai_formation) {
        uai_formation = etablissementsMapping?.etablissement_formateur_uai;
      }
    }

    const updatedFormation = {
      ...formation,
      ...cfdMapping,
      ...cpMapping,
      ...etablissementsMapping,
      tags,
      published,
      update_error,
      uai_formation,
    };

    // try to fill mefs for Affelnet
    // reset field value
    updatedFormation.mefs_10 = null;
    if (updatedFormation.bcn_mefs_10?.length > 0) {
      //  filter bcn_mefs_10 to get mefs_10 for affelnet

      // eslint-disable-next-line no-unused-vars
      const { _id, ...rest } = updatedFormation;

      // Split formation into N formation with 1 mef each
      // & insert theses into a tmp collection
      await asyncForEach(updatedFormation.bcn_mefs_10, async (mefObj) => {
        await new SandboxFormation({
          ...rest,
          mef_10_code: mefObj.mef10,
          bcn_mefs_10: [mefObj],
        }).save();
      });

      // apply pertinence filters against the tmp collection
      // check "à publier" first to have less mefs
      const currentaPublierRules = { ...aPublierRules };
      // Add current id_rco_formation to ensure no concurrent access in db
      currentaPublierRules["$and"].push({ id_rco_formation: rest.id_rco_formation });
      let mefs_10 = await findMefsForAffelnet(currentaPublierRules);
      if (rest.id_rco_formation === "01_GE108036|01_GE506876|88281") {
        console.log("Here");
        try {
          mefs_10 = await findMefsForAffelnet(currentaPublierRules);
        } catch (error) {
          console.log(error);
        }
      }
      if (!mefs_10) {
        const currentaPublierSoumisAValidationRules = { ...aPublierSoumisAValidationRules };
        // Add current id_rco_formation to ensure no concurrent access in db
        currentaPublierSoumisAValidationRules["$and"].push({ id_rco_formation: rest.id_rco_formation });
        mefs_10 = await findMefsForAffelnet(currentaPublierSoumisAValidationRules);
      }

      if (mefs_10) {
        // keep the successful mefs in affelnet field
        updatedFormation.mefs_10 = mefs_10;

        if (mefs_10.length === 1 && !updatedFormation.affelnet_infos_offre) {
          updatedFormation.affelnet_infos_offre = `${updatedFormation.libelle_court} en ${
            mefs_10[0].modalite.duree
          } an${Number(mefs_10[0].modalite.duree) > 1 ? "s" : ""}`;
        }
      }

      await SandboxFormation.deleteMany({
        id_rco_formation: rest.id_rco_formation,
      });
    }

    const { updates, keys } = diffFormation(formation, updatedFormation);
    if (updates) {
      if (withHistoryUpdate) {
        updatedFormation.updates_history = buildUpdatesHistory(formation, updates, keys);
      }
      return { updates, formation: updatedFormation, cfdInfo };
    }

    return { updates: null, formation, cfdInfo };
  } catch (e) {
    logger.error(e);
    return { updates: null, formation, error: e.toString(), cfdInfo: null };
  }
};

module.exports.mnaFormationUpdater = mnaFormationUpdater;
