const FILTERS = [
  "QUERYBUILDER",
  "SEARCH",
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
  //"opcos",
  //"info_opcos_intitule",
];

const columnsDefinition = [
  {
    Header: "Numéro académie",
    accessor: "num_academie",
    width: 200,
    editorInput: "text",
    editable: true,
  },
  {
    Header: "Nom académie",
    accessor: "nom_academie",
    width: 200,
    editable: false,
  },
  {
    Header: "Numéro département",
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
    Header: "CFA conventionné ? ",
    accessor: "etablissement_reference_conventionne",
    width: 200,
    editable: false,
  },
  {
    Header: "CFA déclaré en préfecture ? ",
    accessor: "etablissement_reference_declare_prefecture",
    width: 200,
    editable: false,
  },
  {
    Header: "Organisme certifié 2015 ? ",
    accessor: "etablissement_reference_datadock",
    width: 200,
    editable: false,
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
    Header: "Intitulé long de la formation",
    accessor: "intitule_long",
    width: 200,
    editable: false,
  },
  {
    Header: "Intitulé court de la formation",
    accessor: "intitule_court",
    width: 200,
    editable: false,
  },
  {
    Header: "Organisme Habilité (RNCP)",
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
    Header: "Intitulé du code RNCP",
    accessor: "rncp_intitule",
    width: 200,
    editable: false,
  },
  {
    Header: "Codes ROME",
    accessor: "rome_codes",
    width: 200,
    editable: false,
  },
  {
    Header: "Code du diplôme ou du titre suivant la nomenclature de l'Education nationale (CodeEN)",
    accessor: "cfd",
    width: 400,
    editorInput: "text",
    editable: false,
    editableInvalid: true,
  },
  {
    Header: "Code MEF 10 caractères",
    accessor: "mef_10_code",
    width: 400,
    editable: false,
  },
  // {
  //   Header: "Référencé dans Affelnet",
  //   accessor: "affelnet_reference",
  //   debug: true,
  //   width: 200,
  //   editable: false,
  // },
  // {
  //   Header: "À charger dans Affelnet",
  //   accessor: "affelnet_a_charger",
  //   width: 200,
  //   debug: true,
  //   editable: false,
  // },
  // {
  //   Header: "Référencé dans ParcourSup",
  //   accessor: "parcoursup_reference",
  //   width: 200,
  //   editable: false,
  // },
  // {
  //   Header: "À charger dans ParcourSup",
  //   accessor: "parcoursup_a_charger",
  //   width: 200,
  //   editable: false,
  // },
  {
    Header: "Niveau de la formation",
    accessor: "niveau",
    width: 200,
    editable: false,
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
    Header: "CodePostal",
    accessor: "code_postal",
    width: 200,
    editable: true,
  },
  {
    Header: "CodeCommuneInsee",
    accessor: "code_commune_insee",
    width: 200,
    editable: false,
  },
  {
    Header: "NumAcademie Siege",
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
    Header: "Intitulé du statut des OPCOs",
    accessor: "info_opcos_intitule",
    width: 200,
    editable: false,
  },
  {
    Header: "ParcourSup statut",
    accessor: "parcoursup_statut",
    width: 200,
    editable: false,
  },
  {
    Header: "Affelnet statut",
    accessor: "affelnet_statut",
    width: 200,
    editable: false,
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
  //{ text: "ParcourSup à charger", value: "parcoursup_a_charger" },
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
  },
  {
    componentId: "affelnet_statut",
    dataField: "affelnet_statut.keyword",
    title: "Statut Affelnet",
    filterLabel: "Statut Affelnet",
    selectAllLabel: "Tous",
    sortBy: "asc",
    roles: ["admin", "instructeur"],
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
