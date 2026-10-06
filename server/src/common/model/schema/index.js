const affelnetFormationSchema = require("./affelnetFormation");
const alertSchema = require("./alert");
const apiStatSchema = require("./apiStat");
const consumptionSchema = require("./consumption");
const dualControlReportSchema = require("./dualControlReport");
const etablissementSchema = require("./etablissement");
const dualControlFormationSchema = require("./formation/dualControlFormation");
const formationSchema = require("./formation/formation");
const logSchema = require("./log");
const reportSchema = require("./report");
const roleSchema = require("./role");
const statistiqueSchema = require("./statistique");
const userSchema = require("./user");

module.exports = {
  affelnetFormationSchema,
  alertSchema,
  apiStatSchema,
  consumptionSchema,
  dualControlReportSchema,
  dualControlFormationSchema,
  etablissementSchema,
  formationSchema,
  logSchema,
  reportSchema,
  roleSchema,
  statistiqueSchema,
  userSchema,
};
