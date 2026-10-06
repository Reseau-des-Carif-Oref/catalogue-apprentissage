import React from "react";
import { Box, Text } from "@chakra-ui/react";

export const Logo = ({ size = "sm" }) => {
  return (
    <Box p={[0, 0, 4]}>
      <img src="/Logo_RCO_arbre.png" width="200px" />
    </Box>
  );
};
