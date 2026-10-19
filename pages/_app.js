import { ChakraProvider } from "@chakra-ui/react";
import { MotionConfig } from "framer-motion";
import Layout from "../components/layouts/main";
import system from "../libs/theme";
// Include the shared font CSS on direct visits to every page.
import { fontVariables } from "../components/fonts";
import { ColorModeProvider } from "../components/ui/color-mode";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

function Website({ Component, pageProps, router }) {
  const getLayout =
    Component.getLayout || ((page) => <Layout router={router}>{page}</Layout>);

  return (
    <div className={fontVariables}>
      <ChakraProvider value={system}>
        <ColorModeProvider>
          <MotionConfig reducedMotion="user">
            {getLayout(<Component {...pageProps} />)}
          </MotionConfig>
        </ColorModeProvider>
      </ChakraProvider>
    </div>
  );
}

export default Website;
