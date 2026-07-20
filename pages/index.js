import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Section from "../components/section";
import Paragraph from "../components/paragraph";
import { BioSection, BioYear } from "../components/bio";
import Layout from "../components/layouts/layout";
import BaseCard from "../components/basecard";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import {
  fetchArticles,
  fetchBooks,
  getArticleSummary,
  isInternalArticle,
  resolvePortfolioAssetUrl,
} from "../libs/contentUtils";

// three.js + OrbitControls (~600KB+) only needed for this decorative canvas —
// keep it out of the homepage's initial bundle, same pattern already used
// for MermaidDiagram in markdown-prose.js. A same-size loading placeholder
// reserves the 340x340 hero's layout space so hydration doesn't shift the
// statement/profile content below it (CLS).
const MoonHero = dynamic(() => import("../components/icons/moon-hero"), {
  ssr: false,
  loading: () => <Box width={340} height={340} display="inline-block" />,
});

const formatAbsoluteDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const normalizeArticle = (article) => {
  const internal = isInternalArticle(article);
  const slug =
    typeof article.slug === "string" && article.slug.trim()
      ? article.slug.trim()
      : "";
  const externalUrl =
    typeof article.url === "string" && article.url.trim()
      ? article.url.trim()
      : "";
  const url = internal ? `/articles/${slug}` : externalUrl;

  return {
    title: String(article.title || ""),
    description: String(article.description || ""),
    summary: getArticleSummary(article, 140),
    url,
    date: String(article.date || ""),
    formattedDate: formatAbsoluteDate(article.date || ""),
    source: internal ? "internal" : "external",
    thumbnail: article.thumbnail
      ? resolvePortfolioAssetUrl(article.thumbnail)
      : "",
    book: String(article.book || ""),
    book_url: String(article.book_url || ""),
  };
};

const SectionLabel = ({ children, mt = 10 }) => (
  <Text
    fontSize="xs"
    fontWeight="bold"
    textTransform="uppercase"
    letterSpacing="0.12em"
    color="gray.600"
    _dark={{ color: "gray.400" }}
    mb={6}
    mt={mt}
  >
    {children}
  </Text>
);

