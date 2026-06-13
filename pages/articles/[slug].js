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

export default function ArticleDetailPage({ article }) {
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const proseBg = useColorModeValue("white", "whiteAlpha.100");
  const proseBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const bookBg = useColorModeValue("orange.50", "orange.900");

  if (!article) return null;

  const canonicalUrl = `https://ozzo.blog/articles/${article.slug}`;
  const bookReference = getArticleBookReference(article);
  const bookUrl = getArticleBookUrl(article);

  return (
    <Layout title={article.title}>
      <Head>
        <meta name="description" content={article.description || "Article on ozzo.blog"} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Container maxW="4xl" py={{ base: 6, md: 10 }}>
        <VStack align="start" spacing={6}>
          <Link as={NextLink} href="/articles" color="orange.500" fontWeight="semibold">
            <HStack spacing={2}>
              <Icon as={IoArrowBackOutline} />
              <Text>Back to articles</Text>
            </HStack>
          </Link>

          <VStack align="start" spacing={3}>
            <Heading as="h1" size="lg" lineHeight="1.2"
              style={{ fontFamily: "'Merriweather', Georgia, serif" }}>
              {article.title}
            </Heading>
            <HStack spacing={3} flexWrap="wrap" color={mutedText}>
              <HStack spacing={1}>
                <Icon as={IoCalendarOutline} />
                <Text>{formatAbsoluteDate(article.date)}</Text>
              </HStack>
              {article.tags?.map((tag) => (
                <Tag key={tag} colorScheme="orange" borderRadius="full">
                  {tag}
                </Tag>
              ))}
            </HStack>
            {article.description && <Text color={mutedText}>{article.description}</Text>}
            {bookReference && (
              <Box
                w="100%"
                p={4}
                borderWidth="1px"
                borderColor={proseBorder}
                borderRadius="lg"
                bg={bookBg}
                _dark={{ bg: "orange.900" }}
              >
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="orange.600" _dark={{ color: "orange.300" }} mb={1}>
                  Referenced book
                </Text>
                {bookUrl ? (
                  <Link
                    as={bookUrl.startsWith("http") ? "a" : NextLink}
                    href={bookUrl}
                    color="orange.700"
                    _dark={{ color: "orange.200" }}
                    fontWeight="semibold"
                  >
                    {bookReference}
                  </Link>
                ) : (
                  <Text fontWeight="semibold">{bookReference}</Text>
                )}
              </Box>
            )}
          </VStack>

          <Box
            w="100%"
            p={{ base: 4, md: 6 }}
            borderWidth="1px"
            borderColor={proseBorder}
            borderRadius="xl"
            bg={proseBg}
            style={{ fontFamily: "'Merriweather', Georgia, serif" }}
          >
            <MarkdownProse>{article.content}</MarkdownProse>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
}

export async function getStaticPaths() {
  const response = await fetch(
    "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json",
  );
  const articles = response.ok ? await response.json() : [];

  const paths = Array.isArray(articles)
    ? articles
        .filter((article) => isInternalArticle(article))
        .map((article) => ({ params: { slug: String(article.slug) } }))
    : [];

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json",
    );

    if (!response.ok) {
      return { notFound: true, revalidate: 60 };
    }

    const articles = await response.json();
    const article = Array.isArray(articles)
      ? articles.find(
          (entry) =>
            isInternalArticle(entry) &&
            entry?.slug === params?.slug &&
            getArticleBody(entry),
        )
      : null;

    if (!article) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        article: {
          title: String(article.title || ""),
          description: String(article.description || ""),
          date: String(article.date || ""),
          slug: String(article.slug || ""),
          content: getArticleBody(article),
          tags: Array.isArray(article.tags) ? article.tags.filter(Boolean) : [],
          book: String(article.book || ""),
          book_url: String(article.book_url || ""),
          thumbnail: article.thumbnail
            ? resolvePortfolioAssetUrl(article.thumbnail)
            : "",
        },
      },
      revalidate: 60,
    };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
}
