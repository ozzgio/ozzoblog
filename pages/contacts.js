import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";
import { IoLogoGithub, IoMailSharp } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import Layout from "../components/layouts/layout";
import Section from "../components/section";

const contacts = [
  {
    href: "mailto:hello@synergym.app",
    label: "Email about Synergym",
    Icon: IoMailSharp,
  },
  {
    href: "mailto:hello@onenil.org",
    label: "Email about One Nil",
    Icon: IoMailSharp,
  },
  {
    href: "https://x.com/ozzgio",
    label: "Follow @ozzgio on X",
    Icon: FaXTwitter,
  },
  {
    href: "https://github.com/ozzgio",
    label: "View my code on GitHub",
    Icon: IoLogoGithub,
  },
];

const Contacts = () => (
  <Layout
    title="Contacts"
    description="Contact Ozzo about Synergym, One Nil, or software projects. Find product email addresses, GitHub, and X."
    keywords="hire full stack developer, contact developer, freelance developer, collaborate on SaaS project"
    path="/contacts"
  >
    <Container maxW="container.md">
      <Section delay={0.1}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" variant="page-title" mb={4}>
              Get in touch
            </Heading>
            <Text fontSize="lg" color="fg.muted" maxW="2xl" mx="auto">
              Have a question about Synergym or One Nil? Send me an email.
            </Text>
          </Box>
          <VStack
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p={{ base: 4, md: 8 }}
            gap={3}
            align="stretch"
          >
            {contacts.map(({ href, label, Icon }, index) => (
              <Button
                key={href}
                variant={index === 0 ? "solid" : "outline"}
                colorPalette="orange"
                minH="52px"
                h="auto"
                py={3}
                px={3}
                size="lg"
                fontSize="md"
                asChild
              >
                <a
                  href={href}
                  target={href.startsWith("https:") ? "_blank" : undefined}
                  rel={
                    href.startsWith("https:")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              </Button>
            ))}
          </VStack>
          <Text color="fg.muted" textAlign="center">
            For code and project updates, find me on GitHub or X.
          </Text>
        </VStack>
      </Section>
    </Container>
  </Layout>
);

export default Contacts;
