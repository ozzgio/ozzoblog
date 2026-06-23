import { extendTheme, theme as baseTheme } from "@chakra-ui/react";
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
        color: mode("#0052cc", "#d24dff")(props),
        textUnderlineOffset: 3,
        _hover: {
          textDecoration: "underline",
        },
      }),
    },
    // Chakra's default light-mode solid "orange" is white-on-orange.500
    // (3.39:1) and ghost text is orange.600 (4.2:1) -- both fail WCAG AA.
    // Dark mode already uses its own orange.200-bg/gray.800-text combo for
    // solid (11.5:1) -- leave that alone, only light mode needs shifting.
    // Every other colorScheme keeps Chakra's own formula untouched.
    Button: {
      variants: {
        solid: (props) => {
          const base = baseTheme.components.Button.variants.solid(props);
          if (props.colorScheme !== "orange" || props.colorMode === "dark") return base;
          return {
            ...base,
            bg: "orange.700",
            _hover: { ...base._hover, bg: "orange.800" },
            _active: { ...base._active, bg: "orange.900" },
          };
        },
        ghost: (props) => {
          const base = baseTheme.components.Button.variants.ghost(props);
          if (props.colorScheme !== "orange") return base;
          return { ...base, color: mode("orange.700", "orange.200")(props) };
        },
      },
    },
  },
  fonts: {
    heading: "var(--font-m-plus-rounded-1c), sans-serif",
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
      default: "#4a5568", // Light mode text -- #718096 was 3.68-4.01:1 against card/page bg, fails AA
      _dark: "#a0aec0", // Dark mode text
    },
    tagBg: {
      default: "#fff5f0",
      _dark: "#744210",
    },
    tagText: {
      default: "#a8460a",
      _dark: "#f7fafc",
    },
  },
});

export default theme;
