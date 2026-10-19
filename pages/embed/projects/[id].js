import { projectReferralUrl } from "../../../libs/projectReferral.mjs";
import Head from "next/head";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Tabs,
  Tag,
  Text,
  Wrap,
} from "@chakra-ui/react";
import projectData from "../../../libs/projectData";
import { SITE_URL } from "../../../libs/socialMetadata.mjs";

const ProjectPreview = ({ project }) => {
  const projectUrl = `${SITE_URL}/projects/${project.id}`;

  return (
    <>
      <Head>
        <title>{`${project.title} | Project preview by Ozzo`}</title>
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href={projectUrl} />
      </Head>
      <Box bg="gray.900" color="gray.100" minH="100dvh">
        {/* Leave the lower third clear for mobile clients' overlay controls. */}
        <Flex
          as="main"
          direction="column"
          h="100dvh"
          p={{ base: 3, sm: 5 }}
          gap={3}
          css={{
            "@media (pointer: coarse)": { height: "70dvh" },
          }}
        >
          <Flex justify="space-between" align="center" gap={3}>
            <Link
              href={`${SITE_URL}/projects`}
              target="_blank"
              rel="noopener noreferrer"
              color="orange.300"
              fontWeight="bold"
              fontSize="xs"
              letterSpacing="0.15em"
              minH="44px"
              display="inline-flex"
              alignItems="center"
            >
              OZZO / PROJECTS ↗
            </Link>
            <Badge colorPalette="orange" fontSize="10px">
              {project.focus === "now"
                ? "Building now"
                : project.focus === "shipped"
                  ? "Shipped"
                  : "Earlier work"}
            </Badge>
          </Flex>

          <Flex justify="space-between" align="start" gap={3} wrap="wrap">
            <Heading
              as="h1"
              fontSize={{ base: "xl", sm: "2xl" }}
              letterSpacing="tight"
              lineHeight="short"
              style={{
                fontFamily: "var(--font-bricolage-grotesque), sans-serif",
              }}
            >
              {project.title}
            </Heading>
            <Flex gap={2} wrap="wrap">
              <Button
                size="sm"
                minH="44px"
                bg="orange.300"
                color="gray.900"
                _hover={{ bg: "orange.200" }}
                asChild
              >
                <a href={projectUrl} target="_blank" rel="noopener noreferrer">
                  Project story ↗
                </a>
              </Button>
              {project.demo && (
                <Button
                  size="sm"
                  minH="44px"
                  variant="outline"
                  color="gray.100"
                  borderColor="whiteAlpha.400"
                  _hover={{ bg: "whiteAlpha.100" }}
                  asChild
                >
                  <a
                    href={projectReferralUrl(
                      project.demo,
                      project.id,
                      "project-player",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live app ↗
                  </a>
                </Button>
              )}
              {!project.demo && project.github && (
                <Button
                  size="sm"
                  minH="44px"
                  variant="outline"
                  color="gray.100"
                  borderColor="whiteAlpha.400"
                  _hover={{ bg: "whiteAlpha.100" }}
                  asChild
                >
                  <a
                    href={projectReferralUrl(
                      project.github,
                      project.id,
                      "project-player-source",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source ↗
                  </a>
                </Button>
              )}
            </Flex>
          </Flex>

          <Tabs.Root
            defaultValue="preview"
            unstyled
            display="flex"
            flexDirection="column"
            flex={1}
            minH={0}
          >
            <Tabs.List
              gap={4}
              borderBottomWidth="1px"
              borderColor="whiteAlpha.200"
              flexShrink={0}
            >
              {["Preview", "Stack", "About"].map((label) => (
                <Tabs.Trigger
                  value={label.toLowerCase()}
                  key={label}
                  fontSize="sm"
                  minH="44px"
                  px={1}
                  color="gray.400"
                  borderBottomWidth="2px"
                  borderColor="transparent"
                  _selected={{ color: "orange.300", borderColor: "orange.300" }}
                  _focusVisible={{ boxShadow: "outline" }}
                >
                  {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Box
              flex={1}
              minH={0}
              overflowY="auto"
              mt={3}
              borderRadius="lg"
              bg="whiteAlpha.50"
            >
              <Tabs.Content value="preview" h="100%" p={3}>
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} project preview`}
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </Tabs.Content>
              <Tabs.Content value="stack" p={{ base: 4, sm: 6 }}>
                <Text fontSize="xs" color="gray.400" mb={4}>
                  Built with
                </Text>
                <Wrap gap={2}>
                  {project.stack.map((tech) => (
                    <Tag.Root
                      key={tech}
                      bg="whiteAlpha.200"
                      color="gray.100"
                      px={3}
                      py={2}
                    >
                      {tech}
                    </Tag.Root>
                  ))}
                </Wrap>
              </Tabs.Content>
              <Tabs.Content value="about" p={{ base: 4, sm: 6 }}>
                <Text fontSize="sm" color="gray.200" lineHeight="tall">
                  {project.description}
                </Text>
                {!project.demo && !project.github && (
                  <Text fontSize="xs" color="orange.300" mt={4}>
                    Private, self-hosted project. Read the project story for the
                    details.
                  </Text>
                )}
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Flex>
      </Box>
    </>
  );
};

// The iframe receives its own shell on the server, before hydration.
ProjectPreview.getLayout = (page) => page;

export function getStaticPaths() {
  return {
    paths: projectData.map(({ id }) => ({ params: { id } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const project = projectData.find(({ id }) => id === params.id);
  return project ? { props: { project } } : { notFound: true };
}

export default ProjectPreview;
