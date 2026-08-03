const assert = require("assert");
const httpTests = require("../../utils/httpTests");
const { ApiStat } = require("../../../src/common/model");

const waitForApiStat = async (query, { timeoutMs = 3000, intervalMs = 50 } = {}) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const doc = await ApiStat.findOne(query).lean();
    if (doc) {
      return doc;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`ApiStat document not found for query ${JSON.stringify(query)}`);
};

httpTests(__filename, ({ startServer }) => {
  it("Doit enregistrer un document apistats pour un appel public avec un endpoint normalisé", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/v1/entity/formation/test-id-stats");

    assert.ok([200, 404].includes(response.status));

    const doc = await waitForApiStat({ endpoint: "/api/entity/formation/:id", methode: "GET" });

    assert.strictEqual(doc.endpoint, "/api/entity/formation/:id");
    assert.strictEqual(doc.methode, "GET");
    assert.strictEqual(doc.consommateur, null);
    assert.strictEqual(doc.code_http, response.status);
    assert.ok(typeof doc.duree_ms === "number");
    assert.ok(doc.date_appel instanceof Date || !!doc.date_appel);
  });
});
