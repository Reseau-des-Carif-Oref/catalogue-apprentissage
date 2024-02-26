import { escapeDiacritics } from "../../utils/downloadUtils";
import helpText from "../../../locales/helpText.json";
import { CONTEXT } from "../../../constants/context";
import { departements } from "../../../constants/departements";
import { annees } from "../../../constants/annees";
import { sortDescending } from "../../utils/historyUtils";

const FILTERS = () => [
  "QUERYBUILDER",
  "SEARCH",
  "etablissement_formateur_siret",
  "etablissement_gestionnaire_siret",
  "num_academie",
  "niveau",
  "etablissement_gestionnaire_siren",
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
  "etablissement_reference_habilite_rncp",
  "rome_codes",
  "rncp_code",
  "bcn_mefs_10",
  "diplome",
  "tags",
  "annee",
  "etablissement_gestionnaire_actif",
  "qualite",
  "habilite",
  "duree",
  "periode_start",
  "periode_end",
  "region",
];

const mefsFormatter = (mefs) => {
  return mefs?.map((mef) => `${mef.mef10}`).join(", ") ?? "";
};

const booleanFormatter = (value) => {
  switch (value) {
    case true:
      return "OUI";
    case false:
      return "NON";
    default:
      return "";
  }
};

const mefsExpirationFormatter = (mefs) => {
  return (
    mefs
      ?.map((mef) =>
        mef.date_fermeture
          ? `expire le ${new Date(mef.date_fermeture).toLocaleDateString("fr-FR")}`
          : "pas de date d'expiration"
      )
      .join(", ") ?? ""
  );
};

/**
 * Colonnes inclues dans l'export CSV
 */
