const fs = require("fs-extra");
const path = require("path");

const formationsJMinus1 = fs.readJsonSync(
  path.resolve(__dirname, "../assets/catalogue-formations-apprentissage-j-1.json")
);
// 1 formation added, 1 updated
const formationsJ = fs.readJsonSync(path.resolve(__dirname, "../assets/catalogue-formations-apprentissage.json"));
// 1 formation deleted
const formationsJPlus1 = fs.readJsonSync(
  path.resolve(__dirname, "../assets/catalogue-formations-apprentissage-j+1.json")
);
// 1 formation re-added
const formationsJPlus2 = fs.readJsonSync(
  path.resolve(__dirname, "../assets/catalogue-formations-apprentissage-j+2.json")
);

const adding = {
  id_formation: "24_208063",
  id_action: "24_1462357",
  id_certifinfo: "107551",
  etablissement_gestionnaire_siret: "88877726500016",
  etablissement_gestionnaire_uai: null,
  etablissement_gestionnaire_adresse: null,
  etablissement_gestionnaire_code_postal: "06560",
  etablissement_gestionnaire_code_insee: "06152",
  etablissement_gestionnaire_geo_coordonnees: null,
  etablissement_formateur_siret: "88877726500016",
  etablissement_formateur_uai: null,
  etablissement_formateur_adresse: null,
  etablissement_formateur_code_postal: "06560",
  etablissement_formateur_code_insee: "06152",
  etablissement_formateur_geo_coordonnees: null,
  etablissement_lieu_formation_siret: null,
  etablissement_lieu_formation_uai: null,
  etablissement_lieu_formation_adresse: "1300 route des Crêtes",
  etablissement_lieu_formation_code_postal: "06560",
  etablissement_lieu_formation_code_insee: "06152",
  etablissement_lieu_formation_geo_coordonnees: "43.627,7.02616",
  cfd: "26X32045",
  rncp_code: "RNCP34413",
  capacite: null,
  periode: [
    "2021-01",
    "2021-02",
    "2021-03",
    "2021-04",
    "2021-05",
    "2021-06",
    "2021-07",
    "2021-09",
    "2021-10",
    "2021-11",
    "2021-12",
    "2022-01",
    "2022-02",
    "2022-03",
    "2022-04",
    "2022-05",
    "2022-06",
    "2022-07",
  ],
  email: "no-reply@apprentissage.beta.gouv.fr",
};

const updated = {
  id_formation: "24_208037",
  id_action: "24_1462311",
  id_certifinfo: "106623",
  etablissement_gestionnaire_siret: "81743442600026",
  etablissement_gestionnaire_uai: null,
  etablissement_gestionnaire_adresse: null,
  etablissement_gestionnaire_code_postal: "06000",
  etablissement_gestionnaire_code_insee: "06088",
  etablissement_gestionnaire_geo_coordonnees: null,
  etablissement_formateur_siret: "81743442600026",
  etablissement_formateur_uai: null,
  etablissement_formateur_adresse: null,
  etablissement_formateur_code_postal: "06000",
  etablissement_formateur_code_insee: "06088",
  etablissement_formateur_geo_coordonnees: null,
  etablissement_lieu_formation_siret: null,
  etablissement_lieu_formation_uai: null,
  etablissement_lieu_formation_adresse: "59 rue de la Buffa",
  etablissement_lieu_formation_code_postal: "06000",
  etablissement_lieu_formation_code_insee: "06088",
  etablissement_lieu_formation_geo_coordonnees: "43.7218,7.29649",
  cfd: "16031401",
  rncp_code: "RNCP4877",
  capacite: null,
  periode: ["2021-11", "2021-12"],
  email: "no-reply@apprentissage.beta.gouv.fr",
};

const deleted = {
  id_formation: "24_207466",
  id_action: "24_1461053",
  id_certifinfo: "100429",
  etablissement_gestionnaire_siret: "82462211200012",
  etablissement_gestionnaire_uai: null,
  etablissement_gestionnaire_adresse: null,
  etablissement_gestionnaire_code_postal: "06200",
  etablissement_gestionnaire_code_insee: "06088",
  etablissement_gestionnaire_geo_coordonnees: null,
  etablissement_formateur_siret: "82462211200012",
  etablissement_formateur_uai: null,
  etablissement_formateur_adresse: null,
  etablissement_formateur_code_postal: "13016",
  etablissement_formateur_code_insee: "13216",
  etablissement_formateur_geo_coordonnees: null,
  etablissement_lieu_formation_siret: null,
  etablissement_lieu_formation_uai: null,
  etablissement_lieu_formation_adresse: "10 rue Henri et Antoine Maurras",
  etablissement_lieu_formation_code_postal: "13016",
  etablissement_lieu_formation_code_insee: "13216",
  etablissement_lieu_formation_geo_coordonnees: "43.3628,5.31611",
  cfd: null,
  rncp_code: "RNCP30980",
  capacite: null,
  periode: [
    "2021-01",
    "2021-02",
    "2021-03",
    "2021-04",
    "2021-05",
    "2021-06",
    "2021-09",
    "2021-10",
    "2021-11",
    "2021-12",
    "2022-01",
    "2022-02",
    "2022-03",
    "2022-04",
    "2022-05",
    "2022-06",
  ],
  email: "no-reply@apprentissage.beta.gouv.fr",
};

const reAdded = {
  id_formation: "24_207466",
  id_action: "24_1461053",
  id_certifinfo: "100429",
  etablissement_gestionnaire_siret: "82462211200012",
  etablissement_gestionnaire_uai: null,
  etablissement_gestionnaire_adresse: null,
  etablissement_gestionnaire_code_postal: "06200",
  etablissement_gestionnaire_code_insee: "06088",
  etablissement_gestionnaire_geo_coordonnees: null,
  etablissement_formateur_siret: "82462211200012",
  etablissement_formateur_uai: null,
  etablissement_formateur_adresse: null,
  etablissement_formateur_code_postal: "13016",
  etablissement_formateur_code_insee: "13216",
  etablissement_formateur_geo_coordonnees: null,
  etablissement_lieu_formation_siret: null,
  etablissement_lieu_formation_uai: null,
  etablissement_lieu_formation_adresse: "10 rue Henri et Antoine Maurras",
  etablissement_lieu_formation_code_postal: "13016",
  etablissement_lieu_formation_code_insee: "13216",
  etablissement_lieu_formation_geo_coordonnees: "43.3628,5.31611",
  cfd: null,
  rncp_code: "RNCP30980",
  capacite: null,
  periode: [
    "2021-01",
    "2021-02",
    "2021-03",
    "2021-04",
    "2021-05",
    "2021-06",
    "2021-09",
    "2021-10",
    "2021-11",
    "2021-12",
    "2022-01",
    "2022-02",
    "2022-03",
    "2022-04",
    "2022-05",
    "2022-07",
  ],
  email: "no-reply@apprentissage.beta.gouv.fr",
};

module.exports = {
  formationsJ,
  formationsJMinus1,
  formationsJPlus1,
  formationsJPlus2,
  adding,
  updated,
  deleted,
  reAdded,
};
