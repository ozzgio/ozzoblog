import { Container, Badge, Box, Button, Flex, Link } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import Head from "next/head";
import { WorkImage, Title } from "../project";
import projectData from "../../libs/projectData";
import { SITE_URL, resolveSocialImageUrl } from "../../libs/socialMetadata.mjs";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 },
};

const ProjectDetailsLayout = ({
  children,
  title,
  projectTitle,
  description,
  keywords,
  imageUrl,
  imageAlt,
  imageFit,
  imageBg,
  imagePadding,
  socialImageUrl,
  dateInfo,
  path,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const project = projectData.find((entry) => path === `/projects/${entry.id}`);
  const poster = resolveSocialImageUrl(
    socialImageUrl || project?.socialImage || imageUrl,
  );
  const playerPath = project ? `/embed/projects/${project.id}` : null;
  const shareQuery = new URLSearchParams({
    text: project?.shareText || String(title || "Projects by Ozzo"),
    url: `${SITE_URL}${path || "/projects"}`,
  });

  return (
    <motion.article
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.4, ease: "easeInOut" }
      }
      style={{ position: "relative" }}
    >
      <>
        {" "}
        {title && (
          <Head>
            <title key="project-title-tag">{`${title} - Ozzo`}</title>
            <meta
              name="description"
              content={
                description ||
                `Project details for ${title}, built by Ozzo (full stack developer and indie builder).`
              }
            />
            <meta
              name="keywords"
              content={
                keywords ||
                `${title}, software project, full stack development, indie builder, Ozzo`
              }
            />
            <meta
              name="robots"
              content="index,follow,max-image-preview:large"
            />
            {path && <link rel="canonical" href={`https://ozzo.blog${path}`} />}
            <meta property="og:title" content={`${title} - Ozzo`} />
            <meta
              property="og:description"
              content={
                description ||
                `Project details for ${title}, built by Ozzo (full stack developer and indie builder).`
              }
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={
                path ? `https://ozzo.blog${path}` : "https://ozzo.blog/projects"
              }
            />
            <meta property="og:image" content={poster} />
            <meta
              name="twitter:card"
              content={playerPath ? "player" : "summary_large_image"}
            />
            <meta name="twitter:site" content="@ozzgio" />
            <meta name="twitter:creator" content="@ozzgio" />
            {playerPath && (
              <>
                <meta
                  name="twitter:player"
                  content={`${SITE_URL}${playerPath}`}
                />
                <meta name="twitter:player:width" content="640" />
                <meta name="twitter:player:height" content="480" />
              </>
            )}
            <meta name="twitter:title" content={`${title} - Ozzo`} />
            <meta
              name="twitter:description"
              content={
                description ||
                `Project details for ${title}, built by Ozzo (full stack developer and indie builder).`
              }
            />
            <meta name="twitter:image" content={poster} />
            {path && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareSourceCode",
                    name: title,
                    description:
                      description ||
                      `Project details for ${title}, built by Ozzo (full stack developer and indie builder).`,
                    url: `https://ozzo.blog${path}`,
                    author: {
                      "@type": "Person",
                      name: "Ozzo",
                      alternateName: "Ozzo",
                    },
                  }),
                }}
              />
            )}
          </Head>
        )}
        <Container maxW="container.md" pt={8} pb={12}>
          <Title>{projectTitle}</Title>
          {playerPath && (
            <Flex gap={4} align="center" flexWrap="wrap" mb={4}>
              <Button
                size="sm"
                minH="44px"
                colorPalette="orange"
                color="accent.link"
                variant="outline"
                asChild
              >
                <a
                  href={`https://x.com/intent/post?${shareQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on X ↗
                </a>
              </Button>
              <Link
                href={playerPath}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="sm"
                minH="44px"
                display="inline-flex"
                alignItems="center"
                color="accent.link"
              >
                Try the project preview ↗
              </Link>
              {project.contact && (
                <Link
                  href={`mailto:${project.contact}`}
                  fontSize="sm"
                  minH="44px"
                  display="inline-flex"
                  alignItems="center"
                >
                  Contact the project
                </Link>
              )}
            </Flex>
          )}
          {dateInfo && dateInfo.display && (
            <Badge mb={4}>{dateInfo.value}</Badge>
          )}
          {imageUrl && (
            <Box mb={10}>
              <WorkImage
                src={imageUrl}
                alt={imageAlt}
                fit={imageFit}
                bg={imageBg}
                p={imagePadding}
              />
            </Box>
          )}
          <Box mt={6}>{children}</Box>
        </Container>
      </>
    </motion.article>
  );
};

export default ProjectDetailsLayout;
