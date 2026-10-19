import projectData from "../libs/projectData";
import { projectReferralUrl } from "../libs/projectReferral.mjs";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import Section from "../components/section";
import Paragraph from "../components/paragraph";
import { BioSection } from "../components/bio";
import Layout from "../components/layouts/layout";
import BaseCard from "../components/basecard";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import { LuChevronRight, LuExternalLink } from "react-icons/lu";

const SectionLabel = ({ children, mt = 10 }) => (
  <Text
    fontSize="xs"
    fontWeight="bold"
    textTransform="uppercase"
    letterSpacing="0.12em"
    color="gray.600"
    _dark={{ color: "gray.400" }}
    mb={6}
    mt={mt}
  >
    {children}
  </Text>
);

const Home = ({
  latestArticles = [],
  articlesError = false,
  currentBook = null,
}) => {
  const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://ozzo.blog/#person",
        name: "Ozzo",
        url: "https://ozzo.blog",
        sameAs: ["https://github.com/ozzgio", "https://x.com/ozzgio"],
        jobTitle: "Full-stack Developer",
        description:
          "Full-stack developer building his own projects and writing about what he learns.",
      },
      {
        "@type": "WebSite",
        "@id": "https://ozzo.blog/#website",
        url: "https://ozzo.blog",
        name: "Ozzo.blog",
        description:
          "Notes on building software, reading books, and learning to work independently.",
        publisher: { "@id": "https://ozzo.blog/#person" },
      },
    ],
  };

  return (
    <Layout
      title="About"
      metaTitle="About Ozzo | Developer and writer"
      description="Meet Ozzo, a full-stack developer who builds his own projects, reads, and writes about what he learns."
      keywords="independent developer, product validation, software distribution, build in public, Ruby on Rails, solo developer"
      path="/about"
      jsonLd={homepageSchema}
    >
      <Container>
        {/* Statement - large type, no box */}
        <Box mb={12} mt={4}>
          <Heading
            as="p"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="800"
            lineHeight="1.15"
            letterSpacing="-0.01em"
            color="#1c1917"
            _dark={{ color: "white" }}
            style={{
              fontFamily: "var(--font-bricolage-grotesque), sans-serif",
            }}
          >
            Learning to make a living
            <br />
            from the software I build.
          </Heading>
        </Box>

        {/* Profile - no card chrome */}
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
          gap={5}
          mb={14}
          pb={10}
          borderBottomWidth="1px"
          borderBottomColor="gray.100"
          _dark={{ borderBottomColor: "whiteAlpha.100" }}
        >
          <Box
            flexShrink={0}
            position="relative"
            borderRadius="full"
            overflow="hidden"
            boxSize={{ base: "64px", md: "72px" }}
          >
            <Image
              src="/images/propic.jpg"
              alt="Ozzo"
              fill
              sizes="72px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </Box>
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              color="fg"
              mb={1}
            >
              Ozzo
            </Heading>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              Full-stack developer, reader, and writer.
            </Text>
          </Box>
        </Box>

        <NewsletterSubscribe borderTopWidth="0" mt={0} pt={0} mb={14} />

        <Section delay={0.1}>
          <SectionLabel mt={0}>What I&apos;m building</SectionLabel>
          <VStack gap={8} align="stretch">
            {projectData
              .filter((project) => project.featured)
              .map((project) => (
                <Box
                  key={project.id}
                  borderLeftWidth="2px"
                  borderColor="orange.400"
                  pl={5}
                >
                  <Heading as="h2" fontSize="lg" mb={2}>
                    {project.title}
                  </Heading>
                  <Text fontSize="sm" color="fg.muted" mb={3} lineHeight="1.8">
                    {project.description}
                  </Text>
                  <Flex gap={4} wrap="wrap">
                    <Link
                      href={projectReferralUrl(
                        project.demo,
                        project.id,
                        "home",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      minH="44px"
                      fontSize="sm"
                    >
                      Visit {project.title} ↗
                    </Link>
                    <Link asChild minH="44px" fontSize="sm">
                      <NextLink href={`/projects/${project.id}`}>
                        Read the build notes →
                      </NextLink>
                    </Link>
                  </Flex>
                </Box>
              ))}
          </VStack>
        </Section>

        {/* Why this exists */}
        <Section delay={0.2}>
          <SectionLabel>Why I write</SectionLabel>
          <Paragraph>
            I&apos;m a full-stack developer. Outside my day job, I build my own
            projects and try to figure out which ones people will actually use.
          </Paragraph>
          <Paragraph>
            Here I write about those attempts: what I build, how I find users,
            and the decisions I get wrong. I also keep notes on the books I
            read.
          </Paragraph>
          <Paragraph>
            I work with Rails, run my own infrastructure, and experiment with AI
            tools. The articles come from that work, including the things I
            decide to change or stop.
          </Paragraph>
          <Paragraph>
            Away from the keyboard, I read and train. I lift four times a week.
          </Paragraph>
          <Box display="flex" gap={3} mt={8} flexWrap="wrap">
            <Button
              as={NextLink}
              href="/articles"
              scroll={false}
              colorPalette="orange"
              size="md"
            >
              Read the articles
              <LuChevronRight />
            </Button>
            <Button
              as={NextLink}
              href="/experience"
              scroll={false}
              colorPalette="orange"
              variant="ghost"
              size="md"
            >
              My background
              <LuChevronRight />
            </Button>
          </Box>
        </Section>

        {/* Latest writing */}
        <Section delay={0.3}>
          <SectionLabel>Latest writing</SectionLabel>
          {articlesError ? (
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              I couldn&apos;t load the latest articles. Please try again later.
            </Text>
          ) : latestArticles.length === 0 ? (
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              No articles published yet.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              {latestArticles.slice(0, 2).map((article) => (
                <BaseCard
                  key={`${article.source}:${article.url}`}
                  maxW="none"
                  h="100%"
                >
                  <VStack align="start" gap={3} h="100%">
                    <Badge colorPalette="orange">
                      {article.formattedDate || "No date"}
                    </Badge>
                    <Heading as="h3" fontSize="lg" lineHeight="1.2">
                      {article.title}
                    </Heading>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.300" }}
                    >
                      {article.description ||
                        article.summary ||
                        "No description provided."}
                    </Text>
                    <Link
                      as={article.source === "internal" ? NextLink : "a"}
                      href={article.url}
                      color="orange.700"
                      _dark={{ color: "orange.300" }}
                      fontWeight="medium"
                      mt="auto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.source === "internal" ? (
                        "Read article"
                      ) : (
                        <>
                          Read article <Icon as={LuExternalLink} mx="2px" />
                        </>
                      )}
                    </Link>
                  </VStack>
                </BaseCard>
              ))}
            </SimpleGrid>
          )}
          {currentBook && (
            <Box
              borderLeftWidth="2px"
              borderLeftColor="gray.200"
              _dark={{ borderLeftColor: "whiteAlpha.200" }}
              pl={5}
              mt={8}
            >
              <Link
                as={NextLink}
                href="/books"
                _hover={{ textDecoration: "none", color: "orange.600" }}
                _dark={{ _hover: { color: "orange.300" } }}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  mb={1}
                >
                  Currently reading
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {currentBook.title}
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  {currentBook.author}
                </Text>
              </Link>
            </Box>
          )}
        </Section>

        {/* Bio */}
        <Section delay={0.4}>
          <SectionLabel>Bio</SectionLabel>
          <BioSection year="2001">Born in Piacenza, Italy.</BioSection>
          <BioSection year="2021">
            Completed HS diploma in Computer Science.
          </BioSection>
          <BioSection year="2021">
            Worked @{" "}
            <Link
              as={NextLink}
              href="https://www.getec-italia.com/it/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Getec Italia
            </Link>
            .
          </BioSection>
          <BioSection year="2022">
            Worked @ H&amp;S{" "}
            <Link
              as={NextLink}
              href="https://www.cgm.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              (CGM Group)
            </Link>
            .
          </BioSection>
          <BioSection year="2023 to present">
            Full-time consultant @{" "}
            <Link
              as={NextLink}
              href="https://alten.it"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alten Italia
            </Link>
            .
          </BioSection>
          <BioSection year="2023 to present">
            Mentee of{" "}
            <Link
              as={NextLink}
              href="https://linkedin.com/in/davidecovato"
              target="_blank"
              rel="noopener noreferrer"
            >
              Davide Covato
            </Link>
            .
          </BioSection>
        </Section>
      </Container>
    </Layout>
  );
};

export { getServerSideProps } from "../libs/homeData";

export default Home;
