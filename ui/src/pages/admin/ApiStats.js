import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
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
  if (!date) return "—";
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
    return "—";
  }
};

const emptyFilters = { endpoint: "", consommateur: "", methode: "", code_http: "" };

const ApiStats = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, nombre_de_page: 1, total: 0, resultats_par_page: 50 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

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

        setRows(Array.isArray(response?.apistats) ? response.apistats : []);
        setPagination(
          response?.pagination || { page: 1, nombre_de_page: 1, total: 0, resultats_par_page: 50 }
        );
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        if (err.statusCode === 401) {
          setError("Session expirée ou non authentifié. Reconnectez-vous.");
        } else if (err.statusCode === 403) {
          setError("Accès interdit. Permissions administrateur ou ACL « page_apistats » requises.");
        } else {
          setError(`Impossible de charger les statistiques API : ${err.message || err}`);
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
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title }]} />
          <Heading textStyle="h2" color="grey.800" mt={5} mb={4}>
            {title}
          </Heading>
          <Text color="grey.600" mb={6}>
            Journal des appels HTTP (collection apistats) — tri du plus récent au plus ancien.
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
            <HStack mb={2}>
              <Button size="sm" colorScheme="blue" onClick={applyFilters}>
                Filtrer
              </Button>
              <Button size="sm" variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </HStack>
          </Flex>

          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {loading ? (
            <VStack py={10}>
              <Spinner size="xl" />
              <Text>Chargement des statistiques...</Text>
            </VStack>
          ) : (
            <>
              <Text fontSize="sm" color="grey.600" mb={2}>
                {pagination.total} résultat{pagination.total > 1 ? "s" : ""} — page {pagination.page} /{" "}
                {pagination.nombre_de_page}
              </Text>

              <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
                <Table size="sm" variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Date</Th>
                      <Th>Méthode</Th>
                      <Th>Endpoint</Th>
                      <Th>Code</Th>
                      <Th isNumeric>Durée (ms)</Th>
                      <Th>Consommateur</Th>
                      <Th>IP</Th>
                      <Th>User-Agent</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {rows.length === 0 ? (
                      <Tr>
                        <Td colSpan={8}>
                          <Text py={4} textAlign="center" color="grey.600">
                            Aucun appel enregistré pour ces critères.
                          </Text>
                        </Td>
                      </Tr>
                    ) : (
                      rows.map((row, index) => (
                        <Tr key={row._id || `row-${index}`}>
                          <Td whiteSpace="nowrap">{formatDate(row.date_appel)}</Td>
                          <Td>
                            <Badge>{row.methode}</Badge>
                          </Td>
                          <Td maxW="320px" title={row.endpoint}>
                            <Text fontSize="sm" isTruncated>
                              {row.endpoint}
                            </Text>
                          </Td>
                          <Td>
                            <Badge colorScheme={statusColor(row.code_http)}>{row.code_http}</Badge>
                          </Td>
                          <Td isNumeric>{row.duree_ms}</Td>
                          <Td>
                            {row.consommateur || (
                              <Text as="span" color="grey.500">
                                public
                              </Text>
                            )}
                          </Td>
                          <Td whiteSpace="nowrap">{row.ip_client || "—"}</Td>
                          <Td maxW="200px" title={row.user_agent || ""}>
                            <Text fontSize="xs" isTruncated>
                              {row.user_agent || "—"}
                            </Text>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
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
            </>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default ApiStats;
