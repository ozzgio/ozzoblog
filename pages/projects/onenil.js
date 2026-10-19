import { projectReferralUrl } from "../../libs/projectReferral.mjs";
import { Link, List, Center, Heading, Box, Icon } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
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
  const projectKeywords = `${title}, Ruby on Rails, Hotwire, SQLite, PWA, football predictions, Ozzo`;

  return (
    <ProjectDetailsLayout
      title={title}
      projectTitle={title}
      description={description}
      keywords={projectKeywords}
      path="/projects/onenil"
      imageUrl={project.thumbnail}
      imageAlt={title}
      imageFit="contain"
      imageBg="#0f172a"
      imagePadding={8}
      socialImageUrl={project.socialImage}
      dateInfo={{ display: true, value: "Sep 2026 - Present" }}
    >
      <List.Root ml={4} my={4}>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Platform</Meta>
          <span>Web, Rails 8.1, SQLite</span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Stack</Meta>
          <TechStack stack={stack} />
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Status</Meta>
          <span>Private beta, staged path to public launch</span>
        </List.Item>
        {demo && (
          <List.Item display="flex" alignItems="center" mb={2}>
            <Link
              href={projectReferralUrl(demo, project.id, "project-detail")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Meta>Live</Meta>
              onenil.org
              <Icon mx="2px" asChild>
                <LuExternalLink />
              </Icon>
            </Link>
          </List.Item>
        )}
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Repo</Meta>
          <span>Private, self-hosted on Gitea</span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Deploy</Meta>
          <span>Hetzner + Kamal</span>
        </List.Item>
      </List.Root>

      <Box mt={8}>
        <Heading as="h2" fontSize="lg" mb={3}>
          What it is
        </Heading>
        <P>
          A private football prediction sheet for matchweek scores. You predict
          every score in the current matchweek, predictions lock at kickoff, and
          results settle automatically. No global leaderboard, no noise: just
          the people in your group, invited with a shareable link. Matchweek
          result boards export as shareable images. It reads like a personal
          fixture sheet, not a live sports dashboard, and it installs as a PWA
          with an offline fallback.
        </P>
      </Box>

      <Box mt={8}>
        <Heading as="h2" fontSize="lg" mb={3}>
          Scoring
        </Heading>
        <P>One rule, four outcomes:</P>
        <List.Root ml={4} my={3} gap={1}>
          <List.Item fontSize="sm">
            Exact score: <strong>3 points</strong>
          </List.Item>
          <List.Item fontSize="sm">
            Correct result and goal difference: <strong>2 points</strong>
          </List.Item>
          <List.Item fontSize="sm">
            Correct result: <strong>1 point</strong>
          </List.Item>
          <List.Item fontSize="sm">
            Wrong result: <strong>0 points</strong>
          </List.Item>
        </List.Root>
      </Box>

      <Box mt={8}>
        <Heading as="h2" fontSize="lg" mb={3}>
          Where it stands
        </Heading>
        <P>
          Live in private beta at{" "}
          <Link
            href={projectReferralUrl(demo, project.id, "project-detail")}
            target="_blank"
            rel="noopener noreferrer"
            color="accent.link"
          >
            onenil.org
          </Link>
          . Fixtures come from football-data.org, with browser-level end-to-end
          coverage on the critical paths. The staged path from private beta to
          public competition is written down as a roadmap and tracked ticket by
          ticket. The lesson from Synergym is applied here from day one:
          distribution is part of the product, not a problem to solve after the
          build.
        </P>
      </Box>
    </ProjectDetailsLayout>
  );
};

export async function getStaticProps() {
  const project = projectData.find((p) => p.id === "onenil");
  return {
    props: {
      project,
    },
  };
}

export default Project;
