import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { fontVariables } from "../components/fonts";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" className={fontVariables} suppressHydrationWarning>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
