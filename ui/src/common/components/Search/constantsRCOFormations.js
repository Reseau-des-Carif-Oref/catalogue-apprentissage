import { escapeDiacritics } from "../../utils/downloadUtils";

const FILTERS = [
  "QUERYBUILDER",
  "SEARCH-catalogue_general",
  "SEARCH-catalogue_non_eligible",
  "etablissement_formateur_siret",
  "etablissement_gestionnaire_siret",
  "num_academie",
  "niveau",
  "etablissement_gestionnaire_siren",
  "etablissement_reference_type",
  "etablissement_reference_conventionne",
  "etablissement_reference_declare_prefecture",
  "etablissement_reference_datadock",
  "source",
  "cfd",
  "num_departement",
  "nom_academie",
  "etablissement_gestionnaire_num_academie",
  "uai_formation",
  "code_postal",
  "code_commune_insee",
  "catalogue_published",
  "published",
  "etablissement_gestionnaire_uai",
  "etablissement_formateur_uai",
  "intitule_long",
  "intitule_court",
  "rncp_eligible_apprentissage",
  "rncp_etablissement_gestionnaire_habilite",
  "rome_codes",
  "rncp_code",
  "mef_10_code",
  "parcoursup_statut",
  "affelnet_statut",
  "diplome",
  "opcos",
  "info_opcos_intitule",
];

