export type Etablissement = {
  // Cet établissement est le siége social
  siege_social: boolean;
  // Identifiant établissement siége
  etablissement_siege_id: string;
  // Numéro siret du siége sociale
  etablissement_siege_siret: string;
  // Numéro siret
  siret: string;
  // Numéro siren de l'entreprise
  siren: string;
  // Numéro Déclaration
  nda: string;
  // Code NAF
  naf_code: string;
  // Libellé du code NAT (ex: Enseignement secondaire technique ou professionnel)
  naf_libelle: string;
  // Tranche salariale
  tranche_effectif_salarie: Object;
  // Date de création
  date_creation: Date;
  // Date de création
  date_mise_a_jour: Date;
  // Diffusable commercialement
  diffusable_commercialement: boolean;
  // Enseigne
  enseigne: string;
  // Nom de l'etablissement Onisep
  onisep_nom: string;
  // Url Onisep de la fiche etablissement
  onisep_url: string;
  // Code postal Onisep
  onisep_code_postal: string;
  // Adresse de l'établissement
  adresse: string;
  // Numéro de la voie
  numero_voie: string;
  // Type de voie (ex: rue, avenue)
  type_voie: string;
  // Nom de la voie
  nom_voie: string;
  // Complément d'adresse de l'établissement
  complement_adresse: string;
  // Code postal
  code_postal: string;
  // Numéro de département
  num_departement: string;
  // Nom du departement
  nom_departement: string;
  // Localité
  localite: string;
  // Code Insee localité
  code_insee_localite: string;
  // Cedex
  cedex: string;
  // Latitude et longitude de l'établissement
  geo_coordonnees: string;
  // Date de cessation d'activité
  date_fermeture: Date;
  // A cessé son activité
  ferme: boolean;
  // Code région
  region_implantation_code: string;
  // Nom de la région
  region_implantation_nom: string;
  // Code commune
  commune_implantation_code: string;
  // Nom de la commune
  commune_implantation_nom: string;
  // Code pays
  pays_implantation_code: string;
  // Nom du pays
  pays_implantation_nom: string;
  // Numéro de l'académie
  num_academie: number;
  // Nom de l'académie
  nom_academie: string;
  // UAI de l'établissement
  uai: string;
  // L'UAI de l'établissement est il valide ?
  uai_valide: boolean;
  // UAIs potentiels de l'établissement
  uais_potentiels: string[];
  // L'établissement est présent ou pas dans le fichier datagouv
  info_datagouv_ofs: number;
  // L'établissement est présent ou pas dans le fichier datagouv
  info_datagouv_ofs_info: string;
  // L'établissement est présent ou pas dans le fichier qualiopi
  info_qualiopi_info: string;
  // L'établissement est trouvé via l'API Entreprise
  api_entreprise_reference: boolean;
  // Numéro siren
  entreprise_siren: string;
  // Procédure collective
  entreprise_procedure_collective: boolean;
  // Enseigne
  entreprise_enseigne: string;
  // Numéro de TVA intracommunautaire
  entreprise_numero_tva_intracommunautaire: string;
  // Code éffectf
  entreprise_code_effectif_entreprise: string;
  // Code forme juridique
  entreprise_forme_juridique_code: string;
  // Forme juridique (ex: Établissement public local d'enseignement)
  entreprise_forme_juridique: string;
  // Raison sociale
  entreprise_raison_sociale: string;
  // Nom commercial
  entreprise_nom_commercial: string;
  // Capital social
  entreprise_capital_social: string;
  // Date de création
  entreprise_date_creation: Date;
  // Date de radiation
  entreprise_date_radiation: string;
  // Code NAF
  entreprise_naf_code: string;
  // Libellé du code NAT (ex: Enseignement secondaire technique ou professionnel)
  entreprise_naf_libelle: string;
  // Date de cessation d'activité
  entreprise_date_fermeture: Date;
  // A cessé son activité
  entreprise_ferme: boolean;
  // Numéro siret du siége sociale
  entreprise_siret_siege_social: string;
  // Nom du contact
  entreprise_nom: string;
  // Prénom du contact
  entreprise_prenom: string;
  // Catégorie (PME, TPE, etc..)
  entreprise_categorie: string;
  // Tranche salarié
  entreprise_tranche_effectif_salarie: Object;
  // l'établissement a des formations
  formations_attachees: boolean;
  // Id des formations rattachées
  formations_ids: string[];
  // UAIs des formations rattachées à l'établissement
  formations_uais: string[];
  // l'établissement a des formations de niveau 3
  formations_n3: boolean;
  // l'établissement a des formations de niveau 4
  formations_n4: boolean;
  // l'établissement a des formations de niveau 5
  formations_n5: boolean;
  // l'établissement a des formations de niveau 6
  formations_n6: boolean;
  // l'établissement a des formations de niveau 7
  formations_n7: boolean;
  // Numéro de dossier Démarche Simplifiée
  ds_id_dossier: string;
  // Numéro SIREN saisi dans Démarche Simplifiée
  ds_questions_siren: string;
  // Nom du contact saisi dans Démarche Simplifiée
  ds_questions_nom: string;
  // Email du contact saisi dans Démarche Simplifiée
  ds_questions_email: string;
  // UAI saisi dans Démarche Simplifiée
  ds_questions_uai: string;
  // Réponse à la question "Avez vous l\'agrément CFA" dans Démarche Simplifiée
  ds_questions_has_agrement_cfa: string;
  // Réponse à la question "Avez vous la certification 2015" dans Démarche Simplifiée
  ds_questions_has_certificaton_2015: string;
  // Réponse à la question "Avez vous demandé la certification" dans Démarche Simplifiée
  ds_questions_has_ask_for_certificaton: string;
  // Réponse à la question "Date de votre demande de certification" dans Démarche Simplifiée
  ds_questions_ask_for_certificaton_date: Date;
  // Réponse à la question "Numéro de votre déclaration" dans Démarche Simplifiée
  ds_questions_declaration_code: string;
  // Réponse à la question "Proposez-vous des formations en 2020" dans Démarche Simplifiée
  ds_questions_has_2020_training: string;
  // Est publié dans le catalogue général
  catalogue_published: boolean;
  // Est publié
  published: boolean;
  // Date d'ajout en base de données
  created_at: Date;
  // Date de dernières mise à jour
  last_update_at: Date;
  updates_history: Object[];
  // Erreur lors de la mise à jour de la formation
  update_error: string;
  // Tableau de tags (2020, 2021, RCO, etc.)
  tags: string[];
  // UAI de l'établissement RCO
  rco_uai: string;
  // Adresse de l'établissement RCO
  rco_adresse: string;
  // Code postal RCO
  rco_code_postal: string;
  // Code Insee localité RCO
  rco_code_insee_localite: string;
  // Latitude et longitude de l'établissement RCO
  rco_geo_coordonnees: string;
  // id convention collective
  idcc: number;
  // Nom de l'opérateur de compétence
  opco_nom: string;
  // Siren de l'opérateur de compétence
  opco_siren: string;
};
