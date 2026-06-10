import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#f7f5f2", "#1a1a1e")(props),
        color: mode("gray.800", "gray.100")(props),
      },
      "*::placeholder": {
        color: mode("gray.400", "gray.600")(props),
      },
      "*, *::before, &::after": {
        borderColor: mode("gray.200", "gray.700")(props),
      },
    }),
  },
  components: {
    Heading: {
      variants: {
        "section-title": {
          textDecoration: "underline",
          fontSize: 22,
          textUnderlineOffset: 8,
          textDecorationColor: "#ff9933",
          textDecorationThickness: 4,
          marginTop: 4,
          marginBottom: 5,
          fontWeight: "bold",
        },
        "page-title": {
          fontSize: { base: "2xl", md: "3xl", lg: "4xl" },
          fontWeight: "bold",
          mb: 4,
        },
      },
    },
    Link: {
      baseStyle: (props) => ({
        color: mode("#0066ff", "#d24dff")(props),
        textUnderlineOffset: 3,
        _hover: {
          textDecoration: "underline",
        },
      }),
    },
  },
  fonts: {
    heading: "'M PLUS Rounded 1c'",
  },
  colors: {
    grassTeal: "#ff9933",
    // Add our semantic colors here
    cardBg: {
      default: "#ffffff", // Light mode default (fallback)
      _dark: "#1a202c", // Dark mode
    },
    cardBorder: {
      default: "#e2e8f0", // Light mode border
      _dark: "#4a5568", // Dark mode border
    },
    headingText: {
      default: "#2d3748", // Light mode heading
      _dark: "#ffffff", // Dark mode heading
    },
    bodyText: {
      default: "#718096", // Light mode text
      _dark: "#a0aec0", // Dark mode text
    },
    tagBg: {
      default: "#fff5f0",
      _dark: "#744210",
    },
    tagText: {
      default: "#dd6b20",
      _dark: "#f7fafc",
    },
  },
});

export default theme;
