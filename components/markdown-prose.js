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

const READING_FONT = "var(--font-merriweather), Georgia, serif";

// Several token colors in both bundled Prism themes fail WCAG AA against
// their own theme background -- verified per-token with a direct contrast
// calculation, then re-confirmed with axe-core, not assumed from the look
// of the color. Same hue/saturation kept for each, only lightness nudged
// enough to clear 4.5:1 with a small margin.
const accessibleOneDark = {
  ...oneDark,
  comment: { ...oneDark.comment, color: "hsl(220, 10%, 62%)" }, // was 2.86:1
  tag: { ...oneDark.tag, color: "hsl(355, 65%, 71%)" }, // was 4.38:1
  property: { ...oneDark.property, color: "hsl(355, 65%, 71%)" },
  symbol: { ...oneDark.symbol, color: "hsl(355, 65%, 71%)" },
};
const accessibleOneLight = {
  ...oneLight,
  comment: { ...oneLight.comment, color: "hsl(230, 4%, 44%)" },
  function: { ...oneLight.function, color: "hsl(221, 87%, 54%)" }, // was 3.87:1
  operator: { ...oneLight.operator, color: "hsl(221, 87%, 54%)" }, // same hue as function, same fix
  variable: { ...oneLight.variable, color: "hsl(221, 87%, 54%)" },
  "class-name": { ...oneLight["class-name"], color: "hsl(35, 99%, 32%)" }, // was 3.93:1
  "attr-name": { ...oneLight["attr-name"], color: "hsl(35, 99%, 32%)" },
  number: { ...oneLight.number, color: "hsl(35, 99%, 32%)" },
  boolean: { ...oneLight.boolean, color: "hsl(35, 99%, 32%)" },
  constant: { ...oneLight.constant, color: "hsl(35, 99%, 32%)" },
  atrule: { ...oneLight.atrule, color: "hsl(35, 99%, 32%)" },
  tag: { ...oneLight.tag, color: "hsl(5, 74%, 47%)" }, // was 3.51:1
  property: { ...oneLight.property, color: "hsl(5, 74%, 47%)" },
  symbol: { ...oneLight.symbol, color: "hsl(5, 74%, 47%)" },
};

// "article" is the full long-form reading size (article body, book notes
// fallback). "compact" is for shorter blurbs inside a card or arc entry.
// fontFamily is set explicitly on every text node here because Chakra's
// Text/UnorderedList/OrderedList components set their own font-family from
// the theme's body token, which wins over an inherited style from a parent
// wrapper -- inheriting Merriweather from an ancestor silently does nothing.
// paragraphMb/listSpacing/headingMt control vertical rhythm. "article" gets
// real breathing room between paragraphs, list items, and section breaks --
// a full-length essay packed at the same tight rhythm as a short card blurb
// reads as a wall of text. "compact" (arc entries, decision callouts) stays
// tighter since each block is already visually separated by the rail/label.
const SIZES = {
  article: {
    fontSize: "17px",
    lineHeight: "1.8",
    listFontSize: "16px",
    paragraphMb: 6,
    listSpacing: 3,
    headingMt: { h1: 8, h2: 10, h3: 8, h4: 6 },
  },
  compact: {
    fontSize: "15px",
    lineHeight: "1.75",
    listFontSize: "14px",
    paragraphMb: 4,
    listSpacing: 2,
    headingMt: { h1: 6, h2: 6, h3: 5, h4: 4 },
  },
};

export default function MarkdownProse({ children, size = "article" }) {
  const bodyColor = useColorModeValue("gray.700", "gray.300");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const quoteBorder = useColorModeValue("orange.300", "orange.600");
  const quoteBg = useColorModeValue("orange.50", "whiteAlpha.50");
  const codeBg = useColorModeValue("gray.100", "whiteAlpha.200");
  const codeBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const syntaxTheme = useColorModeValue(accessibleOneLight, accessibleOneDark);
  const { fontSize, lineHeight, listFontSize, paragraphMb, listSpacing, headingMt } = SIZES[size] || SIZES.article;

  const components = {
    h1: ({ children }) => (
      <Heading as="h1" size="lg" color={headingColor} mt={headingMt.h1} mb={4} lineHeight="1.3" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading as="h2" size="md" color={headingColor} mt={headingMt.h2} mb={4} lineHeight="1.3" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="sm" color={headingColor} mt={headingMt.h3} mb={3} lineHeight="1.4" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading as="h4" size="xs" color={headingColor} mt={headingMt.h4} mb={2} textTransform="uppercase" letterSpacing="wider" fontFamily={READING_FONT}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text color={bodyColor} fontSize={fontSize} lineHeight={lineHeight} fontFamily={READING_FONT} mb={paragraphMb}>
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
        my={paragraphMb}
        borderRadius="sm"
        fontFamily={READING_FONT}
      >
        {children}
      </Box>
    ),
    ul: ({ children }) => (
      <UnorderedList spacing={listSpacing} mb={paragraphMb} pl={2} color={bodyColor} fontSize={listFontSize} fontFamily={READING_FONT}>
        {children}
      </UnorderedList>
    ),
    ol: ({ children }) => (
      <OrderedList spacing={listSpacing} mb={paragraphMb} pl={2} color={bodyColor} fontSize={listFontSize} fontFamily={READING_FONT}>
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
      const rawChildren = child?.props?.children;
      const codeText = Array.isArray(rawChildren)
        ? rawChildren.map((part) => String(part)).join("")
        : String(rawChildren || "");

      if (className === "language-mermaid") {
        const chart = codeText.trim();
        if (!chart) {
          return (
            <Box as="pre" bg={codeBg} p={4} borderRadius="md" overflowX="auto" mb={paragraphMb}>
              {children}
            </Box>
          );
        }
        return <MermaidDiagram chart={chart} />;
      }

      if (language) {
        return (
          <Box
            mb={paragraphMb}
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
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              }}
            >
              {codeText.replace(/\n$/, "")}
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
          mb={paragraphMb}
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
