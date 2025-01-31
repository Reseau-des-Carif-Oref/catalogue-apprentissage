const formation = {
  etablissement_reference: 1,
  etablissement_formateur_siret: 1,
  etablissement_formateur_enseigne: 1,
  etablissement_formateur_uai: 1,
  etablissement_formateur_adresse: 1,
  etablissement_formateur_code_postal: 1,
  etablissement_formateur_localite: 1,
  etablissement_formateur_complement_adresse: 1,
  etablissement_formateur_entreprise_raison_sociale: 1,
  etablissement_formateur_cedex: 1,
  etablissement_formateur_siren: 1,
  etablissement_gestionnaire_siret: 1,
  etablissement_gestionnaire_enseigne: 1,
  etablissement_gestionnaire_uai: 1,
  etablissement_gestionnaire_adresse: 1,
  etablissement_gestionnaire_code_postal: 1,
  etablissement_gestionnaire_localite: 1,
  etablissement_gestionnaire_complement_adresse: 1,
  etablissement_gestionnaire_cedex: 1,
  etablissement_gestionnaire_entreprise_raison_sociale: 1,
  etablissement_gestionnaire_siren: 1,
  nom_academie: 1,
  num_academie: 1,
  code_postal: 1,
  code_commune_insee: 1,
  num_departement: 1,
  uai_formation: 1,
  nom: 1,
  intitule_long: 1,
  intitule_court: 1,
  diplome: 1,
  niveau: 1,
  cfd: 1,
  cfd_entree: 1,
  rncp_code: 1,
  rncp_intitule: 1,
  _id: 1,
  etablissement_formateur_id: 1,
  etablissement_gestionnaire_id: 1,
  id_rco_formation: 1,
  cle_ministere_educatif: 1,
};

const etablissement = {
  siege_social: 1,
  etablissement_siege_siret: 1,
  siret: 1,
  siren: 1,
  naf_code: 1,
  naf_libelle: 1,
  date_creation: 1,
  date_mise_a_jour: 1,
  enseigne: 1,
  adresse: 1,
  numero_voie: 1,
  type_voie: 1,
  nom_voie: 1,
  complement_adresse: 1,
  code_postal: 1,
  num_departement: 1,
  localite: 1,
  code_insee_localite: 1,
  cedex: 1,
  date_fermeture: 1,
  ferme: 1,
  region_implantation_code: 1,
  region_implantation_nom: 1,
  commune_implantation_code: 1,
  commune_implantation_nom: 1,
  num_academie: 1,
  nom_academie: 1,
  uai: 1,
  entreprise_siren: 1,
  entreprise_enseigne: 1,
  entreprise_raison_sociale: 1,
  entreprise_nom_commercial: 1,
  entreprise_date_creation: 1,
  entreprise_date_radiation: 1,
  entreprise_siret_siege_social: 1,
  raison_sociale: 1,
  nom_commercial: 1,
  siret_siege_social: 1,
  uais_formations: 1,
  created_at: 1,
  last_update_at: 1,
  entreprise_tranche_effectif_salarie: 1,
  etablissement_siege_id: 1,
  matched_uai: 1,
  _id: 1,
};

module.exports = { formation, etablissement };
