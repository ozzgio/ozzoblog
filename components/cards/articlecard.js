import {
  Box,
  HStack,
  Icon,
  Image,
  Heading,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import {
  formatAbsoluteDate,
  getArticleBookReference,
} from "../../libs/contentUtils";
import { LuExternalLink } from "react-icons/lu";

const ArticleCard = ({
  title,
  absoluteDate,
  date,
  description,
  summary,
  url,
  slug,
  source = "external",
  tags,
  thumbnail,
  book,
}) => {
  const isInternal = source === "internal";
  const href = isInternal ? `/articles/${slug}` : url;
  const displayDate = absoluteDate || formatAbsoluteDate(date);
  const leadText = description || summary || "";
  const bookReference = getArticleBookReference({ book });

  const sourceLabel = (() => {
    if (isInternal) return "ozzo.blog";
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, "");
      // Exact-or-subdomain match only -- hostname.includes("linkedin.com")
      // would also match "linkedin.com.evil.example" or "notlinkedin.com".
      const isHost = (domain) =>
        hostname === domain || hostname.endsWith(`.${domain}`);
      if (isHost("linkedin.com")) return "LinkedIn";
      if (isHost("medium.com")) return "Medium";
      if (isHost("dev.to")) return "dev.to";
      return hostname;
    } catch {
      return "External";
    }
  })();

  if (!href || !title) return null;

  return (
    <Box
      as={isInternal ? NextLink : "a"}
      href={href}
      {...(!isInternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      display="flex"
      gap={{ base: 3, md: 5 }}
      p={{ base: 4, md: 5 }}
      borderBottomWidth="1px"
      borderColor="border"
      _last={{ borderBottomWidth: 0 }}
      _hover={{ bg: "bg.subtle", textDecoration: "none" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "accent.link",
        outlineOffset: "-2px",
      }}
      transition="background-color 0.15s"
    >
      <VStack align="start" gap={2} flex={1} minW={0}>
        <HStack gap={3} flexWrap="wrap" color="fg.muted" fontSize="xs">
          <HStack gap={1}>
            <Icon as={IoCalendarOutline} boxSize={3} />
            <Text>{displayDate}</Text>
          </HStack>
          <HStack gap={1}>
            {!isInternal && <Icon as={LuExternalLink} boxSize={3} />}
            <Text>{sourceLabel}</Text>
          </HStack>
        </HStack>
        <Heading
          as="h2"
          fontSize="lg"
          fontWeight="semibold"
          color="fg"
          lineHeight="1.35"
        >
          {title}
        </Heading>
        {leadText && (
          <Text fontSize="sm" color="fg.muted" lineHeight="1.65" lineClamp={2}>
            {leadText}
          </Text>
        )}
        {bookReference && (
          <HStack gap={1} align="start" color="fg.muted" fontSize="xs" w="100%">
            <Icon as={IoBookOutline} boxSize={3} mt="2px" />
            <Text lineClamp={2} lineHeight="1.4">
              Book reference: {bookReference}
            </Text>
          </HStack>
        )}
        {tags?.length > 0 && (
          <HStack gap={1} flexWrap="wrap">
            {tags.slice(0, 3).map((tag) => (
              <Tag.Root
                key={tag}
                size="sm"
                colorPalette="orange"
                bg="accent.subtle"
                color="accent.link"
                borderRadius="full"
                px={2}
                fontSize="xs"
              >
                {tag}
              </Tag.Root>
            ))}
          </HStack>
        )}
      </VStack>
      {thumbnail && (
        <Box
          w={{ base: "64px", sm: "112px" }}
          aspectRatio={4 / 3}
          flexShrink={0}
          alignSelf="start"
          bg="bg.subtle"
          borderRadius="md"
          overflow="hidden"
        >
          <Image
            src={thumbnail}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>
      )}
    </Box>
  );
};

export default ArticleCard;
