import NextLink from "next/link";
import { Heading, Box, Image, Link, Badge, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

export const Title = ({ children }) => {
  // Use theme token for heading color
  return (
    <Box>
      <Link as={NextLink} href="/projects">
        Projects
      </Link>
      <span>
        {" "}
        <ChevronRightIcon />{" "}
      </span>
      <Heading
        display="inline-block"
        as="h1"
        fontSize={["xl", 24]}
        mb={4}
        color="headingText.default"
        _dark={{ color: "headingText._dark" }}
        fontWeight="extrabold"
      >
        {children}
      </Heading>
    </Box>
  );
};

export const WorkImage = ({
  src,
  alt,
  fit = "cover",
  bg = "transparent",
  p = 0,
}) => (
  <Box
    w="100%"
    position="relative"
    aspectRatio={["4/3", "16/7"]}
    borderRadius="lg"
    overflow="hidden"
    bg={bg}
    p={p}
  >
    <Image
      borderRadius="lg"
      w="100%"
      h="100%"
      maxH="320px"
      objectFit={fit}
      src={src}
      alt={alt}
      mb={0}
      fallbackSrc="/thumbs/portfolio.png"
    />
  </Box>
);

export const Meta = ({ children }) => (
  <Badge colorScheme="green" mr={2}>
    <Text display="inline" fontWeight="bold">
      {children}
    </Text>
  </Badge>
);
