import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: { bg: "bg", color: "fg", lineHeight: "1.7" },
    "*::placeholder": { color: "fg.muted" },
    "::selection": { bg: "orange.200", color: "gray.950" },
    "@media (prefers-reduced-motion: reduce)": {
      "*, *::before, *::after": {
        animationDuration: "0.01ms !important",
        animationIterationCount: "1 !important",
        scrollBehavior: "auto !important",
        transitionDuration: "0.01ms !important",
      },
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-bricolage-grotesque), sans-serif" },
      },
      colors: { grassTeal: { value: "#ff9933" } },
      sizes: { "container.md": { value: "48rem" } },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: "#f7f5f2", _dark: "#1a1a1e" } },
          panel: { value: { _light: "#fffefd", _dark: "#222226" } },
          subtle: { value: { _light: "#eeece8", _dark: "#2b2b30" } },
        },
        fg: {
          DEFAULT: {
            value: { _light: "{colors.gray.900}", _dark: "{colors.gray.100}" },
          },
          muted: {
            value: { _light: "{colors.gray.600}", _dark: "{colors.gray.400}" },
          },
        },
        border: { value: { _light: "#dcd9d3", _dark: "#414147" } },
        accent: {
          link: {
            value: {
              _light: "{colors.orange.700}",
              _dark: "{colors.orange.300}",
            },
          },
          subtle: { value: { _light: "{colors.orange.50}", _dark: "#38291f" } },
        },
        status: {
          error: {
            value: { _light: "{colors.red.700}", _dark: "{colors.red.300}" },
          },
        },
        orange: {
          solid: {
            value: {
              _light: "{colors.orange.700}",
              _dark: "{colors.orange.300}",
            },
          },
          contrast: { value: { _light: "white", _dark: "{colors.gray.950}" } },
          fg: {
            value: {
              _light: "{colors.orange.700}",
              _dark: "{colors.orange.300}",
            },
          },
        },
      },
    },
    recipes: {
      heading: {
        base: { letterSpacing: "-0.025em", fontWeight: "700" },
        variants: {
          variant: {
            "section-title": {
              fontSize: "xl",
              mt: 4,
              mb: 5,
              textDecoration: "underline",
              textUnderlineOffset: "8px",
              textDecorationColor: "orange.400",
              textDecorationThickness: "3px",
            },
            "page-title": { fontSize: { base: "3xl", md: "4xl" }, mb: 4 },
          },
        },
      },
      link: {
        base: { color: "accent.link", textUnderlineOffset: "3px" },
      },
      button: {
        base: { borderRadius: "lg", fontWeight: "600", whiteSpace: "normal" },
      },
    },
  },
});

export default createSystem(defaultConfig, config);