const columnsDefinition = [
  {
    Header: "Numero academie",
    accessor: "num_academie",
    width: 200,
    editorInput: "text",
    editable: true,
  },
  {
    Header: "Nom academie",
    accessor: "nom_academie",
    width: 200,
    editable: false,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Numero departement",
    accessor: "num_departement",
    width: 200,
    editable: false,
  },
  {
    Header: "Siret Responsable",
    accessor: "etablissement_gestionnaire_siret",
    width: 200,
    editorInput: "text",
  },
  {
    Header: "Uai Responsable",
    accessor: "etablissement_gestionnaire_uai",
    width: 200,
    editorInput: "text",
  },
  {
    Header: "Enseigne Responsable",
    accessor: "etablissement_gestionnaire_enseigne",
    width: 200,
    editable: false,
  },
  {
    Header: "Siret Formateur",
    accessor: "etablissement_formateur_siret",
    width: 200,
    editorInput: "text",
  },
  {
    Header: "Uai formateur",
    accessor: "etablissement_formateur_uai",
    width: 200,
    editorInput: "text",
  },
  {
    Header: "Enseigne Formateur",
    accessor: "etablissement_formateur_enseigne",
    width: 200,
    editable: false,
  },
  {
    Header: "Raison sociale du siret formateur",
    accessor: "etablissement_gestionnaire_entreprise_raison_sociale",
    width: 200,
    editable: false,
  },
  {
    Header: "CFA ou OFA ? ",
    accessor: "etablissement_reference_type",
    width: 200,
    editable: false,
  },
  {
    Header: "CFA conventionne ? ",
    accessor: "etablissement_reference_conventionne",
    width: 200,
    editable: false,
  },
  {
    Header: "CFA declare en prefecture ? ",
    accessor: "etablissement_reference_declare_prefecture",
    width: 200,
    editable: false,
  },
  {
    Header: "Organisme certifie 2015 ? ",
    accessor: "etablissement_reference_datadock",
    width: 200,
    editable: false,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Source",
    accessor: "source",
    width: 200,
    editable: false,
  },
  {
    Header: "Diplome",
    accessor: "diplome",
    width: 200,
    editable: false,
    editableEmpty: true,
  },
  {
    Header: "Intitule long de la formation",
    accessor: "intitule_long",
    width: 200,
    editable: false,
  },
  {
    Header: "Intitule court de la formation",
    accessor: "intitule_court",
    width: 200,
    editable: false,
  },
  {
    Header: "Organisme Habilite (RNCP)",
    accessor: "rncp_etablissement_gestionnaire_habilite",
    width: 200,
    editable: false,
  },
  {
    Header: "Eligible apprentissage (RNCP)",
    accessor: "rncp_eligible_apprentissage",
    width: 200,
    editable: false,
  },
  {
    Header: "Codes RNCP",
    accessor: "rncp_code",
    width: 200,
    editable: false,
  },
  {
    Header: "Intitule du code RNCP",
    accessor: "rncp_intitule",
    width: 200,
    editable: false,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Codes ROME",
    accessor: "rome_codes",
    width: 200,
    editable: false,
  },
  {
    Header: "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)",
    accessor: "cfd",
    width: 400,
    editorInput: "text",
    editable: false,
    editableInvalid: true,
  },
  {
    Header: "Code MEF 10 caracteres",
    accessor: "mef_10_code",
    width: 400,
    editable: false,
  },
  {
    Header: "Liste MEF rattaches",
    accessor: "bcn_mefs_10",
    width: 200,
    editable: true,
    formatter: (value) => value.map((x) => x.mef10).join(","),
  },
  {
    Header: "Liste MEF Affelnet",
    accessor: "mefs_10",
    width: 200,
    editable: false,
    formatter: (value) => value.map((x) => x.mef10).join(","),
  },
  {
    Header: "Statut Affelnet",
    accessor: "affelnet_statut",
    width: 200,
    editable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Reference dans Affelnet",
    accessor: "affelnet_reference",
    debug: true,
    width: 200,
    editable: false,
  },
  {
    Header: "A charger dans Affelnet",
    accessor: "affelnet_a_charger",
    width: 200,
    debug: true,
    editable: false,
  },
  {
    Header: "Statut Parcoursup",
    accessor: "parcoursup_statut",
    width: 200,
    editable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Reference dans ParcourSup",
    accessor: "parcoursup_reference",
    width: 200,
    editable: false,
  },
  {
    Header: "A charger dans ParcourSup",
    accessor: "parcoursup_a_charger",
    width: 200,
    editable: false,
  },
  {
    Header: "Niveau de la formation",
    accessor: "niveau",
    width: 200,
    editable: false,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Periode",
    accessor: "periode",
    width: 200,
    editorInput: "textarea",
    editable: true,
  },
  {
    Header: "Capacite",
    accessor: "capacite",
    width: 200,
    editable: true,
  },
  {
    Header: "Duree",
    accessor: "duree",
    width: 200,
    editable: false,
  },
  {
    Header: "Annee",
    accessor: "annee",
    width: 200,
    editable: false,
  },
  {
    Header: "Uai formation",
    accessor: "uai_formation",
    width: 200,
    editable: true,
  },
  {
    Header: "Adresse formation",
    accessor: "lieu_formation_adresse",
    width: 200,
    editable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Code Postal",
    accessor: "code_postal",
    width: 200,
    editable: true,
  },
  {
    Header: "Ville",
    accessor: "localite",
    width: 200,
    editable: true,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Code Commune Insee",
    accessor: "code_commune_insee",
    width: 200,
    editable: false,
  },
  {
    Header: "Geolocalisation",
    accessor: "lieu_formation_geo_coordonnees",
    width: 200,
    editable: false,
  },
  {
    Header: "Numero Academie Siege",
    accessor: "etablissement_gestionnaire_num_academie",
    width: 200,
    editable: false,
  },
  {
    Header: "Nom Academie Siege",
    accessor: "etablissement_gestionnaire_nom_academie",
    width: 200,
    editable: false,
  },
  {
    Header: "Url ONISEP",
    accessor: "onisep_url",
    width: 300,
    editable: false,
  },
  {
    Header: "OPCOs",
    accessor: "opcos",
    width: 200,
    editable: false,
  },
  {
    Header: "Intitule du statut des OPCOs",
    accessor: "info_opcos_intitule",
    width: 200,
    editable: false,
    formatter: (value) => escapeDiacritics(value),
  },
  {
    Header: "Etablissement dans le catalogue eligible ? ",
    accessor: "etablissement_reference_catalogue_published",
    width: 200,
    editable: false,
  },
  // {
  //   Header: "Certificateurs",
  //   accessor: "rncp_details.certificateurs",
  //   width: 200,
  //   editable: false,
  //   formatter: (value) =>
  //     value
  //       ?.filter(({ certificateur, siret_certificateur }) => certificateur || siret_certificateur)
  //       .map(({ certificateur, siret_certificateur }) => `${certificateur} (siret: ${siret_certificateur ?? "n/a"})`)
  //       .join(", "),
  // },
  {
    Header: "Partenaires",
    accessor: "rncp_details.partenaires",
    width: 200,
    editable: false,
    formatter: (value, formation) => {
      const filteredPartenaires = (value ?? []).filter(({ Siret_Partenaire }) =>
        [formation.etablissement_gestionnaire_siret, formation.etablissement_formateur_siret].includes(Siret_Partenaire)
      );
      return filteredPartenaires
        ?.map(
          ({ Nom_Partenaire, Siret_Partenaire, Habilitation_Partenaire }) =>
            `${Nom_Partenaire} (siret: ${Siret_Partenaire ?? "n/a"}) : ${Habilitation_Partenaire}`
        )
        .join(", ");
    },
  },
  {
    Header: "Adresse OFA formateur",
    accessor: "etablissement_formateur_adresse",
    width: 200,
    editable: true,
  },
  {
    Header: "Code Postal OFA formateur",
    accessor: "etablissement_formateur_code_postal",
    width: 200,
    editable: true,
  },
  {
    Header: "Ville OFA formateur",
    accessor: "etablissement_formateur_localite",
    width: 200,
    editable: true,
  },
  {
    Header: "Code Commune Insee OFA formateur",
    accessor: "etablissement_formateur_code_commune_insee",
    width: 200,
    editable: false,
  },
  {
    Header: "Id Certif Info",
    accessor: "id_rco_formation",
    width: 200,
    formatter: (value) => value.split("|").pop(),
  },
];

