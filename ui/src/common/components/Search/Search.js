import React, { useState } from "react";
import { DataSearch, ReactiveBase, ReactiveList, SelectedFilters } from "@appbaseio/reactivesearch";
import { Box, Container, Flex, FormLabel, Switch, Text } from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";
import { hasOneOfRoles } from "../../utils/rolesUtils";
import {
  CardListEtablissements,
  CardListFormation,
  CardListPsFormations,
  ExportButton,
  Facet,
  HardFilters,
  QueryBuilder,
} from "./components";
import constantsRcoFormations from "./constantsRCOFormations";
import constantsEtablissements from "./constantsEtablissements";
import constantsReconciliationPS from "./constantsReconciliationPS";
import "./search.css";
import queryString from "query-string";

export default React.memo(({ match, location, searchState, context, onReconciliationCardClicked }) => {
  const { defaultMode } = queryString.parse(location.search);
  const [mode, setMode] = useState(defaultMode ?? "simple");
  const isCatalogueGeneral = context === "catalogue_general";
  const {
    base,
    countEtablissement,
    countCatalogueGeneral,
    countCatalogueNonEligible,
    isBaseFormations,
    isBaseReconciliationPs,
    endpoint,
  } = searchState;

  let [auth] = useAuth();

  const { FILTERS, facetDefinition, queryBuilderField, dataSearch, columnsDefinition } = isBaseFormations
    ? constantsRcoFormations
    : isBaseReconciliationPs
    ? constantsReconciliationPS
    : constantsEtablissements;

  const filters = FILTERS(context);

  const handleSearchSwitchChange = () => {
    setMode((prevValue) => (prevValue === "simple" ? "advanced" : "simple"));
  };

  return (
    <Box className="search-page">
      <ReactiveBase
        url={`${endpoint}/es/search`}
        app={base}
        theme={{
          typography: {
            fontFamily: "Marianne, Arial",
          },
        }}
      >
        <HardFilters
          filters={filters}
          context={context}
          isBaseFormations={isBaseFormations}
          isBaseReconciliationPs={isBaseReconciliationPs}
        />
        <Box className="search" maxW="full">
          <Container maxW="xl" p={0}>
            {mode === "simple" && (
              <Box className={`search-container search-container-${mode}`}>
                <DataSearch
                  componentId={`SEARCH-${context}`}
                  placeholder={dataSearch.placeholder}
                  fieldWeights={dataSearch.fieldWeights}
                  dataField={dataSearch.dataField}
                  autosuggest={true}
                  queryFormat="and"
                  size={20}
                  showFilter={true}
                  filterLabel="recherche"
                  react={{ and: filters.filter((e) => e !== `SEARCH-${context}`) }}
                />
              </Box>
            )}
            <Box
              my={4}
              css={{
                "*, *:after, *:before": { boxSizing: "content-box !important" },
              }}
            >
              <Switch
                color="bluefrance"
                onChange={handleSearchSwitchChange}
                defaultIsChecked={mode !== "simple"}
                id={`search-mode-${context}`}
              />
              <FormLabel display="inline" htmlFor={`search-mode-${context}`} textStyle="sm" px={2}>
                Recherche avancée
              </FormLabel>
            </Box>
            {mode !== "simple" && (
              <Box mb={4}>
                <QueryBuilder
                  context={context}
                  lang="fr"
                  collection={base}
                  react={{ and: filters.filter((e) => e !== "QUERYBUILDER") }}
                  fields={queryBuilderField}
                />
              </Box>
            )}
            <Box borderTop="1px solid #E7E7E7" w="full" />
            <Flex className="search-row" flexDirection={["column", "column", "row"]}>
              <Box className="search-sidebar">
                <Text fontWeight="700" color="grey.800" mt={4} mb={4} textStyle="rf-text">
                  FILTRER
                </Text>
                {facetDefinition(context)
                  .filter(
                    ({ roles, showCatalogEligibleOnly }) =>
                      (!showCatalogEligibleOnly || isCatalogueGeneral) && (!roles || hasOneOfRoles(auth, roles))
                  )
                  .map((fd, i) => {
                    return (
                      <Facet
                        key={i}
                        componentId={fd.componentId}
                        dataField={fd.dataField}
                        title={fd.title}
                        filterLabel={fd.filterLabel}
                        selectAllLabel={fd.selectAllLabel}
                        filters={filters}
                        sortBy={fd.sortBy}
                        defaultQuery={
                          !isBaseReconciliationPs
                            ? () => {
                                return {
                                  query: {
                                    match: {
                                      published: true,
                                    },
                                  },
                                };
                              }
                            : null
                        }
                        helpTextSection={fd.helpTextSection}
                      />
                    );
                  })}
              </Box>
              <div className="search-results">
                <Box pt={2}>
                  <SelectedFilters showClearAll={false} innerClass={{ button: "selected-filters-button" }} />
                </Box>
                <Box className={`result-view`}>
                  <ReactiveList
                    componentId="result"
                    title="Results"
                    dataField="_id"
                    loader="Chargement des résultats.."
                    size={8}
                    pagination={true}
                    innerClass={{ pagination: "search-pagination" }}
                    showEndPage={true}
                    showResultStats={true}
                    sortBy="asc"
                    defaultQuery={() => {
                      return {
                        _source: columnsDefinition.map(({ accessor }) => accessor),
                      };
                    }}
                    renderItem={(data) =>
                      isBaseFormations ? (
                        <CardListFormation data={data} key={data._id} />
                      ) : isBaseReconciliationPs ? (
                        <CardListPsFormations
                          data={data}
                          key={data._id}
                          onCardClicked={() => {
                            onReconciliationCardClicked(data);
                          }}
                        />
                      ) : (
                        <CardListEtablissements data={data} key={data._id} />
                      )
                    }
                    renderResultStats={(stats) => {
                      return (
                        <div className="summary-stats">
                          <span className="summary-text">
                            {isBaseFormations
                              ? `${stats.numberOfResults.toLocaleString("fr-FR")} formations sur ${
                                  isCatalogueGeneral
                                    ? countCatalogueGeneral.toLocaleString("fr-FR")
                                    : countCatalogueNonEligible.toLocaleString("fr-FR")
                                } formations `
                              : isBaseReconciliationPs
                              ? `${stats.numberOfResults.toLocaleString("fr-FR")} rapprochements ${context.replace(
                                  "reconciliation_ps_",
                                  ""
                                )}`
                              : `${stats.numberOfResults.toLocaleString(
                                  "fr-FR"
                                )} établissements affichées sur ${countEtablissement.toLocaleString(
                                  "fr-FR"
                                )} établissements`}
                          </span>
                          {auth?.sub !== "anonymous" && !isBaseReconciliationPs && (
                            <ExportButton
                              index={base}
                              filters={filters}
                              columns={columnsDefinition
                                .filter((def) => !def.debug)
                                .map((def) => ({
                                  header: def.Header,
                                  fieldName: def.accessor,
                                  formatter: def.formatter,
                                }))}
                              defaultQuery={{
                                match: {
                                  published: true,
                                },
                              }}
                            />
                          )}
                        </div>
                      );
                    }}
                    react={{ and: filters }}
                  />
                </Box>
              </div>
            </Flex>
          </Container>
        </Box>
      </ReactiveBase>
    </Box>
  );
});
