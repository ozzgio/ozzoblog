import { Box } from "@chakra-ui/react";

const BaseCard = ({ children, ...props }) => (
  <Box
    bg="bg.panel"
    borderWidth="1px"
    borderColor="border"
    borderRadius="xl"
    p={6}
    maxW="350px"
    w="100%"
    mx="auto"
    position="relative"
    overflow="hidden"
    transition="border-color 0.2s, box-shadow 0.2s"
    _hover={{ borderColor: "accent.link", boxShadow: "sm" }}
    {...props}
  >
    {children}
  </Box>
);

export default BaseCard;
