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
  Link,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "../components/layouts/layout";
import BaseCard from "../components/basecard";
import TechStack from "../components/techstack";
import projectData from "../libs/projectData";

const MotionBox = motion.create(Box);

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

const isRaster = (url) => /\.(png|jpe?g|gif|webp)$/i.test(url ?? "");

// Quiet 1-5 dot indicator. Filled = level. Used for effort (orange) and
// difficulty (muted) — the legend at the top of the page names them.
const Dots = ({ level = 0, color = "orange.400", colorDark = "orange.300", label }) => {
  const fill = useColorModeValue(color, colorDark);
  const empty = useColorModeValue("gray.200", "gray.700");
  return (
    <Box
      display="inline-flex"
      gap="3px"
      aria-label={label}
      title={label}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Box
          key={i}
          w="6px"
          h="6px"
          borderRadius="full"
          bg={i < level ? fill : empty}
          flexShrink={0}
        />
      ))}
    </Box>
  );
};

const SignalRow = ({ effort, difficulty }) => {
  const muted = useColorModeValue("gray.500", "gray.400");
  return (
    <Flex align="center" gap={3} mt={3} flexWrap="wrap">
      <Flex align="center" gap={1}>
        <Text fontSize="10px" color={muted} textTransform="uppercase" letterSpacing="wide">
          effort
        </Text>
        <Dots level={effort} label={`effort ${effort} of 5`} />
      </Flex>
      <Flex align="center" gap={1}>
        <Text fontSize="10px" color={muted} textTransform="uppercase" letterSpacing="wide">
          diff
        </Text>
        <Dots
          level={difficulty}
          color="gray.500"
          colorDark="gray.400"
          label={`difficulty ${difficulty} of 5`}
        />
      </Flex>
    </Flex>
  );
};

