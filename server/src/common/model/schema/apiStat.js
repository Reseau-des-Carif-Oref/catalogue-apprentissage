const apiStatSchema = {
  date_appel: {
    type: Date,
    default: Date.now,
    required: true,
    description: "Date et heure de l'appel",
  },
  consommateur: {
    type: String,
    default: null,
    description: "Email de l'utilisateur authentifié, null si route publique",
  },
  methode: {
    type: String,
    required: true,
    description: "Méthode HTTP",
  },
  endpoint: {
    type: String,
    required: true,
    description: "Pattern d'endpoint normalisé (préfixe /api, params Express)",
  },
  code_http: {
    type: Number,
    required: true,
    description: "Code de statut HTTP de la réponse",
  },
  duree_ms: {
    type: Number,
    required: true,
    description: "Durée de traitement de la requête en millisecondes",
  },
  ip_client: {
    type: String,
    default: null,
    description: "Adresse IP du client",
  },
  user_agent: {
    type: String,
    default: null,
    description: "User-Agent du client (tronqué à 255 caractères)",
  },
};

module.exports = apiStatSchema;