export const columnsDefinition = [
  /**
   * Identifiants offre
   */
  {
    Header: "Clé ministere educatif",
    accessor: "cle_ministere_educatif",
    width: 200,
    exportable: true,
  },
  {
    Header: "Fiche catalogue",
    accessor: "_id",
    width: 200,
    exportable: true,
    formatter: (value) => `${process.env.REACT_APP_BASE_URL}/formation/${value}`,
  },

  {
    Header: "Identifiant Carif formation",
    accessor: "id_formation",
    width: 200,
    exportable: true,
  },
  {
    Header: "Identifiant Carif action",
    accessor: "ids_action",
    width: 200,
    exportable: true,
  },
  {
    Header: "Identifiant Certifinfo",
    accessor: "id_certifinfo",
    width: 200,
    exportable: true,
  },

  /**
   * Organismes / localisation
   */
  {
    Header: "Responsable: n° académie",
    accessor: "etablissement_gestionnaire_num_academie",
    width: 200,
    exportable: true,
  },
  {
    Header: "Responsable: académie",
    accessor: "etablissement_gestionnaire_nom_academie",
    width: 200,
    exportable: true,
  },
  {
    Header: "Responsable: région",
    accessor: "etablissement_gestionnaire_region",
    width: 200,
    exportable: true,
  },
  {
    Header: "Responsable: Siret",
    accessor: "etablissement_gestionnaire_siret",
    width: 200,
    exportable: true,
    editorInput: "text",
  },
  {
    Header: "Responsable: UAI",
    accessor: "etablissement_gestionnaire_uai",
    width: 200,
    exportable: true,
  },
  {
    Header: "Responsable: raison sociale",
    accessor: "etablissement_gestionnaire_entreprise_raison_sociale",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Responsable: enseigne",
    accessor: "etablissement_gestionnaire_enseigne",
    width: 200,
    exportable: true,
  },

  {
    Header: "Formateur: n° académie",
    accessor: "etablissement_formateur_num_academie",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formateur: académie",
    accessor: "etablissement_formateur_nom_academie",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formateur: région",
    accessor: "etablissement_formateur_region",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formateur: Siret",
    accessor: "etablissement_formateur_siret",
    width: 200,
    exportable: true,
    editorInput: "text",
  },
  {
    Header: "Formateur: UAI",
    accessor: "etablissement_formateur_uai",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formateur: raison sociale",
    accessor: "etablissement_formateur_entreprise_raison_sociale",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Formateur: enseigne",
    accessor: "etablissement_formateur_enseigne",
    width: 200,
    exportable: true,
  },

  {
    Header: "Formateur: adresse",
    accessor: "etablissement_formateur_adresse",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formateur: code postal",
    accessor: "etablissement_formateur_code_postal",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formateur: ville",
    accessor: "etablissement_formateur_localite",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formateur: code commune",
    accessor: "etablissement_formateur_code_commune_insee",
    width: 200,
    exportable: true,
  },

  {
    Header: "Lieu: n° académie",
    accessor: "num_academie",
    width: 200,
    exportable: true,
  },
  {
    Header: "Lieu: académie",
    accessor: "nom_academie",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Lieu: région",
    accessor: "region",
    width: 200,
    exportable: true,
  },
  {
    Header: "Lieu: UAI",
    accessor: "uai_formation",
    width: 200,
    exportable: true,
  },
  {
    Header: "Lieu: UAI édité ?",
    accessor: "editedFields.uai_formation",
    width: 200,
    exportable: true,
    formatter: (value) => (value ? "Oui" : "Non"),
  },
  {
    Header: "Lieu: UAI date d'édition",
    accessor: "updates_history",
    width: 200,
    exportable: true,
    formatter: (value) => {
      const uai_updated_history = value?.filter((value) => !!value.to?.uai_formation)?.sort(sortDescending);

      return uai_updated_history?.length
        ? new Date(uai_updated_history[0]?.updated_at).toLocaleDateString("fr-FR")
        : "";
    },
  },
  {
    Header: "Lieu: UAI édité par",
    accessor: "updates_history",
    width: 200,
    exportable: true,
    formatter: (value) => {
      const uai_updated_history = value?.filter((value) => !!value.to?.uai_formation)?.sort(sortDescending);

      return uai_updated_history?.length ? uai_updated_history[0]?.to.last_update_who : "";
    },
  },

  {
    Header: "Lieu: adresse",
    accessor: "lieu_formation_adresse",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Lieu: code postal",
    accessor: "code_postal",
    width: 200,
    exportable: true,
  },
  {
    Header: "Lieu: ville",
    accessor: "localite",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Lieu: code commune",
    accessor: "code_commune_insee",
    width: 200,
    exportable: true,
  },
  {
    Header: "Lieu: géolocalisation",
    accessor: "lieu_formation_geo_coordonnees",
    width: 200,
    exportable: true,
  },

  {
    Header: "Lieu: Distance entre lieu et formateur",
    accessor: "distance_lieu_formation_etablissement_formateur",
    width: 200,
    exportable: true,
  },

  /**
   * Formation
   */
  {
    Header: "Formation: type certification BCN",
    accessor: "diplome",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formation: type certification RNCP",
    accessor: "rncp_details",
    width: 200,
    exportable: true,
    formatter: (value) => escapeDiacritics(value?.type_certif),
  },
  {
    Header: "Formation: code type certification RNCP",
    accessor: "rncp_details",
    width: 200,
    exportable: true,
    formatter: (value) => escapeDiacritics(value?.code_type_certif),
  },
  {
    Header: "Formation: libellé long BCN",
    accessor: "intitule_long",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formation: libellé RNCP",
    accessor: "rncp_intitule",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Formation: libellé Carif-Oref",
    accessor: "intitule_rco",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formation: type d'enregistrement (certifinfo)",
    accessor: "CI_inscrit_rncp",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },

  {
    Header: "Formation: type d'enregistrement (France compétences)",
    accessor: "rncp_details",
    width: 200,
    exportable: true,
    formatter: (value) => escapeDiacritics(value?.type_enregistrement),
  },
  {
    Header: "Formation: contrôle d'expiration sur le code",
    accessor: "rncp_details",
    width: 200,
    exportable: true,
    formatter: (value) => {
      switch (value?.type_enregistrement) {
        case "Enregistrement de droit":
          return "CFD";
        case "Enregistrement sur demande":
          return "RNCP";
        default:
          return "";
      }
    },
  },
  {
    Header: "Formation: code RNCP",
    accessor: "rncp_code",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formation: code RNCP expiration",
    accessor: "rncp_details",
    width: 200,
    exportable: true,
    formatter: (value) =>
      value?.date_fin_validite_enregistrement
        ? new Date(value.date_fin_validite_enregistrement).toLocaleDateString("fr-FR")
        : "",
  },

  {
    Header: "Formation: code CFD",
    accessor: "cfd",
    width: 400,
    exportable: true,
  },
  {
    Header: "Formation: code CFD expiration",
    accessor: "cfd_date_fermeture",
    width: 200,
    exportable: true,
    formatter: (value) => (value ? new Date(value).toLocaleDateString("fr-FR") : ""),
  },
  {
    Header: "Formation: code CFD de l'année d'entrée",
    accessor: "cfd_entree",
    width: 400,
    exportable: true,
  },
  {
    Header: "Formation: code CFD de l'année d'entrée expiration",
    accessor: "cfd_entree_date_fermeture",
    width: 200,
    exportable: true,
    formatter: (value) => (value ? new Date(value).toLocaleDateString("fr-FR") : ""),
  },
  {
    Header: "Formation: codes MEF",
    accessor: "bcn_mefs_10",
    width: 200,
    exportable: true,
    formatter: mefsFormatter,
  },
  {
    Header: "Formation: codes MEF expirations",
    accessor: "bcn_mefs_10",
    width: 200,
    exportable: true,
    formatter: mefsExpirationFormatter,
  },

  {
    Header: "Formation: niveau BCN",
    accessor: "niveau",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Formation: durée collectée",
    accessor: "duree",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formation: année d'entrée en apprentissage collectée",
    accessor: "annee",
    width: 200,
    exportable: true,
  },
  {
    Header: "Formation: URL Onisep",
    accessor: "onisep_url",
    width: 300,
    exportable: true,
  },

  /**
   * Offres / paramètres réglementaires
   */
  {
    Header: "Paramètre réglementaire: Offre réglementaire ?",
    accessor: "catalogue_published",
    width: 200,
    exportable: true,
  },
  {
    Header: "Paramètre réglementaire: certifié qualité ?",
    accessor: "etablissement_gestionnaire_certifie_qualite",
    width: 200,
    exportable: true,
    formatter: booleanFormatter,
  },
  {
    Header: "Paramètre réglementaire: Formateur certifié qualité ?",
    accessor: "etablissement_formateur_certifie_qualite",
    width: 200,
    exportable: true,
    formatter: booleanFormatter,
  },

  {
    Header: "Paramètre réglementaire: Organisme habilité pour ce RNCP ?",
    accessor: "etablissement_reference_habilite_rncp",
    width: 200,
    exportable: true,
    formatter: booleanFormatter,
  },
  {
    Header: "Paramètre réglementaire: Siret formateur et responsable actif ?",
    accessor: "siret_actif",
    width: 200,
    exportable: true,
  },
  {
    Header: "Paramètre réglementaire: Siret responsable actif",
    accessor: "etablissement_gestionnaire_actif",
    width: 200,
    exportable: true,
  },
  {
    Header: "Paramètre réglementaire: Siret formateur actif",
    accessor: "etablissement_formateur_actif",
    width: 200,
    exportable: true,
  },
  {
    Header: "Paramètre réglementaire: Formation état fiche RNCP",
    accessor: "rncp_details",
    width: 200,
    exportable: true,
    formatter: (value) => escapeDiacritics(value?.active_inactive),
  },

  /**
   * Offre détail
   */

  {
    Header: "Offre: Nouvelle fiche",
    accessor: "nouvelle_fiche",
    width: 200,
    exportable: true,
    formatter: booleanFormatter,
  },

  {
    Header: "Offre: Dates de formation",
    accessor: "date_debut",
    width: 200,
    exportable: true,
    formatter: (date_debut, formation) => {
      const dates = formation.date_debut
        ?.map((date_debut, index) => ({
          date_debut,
          date_fin: formation.date_fin ? formation.date_fin[index] : null,
          modalites_entrees_sorties: formation.modalites_entrees_sorties
            ? formation.modalites_entrees_sorties[index]
            : null,
        }))
        .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));

      return dates
        ?.map(
          ({ date_debut, date_fin, modalites_entrees_sorties }) =>
            `Du ${new Date(date_debut).toLocaleDateString("fr-FR")} au ${new Date(date_fin).toLocaleDateString(
              "fr-FR"
            )}${modalites_entrees_sorties ? " en entrée-sortie permanente." : "."}`
        )
        ?.join(" ");
    },
  },
  {
    Header: "Offre: Tags",
    accessor: "tags",
    width: 200,
    exportable: true,
    formatter: (tags) => tags?.sort((a, b) => a - b),
  },
  {
    Header: "Offre: Capacite",
    accessor: "capacite",
    width: 200,
    exportable: true,
  },

  {
    Header: "Offre: Remplace la clé ME",
    accessor: "cle_me_remplace",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
  {
    Header: "Offre: Est remplacée par la clé ME",
    accessor: "cle_me_remplace_par",
    width: 200,
    exportable: true,
    formatter: escapeDiacritics,
  },
];

