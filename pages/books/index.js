import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IoBookOutline,
  IoCloseCircleOutline,
  IoDocumentTextOutline,
  IoFlashOutline,
  IoPricetagOutline,
  IoSearchOutline,
  IoStarOutline,
} from "react-icons/io5";
import Layout from "../../components/layouts/layout";
import BookCard from "../../components/cards/bookcard";
import {
  fetchBooks,
  getBookSlug,
  getBookNotes,
  getBookSummary,
  hasBookNotes,
  resolvePortfolioAssetUrl,
} from "../../libs/contentUtils";

const MotionBox = motion.create(Box);

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

const sortByDate = (a, b, direction = "desc") => {
  const dateA = a.date ? new Date(a.date).getTime() : null;
  const dateB = b.date ? new Date(b.date).getTime() : null;

  if (dateA && dateB) return direction === "desc" ? dateB - dateA : dateA - dateB;
  if (dateA) return direction === "desc" ? -1 : 1;
  if (dateB) return direction === "desc" ? 1 : -1;
  return 0;
};

const BooksPage = ({ books, error }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState("highest_rating");
  const [searchQuery, setSearchQuery] = useState("");

  const heroBg = useColorModeValue(
    "linear(to-br, orange.50, white 40%, orange.100)",
    "linear(to-br, gray.900, orange.900, gray.900)",
  );
  const heroBorder = useColorModeValue("orange.200", "orange.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const panelBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.100");
  const panelBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const accentSubtle = useColorModeValue("orange.50", "orange.900");

  const normalizedBooks = useMemo(
    () =>
      (Array.isArray(books) ? books : []).map((book) => {
        const notes = getBookNotes(book);
        const slug = getBookSlug(book);
        const date = book.date || "";
        const hasNotes = hasBookNotes(book);

        return {
          ...book,
          date,
          slug,
          notes,
          hasNotes,
          source: slug ? "internal" : "external",
          ctaLabel: hasNotes ? "Read notes" : "View book",
          summary: book.summary || getBookSummary(book),
          absoluteDate: date ? formatAbsoluteDate(date) : "",
          year: date ? String(new Date(date).getFullYear()) : "",
        };
      }),
    [books],
  );

  const allTags = useMemo(() => {
    const tagCounts = new Map();

    normalizedBooks.forEach((book) => {
      (book.tags || []).forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return [...tagCounts.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .map(([tag, count]) => ({ tag, count }));
  }, [normalizedBooks]);

  const sortedBooks = useMemo(() => {
    const currentBooks = [...normalizedBooks];

    if (sortOption === "highest_rating") {
      currentBooks.sort((a, b) => {
        if ((b.rating ?? 0) !== (a.rating ?? 0)) return (b.rating ?? 0) - (a.rating ?? 0);
        return sortByDate(a, b, "desc") || a.title.localeCompare(b.title);
      });
    } else if (sortOption === "lowest_rating") {
      currentBooks.sort((a, b) => {
        if ((a.rating ?? 0) !== (b.rating ?? 0)) return (a.rating ?? 0) - (b.rating ?? 0);
        return sortByDate(a, b, "desc") || a.title.localeCompare(b.title);
      });
    } else if (sortOption === "newest") {
      currentBooks.sort((a, b) => {
        const byDate = sortByDate(a, b, "desc");
        if (byDate !== 0) return byDate;
        if ((b.rating ?? 0) !== (a.rating ?? 0)) return (b.rating ?? 0) - (a.rating ?? 0);
        return a.title.localeCompare(b.title);
      });
    } else if (sortOption === "oldest") {
      currentBooks.sort((a, b) => {
        const byDate = sortByDate(a, b, "asc");
        if (byDate !== 0) return byDate;
        if ((b.rating ?? 0) !== (a.rating ?? 0)) return (b.rating ?? 0) - (a.rating ?? 0);
        return a.title.localeCompare(b.title);
      });
    } else if (sortOption === "alphabetical") {
      currentBooks.sort((a, b) => a.title.localeCompare(b.title));
    }

    return currentBooks.map((book) => ({
      ...book,
      tags: Array.isArray(book.tags) ? [...book.tags].sort() : [],
    }));
  }, [normalizedBooks, sortOption]);

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedBooks.filter((book) => {
      const matchesTag = selectedTag ? book.tags?.includes(selectedTag) : true;
      const matchesQuery = query
        ? [book.title, book.author, book.lesson, book.notes, ...(book.tags || [])]
            .join(" ")
            .toLowerCase()
            .includes(query)
        : true;

      return matchesTag && matchesQuery;
    });
  }, [searchQuery, selectedTag, sortedBooks]);

  const noteBackedBooks = useMemo(
    () => normalizedBooks.filter((book) => book.hasNotes).length,
    [normalizedBooks],
  );

  const latestFinishedBook = useMemo(() => {
    const datedBooks = normalizedBooks.filter((book) => book.date);
    if (datedBooks.length === 0) return null;

    return [...datedBooks].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [normalizedBooks]);

  const hasActiveFilters = Boolean(selectedTag || searchQuery.trim());
  const resetFilters = () => {
    setSelectedTag(null);
    setSearchQuery("");
  };

  const featuredBook = filteredBooks[0] || null;
  const bookGrid = featuredBook ? filteredBooks.slice(1) : [];

  const heroMetaItems = [];
  if (latestFinishedBook?.absoluteDate) {
    heroMetaItems.push(`Latest: ${latestFinishedBook.absoluteDate}`);
  }
  if (noteBackedBooks > 0) {
    heroMetaItems.push(`Note-backed entries: ${noteBackedBooks}`);
  }

  return (
    <Layout
      title="Books and Reading Notes for Builders"
      description="A curated library of books read by Ozzo, with short notes and lessons on software, product building, and personal growth."
      keywords="developer reading list, software engineering books, indie builder books, startup books, personal knowledge base"
      path="/books"
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
                  Reading library
                </Badge>
                <Box>
                  <Heading as="h1" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.2" mb={2}>
                    Books I&apos;ve read
                  </Heading>
                  <Text fontSize="sm" color={mutedText}>
                    Notes on what stuck, what changed, and the occasional full breakdown.
                  </Text>
                </Box>
                {heroMetaItems.length > 0 && (
                  <HStack spacing={3} flexWrap="wrap">
                    {heroMetaItems.map((item, index) => (
                      <Box key={item} display="contents">
                        {index > 0 && <Text color={mutedText}>/</Text>}
                        <Text fontSize="sm" color={mutedText}>
                          {item}
                        </Text>
                      </Box>
                    ))}
                  </HStack>
                )}
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
                    <Icon as={IoBookOutline} color="orange.400" />
                    <Text fontSize="sm" color={mutedText}>
                      Books
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {sortedBooks.length}
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
                    <Icon as={IoDocumentTextOutline} color="orange.400" />
                    <Text fontSize="sm" color={mutedText}>
                      Notes
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {noteBackedBooks}
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
                      placeholder="Search titles, authors, notes, or tags"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                  </InputGroup>
                  <Select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    maxW={{ base: "100%", xl: "220px" }}
                  >
                    <option value="highest_rating">Highest Rating</option>
                    <option value="lowest_rating">Lowest Rating</option>
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
                      All ({sortedBooks.length})
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
                    <Icon as={IoStarOutline} />
                    <Text>{filteredBooks.length} selected</Text>
                  </HStack>
                  <Text>•</Text>
                  <Text>
                    {sortOption === "highest_rating"
                      ? "Sorted by rating"
                      : sortOption === "lowest_rating"
                        ? "Lowest rating first"
                        : sortOption === "newest"
                          ? "Sorted by newest"
                          : sortOption === "oldest"
                            ? "Sorted by oldest"
                            : "Sorted alphabetically"}
                  </Text>
                </HStack>
              </Box>

              {filteredBooks.length === 0 ? (
                <Box
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor={heroBorder}
                  borderRadius="3xl"
                  p={8}
                  textAlign="center"
                  bg={accentSubtle}
                >
                  <Icon as={IoFlashOutline} boxSize={8} color="orange.400" mb={3} />
                  <Heading as="h2" size="md" mb={2}>
                    No books found
                  </Heading>
                  <Text color={mutedText}>
                    Try a different search term or clear the active tag filter.
                  </Text>
                </Box>
              ) : (
                <VStack spacing={8} align="stretch">
                  {featuredBook && (
                    <Box>
                      <HStack spacing={3} mb={4} align="center" flexWrap="wrap">
                        <Badge colorScheme="orange" px={3} py={1} borderRadius="full">
                          Featured result
                        </Badge>
                        <Text fontSize="sm" color={mutedText}>
                          Top result from your current selection
                        </Text>
                      </HStack>
                      <BookCard {...featuredBook} featured />
                    </Box>
                  )}

                  {bookGrid.length > 0 && (
                    <Box>
                      <Flex justify="space-between" mb={4} gap={3} wrap="wrap" align="center">
                        <Heading as="h2" size="md">
                          Explore more
                        </Heading>
                        <Text fontSize="sm" color={mutedText}>
                          {bookGrid.length} remaining books
                        </Text>
                      </Flex>
                      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                        {bookGrid.map((book) => (
                          <BookCard
                            key={book.slug || `${book.title}-${book.author}`}
                            {...book}
                          />
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}
                </VStack>
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
    const { ok, books: booksData } = await fetchBooks();

    if (!ok) {
      throw new Error("Failed to fetch books from portfolio-data");
    }

    const books = booksData
      .filter((book) => book && book.title && book.status !== "reading")
      .map((book) => {
        const slug = getBookSlug(book);
        const hasNotes = hasBookNotes(book);

        return {
          title: String(book.title || ""),
          author: String(book.author || ""),
          rating: typeof book.rating === "number" ? book.rating : null,
          tags: Array.isArray(book.tags) ? book.tags.filter(Boolean) : [],
          cover: resolvePortfolioAssetUrl(book.cover),
          lesson: String(book.lesson || "").trim(),
          summary: getBookSummary(book),
          notes: getBookNotes(book),
          date: String(book.date || ""),
          slug,
          hasNotes,
          source: slug ? "internal" : "external",
          ctaLabel: hasNotes ? "Read notes" : "View book",
          url: String(book.url || ""),
          status: String(book.status || "read"),
        };
      });

    return { props: { books }, revalidate: 60 };
  } catch (error) {
    console.error("Failed to fetch books in getStaticProps:", error);
    return {
      props: {
        books: [],
        error: "Failed to load books. Please try again later.",
      },
    };
  }
};

export default BooksPage;
