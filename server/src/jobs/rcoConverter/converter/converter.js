const logger = require("../../../common/logger");
const { RcoFormation, ConvertedFormation, Etablissement } = require("../../../common/model/index");
const { mnaFormationUpdater } = require("../../../logic/updaters/mnaFormationUpdater");
const report = require("../../../logic/reporter/report");
const config = require("config");
const { asyncForEach } = require("../../../common/utils/asyncUtils");
const catalogue = require("../../../common/components/catalogue");
const { paginator } = require("../../common/utils/paginator");
const { storeByChunks } = require("../../common/utils/reportUtils");

const formatToMnaFormation = (rcoFormation) => {
  const periode =
    rcoFormation.periode && rcoFormation.periode.length > 0
      ? `[${rcoFormation.periode.reduce((acc, e) => `${acc}${acc ? ", " : ""}"${e}"`, "")}]`
      : null;

  return {
    id_rco_formation: `${rcoFormation.id_formation}|${rcoFormation.id_action}|${rcoFormation.id_certifinfo}`,
    cfd: rcoFormation.cfd,

    uai_formation: rcoFormation.etablissement_lieu_formation_uai,
    code_postal: rcoFormation.etablissement_lieu_formation_code_postal,
    code_commune_insee: rcoFormation.etablissement_lieu_formation_code_insee,

    lieu_formation_geo_coordonnees: rcoFormation.etablissement_lieu_formation_geo_coordonnees,
    lieu_formation_adresse: rcoFormation.etablissement_lieu_formation_adresse,
    lieu_formation_siret: rcoFormation.etablissement_lieu_formation_siret,

    rncp_code: rcoFormation.rncp_code,
    periode,
    capacite: rcoFormation.capacite,

    email: rcoFormation.email,
    source: "WS RCO",
    published: rcoFormation.published,

    etablissement_gestionnaire_siret: rcoFormation.etablissement_gestionnaire_siret,
    etablissement_gestionnaire_uai: rcoFormation.etablissement_gestionnaire_uai,
    etablissement_gestionnaire_adresse: rcoFormation.etablissement_gestionnaire_adresse,
    etablissement_gestionnaire_code_postal: rcoFormation.etablissement_gestionnaire_code_postal,
    etablissement_gestionnaire_code_commune_insee: rcoFormation.etablissement_gestionnaire_code_insee,
    geo_coordonnees_etablissement_gestionnaire: rcoFormation.etablissement_gestionnaire_geo_coordonnees,

    etablissement_formateur_siret: rcoFormation.etablissement_formateur_siret,
    etablissement_formateur_uai: rcoFormation.etablissement_formateur_uai,
    etablissement_formateur_adresse: rcoFormation.etablissement_formateur_adresse,
    etablissement_formateur_code_postal: rcoFormation.etablissement_formateur_code_postal,
    etablissement_formateur_code_commune_insee: rcoFormation.etablissement_formateur_code_insee,
    geo_coordonnees_etablissement_formateur: rcoFormation.etablissement_formateur_geo_coordonnees,
  };
};

const getEtablissementData = (rcoFormation, prefix) => {
  return {
    siret: rcoFormation[`${prefix}_siret`] || null,
    uai: rcoFormation[`${prefix}_uai`] || null,
    geo_coordonnees: rcoFormation[`${prefix}_geo_coordonnees`] || null,
    ...getRCOEtablissementFields(rcoFormation, prefix),
  };
};

const getRCOEtablissementFields = (rcoFormation, prefix) => {
  return {
    rco_uai: rcoFormation[`${prefix}_uai`] || null,
    rco_geo_coordonnees: rcoFormation[`${prefix}_geo_coordonnees`] || null,
    rco_code_postal: rcoFormation[`${prefix}_code_postal`] || null,
    rco_adresse: rcoFormation[`${prefix}_adresse`] || null,
    rco_code_insee_localite: rcoFormation[`${prefix}_code_insee`] || null,
  };
};

const areEtablissementFieldsEqual = (rcoFields, etablissement) => {
  const keyMap = {
    rco_uai: "uai",
    rco_geo_coordonnees: "geo_coordonnees",
    rco_code_postal: "code_postal",
    rco_adresse: "adresse",
    rco_code_insee_localite: "code_insee_localite",
  };
  return Object.entries(rcoFields).every(([key, value]) => etablissement[keyMap[key]] === value);
};

const areRCOFieldsEqual = (rcoFields, etablissement) => {
  return Object.entries(rcoFields).every(([key, value]) => etablissement[key] === value);
};

const handledSirets = [];

/**
 * Create or update etablissements
 */
