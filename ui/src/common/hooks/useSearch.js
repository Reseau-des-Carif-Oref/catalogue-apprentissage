import { useState, useEffect } from "react";
import { _get, _post } from "../httpClient";
import { mergedQueries, withUniqueKey, operators } from "../components/Search/components/QueryBuilder/utils";
import { ETABLISSEMENTS_ES_INDEX, FORMATIONS_ES_INDEX } from "../../constants/es";
import { CONTEXT } from "../../constants/context";

const CATALOGUE_API = `${process.env.REACT_APP_BASE_URL}/api/v1`;

/**
 *
 * @param {string} context
 * @returns {ETABLISSEMENTS_ES_INDEX|FORMATIONS_ES_INDEX}
 */
const getEsBase = (context) => {
  if (context === CONTEXT.ORGANISMES) {
    return ETABLISSEMENTS_ES_INDEX;
  }
  return FORMATIONS_ES_INDEX;
};

const esQueryParser = async () => {
  let s = new URLSearchParams(window.location.search);
  s = s.get("qb");
  if (!s) return Promise.resolve(null);

  const initialValue = JSON.parse(decodeURIComponent(s));
  const rules = withUniqueKey(initialValue);
  return mergedQueries(
    rules.map((r) => ({ ...r, query: operators.find((o) => o.value === r.operator).query(r.field, r.value) }))
  );
};

const getEsCount = async (queries) => {
  const countEsQuery = {
    query: { bool: { ...queries, ...(queries?.should?.length > 0 ? { minimum_should_match: 1 } : {}) } },
  };
  return await _post("/api/v1/es/search/formation/_count", countEsQuery);
};

const getCountEntities = async (base) => {
  if (base === ETABLISSEMENTS_ES_INDEX) {
    const params = new window.URLSearchParams({
      query: JSON.stringify({ published: true }),
    });
    const countEtablissement = await _get(`/api/v1/entity/etablissements/count?${params}`, false);
    return {
      countEtablissement,
      countCatalogueGeneral: null,
      countCatalogueNonEligible: null,
    };
  }

  const countCatalogueGeneral = {
    total: 0,
    filtered: null,
  };
  const countCatalogueNonEligible = {
    total: 0,
    filtered: null,
  };

  const esQueryParameter = await esQueryParser();
  if (esQueryParameter) {
    esQueryParameter.must.push({
      match: {
        published: true,
      },
    });

    const esQueryParameterCatalogueGeneral = {
      ...esQueryParameter,
      must: [...esQueryParameter.must],
    };
    esQueryParameterCatalogueGeneral.must.push({
      match: { catalogue_published: true },
    });
    const { count: countEsCatalogueGeneral } = await getEsCount(esQueryParameterCatalogueGeneral);
    countCatalogueGeneral.filtered = countEsCatalogueGeneral;

    const esQueryParameterCatalogueNonEligible = {
      ...esQueryParameter,
      must: [...esQueryParameter.must],
    };
    esQueryParameterCatalogueNonEligible.must.push({
      match: { catalogue_published: false },
    });
    const { count: countEsCatalogueNonEligible } = await getEsCount(esQueryParameterCatalogueNonEligible);
    countCatalogueNonEligible.filtered = countEsCatalogueNonEligible;
  }

  const { count: countTotalCatalogueGeneral } = await getEsCount({
    must: [{ match: { catalogue_published: true } }, { match: { published: true } }],
  });
  countCatalogueGeneral.total = countTotalCatalogueGeneral;

  const { count: countTotalCatalogueNonEligible } = await getEsCount({
    must: [{ match: { catalogue_published: false } }, { match: { published: true } }],
  });
  countCatalogueNonEligible.total = countTotalCatalogueNonEligible;

  return {
    countEtablissement: 0,
    countCatalogueGeneral,
    countCatalogueNonEligible,
  };
};

/**
 *
 * @param {string} context
 * @returns
 */
export function useSearch(context) {
  const base = getEsBase(context);
  const isBaseFormations = base === FORMATIONS_ES_INDEX;
  const endpoint = CATALOGUE_API;
  const [searchState, setSearchState] = useState({
    loaded: false,
    base,
    count: 0,
    isBaseFormations,
    endpoint,
  });

  const [error, setError] = useState(null);
  useEffect(() => {
    const abortController = new AbortController();

    getCountEntities(base)
      .then((resultCount) => {
        if (!abortController.signal.aborted) {
          setSearchState({
            loaded: true,
            base,
            isBaseFormations,
            endpoint,
            ...resultCount,
          });
        }
      })
      .catch((e) => {
        if (!abortController.signal.aborted) {
          setError(e);
        }
      });
    return () => {
      abortController.abort();
    };
  }, [base, endpoint, isBaseFormations]);

  if (error !== null) {
    throw error;
  }

  return searchState;
}
