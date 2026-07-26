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

  const { title, description, stack, demo, github } = project;
  const projectKeywords = `${title}, Ruby on Rails, SQLite, Kamal, build in public, dev journal, Ozzo`;

  return (
    <ProjectDetailsLayout
      title={title}
      projectTitle={title}
      description={description}
      keywords={projectKeywords}
      path="/projects/buildlog"
      imageUrl={project.thumbnail}
      imageAlt={title}
      imageFit="contain"
      imageBg="#0f172a"
      imagePadding={8}
      socialImageUrl={project.socialImage}
      dateInfo={{ display: true, value: "Jul 2026 - Present" }}
    >
      <List ml={4} my={4}>
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Platform</Meta>
          <span>Web, Rails 8, SQLite</span>
        </ListItem>
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Stack</Meta>
          <TechStack stack={stack} />
        </ListItem>
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Status</Meta>
          <span>Live, built in public</span>
        </ListItem>
        {demo && (
          <ListItem display="flex" alignItems="center" mb={2}>
            <Link href={demo} target="_blank" rel="noopener noreferrer">
              <Meta>Live</Meta>
              log.ozzo.blog
              <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
        )}
        {github && (
          <ListItem display="flex" alignItems="center" mb={2}>
            <Link href={github} target="_blank" rel="noopener noreferrer">
              <Meta>Repo</Meta>
              github.com/ozzgio/buildlog
              <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
        )}
        <ListItem display="flex" alignItems="center" mb={2}>
          <Meta>Deploy</Meta>
          <span>DigitalOcean VPS + Kamal</span>
        </ListItem>
      </List>

      <Box mt={8}>
        <Heading as="h3" fontSize="lg" mb={3}>
          What it is
        </Heading>
        <P>
          A tiny Rails app where I post short daily entries. What I built or learned,
          two or three sentences, a timestamp, an optional tag. Public feed, newest
          first. My dev journal, live at{" "}
          <Link href="https://log.ozzo.blog" target="_blank" rel="noopener noreferrer" color="orange.500" _dark={{ color: "orange.300" }}>
            log.ozzo.blog
          </Link>
          .
        </P>
      </Box>

      <Box mt={8}>
        <Heading as="h3" fontSize="lg" mb={3}>
          What it isn&apos;t
        </Heading>
        <P>
          Not a product. It has no users to serve and no market to win. A build-in-public
          journal for one person is not a business. Pretending otherwise is the kind of
          framing I try to avoid. The app exists because I use it every day, not because
          anyone asked for it.
        </P>
      </Box>

      <Box mt={8}>
        <Heading as="h3" fontSize="lg" mb={3}>
          Why it exists
        </Heading>
        <P>
          It&apos;s my first{" "}
          <Link
            href="https://basecamp.com/shapeup"
            target="_blank"
            rel="noopener noreferrer"
            color="orange.500"
            _dark={{ color: "orange.300" }}
          >
            Shape Up
          </Link>{" "}
          bet, and it has three jobs. <strong>Prove the cadence</strong>: shape,
          pitch, plan, and ship solo on a fixed deadline without moving the date.
          <strong> Ship proof #1</strong>: a real public artifact, linked from this site,
          the first portfolio piece. <strong>Be the content engine</strong>: each daily
          entry becomes a daily X post and raw material for the weekly article. It
          doesn&apos;t compete with the writing. It produces it.
        </P>
      </Box>

      <Box mt={8}>
        <Heading as="h3" fontSize="lg" mb={3}>
          What I&apos;m still figuring out
        </Heading>
        <P>
          The code is deliberately small: entries, auth, a public feed, RSS, a feedback
          form. The interesting question isn&apos;t technical. It&apos;s whether the
          daily-posting habit compounds over six weeks, or whether I&apos;m rationalizing a
          side project as discipline. The bet closes with an honest call: keep shipping it
          for the full six weeks on purpose, or close it once it&apos;s proven the cadence
          and move to the next pitch.
        </P>
      </Box>
    </ProjectDetailsLayout>
  );
};

export async function getStaticProps() {
  const project = projectData.find((p) => p.id === "buildlog");
  return {
    props: {
      project,
    },
  };
}

export default Project;
