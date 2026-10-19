import {
  M_PLUS_Rounded_1c,
  Bricolage_Grotesque,
  Merriweather,
  Playfair_Display,
} from "next/font/google";

// Self-hosted via next/font instead of a render-blocking @import to
// fonts.googleapis.com — removes the extra network round-trip and the
// associated FOUC/CLS risk on first paint.
// Rounded lettering is reserved for the orbital brand mark.
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
  preload: false,
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  preload: false,
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const fontVariables = [
  mPlusRounded1c.variable,
  bricolageGrotesque.variable,
  merriweather.variable,
  playfairDisplay.variable,
].join(" ");
