import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoCloseCircleOutline,
  IoDocumentText,
  IoFlashOutline,
  IoPricetagOutline,
  IoSearchOutline,
  IoTimeOutline,
} from "react-icons/io5";
import Layout from "../../components/layouts/layout";
import ArticleCard from "../../components/cards/articlecard";
import {
  formatAbsoluteDate,
  getArticleBody,
  getArticleSummary,
  isInternalArticle,
  resolvePortfolioAssetUrl,
} from "../../libs/contentUtils";

const MotionBox = motion.create(Box);

const formatDate = (dateStr) => {
  if (!dateStr) return "";

  try {
    const articleDate = new Date(dateStr);
    if (Number.isNaN(articleDate.getTime())) return dateStr;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    articleDate.setHours(0, 0, 0, 0);

    const diffTime = today - articleDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      if (absDays === 1) return "Tomorrow";
      return `In ${absDays} days`;
    }

    switch (diffDays) {
      case 0:
        return "Today";
      case 1:
        return "Yesterday";
      default:
        return `${diffDays} days ago`;
    }
  } catch (error) {
    return dateStr;
  }
};

const ArticlesPage = ({ articles, error }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const heroBg = useColorModeValue(
    "linear(to-br, orange.50, white 40%, orange.100)",
    "linear(to-br, gray.900, orange.900, gray.900)",
  );
  const heroBorder = useColorModeValue("orange.200", "orange.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const panelBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.100");
  const panelBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const accentSubtle = useColorModeValue("orange.50", "orange.900");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const normalizedArticles = useMemo(() => {
    return articles
      .filter((article) => article.date)
      .map((article) => {
        const formattedDate =
          isMounted && article.date ? formatDate(article.date) : article.date || "";
        const content = getArticleBody(article);

        return {
          ...article,
          content,
          summary: article.summary || getArticleSummary(article),
          formattedDate: formattedDate || article.date || "",
          absoluteDate: article.date ? formatAbsoluteDate(article.date) : "",
          year: article.date ? String(new Date(article.date).getFullYear()) : "",
          book: String(article.book || ""),
          book_url: String(article.book_url || ""),
        };
      });
  }, [articles, isMounted]);

  const sortedArticles = useMemo(() => {
    const currentArticles = [...normalizedArticles];

    if (sortOption === "newest") {
      currentArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "oldest") {
      currentArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "alphabetical") {
      currentArticles.sort((a, b) => a.title.localeCompare(b.title));
    }

    return currentArticles;
  }, [normalizedArticles, sortOption]);

  const allTags = useMemo(() => {
    const tagCounts = new Map();

    sortedArticles.forEach((article) => {
      (article.tags || []).forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return [...tagCounts.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .map(([tag, count]) => ({ tag, count }));
  }, [sortedArticles]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedArticles.filter((article) => {
      const matchesTag = selectedTag ? article.tags?.includes(selectedTag) : true;
      const matchesQuery = query
        ? [article.title, article.description, article.content, article.book, ...(article.tags || [])]
            .join(" ")
            .toLowerCase()
            .includes(query)
        : true;

      return matchesTag && matchesQuery;
    });
  }, [searchQuery, selectedTag, sortedArticles]);

  const latestArticle = sortedArticles[0] || null;

  const uniqueYears = useMemo(
    () => [...new Set(sortedArticles.map((article) => article.year).filter(Boolean))],
    [sortedArticles],
  );

  const hasActiveFilters = Boolean(selectedTag || searchQuery.trim());

  const resetFilters = () => {
    setSelectedTag(null);
    setSearchQuery("");
  };

  return (
    <Layout
      title="Articles"
      description="Architecture calls, decisions, and things that broke while building in public. Writing about Synergym, agentic systems, and the stack decisions behind both."
      path="/articles"
    >
      <MotionBox
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <VStack spacing={8} align="stretch">
          <Box
            bgGradient={heroBg}
            borderWidth="1px"
            borderColor={heroBorder}
            borderRadius="3xl"
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 8 }}
            boxShadow="xl"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              width: "320px",
              height: "320px",
              right: "-120px",
              top: "-140px",
              borderRadius: "full",
              bg: "orange.300",
              opacity: 0.15,
              filter: "blur(6px)",
            }}
          >
            <Stack
              direction={{ base: "column", lg: "row" }}
              align={{ base: "stretch", lg: "start" }}
              justify="space-between"
              spacing={8}
              position="relative"
              zIndex={1}
            >
              <VStack align="start" spacing={5} maxW="2xl">
                <Badge
                  colorScheme="orange"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  textTransform="uppercase"
                >
                  Build in public log
                </Badge>
                <Box>
                  <Heading
                    as="h1"
                    id="articles-heading"
                    fontSize={{ base: "xl", md: "2xl" }}
                    lineHeight="1.2"
                    mb={2}
                  >
                    What I&apos;m shipping
                  </Heading>
                  <Text fontSize="sm" color={mutedText}>
                    Architecture calls, decisions, and things that broke on the way.
                  </Text>
                </Box>
                <HStack spacing={3} flexWrap="wrap">
                  <Link
                    href="/rss.xml"
                    fontSize="sm"
                    color="orange.500"
                    fontWeight="semibold"
                    target="_blank"
                    _hover={{ textDecoration: "underline" }}
                  >
                    RSS Feed
                  </Link>
                  <Text color={mutedText}>/</Text>
                  <Text fontSize="sm" color={mutedText}>
                    Latest: {latestArticle ? latestArticle.absoluteDate : "N/A"}
                  </Text>
                </HStack>
              </VStack>

              <SimpleGrid
                columns={{ base: 1, sm: 3 }}
                spacing={3}
                minW={{ base: "100%", lg: "380px" }}
                maxW="540px"
                alignSelf={{ base: "stretch", lg: "start" }}
              >
                <Box
                  bg={panelBg}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  borderRadius="2xl"
                  p={4}
                >
                  <HStack mb={2}>
                    <Icon as={IoDocumentText} color="orange.400" />
                    <Text fontSize="sm" color={mutedText}>
                      Articles
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {sortedArticles.length}
                  </Text>
                </Box>
                <Box
                  bg={panelBg}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  borderRadius="2xl"
                  p={4}
                >
                  <HStack mb={2}>
                    <Icon as={IoPricetagOutline} color="orange.400" />
                    <Text fontSize="sm" color={mutedText}>
                      Tags
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {allTags.length}
                  </Text>
                </Box>
                <Box
                  bg={panelBg}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  borderRadius="2xl"
                  p={4}
                >
                  <HStack mb={2}>
                    <Icon as={IoCalendarOutline} color="orange.400" />
                    <Text fontSize="sm" color={mutedText}>
                      Years
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {uniqueYears.length}
                  </Text>
                </Box>
              </SimpleGrid>
            </Stack>
          </Box>

          {error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            <VStack spacing={6} align="stretch">
              <Box
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="3xl"
                p={{ base: 4, md: 5 }}
                bg={panelBg}
                backdropFilter="blur(12px)"
              >
                <Stack direction={{ base: "column", xl: "row" }} spacing={4}>
                  <InputGroup flex={1}>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={IoSearchOutline} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search titles, summaries, notes, or tags"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                  </InputGroup>
                  <Select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    maxW={{ base: "100%", xl: "220px" }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical</option>
                  </Select>
                  {hasActiveFilters && (
                    <Button
                      leftIcon={<IoCloseCircleOutline />}
                      variant="ghost"
                      colorScheme="orange"
                      onClick={resetFilters}
                    >
                      Clear filters
                    </Button>
                  )}
                </Stack>

                <Wrap mt={4} spacing={3}>
                  <WrapItem>
                    <Button
                      size="sm"
                      colorScheme={!selectedTag ? "orange" : "gray"}
                      variant={!selectedTag ? "solid" : "outline"}
                      onClick={() => setSelectedTag(null)}
                    >
                      All ({sortedArticles.length})
                    </Button>
                  </WrapItem>
                  {allTags.map(({ tag, count }) => (
                    <WrapItem key={tag}>
                      <Button
                        size="sm"
                        colorScheme="orange"
                        variant={selectedTag === tag ? "solid" : "outline"}
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag} ({count})
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>

                <HStack mt={4} spacing={3} color={mutedText} fontSize="sm" flexWrap="wrap">
                  <HStack spacing={1}>
                    <Icon as={IoTimeOutline} />
                    <Text>{filteredArticles.length} selected</Text>
                  </HStack>
                  <Text>•</Text>
                  <Text>
                    {sortOption === "newest"
                      ? "Sorted by newest"
                      : sortOption === "oldest"
                        ? "Sorted by oldest"
                        : "Sorted alphabetically"}
                  </Text>
                </HStack>
              </Box>

              {filteredArticles.length === 0 ? (
                <Box
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor={heroBorder}
                  borderRadius="xl"
                  p={8}
                  textAlign="center"
                  bg={accentSubtle}
                >
                  <Icon as={IoFlashOutline} boxSize={8} color="orange.400" mb={3} />
                  <Heading as="h2" size="md" mb={2}>
                    No articles found
                  </Heading>
                  <Text color={mutedText}>
                    Try a different search term or clear the active tag filter.
                  </Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.slug || article.url} {...article} />
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          )}
        </VStack>
      </MotionBox>
    </Layout>
  );
};

export const getStaticProps = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json",
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch articles: ${response.status} ${response.statusText}`,
      );
    }

    const articlesData = await response.json();

    if (!Array.isArray(articlesData)) {
      throw new Error("Invalid JSON format: expected an array");
    }

    const articles = articlesData
      .filter((article) => article && article.title)
      .map((article) => {
        const dateValue = article.date || "";
        const thumbnail = article.thumbnail || "";
        const internal = isInternalArticle(article);
        const source = internal ? "internal" : "external";
        const slug =
          typeof article.slug === "string" && article.slug.trim()
            ? article.slug.trim()
            : "";
        const internalUrl = slug ? `/articles/${slug}` : "";
        const externalUrl =
          typeof article.url === "string" && article.url.trim()
            ? article.url.trim()
            : "";
        const resolvedUrl = source === "internal" ? internalUrl : externalUrl;

        return {
          title: String(article.title || ""),
          description: String(article.description || ""),
          content: getArticleBody(article),
          summary: getArticleSummary(article),
          url: resolvedUrl,
          date: dateValue,
          source,
          slug,
          formattedDate: null,
          thumbnail: thumbnail ? resolvePortfolioAssetUrl(thumbnail) : "",
          tags: Array.isArray(article.tags) ? article.tags.filter(Boolean) : [],
        };
      })
      .filter((article) => article.title && article.url);

    return {
      props: {
        articles: Array.isArray(articles) ? articles : [],
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Failed to fetch articles in getStaticProps:", error);
    return {
      props: {
        articles: [],
        error: "Failed to load articles. Please try again later.",
      },
    };
  }
};

export default ArticlesPage;
