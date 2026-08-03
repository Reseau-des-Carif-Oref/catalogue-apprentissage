import React from "react";
import { Badge, Flex, Text } from "@chakra-ui/react";
import { WarningLine } from "../../theme/components/icons";

export const isLiquidation = (value) => value === true || value === "true" || value === 1 || value === "1";

export const LiquidationBadge = ({ value, ...props }) => {
  if (!isLiquidation(value)) {
    return null;
  }

  return (
    <Badge variant="notOk" {...props}>
      <Flex alignItems="center">
        <Text mx={1} as={"span"}>
          Liquidation judiciaire
        </Text>
        <WarningLine ml={1} />
      </Flex>
    </Badge>
  );
};
