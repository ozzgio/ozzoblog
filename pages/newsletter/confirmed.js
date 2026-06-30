import NextLink from "next/link";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Layout from "../../components/layouts/layout";
import Section from "../../components/section";

const NewsletterConfirmed = () => (
  <Layout
    title="You're in"
    description="Your subscription to the Ozzo newsletter is confirmed."
    robots="noindex,nofollow"
    path="/newsletter/confirmed"
  >
    <Container maxW="container.sm">
      <Section delay={0.1}>
        <Box textAlign="center" py={16}>
          <Text fontSize="4xl" mb={4}>
            🎉
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={4}
            bgGradient="linear(to-r, orange.400, orange.600)"
            _dark={{ bgGradient: "linear(to-r, orange.300, orange.500)" }}
            bgClip="text"
          >
            You&apos;re confirmed
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
            _dark={{ color: "gray.400" }}
            mb={8}
            maxW="sm"
            mx="auto"
          >
            Welcome. You&apos;ll get new articles in your inbox — no noise, just
            the stuff worth reading.
          </Text>
          <Stack direction={{ base: "column", sm: "row" }} spacing={3} justify="center">
            <Button as={NextLink} href="/articles" colorScheme="orange" size="md">
              Read the articles
            </Button>
            <Button as={NextLink} href="/" variant="ghost" size="md">
              Back to home
            </Button>
          </Stack>
        </Box>
      </Section>
    </Container>
  </Layout>
);

export default NewsletterConfirmed;
