import NextLink from "next/link";
import { Box, Button, Container, Divider, Heading, Text } from "@chakra-ui/react";
import Layout from "../components/layouts/layout";

// Next's built-in error page renders outside the Chakra tree, so a 500 came
// back unthemed: no navbar, and dark chrome on a light page. This keeps
// errors inside Layout like every other route.
const ErrorPage = ({ statusCode }) => {
  const heading = statusCode ? `Error ${statusCode}` : "Something went wrong";

  return (
    <Layout title={heading} description="This page could not be loaded." robots="noindex,nofollow">
      <Container maxW="2xl" py={{ base: 10, md: 16 }} textAlign="center">
        <Heading as="h1" size="lg">
          {heading}
        </Heading>
        <Text mt={4}>
          This page could not be loaded. Try again in a moment.
        </Text>
        <Divider my={6} />
        <Box my={6}>
          <Button as={NextLink} href="/" colorScheme="orange" minH="44px">
            Return to home
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 404,
});

export default ErrorPage;
