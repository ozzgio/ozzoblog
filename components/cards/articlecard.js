import {
  Box,
  HStack,
  Icon,
  Image,
  Tag,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import {
  formatAbsoluteDate,
  getArticleBookReference,
} from "../../libs/contentUtils";

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
  const border = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const bg = useColorModeValue("white", "whiteAlpha.50");
  const hoverBorder = useColorModeValue("orange.300", "orange.600");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const bodyColor = useColorModeValue("gray.600", "gray.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const isInternal = source === "internal";
  const href = isInternal ? `/articles/${slug}` : url;
  const displayDate = absoluteDate || formatAbsoluteDate(date);
  const leadText = description || summary || "";
  const bookReference = getArticleBookReference({ book });

  const sourceLabel = (() => {
    if (isInternal) return "ozzo.blog";
    try {
      const hostname = new URL(url).hostname.replace("www.", "");
      if (hostname.includes("linkedin.com")) return "LinkedIn";
      if (hostname.includes("medium.com")) return "Medium";
      if (hostname.includes("dev.to")) return "dev.to";
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
      display="block"
      _hover={{ textDecoration: "none" }}
    >
      <Box
        borderWidth="1px"
        borderColor={border}
        borderRadius="xl"
        overflow="hidden"
        bg={bg}
        _hover={{ borderColor: hoverBorder }}
        transition="border-color 0.15s"
      >
        {thumbnail && (
          <Box h="140px" overflow="hidden">
            <Image
              src={thumbnail}
              alt={title}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>
        )}
        <VStack align="start" spacing={2} p={{ base: 4, md: 5 }}>
          <HStack spacing={3} w="100%" justify="space-between">
            <HStack spacing={1} color={mutedColor} fontSize="xs">
              <Icon as={IoCalendarOutline} boxSize={3} />
              <Text>{displayDate}</Text>
            </HStack>
            <HStack spacing={1}>
              {!isInternal && <ExternalLinkIcon boxSize={3} color={mutedColor} />}
              <Text fontSize="xs" color={mutedColor}>
                {sourceLabel}
              </Text>
            </HStack>
          </HStack>

          <Text fontSize="sm" fontWeight="semibold" color={headingColor} lineHeight="1.4">
            {title}
          </Text>

          {leadText && (
            <Text fontSize="xs" color={bodyColor} lineHeight="1.6" noOfLines={2}>
              {leadText}
            </Text>
          )}

          {bookReference && (
            <HStack spacing={1} align="start" color={mutedColor} fontSize="xs" w="100%">
              <Icon as={IoBookOutline} boxSize={3} mt="2px" />
              <Text noOfLines={2} lineHeight="1.4">
                Book reference: {bookReference}
              </Text>
            </HStack>
          )}

          {tags?.length > 0 && (
            <HStack spacing={1} flexWrap="wrap" pt={1}>
              {tags.slice(0, 3).map((tag) => (
                <Tag key={tag} size="sm" colorScheme="orange" borderRadius="full">
                  {tag}
                </Tag>
              ))}
            </HStack>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default ArticleCard;
