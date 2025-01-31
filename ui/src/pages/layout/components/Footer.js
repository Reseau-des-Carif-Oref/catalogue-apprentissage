import React from "react";
import { Box, Container, Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

const Footer = () => {
  return (
    <Box borderTop="1px solid" borderColor="bluefrance" color="#1E1E1E" fontSize="zeta" w="full">
      <Container maxW="xl">
        <Flex flexDirection={["column", "column", "row"]}>
          <Link as={NavLink} to="/" py={4} w={["100%", "100%", "50%"]}>
            <Logo size={"xl"} />
          </Link>
          <Box alignSelf="center" flex="1">
            <Text>
              {" "}
              <Link
                href={"https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043688656"}
                textDecoration={"underline"}
                isExternal
              >
                Le Décret du 22 juin 2021
              </Link>{" "}
              a confié la mission de collecte des informations relatives à l'offre de formation en apprentissage aux
              centres d'animation, de ressources et d'information sur la formation et aux observatoires régionaux de
              l'emploi et de la formation (Carif-Oref). Le{" "}
              <Link href={"https://reseau.intercariforef.org/"} textDecoration={"underline"} isExternal>
                Réseau des Carif-Oref (RCO)
              </Link>{" "}
              doit les consolider au niveau national et les mettre à disposition.
            </Text>

            <br />
            <List textStyle="sm" fontWeight="700" flexDirection={"row"} flexWrap={"wrap"} mb={[3, 3, 0]} display="flex">
              <ListItem>
                <Link href="https://www.legifrance.gouv.fr/" mr={4} isExternal>
                  legifrance.gouv.fr
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://www.gouvernement.fr/" mr={4} isExternal>
                  gouvernement.fr
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://www.service-public.fr/" mr={4} isExternal>
                  service-public.fr
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://www.data.gouv.fr/fr/" isExternal>
                  data.gouv.fr
                </Link>
              </ListItem>
            </List>
          </Box>
        </Flex>
      </Container>
      <Box borderTop="1px solid" borderColor="#CECECE" color="#6A6A6A">
        <Container maxW="xl" py={[3, 3, 5]}>
          <Flex flexDirection={["column", "column", "row"]}>
            <List
              textStyle="xs"
              flexDirection={"row"}
              flexWrap={"wrap"}
              display="flex"
              flex="1"
              css={{ "li:not(:last-child):after": { content: "'|'", marginLeft: "0.5rem", marginRight: "0.5rem" } }}
            >
              <ListItem>
                <Link href={`${process.env.PUBLIC_URL}/sitemap.xml`}>Plan du site</Link>
              </ListItem>
              <ListItem>
                <Link as={NavLink} to={"/accessibilite"}>
                  Accessibilité : Non conforme
                </Link>
              </ListItem>
              <ListItem>
                <Link as={NavLink} to={"/mentions-legales"}>
                  Mentions légales
                </Link>
              </ListItem>
              {/*<ListItem>*/}
              {/*  <Link as={NavLink} to={"/donnees-personnelles"}>*/}
              {/*    Données personnelles*/}
              {/*  </Link>*/}
              {/*</ListItem>*/}
              <ListItem>
                <Link as={NavLink} to={"/cookies"}>
                  Gestion des cookies
                </Link>
              </ListItem>
              {/* <ListItem>
                <Link as={NavLink} to={"/stats"}>
                  Statistiques
                </Link>
              </ListItem> */}
              <ListItem>
                <Link href="https://mission-apprentissage.gitbook.io/" isExternal>
                  Documentation
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://github.com/Reseau-des-Carif-Oref/catalogue-apprentissage/" isExternal>
                  Code source
                </Link>
              </ListItem>
              <ListItem>
                <Link as={NavLink} to={"/contact"}>
                  Contact
                </Link>
              </ListItem>
            </List>
            <Text textStyle="xs" mt={[2, 2, 0]}>
              © République française 2021
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
