import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  IoCloseCircleOutline,
  IoFlashOutline,
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

  if (dateA && dateB)
    return direction === "desc" ? dateB - dateA : dateA - dateB;
  if (dateA) return direction === "desc" ? -1 : 1;
  if (dateB) return direction === "desc" ? 1 : -1;
  return 0;
};

const BooksPage = ({ books, error }) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState("highest_rating");
  const [searchQuery, setSearchQuery] = useState("");

  const heroBorder = "border";
  const mutedText = "fg.muted";
  const panelBorder = "border";
  const accentSubtle = "accent.subtle";

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
        if ((b.rating ?? 0) !== (a.rating ?? 0))
          return (b.rating ?? 0) - (a.rating ?? 0);
        return sortByDate(a, b, "desc") || a.title.localeCompare(b.title);
      });
    } else if (sortOption === "lowest_rating") {
      currentBooks.sort((a, b) => {
        if ((a.rating ?? 0) !== (b.rating ?? 0))
          return (a.rating ?? 0) - (b.rating ?? 0);
        return sortByDate(a, b, "desc") || a.title.localeCompare(b.title);
      });
    } else if (sortOption === "newest") {
      currentBooks.sort((a, b) => {
        const byDate = sortByDate(a, b, "desc");
        if (byDate !== 0) return byDate;
        if ((b.rating ?? 0) !== (a.rating ?? 0))
          return (b.rating ?? 0) - (a.rating ?? 0);
        return a.title.localeCompare(b.title);
      });
    } else if (sortOption === "oldest") {
      currentBooks.sort((a, b) => {
        const byDate = sortByDate(a, b, "asc");
        if (byDate !== 0) return byDate;
        if ((b.rating ?? 0) !== (a.rating ?? 0))
          return (b.rating ?? 0) - (a.rating ?? 0);
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
        ? [
            book.title,
            book.author,
            book.lesson,
            book.notes,
            ...(book.tags || []),
          ]
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

    return [...datedBooks].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    )[0];
  }, [normalizedBooks]);

  const hasActiveFilters = Boolean(selectedTag || searchQuery.trim());
  const resetFilters = () => {
    setSelectedTag(null);
    setSearchQuery("");
  };

  const featuredBook = filteredBooks[0] || null;
  const bookGrid = featuredBook ? filteredBooks.slice(1) : [];

  return (
    <Layout
      title="Books and reading notes"
      description="Books Ozzo has read, with ratings and notes on software, work, and life."
      keywords="developer reading list, software engineering books, indie builder books, startup books, personal knowledge base"
      path="/books"
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
              Reading notes
            </Text>
            <Heading
              as="h1"
              id="books-heading"
              fontSize={{ base: "3xl", md: "4xl" }}
              lineHeight="1.05"
              mb={3}
            >
              The bookshelf
            </Heading>
            <Text fontSize="md" color="fg.muted" maxW="38rem">
              Books I&apos;ve read, what I took from them, and the ideas I want
              to put into practice.
            </Text>
            <HStack
              gap={5}
              flexWrap="wrap"
              fontSize="sm"
              color="fg.muted"
              mt={3}
            >
              <Text>{sortedBooks.length} books</Text>
              <Text>{allTags.length} topics</Text>
              <Text>{noteBackedBooks} with notes</Text>
            </HStack>
            {latestFinishedBook?.absoluteDate && (
              <Text fontSize="sm" color="fg.muted" mt={2}>
                Last read: {latestFinishedBook.absoluteDate}
              </Text>
            )}
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
                      aria-label="Search books"
                      placeholder="Search titles, authors, notes, or tags"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      minH="44px"
                    />
                  </InputGroup>
                  <NativeSelect.Root maxW={{ base: "100%", md: "220px" }}>
                    <NativeSelect.Field
                      aria-label="Sort books"
                      value={sortOption}
                      onChange={(event) => setSortOption(event.target.value)}
                      maxW={{ base: "100%", xl: "220px" }}
                      minH="44px"
                    >
                      <option value="highest_rating">Highest Rating</option>
                      <option value="lowest_rating">Lowest Rating</option>
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
                      All ({sortedBooks.length})
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
                      <IoStarOutline />
                    </Icon>
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
                  borderRadius="xl"
                  p={8}
                  textAlign="center"
                  bg={accentSubtle}
                >
                  <Icon boxSize={8} color="orange.400" mb={3} asChild>
                    <IoFlashOutline />
                  </Icon>
                  <Heading as="h2" size="md" mb={2}>
                    No books found
                  </Heading>
                  <Text color={mutedText}>
                    Try a different search term or clear the active tag filter.
                  </Text>
                </Box>
              ) : (
                <VStack gap={5} align="stretch">
                  {featuredBook && (
                    <Box>
                      <BookCard {...featuredBook} featured />
                    </Box>
                  )}

                  {bookGrid.length > 0 && (
                    <Box>
                      <Flex
                        justify="space-between"
                        mb={3}
                        gap={3}
                        wrap="wrap"
                        align="center"
                      >
                        <Heading as="h2" size="md">
                          More books
                        </Heading>
                        <Text fontSize="sm" color={mutedText}>
                          {bookGrid.length} remaining books
                        </Text>
                      </Flex>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
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
