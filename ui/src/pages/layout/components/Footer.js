import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Link,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { NavLink, useHistory } from "react-router-dom";
import { Logo } from "./Logo";
import useAuth from "../../../common/hooks/useAuth";
import { isUserAdmin, hasAccessTo } from "../../../common/utils/rolesUtils";
import { _get } from "../../../common/httpClient";
import { LockFill } from "../../../theme/components/icons/LockFill";
import { AccountFill, DownloadLine, InfoCircle } from "../../../theme/components/icons";

const Footer = () => {
  const [auth, setAuth] = useAuth();
  const history = useHistory();

  let logout = async () => {
    const anonymous = await _get("/api/v1/auth/logout");
    if (anonymous) {
      setAuth(anonymous);
      history.push("/");
    }
  };

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
            <Flex alignItems="center" mt={[2, 2, 0]} gap={4}>
              {/* User Menu */}
              {auth?.sub === "anonymous" && (
                <Box>
                  <Link as={NavLink} to="/login" variant="pill" fontSize="xs">
                    <LockFill boxSize={3} mb={1} mr={2} />
                    Connexion
                  </Link>
                </Box>
              )}
              {auth?.sub !== "anonymous" && (
                <Menu placement="top">
                  <MenuButton as={Button} variant="pill" size="sm" aria-label={`compte de ${auth.sub}`}>
                    <Flex alignItems="center">
                      <AccountFill color={"bluefrance"} boxSize={3} />
                      <Box display={["none", "none", "block"]} ml={2}>
                        <Text color="bluefrance" textStyle="xs">
                          {auth.sub}{" "}
                          <Text color="grey.600" as="span">
                            ({isUserAdmin(auth) ? "admin" : "Utilisateur"})
                          </Text>
                        </Text>
                      </Box>
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuGroup title="Administration">
                      {hasAccessTo(auth, "page_gestion_utilisateurs") && (
                        <MenuItem as={NavLink} to="/admin/users" icon={<AccountFill boxSize={4} />}>
                          Gestion des utilisateurs
                        </MenuItem>
                      )}
                      {hasAccessTo(auth, "page_gestion_roles") && (
                        <MenuItem as={NavLink} to="/admin/roles" icon={<AccountFill boxSize={4} />}>
                          Gestion des rôles
                        </MenuItem>
                      )}
                      {hasAccessTo(auth, "page_upload") && (
                        <MenuItem as={NavLink} to="/admin/upload" icon={<DownloadLine boxSize={4} />}>
                          Upload de fichiers
                        </MenuItem>
                      )}
                      {hasAccessTo(auth, "page_message_maintenance") && (
                        <MenuItem as={NavLink} to="/admin/alert" icon={<InfoCircle boxSize={4} />}>
                          Message de maintenance
                        </MenuItem>
                      )}
                    </MenuGroup>

                    <MenuDivider />
                    <MenuItem onClick={logout}>Déconnexion</MenuItem>
                  </MenuList>
                </Menu>
              )}
              <Text textStyle="xs">© République française 2021</Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
