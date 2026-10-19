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
  const projectKeywords = `${title}, ${stack.join(", ")}, homelab, self-hosted infrastructure, Ozzo`;

  return (
    <ProjectDetailsLayout
      title={title}
      projectTitle={title}
      description={description}
      keywords={projectKeywords}
      path="/projects/homelab"
      imageUrl={project.thumbnail}
      imageAlt={title}
      imageFit="contain"
      imageBg="#0f172a"
      imagePadding={8}
      socialImageUrl={project.socialImage}
      dateInfo={{ display: true, value: "2024 - Present" }}
    >
      <P>{description}</P>
      <List.Root ml={4} my={4}>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Platform</Meta>
          <span>Intel NUC14, Linux</span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Stack</Meta>
          <TechStack stack={stack} />
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Services</Meta>
          <span>
            Gitea + act_runner CI/CD, n8n (queue mode), ChromaDB, Ollama,
            Faster-Whisper, Letta, custom MCP server
          </span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Repo</Meta>
          <span>Private, self-hosted on Gitea by design</span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Purpose</Meta>
          <span>
            Runs the full agentic stack: vault sync, AI inference, background
            jobs, and CI pipelines for all personal projects
          </span>
        </List.Item>
      </List.Root>
    </ProjectDetailsLayout>
  );
};

export async function getStaticProps() {
  const project = projectData.find((p) => p.id === "homelab");
  return {
    props: {
      project,
    },
  };
}

export default Project;
