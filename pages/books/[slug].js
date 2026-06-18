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
  IoChatbubbleOutline,
  IoHammerOutline,
} from "react-icons/io5";
import RatingStar from "../../components/ratingstar";
import Layout from "../../components/layouts/layout";
import {
  formatAbsoluteDate,
  getBookSlug,
  getBookNotes,
  hasBookNotes,
  parseBookNotesSections,
  resolvePortfolioAssetUrl,
} from "../../libs/contentUtils";

const READING_FONT = "'Merriweather', Georgia, serif";

// Every book's notes follow the same reflection arc: why I picked it up,
// what it teaches, what I decided, what changed, what I'd push back on.
// One icon per recognized step, one accent color throughout -- the steps
// are a real sequence, the rainbow-card-per-topic treatment they used to
// get was decorative, not informative.
const STEP_ICON_RULES = [
  [/decision|decided/i, IoFlashOutline],
  [/implementation/i, IoHammerOutline],
  [/problem|why/i, IoBulbOutline],
  [/concept|teach/i, IoLayersOutline],
  [/effect|changed/i, IoCheckmarkCircleOutline],
  [/trade.?off|reflection/i, IoSwapHorizontalOutline],
];

function iconForLabel(label) {
  const match = STEP_ICON_RULES.find(([pattern]) => pattern.test(label));
  return match ? match[1] : IoChatbubbleOutline;
}

