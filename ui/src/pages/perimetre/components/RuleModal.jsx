import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { ArrowRightLine, Close } from "../../../theme/components/icons";
import { useFormik } from "formik";
import { StatusSelect } from "./StatusSelect";
import { RuleBuilder } from "./RuleBuilder";
import { ActionsSelect } from "./ActionsSelect";
import { CONDITIONS } from "../../../constants/conditionsIntegration";
import { COMMON_STATUS } from "../../../constants/status";
import { useQuery } from "react-query";
import { _get } from "../../../common/httpClient";
import * as Yup from "yup";

const endpointNewFront = `${process.env.REACT_APP_BASE_URL}/api`;

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const humanReadablekeyMap = {
  regle_complementaire: "Autre(s) critère(s)",
  nom_regle_complementaire: "Nom du diplôme ou titre",
  last_update_who: "Modifié par",
  condition_integration: "Condition d'intégration",
  statut: "Règle de publication",
  diplome: "Type de diplôme ou titre",
  niveau: "Niveau",
};

const UpdatesHistory = ({ label, value }) => {
  return (
    <Flex flexDirection={"column"} w={"full"} h={"full"}>
      <Text mb={1}>{label} :</Text>
      <Flex p={2} bg={"grey.750"} color="grey.100" h={"full"} flexDirection={"column"}>
        {Object.entries(value)
          .filter(([key]) => key !== "regle_complementaire_query")
          .map(([key, value]) => (
            <Text as={"span"} key={key} overflowWrap={"anywhere"}>
              <strong>{humanReadablekeyMap[key] ?? key}:</strong> "{value}"
            </Text>
          ))}
      </Flex>
    </Flex>
  );
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Veuillez saisir le nom du diplôme ou titre"),
  status: Yup.string().required("Veuillez choisir une règle de publication"),
  condition: Yup.string().required("Veuillez choisir une condition d'intégration"),
  niveau: Yup.string().required("Veuillez choisir un niveau"),
  diplome: Yup.string().required("Veuillez choisir un diplôme"),
  duration: Yup.number().nullable(),
});

