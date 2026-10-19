import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import Layout from "../components/layouts/layout";
import projectData from "../libs/projectData";
import { projectReferralUrl } from "../libs/projectReferral.mjs";

const ProjectCard = ({ project, featured = false }) => {
  const {
    id,
    title,
    description,
    thumbnail,
    socialImage,
    demo,
    github,
    audience,
    status,
    lesson,
  } = project;
  const imageSrc = featured ? socialImage || thumbnail : thumbnail;
  const href = demo
    ? projectReferralUrl(demo, id, "projects-card")
    : `/projects/${id}`;
  return (
    <LinkBox
      as="article"
      data-project={id}
      className="group"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      h="100%"
      minW={0}
      transition="border-color 0.2s, box-shadow 0.2s"
      _hover={{ borderColor: "accent.link", boxShadow: "sm" }}
      _focusWithin={{
        outline: "2px solid",
        outlineColor: "accent.link",
        outlineOffset: "4px",
      }}
    >
      <Box
        position="relative"
        aspectRatio={16 / 9}
        w="100%"
        overflow="hidden"
        bg="bg.subtle"
        borderBottomWidth="1px"
        borderColor="border"
      >
        <Image
          src={imageSrc}
          alt={`${title} preview`}
          fill
          style={{ objectFit: "contain" }}
          sizes={
            featured
              ? "(min-width: 1200px) 576px, (min-width: 768px) 50vw, 100vw"
              : "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
          }
          unoptimized={/\.svg$/i.test(imageSrc)}
        />
      </Box>
      <VStack
        align="stretch"
        gap={featured ? 4 : 3}
        p={{ base: 5, md: featured ? 7 : 5 }}
        flex={1}
      >
        {featured && (
          <HStack justify="space-between" flexWrap="wrap" gap={2}>
            <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
              {audience}
            </Text>
            <Badge colorPalette="orange" variant="subtle">
              {status}
            </Badge>
          </HStack>
        )}
        <Heading
          as="h3"
          fontSize={featured ? { base: "2xl", lg: "3xl" } : "xl"}
          lineHeight="1.15"
        >
          <LinkOverlay asChild>
            {demo ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {title}{" "}
                <Box as="span" aria-hidden="true" color="accent.link">
                  ↗
                </Box>
              </a>
            ) : (
              <NextLink href={href}>{title}</NextLink>
            )}
          </LinkOverlay>
        </Heading>
        <Text
          fontSize={featured ? "md" : "sm"}
          lineHeight="1.75"
          color="fg.muted"
        >
          {description}
        </Text>
        {featured && (
          <Text
            fontSize="sm"
            lineHeight="1.75"
            borderLeftWidth="2px"
            borderColor="orange.400"
            pl={4}
          >
            {lesson}
          </Text>
        )}
        <Flex gap={4} mt="auto" pt={1} align="center" wrap="wrap" fontSize="sm">
          {demo && (
            <Link
              asChild
              minH="44px"
              display="inline-flex"
              alignItems="center"
              position="relative"
              zIndex={1}
            >
              <NextLink href={`/projects/${id}`}>
                Read the build notes →
              </NextLink>
            </Link>
          )}
          {!demo && !github && (
            <Text color="fg.muted" fontSize="xs">
              Private / self-hosted · Read the build notes
            </Text>
          )}
          {github && (
            <Link
              href={projectReferralUrl(github, id, "projects-source")}
              target="_blank"
              rel="noopener noreferrer"
              minH="44px"
              display="inline-flex"
              alignItems="center"
              position="relative"
              zIndex={1}
            >
              Source ↗
            </Link>
          )}
        </Flex>
      </VStack>
    </LinkBox>
  );
};

const Projects = () => {
  const featured = projectData.filter((project) => project.featured);
  const tools = projectData.filter(
    (project) => !project.featured && project.focus !== "earlier",
  );
  const earlier = projectData.filter((project) => project.focus === "earlier");
  return (
    <Layout
      title="Projects"
      description="Software built by Ozzo, including Synergym, One Nil, and the tools he uses every day."
      path="/projects"
    >
      <VStack align="stretch" gap={{ base: 10, md: 14 }}>
        <Box as="header" maxW="43rem" pt={{ base: 2, md: 4 }}>
          <Text
            color="accent.link"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.16em"
            textTransform="uppercase"
            mb={3}
          >
            What I build
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            lineHeight="1.05"
            mb={5}
          >
            Projects
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.7"
            color="fg.muted"
          >
            Products for trainers and football fans, tools I use every day, and
            a few earlier projects I learned from.
          </Text>
        </Box>
        <Box as="section" aria-labelledby="featured-projects-heading">
          <Heading as="h2" id="featured-projects-heading" fontSize="lg" mb={5}>
            Current projects
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 5, md: 6 }}>
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </SimpleGrid>
        </Box>
        <Box as="section" aria-labelledby="project-tools-heading">
          <Heading as="h2" id="project-tools-heading" fontSize="lg" mb={2}>
            Tools I use
          </Heading>
          <Text color="fg.muted" fontSize="sm" mb={5}>
            My development journal, home server, and the apps that help me run
            them.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
            {tools.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </SimpleGrid>
        </Box>
        <Box as="section" aria-labelledby="earlier-projects-heading">
          <Heading as="h2" id="earlier-projects-heading" fontSize="lg" mb={5}>
            Earlier projects
          </Heading>
          <VStack align="stretch" gap={0}>
            {earlier.map((project) => (
              <LinkBox
                as="article"
                key={project.id}
                data-project={project.id}
                py={5}
                borderTopWidth="1px"
                borderColor="border"
                _hover={{ bg: "bg.subtle" }}
              >
                <Flex
                  gap={3}
                  align="baseline"
                  justify="space-between"
                  wrap="wrap"
                >
                  <Heading as="h3" fontSize="md">
                    <LinkOverlay asChild>
                      <NextLink href={`/projects/${project.id}`}>
                        {project.title}
                      </NextLink>
                    </LinkOverlay>
                  </Heading>
                  {(project.demo || project.github) && (
                    <Link
                      href={projectReferralUrl(
                        project.demo || project.github,
                        project.id,
                        "projects-earlier",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      minH="44px"
                      fontSize="sm"
                      display="inline-flex"
                      alignItems="center"
                    >
                      {project.demo ? "Visit" : "Source"} ↗
                    </Link>
                  )}
                </Flex>
                <Text
                  color="fg.muted"
                  fontSize="sm"
                  lineHeight="1.75"
                  maxW="46rem"
                  mt={1}
                >
                  {project.description}
                </Text>
              </LinkBox>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Layout>
  );
};

export default Projects;
