const { runScript } = require("./scriptWrapper");
const logger = require("../common/logger");
const rcoImporter = require("./rcoImporter");
const rcoConverter = require("./rcoConverter");
const pSupLoader = require("./oneshot/pSupTemporary");
const clean = require("./clean");

runScript(async () => {
  try {
    logger.info(`Start all jobs`);
    await clean();
    await rcoImporter();
    await rcoConverter();
    await pSupLoader();
  } catch (error) {
    logger.error(error);
  }
});
