const usersSchema = {
  username: {
    type: String,
    default: null,
    description: "Le nom de l'utilisateur",
    unique: true,
  },
  password: {
    type: String,
    default: null,
    description: "Le mot de passe hashé",
  },
  isAdmin: {
    type: Boolean,
    default: false,
    description: "true si l'utilisateur est administrateur",
  },
  email: {
    type: String,
    default: null,
    description: "Email",
  },
  academie: {
    type: String,
    default: null,
    description: "Academie coma separated",
  },
  account_status: {
    type: String,
    default: "FORCE_RESET_PASSWORD",
    description: "Account status",
  },
};
module.exports = usersSchema;
