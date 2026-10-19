import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  Link,
  NativeSelect,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  IoCloseCircleOutline,
  IoFlashOutline,
  IoSearchOutline,
  IoTimeOutline,
} from "react-icons/io5";
import Layout from "../../components/layouts/layout";
import ArticleCard from "../../components/cards/articlecard";
import {
  fetchArticles,
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
  } catch {
    return dateStr;
  }
};

const ArticlesPage = ({ articles, error }) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const heroBorder = "border";
  const mutedText = "fg.muted";
  const panelBorder = "border";
  const accentSubtle = "accent.subtle";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const normalizedArticles = useMemo(() => {
    return articles
      .filter((article) => article.date)
      .map((article) => {
        const formattedDate =
          isMounted && article.date
            ? formatDate(article.date)
            : article.date || "";
        const content = getArticleBody(article);

        return {
          ...article,
          content,
          summary: article.summary || getArticleSummary(article),
          formattedDate: formattedDate || article.date || "",
          absoluteDate: article.date ? formatAbsoluteDate(article.date) : "",
          year: article.date
            ? String(new Date(article.date).getFullYear())
            : "",
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
      const matchesTag = selectedTag
        ? article.tags?.includes(selectedTag)
        : true;
      const matchesQuery = query
        ? [
            article.title,
            article.description,
            article.content,
            article.book,
            ...(article.tags || []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        : true;

      return matchesTag && matchesQuery;
    });
  }, [searchQuery, selectedTag, sortedArticles]);

  const latestArticle = sortedArticles[0] || null;

  const uniqueYears = useMemo(
    () => [
      ...new Set(sortedArticles.map((article) => article.year).filter(Boolean)),
    ],
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
      description="Essays by Ozzo on building software, finding users, and learning to work independently."
      path="/articles"
    >
      <MotionBox
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55 }}
      >
        <VStack gap={5} align="stretch">
          <Box as="header" pb={4} borderBottomWidth="1px" borderColor="border">
            <Text
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.04em"
              color="accent.link"
              mb={3}
            >
              The archive
            </Text>
            <Heading
              as="h1"
              id="articles-heading"
              fontSize={{ base: "3xl", md: "4xl" }}
              lineHeight="1.05"
              mb={3}
            >
              Writing
            </Heading>
            <Text fontSize="md" color="fg.muted" maxW="38rem">
              What I&apos;m building, how I find people who need it, and what I
              learn when things don&apos;t go to plan.
            </Text>
            <HStack
              gap={5}
              flexWrap="wrap"
              fontSize="sm"
              color="fg.muted"
              mt={3}
            >
              <Text>{sortedArticles.length} articles</Text>
              <Text>{allTags.length} topics</Text>
              <Text>
                {uniqueYears.length}{" "}
                {uniqueYears.length === 1 ? "year" : "years"}
              </Text>
            </HStack>
            <HStack
              gap={3}
              flexWrap="wrap"
              fontSize="sm"
              color="fg.muted"
              mt={3}
            >
              <Link
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                minH="44px"
              >
                RSS Feed ↗
              </Link>
              <Text>
                Latest: {latestArticle ? latestArticle.absoluteDate : "N/A"}
              </Text>
            </HStack>
          </Box>

          {error ? (
            <Text color="status.error">{error}</Text>
          ) : (
            <VStack gap={6} align="stretch">
              <Box
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="xl"
                p={{ base: 3, md: 4 }}
                bg="bg.panel"
              >
                <Stack direction={{ base: "column", md: "row" }} gap={4}>
                  <InputGroup
                    flex={1}
                    startElement={
                      <Icon as={IoSearchOutline} color="fg.muted" />
                    }
                  >
                    <Input
                      aria-label="Search articles"
                      placeholder="Search titles, summaries, notes, or tags"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      minH="44px"
                    />
                  </InputGroup>
                  <NativeSelect.Root maxW={{ base: "100%", md: "220px" }}>
                    <NativeSelect.Field
                      aria-label="Sort articles"
                      value={sortOption}
                      onChange={(event) => setSortOption(event.target.value)}
                      maxW={{ base: "100%", xl: "220px" }}
                      minH="44px"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="alphabetical">Alphabetical</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      colorPalette="gray"
                      onClick={resetFilters}
                      minH="44px"
                    >
                      <IoCloseCircleOutline />
                      Clear filters
                    </Button>
                  )}
                </Stack>

                <Wrap mt={3} gap={1}>
                  <WrapItem>
                    <Button
                      size="sm"
                      minH="44px"
                      colorPalette="gray"
                      variant={!selectedTag ? "solid" : "outline"}
                      aria-pressed={!selectedTag}
                      onClick={() => setSelectedTag(null)}
                    >
                      All ({sortedArticles.length})
                    </Button>
                  </WrapItem>
                  {allTags.map(({ tag, count }) => (
                    <WrapItem key={tag}>
                      <Button
                        size="sm"
                        minH="44px"
                        colorPalette="gray"
                        variant={selectedTag === tag ? "solid" : "ghost"}
                        aria-pressed={selectedTag === tag}
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag} ({count})
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>

                <HStack
                  mt={4}
                  gap={3}
                  color={mutedText}
                  fontSize="sm"
                  flexWrap="wrap"
                >
                  <HStack gap={1}>
                    <Icon asChild>
                      <IoTimeOutline />
                    </Icon>
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
                  <Icon boxSize={8} color="orange.400" mb={3} asChild>
                    <IoFlashOutline />
                  </Icon>
                  <Heading as="h2" size="md" mb={2}>
                    No articles found
                  </Heading>
                  <Text color={mutedText}>
                    Try a different search term or clear the active tag filter.
                  </Text>
                </Box>
              ) : (
                <Box
                  bg="bg.panel"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="xl"
                  overflow="hidden"
                >
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.slug || article.url}
                      {...article}
                    />
                  ))}
                </Box>
              )}
            </VStack>
          )}
        </VStack>
      </MotionBox>
    </Layout>
  );
};

export const getServerSideProps = async ({ res }) => {
  try {
    const { ok, articles: articlesData } = await fetchArticles();

    if (!ok) {
      throw new Error("Failed to fetch articles from portfolio-data");
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

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return {
      props: {
        articles: Array.isArray(articles) ? articles : [],
      },
    };
  } catch (error) {
    console.error("Failed to fetch articles in getServerSideProps:", error);
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");

    return {
      props: {
        articles: [],
        error: "Failed to load articles. Please try again later.",
      },
    };
  }
};

export default ArticlesPage;
