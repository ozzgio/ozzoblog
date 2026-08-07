import Head from "next/head";
import { Flex } from "@chakra-ui/react";

const SITE_URL = "https://ozzo.blog";
const DEFAULT_TITLE = "Ozzo | From developer to independent operator";
const DEFAULT_DESCRIPTION =
  "Field notes for experienced developers learning to find demand, ship useful software, earn attention, and build toward independent work.";
const DEFAULT_KEYWORDS =
  "independent developer, product validation, software distribution, build in public, Ruby on Rails, solo developer, personal brand";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/zicon.png`;

const Layout = ({
  children,
  title,
  metaTitle,
  socialTitle,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  robots = "index,follow,max-image-preview:large",
  path = "",
  image = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd = null,
}) => {
  const pageTitle = metaTitle || (title ? `${title} | Ozzo` : DEFAULT_TITLE);
  const shareTitle = socialTitle || pageTitle;
  const canonicalUrl = path ? `${SITE_URL}${path}` : null;

  return (
    <Flex direction="column">
      <Head>
        <title key="title-tag">{pageTitle}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="description" content={description} />
        <meta name="author" content="Ozzo" />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content={robots} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="512x512" href="/images/zicon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/zicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl || SITE_URL} />
        <meta property="og:site_name" content="Ozzo" />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd),
            }}
          />
        )}
      </Head>
      {children}
    </Flex>
  );
};

export default Layout;
