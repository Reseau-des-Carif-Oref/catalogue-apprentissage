import React, { useEffect, useState } from "react";
import { _delete, _get, _post, _put } from "../../common/httpClient";
import { useFormik } from "formik";
import Layout from "../layout/Layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ArrowDropRightLine } from "../../theme/components/icons";

const ACADEMIES = [
  "01",
  "02",
  "03",
  "04",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "22",
  "23",
  "24",
  "25",
  "27",
  "28",
  "31",
  "32",
  "33",
  "43",
  "70",
];

const UserLine = ({ user }) => {
  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      accessAllCheckbox: user?.isAdmin ? ["on"] : [],
      roles: user?.roles || ["user"],
      accessAcademieList: user ? user.academie.split(",") : "",
      newUsername: user?.username || "",
      newEmail: user?.email || "",
      newTmpPassword: "1MotDePassTemporaire!",
    },
    onSubmit: (
      { apiKey, accessAllCheckbox, accessAcademieList, newUsername, newEmail, newTmpPassword, roles },
      { setSubmitting }
    ) => {
      return new Promise(async (resolve, reject) => {
        const accessAcademie = accessAcademieList.join(",");
        const accessAll = accessAllCheckbox.includes("on");
        try {
          if (user) {
            const body = {
              username: newUsername,
              options: {
                academie: accessAcademie,
                email: newEmail,
                roles,
                permissions: {
                  isAdmin: accessAll,
                },
              },
            };
            await _put(`/api/admin/user/${user.username}`, body);
            document.location.reload(true);
          } else {
            const body = {
              username: newUsername,
              password: newTmpPassword,
              options: {
                academie: accessAcademie,
                email: newEmail,
                roles,
                permissions: {
                  isAdmin: accessAll,
                },
              },
            };
            await _post(`/api/admin/user/`, body);
            document.location.reload(true);
          }
        } catch (e) {
          console.log(e);
        }

        setSubmitting(false);
        resolve("onSubmitHandler complete");
      });
    },
  });

  const onDeleteClicked = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Delete user !?")) {
      await _delete(`/api/admin/user/${user.username}`);
      document.location.reload(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl py={2}>
        <FormLabel>Username</FormLabel>
        <Input type="text" id="newUsername" name="newUsername" value={values.newUsername} onChange={handleChange} />
      </FormControl>

      <FormControl py={2}>
        <FormLabel>Email</FormLabel>
        <Input type="email" id="newEmail" name="newEmail" value={values.newEmail} onChange={handleChange} />
      </FormControl>

      {!user && (
        <FormControl py={2}>
          <FormLabel>Mot de passe temporaire</FormLabel>
          <Input
            type="text"
            id="newTmpPassword"
            name="newTmpPassword"
            value={values.newTmpPassword}
            onChange={handleChange}
          />
        </FormControl>
      )}

      <FormControl py={2}>
        <Checkbox
          name="accessAllCheckbox"
          id="accessAllCheckbox"
          isChecked={values.accessAllCheckbox.length > 0}
          onChange={handleChange}
          value="on"
        >
          Admin
        </Checkbox>
      </FormControl>

      <FormControl py={2}>
        <FormLabel>Rôles</FormLabel>
        <HStack spacing={5}>
          <Checkbox name="roles" onChange={handleChange} value={"user"} isDisabled isChecked>
            user
          </Checkbox>

          {["reports", "moss", "instructeur"].map((role, i) => {
            return (
              <Checkbox
                name="roles"
                key={i}
                onChange={handleChange}
                value={role}
                isChecked={values.roles.includes(role)}
              >
                {role}
              </Checkbox>
            );
          })}
        </HStack>
      </FormControl>

      <FormControl py={2}>
        <FormLabel>Académies</FormLabel>
        <HStack wrap="wrap" spacing={5}>
          <Checkbox
            name="accessAcademieList"
            onChange={handleChange}
            value={"-1"}
            isChecked={values.accessAcademieList.includes("-1")}
            mb={3}
          >
            Toutes
          </Checkbox>

          {ACADEMIES.map((num, i) => {
            return (
              <Checkbox
                key={i}
                name="accessAcademieList"
                onChange={handleChange}
                value={num}
                isChecked={values.accessAcademieList.includes(num)}
                mb={3}
              >
                {num}
              </Checkbox>
            );
          })}
        </HStack>
      </FormControl>

      {user && (
        <Box>
          <Button type="submit" variant="primary" mr={5}>
            Enregistrer
          </Button>
          <Button variant="outline" colorScheme="red" borderRadius="none" onClick={onDeleteClicked}>
            Supprimer l'utilisateur
          </Button>
        </Box>
      )}
      {!user && (
        <Button type="submit" variant="primary">
          Créer l'utilisateur
        </Button>
      )}
    </form>
  );
};

export default () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function run() {
      const usersList = await _get(`/api/admin/users/`);
      setUsers(usersList);
    }
    run();
  }, []);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb separator={<ArrowDropRightLine color="grey.600" />} textStyle="xs">
            <BreadcrumbItem>
              <BreadcrumbLink as={NavLink} to="/" color="grey.600" textDecoration="underline">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Gestion des utilisateurs</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Container>
      </Box>
      <Box w="100%" minH="100vh" px={[1, 24]}>
        <Container maxW="xl">
          <Heading as="h1" mb={8} mt={6}>
            Gestion des utilisateurs
          </Heading>
          <Stack spacing={2}>
            <Accordion bg="white" mb={12} allowToggle>
              <AccordionItem>
                <AccordionButton
                  bg="bluefrance"
                  color="white"
                  _hover={{ bg: "blue.700" }}
                  _focus={{ boxShadow: "none", outlineWidth: 0 }}
                >
                  <Box flex="1" textAlign="left" fontSize="gamma">
                    Créer un utilisateur
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} border={"1px solid"} borderTop={0} borderColor={"bluefrance"}>
                  <UserLine user={null} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {users.map((userAttr, i) => {
              return (
                <Accordion bg="white" key={i} allowToggle>
                  <AccordionItem>
                    <AccordionButton
                      _expanded={{ bg: "grey.200" }}
                      border={"1px solid"}
                      borderColor={"bluefrance"}
                      _focus={{ boxShadow: "none", outlineWidth: 0 }}
                    >
                      <Box flex="1" textAlign="left" fontSize="gamma">
                        {userAttr.username}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} border={"1px solid"} borderTop={0} borderColor={"bluefrance"}>
                      <UserLine user={userAttr} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </Stack>
        </Container>
      </Box>
    </Layout>
  );
};
