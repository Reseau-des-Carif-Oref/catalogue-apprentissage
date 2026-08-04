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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Progress,
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

const formatJour = (jour) => {
  if (!jour) return "-";
  try {
    const [y, m, d] = jour.split("-");
    return `${d}/${m}`;
  } catch (e) {
    return jour;
  }
};

const formatNombre = (n) => {
  return new Intl.NumberFormat("fr-FR").format(n || 0);
};

/** Libellés métier pour les non-techniciens */
const labelService = (endpoint) => {
  if (!endpoint) return "Service inconnu";
  const rules = [
    [/\/entity\/formations?\/count/, "Comptage des formations"],
    [/\/entity\/formations?\.json/, "Export des formations"],
    [/\/entity\/formation\/:/, "Fiche détail d'une formation"],
    [/\/entity\/formations?/, "Recherche de formations"],
    [/\/entity\/etablissements?\/count/, "Comptage des organismes"],
    [/\/entity\/etablissement\/:/, "Fiche détail d'un organisme"],
    [/\/entity\/etablissements?/, "Recherche d'organismes"],
    [/\/entity\/reports?/, "Rapports d'import"],
    [/\/entity\/alert/, "Messages de maintenance"],
    [/\/es\/search/, "Recherche avancée"],
    [/\/search/, "Recherche multi-critères"],
    [/\/auth/, "Connexion / session"],
    [/\/admin\/apistats/, "Consultation des statistiques API"],
    [/\/admin/, "Administration"],
    [/\/upload/, "Dépôt de fichiers"],
    [/\/stats/, "Statistiques métier"],
    [/\/password/, "Mot de passe"],
  ];
  for (let i = 0; i < rules.length; i++) {
    if (rules[i][0].test(endpoint)) return rules[i][1];
  }
  return endpoint.replace(/^\/api/, "") || endpoint;
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

const KpiCard = ({ titre, valeur, aide, color }) => (
  <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} bg="white" minW="160px" flex="1">
    <Text fontSize="sm" color="grey.600" mb={1}>
      {titre}
    </Text>
    <Text fontSize="2xl" fontWeight="700" color={color || "grey.800"}>
      {valeur}
    </Text>
    {aide && (
      <Text fontSize="xs" color="grey.500" mt={1}>
        {aide}
      </Text>
    )}
  </Box>
);

const BarList = ({ items, max, labelKey, valueKey, renderLabel }) => {
  const ceiling = max || 1;
  return (
    <Box>
      {items.length === 0 ? (
        <Text color="grey.500">Aucune donnée sur la période.</Text>
      ) : (
        items.map((item, index) => {
          const value = item[valueKey] || 0;
          const pct = Math.max(2, Math.round((value / ceiling) * 100));
          return (
            <Box key={(item[labelKey] || "") + index} mb={3}>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="500" mr={2}>
                  {renderLabel ? renderLabel(item) : item[labelKey]}
                </Text>
                <Text fontSize="sm" color="grey.600" whiteSpace="nowrap">
                  {formatNombre(value)}
                </Text>
              </Flex>
              <Progress value={pct} size="sm" colorScheme="blue" borderRadius="full" />
            </Box>
          );
        })
      )}
    </Box>
  );
};

