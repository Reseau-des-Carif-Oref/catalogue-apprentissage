const fs = require("fs");
const path = require("path");
const { compile } = require("json-schema-to-typescript");
const schemas = require("../../common/model/schema");
const { getJsonFromMongooseSchema } = require("./mongooseUtils");
const packageJson = require("../../../package.json");

const disableAdditionalProperties = (node) => {
  if (node.properties) {
    node.additionalProperties = false;
    for (const key of Object.keys(node.properties)) {
      disableAdditionalProperties(node.properties[key]);
    }
  }
  if (node.items) {
    disableAdditionalProperties(node.items);
  }
};

const applyTypes = (node) => {
  if (node.type === "boolean" && node.default === "null") {
    node.tsType = "boolean | null";
  }

  if (node.type === "number" && node.default === "null") {
    node.tsType = "number | null";
  }

  if (node.type === "object" && node.default === "null") {
    delete node.default;
  }

  if (node.format === "date-time") {
    node.tsType = "Date";
  }

  if (node.properties) {
    for (const key of Object.keys(node.properties)) {
      const field = node.properties[key];
      applyTypes(field);
    }
  }

  if (node.items) {
    applyTypes(node.items);
  }
};

const applyIdType = (node) => {
  if (node.properties) {
    for (const key of Object.keys(node.properties)) {
      if (key === "_id") {
        node.properties[key].tsType = "Types.ObjectId";
      }

      const field = node.properties[key];
      applyIdType(field);
    }
  }

  if (node.items) {
    applyIdType(node.items);
  }
};

const prepareJsonSchema = (jsonSchema) => {
  const schema = { ...jsonSchema };

  disableAdditionalProperties(schema);
  applyTypes(schema);
  applyIdType(schema);

  return schema;
};

const generateTypes = () => {
  Object.keys(schemas).forEach((schemaName) => {
    const schema = schemas[schemaName];
    const baseFilename = schemaName.replace("Schema", "");
    const eJsonSchema = getJsonFromMongooseSchema(schema);
    const jsonSchema = prepareJsonSchema(eJsonSchema);

    compile(jsonSchema, baseFilename, {
      bannerComment: `
        /* tslint:disable */
        /**
         * This file was automatically generated by json-schema-to-typescript.
         * DO NOT MODIFY IT BY HAND. Instead, modify the Mongoose schema file,
         * To regenerate this file run $> yarn doc
         */
         const { Types } = require("mongoose");
        `,
      style: packageJson.prettier,
    }).then((ts) => fs.writeFileSync(path.resolve(__dirname, `../../common/model/schema/${baseFilename}.d.ts`), ts));
  });
};

module.exports = { generateTypes };