const createOrUpdateEtablissements = async (rcoFormation) => {
  const etablissementTypes = [
    "etablissement_gestionnaire",
    "etablissement_formateur" /*, "etablissement_lieu_formation"*/,
  ];

  await asyncForEach(etablissementTypes, async (type) => {
    const data = getEtablissementData(rcoFormation, type);
    if (!data.siret || handledSirets.includes(data.siret)) {
      return;
    }

    const years = ["2020", "2021"];
    const tags = years.filter((year) => rcoFormation.periode?.some((p) => p.includes(year)));
    if (tags.length === 0) {
      return;
    }

    handledSirets.push(data.siret);
    let etablissement = await Etablissement.findOne({ siret: data.siret });
    if (!etablissement?._id) {
      // create remote etablissement & save locally
      etablissement = await catalogue().createEtablissement({ ...data, tags });
      await Etablissement.create(etablissement);
      return;
    }

    let updates = {};
    const rcoFields = getRCOEtablissementFields(rcoFormation, type);

    if (!areEtablissementFieldsEqual(rcoFields, etablissement) && !areRCOFieldsEqual(rcoFields, etablissement)) {
      updates = {
        ...updates,
        ...rcoFields,
      };
    }

    const tagsToAdd = tags.filter((tag) => !etablissement?.tags?.includes(tag));
    if (tagsToAdd.length > 0) {
      updates.tags = [...etablissement.tags, ...tagsToAdd];
    }

    if (Object.keys(updates).length > 0) {
      // update remote etablissement & save locally
      await catalogue().updateEtablissement(etablissement._id, updates);
      await Etablissement.findOneAndUpdate({ siret: data.siret }, updates);
    }
  });
};

const run = async () => {
  //  1 : filter rco formations which are not converted yet
  //  2 : convert them to mna format & launch updater on them
  const result = await performConversion();

  //  3 : Then create a report of conversion
  await createConversionReport(result);
};

const performConversion = async () => {
  const invalidRcoFormations = [];
  const convertedRcoFormations = [];

  await paginator(RcoFormation, { filter: { converted_to_mna: { $ne: true } }, limit: 10 }, async (rcoFormation) => {
    const mnaFormattedRcoFormation = formatToMnaFormation(rcoFormation._doc);

    if (!rcoFormation.published) {
      // if formation is unpublished, don't create etablissement and don't call mnaUpdater
      // since we don't care of errors we just want to hide the formation
      rcoFormation.conversion_error = "success";
      await rcoFormation.save();

      await ConvertedFormation.findOneAndUpdate(
        { id_rco_formation: mnaFormattedRcoFormation.id_rco_formation },
        { published: false },
        {
          new: true,
        }
      );

      convertedRcoFormations.push({
        id_rco_formation: mnaFormattedRcoFormation.id_rco_formation,
        cfd: mnaFormattedRcoFormation.cfd,
        updates: JSON.stringify({ published: false }),
      });
      return;
    }

    await createOrUpdateEtablissements(rcoFormation._doc);

    const { updates, formation: convertedFormation, error } = await mnaFormationUpdater(mnaFormattedRcoFormation, {
      withHistoryUpdate: false,
    });

    if (error) {
      rcoFormation.conversion_error = error;
      await rcoFormation.save();
      // unpublish in case of errors if it was already in converted collection
      await ConvertedFormation.findOneAndUpdate(
        { id_rco_formation: mnaFormattedRcoFormation.id_rco_formation },
        { published: false, update_error: error },
        {
          new: true,
        }
      );

      invalidRcoFormations.push({
        id_rco_formation: mnaFormattedRcoFormation.id_rco_formation,
        cfd: mnaFormattedRcoFormation.cfd,
        rncp: mnaFormattedRcoFormation.rncp_code,
        sirets: JSON.stringify({
          gestionnaire: mnaFormattedRcoFormation.etablissement_gestionnaire_siret,
          formateur: mnaFormattedRcoFormation.etablissement_formateur_siret,
          lieu_formation: mnaFormattedRcoFormation.lieu_formation_siret,
        }),
        error,
      });
      return;
    }

    rcoFormation.conversion_error = "success";
    await rcoFormation.save();

    // replace or insert new one
    await ConvertedFormation.findOneAndUpdate(
      { id_rco_formation: convertedFormation.id_rco_formation },
      convertedFormation,
      {
        overwrite: true,
        upsert: true,
        new: true,
      }
    );

    convertedRcoFormations.push({
      id_rco_formation: convertedFormation.id_rco_formation,
      cfd: convertedFormation.cfd,
      updates: JSON.stringify(updates),
    });
  });

  // update converted_to_mna outside loop to not mess up with paginate
  await RcoFormation.updateMany(
    { conversion_error: "success" },
    { $set: { conversion_error: null, converted_to_mna: true } }
  );

  return { invalidRcoFormations, convertedRcoFormations };
};

const createConversionReport = async ({ invalidRcoFormations, convertedRcoFormations }) => {
  logger.info(
    "create report :",
    `${invalidRcoFormations.length} invalid formations,`,
    `${convertedRcoFormations.length} converted formations`
  );

  const summary = {
    invalidCount: invalidRcoFormations.length,
    convertedCount: convertedRcoFormations.length,
  };
  // save report in db
  const date = Date.now();
  const type = "rcoConversion";

  await storeByChunks(type, date, summary, "converted", convertedRcoFormations);
  await storeByChunks(`${type}.error`, date, summary, "errors", invalidRcoFormations);

  const link = `${config.publicUrl}/report?type=${type}&date=${date}`;
  const data = { invalid: invalidRcoFormations, converted: convertedRcoFormations, summary, link };

  // Send mail
  const title = "[RCO Formations] Rapport de conversion";
  const to = config.rco.reportMailingList.split(",");
  await report.generate(data, title, to, "rcoConversionReport");
};

module.exports = { run, performConversion };
