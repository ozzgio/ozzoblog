import { Box, Text } from "@chakra-ui/react";

export const BioSection = ({ year, children }) => (
  <Box
    display="grid"
    gridTemplateColumns={{
      base: "minmax(0, 1fr)",
      sm: "8.5rem minmax(0, 1fr)",
    }}
    gap={{ base: 1, sm: 4 }}
    py={3}
    borderTopWidth="1px"
    borderColor="border"
  >
    <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
      {year}
    </Text>
    <Box
      minW={0}
      fontSize="sm"
      lineHeight="1.8"
      css={{ "& a": { display: "inline", verticalAlign: "baseline" } }}
    >
      {children}
    </Box>
  </Box>
);
