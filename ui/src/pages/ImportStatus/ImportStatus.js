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
      console.log("Fetching import status...");

      const response = await _get("/api/v1/stats/last-mna-import");
      console.log("API Response:", response);

      if (response && response.success) {
        setImportData(response.data);
        console.log("Import data set:", response.data);
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

          {/* Fichier principal */}
          <Box bg={cardBg} shadow="md" borderRadius="md" p={6}>
            <HStack mb={4}>
              <Icon as={DownloadIcon} color="blue.500" />
              <Heading size="md">Dernier fichier importé</Heading>
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
                      ✓ Récupéré depuis les logs
                    </Badge>
                  )}
                </Box>
              </Box>

              {importData?.lastDateTag && (
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Date du fichier (extraite du nom):
                  </Text>
                  <HStack>
                    <Icon as={CalendarIcon} color="blue.500" />
                    <Text fontSize="lg">{formatDateTag(importData.lastDateTag)}</Text>
                  </HStack>
                </Box>
              )}

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Date d'import dans le système:
                </Text>
                <HStack>
                  <Icon as={CalendarIcon} color="green.500" />
                  <Text fontSize="lg">{formatDate(importData?.lastImportDate)}</Text>
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* Statistiques principales */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
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
                <StatLabel>Formations dans le rapport</StatLabel>
                <StatNumber>{importData?.totalDualControlFormations?.toLocaleString("fr-FR") || 0}</StatNumber>
                <StatHelpText>Dernier rapport d'import</StatHelpText>
              </Stat>
            </Box>

            <Box bg={statBg} p={4} borderRadius="md">
              <Stat>
                <StatLabel>Taille du fichier</StatLabel>
                <StatNumber fontSize="lg">{importData?.fileSize || "N/A"}</StatNumber>
                <StatHelpText>Estimation basée sur le nombre d'entrées</StatHelpText>
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

          {/* Indicateurs de qualité des données */}
          <Box bg={cardBg} shadow="md" borderRadius="md" p={6}>
            <HStack mb={4}>
              <Icon as={InfoIcon} color="green.500" />
              <Heading size="md">Qualité des données</Heading>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {importData?.dataQuality?.completeness || "N/A"}%
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Complétude des données
                </Text>
              </Box>
              <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {importData?.dataQuality?.uniqueEstablishments || "N/A"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Établissements uniques
                </Text>
              </Box>
              <Box textAlign="center" p={4} bg={statBg} borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {importData?.dataQuality?.averageFormationsPerEstablishment || "N/A"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Formations/établissement (moy.)
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
                <Text fontWeight="bold">Fréquence d'import:</Text>
                <Badge colorScheme="blue">{importData?.importFrequency || "Non déterminée"}</Badge>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Dernier import réussi:</Text>
                <Text>{formatDate(importData?.lastSuccessfulImport)}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Nombre d'imports ce mois:</Text>
                <Badge colorScheme="green">{importData?.importsThisMonth || 0}</Badge>
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
                Le nom du fichier est récupéré depuis les logs d'import du système. Si aucun log n'est trouvé, il est
                reconstitué à partir des tags présents dans les données. La date d'import correspond au moment où les
                données ont été insérées dans la base MongoDB.
              </AlertDescription>
            </Box>
          </Alert>
        </VStack>
      </Container>
    </Layout>
  );
};

export default ImportStatus;
