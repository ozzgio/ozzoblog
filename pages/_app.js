import { ChakraProvider } from "@chakra-ui/react";
import { MotionConfig } from "framer-motion";
import Layout from "../components/layouts/main";
import theme from "../libs/theme";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

function Website({ Component, pageProps, router }) {
  return (
    <ChakraProvider theme={theme}>
      <MotionConfig reducedMotion="user">
        <Layout router={router}>
          <Component {...pageProps} />
        </Layout>
      </MotionConfig>
    </ChakraProvider>
  );
}

export default Website;
