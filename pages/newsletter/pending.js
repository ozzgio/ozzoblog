import NextLink from "next/link";
import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import Layout from "../../components/layouts/layout";
import Section from "../../components/section";

const NewsletterPending = () => (
  <Layout
    title="Check your email"
    description="One more step — confirm your subscription to the Ozzo newsletter."
    robots="noindex,nofollow"
    path="/newsletter/pending"
  >
    <Container maxW="container.sm">
      <Section delay={0.1}>
        <Box textAlign="center" py={16}>
          <Text fontSize="4xl" mb={4}>
            ✉️
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={4}
            bgGradient="linear(to-r, orange.400, orange.600)"
            _dark={{ bgGradient: "linear(to-r, orange.300, orange.500)" }}
            bgClip="text"
          >
            Check your inbox
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
            _dark={{ color: "gray.400" }}
            mb={8}
            maxW="sm"
            mx="auto"
          >
            We sent you a confirmation link. Click it to activate your
            subscription and start receiving articles.
          </Text>
          <Button as={NextLink} href="/" colorScheme="orange" size="md">
            Back to home
          </Button>
        </Box>
      </Section>
    </Container>
  </Layout>
);

export default NewsletterPending;