const RuleModal = ({ isOpen, onClose, rule, onUpdateRule, onDeleteRule, onCreateRule, plateforme }) => {
  const isCreating = !rule;

  const {
    _id: idRule,
    diplome,
    regle_complementaire,
    regle_complementaire_query,
    nom_regle_complementaire,
    updates_history,
    statut,
    condition_integration = "",
    niveau,
    duree,
  } = rule ?? {};

  const initialRef = React.useRef();

  const { values, handleChange, handleSubmit, isSubmitting, setFieldValue, resetForm, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: nom_regle_complementaire,
      status: statut,
      regle: regle_complementaire,
      query: regle_complementaire_query,
      condition: condition_integration,
      niveau: niveau,
      diplome: diplome,
      duration: duree ?? "",
    },
    validationSchema: validationSchema,
    onSubmit: ({ name, status, regle, condition, niveau, diplome, duration, query }) => {
      return new Promise(async (resolve) => {
        if (idRule) {
          await onUpdateRule({
            _id: idRule,
            niveau,
            diplome,
            nom_regle_complementaire: name,
            statut: status,
            regle_complementaire: regle,
            regle_complementaire_query: query,
            condition_integration: condition,
            duree: duration ? Number(duration) : null,
          });
        } else {
          await onCreateRule({
            plateforme,
            niveau,
            diplome,
            nom_regle_complementaire: name,
            statut: status,
            regle_complementaire: regle,
            regle_complementaire_query: query,
            condition_integration: condition,
            duree: duration ? Number(duration) : null,
          });
        }

        resetForm();
        onClose();
        resolve("onSubmitHandler rule update complete");
      });
    },
  });

  const close = () => {
    resetForm();
    onClose();
  };

  const niveauxURL = `${endpointNewFront}/v1/entity/perimetre/niveau`;
  const { data: niveauxData } = useQuery("niveaux", () => _get(niveauxURL, false), {
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return (
    <Modal isOpen={isOpen} onClose={close} size="5xl" initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent bg="white" color="primaryText" borderRadius="none" ref={initialRef}>
        <Button
          display={"flex"}
          alignSelf={"flex-end"}
          color="bluefrance"
          fontSize={"epsilon"}
          onClick={close}
          variant="unstyled"
          p={8}
          fontWeight={400}
        >
          fermer{" "}
          <Text as={"span"} ml={2}>
            <Close boxSize={4} />
          </Text>
        </Button>
        <ModalHeader px={[4, 16]} pt={[3, 6]} pb={[3, 6]}>
          <Heading as="h2" fontSize="2rem">
            <Flex>
              <Text as={"span"}>
                <ArrowRightLine boxSize={26} />
              </Text>
              <Flex flexDirection={"column"}>
                {isCreating ? (
                  <Text as={"span"} ml={4}>
                    Ajouter un diplôme, un titre ou des formations
                  </Text>
                ) : (
                  <>
                    <Text as={"span"} ml={4}>
                      {values.name}
                    </Text>
                    <Text ml={4} mt={2} as={"span"} fontSize="1rem" fontWeight={400}>
                      Dernière modification le {formatDate(rule.last_update_at)} par {rule.last_update_who}
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
          </Heading>
        </ModalHeader>
        <ModalBody px={[4, 16]} pb={[4, 16]}>
          <Tabs variant="search">
            {!isCreating && (
              <TabList bg="white">
                <Tab>Conditions d'intégration</Tab>
                <Tab>Historique des modifications</Tab>
              </TabList>
            )}

            <TabPanels>
              <TabPanel>
                <Box border="1px solid" borderColor="bluefrance" p={8}>
                  <Flex flexDirection={"column"}>
                    {niveauxData && (
                      <FormControl isInvalid={errors.niveau && touched.niveau} isRequired>
                        <Flex flexDirection={"column"} alignItems={"flex-start"}>
                          <FormLabel htmlFor="niveau">Niveau</FormLabel>
                          <Select
                            id={"niveau"}
                            name={"niveau"}
                            onChange={handleChange}
                            value={values.niveau}
                            w={"auto"}
                            placeholder={"Sélectionnez une option"}
                          >
                            {niveauxData.map(({ niveau: { value } }) => {
                              return (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              );
                            })}
                          </Select>
                          <FormErrorMessage>{errors.niveau}</FormErrorMessage>
                        </Flex>
                      </FormControl>
                    )}

                    {niveauxData && (
                      <FormControl isInvalid={errors.diplome && touched.diplome} isRequired>
                        <Flex flexDirection={"column"} alignItems={"flex-start"} mt={8}>
                          <FormLabel htmlFor={"diplome"}>Type de diplôme ou titre</FormLabel>
                          <Select
                            id={"diplome"}
                            name={"diplome"}
                            onChange={handleChange}
                            value={values.diplome}
                            w={"auto"}
                            placeholder={"Sélectionnez une option"}
                          >
                            {niveauxData
                              .find(({ niveau: { value } }) => value === values.niveau)
                              ?.diplomes.map(({ value }) => {
                                return (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                );
                              })}
                          </Select>
                          <FormErrorMessage>{errors.diplome}</FormErrorMessage>
                        </Flex>
                      </FormControl>
                    )}

                    <FormControl isInvalid={errors.duration && touched.duration}>
                      <Flex flexDirection={"column"} mt={8} alignItems={"flex-start"}>
                        <FormLabel htmlFor={"duration"}>Durée (en années)</FormLabel>
                        <NumberInput
                          id="duration"
                          name="duration"
                          size="md"
                          maxW={24}
                          value={values.duration}
                          min={1}
                          max={3}
                          onChange={(value) => {
                            // can't use handleChange since onChange receives directly value and not an Event
                            setFieldValue("duration", value);
                          }}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>

                        <FormErrorMessage>{errors.duration}</FormErrorMessage>
                      </Flex>
                    </FormControl>

                    <Flex flexDirection={"column"} mt={8} alignItems={"flex-start"}>
                      <Text as={"p"} mb={1}>
                        Autre(s) critère(s)
                      </Text>
                      <Box bg={"grey.100"} p={4} borderLeft={"4px solid"} borderColor={"bluefrance"}>
                        <RuleBuilder
                          regle_complementaire_query={values.query}
                          regle_complementaire={values.regle}
                          onQueryChange={(regle, query) => {
                            setFieldValue("regle", regle);
                            setFieldValue("query", query);
                          }}
                        />
                      </Box>
                    </Flex>

                    <FormControl isInvalid={errors.name && touched.name} isRequired>
                      <Flex flexDirection={"column"} mt={16} alignItems={"flex-start"}>
                        <FormLabel htmlFor={"name"}>Nom du diplôme ou titre</FormLabel>
                        <Input id="name" name="name" value={values.name ?? ""} onChange={handleChange} w={"auto"} />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </Flex>
                    </FormControl>

                    <FormControl isInvalid={errors.condition && touched.condition} isRequired>
                      <Flex flexDirection={"column"} mt={8} alignItems={"flex-start"}>
                        <FormLabel htmlFor={"condition"}>Condition d'intégration</FormLabel>
                        <ActionsSelect
                          id={"condition"}
                          name="condition"
                          value={values.condition}
                          onChange={(e) => {
                            if (e.target.value === CONDITIONS.NE_DOIT_PAS_INTEGRER) {
                              setFieldValue("status", COMMON_STATUS.HORS_PERIMETRE);
                            } else {
                              setFieldValue("status", "");
                            }
                            handleChange(e);
                          }}
                          size={"md"}
                          w={"auto"}
                          placeholder={"Sélectionnez une option"}
                        />
                        <FormErrorMessage>{errors.condition}</FormErrorMessage>
                      </Flex>
                    </FormControl>

                    <FormControl isInvalid={errors.status && touched.status} isRequired>
                      <Flex flexDirection={"column"} mt={8} alignItems={"flex-start"}>
                        <FormLabel htmlFor={"status"}>Règle de publication</FormLabel>
                        <StatusSelect
                          id={"status"}
                          name="status"
                          plateforme={plateforme}
                          currentStatus={values.status}
                          condition={values.condition}
                          onChange={handleChange}
                          size={"md"}
                          w={"auto"}
                          placeholder={"Sélectionnez une option"}
                        />
                        <FormErrorMessage>{errors.status}</FormErrorMessage>
                      </Flex>
                    </FormControl>
                  </Flex>
                </Box>

                <Flex justifyContent={isCreating ? "flex-end" : "space-between"} mt={8}>
                  {!isCreating && (
                    <Button
                      variant="outline"
                      colorScheme="red"
                      borderRadius="none"
                      onClick={async () => {
                        await onDeleteRule({
                          _id: idRule,
                        });
                        close();
                      }}
                    >
                      Supprimer
                    </Button>
                  )}
                  <Flex>
                    <Button variant={"secondary"} mr={2} onClick={close}>
                      Annuler
                    </Button>
                    <Button
                      variant={"primary"}
                      type={"submit"}
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                      loadingText="Enregistrement des modifications"
                    >
                      Enregistrer
                    </Button>
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel>
                {!updates_history?.length && (
                  <Text>Aucune modification depuis la création de cet ensemble de conditions.</Text>
                )}
                {updates_history?.map(({ from, to, updated_at }) => {
                  return (
                    <Box key={updated_at} py={4} borderBottom={"1px solid"} borderColor={"grey.300"}>
                      <Text fontWeight={700} mb={2}>
                        Le {formatDate(updated_at)} à {new Date(updated_at).toLocaleTimeString("fr-FR")} par{" "}
                        {to.last_update_who ?? rule.last_update_who}
                      </Text>
                      <Flex>
                        <Flex flexBasis={"50%"} pr={2}>
                          <UpdatesHistory label={"Avant"} value={from} />
                        </Flex>
                        <Flex flexBasis={"50%"} pl={2} flexDirection={"column"}>
                          <UpdatesHistory label={"Après"} value={to} />
                        </Flex>
                      </Flex>
                    </Box>
                  );
                })}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { RuleModal };
