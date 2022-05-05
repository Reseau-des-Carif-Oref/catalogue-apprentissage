// @ts-check
const { extractPeriodeArray } = require("../../../common/utils/rcoUtils");

/** @typedef {import("../../../common/model/schema/formation").Formation} Formation */

/**
 *  @type {{ [key in keyof Formation]: "boolean"|"date"|"periode"|"niveau"|"nullable"|"nullable-boolean"|"number"|"array" }}
 */
const TYPES_MAP = {
  cfd_outdated: "boolean",
  cfd_date_fermeture: "date",
  periode: "periode",
  niveau: "niveau",
  capacite: "nullable",
  etablissement_gestionnaire_uai: "nullable",
  etablissement_formateur_uai: "nullable",
  distance: "number",
  rncp_eligible_apprentissage: "boolean",
  catalogue_published: "boolean",
  entierement_a_distance: "nullable-boolean",
  rome_codes: "array",
};

const niveaux = {
  3: "3 (CAP...)",
  4: "4 (BAC...)",
  5: "5 (BTS, DEUST...)",
  6: "6 (Licence, BUT...)",
  7: "7 (Master, titre ingénieur...)",
  8: "8 (Doctorat...)",
};

// Some fields need to be parsed to be cast to the right type
const parser = (obj, typesMap = TYPES_MAP) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      let parsedValue;

      const type = typesMap[key];
      switch (type) {
        case "nullable-boolean":
          switch (true) {
            case ["0", "1"].includes(value):
              parsedValue = Boolean(Number(value));
              break;
            case value === "":
              parsedValue = null;
              break;
            default:
              parsedValue = !!value;
              break;
          }
          break;

        case "boolean":
          parsedValue = ["0", "1"].includes(value) ? Boolean(Number(value)) : !!value;
          break;

        case "date":
          parsedValue = value ? new Date(value) : null;
          break;

        case "periode": {
          const tmpValue = Array.isArray(value) ? value : [value];
          parsedValue = extractPeriodeArray(tmpValue).map((str) => new Date(str));
          break;
        }

        case "niveau":
          parsedValue = niveaux[value];
          break;

        case "nullable":
          parsedValue = value ? value : null;
          break;

        case "number":
          parsedValue = value === "NAN" ? null : Number(value);
          break;

        case "array":
          parsedValue = value ? value.split(",") : [];
          break;

        default:
          parsedValue = value;
          break;
      }

      return [key, parsedValue];
    })
  );
};

module.exports = { parser };