const VueSimple = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jours, setJours] = useState(7);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await _get(`/api/v1/admin/apistats/summary?jours=${jours}`);
        if (!cancelled) setSummary(data);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        if (err.statusCode === 401) {
          setError("Session expirée ou non authentifié. Reconnectez-vous.");
        } else if (err.statusCode === 403) {
          setError("Accès interdit. Permissions administrateur ou ACL page_apistats requises.");
        } else {
          setError("Impossible de charger la synthèse : " + (err.message || err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [jours]);

  if (loading) {
    return (
      <Flex direction="column" align="center" py={10}>
        <Spinner size="xl" mb={4} />
        <Text>Chargement de la synthèse...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!summary) return null;

  const maxJour = Math.max.apply(
    null,
    (summary.par_jour || []).map((j) => j.total).concat([1])
  );
  const maxService = Math.max.apply(
    null,
    (summary.top_services || []).map((s) => s.total).concat([1])
  );
  const maxUser = Math.max.apply(
    null,
    (summary.top_utilisateurs || []).map((u) => u.total).concat([1])
  );

  const sante =
    summary.taux_erreur < 2 ? "Très bon" : summary.taux_erreur < 5 ? "Correct" : summary.taux_erreur < 15 ? "À surveiller" : "Dégradé";
  const santeColor =
    summary.taux_erreur < 2 ? "green.600" : summary.taux_erreur < 5 ? "blue.600" : summary.taux_erreur < 15 ? "orange.500" : "red.500";

  return (
    <Box>
      <Flex wrap="wrap" align="center" mb={4}>
        <Text mr={3} fontSize="sm" color="grey.600">
          Période analysée :
        </Text>
        <Select size="sm" w="180px" value={jours} onChange={(e) => setJours(Number(e.target.value))}>
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>90 derniers jours</option>
        </Select>
      </Flex>

      <Text color="grey.600" mb={4}>
        Voici l&apos;usage de l&apos;API du catalogue, expliqué simplement : combien de personnes ou services
        l&apos;utilisent, si cela fonctionne bien, et quelles informations sont le plus consultées.
      </Text>

      <Flex wrap="wrap" mb={6} style={{ gap: "12px" }}>
        <KpiCard
          titre="Consultations aujourd'hui"
          valeur={formatNombre(summary.appels_aujourdhui)}
          aide="Nombre d'appels depuis minuit"
        />
        <KpiCard
          titre={`Sur ${summary.periode_jours} jours`}
          valeur={formatNombre(summary.total_appels)}
          aide="Volume total d'utilisation"
        />
        <KpiCard
          titre="Taux de réussite"
          valeur={`${summary.taux_succes} %`}
          aide="Part des réponses sans erreur"
          color="green.600"
        />
        <KpiCard titre="Santé du service" valeur={sante} aide={`${summary.taux_erreur} % d'erreurs`} color={santeColor} />
        <KpiCard
          titre="Temps de réponse moyen"
          valeur={`${summary.duree_moyenne_ms} ms`}
          aide="Plus le chiffre est bas, plus c'est rapide"
        />
      </Flex>

      <Flex wrap="wrap" mb={6} style={{ gap: "16px" }}>
        <Box flex="1" minW="280px" border="1px solid" borderColor="gray.200" borderRadius="md" p={4} bg="white">
          <Heading as="h3" size="sm" mb={2} color="grey.800">
            Qualité des réponses
          </Heading>
          <Text fontSize="sm" color="grey.600" mb={3}>
            Répartition simple du résultat des consultations.
          </Text>
          <Box mb={2}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm">Tout s&apos;est bien passé</Text>
              <Text fontSize="sm">{formatNombre(summary.repartition.succes)}</Text>
            </Flex>
            <Progress
              value={summary.total_appels ? (summary.repartition.succes / summary.total_appels) * 100 : 0}
              size="sm"
              colorScheme="green"
              borderRadius="full"
            />
          </Box>
          <Box mb={2}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm">Demande incorrecte ou refusée</Text>
              <Text fontSize="sm">{formatNombre(summary.repartition.erreurs_client)}</Text>
            </Flex>
            <Progress
              value={summary.total_appels ? (summary.repartition.erreurs_client / summary.total_appels) * 100 : 0}
              size="sm"
              colorScheme="orange"
              borderRadius="full"
            />
          </Box>
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm">Incident technique</Text>
              <Text fontSize="sm">{formatNombre(summary.repartition.erreurs_serveur)}</Text>
            </Flex>
            <Progress
              value={summary.total_appels ? (summary.repartition.erreurs_serveur / summary.total_appels) * 100 : 0}
              size="sm"
              colorScheme="red"
              borderRadius="full"
            />
          </Box>
        </Box>

        <Box flex="1" minW="280px" border="1px solid" borderColor="gray.200" borderRadius="md" p={4} bg="white">
          <Heading as="h3" size="sm" mb={2} color="grey.800">
            Activité jour par jour
          </Heading>
          <Text fontSize="sm" color="grey.600" mb={3}>
            Volume de consultations sur la période.
          </Text>
          <BarList
            items={summary.par_jour || []}
            max={maxJour}
            labelKey="jour"
            valueKey="total"
            renderLabel={(item) => formatJour(item.jour)}
          />
        </Box>
      </Flex>

      <Flex wrap="wrap" style={{ gap: "16px" }}>
        <Box flex="1" minW="280px" border="1px solid" borderColor="gray.200" borderRadius="md" p={4} bg="white">
          <Heading as="h3" size="sm" mb={2} color="grey.800">
            Services les plus utilisés
          </Heading>
          <Text fontSize="sm" color="grey.600" mb={3}>
            Ce que les utilisateurs consultent le plus.
          </Text>
          <BarList
            items={summary.top_services || []}
            max={maxService}
            labelKey="endpoint"
            valueKey="total"
            renderLabel={(item) => labelService(item.endpoint)}
          />
        </Box>

        <Box flex="1" minW="280px" border="1px solid" borderColor="gray.200" borderRadius="md" p={4} bg="white">
          <Heading as="h3" size="sm" mb={2} color="grey.800">
            Qui utilise l&apos;API ?
          </Heading>
          <Text fontSize="sm" color="grey.600" mb={3}>
            Utilisateurs connectés ou accès public.
          </Text>
          <BarList items={summary.top_utilisateurs || []} max={maxUser} labelKey="consommateur" valueKey="total" />
        </Box>
      </Flex>
    </Box>
  );
};

const JournalDetaille = () => {
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
    <Box>
      <Text color="grey.600" mb={4}>
        Journal technique de chaque appel HTTP (endpoint, code, durée, IP…). Réservé à l&apos;analyse fine.
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
          <Text>Chargement du journal...</Text>
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
    </Box>
  );
};

const ApiStats = () => {
  const title = "Statistiques API";

  useEffect(() => {
    setTitle(title);
  }, []);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
          <Heading textStyle="h2" color="grey.800" mt={5} mb={2}>
            {title}
          </Heading>
          <Text color="grey.600" mb={4}>
            Suivi de l&apos;usage de l&apos;API du catalogue des formations en apprentissage.
          </Text>

          <Tabs variant="search" isLazy mt={2}>
            <TabList bg="white">
              <Tab>Vue d&apos;ensemble</Tab>
              <Tab>Journal détaillé</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0} pt={5}>
                <VueSimple />
              </TabPanel>
              <TabPanel px={0} pt={5}>
                <JournalDetaille />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Layout>
  );
};

export default ApiStats;
