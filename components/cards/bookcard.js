import {
  Badge,
  Box,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { IoBookOutline, IoCalendarOutline, IoStar } from "react-icons/io5";
import BaseCard from "../basecard";

function formatDate(rawDate) {
  if (!rawDate) return "";

  try {
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(rawDate));
  } catch {
    return rawDate;
  }
}

const BookCard = ({
  title,
  author,
  rating,
  tags = [],
  cover,
  lesson,
  date,
  slug,
  source = "external",
  featured = false,
  url,
}) => {
  const { colors } = useTheme();
  const headingTextColor = useColorModeValue(
    colors.headingText.default,
    colors.headingText._dark,
  );
  const bodyTextColor = useColorModeValue(
    colors.bodyText.default,
    colors.bodyText._dark,
  );
  const tagBgColor = useColorModeValue(colors.tagBg.default, colors.tagBg._dark);
  const tagTextColor = useColorModeValue(colors.tagText.default, colors.tagText._dark);
  const metaText = useColorModeValue("gray.600", "gray.300");
  const featuredGlow = useColorModeValue("orange.50", "orange.900");
  const coverPanelBg = useColorModeValue("gray.50", "blackAlpha.400");

  const href = source === "internal" ? `/books/${slug}` : url;
  const formattedDate = formatDate(date);
  const isInternalLink = source === "internal" && href;

  const wrapLink = (content) =>
    isInternalLink ? (
      <NextLink href={href} style={{ display: "block", height: "100%", textDecoration: "none" }}>
        {content}
      </NextLink>
    ) : (
      content
    );

  if (featured) {
    return wrapLink(
      <BaseCard
        p={0}
        maxW="none"
        h="100%"
        borderColor="orange.400"
        bgGradient={`linear(to-br, ${featuredGlow}, transparent)`}
        cursor={isInternalLink ? "pointer" : "default"}
        role="group"
      >
        <Box display="flex" flexDirection={{ base: "column", sm: "row" }} h="100%">
          {cover && (
            <Box
              flexShrink={0}
              w={{ base: "100%", sm: "140px" }}
              minH={{ base: "180px", sm: "auto" }}
              bg={coverPanelBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
              overflow="hidden"
            >
              <Image
                src={cover}
                alt={title}
                maxH="200px"
                maxW="100%"
                objectFit="contain"
                transition="transform 0.4s ease"
                _groupHover={{ transform: "scale(1.03)" }}
              />
            </Box>
          )}
          <VStack align="start" spacing={3} p={{ base: 4, md: 5 }} flex={1}>
            <Badge colorScheme="orange" px={3} py={1} borderRadius="full" fontSize="xs">
              Featured book
            </Badge>
            <Heading
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color={headingTextColor}
              lineHeight="1.2"
            >
              {title}
            </Heading>
            <HStack spacing={4} color={metaText} fontSize="sm" flexWrap="wrap">
              <HStack spacing={1}>
                <IoBookOutline />
                <Text fontWeight="medium">{author}</Text>
              </HStack>
              {typeof rating === "number" && rating > 0 && (
                <HStack spacing={1}>
                  <IoStar color="#dd6b20" />
                  <Text fontWeight="bold" color="orange.500">
                    {rating.toFixed(1)}
                  </Text>
                </HStack>
              )}
              {formattedDate && (
                <HStack spacing={1}>
                  <IoCalendarOutline />
                  <Text>{formattedDate}</Text>
                </HStack>
              )}
            </HStack>
            {lesson && (
              <Text fontSize="sm" color={bodyTextColor} noOfLines={3}>
                {lesson}
              </Text>
            )}
            {tags.length > 0 && (
              <Wrap spacing={2}>
                {tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="sm"
                      colorScheme="orange"
                      bg={tagBgColor}
                      color={tagTextColor}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontWeight="semibold"
                    >
                      {tag}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </VStack>
        </Box>
      </BaseCard>,
    );
  }

  return wrapLink(
    <BaseCard
      p={0}
      maxW="none"
      h="100%"
      cursor={isInternalLink ? "pointer" : "default"}
      role="group"
    >
      <Box display="flex" flexDirection="row" h="100%" minH="110px">
        {cover && (
          <Box w="72px" flexShrink={0} overflow="hidden">
            <Image
              src={cover}
              alt={title}
              width="72px"
              height="100%"
              objectFit="cover"
              minH="110px"
              transition="transform 0.4s ease"
              _groupHover={{ transform: "scale(1.05)" }}
            />
          </Box>
        )}
        <VStack align="start" spacing={1} px={3} py={3} flex={1} minW={0} justify="space-between">
          <Box w="100%">
            <Heading
              fontSize="sm"
              fontWeight="bold"
              color={headingTextColor}
              lineHeight="1.3"
              noOfLines={2}
              mb={1}
            >
              {title}
            </Heading>
            <HStack spacing={2} color={metaText} fontSize="xs" flexWrap="wrap">
              <Text noOfLines={1}>{author}</Text>
              {typeof rating === "number" && rating > 0 && (
                <HStack spacing={0.5}>
                  <IoStar color="#dd6b20" />
                  <Text fontWeight="medium">{rating.toFixed(1)}</Text>
                </HStack>
              )}
            </HStack>
            {lesson && (
              <Text fontSize="xs" color={bodyTextColor} noOfLines={2} mt={1.5} lineHeight="1.4">
                {lesson}
              </Text>
            )}
          </Box>
          {tags.length > 0 && (
            <Wrap spacing={1}>
              {tags.slice(0, 2).map((tag) => (
                <WrapItem key={tag}>
                  <Tag
                    size="sm"
                    colorScheme="orange"
                    bg={tagBgColor}
                    color={tagTextColor}
                    borderRadius="full"
                    px={2}
                    fontSize="xs"
                  >
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
              {tags.length > 2 && (
                <WrapItem>
                  <Tag size="sm" colorScheme="gray" borderRadius="full" px={2} fontSize="xs">
                    +{tags.length - 2}
                  </Tag>
                </WrapItem>
              )}
            </Wrap>
          )}
        </VStack>
      </Box>
    </BaseCard>,
  );
};

export default BookCard;
