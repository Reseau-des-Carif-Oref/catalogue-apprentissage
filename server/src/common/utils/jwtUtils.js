const pick = require("lodash").pick;
const jwt = require("jsonwebtoken");
const config = require("config");

const createToken = (type, subject, options = {}) => {
  const defaults = config.auth[type];
  const secret = options.secret || defaults.jwtSecret;
  const expiresIn = options.expiresIn || defaults.expiresIn;
  const payload = options.payload || {};

  return jwt.sign(payload, secret, {
    issuer: config.appName,
    expiresIn: expiresIn,
    subject: subject,
  });
};

module.exports = {
  createActivationToken: (subject, options = {}) => createToken("activation", subject, options),
  createPasswordToken: (subject, options = {}) => createToken("password", subject, options),
  createUserToken: (user, options = {}) => {
    const permissions = pick(user, ["isAdmin"]);
    const payload = {
      permissions,
      email: user.email,
      academie: user.academie,
      account_status: user.account_status,
      roles: permissions.isAdmin ? ["admin", ...user.roles] : user.roles,
    };

    return createToken("user", user.username, { payload, ...options });
  },
};
