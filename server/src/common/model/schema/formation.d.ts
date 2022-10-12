/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the Mongoose schema file,
 * To regenerate this file run $> yarn doc
 */
const { Types } = require("mongoose");

export interface Formation {
  /**
   * Clé unique de la formation (pour envoi aux ministères éducatifs)
   */
  cle_ministere_educatif?: string;
  /**
   * Code formation diplôme (education nationale)
   */
  cfd?: string;
  /**
   * Lettre spécialité du code cfd
   */
  cfd_specialite?: {
    [k: string]: unknown;
  };
  /**
   * BCN : cfd périmé (fermeture avant le 31 août de l'année courante)
   */
  cfd_outdated?: boolean;
  /**
   * Date de fermeture du cfd
   */
  cfd_date_fermeture?: Date;
  /**
   * Code formation diplôme d'entrée (année 1 de l'apprentissage)
   */
  cfd_entree?: string;
  /**
   * Tableau de Code MEF 10 caractères et modalités (filtrés pour Affelnet si applicable)
   */
  affelnet_mefs_10?: ItemOfAffelnetMefs_10[];
  /**
   * Tableau de Code MEF 10 caractères et modalités (filtrés pour Parcoursup si applicable)
   */
  parcoursup_mefs_10?: ItemOfParcoursupMefs_10[];
  /**
   * Nom de l'académie
   */
  nom_academie?: string;
  /**
   * Numéro de l'académie
   */
  num_academie?: string;
  /**
   * Code postal
   */
  code_postal?: string;
  /**
   * Code commune INSEE
   */
  code_commune_insee?: string;
  /**
   * Numéro de département
   */
  num_departement?: string;
  /**
   * Nom du département
   */
  nom_departement?: string;
  /**
   * Numéro de département
   */
  region?: string;
  /**
   * Localité
   */
  localite?: string;
  /**
   * UAI du lieu de la formation
   */
  uai_formation?: string;
  /**
   * L'UAI du lieu de formation est il valide ?
   */
  uai_formation_valide?: boolean | null;
  /**
   * Nom de la formation déclaratif
   */
  nom?: string;
  /**
   * Intitulé comme transmis par RCO
   */
  intitule_rco?: string;
  /**
   * Intitulé long de la formation normalisé BCN
   */
  intitule_long?: string;
  /**
   * Intitulé court de la formation normalisé BCN
   */
  intitule_court?: string;
  /**
   * Diplôme ou titre visé
   */
  diplome?: string;
  /**
   * Niveau de la formation
   */
  niveau?: string;
  /**
   * Url de redirection vers le site de l'ONISEP
   */
  onisep_url?: string;
  /**
   * Intitulé éditorial l'ONISEP
   */
  onisep_intitule?: string;
  /**
   * Libellé poursuite étude l'ONISEP (séparateur ;)
   */
  onisep_libelle_poursuite?: string;
  /**
   * Lien vers site de l'ONISEP api
   */
  onisep_lien_site_onisepfr?: string;
  /**
   * Disciplines ONISEP (séparateur ;)
   */
  onisep_discipline?: string;
  /**
   * Domaine et sous domaine ONISEP (séparateur ;)
   */
  onisep_domaine_sousdomaine?: string;
  /**
   * Code RNCP
   */
  rncp_code?: string;
  /**
   * Intitulé du code RNCP
   */
  rncp_intitule?: string;
  /**
   * Le titre RNCP est éligible en apprentissage
   */
  rncp_eligible_apprentissage?: boolean;
  rncp_details?: RncpDetails;
  /**
   * Codes ROME
   */
  rome_codes?: string[];
  /**
   * Périodes de début de la formation
   */
  periode?: Date[];
  /**
   * Capacité d'accueil
   */
  capacite?: string;
  /**
   * Durée de la formation en années
   */
  duree?: string;
  /**
   * Durée incohérente avec les codes mefs
   */
  duree_incoherente?: boolean | null;
  /**
   * Année de la formation (cursus)
   */
  annee?: string;
  /**
   * Année incohérente avec les codes mefs
   */
  annee_incoherente?: boolean | null;
  /**
   * Dans le périmètre parcoursup
   */
  parcoursup_perimetre?: boolean;
  /**
   * Statut parcoursup
   */
  parcoursup_statut?:
    | "hors périmètre"
    | "publié"
    | "non publié"
    | "à publier (sous condition habilitation)"
    | "à publier (vérifier accès direct postbac)"
    | "à publier (soumis à validation Recteur)"
    | "à publier"
    | "en attente de publication"
    | "rejet de publication";
  /**
   * Parcoursup : historique des statuts
   */
  parcoursup_statut_history?: unknown[];
  /**
   * Erreur lors de la création de la formation sur ParcourSup (via le WS)
   */
  parcoursup_error?: string;
  rejection?: Rejection;
  /**
   * identifiant Parcoursup de la formation (g_ta_cod)
   */
  parcoursup_id?: string;
  /**
   * Date de publication (passage au statut "publié")
   */
  parcoursup_published_date?: Date;
  /**
   * Dans le périmètre affelnet
   */
  affelnet_perimetre?: boolean;
  /**
   * Statut affelnet
   */
  affelnet_statut?:
    | "hors périmètre"
    | "publié"
    | "non publié"
    | "à publier (soumis à validation)"
    | "à publier"
    | "en attente de publication";
  /**
   * Affelnet : historique des statuts
   */
  affelnet_statut_history?: unknown[];
  /**
   * Date de publication (passage au statut "publié")
   */
  affelnet_published_date?: Date;
  /**
   * Date de dernière modification du statut Affelnet ou Parcoursup
   */
  last_statut_update_date?: Date;
  /**
   * Est publiée, la formation est éligible pour le catalogue
   */
  published?: boolean;
  /**
   * La publication vers les plateformes est forcée (contournement catalogue non-éligible dans certains cas)
   */
  forced_published?: boolean;
  /**
   * Date d'ajout en base de données
   */
  created_at?: Date;
  /**
   * Historique des mises à jours
   */
  updates_history?: unknown[];
  /**
   * Date de dernières mise à jour
   */
  last_update_at?: Date;
  /**
   * Qui a réalisé la dernière modification
   */
  last_update_who?: string;
  /**
   * Latitude et longitude de l'établissement recherchable dans Idea
   */
  idea_geo_coordonnees_etablissement?: string;
  /**
   * Latitude et longitude du lieu de formation
   */
  lieu_formation_geo_coordonnees?: string;
  /**
   * Latitude et longitude du lieu de formation déduit de l'adresse du flux RCO
   */
  lieu_formation_geo_coordonnees_computed?: string;
  /**
   * Distance entre les coordonnées transmises et déduites à partir de l'adresse
   */
  distance?: number | null;
  /**
   * Adresse du lieu de formation
   */
  lieu_formation_adresse?: string;
  /**
   * Adresse du lieu de formation déduit de la géolocalisation du flux RCO
   */
  lieu_formation_adresse_computed?: string;
  /**
   * Siret du lieu de formation
   */
  lieu_formation_siret?: string;
  /**
   * **[DEPRECATED]** Id de formation RCO (id_formation + id_action + id_certifinfo)
   */
  id_rco_formation?: string;
  /**
   * Identifiant de la formation
   */
  id_formation?: string;
  /**
   * Identifiant des actions concaténés
   */
  id_action?: string;
  /**
   * Identifiant des actions concaténés
   */
  ids_action?: string[];
  /**
   * Identifiant certifInfo (unicité de la certification)
   */
  id_certifinfo?: string;
  /**
   * Tableau de tags (2020, 2021, etc.)
   */
  tags?: string[];
  /**
   * BCN : libelle court fusion table n_formation_diplome ou v_formation_diplome
   */
  libelle_court?: string;
  /**
   * BCN : niveau formation diplôme
   */
  niveau_formation_diplome?: string;
  /**
   * Affelnet : Informations offre de formation
   */
  affelnet_infos_offre?: string;
  /**
   * Affelnet : code nature de l'établissement de formation
   */
  affelnet_code_nature?: string;
  /**
   * Affelnet : type d'établissement (PR: Privé / PU: Public)
   */
  affelnet_secteur?: "PR" | "PU" | null;
  /**
   * Affelnet : raison de dépublication
   */
  affelnet_raison_depublication?: string;
  /**
   * BCN : Codes MEF 10 caractères
   */
  bcn_mefs_10?: ItemOfBcnMefs_10[];
  /**
   * Champs édités par un utilisateur
   */
  editedFields?: {
    [k: string]: unknown;
  };
  /**
   * Parcoursup : raison de dépublication
   */
  parcoursup_raison_depublication?: string;
  /**
   * distance entre le Lieu de formation et l'établissement formateur
   */
  distance_lieu_formation_etablissement_formateur?: number | null;
  /**
   * Niveau d'entrée de l'apprenti minimum obligatoire pour cette formation
   */
  niveau_entree_obligatoire?: number | null;
  /**
   * Renseigné si la formation peut être suivie entièrement à distance
   */
  entierement_a_distance?: boolean;
  france_competence_infos?: FranceCompetenceInfos;
  /**
   * Formation éligible au catalogue générale
   */
  catalogue_published?: boolean;
  /**
   * Identifiant établissement gestionnaire
   */
  etablissement_gestionnaire_id?: string;
  /**
   * Numéro siret gestionnaire
   */
  etablissement_gestionnaire_siret?: string;
  /**
   * Enseigne établissement gestionnaire
   */
  etablissement_gestionnaire_enseigne?: string;
  /**
   * UAI de l'etablissement gestionnaire
   */
  etablissement_gestionnaire_uai?: string;
  /**
   * Etablissement gestionnaire est publié
   */
  etablissement_gestionnaire_published?: boolean;
  /**
   * Etablissement gestionnaire est habilité RNCP ou pas
   */
  etablissement_gestionnaire_habilite_rncp?: boolean;
  /**
   * Etablissement gestionnaire est certifié Qualité
   */
  etablissement_gestionnaire_certifie_qualite?: boolean;
  /**
   * Numéro et rue établissement gestionnaire
   */
  etablissement_gestionnaire_adresse?: string;
  /**
   * Code postal établissement gestionnaire
   */
  etablissement_gestionnaire_code_postal?: string;
  /**
   * Code commune insee établissement gestionnaire
   */
  etablissement_gestionnaire_code_commune_insee?: string;
  /**
   * Localité établissement gestionnaire
   */
  etablissement_gestionnaire_localite?: string;
  /**
   * Complément d'adresse de l'établissement gestionnaire
   */
  etablissement_gestionnaire_complement_adresse?: string;
  /**
   * Cedex
   */
  etablissement_gestionnaire_cedex?: string;
  /**
   * Raison sociale établissement gestionnaire
   */
  etablissement_gestionnaire_entreprise_raison_sociale?: string;
  /**
   * Latitude et longitude de l'établissement gestionnaire
   */
  geo_coordonnees_etablissement_gestionnaire?: string;
  /**
   * région gestionnaire
   */
  etablissement_gestionnaire_region?: string;
  /**
   * Numéro de departement gestionnaire
   */
  etablissement_gestionnaire_num_departement?: string;
  /**
   * Nom du departement gestionnaire
   */
  etablissement_gestionnaire_nom_departement?: string;
  /**
   * Nom de l'académie gestionnaire
   */
  etablissement_gestionnaire_nom_academie?: string;
  /**
   * Numéro de l'académie gestionnaire
   */
  etablissement_gestionnaire_num_academie?: string;
  /**
   * Numéro siren gestionnaire
   */
  etablissement_gestionnaire_siren?: string;
  /**
   * Numéro Déclaration gestionnaire
   */
  etablissement_gestionnaire_nda?: string;
  /**
   * Date de création de l'établissement
   */
  etablissement_gestionnaire_date_creation?: Date;
  /**
   * Identifiant établissement formateur
   */
  etablissement_formateur_id?: string;
  /**
   * Numéro siret formateur
   */
  etablissement_formateur_siret?: string;
  /**
   * Enseigne établissement formateur
   */
  etablissement_formateur_enseigne?: string;
  /**
   * UAI de l'etablissement formateur
   */
  etablissement_formateur_uai?: string;
  /**
   * Etablissement formateur est publié
   */
  etablissement_formateur_published?: boolean;
  /**
   * Etablissement formateur est habilité RNCP ou pas
   */
  etablissement_formateur_habilite_rncp?: boolean;
  /**
   * Etablissement formateur est certifié Qualité
   */
  etablissement_formateur_certifie_qualite?: boolean;
  /**
   * Numéro et rue établissement formateur
   */
  etablissement_formateur_adresse?: string;
  /**
   * Code postal établissement formateur
   */
  etablissement_formateur_code_postal?: string;
  /**
   * Code commune insee établissement formateur
   */
  etablissement_formateur_code_commune_insee?: string;
  /**
   * Localité établissement formateur
   */
  etablissement_formateur_localite?: string;
  /**
   * Complément d'adresse de l'établissement
   */
  etablissement_formateur_complement_adresse?: string;
  /**
   * Cedex
   */
  etablissement_formateur_cedex?: string;
  /**
   * Raison sociale établissement formateur
   */
  etablissement_formateur_entreprise_raison_sociale?: string;
  /**
   * Latitude et longitude de l'établissement formateur
   */
  geo_coordonnees_etablissement_formateur?: string;
  /**
   * région formateur
   */
  etablissement_formateur_region?: string;
  /**
   * Numéro de departement formateur
   */
  etablissement_formateur_num_departement?: string;
  /**
   * Nom du departement formateur
   */
  etablissement_formateur_nom_departement?: string;
  /**
   * Nom de l'académie formateur
   */
  etablissement_formateur_nom_academie?: string;
  /**
   * Numéro de l'académie formateur
   */
  etablissement_formateur_num_academie?: string;
  /**
   * Numéro siren formateur
   */
  etablissement_formateur_siren?: string;
  /**
   * Numéro Déclaration formateur
   */
  etablissement_formateur_nda?: string;
  /**
   * Date de création de l'établissement
   */
  etablissement_formateur_date_creation?: Date;
  /**
   * Etablissement reference est soit formateur soit le gestionnaire
   */
  etablissement_reference?: string;
  /**
   * Etablissement reference est publié
   */
  etablissement_reference_published?: boolean;
  /**
   * Etablissement reference est habilité RNCP ou pas
   */
  etablissement_reference_habilite_rncp?: boolean;
  /**
   * Etablissement reference est certifié Qualité
   */
  etablissement_reference_certifie_qualite?: boolean;
  /**
   * Date de création de l'établissement
   */
  etablissement_reference_date_creation?: Date;
  _id?: Types.ObjectId;
}
export interface ItemOfAffelnetMefs_10 {
  mef10?: string;
  modalite?: Modalite;
}
export interface Modalite {
  duree?: string;
  annee?: string;
}
export interface ItemOfParcoursupMefs_10 {
  mef10?: string;
  modalite?: Modalite1;
}
export interface Modalite1 {
  duree?: string;
  annee?: string;
}
/**
 * Détails RNCP (bloc de compétences etc..)
 */
