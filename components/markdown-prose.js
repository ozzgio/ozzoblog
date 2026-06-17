import dynamic from "next/dynamic";
import NextLink from "next/link";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
  Code,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

const MermaidDiagram = dynamic(() => import("./mermaid-diagram"), { ssr: false });

const READING_FONT = "'Merriweather', Georgia, serif";

// "article" is the full long-form reading size (article body, book notes
// fallback). "compact" is for shorter blurbs inside a card or arc entry.
// fontFamily is set explicitly on every text node here because Chakra's
// Text/UnorderedList/OrderedList components set their own font-family from
// the theme's body token, which wins over an inherited style from a parent
// wrapper -- inheriting Merriweather from an ancestor silently does nothing.
const SIZES = {
  article: { fontSize: "17px", lineHeight: "1.8", listFontSize: "16px" },
  compact: { fontSize: "15px", lineHeight: "1.75", listFontSize: "14px" },
};

export default function MarkdownProse({ children, size = "article" }) {
  const bodyColor = useColorModeValue("gray.700", "gray.300");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const quoteBorder = useColorModeValue("orange.300", "orange.600");
  const quoteBg = useColorModeValue("orange.50", "whiteAlpha.50");
  const codeBg = useColorModeValue("gray.100", "whiteAlpha.200");
  const codeBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const syntaxTheme = useColorModeValue(oneLight, oneDark);
  const { fontSize, lineHeight, listFontSize } = SIZES[size] || SIZES.article;

  const components = {
    h1: ({ children }) => (
      <Heading as="h1" size="lg" color={headingColor} mt={6} mb={3} lineHeight="1.3" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading as="h2" size="md" color={headingColor} mt={6} mb={3} lineHeight="1.3" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="sm" color={headingColor} mt={5} mb={2} lineHeight="1.4" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading as="h4" size="xs" color={headingColor} mt={4} mb={2} textTransform="uppercase" letterSpacing="wider" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text color={bodyColor} fontSize={fontSize} lineHeight={lineHeight} fontFamily={READING_FONT} mb={4}>
        {children}
      </Text>
    ),
    strong: ({ children }) => (
      <Box as="strong" fontWeight="semibold" color={headingColor}>
        {children}
      </Box>
    ),
    em: ({ children }) => (
      <Box as="em" fontStyle="italic">
        {children}
      </Box>
    ),
    a: ({ href, children }) => {
      const isExternal = /^https?:\/\//.test(href || "");
      const linkProps = {
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        fontWeight: "medium",
        wordBreak: "break-word",
      };
      if (isExternal) {
        return <Link href={href} isExternal {...linkProps}>{children}</Link>;
      }
      return (
        <Link as={NextLink} href={href} {...linkProps}>
          {children}
        </Link>
      );
    },
    blockquote: ({ children }) => (
      <Box
        borderLeftWidth="3px"
        borderLeftColor={quoteBorder}
        bg={quoteBg}
        pl={4}
        py={2}
        my={4}
        borderRadius="sm"
        fontFamily={READING_FONT}
      >
        {children}
      </Box>
    ),
    ul: ({ children }) => (
      <UnorderedList spacing={1} mb={4} pl={2} color={bodyColor} fontSize={listFontSize} fontFamily={READING_FONT}>
        {children}
      </UnorderedList>
    ),
    ol: ({ children }) => (
      <OrderedList spacing={1} mb={4} pl={2} color={bodyColor} fontSize={listFontSize} fontFamily={READING_FONT}>
        {children}
      </OrderedList>
    ),
    li: ({ children }) => (
      <ListItem lineHeight={lineHeight}>{children}</ListItem>
    ),
    hr: () => <Divider my={6} />,
    pre: ({ children }) => {
      const child = Array.isArray(children) ? children[0] : children;
      const className = child?.props?.className || "";
      const match = className.match(/language-([\w-]+)/);
      const language = match?.[1];

      if (className === "language-mermaid") {
        return <MermaidDiagram chart={String(child.props.children).trim()} />;
      }

      if (language) {
        return (
          <Box
            mb={4}
            borderWidth="1px"
            borderColor={codeBorder}
            borderRadius="md"
            overflow="hidden"
          >
            <SyntaxHighlighter
              language={language}
              style={syntaxTheme}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.78rem",
                lineHeight: 1.7,
                background: "transparent",
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              }}
            >
              {String(child.props.children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </Box>
        );
      }

      return (
        <Box
          as="pre"
          bg={codeBg}
          p={4}
          borderRadius="md"
          overflowX="auto"
          mb={4}
          fontSize="xs"
          lineHeight="1.6"
        >
          {children}
        </Box>
      );
    },
    code: ({ children }) => (
      <Code bg={codeBg} px={1} borderRadius="sm" fontSize="xs">
        {children}
      </Code>
    ),
  };

  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
