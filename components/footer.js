import { Box, HStack, Link, Text, VStack } from "@chakra-ui/react";

const Footer = ({ showBorder = true }) => {
  const textColor = "fg.muted";
  const linkColor = "accent.link";
  const borderColor = "border";

  return (
    <Box
      as="footer"
      width="100%"
      padding={6}
      textAlign="center"
      bottom={0}
      mt={8}
      borderTopWidth={showBorder ? "1px" : "0"}
      borderTopColor={showBorder ? borderColor : "transparent"}
    >
      <VStack gap={2}>
        <Text fontSize="sm" color={textColor}>
          &copy; {new Date().getFullYear()} Ozzo. All Rights Reserved.
        </Text>
        <HStack gap={4} fontSize="sm">
          <Link
            href="https://x.com/ozzgio"
            aria-label="X profile (@ozzgio)"
            target="_blank"
            rel="noopener noreferrer"
            color={linkColor}
            minH="44px"
            minW="44px"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
          >
            X
          </Link>
          <Link
            href="https://github.com/ozzgio"
            target="_blank"
            rel="noopener noreferrer"
            color={linkColor}
            minH="44px"
            display="inline-flex"
            alignItems="center"
          >
            GitHub
          </Link>
          <Link
            href="/rss.xml"
            color={linkColor}
            _hover={{ textDecoration: "underline" }}
            target="_blank"
            rel="noopener noreferrer"
            minH="44px"
            display="inline-flex"
            alignItems="center"
          >
            RSS Feed
          </Link>
        </HStack>
        <Text color={textColor} fontSize="xs">
          Inspired by{" "}
          <Link
            href="https://www.craftz.dog/"
            target="_blank"
            rel="noopener noreferrer"
            color={linkColor}
            _hover={{ textDecoration: "underline" }}
          >
            Takuya Matsuyama
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
