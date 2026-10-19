import { useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Heading,
  HStack,
  Link,
  Portal,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import NextLink from "next/link";
import { LuBookOpen, LuShuffle, LuX } from "react-icons/lu";
import { pickShelfBook } from "../libs/randomBook.mjs";

const MotionBox = motion.create(Box);

export default function Bookshelf({ currentBook = null, books = [] }) {
  const reduceMotion = useReducedMotion();
  const trigger = useRef(null);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("shelf");

  const takeBook = () => {
    const next = pickShelfBook(books, selected?.slug);
    if (!next) return;
    setSelected(next);
    setPhase(reduceMotion || phase === "open" ? "open" : "taking");
  };

  return (
    <Box
      as="section"
      aria-labelledby="bookshelf-heading"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      p={5}
    >
      <HStack gap={2}>
        <LuBookOpen aria-hidden="true" />
        <Heading as="h2" id="bookshelf-heading" fontSize="sm">
          On the bookshelf
        </Heading>
      </HStack>
      {books.length > 0 && (
        <>
          <HStack
            aria-hidden="true"
            align="end"
            gap="3px"
            h="148px"
            pt={6}
            pb={1}
            mb={3}
            borderBottomWidth="3px"
            borderColor="border"
          >
            {books.map((book, index) => {
              const pulling =
                phase === "taking" && selected?.slug === book.slug;
              return (
                <MotionBox
                  key={book.slug}
                  data-shelf-spine={book.slug}
                  flex={1}
                  minW={0}
                  h={`${88 + (index % 4) * 9}px`}
                  bg={index % 3 === 0 ? "accent.subtle" : "bg.subtle"}
                  color={index % 3 === 0 ? "accent.link" : "fg.muted"}
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="3px 5px 1px 1px"
                  overflow="hidden"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  animate={{ y: pulling ? -24 : 0, rotate: pulling ? -8 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                  onAnimationComplete={() => {
                    if (pulling) setPhase("open");
                  }}
                >
                  <Text
                    fontSize="10px"
                    fontWeight="semibold"
                    lineHeight={1}
                    maxH="85%"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    css={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {book.title}
                  </Text>
                </MotionBox>
              );
            })}
          </HStack>
          <Button
            ref={trigger}
            variant="outline"
            colorPalette="orange"
            width="100%"
            minH="44px"
            mb={4}
            onClick={takeBook}
            disabled={phase === "taking"}
            aria-haspopup="dialog"
          >
            <LuShuffle aria-hidden="true" />
            Take a book
          </Button>
        </>
      )}
      <Text fontSize="xs" color="fg.muted" mt={books.length ? 0 : 3} mb={1}>
        {currentBook ? "Currently reading" : "My reading list"}
      </Text>
      {currentBook ? (
        <>
          <Text fontSize="sm" fontWeight="semibold" lineHeight="1.4">
            {currentBook.title}
          </Text>
          <Text fontSize="xs" color="fg.muted" mt={1}>
            {currentBook.author}
          </Text>
        </>
      ) : (
        <Text fontSize="sm" color="fg.muted">
          Books I’ve read, with notes on what I learned.
        </Text>
      )}
      <Link asChild minH="44px" mt={2} fontSize="sm">
        <NextLink href="/books">All reading notes →</NextLink>
      </Link>

      <Dialog.Root
        open={phase === "open"}
        onOpenChange={({ open }) => {
          if (!open) setPhase("shelf");
        }}
        finalFocusEl={() => trigger.current}
        placement="center"
        lazyMount
        unmountOnExit
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner p={4}>
            <Dialog.Content
              maxW="42rem"
              width="100%"
              bg="bg.panel"
              borderRadius="xl"
            >
              <Dialog.Header
                px={{ base: 4, sm: 6 }}
                py={3}
                alignItems="center"
                gap={3}
              >
                <Box flex={1}>
                  <Dialog.Title fontSize="sm">
                    A page from the shelf
                  </Dialog.Title>
                  <Dialog.Description fontSize="xs" color="fg.muted">
                    From my reading notes
                  </Dialog.Description>
                </Box>
                <Dialog.CloseTrigger asChild>
                  <Button
                    variant="ghost"
                    minW="44px"
                    minH="44px"
                    aria-label="Close book"
                  >
                    <LuX />
                  </Button>
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Box
                mx={{ base: 3, sm: 5 }}
                style={{ perspective: "1400px" }}
                aria-live="polite"
                aria-atomic="true"
              >
                <AnimatePresence mode="wait">
                  {selected && (
                    <MotionBox
                      key={selected.slug}
                      data-open-book={selected.slug}
                      position="relative"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.18 }}
                    >
                      <Box
                        display="grid"
                        gridTemplateColumns={{
                          base: "16px minmax(0, 1fr)",
                          sm: "minmax(0, 0.85fr) minmax(0, 1.15fr)",
                        }}
                        minH="300px"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <Box
                          bg="accent.subtle"
                          borderRightWidth="1px"
                          borderColor="border"
                          p={{ base: 0, sm: 6 }}
                          aria-hidden="true"
                        >
                          <Box
                            display={{ base: "none", sm: "flex" }}
                            flexDirection="column"
                            justifyContent="center"
                            h="100%"
                          >
                            <LuBookOpen size={24} />
                            <Text
                              mt={6}
                              fontFamily="heading"
                              fontSize="2xl"
                              fontWeight="bold"
                              lineHeight="1.15"
                            >
                              {selected.title}
                            </Text>
                            <Text mt={3} fontSize="sm" color="fg.muted">
                              {selected.author}
                            </Text>
                          </Box>
                        </Box>
                        <Box
                          bg="bg.panel"
                          p={{ base: 5, sm: 7 }}
                          minW={0}
                          boxShadow="inset 10px 0 14px -14px var(--chakra-colors-border)"
                        >
                          <Text fontSize="xs" color="fg.muted" mb={2}>
                            {selected.author}
                          </Text>
                          <Heading
                            as="h3"
                            fontSize="lg"
                            lineHeight="1.3"
                            mb={5}
                          >
                            {selected.title}
                          </Heading>
                          <Text
                            fontFamily="var(--font-merriweather), Georgia, serif"
                            fontSize="sm"
                            lineHeight="1.9"
                          >
                            {selected.excerpt}
                          </Text>
                          <Link
                            asChild
                            minH="44px"
                            mt={5}
                            fontSize="sm"
                            color="accent.link"
                          >
                            <NextLink
                              href={`/books/${encodeURIComponent(selected.slug)}`}
                              onClick={() => setPhase("shelf")}
                            >
                              Read my notes →
                            </NextLink>
                          </Link>
                        </Box>
                      </Box>
                      {!reduceMotion && (
                        <MotionBox
                          aria-hidden="true"
                          data-book-cover=""
                          position="absolute"
                          inset={0}
                          bg="accent.subtle"
                          borderWidth="1px"
                          borderColor="border"
                          borderRadius="md"
                          p={7}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          pointerEvents="none"
                          style={{
                            transformOrigin: "left center",
                            backfaceVisibility: "hidden",
                          }}
                          initial={{ rotateY: 0, opacity: 1 }}
                          animate={{ rotateY: -160, opacity: [1, 1, 0] }}
                          transition={{ duration: 0.48, ease: "easeInOut" }}
                        >
                          <LuBookOpen size={28} />
                          <Text
                            fontFamily="heading"
                            fontSize="2xl"
                            fontWeight="bold"
                            lineHeight="1.2"
                            mt={4}
                          >
                            {selected.title}
                          </Text>
                          <Text fontSize="sm" color="fg.muted" mt={2}>
                            {selected.author}
                          </Text>
                        </MotionBox>
                      )}
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>
              <Dialog.Footer px={{ base: 4, sm: 6 }} py={4}>
                {books.length > 1 && (
                  <Button
                    variant="outline"
                    colorPalette="orange"
                    minH="44px"
                    onClick={takeBook}
                  >
                    <LuShuffle aria-hidden="true" />
                    Take another
                  </Button>
                )}
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