function ReadingArc({ sections }) {
  const railColor = useColorModeValue("orange.300", "orange.600");
  const markerBg = useColorModeValue("white", "#1a1a1e");
  const labelColor = useColorModeValue("orange.700", "orange.300");
  const decisionBg = useColorModeValue("orange.50", "orange.900");
  const decisionBorder = useColorModeValue("orange.300", "orange.600");

  return (
    <Box
      borderLeftWidth="2px"
      borderLeftColor={railColor}
      ml={{ base: 2, md: 3 }}
      pl={{ base: 6, md: 8 }}
    >
      {sections.map((section, index) => {
        const isDecision = /decision|decided/i.test(section.label);
        const isLast = index === sections.length - 1;

        return (
          <Box key={section.label} position="relative" pb={isLast ? 0 : 7}>
            <Box
              position="absolute"
              left={{ base: "-37px", md: "-49px" }}
              top="0"
              boxSize={{ base: "26px", md: "30px" }}
              borderRadius="full"
              bg={markerBg}
              borderWidth="2px"
              borderColor={railColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={iconForLabel(section.label)} boxSize={{ base: 3, md: 3.5 }} color={railColor} />
            </Box>

            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color={labelColor}
              mb={2}
            >
              {section.label}
            </Text>

            {isDecision ? (
              <Box
                bg={decisionBg}
                borderWidth="1px"
                borderColor={decisionBorder}
                borderRadius="lg"
                p={{ base: 4, md: 5 }}
                sx={{ "& p:last-of-type": { mb: 0 } }}
              >
                <MarkdownProse size="compact">{section.body}</MarkdownProse>
              </Box>
            ) : (
              <Box sx={{ "& p:last-of-type": { mb: 0 } }}>
                <MarkdownProse size="compact">{section.body}</MarkdownProse>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default function BookDetailPage({ book }) {
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const bodyColor = useColorModeValue("gray.700", "gray.300");
  const proseBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  // orange.500 is 3.11:1 against the light page background -- fails AA.
  // orange.700 clears it (6.0:1) while orange.500 already clears the dark
  // background (5.12:1), so this needs to vary by mode, not be a single token.
  const linkOrange = useColorModeValue("orange.700", "orange.500");
  const quoteBg = useColorModeValue("orange.50", "whiteAlpha.50");
  const quoteBorder = useColorModeValue("orange.300", "orange.600");

  if (!book) return null;

  const canonicalUrl = `https://ozzo.blog/books/${book.slug}`;

  // Two ways "my read" content can arrive: the structured JSON fields
  // (currently unused by any book in portfolio-data, kept for forward
  // compatibility), or the **Label** convention every book actually uses
  // inside `notes`. Normalize both into the same {label, body} shape so
  // there is exactly one rendering path.
  const structuredSections = [
    book.problem && { label: "Why I picked this up", body: book.problem },
    book.concept && { label: "What it teaches", body: book.concept },
    book.decision && { label: "What I decided", body: book.decision },
    book.implementation && { label: "Implementation", body: book.implementation },
    book.effect && { label: "What changed", body: book.effect },
    book.trade_off && { label: "Critical reflection", body: book.trade_off },
  ].filter(Boolean);

  const sections = structuredSections.length > 0
    ? structuredSections
    : parseBookNotesSections(book.notes);

  const hasArc = sections.length > 0;
  const hasQuotes = book.quotes?.length > 0;

  return (
    <Layout title={`${book.title}: Reading Notes`}>
      <Head>
        <meta
          name="description"
          content={`${book.tldr || `Personal reading notes and deep dive on ${book.title} by ${book.author}.`}`}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <Container maxW="2xl" py={{ base: 6, md: 10 }}>
        <VStack align="start" spacing={8}>
          <Link
            as={NextLink}
            href="/books"
            color={linkOrange}
            fontWeight="semibold"
          >
            <HStack spacing={1}>
              <Icon as={IoArrowBackOutline} />
              <Text>Back to books</Text>
            </HStack>
          </Link>

          <HStack align="start" spacing={{ base: 4, md: 6 }} w="100%" flexWrap="wrap">
            {book.cover && (
              <Image
                src={book.cover}
                alt={book.title}
                flexShrink={0}
                w={{ base: "92px", md: "120px" }}
                borderRadius="md"
                boxShadow="lg"
                objectFit="cover"
              />
            )}
            <VStack align="start" spacing={3} flex={1} minW="200px">
              <Heading
                as="h1"
                size="lg"
                lineHeight="1.2"
                color={headingColor}
                fontFamily={READING_FONT}
              >
                {book.title}
              </Heading>
              <HStack spacing={2} color={mutedText} fontSize="sm">
                <Icon as={IoBookOutline} />
                <Text fontWeight="medium">{book.author}</Text>
                {book.date && (
                  <>
                    <Text aria-hidden="true">&middot;</Text>
                    <Icon as={IoCalendarOutline} />
                    <Text>Read {formatAbsoluteDate(book.date)}</Text>
                  </>
                )}
              </HStack>
              {book.rating > 0 && (
                <HStack spacing={2}>
                  <RatingStar rating={book.rating} />
                  <Text color={linkOrange} fontWeight="bold" fontSize="sm">
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

          {book.lesson && (
            <Box w="100%" borderLeftWidth="3px" borderLeftColor="orange.400" pl={4} py={1}>
              <Text
                fontStyle="italic"
                color={bodyColor}
                fontSize="lg"
                lineHeight="1.6"
                fontFamily={READING_FONT}
              >
                &ldquo;{book.lesson}&rdquo;
              </Text>
            </Box>
          )}

          {hasArc && (
            <VStack align="start" spacing={4} w="100%">
              <Heading as="h2" size="sm" color={mutedText} textTransform="uppercase" letterSpacing="wider">
                My read
              </Heading>
              <ReadingArc sections={sections} />
            </VStack>
          )}

          {hasQuotes && (
            <>
              <Divider />
              <VStack align="start" spacing={4} w="100%">
                <HStack spacing={2}>
                  <Icon as={IoChatbubbleOutline} color="orange.400" />
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

          {!hasArc && !hasQuotes && (
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
                <Link
                  href={book.url}
                  color={linkOrange}
                  fontWeight="semibold"
                  isExternal
                  fontSize="sm"
                  mt={2}
                  display="block"
                >
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
