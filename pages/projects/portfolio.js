import { projectReferralUrl } from "../../libs/projectReferral.mjs";
import { Link, List, Center, Icon } from "@chakra-ui/react";
import { Meta } from "../../components/project";
import P from "../../components/paragraph";
import ProjectDetailsLayout from "../../components/layouts/projectdetails";
import TechStack from "../../components/techstack";
import projectData from "../../libs/projectData";
import { LuExternalLink } from "react-icons/lu";

const Project = ({ project }) => {
  if (!project) {
    return <Center>Project not found.</Center>;
  }

  const { title, description, stack, github, demo } = project;
  const projectKeywords = `${title}, ${stack.join(", ")}, software project, full stack developer, Ozzo`;

  return (
    <ProjectDetailsLayout
      title={title}
      projectTitle={title}
      description={description}
      keywords={projectKeywords}
      path="/projects/portfolio"
      imageUrl={project.thumbnail}
      imageAlt={title}
      dateInfo={{ display: true, value: "May 2023" }}
    >
      <P>{description}</P>
      <List.Root ml={4} my={4}>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Platform</Meta>
          <span>Web</span>
        </List.Item>
        <List.Item display="flex" alignItems="center" mb={2}>
          <Meta>Stack</Meta>
          <TechStack stack={stack} />
        </List.Item>
        {github && !demo && (
          <List.Item display="flex" alignItems="center" mb={2}>
            <Link href={projectReferralUrl(github, project.id, "project-source")} target="_blank" rel="noopener noreferrer">
              <Meta>GitHub</Meta>
              Source Code
              <Icon mx="2px" asChild>
                <LuExternalLink />
              </Icon>
            </Link>
          </List.Item>
        )}
        {demo && (
          <List.Item display="flex" alignItems="center" mb={2}>
            <Link href={projectReferralUrl(demo, project.id, "project-detail")} target="_blank" rel="noopener noreferrer">
              <Meta>Demo</Meta>
              View Live Site
              <Icon mx="2px" asChild>
                <LuExternalLink />
              </Icon>
            </Link>
          </List.Item>
        )}
      </List.Root>
    </ProjectDetailsLayout>
  );
};

export async function getStaticProps() {
  const project = projectData.find((p) => p.id === "portfolio");
  return {
    props: {
      project,
    },
  };
}

export default Project;
