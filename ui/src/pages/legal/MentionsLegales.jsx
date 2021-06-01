import React from "react";
import { Box, Container, Heading } from "@chakra-ui/react";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import Layout from "../layout/Layout";

export default () => {
  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: "Mentions Légales" }]} />
          <Heading textStyle="h2" color="grey.800" mt={5}>
            Mentions Légales
          </Heading>
          <Box mt={4}></Box>
        </Container>
      </Box>
    </Layout>
  );
};
