import {
  Raleway,
  M_PLUS_Rounded_1c,
  Bricolage_Grotesque,
  Merriweather,
} from "next/font/google";

// Self-hosted via next/font instead of a render-blocking @import to
// fonts.googleapis.com — removes the extra network round-trip and the
// associated FOUC/CLS risk on first paint.
export const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "700"],
  variable: "--font-raleway",
  display: "swap",
});

// Chakra theme's heading font (libs/theme.js) — was never actually loaded
// anywhere, so headings silently fell back to the system sans-serif.
export const mPlusRounded1c = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-m-plus-rounded-1c",
  display: "swap",
});

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

export const fontVariables = [
  raleway.variable,
  mPlusRounded1c.variable,
  bricolageGrotesque.variable,
  merriweather.variable,
].join(" ");
