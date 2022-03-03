import React from "react";
import Catalogue from "./Catalogue";
import { renderWithRouter, setupMswServer } from "../../common/utils/testUtils";
import { rest } from "msw";
import * as search from "../../common/hooks/useSearch";
import * as useAuth from "../../common/hooks/useAuth";
import { waitFor } from "@testing-library/react";

const server = setupMswServer(
  rest.get(/\/api\/v1\/entity\/alert/, (req, res, ctx) => {
    return res(ctx.json([]));
  }),

  rest.post(/\/api\/es\/search\/formation\/_count/, (req, res, ctx) => {
    return res(ctx.json([]));
  }),

  rest.post(/\/api\/es\/search\/formations\/_msearch/, (req, res, ctx) => {
    return res(
      ctx.json({
        took: 40,
        responses: [
          {
            took: 40,
            timed_out: false,
            _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
            hits: {
              total: 45854,
              max_score: null,
              hits: [
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc6166e712d48a988133449",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Henriville",
                    cfd_date_fermeture: null,
                    etablissement_formateur_code_postal: "54320",
                    rncp_code: "RNCP29885",
                    etablissement_gestionnaire_siret: "34958609900021",
                    etablissement_gestionnaire_nom_academie: "Nancy-Metz",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "H2913", libelle: "Soudage manuel" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: "Baccalauréat professionnel",
                      ancienne_fiche: ["RNCP7140"],
                      partenaires: null,
                      demande: 0,
                      certificateurs: [],
                      nsf_code: "254",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau4",
                      voix_acces: null,
                      code_type_certif: "BAC PRO",
                      blocs_competences: [],
                      date_fin_validite_enregistrement: "01/01/2024",
                      nsf_libelle: "Structures métalliques (y.c. soudure, carrosserie, coque bateau, cellule avion)",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "TECH.CHAUDRONNERIE INDUSTRIELLE",
                    etablissement_formateur_enseigne: "CFAI",
                    etablissement_gestionnaire_entreprise_raison_sociale: "ASS APPRENTISSAGE INDUSTRIEL",
                    diplome: "BAC PROFESSIONNEL",
                    id_rco_formation: "01_GE108189|01_GE506980|97049",
                    rome_codes: ["H2902", "I1606", "H2914", "H2913"],
                    rncp_etablissement_gestionnaire_habilite: false,
                    nom_academie: "Nancy-Metz",
                    code_commune_insee: "57316",
                    etablissement_formateur_adresse: null,
                    etablissement_gestionnaire_num_academie: "12",
                    tags: ["2021", "2022", "2023"],
                    num_departement: "57",
                    rncp_intitule: "Technicien en chaudronnerie industrielle",
                    num_academie: "12",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["01_GE506980"],
                    parcoursup_statut: "hors périmètre",
                    etablissement_formateur_nda: "44540379354",
                    etablissement_formateur_uai: null,
                    lieu_formation_geo_coordonnees: "49.103334,6.855078",
                    annee: "X",
                    periode: ["2021-09-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: "54357",
                    capacite: null,
                    duree: "3",
                    onisep_url: "http://www.onisep.fr/http/redirection/formation/identifiant/4671",
                    cle_ministere_educatif: "097049P013X3495860990002134958609900021-57316#L01",
                    cfd: "40025411",
                    intitule_long: "TECHNICIEN EN CHAUDRONNERIE INDUSTRIELLE (BAC PRO)",
                    code_postal: "57450",
                    lieu_formation_adresse:
                      "Zone Megazone de Moselle Est Parc d'Activités du district de Freyming-Merlebach",
                    id_formation: "01_GE108189",
                    etablissement_gestionnaire_uai: null,
                    id_certifinfo: "97049",
                    etablissement_gestionnaire_enseigne: "CFAI",
                    etablissement_formateur_localite: "MAXEVILLE",
                    niveau: "4 (BAC...)",
                    uai_formation: null,
                    etablissement_formateur_siret: "34958609900021",
                    etablissement_gestionnaire_nda: "44540379354",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc6166e712d48a988133449"],
                },
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc6166e712d48a98813344b",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Bar-le-Duc",
                    cfd_date_fermeture: null,
                    etablissement_formateur_code_postal: "54320",
                    rncp_code: "RNCP25353",
                    etablissement_gestionnaire_siret: "34958609900021",
                    etablissement_gestionnaire_nom_academie: "Nancy-Metz",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "I1309", libelle: "Maintenance électrique" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: "Baccalauréat professionnel",
                      ancienne_fiche: ["RNCP427"],
                      partenaires: null,
                      demande: 0,
                      certificateurs: [],
                      nsf_code: "255",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau4",
                      voix_acces: null,
                      code_type_certif: "BAC PRO",
                      blocs_competences: [],
                      date_fin_validite_enregistrement: "01/01/2024",
                      nsf_libelle: "Electricite, électronique",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "METIERS ELECT. ENVIRON. CONNECTES",
                    etablissement_formateur_enseigne: "CFAI",
                    etablissement_gestionnaire_entreprise_raison_sociale: "ASS APPRENTISSAGE INDUSTRIEL",
                    diplome: "BAC PROFESSIONNEL",
                    id_rco_formation: "01_GE108036|01_GE506876|88281",
                    rome_codes: ["F1602", "H1504", "I1309"],
                    rncp_etablissement_gestionnaire_habilite: false,
                    nom_academie: "Nancy-Metz",
                    code_commune_insee: "55029",
                    etablissement_formateur_adresse: null,
                    etablissement_gestionnaire_num_academie: "12",
                    tags: ["2021", "2022", "2023"],
                    num_departement: "55",
                    rncp_intitule: "Métiers de l'Électricité et de ses Environnements Connectés",
                    num_academie: "12",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["01_GE506876"],
                    parcoursup_statut: "hors périmètre",
                    etablissement_formateur_nda: "44540379354",
                    etablissement_formateur_uai: null,
                    lieu_formation_geo_coordonnees: "48.77439,5.166015",
                    annee: "X",
                    periode: ["2021-09-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: "54357",
                    capacite: null,
                    duree: "3",
                    onisep_url: "http://www.onisep.fr/http/redirection/formation/identifiant/33531",
                    cle_ministere_educatif: "088281P013X3495860990002134958609900021-55029#L01",
                    cfd: "40025510",
                    intitule_long: "METIERS DE L'ELECTRICITE ET DE SES ENVIRONNEMENTS CONNECTES (BAC PRO)",
                    code_postal: "55000",
                    lieu_formation_adresse: "8 rue Antoine Durenne Parc Bradfer",
                    id_formation: "01_GE108036",
                    etablissement_gestionnaire_uai: null,
                    id_certifinfo: "88281",
                    etablissement_gestionnaire_enseigne: "CFAI",
                    etablissement_formateur_localite: "MAXEVILLE",
                    niveau: "4 (BAC...)",
                    uai_formation: null,
                    etablissement_formateur_siret: "34958609900021",
                    etablissement_gestionnaire_nda: "44540379354",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc6166e712d48a98813344b"],
                },
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc6166f712d48a9881334b1",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Marseille 15e Arrondissement",
                    cfd_date_fermeture: null,
                    etablissement_formateur_code_postal: "13015",
                    rncp_code: "RNCP34025",
                    etablissement_gestionnaire_siret: "43964416200034",
                    etablissement_gestionnaire_nom_academie: "Aix-Marseille",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "C1110", libelle: "Souscription d'assurances" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: "Licence professionnelle",
                      ancienne_fiche: null,

                      partenaires: [],
                      demande: 0,
                      certificateurs: [],
                      nsf_code: "313",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau6",
                      voix_acces: null,
                      code_type_certif: "Licence Professionnelle",
                      blocs_competences: [],
                      date_fin_validite_enregistrement: "31/08/2024",
                      nsf_libelle: "Finances, banque, assurances, immobilier",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "ABF SUPPORTS OPERATIONNELS",
                    etablissement_formateur_enseigne: "AGCNAM DE PACA",
                    etablissement_gestionnaire_entreprise_raison_sociale:
                      "DE GESTION DU CONSERVATOIRE NATIONAL DES ARTS ET METIERS DE LA REGION DE PROVENCE ALPES COTE D AZUR",
                    diplome: "LICENCE PROFESSIONNELLE",
                    id_rco_formation: "24_207481|24_1461105|103425",
                    rome_codes: ["C1110", "C1204", "C1302", "C1109", "C1107"],
                    rncp_etablissement_gestionnaire_habilite: true,
                    nom_academie: "Aix-Marseille",
                    code_commune_insee: "13215",
                    etablissement_formateur_adresse: null,
                    etablissement_gestionnaire_num_academie: "2",
                    tags: ["2021"],
                    num_departement: "13",
                    rncp_intitule: "Assurance, banque, finance : supports opérationnels (fiche nationale)",
                    num_academie: "2",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["24_1461105"],
                    parcoursup_statut: "hors périmètre",
                    etablissement_formateur_nda: "93131641013",
                    etablissement_formateur_uai: null,
                    lieu_formation_geo_coordonnees: "43.3628,5.31611",
                    annee: "X",
                    periode: ["2021-09-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: "13215",
                    capacite: null,
                    duree: "1",
                    onisep_url: null,
                    cle_ministere_educatif: "103425P011X4396441620003443964416200034-13215#L01",
                    cfd: "25031396",
                    intitule_long: "ASSURANCE, BANQUE, FINANCE : SUPPORTS OPERATIONNELS (LP)",
                    code_postal: "13015",
                    lieu_formation_adresse: "12 place des Abattoirs",
                    id_formation: "24_207481",
                    etablissement_gestionnaire_uai: null,
                    id_certifinfo: "103425",
                    etablissement_gestionnaire_enseigne: "AGCNAM DE PACA",
                    etablissement_formateur_localite: "MARSEILLE 15",
                    niveau: "6 (Licence, BUT...)",
                    uai_formation: null,
                    etablissement_formateur_siret: "43964416200034",
                    etablissement_gestionnaire_nda: "93131641013",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc6166f712d48a9881334b1"],
                },
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc61670712d48a9881334b3",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Marseille 15e Arrondissement",
                    cfd_date_fermeture: null,
                    etablissement_formateur_code_postal: "13015",
                    rncp_code: "RNCP24425",
                    etablissement_gestionnaire_siret: "43964416200034",
                    etablissement_gestionnaire_nom_academie: "Aix-Marseille",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "M1604", libelle: "Assistanat de direction" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: "Licence",
                      ancienne_fiche: ["RNCP24425"],
                      partenaires: [],
                      demande: 0,
                      certificateurs: [],
                      nsf_code: "310",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau6",
                      voix_acces: null,
                      code_type_certif: "LICENCE",
                      blocs_competences: [],
                      date_fin_validite_enregistrement: "31/08/2026",
                      nsf_libelle: "Spécialités plurivalentes des échanges et de la gestion",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "GESTION",
                    etablissement_formateur_enseigne: "AGCNAM DE PACA",
                    etablissement_gestionnaire_entreprise_raison_sociale:
                      "DE GESTION DU CONSERVATOIRE NATIONAL DES ARTS ET METIERS DE LA REGION DE PROVENCE ALPES COTE D AZUR",
                    diplome: "LICENCE LMD",
                    id_rco_formation: "24_207484|24_1461108|92839",
                    rome_codes: ["M1604", "M1401", "M1605", "M1203"],
                    rncp_etablissement_gestionnaire_habilite: true,
                    nom_academie: "Aix-Marseille",
                    code_commune_insee: "13215",
                    etablissement_formateur_adresse: null,
                    etablissement_gestionnaire_num_academie: "2",
                    tags: ["2021", "2022"],
                    num_departement: "13",
                    rncp_intitule: "Gestion (fiche nationale)",
                    num_academie: "2",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["24_1461108"],
                    parcoursup_statut: "hors périmètre",
                    etablissement_formateur_nda: "93131641013",
                    etablissement_formateur_uai: null,
                    lieu_formation_geo_coordonnees: "43.3628,5.31611",
                    annee: "X",
                    periode: ["2021-09-01T00:00:00.000Z", "2022-09-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: "13215",
                    capacite: null,
                    duree: "1",
                    onisep_url: null,
                    cle_ministere_educatif: "092839P011X4396441620003443964416200034-13215#L01",
                    cfd: "20531023",
                    intitule_long: "GESTION (LIC LMD)",
                    code_postal: "13015",
                    lieu_formation_adresse: "12 place des Abattoirs",
                    id_formation: "24_207484",
                    etablissement_gestionnaire_uai: null,
                    id_certifinfo: "92839",
                    etablissement_gestionnaire_enseigne: "AGCNAM DE PACA",
                    etablissement_formateur_localite: "MARSEILLE 15",
                    niveau: "6 (Licence, BUT...)",
                    uai_formation: null,
                    etablissement_formateur_siret: "43964416200034",
                    etablissement_gestionnaire_nda: "93131641013",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc61670712d48a9881334b3"],
                },
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc61670712d48a9881334bd",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Avignon",
                    cfd_date_fermeture: null,
                    etablissement_formateur_code_postal: null,
                    rncp_code: "RNCP15516",
                    etablissement_gestionnaire_siret: "19060793700074",
                    etablissement_gestionnaire_nom_academie: "Nice",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "J1302", libelle: "Analyses médicales" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: "Brevet de technicien supérieur agricole",
                      ancienne_fiche: ["RNCP345"],
                      partenaires: [],
                      demande: 0,
                      certificateurs: [],
                      nsf_code: "221",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau5",
                      voix_acces: null,
                      code_type_certif: "BTSA",
                      blocs_competences: null,
                      date_fin_validite_enregistrement: "01/01/2024",
                      nsf_libelle: "Agro-alimentaire, alimentation, cuisine",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "ANALYSES AGRI BIOLOG ET BIOTECHNO",
                    etablissement_formateur_enseigne: null,
                    etablissement_gestionnaire_entreprise_raison_sociale:
                      "ETABLISSEMENT PUBLIC LOCAL D'ENSEIGNEMENT ET DE FORMATION PROFESSIONNELLE AGRICOLE D'ANTIBES",
                    diplome: "BREVET DE TECHNICIEN SUPERIEUR AGRICOLE",
                    id_rco_formation: "24_207709|24_1461627|64390",
                    rome_codes: ["J1302", "H1210", "H1503"],
                    rncp_etablissement_gestionnaire_habilite: false,
                    nom_academie: "Aix-Marseille",
                    code_commune_insee: "84007",
                    etablissement_formateur_adresse: null,
                    etablissement_gestionnaire_num_academie: "23",
                    tags: ["2021", "2022", "2023"],
                    num_departement: "84",
                    rncp_intitule: "Analyses agricoles biologiques et biotechnologiques",
                    num_academie: "2",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["24_1461627"],
                    parcoursup_statut: "publié",
                    etablissement_formateur_nda: null,
                    etablissement_formateur_uai: null,
                    lieu_formation_geo_coordonnees: "43.9281,4.88697",
                    annee: "X",
                    periode: ["2021-09-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: null,
                    capacite: null,
                    duree: "2",
                    onisep_url: "http://www.onisep.fr/http/redirection/formation/identifiant/1491",
                    cle_ministere_educatif: "064390P012X1906079370007419840110100011-84007#L01",
                    cfd: "32322111",
                    intitule_long: "ANALYSES AGRICOLES BIOLOGIQUES ET BIOTECHNOLOGIQUES (BTSA)",
                    code_postal: "84000",
                    lieu_formation_adresse: "3592 route de Marseille",
                    id_formation: "24_207709",
                    etablissement_gestionnaire_uai: "0061603K",
                    id_certifinfo: "64390",
                    etablissement_gestionnaire_enseigne: "CFA REGIONAL AGRICOLE D'ANTIBES",
                    etablissement_formateur_localite: "AVIGNON",
                    niveau: "5 (BTS, DEUST...)",
                    uai_formation: null,
                    etablissement_formateur_siret: "19840110100011",
                    etablissement_gestionnaire_nda: "9306P002806",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc61670712d48a9881334bd"],
                },
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc61670712d48a9881334bf",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Mandelieu-la-Napoule",
                    cfd_date_fermeture: "2025-08-30T22:00:00.000Z",
                    etablissement_formateur_code_postal: null,
                    rncp_code: "RNCP34734",
                    etablissement_gestionnaire_siret: "39945394300058",
                    etablissement_gestionnaire_nom_academie: "Nice",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "M1202", libelle: "Audit et contrôle comptables et financiers" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: null,
                      ancienne_fiche: ["RNCP28688"],
                      partenaires: [],
                      demande: 0,
                      certificateurs: [{ siret_certificateur: "44320061300026", certificateur: "FORMATIVES" }],
                      nsf_code: "310",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau6",
                      voix_acces: null,
                      code_type_certif: "TP",
                      blocs_competences: [],
                      date_fin_validite_enregistrement: "30/06/2025",
                      nsf_libelle: "Spécialités plurivalentes des échanges et de la gestion",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "CHARGE DE GESTION ET MANAGEMENT",
                    etablissement_formateur_enseigne: null,
                    etablissement_gestionnaire_entreprise_raison_sociale: "EURO MEDIA FORMATION",
                    diplome: "TH DE NIV 2 ORGANISMES GESTIONNAIRES DIVERS",
                    id_rco_formation: "24_207521|24_1461150|108755",
                    rome_codes: ["M1202", "M1205", "M1101", "M1204", "M1302"],
                    rncp_etablissement_gestionnaire_habilite: true,
                    nom_academie: "Nice",
                    code_commune_insee: "06079",
                    etablissement_formateur_adresse: null,
                    etablissement_gestionnaire_num_academie: "23",
                    tags: ["2021", "2022"],
                    num_departement: "06",
                    rncp_intitule: "Chargé de gestion et management",
                    num_academie: "23",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["24_1461150"],
                    parcoursup_statut: "hors périmètre",
                    etablissement_formateur_nda: "93060290006",
                    etablissement_formateur_uai: null,
                    lieu_formation_geo_coordonnees: "43.5339,6.91782",
                    annee: "X",
                    periode: ["2021-09-01T00:00:00.000Z", "2022-09-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: null,
                    capacite: null,
                    duree: "1",
                    onisep_url: null,
                    cle_ministere_educatif: "108755P011X3994539430005839945394300066-06079#L01",
                    cfd: "26X31021",
                    intitule_long: "CHARGE DE GESTION ET MANAGEMENT (FORMATIVES)",
                    code_postal: "06210",
                    lieu_formation_adresse: "225 avenue Saint Exupéry Bât 9 - 1er étage",
                    id_formation: "24_207521",
                    etablissement_gestionnaire_uai: null,
                    id_certifinfo: "108755",
                    etablissement_gestionnaire_enseigne: null,
                    etablissement_formateur_localite: "MANDELIEU-LA-NAPOULE",
                    niveau: "6 (Licence, BUT...)",
                    uai_formation: null,
                    etablissement_formateur_siret: "39945394300066",
                    etablissement_gestionnaire_nda: "93060290006",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc61670712d48a9881334bf"],
                },
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc61670712d48a9881334c5",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Le Chaffaut-Saint-Jurson",
                    cfd_date_fermeture: null,
                    etablissement_formateur_code_postal: null,
                    rncp_code: "RNCP15673",
                    etablissement_gestionnaire_siret: "19060793700074",
                    etablissement_gestionnaire_nom_academie: "Nice",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "K1802", libelle: "Développement local" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: "Brevet de technicien supérieur agricole",
                      ancienne_fiche: ["RNCP354"],
                      partenaires: [],
                      demande: 0,
                      certificateurs: [],
                      nsf_code: "213",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau5",
                      voix_acces: null,
                      code_type_certif: "BTSA",
                      blocs_competences: null,
                      date_fin_validite_enregistrement: "01/01/2024",
                      nsf_libelle: "Forets, espaces naturels, faune sauvage, pêche",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "GESTION FORESTIERE ",
                    etablissement_formateur_enseigne: "CFPPA-UFA",
                    etablissement_gestionnaire_entreprise_raison_sociale:
                      "ETABLISSEMENT PUBLIC LOCAL D'ENSEIGNEMENT ET DE FORMATION PROFESSIONNELLE AGRICOLE D'ANTIBES",
                    diplome: "BREVET DE TECHNICIEN SUPERIEUR AGRICOLE",
                    id_rco_formation: "24_207711|24_1461630|78105",
                    rome_codes: ["A1204", "A1301", "A1205", "K1802"],
                    rncp_etablissement_gestionnaire_habilite: false,
                    nom_academie: "Aix-Marseille",
                    code_commune_insee: "04046",
                    etablissement_formateur_adresse: null,
                    etablissement_gestionnaire_num_academie: "23",
                    tags: ["2021", "2022", "2023"],
                    num_departement: "04",
                    rncp_intitule: "Gestion forestière",
                    num_academie: "2",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["24_1461630"],
                    parcoursup_statut: "publié",
                    etablissement_formateur_nda: "9304P001004",
                    etablissement_formateur_uai: null,
                    lieu_formation_geo_coordonnees: "44.0383,6.15034",
                    annee: "X",
                    periode: ["2021-09-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: null,
                    capacite: null,
                    duree: "2",
                    onisep_url: "http://www.onisep.fr/http/redirection/formation/identifiant/1489",
                    cle_ministere_educatif: "078105P012X1906079370007419040056400034-04046#L01",
                    cfd: "32321304",
                    intitule_long: "GESTION FORESTIERE (BTSA)",
                    code_postal: "04510",
                    lieu_formation_adresse: "Route d'Espinousse",
                    id_formation: "24_207711",
                    etablissement_gestionnaire_uai: "0061603K",
                    id_certifinfo: "78105",
                    etablissement_gestionnaire_enseigne: "CFA REGIONAL AGRICOLE D'ANTIBES",
                    etablissement_formateur_localite: "LE CHAFFAUT-SAINT-JURSON",
                    niveau: "5 (BTS, DEUST...)",
                    uai_formation: null,
                    etablissement_formateur_siret: "19040056400034",
                    etablissement_gestionnaire_nda: "9306P002806",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc61670712d48a9881334c5"],
                },
                {
                  _index: "formation",
                  _type: "_doc",
                  _id: "5fc61672712d48a9881334fe",
                  _score: null,
                  _source: {
                    affelnet_statut: "hors périmètre",
                    localite: "Antibes",
                    cfd_date_fermeture: null,
                    etablissement_formateur_code_postal: "06600",
                    rncp_code: "RNCP2262",
                    etablissement_gestionnaire_siret: "19060793700074",
                    etablissement_gestionnaire_nom_academie: "Nice",
                    rncp_details: {
                      active_inactive: "ACTIVE",
                      romes: [{ rome: "A1203", libelle: "Aménagement et entretien des espaces verts" }],
                      etat_fiche_rncp: "Publiée",
                      type_certif: "Certificat de spécialisation",
                      ancienne_fiche: null,
                      partenaires: [],
                      demande: 0,
                      certificateurs: [],
                      nsf_code: "214",
                      nouvelle_fiche: null,
                      niveau_europe: "niveau5",
                      voix_acces: null,
                      code_type_certif: "CS",
                      blocs_competences: [],
                      date_fin_validite_enregistrement: "01/01/2024",
                      nsf_libelle: "Aménagement paysager (parcs, jardins, espaces verts, terrains de sport)",
                    },
                    etablissement_reference_catalogue_published: true,
                    intitule_court: "COLLAB DU  CONCEPTEUR PAYSAGISTE",
                    etablissement_formateur_enseigne: "CFA REGIONAL AGRICOLE D'ANTIBES",
                    etablissement_gestionnaire_entreprise_raison_sociale:
                      "ETABLISSEMENT PUBLIC LOCAL D'ENSEIGNEMENT ET DE FORMATION PROFESSIONNELLE AGRICOLE D'ANTIBES",
                    diplome: "CERTIFICAT DE SPECIALISATION AGRICOLE DE NIVEAU 3",
                    id_rco_formation: "24_207713|24_1461635|19856",
                    rome_codes: ["A1203"],
                    rncp_etablissement_gestionnaire_habilite: false,
                    nom_academie: "Nice",
                    code_commune_insee: "06004",
                    etablissement_formateur_adresse: "88 CHE DES MAURES",
                    etablissement_gestionnaire_num_academie: "23",
                    tags: ["2021", "2022"],
                    num_departement: "06",
                    rncp_intitule: "option Collaborateur du concepteur paysagiste",
                    num_academie: "23",
                    rncp_eligible_apprentissage: true,
                    ids_action: ["24_1461635"],
                    parcoursup_statut: "hors périmètre",
                    etablissement_formateur_nda: "9306P002806",
                    etablissement_formateur_uai: "0061603K",
                    lieu_formation_geo_coordonnees: "43.5656,7.111",
                    annee: "X",
                    periode: ["2022-06-01T00:00:00.000Z"],
                    etablissement_formateur_code_commune_insee: "06004",
                    capacite: null,
                    duree: "1",
                    onisep_url: "http://www.onisep.fr/http/redirection/formation/identifiant/1453",
                    cle_ministere_educatif: "019856P011X1906079370007419060793700074-06004#L01",
                    cfd: "36321401",
                    intitule_long: "COLLABORATEUR DU CONCEPTEUR PAYSAGISTE (CSA)",
                    code_postal: "06600",
                    lieu_formation_adresse: "88 chemin des Maures",
                    id_formation: "24_207713",
                    etablissement_gestionnaire_uai: "0061603K",
                    id_certifinfo: "19856",
                    etablissement_gestionnaire_enseigne: "CFA REGIONAL AGRICOLE D'ANTIBES",
                    etablissement_formateur_localite: "ANTIBES",
                    niveau: "5 (BTS, DEUST...)",
                    uai_formation: "0061603K",
                    etablissement_formateur_siret: "19060793700074",
                    etablissement_gestionnaire_nda: "9306P002806",
                    etablissement_gestionnaire_catalogue_published: true,
                  },
                  sort: ["5fc61672712d48a9881334fe"],
                },
              ],
            },
            aggregations: {
              published: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [{ key: 1, key_as_string: "true", doc_count: 45854 }],
              },
            },
            status: 200,
          },
        ],
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.setTimeout(50000);

test("renders basic tree", async () => {
  jest.spyOn(search, "useSearch").mockImplementation(() => ({
    loaded: true,
    countCatalogueGeneral: {
      total: 45854,
      filtered: null,
    },
    countCatalogueNonEligible: {
      total: 100,
      filtered: null,
    },
    countEtablissement: 10,

    base: "formations",
    count: 100,
    isBaseFormations: true,
    isBaseReconciliationPs: false,
    endpoint: "http://localhost/api",
  }));

  jest.spyOn(useAuth, "default").mockImplementation(() => [
    {
      permissions: { isAdmin: true },
      sub: "test",
      email: "test@apprentissage.beta.gouv.fr",
      academie: "-1",
      account_status: "CONFIRMED",
      roles: ["admin", "user"],
      acl: [],
    },
    () => {},
  ]);
  const { getAllByText, getByText, getAllByTestId } = renderWithRouter(
    <Catalogue location={{ search: { defaultMode: "simple" } }} />
  );
  const match = getAllByText(/^Catalogue des formations en apprentissage$/i);
  expect(match).toHaveLength(3);

  await waitFor(() => getByText("Période"));

  const periode = getByText("Période");
  expect(periode).toBeInTheDocument();

  const psDate = getByText("Date de publication sur Parcoursup");
  expect(psDate).toBeInTheDocument();

  const afDate = getByText("Date de publication sur Affelnet");
  expect(afDate).toBeInTheDocument();

  await waitFor(() => getByText(/Exporter/i));

  const count = getByText("45 854 formations sur 45 854");
  expect(count).toBeInTheDocument();

  const cards = getAllByTestId("card_formation");
  expect(cards).toHaveLength(8);
});
