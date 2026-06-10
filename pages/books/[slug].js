import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Tag,
  Text,
  VStack,
  useColorModeValue,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import MarkdownProse from "../../components/markdown-prose";
import {
  IoArrowBackOutline,
  IoBookOutline,
  IoCalendarOutline,
  IoBulbOutline,
  IoFlashOutline,
  IoSwapHorizontalOutline,
  IoCheckmarkCircleOutline,
  IoLayersOutline,
  IoQuoteOutline,
} from "react-icons/io5";
import RatingStar from "../../components/ratingstar";
import Layout from "../../components/layouts/layout";
import {
  formatAbsoluteDate,
  getBookSlug,
  getBookNotes,
  hasBookNotes,
  resolvePortfolioAssetUrl,
} from "../../libs/contentUtils";

function SectionBlock({ icon, label, color, children, bg }) {
  const defaultBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const border = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const labelColor = useColorModeValue(`${color}.700`, `${color}.300`);

  return (
    <Box
      borderWidth="1px"
      borderColor={border}
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      bg={bg || defaultBg}
    >
      <HStack spacing={2} mb={3}>
        <Icon as={icon} color={`${color}.500`} boxSize={4} />
        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color={labelColor} letterSpacing="wider">
          {label}
        </Text>
      </HStack>
      {children}
    </Box>
  );
}

