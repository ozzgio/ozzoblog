import { Container, Badge, Box } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import Head from "next/head";
import { WorkImage, Title } from "../project";

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

  return (
    <motion.article
      initial={shouldReduceMotion ? false : "hidden"}
      animate="enter"
      exit="exit"
      variants={variants}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, type: "easeInOut" }}
      style={{ position: "relative" }}
    >
    <>
      {" "}
      {title && (
        <Head>
          <title key="project-title-tag">
            {`${title || ""} - Ozzo`.trim()}
          </title>
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
          <meta name="robots" content="index,follow,max-image-preview:large" />
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
            content={path ? `https://ozzo.blog${path}` : "https://ozzo.blog/projects"}
          />
          <meta
            property="og:image"
            content={
              socialImageUrl || imageUrl
                ? `https://ozzo.blog${socialImageUrl || imageUrl}`
                : "https://ozzo.blog/images/propic.jpg"
            }
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${title} - Ozzo`} />
          <meta
            name="twitter:description"
            content={
              description ||
              `Project details for ${title}, built by Ozzo (full stack developer and indie builder).`
            }
          />
          <meta
            name="twitter:image"
            content={
              socialImageUrl || imageUrl
                ? `https://ozzo.blog${socialImageUrl || imageUrl}`
                : "https://ozzo.blog/images/propic.jpg"
            }
          />
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
                    name: "Giorgio Ozzola",
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
        {dateInfo && dateInfo.display && <Badge mb={4}>{dateInfo.value}</Badge>}
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
