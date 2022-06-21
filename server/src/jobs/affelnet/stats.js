const { runScript } = require("../scriptWrapper");

const { AFFELNET_STATUS } = require("../../constants/status");
const { ConsoleStat, Formation } = require("../../common/model");
const { academies } = require("../../constants/academies");

const computeStats = async (academie = null) => {
  const scopeFilter = academie ? { nom_academie: academie } : {};
  // const scopeLog = academie ? `[${academie}]` : `[global]`;

  const filterPublie = {
    affelnet_statut: AFFELNET_STATUS.PUBLIE,
    ...scopeFilter,
  };
  const filterIntegrable = {
    affelnet_statut: { $ne: AFFELNET_STATUS.HORS_PERIMETRE },
    ...scopeFilter,
  };

  const formations_publiees = await Formation.countDocuments(filterPublie);
  // console.log(`${scopeLog} Formations publiées : ${formations_publiees}`);
  const formations_integrables = await Formation.countDocuments(filterIntegrable);
  // console.log(`${scopeLog} Formations intégrables : ${formations_integrables}`);

  const organismes_gestionnaires_avec_formations_publiees = await Formation.distinct(
    "etablissement_gestionnaire_id",
    filterPublie
  );
  const organismes_formateurs_avec_formations_publiees = await Formation.distinct(
    "etablissement_formateur_id",
    filterPublie
  );

  const organismes_avec_formations_publiees = [
    ...new Set([
      ...organismes_gestionnaires_avec_formations_publiees,
      ...organismes_formateurs_avec_formations_publiees,
    ]),
  ].length;

  // console.log(`${scopeLog} Organismes avec formations publiées : ${organismes_avec_formations_publiees}`);

  const organismes_gestionnaires_avec_formations_integrables = await Formation.distinct(
    "etablissement_gestionnaire_id",
    filterIntegrable
  );
  const organismes_formateurs_avec_formations_integrables = await Formation.distinct(
    "etablissement_formateur_id",
    filterIntegrable
  );

  const organismes_avec_formations_integrables = [
    ...new Set([
      ...organismes_gestionnaires_avec_formations_integrables,
      ...organismes_formateurs_avec_formations_integrables,
    ]),
  ].length;

  // console.log(`${scopeLog} Organismes avec formations intégrables : ${organismes_avec_formations_integrables}`);

  const details = (
    await Promise.all(
      Object.values(AFFELNET_STATUS).flatMap(async (value) => ({
        [value]: await Formation.countDocuments({ affelnet_statut: value, ...scopeFilter }),
      }))
    )
  ).reduce(function (result, current) {
    return Object.assign(result, current);
  }, {});

  return {
    academie,
    formations_publiees,
    formations_integrables,
    organismes_avec_formations_publiees,
    organismes_avec_formations_integrables,
    details,
  };
};

const stats = async () => {
  console.log(`--- Calcul des statistiques Affelnet ---`);
  const date = new Date();

  await Promise.all(
    [null, ...Object.values(academies).map((academie) => academie.nom_academie)].map(async (academie) => {
      const stats = await computeStats(academie);
      return await ConsoleStat.create({ plateforme: "affelnet", date, ...stats });
    })
  );

  // const stat = {
  //   plateforme: "affelnet",
  //   stats: await Promise.all([
  //     { stats: await computeStats(), academie: "Toute la France" },
  //     ...Object.values(academies).map(async (academie) => await computeStats(academie.nom_academie)),
  //   ]),
  // };

  // return await ConsoleStat.create(stat);
};

module.exports = { stats };

if (process.env.standalone) {
  runScript(async () => {
    await stats();
  });
}
