import { List, Center } from "@chakra-ui/react";
import { Meta } from "../../components/project";
import P from "../../components/paragraph";
import ProjectDetailsLayout from "../../components/layouts/projectdetails";
import TechStack from "../../components/techstack";
import projectData from "../../libs/projectData";

const Project = ({ project }) => {
  if (!project) {
    return <Center>Project not found.</Center>;
  }

  const { title, description, stack } = project;
  const projectKeywords = `${title}, ${stack.join(", ")}, agentic dashboard, internal tooling, Ozzo`;

  return (
    <ProjectDetailsLayout
      title={title}
      projectTitle={title}
      description={description}
      keywords={projectKeywords}
      path="/projects/agentic-hub"
      imageUrl={project.thumbnail}
      imageAlt={title}
      imageFit="contain"
      imageBg="#0f172a"
      imagePadding={8}
      socialImageUrl={project.socialImage}
      dateInfo={{ display: true, value: "2026 - Present" }}
    >
      <P>{description}</P>
      <List.Root ml={4} my={4}>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Platform</Meta>
          <span>Web, Docker, port 8787 on NUC</span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Stack</Meta>
          <TechStack stack={stack} />
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Sections</Meta>
          <span>
            Chat, Tasks, Fleet, Topics, Sessions, Wiki, Terminal, Sprint
          </span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Integrates</Meta>
          <span>
            Hermes (open-source AI gateway) via OpenAI-compatible API: chat,
            health, scheduled jobs
          </span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Tests</Meta>
          <span>Playwright E2E for tasks board and fleet view</span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Repo</Meta>
          <span>Private, self-hosted on Gitea by design</span>
        </List.Item>
      </List.Root>
    </ProjectDetailsLayout>
  );
};

export async function getStaticProps() {
  const project = projectData.find((p) => p.id === "agentic-hub");
  return {
    props: {
      project,
    },
  };
}

export default Project;
