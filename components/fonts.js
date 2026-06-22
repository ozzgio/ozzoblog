import {
  Raleway,
  Space_Grotesk,
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

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-grotesk",
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
  spaceGrotesk.variable,
  bricolageGrotesque.variable,
  merriweather.variable,
].join(" ");