const queryBuilderField = [
  { text: "Raison sociale", value: "etablissement_gestionnaire_entreprise_raison_sociale.keyword" },
  { text: "Siret formateur", value: "etablissement_formateur_siret.keyword" },
  { text: "Siret gestionnaire", value: "etablissement_gestionnaire_siret.keyword" },
  { text: "Uai du lieu de formation", value: "uai_formation.keyword" },
  { text: "Diplôme", value: "diplome.keyword" },
  { text: "Intitulé", value: "intitule_court.keyword" },
  { text: "Code RNCP", value: "rncp_code.keyword" },
  { text: "Code diplôme", value: "cfd.keyword" },
  { text: "Commune du lieu de formation", value: "localite.keyword" },
  { text: "Identifiant Formation CO", value: "id_formation.keyword" },
  { text: "Identifiants Action CO", value: "ids_action.keyword" },
  { text: "Identifiant Certif Info", value: "id_certifinfo.keyword" },
  { text: "Nda gestionnaire", value: "etablissement_gestionnaire_nda.keyword" },
  { text: "Nda formateur", value: "etablissement_formateur_nda.keyword" },
  { text: "Libelle court", value: "libelle_court.keyword" },
  { text: "Niveau formation diplome", value: "niveau_formation_diplome.keyword" },
  { text: "MEF 10", value: "bcn_mefs_10.mef10.keyword" },
  { text: "Groupe Spécialité", value: "rncp_details.nsf_code.keyword" },
  { text: "Certificateur", value: "rncp_details.certificateurs.certificateur.keyword" },
  { text: "Statut du SIRET", value: "etablissement_gestionnaire_actif.keyword" },
  { text: "Région", value: "region.keyword" },
];

