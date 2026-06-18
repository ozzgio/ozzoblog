import { Box, HStack, Link, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import packageJson from "../package.json";

const Footer = ({ showBorder = true }) => {
  const textColor = useColorModeValue("gray.700", "gray.400");
  const linkColor = useColorModeValue("orange.700", "orange.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      as="footer"
      width="100%"
      padding={6}
      textAlign="center"
      bottom={0}
      mt={12}
      borderTopWidth={showBorder ? "1px" : "0"}
      borderTopColor={showBorder ? borderColor : "transparent"}
    >
      <VStack spacing={2}>
        <Text fontSize="sm" color={textColor}>
          &copy; {new Date().getFullYear()} Giorgio Ozzola. All Rights Reserved.
        </Text>
        <HStack spacing={4} fontSize="sm">
          <Link
            href="/rss.xml"
            color={linkColor}
            _hover={{ textDecoration: "underline" }}
            target="_blank"
          >
            RSS Feed
          </Link>
          <Text color={textColor}>•</Text>
          <Text color={textColor}>
            Inspired by{" "}
            <Link
              href="https://www.craftz.dog/"
              target="_blank"
              color={linkColor}
              _hover={{ textDecoration: "underline" }}
            >
              Takuya Matsuyama
            </Link>
          </Text>
        </HStack>
        <Text fontSize="xs" color={useColorModeValue("gray.700", "gray.400")}>
          Version: {packageJson.version}
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
