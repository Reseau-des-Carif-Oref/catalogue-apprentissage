const { Formation } = require("../../common/model/index");

const KEEP_HISTORY_DAYS_LIMIT = 100;

const updateTagsHistory = async (scope) => {
  await Formation.updateMany(
    { [`${scope}_history`]: null },
    {
      $set: {
        [`${scope}_history`]: [],
      },
    }
  );
  await Formation.updateMany({}, [
    {
      $set: {
        [`${scope}_history`]: {
          $concatArrays: [`$${scope}_history`, [{ [scope]: `$${scope}`, date: new Date() }]],
        },
      },
    },
  ]);

  // keep only the last N entries in history
  await Formation.updateMany(
    {},
    {
      $push: {
        [`${scope}_history`]: {
          $each: [],
          $slice: -KEEP_HISTORY_DAYS_LIMIT,
        },
      },
    }
  );
};

module.exports = { updateTagsHistory };