const facetDefinition = () => [
  {
    componentId: `region`,
    dataField: "region.keyword",
    title: "Région",
    filterLabel: "Région",
    selectAllLabel: "Toutes les régions",
    sortBy: "asc",
  },c
  {
    componentId: `num_departement`,
    dataField: "num_departement.keyword",
    title: "Département",
    filterLabel: "Département",
    selectAllLabel: "Tous",
    sortBy: "asc",
    size: 150,
    transformData: (data) => data.map((d) => ({ ...d, key: `${d.key} - ${departements[d.key]}` })),
    customQuery: (values) => ({
      query: values?.length && {
        terms: {
          "num_departement.keyword": values?.map((value) =>
            typeof value === "string" ? value?.split(" - ")[0] : value
          ),
        },
      },
    }),
  },
  {
    componentId: `niveau`,
    dataField: "niveau.keyword",
    title: "Niveau visé",
    filterLabel: "Niveau visé",
    selectAllLabel: "Tous les niveaux",
    sortBy: "asc",
  },
  {
    componentId: `tags`,
    dataField: "tags.keyword",
    title: "Début de formation (année)",
    filterLabel: "Début de formation (année)",
    selectAllLabel: "Toutes",
    sortBy: "asc",
  },
  {
    componentId: `etablissement_gestionnaire_actif`,
    dataField: "etablissement_gestionnaire_actif.keyword",
    title: "Statut du SIRET",
    filterLabel: "Statut du SIRET",
    displayInContext: [CONTEXT.CATALOGUE_NON_ELIGIBLE],
    selectAllLabel: "Tous les statuts",
    sortBy: "asc",
  },
  {
    componentId: `annee`,
    dataField: "annee.keyword",
    title: "Année d'entrée en apprentissage",
    filterLabel: "Année d'entrée en apprentissage",
    selectAllLabel: "Toutes",
    sortBy: "asc",
    isAuth: true, // hide for anonymous
    transformData: (data) => data.map((d) => ({ ...d, key: annees[d.key] })),
    customQuery: (values) => ({
      query: values?.length && {
        terms: {
          "annee.keyword": values?.map((value) => Object.keys(annees).find((annee) => annees[annee] === value)),
        },
      },
    }),
  },
  {
    componentId: `duree`,
    dataField: "duree.keyword",
    title: "Durée de la formation",
    filterLabel: "Durée de la formation",
    selectAllLabel: "Toutes",
    sortBy: "asc",
    isAuth: true, // hide for anonymous
    transformData: (data) => data.map((d) => ({ ...d, key: d.key <= 1 ? `${d.key} an` : `${d.key} ans` })),
    customQuery: (values) => ({
      query: values?.length && {
        terms: {
          "duree.keyword": values?.map((value) => (typeof value === "string" ? value?.split(" ")[0] : value)),
        },
      },
    }),
  },
  {
    componentId: `qualite`,
    dataField: "etablissement_gestionnaire_certifie_qualite",
    title: "Certifié Qualité",
    filterLabel: "Certifié Qualité",
    sortBy: "desc",
    helpTextSection: helpText.search.qualite,
    showSearch: false,
    displayInContext: [CONTEXT.CATALOGUE_NON_ELIGIBLE],
    transformData: (data) => data.map((d) => ({ ...d, key: d.key ? "Oui" : "Non" })),
    customQuery: (values) => {
      if (values.length === 1) {
        return {
          query: {
            match: {
              etablissement_gestionnaire_certifie_qualite: values[0] === "Oui",
            },
          },
        };
      }
      return {};
    },
  },
  {
    componentId: `habilite`,
    dataField: "etablissement_reference_habilite_rncp",
    title: "Habilité RNCP",
    filterLabel: "Habilité RNCP",
    sortBy: "desc",
    showSearch: false,
    displayInContext: [CONTEXT.CATALOGUE_NON_ELIGIBLE],
    transformData: (data) => data.map((d) => ({ ...d, key: d.key ? "Oui" : "Non" })),
    customQuery: (values) => {
      if (values.length === 1) {
        return {
          query: {
            match: {
              etablissement_reference_habilite_rncp: values[0] === "Oui",
            },
          },
        };
      }
      return {};
    },
  },
];

const dataSearch = {
  dataField: [
    "etablissement_gestionnaire_entreprise_raison_sociale",
    "intitule_long",
    "cfd",
    "rncp_code",
    "uai_formation",
    "etablissement_gestionnaire_uai",
    "etablissement_formateur_uai",
    "etablissement_formateur_siret",
    "etablissement_gestionnaire_siret",
    "cle_ministere_educatif",
  ],
  placeholder:
    "Saisissez une raison sociale, un Siret, un intitulé de formation, un code RNCP ou CFD (code formation diplôme)",
  fieldWeights: [4, 3, 2, 2, 2, 2, 2, 1, 1, 1],
};

export default {
  FILTERS,
  columnsDefinition,
  facetDefinition,
  queryBuilderField,
  dataSearch,
};
