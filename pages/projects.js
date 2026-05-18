import {
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
  HStack,
  Button,
  Select,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layouts/layout";
import ProjectCard from "../components/cards/projectcard";
import projectData from "../libs/projectData";

const MotionBox = motion.create(Box);

const Projects = () => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState("recent");

  const cardTitle = useColorModeValue(
    "headingText.default",
    "headingText._dark"
  );

  // Extract unique tags for filtering (clean and organized)
  const allTechnologies = useMemo(
    () => {
      const tags = Array.from(
        new Set(
          projectData.flatMap((project) => project.tags || [])
        )
      )
        .filter((tag) => !["Fitness", "Game"].includes(tag))
        .sort((a, b) => {
          // Sort by category first, then alphabetically
          const categoryOrder = ["Full Stack", "Frontend", "Backend"];
          const aIndex = categoryOrder.indexOf(a);
          const bIndex = categoryOrder.indexOf(b);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.localeCompare(b);
        });
      return tags;
    },
    []
  );

  const sortedAndFilteredProjects = useMemo(() => {
    let currentProjects = [...projectData];

    // Filter by tag
    if (selectedTag) {
      currentProjects = currentProjects.filter((project) =>
        project.tags?.includes(selectedTag)
      );
    }

    // Sort projects
    switch (sortOption) {
      case "recent":
        // Sort by date (most recent first)
        currentProjects.sort((a, b) => {
          const dateA = a.date || "0000-00";
          const dateB = b.date || "0000-00";
          return dateB.localeCompare(dateA);
        });
        break;
      case "oldest":
        // Sort by date (oldest first)
        currentProjects.sort((a, b) => {
          const dateA = a.date || "0000-00";
          const dateB = b.date || "0000-00";
          return dateA.localeCompare(dateB);
        });
        break;
      case "alphabetical":
        currentProjects.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return currentProjects;
  }, [selectedTag, sortOption]);

  return (
    <Layout
      title="Projects — Full Stack and SaaS Builds"
      description="Selected projects by Ozzo: full stack applications, SaaS products, and production-ready software builds."
      keywords="full stack projects, SaaS portfolio, developer case studies, indie builder projects, web app projects"
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
            mb={6}
            textAlign="center"
            color={cardTitle}
            fontWeight="extrabold"
            letterSpacing="tight"
            _dark={{ color: "headingText._dark" }}
          >
            Projects
          </Heading>

          <VStack spacing={4} align="stretch" mb={8}>
            {/* Filter and Sort Controls */}
            <Box>
              <HStack flexWrap="wrap" spacing={3} mb={4}>
                <Button
                  size="sm"
                  colorScheme={!selectedTag ? "orange" : "gray"}
                  onClick={() => setSelectedTag(null)}
                  variant={!selectedTag ? "solid" : "outline"}
                >
                  All
                </Button>
                {allTechnologies.map((tech, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant={selectedTag === tech ? "solid" : "outline"}
                    colorScheme="orange"
                    onClick={() => setSelectedTag(tech)}
                  >
                    {tech}
                  </Button>
                ))}
              </HStack>
              <Select
                placeholder="Sort by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                width="fit-content"
                size="sm"
                colorScheme="orange"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </Select>
            </Box>

            {/* Projects Grid */}
            {sortedAndFilteredProjects.length === 0 ? (
              <Text textAlign="center" color="gray.500" py={8}>
                No projects found matching your filters.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={[6, 8, 10]}>
                {sortedAndFilteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    thumbnail={project.thumbnail}
                    stack={project.stack}
                    github={project.github}
                    demo={project.demo}
                    date={project.date}
                  >
                    {project.description}
                  </ProjectCard>
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </MotionBox>
    </Layout>
  );
};

export default Projects;