export default function BookDetailPage({ book }) {
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const bodyColor = useColorModeValue("gray.700", "gray.300");
  const proseBg = useColorModeValue("white", "whiteAlpha.50");
  const proseBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const decisionBg = useColorModeValue("orange.50", "orange.900");
  const decisionBorder = useColorModeValue("orange.300", "orange.600");
  const decisionText = useColorModeValue("orange.800", "orange.100");
  const quoteBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const quoteBorder = useColorModeValue("orange.300", "orange.600");
  const coverBg = useColorModeValue("gray.50", "blackAlpha.400");

  if (!book) return null;

  const canonicalUrl = `https://ozzo.blog/books/${book.slug}`;
  const hasPersonalSections = book.problem || book.decision || book.effect || book.trade_off;
  const hasQuotes = book.quotes?.length > 0;

  return (
    <Layout title={`${book.title} — Reading Notes`}>
      <Head>
        <meta
          name="description"
          content={`${book.tldr || `Personal reading notes and deep dive on ${book.title} by ${book.author}.`}`}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Container maxW="3xl" py={{ base: 6, md: 10 }}>
        <VStack align="start" spacing={8}>

          {/* Back link */}
          <Link as={NextLink} href="/books" color="orange.500" fontWeight="semibold">
            <HStack spacing={1}>
              <Icon as={IoArrowBackOutline} />
              <Text>Back to books</Text>
            </HStack>
          </Link>

          {/* Hero: cover + meta */}
          <Box w="100%">
            <HStack align="start" spacing={6} flexWrap="wrap">
              {book.cover && (
                <Box
                  flexShrink={0}
                  w={{ base: "100px", md: "130px" }}
                  bg={coverBg}
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p={2}
                >
                  <Image
                    src={book.cover}
                    alt={book.title}
                    maxH={{ base: "150px", md: "190px" }}
                    objectFit="contain"
                  />
                </Box>
              )}
              <VStack align="start" spacing={3} flex={1} minW="200px">
                <Heading as="h1" size="lg" lineHeight="1.15" color={headingColor}>
                  {book.title}
                </Heading>
                <HStack spacing={2} color={mutedText} fontSize="sm">
                  <Icon as={IoBookOutline} />
                  <Text fontWeight="medium">{book.author}</Text>
                </HStack>
                {book.date && (
                  <HStack spacing={2} color={mutedText} fontSize="sm">
                    <Icon as={IoCalendarOutline} />
                    <Text>Read {formatAbsoluteDate(book.date)}</Text>
                  </HStack>
                )}
                {book.rating > 0 && (
                  <HStack spacing={2}>
                    <RatingStar rating={book.rating} />
                    <Text color="orange.500" fontWeight="bold" fontSize="sm">
                      {book.rating}/5
                    </Text>
                  </HStack>
                )}
                <HStack flexWrap="wrap" spacing={2}>
                  {book.tags?.map((tag) => (
                    <Tag key={tag} colorScheme="orange" borderRadius="full" size="sm">
                      {tag}
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Key lesson — always shown if present */}
          {book.lesson && (
            <Box
              w="100%"
              borderLeftWidth="3px"
              borderLeftColor="orange.400"
              pl={4}
              py={1}
            >
              <Text fontStyle="italic" color={bodyColor} fontSize="md" lineHeight="1.6">
                &ldquo;{book.lesson}&rdquo;
              </Text>
            </Box>
          )}

          {/* Personal read sections */}
          {hasPersonalSections && (
            <VStack align="start" spacing={4} w="100%">
              <Heading as="h2" size="sm" color={mutedText} textTransform="uppercase" letterSpacing="wider">
                My read
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                {book.problem && (
                  <SectionBlock icon={IoBulbOutline} label="Why I picked this up" color="blue">
                    <Box sx={{ "& p": { mb: 0 } }}>
                      <MarkdownProse>{book.problem}</MarkdownProse>
                    </Box>
                  </SectionBlock>
                )}
                {book.concept && (
                  <SectionBlock icon={IoLayersOutline} label="What it teaches" color="purple">
                    <Box sx={{ "& p": { mb: 0 } }}>
                      <MarkdownProse>{book.concept}</MarkdownProse>
                    </Box>
                  </SectionBlock>
                )}
                {book.effect && (
                  <SectionBlock icon={IoCheckmarkCircleOutline} label="What changed" color="green">
                    <Box sx={{ "& p": { mb: 0 } }}>
                      <MarkdownProse>{book.effect}</MarkdownProse>
                    </Box>
                  </SectionBlock>
                )}
                {book.trade_off && (
                  <SectionBlock icon={IoSwapHorizontalOutline} label="Honest take" color="gray">
                    <Box sx={{ "& p": { mb: 0 } }}>
                      <MarkdownProse>{book.trade_off}</MarkdownProse>
                    </Box>
                  </SectionBlock>
                )}
              </SimpleGrid>

              {/* Decision — full width, highlighted */}
              {book.decision && (
                <Box
                  w="100%"
                  bg={decisionBg}
                  borderWidth="1px"
                  borderColor={decisionBorder}
                  borderRadius="xl"
                  p={{ base: 4, md: 5 }}
                >
                  <HStack spacing={2} mb={3}>
                    <Icon as={IoFlashOutline} color="orange.500" boxSize={4} />
                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color={decisionText} letterSpacing="wider">
                      What I decided
                    </Text>
                  </HStack>
                  <Box sx={{ "& p": { mb: 0 }, "& a": { color: decisionText } }}>
                    <MarkdownProse>{book.decision}</MarkdownProse>
                  </Box>
                  {book.implementation && (
                    <Box sx={{ "& p": { mb: 0 }, "& a": { color: decisionText } }} mt={3} opacity={0.85}>
                      <MarkdownProse>{book.implementation}</MarkdownProse>
                    </Box>
                  )}
                </Box>
              )}
            </VStack>
          )}

          {/* Notable quotes */}
          {hasQuotes && (
            <>
              <Divider />
              <VStack align="start" spacing={4} w="100%">
                <HStack spacing={2}>
                  <Icon as={IoQuoteOutline} color="orange.400" />
                  <Heading as="h2" size="sm" color={mutedText} textTransform="uppercase" letterSpacing="wider">
                    Notable quotes
                  </Heading>
                </HStack>
                <VStack spacing={3} w="100%" align="start">
                  {book.quotes.map((quote, i) => (
                    <Box
                      key={i}
                      w="100%"
                      borderLeftWidth="2px"
                      borderLeftColor={quoteBorder}
                      pl={4}
                      py={1}
                      bg={quoteBg}
                      borderRadius="sm"
                    >
                      <Text fontSize="sm" fontStyle="italic" color={bodyColor} lineHeight="1.7">
                        {quote}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </>
          )}

          {/* Fallback: raw notes for books without structured sections */}
          {!hasPersonalSections && book.notes && (
            <Box
              w="100%"
              p={{ base: 4, md: 6 }}
              borderWidth="1px"
              borderColor={proseBorder}
              borderRadius="xl"
              bg={proseBg}
            >
              <MarkdownProse>{book.notes}</MarkdownProse>
            </Box>
          )}

          {/* Empty state */}
          {!hasPersonalSections && !book.notes && (
            <Box
              w="100%"
              p={{ base: 4, md: 6 }}
              borderWidth="1px"
              borderColor={proseBorder}
              borderRadius="xl"
              bg={quoteBg}
            >
              <Text color={mutedText} fontSize="sm">
                Full reading notes for this book have not been published yet.
              </Text>
              {book.url && (
                <Link href={book.url} color="orange.500" fontWeight="semibold" isExternal fontSize="sm" mt={2} display="block">
                  Open original link
                </Link>
              )}
            </Box>
          )}

        </VStack>
      </Container>
    </Layout>
  );
}

export async function getStaticPaths() {
  const response = await fetch(
    "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/books.json",
  );
  const books = response.ok ? await response.json() : [];

  const paths = Array.isArray(books)
    ? books
        .map((book) => getBookSlug(book))
        .filter(Boolean)
        .map((slug) => ({ params: { slug: String(slug) } }))
    : [];

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/books.json",
    );

    if (!response.ok) return { notFound: true, revalidate: 60 };

    const books = await response.json();
    const book = Array.isArray(books)
      ? books.find((entry) => getBookSlug(entry) === params?.slug)
      : null;

    if (!book) return { notFound: true, revalidate: 60 };

    return {
      props: {
        book: {
          title: String(book.title || ""),
          author: String(book.author || ""),
          date: String(book.date || ""),
          slug: getBookSlug(book),
          notes: getBookNotes(book),
          hasNotes: hasBookNotes(book),
          lesson: String(book.lesson || ""),
          rating: typeof book.rating === "number" ? book.rating : 0,
          tags: Array.isArray(book.tags) ? book.tags.filter(Boolean) : [],
          cover: resolvePortfolioAssetUrl(book.cover),
          url: String(book.url || ""),
          // Structured personal sections
          problem: String(book.problem || ""),
          concept: String(book.concept || ""),
          decision: String(book.decision || ""),
          implementation: String(book.implementation || ""),
          effect: String(book.effect || ""),
          trade_off: String(book.trade_off || ""),
          // Deep dive from 08 Summaries
          tldr: String(book.tldr || ""),
          deep_dive: String(book.deep_dive || ""),
          quotes: Array.isArray(book.quotes) ? book.quotes.filter(Boolean) : [],
        },
      },
      revalidate: 60,
    };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
}