const queryBuilderField = [
  { text: "Raison sociale", value: "etablissement_gestionnaire_entreprise_raison_sociale.keyword" },
  { text: "Siret formateur", value: "etablissement_formateur_siret.keyword" },
  { text: "Siret gestionnaire", value: "etablissement_gestionnaire_siret.keyword" },
  { text: "Type d'établissement", value: "etablissement_reference_type.keyword" },
  { text: "Conventionné", value: "etablissement_reference_conventionne.keyword" },
  { text: "Déclaré en prefecture", value: "etablissement_reference_declare_prefecture.keyword" },
  { text: "Référencé datadock", value: "etablissement_reference_datadock.keyword" },
  { text: "Uai du lieu de formation", value: "uai_formation.keyword" },
  { text: "Diplôme", value: "diplome.keyword" },
  { text: "Mef 10", value: "mef_10_code.keyword" },
  { text: "Intitulé", value: "intitule_court.keyword" },
  { text: "Code RNCP", value: "rncp_code.keyword" },
  { text: "Commune du lieu de formation", value: "localite.keyword" },
  // { text: "ParcourSup à charger", value: "parcoursup_a_charger" },
  // { text: "Affelnet à charger", value: "affelnet_a_charger" },
];

const facetDefinition = [
  {
    componentId: "nom_academie",
    dataField: "nom_academie.keyword",
    title: "Académie",
    filterLabel: "Académie",
    selectAllLabel: "Toutes les académies",
    sortBy: "asc",
  },
  {
    componentId: "parcoursup_statut",
    dataField: "parcoursup_statut.keyword",
    title: "Statut Parcoursup",
    filterLabel: "Statut Parcoursup",
    selectAllLabel: "Tous",
    sortBy: "count",
    roles: ["admin", "instructeur"],
    showCatalogEligibleOnly: true,
  },
  {
    componentId: "affelnet_statut",
    dataField: "affelnet_statut.keyword",
    title: "Statut Affelnet",
    filterLabel: "Statut Affelnet",
    selectAllLabel: "Tous",
    sortBy: "count",
    roles: ["admin", "instructeur"],
    showCatalogEligibleOnly: true,
  },
  {
    componentId: "num_departement",
    dataField: "num_departement.keyword",
    title: "Département",
    filterLabel: "Département",
    selectAllLabel: "Tous",
    sortBy: "asc",
  },

  {
    componentId: "cfd",
    dataField: "cfd.keyword",
    title: "Code diplôme",
    filterLabel: "Code diplôme",
    selectAllLabel: "Tous",
    sortBy: "asc",
  },

  {
    componentId: "niveau",
    dataField: "niveau.keyword",
    title: "Niveau de formation",
    filterLabel: "Niveau de formation",
    selectAllLabel: "Tous les niveaux",
    sortBy: "count",
  },

  {
    componentId: "rncp_code",
    dataField: "rncp_code.keyword",
    title: "Code RNCP",
    filterLabel: "Code RNCP",
    selectAllLabel: "Tous",
    sortBy: "count",
  },

  {
    componentId: "opcos",
    dataField: "opcos.keyword",
    title: "OPCOs",
    filterLabel: "OPCOs",
    selectAllLabel: "Tout OPCOs",
    sortBy: "asc",
  },
  {
    componentId: "info_opcos_intitule",
    dataField: "info_opcos_intitule.keyword",
    title: "Statut OPCOs",
    filterLabel: "Statut OPCOs",
    selectAllLabel: "Tous",
    sortBy: "count",
  },
];

const dataSearch = {
  dataField: [
    "etablissement_gestionnaire_entreprise_raison_sociale",
    "intitule_long",
    "uai_formation",
    "etablissement_gestionnaire_uai",
    "etablissement_formateur_uai",
    "etablissement_formateur_siret",
    "etablissement_gestionnaire_siret",
  ],
  placeholder: "Saisissez une raison sociale, un intitulé, un UAI, ou un numéro de Siret",
  fieldWeights: [4, 3, 2, 2, 2, 1, 1],
};

export default {
  FILTERS,
  columnsDefinition,
  facetDefinition,
  queryBuilderField,
  dataSearch,
};
