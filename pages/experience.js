import {
  Box,
  Container,
  Heading,
  HStack,
  Link,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "../components/layouts/layout";
import Section from "../components/section";

const StackTag = ({ label }) => {
  const bg = useColorModeValue("orange.50", "whiteAlpha.100");
  const color = useColorModeValue("orange.800", "orange.200");
  const border = useColorModeValue("orange.200", "orange.700");
  return (
    <Tag size="sm" bg={bg} color={color} borderWidth="1px" borderColor={border} borderRadius="full" fontWeight="medium">
      {label}
    </Tag>
  );
};

const WorkEntry = ({ title, company, companyUrl, period, location, bullets, stack }) => {
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("orange.200", "orange.800");
  const bodyText = useColorModeValue("gray.700", "gray.300");
  return (
    <Box borderLeftWidth="2px" borderLeftColor={borderColor} pl={5} py={1}>
      <Heading as="h3" fontSize="md" fontWeight="semibold">{title}</Heading>
      <HStack spacing={2} mt={1} flexWrap="wrap">
        <Link href={companyUrl} isExternal color="orange.500" fontWeight="medium" fontSize="sm">{company}</Link>
        <Text fontSize="sm" color={mutedText}>·</Text>
        <Text fontSize="sm" color={mutedText}>{location}</Text>
        <Text fontSize="sm" color={mutedText}>·</Text>
        <Text fontSize="sm" color={mutedText}>{period}</Text>
      </HStack>
      <VStack align="start" spacing={1} mt={2}>
        {bullets.map((b, i) => (
          <Text key={i} fontSize="sm" color={bodyText}>
            {b}
          </Text>
        ))}
      </VStack>
      {stack && (
        <Wrap spacing={2} mt={3}>
          {stack.map((s) => <WrapItem key={s}><StackTag label={s} /></WrapItem>)}
        </Wrap>
      )}
    </Box>
  );
};

const ProjectEntry = ({ id, title, url, period, description, stack }) => {
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("orange.200", "orange.800");
  const bodyText = useColorModeValue("gray.700", "gray.300");
  return (
    <Box id={id} borderLeftWidth="2px" borderLeftColor={borderColor} pl={5} py={1}>
      <HStack spacing={3} flexWrap="wrap">
        <Heading as="h3" fontSize="md" fontWeight="semibold">{title}</Heading>
        {url && (
          <Link href={url} isExternal color="orange.500" fontSize="sm" fontWeight="medium">{url}</Link>
        )}
        <Text fontSize="sm" color={mutedText}>{period}</Text>
      </HStack>
      <Text fontSize="sm" color={bodyText} mt={2}>{description}</Text>
      {stack && (
        <Wrap spacing={2} mt={3}>
          {stack.map((s) => <WrapItem key={s}><StackTag label={s} /></WrapItem>)}
        </Wrap>
      )}
    </Box>
  );
};

const Experience = () => {
  const mutedText = useColorModeValue("gray.600", "gray.400");

  return (
    <Layout
      title="Background"
      description="Giorgio Ozzola: work history, projects, and stack. Full Stack Developer with 4+ years of professional experience."
      keywords="Giorgio Ozzola, full stack developer, .NET, Rails, experience, background"
      path="/experience"
    >
      <Container maxW="container.md" py={{ base: 6, md: 10 }}>
        <Section delay={0.1}>
          <Heading as="h1" variant="page-title" fontSize={{ base: "3xl", md: "4xl" }} mb={2}>
            Background
          </Heading>
          <Text fontSize="md" color={mutedText} mb={6}>
            Full Stack Developer with 4+ years of professional experience. At ALTEN Italia I worked
            on two enterprise .NET projects in a microservices context: a legacy migration to .NET 8
            and a React frontend built from scratch. Outside of work I build and maintain my own
            products, taking the full stack from database design to UI and keeping them running in
            production.
          </Text>
        </Section>

        <Section delay={0.2}>
          <Heading as="h2" variant="section-title" mb={4}>Work</Heading>
          <VStack spacing={6} align="stretch">
            <WorkEntry
              title="Software Consultant"
              company="ALTEN Italia"
              companyUrl="https://alten.it"
              period="May 2023 – Present"
              location="Remote"
              bullets={[
                "Two enterprise .NET projects across different client domains.",
                "Backend in .NET with SQL Server and MongoDB inside a microservices architecture.",
                "Migrated an internal tool from legacy .NET to .NET 8.",
                "Built a React (Vite) frontend from scratch as part of a modernisation project.",
                "Part of a Scrum team: sprint planning, code reviews, technical design discussions.",
              ]}
              stack={["C#", ".NET 8", "ASP.NET Core", "SQL Server", "MongoDB", "React", "TypeScript", "Scrum"]}
            />
            <WorkEntry
              title="Software Developer"
              company="CGM Telemedicine"
              companyUrl="https://www.cgm.com"
              period="April 2022 – December 2022"
              location="Piacenza, Italy"
              bullets={[
                "Backend development in .NET for healthcare software used in clinical environments.",
                "Data management and SQL database integration.",
              ]}
              stack={[".NET", "SQL Server"]}
            />
            <WorkEntry
              title="Software Developer"
              company="GETEC Italia"
              companyUrl="https://www.getec-italia.com"
              period="September 2021 – February 2022"
              location="Piacenza, Italy"
              bullets={[
                "Built internal web tools for the energy sector, working directly on a live production codebase.",
              ]}
              stack={[".NET", "Web API"]}
            />
          </VStack>
        </Section>

        <Section delay={0.3}>
          <Heading as="h2" variant="section-title" mb={4}>Projects</Heading>
          <VStack spacing={6} align="stretch">
            <ProjectEntry
              title="Synergym.fit"
              url="https://synergym.fit"
              period="Oct 2025 – Ongoing"
              description="Gym management SaaS. Handles trainer and athlete workflows, workout program creation and assignment, progress tracking, background jobs via Sidekiq. Full E2E coverage with Playwright. Running in production."
              stack={["Rails 8", "PostgreSQL", "Redis", "Sidekiq", "Tailwind CSS", "Playwright"]}
            />
            <ProjectEntry
              id="homelab"
              title="Home Lab: Agentic AI Platform"
              period="Ongoing"
              description="25+ Dockerized services running on an Intel NUC14 (Ubuntu 24.04, 16GB RAM), fully self-managed. Mission control: custom Next.js dashboard for monitoring and managing running agents. Agentic stack: n8n in queue mode (worker + Redis + PostgreSQL), Ollama for local LLM inference, Letta for agent memory, ChromaDB as vector store, Faster-Whisper for speech-to-text. Dev side: self-hosted Gitea with act_runner CI/CD, custom MCP server that exposes an Obsidian vault to AI agents. Platform: Nginx Proxy Manager, AdGuard Home, Portainer."
              stack={["Docker", "n8n", "Ollama", "Letta", "ChromaDB", "Faster-Whisper", "Next.js", "Gitea", "MCP", "PostgreSQL", "Redis", "Nginx"]}
            />
            <ProjectEntry
              title="Ruby Chess Engine"
              period="May 2025"
              description="Chess engine in Ruby. Full rule set, AI opponent, save/load, PGN export. RSpec test suite."
              stack={["Ruby", "RSpec"]}
            />
            <ProjectEntry
              title="ozzo.blog"
              url="https://ozzo.blog"
              period="May 2023"
              description="Personal site in Next.js, deployed on Vercel. Dark mode, SEO-optimised, content sourced from an Obsidian vault via CI."
              stack={["Next.js", "Chakra UI", "Vercel"]}
            />
          </VStack>
        </Section>

        <Section delay={0.4}>
          <Heading as="h2" variant="section-title" mb={4}>Stack</Heading>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color={mutedText} mb={2}>
                Core
              </Text>
              <Wrap spacing={2}>
                {["C#", ".NET", "ASP.NET Core", "TypeScript", "JavaScript", "React", "Angular", "Next.js", "SQL Server", "MongoDB", "PostgreSQL"].map((s) => (
                  <WrapItem key={s}><StackTag label={s} /></WrapItem>
                ))}
              </Wrap>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color={mutedText} mb={2}>
                Also use
              </Text>
              <Wrap spacing={2}>
                {["Ruby on Rails", "Ruby", "Node.js", "Redis", "Docker", "Gitea", "Sidekiq", "Ollama", "n8n", "ChromaDB", "Tailwind CSS", "RSpec", "Playwright", "Nginx", "CI/CD"].map((s) => (
                  <WrapItem key={s}><StackTag label={s} /></WrapItem>
                ))}
              </Wrap>
            </Box>
          </VStack>
        </Section>

        <Section delay={0.5}>
          <Heading as="h2" variant="section-title" mb={4}>Education & Certifications</Heading>
          <VStack align="start" spacing={3}>
            <Box>
              <Text fontSize="sm" fontWeight="semibold">ISII Guglielmo Marconi, Piacenza</Text>
              <Text fontSize="sm" color={mutedText}>Diploma Istituto Tecnico e Professionale, Informatica · 2015 – 2021</Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="semibold">Microsoft Certified Solutions Developer: App Builder</Text>
              <Text fontSize="sm" color={mutedText}>Microsoft · May 2023</Text>
            </Box>
          </VStack>
        </Section>

        <Section delay={0.6}>
          <Box textAlign="center" pt={4}>
            <Link as={NextLink} href="/contacts" color="orange.500" fontWeight="semibold" fontSize="sm">
              Want to work together? Get in touch →
            </Link>
          </Box>
        </Section>
      </Container>
    </Layout>
  );
};

export default Experience;
