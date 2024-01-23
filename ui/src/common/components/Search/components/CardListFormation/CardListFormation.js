import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { ArrowRightLine, InfoCircle } from "../../../../../theme/components/icons";
import { QualiteBadge } from "../../../QualiteBadge";
import { ActifBadge } from "../../../ActifBadge";
import { HabiliteBadge } from "../../../HabiliteBadge";
import { DureeBadge } from "../../../DureeBadge";
import { AnneeBadge } from "../../../AnneeBadge";

export const CardListFormation = ({ data, context }) => {
  let [auth] = useAuth();

  return (
    <Link as={NavLink} to={`/formation/${data._id}`} variant="card" mt={4} data-testid={"card_formation"}>
      <Flex display={["none", "flex"]} textStyle="xs" justifyContent="space-between">
        <Text>{data.etablissement_gestionnaire_entreprise_raison_sociale}</Text>
        <Text>CFD : {data.cfd}</Text>
      </Flex>
      <Heading textStyle="h6" color="grey.800" mt={2}>
        {data.intitule_long}
      </Heading>
      <Box>
        <Text textStyle="sm">
          {data.lieu_formation_adresse}, {data.code_postal} {data.localite}
        </Text>
        <Text textStyle="sm">Académie : {data.nom_academie}</Text>
        <Box>
          <Flex justifyContent="space-between">
            <Flex mt={1} flexWrap={"wrap"}>
              {!data.catalogue_published && (
                <>
                  <QualiteBadge value={data.etablissement_gestionnaire_certifie_qualite} mt={2} mr={[0, 2]} />
                  <HabiliteBadge value={data.etablissement_reference_habilite_rncp} mt={2} mr={[0, 2]} />
                  <ActifBadge value={data.siret_actif} mt={2} mr={[0, 2]} />
                  <DureeBadge value={data.duree} mt={2} mr={[0, 2]} />
                  <AnneeBadge value={data.annee} mt={2} mr={[0, 2]} />
                </>
              )}
            </Flex>
            <ArrowRightLine alignSelf="center" color="bluefrance" boxSize={4} />
          </Flex>
          <Flex justifyContent="space-between">
            {data.ids_action?.length > 0 && (
              <Text textStyle="xs" mt={4}>
                identifiant actions Carif Oref: {data.ids_action.join(",")}
              </Text>
            )}
          </Flex>
        </Box>
      </Box>
    </Link>
  );
};
