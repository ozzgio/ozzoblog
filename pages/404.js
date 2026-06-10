import NextLink from "next/link";
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";

const ErrorPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Ozzo</title>
        <meta
          name="description"
          content="The page you are looking for does not exist on ozzo.blog."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Container align="center">
        <Heading as="h1">Not found</Heading>
        <Text>The page you&apos;re looking for was not found.</Text>
        <Divider my={6} />
        <Box my={6} align="center">
          <Button as={NextLink} href="/" colorScheme="orange">
            Return to home
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ErrorPage;
