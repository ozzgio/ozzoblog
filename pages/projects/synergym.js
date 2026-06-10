import { Link, List, ListItem, Center, Heading, Box } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Meta } from "../../components/project";
import P from "../../components/paragraph";
import ProjectDetailsLayout from "../../components/layouts/projectdetails";
import TechStack from "../../components/techstack";
import projectData from "../../libs/projectData";

const Project = ({ project }) => {
  if (!project) {
    return <Center>Project not found.</Center>;
  }

  const { title, description, stack, demo } = project;
  const projectKeywords = `${title}, ${stack.join(", ")}, gym management SaaS, Rails 8, full stack developer, Ozzo`;

  return (
    <ProjectDetailsLayout
      title={title}
      projectTitle={title}
      description={description}
      keywords={projectKeywords}
      path="/projects/synergym"
      imageUrl={project.thumbnail}
      imageAlt={title}
      imageFit="contain"
      imageBg="#0f172a"
      imagePadding={8}
      dateInfo={{ display: true, value: "Oct 2025 - Present" }}
    >
      <List ml={4} my={4}>
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Platform</Meta>
          <span>Web, Rails 8, PostgreSQL, Redis</span>
        </ListItem>
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Stack</Meta>
          <TechStack stack={stack} />
        </ListItem>
        {demo && (
          <ListItem display="flex" alignItems="center" mb={2}>
            <Link href={demo} target="_blank">
              <Meta>Live</Meta>
              synergym.fit
              <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
        )}
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Repo</Meta>
          <span>Private, self-hosted on Gitea</span>
        </ListItem>
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Tests</Meta>
          <span>Playwright E2E, RSpec</span>
        </ListItem>
      </List>

      <Box mt={8}>
        <Heading as="h3" fontSize="lg" mb={3}>What it does</Heading>
        <P>
          Gym management SaaS for trainers and athletes. Trainers create workout programs, assign them to athletes,
          manage an exercise library, and track progress. Athletes log sessions and follow assigned plans. Role-based
          access control across three roles: Athlete, Trainer, Admin. Devise authentication with OAuth, email
          notifications, background jobs with Sidekiq.
        </P>
        <P>
          It&apos;s been in production since late 2025. No active users yet. Distribution is the part I
          haven&apos;t solved. This is my first product, and finding the first real users in a market I&apos;m
          not embedded in is harder than building the thing. The product works. The go-to-market doesn&apos;t,
          yet.
        </P>
      </Box>

      <Box mt={8}>
        <Heading as="h3" fontSize="lg" mb={3}>The architecture work</Heading>
        <P>
          The codebase accumulated the way most codebases do. Each local decision looked reasonable. The bill
          arrived later. By early 2026 I had three files carrying everything:
        </P>
        <List ml={4} my={3} spacing={1}>
          <ListItem fontSize="sm"><code>DashboardsController</code> at 874 lines: streaks, completion, scheduling, all mixed inside HTTP actions</ListItem>
          <ListItem fontSize="sm"><code>TranslationService</code> at 1129 lines: external API calls, caching, locale lookup, fallback rules in one place</ListItem>
          <ListItem fontSize="sm"><code>User</code> model at 699 lines: OAuth, onboarding, unit preferences, roles, fifteen <code>has_many</code> associations</ListItem>
        </List>
        <P>
          After reading Fundamentals of Software Architecture and documenting explicit ADRs, I extracted those
          responsibilities into named collaborators. The resulting numbers:
        </P>
        <List ml={4} my={3} spacing={1}>
          <ListItem fontSize="sm"><code>DashboardsController</code>: 874 → 382 lines</ListItem>
          <ListItem fontSize="sm"><code>TranslationService</code>: 1129 → 383 lines</ListItem>
          <ListItem fontSize="sm"><code>User</code>: 699 → 384 lines</ListItem>
        </List>
        <P>
          I added CI architecture gates so the same drift can&apos;t happen quietly: class LOC under 400, method
          complexity under 10, no layer dependency skips. Every PR touching <code>app/**/*.rb</code> runs those
          checks. An 874-line controller can&apos;t reappear without blocking the merge.
        </P>
        <P>
          The full reasoning is in the{" "}
          <Link
            href="/articles/rails-architecture-accumulated-by-default"
            color="orange.500"
            _dark={{ color: "orange.300" }}
          >
            architecture article
          </Link>
{", "}including the ADR for staying on a layered monolith and the fitness functions in CI.
        </P>
      </Box>

      <Box mt={8}>
        <Heading as="h3" fontSize="lg" mb={3}>What I&apos;m still figuring out</Heading>
        <P>
          The technical side is in decent shape. The codebase has documented architecture decisions, a CI gate
          that enforces structural boundaries, and E2E coverage for the critical paths. That part I can execute.
        </P>
        <P>
          Distribution is the unsolved problem. I don&apos;t have an audience in the fitness industry, I&apos;m
          not a trainer, and I&apos;m not embedded in the communities where potential users are. Getting the first
          paying customer on a SaaS without an existing network is a different skill set from building the product,
          and this is the first time I&apos;m working on both at once.
        </P>
      </Box>
    </ProjectDetailsLayout>
  );
};

export async function getStaticProps() {
  const project = projectData.find((p) => p.id === "synergym");
  return {
    props: {
      project,
    },
  };
}

export default Project;