const Home = ({
  latestArticles = [],
  articlesError = false,
  currentBook = null,
}) => {
  const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://ozzo.blog/#person",
        name: "Giorgio Ozzola",
        alternateName: "Ozzo",
        url: "https://ozzo.blog",
        sameAs: [
          "https://github.com/ozzgio",
          "https://www.linkedin.com/in/ozzolagiorgio/",
        ],
        jobTitle: "Full-stack Developer",
        description:
          "Full-stack developer building useful things with Ruby on Rails. Shipping in public.",
      },
      {
        "@type": "WebSite",
        "@id": "https://ozzo.blog/#website",
        url: "https://ozzo.blog",
        name: "Ozzo.blog",
        description:
          "Building small Rails apps in public. Stack decisions, trade-offs, and the craft of shipping.",
        publisher: { "@id": "https://ozzo.blog/#person" },
      },
    ],
  };

  return (
    <Layout
      title="Home"
      metaTitle="Full-stack developer building useful things with Ruby on Rails"
      description="Building small Rails apps in public. Writing about stack decisions, trade-offs, and the craft of shipping."
      keywords="ruby on rails, build in public, solo developer, stack decisions, shipping, italian developer"
      path="/"
      jsonLd={homepageSchema}
    >
      {/* Hero */}
      <Box textAlign="center" pt={4} mb={2}>
        <MoonHero size={340} />
      </Box>

      <Container>
        {/* Statement - large type, no box */}
        <Box mb={12} mt={4}>
          <Heading
            as="p"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="800"
            lineHeight="1.15"
            letterSpacing="-0.01em"
            color="#1c1917"
            _dark={{ color: "white" }}
            style={{ fontFamily: "var(--font-bricolage-grotesque), sans-serif" }}
          >
            Building useful things with Ruby on Rails
            <br />
            and shipping in public, one app at a time.
          </Heading>
        </Box>

        {/* Profile - no card chrome */}
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          gap={5}
          mb={14}
          pb={10}
          borderBottomWidth="1px"
          borderBottomColor="gray.100"
          _dark={{ borderBottomColor: "whiteAlpha.100" }}
        >
          <Box
            flexShrink={0}
            position="relative"
            borderRadius="full"
            overflow="hidden"
            boxSize={{ base: "64px", md: "72px" }}
          >
            <Image
              src="/images/propic.jpg"
              alt="Giorgio Ozzola"
              fill
              sizes="72px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </Box>
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              bgGradient="linear(to-r, orange.400, orange.600)"
              _dark={{ bgGradient: "linear(to-r, orange.300, orange.500)" }}
              bgClip="text"
              mb={1}
            >
              Ozzo
            </Heading>
            <Text
              fontSize="sm"
              color="gray.600"
              _dark={{ color: "gray.400" }}
            >
              Building Rails apps in public. Six-week bets, real trade-offs, honest process.
            </Text>
          </Box>
        </Box>

        <NewsletterSubscribe borderTopWidth="0" mt={0} pt={0} mb={14} />

        {/* Currently building */}
        <Section delay={0.1}>
          <SectionLabel mt={0}>Currently building</SectionLabel>
          <VStack spacing={8} align="stretch">
            <Box
              borderLeftWidth="2px"
              borderLeftColor="orange.400"
              _dark={{ borderLeftColor: "orange.500" }}
              pl={5}
            >
              <Heading as="h2" fontSize="md" fontWeight="semibold" mb={1.5}>
                Rails portfolio
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                mb={2}
              >
                Small Rails apps shipped in public on a six-week Shape Up
                cadence. Rails 8, SQLite, DaisyUI, deployed with Kamal on
                Hetzner. Building useful things, one bet at a time.
              </Text>
              <Link
                as={NextLink}
                href="/projects"
                color="orange.700"
                _dark={{ color: "orange.300" }}
                fontSize="sm"
                fontWeight="medium"
              >
                View projects →
              </Link>
            </Box>

            <Box
              borderLeftWidth="2px"
              borderLeftColor="gray.200"
              _dark={{ borderLeftColor: "whiteAlpha.200" }}
              pl={5}
            >
              <Heading as="h2" fontSize="md" fontWeight="semibold" mb={1.5}>
                Synergym (maintenance)
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                A Rails app for personal trainers. Development stopped,
                maintenance only now. The distribution lessons from building
                it shape how I ship everything else.
              </Text>
            </Box>

            <Box
              borderLeftWidth="2px"
              borderLeftColor="gray.200"
              _dark={{ borderLeftColor: "whiteAlpha.200" }}
              pl={5}
            >
              <Heading as="h2" fontSize="md" fontWeight="semibold" mb={1.5}>
                Self-hosted infrastructure
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                mb={2}
              >
                Dockerized services on an Intel NUC14 supporting the work,
                including a custom MCP server exposing the Obsidian vault to
                AI agents. The infrastructure layer behind everything else.
              </Text>
              <Link
                as={NextLink}
                href="/experience#homelab"
                color="orange.700"
                _dark={{ color: "orange.300" }}
                fontSize="sm"
                fontWeight="medium"
              >
                Full breakdown →
              </Link>
            </Box>
          </VStack>
        </Section>

        {/* Why this exists */}
        <Section delay={0.2}>
          <SectionLabel>Why this exists</SectionLabel>
          <Paragraph>
            This is my space on the internet. Part portfolio, part build log.
            LinkedIn makes you a user ID. GitHub shows code. This shows the
            person and the process behind the work.
          </Paragraph>
          <Paragraph>
            I build small Rails apps in public, on a fixed cadence, and write
            about the decisions and trade-offs behind each one. The work and
            the writing are the same loop.
          </Paragraph>
          <Paragraph>
            I work with AI, not against it. It increases leverage, but only
            with human review, judgment, and the taste to know what should
            not ship.
          </Paragraph>
          <Paragraph>
            I lift four times a week, read constantly, and build software
            outside of work. That is the whole personality section.
          </Paragraph>
          <Box display="flex" gap={3} mt={8} flexWrap="wrap">
            <Button
              as={NextLink}
              href="/articles"
              scroll={false}
              rightIcon={<ChevronRightIcon />}
              colorScheme="orange"
              size="md"
            >
              Read the writing
            </Button>
            <Button
              as={NextLink}
              href="/experience"
              scroll={false}
              rightIcon={<ChevronRightIcon />}
              colorScheme="orange"
              variant="ghost"
              size="md"
            >
              My background
            </Button>
          </Box>
        </Section>

        {/* Latest writing */}
        <Section delay={0.3}>
          <SectionLabel>Latest writing</SectionLabel>
          {articlesError ? (
            <Text color="gray.600" _dark={{ color: "gray.400" }}>Latest writing is temporarily unavailable.</Text>
          ) : latestArticles.length === 0 ? (
            <Text color="gray.600" _dark={{ color: "gray.400" }}>No articles yet. That gap is visible on purpose.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {latestArticles.map((article) => (
                <BaseCard
                  key={`${article.source}:${article.url}`}
                  maxW="none"
                  h="100%"
                >
                  <VStack align="start" spacing={3} h="100%">
                    <Badge colorScheme="orange">
                      {article.formattedDate || "No date"}
                    </Badge>
                    <Heading as="h3" fontSize="lg" lineHeight="1.2">
                      {article.title}
                    </Heading>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      {article.description ||
                        article.summary ||
                        "No description provided."}
                    </Text>
                    <Link
                      as={article.source === "internal" ? NextLink : "a"}
                      href={article.url}
                      isExternal={article.source !== "internal"}
                      color="orange.700"
                      _dark={{ color: "orange.300" }}
                      fontWeight="medium"
                      mt="auto"
                    >
                      {article.source === "internal" ? (
                        "Read article"
                      ) : (
                        <>
                          Read article <ExternalLinkIcon mx="2px" />
                        </>
                      )}
                    </Link>
                  </VStack>
                </BaseCard>
              ))}
            </SimpleGrid>
          )}
          {currentBook && (
            <Box
              borderLeftWidth="2px"
              borderLeftColor="gray.200"
              _dark={{ borderLeftColor: "whiteAlpha.200" }}
              pl={5}
              mt={8}
            >
              <Link
                as={NextLink}
                href="/books"
                _hover={{ textDecoration: "none", color: "orange.600" }}
                _dark={{ _hover: { color: "orange.300" } }}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  mb={1}
                >
                  Currently reading
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {currentBook.title}
                </Text>
                <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                  {currentBook.author}
                </Text>
              </Link>
            </Box>
          )}
        </Section>

        {/* Bio */}
        <Section delay={0.4}>
          <SectionLabel>Bio</SectionLabel>
          <BioSection>
            <BioYear>2001</BioYear>
            Born in Piacenza, Italy.
          </BioSection>
          <BioSection>
            <BioYear>2021</BioYear>
            Completed HS diploma in Computer Science.
          </BioSection>
          <BioSection>
            <BioYear>2021</BioYear>
            Worked @{" "}
            <Link as={NextLink} href="https://www.getec-italia.com/it/" target="_blank" passHref>
              Getec Italia
            </Link>
            .
          </BioSection>
          <BioSection>
            <BioYear>2022</BioYear>
            Worked @ H&amp;S{" "}
            <Link as={NextLink} href="https://www.cgm.com" target="_blank" passHref>
              (CGM Group)
            </Link>
            .
          </BioSection>
          <BioSection>
            <BioYear>2023 to present</BioYear>
            Full-time consultant @{" "}
            <Link as={NextLink} href="https://alten.it" target="_blank" passHref>
              Alten Italia
            </Link>
            .
          </BioSection>
          <BioSection>
            <BioYear>2023 to present</BioYear>
            Mentee of{" "}
            <Link as={NextLink} href="https://linkedin.com/in/davidecovato" target="_blank" passHref>
              Davide Covato
            </Link>
            .
          </BioSection>
        </Section>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ res }) {
  // The helpers never reject (they resolve to { ok:false } on any failure),
  // so Promise.all is safe and each source degrades independently via .ok.
  const [articlesPayload, booksPayload] = await Promise.all([
    fetchArticles(),
    fetchBooks(),
  ]);

  let latestArticles = [];
  let articlesError = false;
  let currentBook = null;

  if (articlesPayload.ok && Array.isArray(articlesPayload.articles)) {
    latestArticles = articlesPayload.articles
      .filter((article) => article && article.title && article.date)
      .map(normalizeArticle)
      .filter((article) => article.url)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);
  } else {
    articlesError = true;
  }

  if (booksPayload.ok && Array.isArray(booksPayload.books)) {
    const reading = booksPayload.books.find(
      (b) => b.status === "reading" && b.title && b.author,
    );
    if (reading) {
      currentBook = {
        title: String(reading.title),
        author: String(reading.author),
      };
    }
  }

  // The homepage still renders fully (with a fallback message in the
  // latest-writing section) when only the articles fetch fails, so this
  // stays a 200 and skips the shared cache rather than serving a 503 for a
  // page that can render.
  res.setHeader(
    "Cache-Control",
    articlesError ? "no-store" : "s-maxage=60, stale-while-revalidate=300",
  );

  return {
    props: { latestArticles, articlesError, currentBook },
  };
}

export default Home;
