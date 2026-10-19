import { Box, Container } from "@chakra-ui/react";
import Navbar from "../navbar";
import Head from "next/head";
import Footer from "../footer";
import BrandIntro from "../brand-intro";

const Main = ({ children, router }) => {
  const showFooterBorder = router.asPath !== "/";

  return (
    <BrandIntro isHome={router.pathname === "/"}>
      <Box as="main" minH="100vh" display="flex" flexDirection="column">
        <Head>
          <meta name="author" content="Ozzo" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar path={router.asPath} />
        <Container
          maxW={
            ["/", "/projects"].includes(router.pathname)
              ? "64rem"
              : "container.md"
          }
          px={{ base: 4, md: 6 }}
          pt={24}
          flex="1"
        >
          {children}
        </Container>
        <Footer showBorder={showFooterBorder} />
      </Box>
    </BrandIntro>
  );
};

export default Main;
