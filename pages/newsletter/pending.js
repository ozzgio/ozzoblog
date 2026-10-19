import NextLink from "next/link";
import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import Layout from "../../components/layouts/layout";
import Section from "../../components/section";
import MoonZPulse from "../../components/icons/moon-z-pulse";

const NewsletterPending = () => (
  <Layout
    title="Check your email"
    description="Check your inbox to confirm your subscription to Ozzo's weekly newsletter."
    robots="noindex,nofollow"
    path="/newsletter/pending"
  >
    <Container maxW="container.sm">
      <Section delay={0.1}>
        <Box textAlign="center" py={16}>
          <MoonZPulse />
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={4}
            color="fg"
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
            Open the confirmation email and follow the link to subscribe. Check
            your spam folder if you don&apos;t see it.
          </Text>
          <Button colorPalette="orange" size="md" minH="44px" asChild>
            <NextLink href="/">Back to home</NextLink>
          </Button>
        </Box>
      </Section>
    </Container>
  </Layout>
);

export default NewsletterPending;
