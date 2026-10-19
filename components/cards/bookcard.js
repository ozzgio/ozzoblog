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
  const headingTextColor = "fg";
  const bodyTextColor = "fg.muted";
  const tagBgColor = "accent.subtle";
  const tagTextColor = "accent.link";
  const metaText = "fg.muted";
  const coverPanelBg = "bg.subtle";

  const href = source === "internal" ? `/books/${slug}` : url;
  const formattedDate = formatDate(date);
  const isInternalLink = source === "internal" && href;

  const wrapLink = (content) =>
    isInternalLink ? (
      <NextLink
        href={href}
        style={{ display: "block", height: "100%", textDecoration: "none" }}
      >
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
        borderColor="border"
        cursor={isInternalLink ? "pointer" : "default"}
        role="group"
        className="group"
      >
        <Box
          display="flex"
          flexDirection={{ base: "column", sm: "row" }}
          h="100%"
        >
          {cover && (
            <Box
              flexShrink={0}
              w={{ base: "128px", sm: "144px" }}
              aspectRatio={2 / 3}
              mx={{ base: "auto", sm: 0 }}
              mt={{ base: 4, sm: 0 }}

              position="relative"
              bg={coverPanelBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Image
                src={cover}
                alt={title}
                position="absolute"
                inset={0}
                w="100%"
                h="100%"
                objectFit="cover"
                transition="transform 0.4s ease"
                _groupHover={{ transform: "scale(1.03)" }}
              />
            </Box>
          )}
          <VStack align="start" gap={3} p={{ base: 4, md: 5 }} flex={1}>
            <Badge
              colorPalette="orange"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              Top result
            </Badge>
            <Heading
              as={featured ? "h2" : "h3"}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color={headingTextColor}
              lineHeight="1.2"
            >
              {title}
            </Heading>
            <HStack gap={4} color={metaText} fontSize="sm" flexWrap="wrap">
              <HStack gap={1}>
                <IoBookOutline />
                <Text fontWeight="medium">{author}</Text>
              </HStack>
              {typeof rating === "number" && rating > 0 && (
                <HStack gap={1}>
                  <IoStar color="#dd6b20" />
                  <Text fontWeight="bold" color="accent.link">
                    {rating.toFixed(1)}
                  </Text>
                </HStack>
              )}
              {formattedDate && (
                <HStack gap={1}>
                  <IoCalendarOutline />
                  <Text>{formattedDate}</Text>
                </HStack>
              )}
            </HStack>
            {lesson && (
              <Text fontSize="sm" color={bodyTextColor} lineClamp={3}>
                {lesson}
              </Text>
            )}
            {tags.length > 0 && (
              <Wrap gap={2}>
                {tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag.Root
                      size="sm"
                      colorPalette="orange"
                      bg={tagBgColor}
                      color={tagTextColor}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontWeight="semibold"
                    >
                      {tag}
                    </Tag.Root>
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
      className="group"
    >
      <Box display="flex" alignItems="start" h="100%" p={4} gap={4}>
        {cover && (
          <Box
            w={{ base: "72px", sm: "88px" }}
            aspectRatio={2 / 3}
            position="relative"
            flexShrink={0}
            overflow="hidden"
            bg="bg.subtle"
            display="flex"
            alignItems="center"
          >
            <Image
              src={cover}
              alt={title}
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              objectFit="cover"
              transition="transform 0.4s ease"
              _groupHover={{ transform: "scale(1.05)" }}
            />
          </Box>
        )}
        <VStack align="start" gap={3} flex={1} minW={0} justify="space-between">
          <Box w="100%">
            <Heading
              as={featured ? "h2" : "h3"}
              fontSize="md"
              fontWeight="bold"
              color={headingTextColor}
              lineHeight="1.3"
              mb={1}
            >
              {title}
            </Heading>
            <HStack gap={2} color={metaText} fontSize="xs" flexWrap="wrap">
              <Text>{author}</Text>
              {typeof rating === "number" && rating > 0 && (
                <HStack gap={0.5}>
                  <IoStar color="#dd6b20" />
                  <Text fontWeight="medium">{rating.toFixed(1)}</Text>
                </HStack>
              )}
            </HStack>
            {lesson && (
              <Text
                fontSize="sm"
                color={bodyTextColor}
                mt={1.5}
                lineHeight="1.4"
              >
                {lesson}
              </Text>
            )}
          </Box>
          {tags.length > 0 && (
            <Wrap gap={1}>
              {tags.slice(0, 2).map((tag) => (
                <WrapItem key={tag}>
                  <Tag.Root
                    size="sm"
                    colorPalette="orange"
                    bg={tagBgColor}
                    color={tagTextColor}
                    borderRadius="full"
                    px={2}
                    fontSize="xs"
                  >
                    {tag}
                  </Tag.Root>
                </WrapItem>
              ))}
              {tags.length > 2 && (
                <WrapItem>
                  <Tag.Root
                    size="sm"
                    colorPalette="gray"
                    borderRadius="full"
                    px={2}
                    fontSize="xs"
                  >
                    +{tags.length - 2}
                  </Tag.Root>
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
