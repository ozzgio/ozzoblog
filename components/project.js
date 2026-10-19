import NextLink from "next/link";
import { Heading, Box, Image, Link, Badge, Text } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

export const Title = ({ children }) => {
  // Use theme token for heading color
  return (
    <Box>
      <Link asChild>
        <NextLink href="/projects">Projects</NextLink>
      </Link>
      <Box as="span" display="inline-flex" alignItems="center" mx={2}>
        {" "}
        <LuChevronRight />{" "}
      </Box>
      <Heading
        display="inline-block"
        as="h1"
        fontSize={["xl", 24]}
        mb={4}
        color="fg"
        fontWeight="extrabold"
      >
        {children}
      </Heading>
    </Box>
  );
};

function applyImageFallback(image) {
  if (
    image?.complete &&
    image.naturalWidth === 0 &&
    !image.src.endsWith("/thumbs/portfolio.png")
  ) {
    image.src = "/thumbs/portfolio.png";
  }
}

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
      ref={applyImageFallback}
      onError={(event) => applyImageFallback(event.currentTarget)}
      mb={0}
    />
  </Box>
);

export const Meta = ({ children }) => (
  <Badge colorPalette="green" mr={2}>
    <Text display="inline" fontWeight="bold">
      {children}
    </Text>
  </Badge>
);
