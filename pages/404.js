import NextLink from "next/link";
import { Box, Button, Container, Divider, Heading, Text } from "@chakra-ui/react";
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
      <Divider my={6} />
      <Box my={6}>
        <Button as={NextLink} href="/" colorScheme="orange" minH="44px">
          Return to home
        </Button>
      </Box>
    </Container>
  </Layout>
);

export default NotFoundPage;
