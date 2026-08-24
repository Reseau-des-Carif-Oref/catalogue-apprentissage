import React, { useEffect, useState } from "react";
import { Badge, Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ArrowRightLine } from "../../../theme/components/icons";
import { getOrganisme } from "../../api/organisme";
import { QualiteBadge } from "../QualiteBadge";
import { HabiliteBadge } from "../HabiliteBadge";
import { ActifBadge } from "../ActifBadge";
// Badge liquidation judiciaire temporairement désactivé (à réactiver plus tard)
// import { LiquidationBadge } from "../LiquidationBadge";

export const OrganismesBlock = ({ formation }) => {
  const oneEstablishment = formation.etablissement_gestionnaire_siret === formation.etablissement_formateur_siret;

  const [tagsFormateur, setTagsFormateur] = useState([]);
  const [tagsGestionnaire, setTagsGestionnaire] = useState([]);

  useEffect(() => {
    async function run() {
      if (formation.etablissement_formateur_id) {
        const formateur = await getOrganisme(formation.etablissement_formateur_siret);
        setTagsFormateur(formateur?.tags ?? []);
      }

      if (!oneEstablishment) {
        const gestionnaire = await getOrganisme(formation.etablissement_gestionnaire_siret);
        setTagsGestionnaire(gestionnaire.tags ?? []);
      }
    }

    run();
  }, [oneEstablishment, formation, setTagsFormateur, setTagsGestionnaire]);

  return (
    <>
      <Heading textStyle="h4" color="grey.800" mb={4}>
        {oneEstablishment ? "Organisme responsable et formateur" : ""}
      </Heading>

      {!oneEstablishment && (
        <>
          <Text textStyle="rf-text" color="grey.700" fontWeight="700" mb={3}>
            Organisme responsable
          </Text>
          <Link
            as={NavLink}
            to={`/etablissement/${encodeURIComponent(formation.etablissement_gestionnaire_siret)}`}
            variant="card"
          >
            <Flex display={["none", "flex"]} textStyle="xs" justifyContent="space-between">
              <Text>Siret : {formation.etablissement_gestionnaire_siret}</Text>
              <Text>UAI : {formation.etablissement_gestionnaire_uai}</Text>
            </Flex>
            <Box my={2}>
              <Flex flexWrap="wrap">
                <QualiteBadge value={formation.etablissement_gestionnaire_certifie_qualite} mt={2} mr={[0, 2]} />
                {!formation.catalogue_published &&
                  ["Titre", "TP"].includes(formation.rncp_details?.code_type_certif) && (
                    <HabiliteBadge value={formation.etablissement_gestionnaire_habilite_rncp} mt={2} mr={[0, 2]} />
                  )}
                <ActifBadge value={formation.etablissement_gestionnaire_actif} mt={2} mr={[0, 2]} />
                {/* <LiquidationBadge value={formation.SIRET_Oresp_LJ} mt={2} mr={[0, 2]} /> */}
              </Flex>
            </Box>
            <Heading textStyle="h6" color="grey.800" my={1}>
              {formation.etablissement_gestionnaire_entreprise_raison_sociale}
            </Heading>
            <Box my={1}>
              <Text textStyle="sm">Académie : {formation.etablissement_gestionnaire_nom_academie}</Text>
              <Box>
                <Flex justifyContent={"space-between"}>
                  <Flex flexWrap="wrap">
                    {tagsGestionnaire &&
                      tagsGestionnaire
                        .sort((a, b) => a - b)
                        .map((tag, i) => (
                          <Badge data-testid={"tags-gestionnaire"} variant="year" key={i}>
                            {tag}
                          </Badge>
                        ))}
                  </Flex>
                  <ArrowRightLine alignSelf="center" color="bluefrance" />
                </Flex>
              </Box>
            </Box>
          </Link>
        </>
      )}

      {!oneEstablishment && formation.etablissement_formateur_id && (
        <Text textStyle="rf-text" color="grey.700" fontWeight="700" my={5}>
          Organisme formateur
        </Text>
      )}

      {formation.etablissement_formateur_id && (
        <Link
          as={NavLink}
          to={`/etablissement/${encodeURIComponent(formation.etablissement_formateur_siret)}`}
          variant="card"
        >
          <Flex display={["none", "flex"]} textStyle="xs" justifyContent="space-between">
            <Text>Siret : {formation.etablissement_formateur_siret}</Text>
            <Text>UAI: {formation.etablissement_formateur_uai}</Text>
          </Flex>
          <Box my={2}>
            <Flex flexWrap="wrap">
              {!(
                formation.etablissement_gestionnaire_certifie_qualite &&
                !formation.etablissement_formateur_certifie_qualite
              ) && <QualiteBadge value={formation.etablissement_formateur_certifie_qualite} mt={2} mr={[0, 2]} />}
              {!formation.catalogue_published && ["Titre", "TP"].includes(formation.rncp_details?.code_type_certif) && (
                <HabiliteBadge value={formation.etablissement_formateur_habilite_rncp} mt={2} mr={[0, 2]} />
              )}
              <ActifBadge value={formation.etablissement_formateur_actif} mt={2} mr={[0, 2]} />
              {/* <LiquidationBadge
                value={
                  oneEstablishment
                    ? formation.Siret_LJ || formation.SIRET_Oresp_LJ || formation.SIRET_OForm_LJ
                    : formation.SIRET_OForm_LJ
                }
                mt={2}
                mr={[0, 2]}
              /> */}
            </Flex>
          </Box>
          <Heading textStyle="h6" color="grey.800" my={1}>
            {formation.etablissement_formateur_entreprise_raison_sociale}
          </Heading>
          <Box>
            <Text textStyle="sm">Académie : {formation.etablissement_formateur_nom_academie}</Text>
            <Box>
              <Flex justifyContent={"space-between"}>
                <Flex flexWrap="wrap">
                  {tagsFormateur &&
                    tagsFormateur
                      .sort((a, b) => a - b)
                      .map((tag, i) => (
                        <Badge variant="year" key={i}>
                          {tag}
                        </Badge>
                      ))}
                </Flex>
                <ArrowRightLine alignSelf="center" color="bluefrance" />
              </Flex>
            </Box>
          </Box>
        </Link>
      )}
    </>
  );
};