// Proof is the point of this page. Each row leads with a real live link or
// repo. Where neither exists (genuinely private/self-hosted), say so honestly
// instead of fabricating one.
const ProofLinks = ({ demo, github, size = "sm" }) => {
  const muted = useColorModeValue("gray.500", "gray.400");
  if (!demo && !github) {
    return (
      <Text fontSize="xs" fontStyle="italic" color={muted}>
        private · self-hosted
      </Text>
    );
  }
  return (
    <Wrap spacing={4} align="center">
      {demo && (
        <WrapItem>
          <Link
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            fontSize={size}
            fontWeight="semibold"
            onClick={(e) => e.stopPropagation()}
          >
            live <ExternalLinkIcon mx="4px" fontSize="xs" />
          </Link>
        </WrapItem>
      )}
      {github && (
        <WrapItem>
          <Link
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            fontSize={size}
            fontWeight="semibold"
            onClick={(e) => e.stopPropagation()}
          >
            repo <ExternalLinkIcon mx="4px" fontSize="xs" />
          </Link>
        </WrapItem>
      )}
    </Wrap>
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

const NowCard = ({ project }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const bodyText = useColorModeValue(colors.bodyText.default, colors.bodyText._dark);
  const headingText = useColorModeValue(colors.headingText.default, colors.headingText._dark);
  const muted = useColorModeValue("gray.500", "gray.400");
  const { id, title, description, thumbnail, stack, demo, github, date, effort, difficulty } =
    project;

  return (
    <BaseCard
      p={0}
      maxW="none"
      mx="0"
      cursor="pointer"
      onClick={() => router.push(`/projects/${id}`)}
    >
      <Flex direction={{ base: "column", md: "row" }} minH={{ md: "220px" }}>
        <Box
          w={{ base: "100%", md: "42%" }}
          position="relative"
          bg="#0f172a"
          flexShrink={0}
          minH={{ base: "180px", md: "auto" }}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            style={{ objectFit: "contain", padding: "24px" }}
            unoptimized={!isRaster(thumbnail)}
          />
        </Box>
        <Box p={6} flex={1} display="flex" flexDirection="column" justifyContent="center">
          <Flex align="center" gap={2} mb={2}>
            <Badge colorScheme="orange" fontSize="xs">
              NOW
            </Badge>
            <Text fontSize="xs" color={muted}>
              {formatDate(date)}
            </Text>
          </Flex>
          <Heading as="h3" fontSize="xl" mb={2} lineHeight="tight">
            <Link
              as={NextLink}
              href={`/projects/${id}`}
              color={headingText}
              _hover={{ textDecoration: "none", color: "orange.500" }}
            >
              {title}
            </Link>
          </Heading>
          <Text fontSize="sm" color={bodyText} mb={4} lineHeight="tall">
            {description}
          </Text>
          <Box mb={3}>
            <ProofLinks demo={demo} github={github} />
          </Box>
          <TechStack stack={stack} />
          <SignalRow effort={effort} difficulty={difficulty} />
        </Box>
      </Flex>
    </BaseCard>
  );
};

const ShippedCard = ({ project }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const bodyText = useColorModeValue(colors.bodyText.default, colors.bodyText._dark);
  const headingText = useColorModeValue(colors.headingText.default, colors.headingText._dark);
  const muted = useColorModeValue("gray.500", "gray.400");
  const thumbBg = useColorModeValue("gray.50", "gray.700");
  const { id, title, description, thumbnail, stack, demo, github, date, effort, difficulty } =
    project;

  return (
    <BaseCard
      p={0}
      maxW="none"
      mx="0"
      display="flex"
      flexDirection="column"
      h="100%"
      cursor="pointer"
      onClick={() => router.push(`/projects/${id}`)}
    >
      <Box
        w="100%"
        aspectRatio={16 / 9}
        position="relative"
        bg={thumbBg}
        overflow="hidden"
      >
        <Image
          src={thumbnail}
          alt={title}
          fill
          style={{ objectFit: "contain", padding: "16px" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={!isRaster(thumbnail)}
        />
      </Box>
      <Box p={5} flex={1} display="flex" flexDirection="column">
        <Heading as="h3" fontSize="lg" mb={1} lineHeight="tight">
          <Link
            as={NextLink}
            href={`/projects/${id}`}
            color={headingText}
            _hover={{ textDecoration: "none", color: "orange.500" }}
          >
            {title}
          </Link>
        </Heading>
        <Text fontSize="xs" color={muted} mb={2} fontWeight="medium">
          {formatDate(date)}
        </Text>
        <Text fontSize="xs" color={bodyText} mb={3} lineHeight="tall" noOfLines={4}>
          {description}
        </Text>
        <Box mb={3}>
          <ProofLinks demo={demo} github={github} />
        </Box>
        <TechStack stack={stack} />
        <Box mt="auto">
          <SignalRow effort={effort} difficulty={difficulty} />
        </Box>
      </Box>
    </BaseCard>
  );
};

const EarlierItem = ({ project }) => {
  const muted = useColorModeValue("gray.500", "gray.400");
  const { id, title, stack, demo, github, effort } = project;
  return (
    <Flex align="center" justify="space-between" gap={3} py={2}>
      <Flex align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={{ base: 0, sm: 2 }} minW={0}>
        <Link
          as={NextLink}
          href={`/projects/${id}`}
          fontWeight="medium"
          fontSize="sm"
          _hover={{ textDecoration: "none", color: "orange.500" }}
        >
          {title}
        </Link>
        <Text fontSize="xs" color={muted} noOfLines={1}>
          {stack.join(" · ")}
        </Text>
      </Flex>
      <Flex align="center" gap={3} flexShrink={0}>
        {demo || github ? (
          <Link
            href={demo || github}
            target="_blank"
            rel="noopener noreferrer"
            fontSize="xs"
          >
            {demo ? "live" : "repo"} <ExternalLinkIcon mx="2px" fontSize="xs" />
          </Link>
        ) : (
          <Text fontSize="xs" fontStyle="italic" color={muted}>
            private
          </Text>
        )}
        <Dots level={effort} label={`effort ${effort} of 5`} />
      </Flex>
    </Flex>
  );
};

const Projects = () => {
  const muted = useColorModeValue("gray.500", "gray.400");
  const byEffortDesc = (a, b) => (b.effort ?? 0) - (a.effort ?? 0);
  const now = projectData.filter((p) => p.focus === "now").sort(byEffortDesc);
  const shipped = projectData.filter((p) => p.focus === "shipped").sort(byEffortDesc);
  const earlier = projectData.filter((p) => p.focus === "earlier").sort(byEffortDesc);

  return (
    <Layout
      title="Projects"
      description="What I'm building now, what I've shipped, and earlier work. By Ozzo, building in public — every project links to live code or a live site."
      keywords="projects, build in public, Rails, homelab, indie builder, portfolio, Ozzo"
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
          <Text fontSize="sm" color={muted} mb={3}>
            Building in public, one bet at a time. What I&apos;m shipping now, the
            shipped work behind it, and earlier experiments. Every entry links to
            live code or a live site, or is flagged private/self-hosted.
          </Text>

          {/* Legend */}
          <Flex
            wrap="wrap"
            align="center"
            gap={{ base: 2, sm: 4 }}
            mb={8}
            fontSize="xs"
            color={muted}
          >
            <Flex align="center" gap={1}>
              <Text textTransform="uppercase" letterSpacing="wide">
                effort
              </Text>
              <Dots level={3} label="effort example" />
            </Flex>
            <Flex align="center" gap={1}>
              <Text textTransform="uppercase" letterSpacing="wide">
                difficulty
              </Text>
              <Dots level={2} color="gray.500" colorDark="gray.400" label="difficulty example" />
            </Flex>
            <Text>ordered by current focus</Text>
          </Flex>

          {now.length > 0 && (
            <>
              <SectionLabel>Now shipping</SectionLabel>
              <SimpleGrid columns={{ base: 1 }} spacing={[6, 8]}>
                {now.map((project) => (
                  <NowCard key={project.id} project={project} />
                ))}
              </SimpleGrid>
            </>
          )}

          {shipped.length > 0 && (
            <>
              <SectionLabel>Shipped</SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={[6, 8]}>
                {shipped.map((project) => (
                  <ShippedCard key={project.id} project={project} />
                ))}
              </SimpleGrid>
            </>
          )}

          {earlier.length > 0 && (
            <>
              <SectionLabel>Earlier</SectionLabel>
              <Box opacity={0.9}>
                {earlier.map((project) => (
                  <EarlierItem key={project.id} project={project} />
                ))}
              </Box>
            </>
          )}
        </Container>
      </MotionBox>
    </Layout>
  );
};

export default Projects;
