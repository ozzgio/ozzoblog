import {
  getArticleBody,
  isInternalArticle,
  resolvePortfolioAssetUrl,
} from "../libs/contentUtils";
import { buildContentEncoded } from "../libs/rssContent";

const siteUrl = "https://ozzo.blog";

function generateRSSFeed(articles) {
  const currentDate = new Date().toUTCString();

  const rssItems = articles
    .map((article) => {
      const pubDate = article.date ? new Date(article.date).toUTCString() : currentDate;
      const description = article.description
        ? `<description><![CDATA[${article.description}]]></description>`
        : "";
      const thumbnail = article.thumbnail
        ? `<media:thumbnail url="${article.thumbnail}" />`
        : "";
      // Only internal articles have a full body to render here -- external
      // entries just link out to wherever they're actually published.
      const contentEncoded = buildContentEncoded(article.content);

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${article.link}</link>
      <guid isPermaLink="true">${article.link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description}
      ${thumbnail}
      ${contentEncoded}
      </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Ozzo's Articles</title>
    <link>${siteUrl}</link>
    <description>Latest articles from Giorgio Ozzola - Full Stack Developer</description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
}

export async function getServerSideProps({ res }) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json",
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const articlesData = await response.json();

    if (!Array.isArray(articlesData)) {
      throw new Error("Invalid JSON format: expected an array");
    }

    const articles = articlesData
      .filter((article) => article && article.title && article.date)
      .map((article) => {
        const source = isInternalArticle(article) ? "internal" : "external";
        return {
          source,
          slug: String(article.slug || ""),
          title: String(article.title || ""),
          description: String(article.description || ""),
          // Gated on source, not just whether a body happens to be present --
          // external rows link out to wherever they're actually published,
          // so they must never get a full-content field even if the JSON
          // carries a stray content/body value.
          content: source === "internal" ? getArticleBody(article) : "",
          url: String(article.url || ""),
          date: article.date || "",
          thumbnail: resolvePortfolioAssetUrl(article.thumbnail),
        };
      })
      .map((article) => ({
        ...article,
        link:
          article.source === "internal" && article.slug
            ? `${siteUrl}/articles/${article.slug}`
            : article.url,
      }))
      .filter((article) => article.link)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    const rssFeed = generateRSSFeed(articles);

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=300");
    res.write(rssFeed);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    res.statusCode = 500;
    res.end();
    return { props: {} };
  }
}

export default function RSSFeed() {
  return null;
}
