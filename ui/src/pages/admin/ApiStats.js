import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  Spinner,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";
import { _get } from "../../common/httpClient";

const statusColor = (code) => {
  if (code >= 500) return "red";
  if (code >= 400) return "orange";
  if (code >= 300) return "yellow";
  if (code >= 200) return "green";
  return "gray";
};

const formatDate = (date) => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (e) {
    return "-";
  }
};

const thStyle = {
  padding: "8px",
  textAlign: "left",
  borderBottom: "1px solid #E2E8F0",
  background: "#F7FAFC",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #EDF2F7",
  verticalAlign: "top",
};

const ApiStats = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, nombre_de_page: 1, total: 0, resultats_par_page: 50 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ endpoint: "", consommateur: "", methode: "", code_http: "" });
  const [appliedFilters, setAppliedFilters] = useState({
    endpoint: "",
    consommateur: "",
    methode: "",
    code_http: "",
  });

  const title = "Statistiques API";

  useEffect(() => {
    setTitle(title);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(page),
          limit: "50",
        });

        if (appliedFilters.endpoint) params.set("endpoint", appliedFilters.endpoint);
        if (appliedFilters.consommateur) params.set("consommateur", appliedFilters.consommateur);
        if (appliedFilters.methode) params.set("methode", appliedFilters.methode);
        if (appliedFilters.code_http) params.set("code_http", appliedFilters.code_http);

        const response = await _get(`/api/v1/admin/apistats?${params.toString()}`);
        if (cancelled) return;

        setRows(Array.isArray(response && response.apistats) ? response.apistats : []);
        setPagination(
          (response && response.pagination) || { page: 1, nombre_de_page: 1, total: 0, resultats_par_page: 50 }
        );
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        if (err.statusCode === 401) {
          setError("Session expirée ou non authentifié. Reconnectez-vous.");
        } else if (err.statusCode === 403) {
          setError("Accès interdit. Permissions administrateur ou ACL page_apistats requises.");
        } else {
          setError("Impossible de charger les statistiques API : " + (err.message || err));
        }
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [page, appliedFilters]);

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const resetFilters = () => {
    const empty = { endpoint: "", consommateur: "", methode: "", code_http: "" };
    setFilters(empty);
    setAppliedFilters(empty);
    setPage(1);
  };

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
          <Heading textStyle="h2" color="grey.800" mt={5} mb={4}>
            {title}
          </Heading>
          <Text color="grey.600" mb={6}>
            Journal des appels HTTP (collection apistats), tri du plus récent au plus ancien.
          </Text>

          <Flex wrap="wrap" mb={4} align="flex-end">
            <Box mr={3} mb={2}>
              <Text fontSize="sm" mb={1}>
                Endpoint
              </Text>
              <Input
                size="sm"
                w="260px"
                placeholder="/api/entity/..."
                value={filters.endpoint}
                onChange={(e) => setFilters((f) => ({ ...f, endpoint: e.target.value }))}
              />
            </Box>
            <Box mr={3} mb={2}>
              <Text fontSize="sm" mb={1}>
                Consommateur
              </Text>
              <Input
                size="sm"
                w="200px"
                placeholder="email"
                value={filters.consommateur}
                onChange={(e) => setFilters((f) => ({ ...f, consommateur: e.target.value }))}
              />
            </Box>
            <Box mr={3} mb={2}>
              <Text fontSize="sm" mb={1}>
                Méthode
              </Text>
              <Select
                size="sm"
                w="120px"
                value={filters.methode}
                onChange={(e) => setFilters((f) => ({ ...f, methode: e.target.value }))}
              >
                <option value="">Toutes</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </Select>
            </Box>
            <Box mr={3} mb={2}>
              <Text fontSize="sm" mb={1}>
                Code HTTP
              </Text>
              <Input
                size="sm"
                w="100px"
                type="number"
                placeholder="200"
                value={filters.code_http}
                onChange={(e) => setFilters((f) => ({ ...f, code_http: e.target.value }))}
              />
            </Box>
            <Flex mb={2}>
              <Button size="sm" colorScheme="blue" mr={2} onClick={applyFilters}>
                Filtrer
              </Button>
              <Button size="sm" variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </Flex>
          </Flex>

          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {loading ? (
            <Flex direction="column" align="center" py={10}>
              <Spinner size="xl" mb={4} />
              <Text>Chargement des statistiques...</Text>
            </Flex>
          ) : (
            <Box>
              <Text fontSize="sm" color="grey.600" mb={2}>
                {pagination.total} résultat{pagination.total > 1 ? "s" : ""} - page {pagination.page} /{" "}
                {pagination.nombre_de_page}
              </Text>

              <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Méthode</th>
                      <th style={thStyle}>Endpoint</th>
                      <th style={thStyle}>Code</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>Durée (ms)</th>
                      <th style={thStyle}>Consommateur</th>
                      <th style={thStyle}>IP</th>
                      <th style={thStyle}>User-Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "#718096", padding: "16px" }}>
                          Aucun appel enregistré pour ces critères.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row, index) => (
                        <tr key={row._id || "row-" + index}>
                          <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatDate(row.date_appel)}</td>
                          <td style={tdStyle}>
                            <Badge>{row.methode}</Badge>
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              maxWidth: "320px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={row.endpoint}
                          >
                            {row.endpoint}
                          </td>
                          <td style={tdStyle}>
                            <Badge colorScheme={statusColor(row.code_http)}>{row.code_http}</Badge>
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{row.duree_ms}</td>
                          <td style={tdStyle}>
                            {row.consommateur ? (
                              row.consommateur
                            ) : (
                              <Text as="span" color="grey.500">
                                public
                              </Text>
                            )}
                          </td>
                          <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{row.ip_client || "-"}</td>
                          <td
                            style={{
                              ...tdStyle,
                              maxWidth: "200px",
                              fontSize: "12px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={row.user_agent || ""}
                          >
                            {row.user_agent || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Box>

              <Flex justify="space-between" align="center" mt={4}>
                <Button size="sm" isDisabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Précédent
                </Button>
                <Text fontSize="sm">
                  Page {pagination.page} / {pagination.nombre_de_page}
                </Text>
                <Button size="sm" isDisabled={page >= pagination.nombre_de_page} onClick={() => setPage((p) => p + 1)}>
                  Suivant
                </Button>
              </Flex>
            </Box>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default ApiStats;
