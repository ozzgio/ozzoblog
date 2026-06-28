import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Link,
  Tag,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import MarkdownProse from "../../components/markdown-prose";
import NewsletterSubscribe from "../../components/NewsletterSubscribe";
import { IoArrowBackOutline, IoCalendarOutline } from "react-icons/io5";
import Layout from "../../components/layouts/layout";
import {
  formatAbsoluteDate,
  getArticleBody,
  getArticleBookReference,
  getArticleBookUrl,
  isInternalArticle,
  resolvePortfolioAssetUrl,
} from "../../libs/contentUtils";

const READING_FONT = "var(--font-merriweather), Georgia, serif";

export default function ArticleDetailPage({ article, fetchError, slug }) {
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const ruleColor = useColorModeValue("orange.400", "orange.500");
  // orange.500 is 3.11:1 against the light page background -- fails AA.
  // orange.700 clears it (6.0:1) while orange.500 already clears the dark
  // background (5.12:1), so this needs to vary by mode, not be a single token.
  const linkOrange = useColorModeValue("orange.700", "orange.500");

  if (fetchError || !article) {
    return (
      <Layout title="Article temporarily unavailable">
        <Head>
          <meta name="description" content="Article temporarily unavailable" />
          <meta name="robots" content="noindex" />
        </Head>

        <Container maxW="2xl" py={{ base: 6, md: 10 }}>
          <VStack align="start" spacing={6}>
            <Link as={NextLink} href="/articles" color={linkOrange} fontWeight="semibold">
              <HStack spacing={2}>
                <Icon as={IoArrowBackOutline} />
                <Text>Back to articles</Text>
              </HStack>
            </Link>

            <VStack align="start" spacing={3} w="100%">
              <Heading as="h1" size="lg" lineHeight="1.25" fontFamily={READING_FONT}>
                Article temporarily unavailable
              </Heading>
              <Text color={mutedText} lineHeight="1.7">
                We could not refresh this article from the upstream content source right now.
                Please try again in a moment; if the page was already published, the cached
                version will continue serving once it is available again.
              </Text>
              {slug && (
                <Text color={mutedText} fontSize="sm">
                  Slug: {slug}
                </Text>
              )}
            </VStack>
          </VStack>
        </Container>
      </Layout>
    );
  }

  const canonicalUrl = `https://ozzo.blog/articles/${article.slug}`;
  const bookReference = getArticleBookReference(article);
  const bookUrl = getArticleBookUrl(article);

  return (
    <Layout title={article.title}>
      <Head>
        <meta name="description" content={article.description || "Article on ozzo.blog"} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      {/* Measure tuned for long-form reading: ~70 characters per line at the
          body font size, rather than stretching to the same width used by
          card-grid pages. */}
      <Container maxW="2xl" py={{ base: 6, md: 10 }}>
        <VStack align="start" spacing={8}>
          <Link as={NextLink} href="/articles" color={linkOrange} fontWeight="semibold">
            <HStack spacing={2}>
              <Icon as={IoArrowBackOutline} />
              <Text>Back to articles</Text>
            </HStack>
          </Link>

          <VStack align="start" spacing={4} w="100%">
            <Heading as="h1" size="lg" lineHeight="1.25" fontFamily={READING_FONT}>
              {article.title}
            </Heading>
            <HStack spacing={3} flexWrap="wrap" color={mutedText} fontSize="sm">
              <HStack spacing={1}>
                <Icon as={IoCalendarOutline} />
                <Text>{formatAbsoluteDate(article.date)}</Text>
              </HStack>
              {article.tags?.map((tag) => (
                <Tag key={tag} colorScheme="orange" borderRadius="full" size="sm">
                  {tag}
                </Tag>
              ))}
            </HStack>
            {article.description && (
              <Text color={mutedText} fontSize="md" lineHeight="1.7">
                {article.description}
              </Text>
            )}
            {bookReference && (
              <HStack
                w="100%"
                borderLeftWidth="3px"
                borderLeftColor={ruleColor}
                pl={3}
                py={1}
                spacing={2}
                fontSize="sm"
              >
                <Text color={mutedText}>Referenced book:</Text>
                {bookUrl ? (
                  <Link
                    as={bookUrl.startsWith("http") ? "a" : NextLink}
                    href={bookUrl}
                    color="orange.700"
                    _dark={{ color: "orange.300" }}
                    fontWeight="semibold"
                  >
                    {bookReference}
                  </Link>
                ) : (
                  <Text fontWeight="semibold">{bookReference}</Text>
                )}
              </HStack>
            )}
          </VStack>

          <Box w="100%" h="2px" bg={ruleColor} opacity={0.6} borderRadius="full" />

          <Box w="100%">
            <MarkdownProse>{article.content}</MarkdownProse>
          </Box>

          <NewsletterSubscribe w="100%" />
        </VStack>
      </Container>
    </Layout>
  );
}

function mapArticle(article) {
  return {
    title: String(article.title || ""),
    description: String(article.description || ""),
    date: String(article.date || ""),
    slug: String(article.slug || ""),
    content: getArticleBody(article),
    tags: Array.isArray(article.tags) ? article.tags.filter(Boolean) : [],
    book: String(article.book || ""),
    book_url: String(article.book_url || ""),
    thumbnail: article.thumbnail ? resolvePortfolioAssetUrl(article.thumbnail) : "",
  };
}

const ARTICLES_URL = "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json";
const REVALIDATE_SECONDS = 60;

const fetchInternalArticles = async () => {
  const response = await fetch(ARTICLES_URL);

  if (!response.ok) {
    return { ok: false, articles: [] };
  }

  const articles = await response.json();
  return { ok: true, articles: Array.isArray(articles) ? articles : [] };
};

const findInternalArticle = (articles, slug) =>
  Array.isArray(articles)
    ? articles.find(
        (entry) =>
          isInternalArticle(entry) &&
          entry?.slug === slug &&
          getArticleBody(entry),
      )
    : null;

export async function getStaticPaths() {
  try {
    const { articles } = await fetchInternalArticles();
    const paths = articles
      .map((article) => String(article?.slug || "").trim())
      .filter(Boolean)
      .map((slug) => ({ params: { slug } }));

    return { paths, fallback: "blocking" };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  const slug = String(params?.slug || "").trim();

  try {
    const { ok, articles } = await fetchInternalArticles();

    if (!ok) {
      return {
        props: {
          article: null,
          fetchError: true,
          slug,
        },
        revalidate: REVALIDATE_SECONDS,
      };
    }

    const article = findInternalArticle(articles, slug);

    if (!article) {
      return { notFound: true, revalidate: REVALIDATE_SECONDS };
    }

    return {
      props: {
        article: mapArticle(article),
        fetchError: false,
        slug,
      },
      revalidate: REVALIDATE_SECONDS,
    };
  } catch {
    return {
      props: {
        article: null,
        fetchError: true,
        slug,
      },
      revalidate: REVALIDATE_SECONDS,
    };
  }
}
