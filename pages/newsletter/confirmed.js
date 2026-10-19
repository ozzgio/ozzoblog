import NextLink from "next/link";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Layout from "../../components/layouts/layout";
import Section from "../../components/section";
import MoonZPulse from "../../components/icons/moon-z-pulse";

const NewsletterConfirmed = () => (
  <Layout
    title="You're in"
    description="You're subscribed to Ozzo's weekly newsletter on software, books, and his own projects."
    robots="noindex,nofollow"
    path="/newsletter/confirmed"
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
            Thanks for reading. You&apos;ll get a weekly note on what I&apos;m
            building, reading, and learning.
          </Text>
          <Stack
            direction={{ base: "column", sm: "row" }}
            gap={3}
            justify="center"
          >
            <Button colorPalette="orange" size="md" minH="44px" asChild>
              <NextLink href="/articles">Read the articles</NextLink>
            </Button>
            <Button variant="ghost" size="md" minH="44px" asChild>
              <NextLink href="/">Back to home</NextLink>
            </Button>
          </Stack>
        </Box>
      </Section>
    </Container>
  </Layout>
);

export default NewsletterConfirmed;