export interface RncpDetails {
  /**
   * Date de validité de la fiche
   */
  date_fin_validite_enregistrement?: Date;
  /**
   * fiche active ou non
   */
  active_inactive?: string | null;
  /**
   * état fiche ex: Publiée
   */
  etat_fiche_rncp?: string | null;
  /**
   * Niveau européen ex: niveauu5
   */
  niveau_europe?: string | null;
  /**
   * Code type de certification (ex: DE)
   */
  code_type_certif?: string | null;
  /**
   * Type de certification (ex: diplôme d'état)
   */
  type_certif?: string | null;
  /**
   * Code rncp de l'ancienne fiche
   */
  ancienne_fiche?: string[] | null;
  /**
   * Code rncp de la nouvelle fiche
   */
  nouvelle_fiche?: string[] | null;
  /**
   * Demande en cours de d'habilitation
   */
  demande?: number;
  /**
   * Certificateurs
   */
  certificateurs?: unknown[];
  /**
   * Code NSF
   */
  nsf_code?: string | null;
  /**
   * Libellé NSF
   */
  nsf_libelle?: string | null;
  /**
   * Romes
   */
  romes?: unknown[];
  /**
   * Blocs de compétences
   */
  blocs_competences?: unknown[];
  /**
   * Voix d'accès
   */
  voix_acces?: unknown[];
  /**
   * Partenaires
   */
  partenaires?: unknown[];
  /**
   * Code rncp périmé (date fin enregistrement avant le 31 aout de l'année courante)
   */
  rncp_outdated?: boolean;
}
/**
 * Cause du rejet de publication
 */
export interface Rejection {
  /**
   * L'erreur telle que retournée par la plateforme
   */
  error?: string | null;
  /**
   * La description textuelle de l'erreur retournée
   */
  description?: string | null;
  /**
   * L'action à mener pour résoudre le rejet.
   */
  action?: string | null;
  /**
   * Adresse email de la personne ayant pris en charge le rejet de publication
   */
  handled_by?: string | null;
  /**
   * Date à laquelle le rejet de publication a été pris en charge
   */
  handled_date?: Date;
}
export interface ItemOfBcnMefs_10 {
  mef10?: string;
  modalite?: Modalite2;
}
export interface Modalite2 {
  duree?: string;
  annee?: string;
}
/**
 * Données pour étude France Compétence
 */
export interface FranceCompetenceInfos {
  fc_is_catalog_general?: boolean;
  fc_is_habilite_rncp?: boolean;
  fc_is_certificateur?: boolean;
  fc_is_certificateur_siren?: boolean;
  fc_is_partenaire?: boolean;
  fc_has_partenaire?: boolean;
}
