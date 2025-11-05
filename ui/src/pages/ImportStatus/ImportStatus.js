import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { CalendarIcon, InfoIcon, DownloadIcon } from "@chakra-ui/icons";
import Layout from "../layout/Layout";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";
import { _get } from "../../common/httpClient";

const ImportStatus = () => {
  const [importData, setImportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardBg = useColorModeValue("white", "gray.700");
  const statBg = useColorModeValue("gray.50", "gray.600");

  useEffect(() => {
    setTitle("Statut des imports MNA");
    fetchImportStatus();
  }, []);

  const fetchImportStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await _get("/api/v1/stats/last-mna-import");

      if (response && response.success) {
        setImportData(response.data);
      } else {
        const errorMsg = response?.error || "Erreur lors de la récupération des données";
        console.error("API Error:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Erreur API complète:", err);

      // Gestion spécifique des erreurs d'autorisation
      if (err.response?.status === 401) {
        setError("Accès non autorisé. Vous devez avoir les permissions administrateur.");
      } else if (err.response?.status === 403) {
        setError("Accès interdit. Permissions insuffisantes.");
      } else {
        setError(`Impossible de récupérer les informations d'import: ${err.message || err}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Non disponible";
    try {
      return new Date(date).toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erreur formatage date:", error);
      return "Format invalide";
    }
  };

  const formatDateTag = (dateTag) => {
    if (!dateTag || typeof dateTag !== "string" || dateTag.length !== 8) return dateTag || "Non disponible";
    try {
      const year = dateTag.substring(0, 4);
      const month = dateTag.substring(4, 6);
      const day = dateTag.substring(6, 8);
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Erreur formatage date tag:", error);
      return dateTag;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Chargement des informations d'import...</Text>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Erreur!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: "Statut des imports MNA" }]} />

        <VStack spacing={6} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Statut des imports MNA
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Informations sur le dernier fichier catalogue MNA importé
            </Text>
          </Box>

          {/* Catalogue Formations */}
          <Box bg={cardBg} shadow="md" borderRadius="md" p={6}>
            <HStack mb={4}>
              <Icon as={InfoIcon} color="green.500" />
              <Heading size="md">Catalogue des formations</Heading>
            </HStack>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={3}>
                  Nom du fichier indexé:
                </Text>
                <Box
                  bg={importData?.actualFileName ? "green.50" : "gray.50"}
                  border="1px solid"
                  borderColor={importData?.actualFileName ? "green.200" : "gray.200"}
                  borderRadius="md"
                  p={3}
                >
                  <Text
                    fontFamily="mono"
                    fontSize="sm"
                    fontWeight="semibold"
                    color={importData?.actualFileName ? "green.800" : "gray.600"}
                    wordBreak="break-all"
                  >
                    {importData?.actualFileName || "Nom non déterminé"}
                  </Text>
                  {importData?.actualFileName && (
                    <Badge colorScheme="green" size="sm" mt={2} variant="subtle">
                      ✓ Récupéré depuis les logs système
                    </Badge>
                  )}
                </Box>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Date d'import dans le système:
                </Text>
                <HStack>
                  <Icon as={CalendarIcon} color="green.500" />
                  <Text fontSize="lg">{formatDate(importData?.lastImportDate)}</Text>
                </HStack>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {importData?.totalFormations?.toLocaleString("fr-FR") || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Total formations
                  </Text>
                </Box>

                <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    {importData?.importsThisMonth || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Imports ce mois
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Catalogue Établissements */}
          <Box bg={cardBg} shadow="md" borderRadius="md" p={6}>
            <HStack mb={4}>
              <Icon as={InfoIcon} color="purple.500" />
              <Heading size="md">Catalogue des établissements</Heading>
            </HStack>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={3}>
                  Nom du fichier indexé:
                </Text>
                <Box
                  bg={importData?.actualEtablissementFileName ? "purple.50" : "gray.50"}
                  border="1px solid"
                  borderColor={importData?.actualEtablissementFileName ? "purple.200" : "gray.200"}
                  borderRadius="md"
                  p={3}
                >
                  <Text
                    fontFamily="mono"
                    fontSize="sm"
                    fontWeight="semibold"
                    color={importData?.actualEtablissementFileName ? "purple.800" : "gray.600"}
                    wordBreak="break-all"
                  >
                    {importData?.actualEtablissementFileName || "Nom non déterminé"}
                  </Text>
                  {importData?.actualEtablissementFileName && (
                    <Badge colorScheme="purple" size="sm" mt={2} variant="subtle">
                      ✓ Récupéré depuis les logs système
                    </Badge>
                  )}
                </Box>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Date d'import dans le système:
                </Text>
                <HStack>
                  <Icon as={CalendarIcon} color="purple.500" />
                  <Text fontSize="lg">{formatDate(importData?.lastEtablissementImportDate)}</Text>
                </HStack>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                    {importData?.totalEtablissements?.toLocaleString("fr-FR") || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Total établissements
                  </Text>
                </Box>

                <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    {importData?.etablissementImportsThisMonth || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Imports ce mois
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Statistiques principales */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box bg={statBg} p={4} borderRadius="md">
              <Stat>
                <StatLabel>Total formations importées</StatLabel>
                <StatNumber>{importData?.totalFormations?.toLocaleString("fr-FR") || 0}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Formations dans DualControl
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={statBg} p={4} borderRadius="md">
              <Stat>
                <StatLabel>Total établissements importés</StatLabel>
                <StatNumber>{importData?.totalEtablissements?.toLocaleString("fr-FR") || 0}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Établissements dans DualControl
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={statBg} p={4} borderRadius="md">
              <Stat>
                <StatLabel>Âge des données</StatLabel>
                <StatNumber fontSize="lg" color={importData?.dataAge?.color || "gray.500"}>
                  {importData?.dataAge?.text || "N/A"}
                </StatNumber>
                <StatHelpText>Depuis le dernier import</StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>

          {/* Tailles des fichiers */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box bg={statBg} p={4} borderRadius="md">
              <Stat>
                <StatLabel>Taille du fichier formation</StatLabel>
                <StatNumber fontSize="lg">{importData?.fileSize || "N/A"}</StatNumber>
                <StatHelpText>Estimation basée sur le nombre d'entrées</StatHelpText>
              </Stat>
            </Box>

            <Box bg={statBg} p={4} borderRadius="md">
              <Stat>
                <StatLabel>Taille du fichier établissement</StatLabel>
                <StatNumber fontSize="lg">{importData?.etablissementFileSize || "N/A"}</StatNumber>
                <StatHelpText>Estimation basée sur le nombre d'entrées</StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>

          {/* Répartition des formations */}
          <Box bg={cardBg} shadow="md" borderRadius="md" p={6}>
            <HStack mb={4}>
              <Icon as={InfoIcon} color="blue.500" />
              <Heading size="md">Répartition des formations</Heading>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {importData?.formationsNonEligibles?.toLocaleString("fr-FR") || 0}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Formations non éligibles
                </Text>
                <Text fontSize="xs" color="gray.500">
                  catalogue_published=False + published=True
                </Text>
              </Box>

              <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {importData?.formationsEligibles?.toLocaleString("fr-FR") || 0}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Formations éligibles
                </Text>
                <Text fontSize="xs" color="gray.500">
                  catalogue_published=True + published=True
                </Text>
              </Box>

              <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {importData?.totalFormationsPubliees?.toLocaleString("fr-FR") || 0}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total formations publiées
                </Text>
                <Text fontSize="xs" color="gray.500">
                  published=True
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Historique des imports */}
          <Box bg={cardBg} shadow="md" borderRadius="md" p={6}>
            <HStack mb={4}>
              <Icon as={CalendarIcon} color="orange.500" />
              <Heading size="md">Historique des imports</Heading>
            </HStack>
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Dernier import réussi:</Text>
                <Text>{formatDate(importData?.lastSuccessfulImport)}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Imports formations ce mois:</Text>
                <Badge colorScheme="green">{importData?.importsThisMonth || 0}</Badge>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Imports établissements ce mois:</Text>
                <Badge colorScheme="purple">{importData?.etablissementImportsThisMonth || 0}</Badge>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Statut du système:</Text>
                <Badge colorScheme={importData?.systemStatus?.color || "gray"}>
                  {importData?.systemStatus?.text || "Inconnu"}
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Métadonnées techniques */}
          <Box bg={cardBg} shadow="md" borderRadius="md" p={6}>
            <HStack mb={4}>
              <Icon as={InfoIcon} color="blue.500" />
              <Heading size="md">Informations techniques</Heading>
            </HStack>
            <VStack align="start" spacing={3}>
              <Box>
                <Text fontWeight="bold">ID de la dernière formation:</Text>
                <Text fontFamily="mono" fontSize="sm" color="gray.600">
                  {importData?.lastFormationId || "Non disponible"}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold">ID du dernier établissement:</Text>
                <Text fontFamily="mono" fontSize="sm" color="gray.600">
                  {importData?.lastEtablissementId || "Non disponible"}
                </Text>
              </Box>

              {importData?.metadata?.lastFormationTags?.length > 0 && (
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Tags de la dernière formation:
                  </Text>
                  <HStack wrap="wrap">
                    {importData.metadata.lastFormationTags.map((tag, index) => (
                      <Badge key={index} colorScheme="blue" variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              )}

              {importData?.metadata?.reportDiscriminator && (
                <Box>
                  <Text fontWeight="bold">Discriminateur du rapport:</Text>
                  <Badge colorScheme="purple">{importData.metadata.reportDiscriminator}</Badge>
                </Box>
              )}
            </VStack>
          </Box>

          {/* Note d'information */}
          <Alert status="info">
            <AlertIcon />
            <Box>
              <AlertTitle>Information!</AlertTitle>
              <AlertDescription>
                Le nom du fichier est récupéré directement depuis les logs système (/var/log/) en utilisant la même
                commande grep que celle utilisée en ligne de commande. En cas d'échec, le système utilise les logs
                MongoDB puis reconstitue le nom à partir des tags. La date d'import correspond au moment où les données
                ont été insérées dans la base MongoDB.
              </AlertDescription>
            </Box>
          </Alert>
        </VStack>
      </Container>
    </Layout>
  );
};

export default ImportStatus;
