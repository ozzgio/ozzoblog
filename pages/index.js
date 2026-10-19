import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { LuArrowUpRight, LuCode } from "react-icons/lu";
import Layout from "../components/layouts/layout";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import Bookshelf from "../components/bookshelf";
import projectData from "../libs/projectData";

export { getServerSideProps } from "../libs/homeData";

const MoonHero = dynamic(() => import("../components/icons/moon-hero"), {
  ssr: false,
  loading: () => (
    <Box width={{ base: "280px", sm: "340px" }} maxW="100%" aspectRatio={1} />
  ),
});

export default function Home({
  latestArticles = [],
  articlesError = false,
  currentBook = null,
  shelfBooks = [],
}) {
  const [latest, ...recent] = latestArticles;

  return (
    <Layout
      title="Home"
      metaTitle="Ozzo | Software, books, and writing"
      description="Ozzo's notebook on building software, reading books, and learning to work independently."
      path="/"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Ozzo.blog",
        url: "https://ozzo.blog",
        description:
          "Notes on building software, reading books, and learning to work independently.",
        author: {
          "@type": "Person",
          name: "Ozzo",
          url: "https://ozzo.blog/about",
          sameAs: ["https://github.com/ozzgio", "https://x.com/ozzgio"],
        },
      }}
    >
      <VStack align="stretch" gap={6}>
        <Box
          as="header"
          bg="bg.subtle"
          borderRadius="2xl"
          p={{ base: 4, md: 7 }}
        >
          <Box
            display="grid"
            gridTemplateColumns={{
              base: "minmax(0, 1fr) 112px",
              sm: "minmax(0, 1fr) 240px",
              md: "minmax(0, 1fr) 300px",
            }}
            alignItems="center"
            gap={{ base: 3, md: 5 }}
          >
            <Box minW={0}>
              <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb={3}>
                Developer &amp; writer
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: "28px", sm: "4xl", lg: "5xl" }}
                lineHeight="1.08"
                letterSpacing="-0.04em"
              >
                Ozzo’s
                <br />
                notebook
                <Box as="span" color="accent.link">
                  .
                </Box>
              </Heading>
            </Box>
            <Box
              data-testid="homepage-moon"
              gridColumn={2}
              gridRow={{ base: 1, md: "1 / 3" }}
              minW={0}
              display="flex"
              justifyContent="center"
            >
              <MoonHero size={340} />
            </Box>
            <Box gridColumn={{ base: "1 / -1", md: 1 }}>
              <Text
                color="fg.muted"
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.7"
                maxW="32rem"
              >
                I build software, read books, and write about what I learn.
              </Text>
              <Link
                asChild
                minH="44px"
                mt={2}
                fontSize="sm"
                fontWeight="medium"
              >
                <NextLink href="/about">
                  More about me <LuArrowUpRight />
                </NextLink>
              </Link>
            </Box>
          </Box>
        </Box>

        <Box
          as="section"
          aria-label="Latest essay"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
        >
          <Flex
            justify="space-between"
            align="center"
            gap={3}
            mb={3}
            wrap="wrap"
          >
            <HStack gap={2} fontSize="xs" fontWeight="semibold">
              <Box
                boxSize="6px"
                borderRadius="full"
                bg="accent.link"
                aria-hidden="true"
              />
              <Text>Latest writing</Text>
            </HStack>
            {latest && (
              <Text
                as="time"
                dateTime={latest.date}
                fontSize="xs"
                color="fg.muted"
                fontVariantNumeric="tabular-nums"
              >
                {latest.formattedDate || "No date"}
              </Text>
            )}
          </Flex>
          {articlesError ? (
            <Text color="fg.muted">
              I couldn&apos;t load the latest articles. Please try again later.
            </Text>
          ) : latest ? (
            <Box as="article">
              <Heading
                as="h2"
                fontFamily="var(--font-playfair-display), Georgia, serif"
                fontSize={{ base: "2xl", md: "3xl" }}
                lineHeight="1.25"
                mb={2}
              >
                <Link
                  asChild
                  color="fg"
                  minH="44px"
                  display="inline-flex"
                  _hover={{ color: "accent.link" }}
                >
                  <NextLink
                    href={latest.url}
                    {...(latest.source === "external"
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {latest.title}
                  </NextLink>
                </Link>
              </Heading>
              <Text
                color="fg.muted"
                fontSize="sm"
                lineHeight="1.75"
                maxW="65ch"
              >
                {latest.description || latest.summary}
              </Text>
              <Link
                asChild
                minH="44px"
                mt={2}
                fontSize="sm"
                fontWeight="semibold"
              >
                <NextLink
                  href={latest.url}
                  {...(latest.source === "external"
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  Read the essay {latest.source === "external" ? "↗" : "→"}
                </NextLink>
              </Link>
            </Box>
          ) : (
            <Text color="fg.muted">No articles published yet.</Text>
          )}
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{
            base: "minmax(0, 1fr)",
            md: "minmax(0, 1.65fr) minmax(0, 1fr)",
          }}
          alignItems="start"
          gap={6}
        >
          <Box as="section" aria-labelledby="recent-heading" minW={0}>
            <Flex
              justify="space-between"
              align="center"
              gap={3}
              mb={2}
              wrap="wrap"
            >
              <Heading as="h2" id="recent-heading" fontSize="md">
                Recent notes
              </Heading>
              <Link asChild fontSize="xs" minH="44px">
                <NextLink href="/articles">All writing →</NextLink>
              </Link>
            </Flex>
            <Box borderTopWidth="1px" borderColor="border">
              {recent.map((article) => (
                <Box
                  as="article"
                  key={article.url}
                  py={3}
                  borderBottomWidth="1px"
                  borderColor="border"
                >
                  <Text
                    as="time"
                    dateTime={article.date}
                    fontSize="xs"
                    color="fg.muted"
                    fontVariantNumeric="tabular-nums"
                  >
                    {article.formattedDate || "No date"}
                  </Text>
                  <Heading as="h3" fontSize="lg" lineHeight="1.35">
                    <Link
                      asChild
                      color="fg"
                      minH="44px"
                      display="inline-flex"
                      _hover={{ color: "accent.link" }}
                    >
                      <NextLink
                        href={article.url}
                        {...(article.source === "external"
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {article.title}
                        {article.source === "external" ? " ↗" : ""}
                      </NextLink>
                    </Link>
                  </Heading>
                  <Text fontSize="sm" color="fg.muted" lineHeight="1.65">
                    {article.description || article.summary}
                  </Text>
                </Box>
              ))}
              {recent.length === 0 && (
                <Text py={4} fontSize="sm" color="fg.muted">
                  Browse the archive for more articles.
                </Text>
              )}
            </Box>
          </Box>
          <VStack
            as="aside"
            aria-label="Reading and projects"
            align="stretch"
            gap={4}
            minW={0}
          >
            <Bookshelf currentBook={currentBook} books={shelfBooks} />
            <Box
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p={5}
            >
              <HStack gap={2} mb={1}>
                <LuCode />
                <Heading as="h2" fontSize="sm">
                  Currently building
                </Heading>
              </HStack>
              {projectData
                .filter((project) => project.featured)
                .map((project) => (
                  <Box
                    key={project.id}
                    py={2}
                    borderBottomWidth="1px"
                    borderColor="border"
                  >
                    <Link asChild minH="44px" color="fg" fontWeight="semibold">
                      <NextLink href={`/projects/${project.id}`}>
                        {project.title}
                        <LuArrowUpRight />
                      </NextLink>
                    </Link>
                    <Text fontSize="xs" color="fg.muted">
                      {project.audience}
                    </Text>
                  </Box>
                ))}
              <Link asChild minH="44px" mt={2} fontSize="sm">
                <NextLink href="/projects">All projects →</NextLink>
              </Link>
            </Box>
            <Box
              as="section"
              aria-labelledby="subscribe-heading"
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p={{ base: 4, md: 6 }}
            >
              <Heading as="h2" id="subscribe-heading" fontSize="lg">
                New writing by email
              </Heading>
              <NewsletterSubscribe borderTopWidth="0" mt={0} pt={3} />
              <Text fontSize="xs" color="fg.muted" mt={2}>
                Or follow along via <Link href="/rss.xml">RSS ↗</Link>
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Layout>
  );
}
