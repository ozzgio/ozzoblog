import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Text,
  Flex,
  Badge,
  Wrap,
  WrapItem,
  Tag,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import Image from "next/image";
import Layout from "../components/layouts/layout";
import ProjectCard from "../components/cards/projectcard";
import BaseCard from "../components/basecard";
import projectData from "../libs/projectData";

const MotionBox = motion.create(Box);

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

const FeaturedCard = ({ project }) => {
  const { colors } = useTheme();
  const tagBg = useColorModeValue("tagBg.default", "tagBg._dark");
  const tagText = useColorModeValue("tagText.default", "tagText._dark");
  const bodyText = useColorModeValue(colors.bodyText.default, colors.bodyText._dark);
  const headingText = useColorModeValue(colors.headingText.default, colors.headingText._dark);

  return (
    <NextLink href={`/projects/${project.id}`} passHref scroll={false}>
      <BaseCard p={0} maxW="none" role="group" tabIndex={0}>
        <Flex direction={{ base: "column", md: "row" }} minH={{ md: "220px" }}>
          <Box
            w={{ base: "100%", md: "42%" }}
            position="relative"
            bg="#0f172a"
            flexShrink={0}
            minH={{ base: "180px", md: "auto" }}
          >
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              style={{ objectFit: "contain", padding: "24px" }}
              unoptimized={/\.(png|svg|gif)$/i.test(project.thumbnail ?? "")}
            />
          </Box>
          <Box p={6} flex={1} display="flex" flexDirection="column" justifyContent="center">
            <Badge colorScheme="orange" mb={2} alignSelf="start" fontSize="xs">
              {formatDate(project.date)}
            </Badge>
            <Heading as="h3" fontSize="xl" mb={2} color={headingText} lineHeight="tight">
              {project.title}
            </Heading>
            <Text fontSize="sm" color={bodyText} mb={4} lineHeight="tall">
              {project.description}
            </Text>
            <Wrap spacing={2}>
              {project.stack.map((tag, i) => (
                <WrapItem key={i}>
                  <Tag
                    size="sm"
                    bg={tagBg}
                    color={tagText}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontWeight="semibold"
                  >
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        </Flex>
      </BaseCard>
    </NextLink>
  );
};

const SectionLabel = ({ children }) => (
  <Heading
    as="h2"
    fontSize="xs"
    fontWeight="semibold"
    textTransform="uppercase"
    letterSpacing="widest"
    color="gray.500"
    mt={10}
    mb={4}
  >
    {children}
  </Heading>
);

const Projects = () => {
  const featured = projectData.find((p) => p.status === "featured");
  const active = projectData.filter((p) => p.status === "active");
  const earlier = projectData.filter((p) => p.status === "learning");

  return (
    <Layout
      title="Projects"
      description="Products, internal tools, and earlier work by Ozzo, solo developer building systems for autonomy."
      keywords="projects, Rails SaaS, homelab, internal tooling, indie builder, Ozzo"
      path="/projects"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Container maxW="container.lg" px={[2, 4, 8]}>
          <Heading
            as="h1"
            fontSize={["2xl", "2xl", "3xl"]}
            mb={2}
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            Projects
          </Heading>
          <Text fontSize="sm" color="gray.500" mb={8}>
            Products, tools, and earlier work. The interesting details are on the individual pages.
          </Text>

          {featured && (
            <>
              <SectionLabel>Main project</SectionLabel>
              <FeaturedCard project={featured} />
            </>
          )}

          {active.length > 0 && (
            <>
              <SectionLabel>Internal tools</SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={[6, 8]}>
                {active.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    thumbnail={project.thumbnail}
                    stack={project.stack}
                    date={project.date}
                  >
                    {project.description}
                  </ProjectCard>
                ))}
              </SimpleGrid>
            </>
          )}

          {earlier.length > 0 && (
            <>
              <SectionLabel>Archive</SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={[6, 8]} mb={12}>
                {earlier.map((project) => (
                  <Box
                    key={project.id}
                    h="100%"
                    sx={{
                      filter: "grayscale(50%)",
                      opacity: 0.7,
                      transition: "filter 0.25s ease, opacity 0.25s ease",
                      "&:hover": { filter: "grayscale(0%)", opacity: 1 },
                    }}
                  >
                    <ProjectCard
                      id={project.id}
                      title={project.title}
                      thumbnail={project.thumbnail}
                      stack={project.stack}
                      date={project.date}
                      compact
                    >
                      {project.description}
                    </ProjectCard>
                  </Box>
                ))}
              </SimpleGrid>
            </>
          )}
        </Container>
      </MotionBox>
    </Layout>
  );
};

export default Projects;
