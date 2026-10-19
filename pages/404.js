import NextLink from "next/link";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Separator,
} from "@chakra-ui/react";
import Layout from "../components/layouts/layout";

// Wrapped in Layout so a missing page keeps the navbar, footer and the
// site's color mode. Rendering bare meant error pages ignored the theme.
const NotFoundPage = () => (
  <Layout
    title="Not found"
    description="The page you are looking for does not exist on ozzo.blog."
    robots="noindex,nofollow"
  >
    <Container maxW="2xl" py={{ base: 10, md: 16 }} textAlign="center">
      <Heading as="h1" size="lg">
        Not found
      </Heading>
      <Text mt={4}>The page you&apos;re looking for was not found.</Text>
      <Separator my={6} />
      <Box my={6}>
        <Button colorPalette="orange" minH="44px" asChild>
          <NextLink href="/">Return to home</NextLink>
        </Button>
      </Box>
    </Container>
  </Layout>
);

export default NotFoundPage;
