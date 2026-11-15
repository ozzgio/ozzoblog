import { fetchArticles, isInternalArticle } from "../libs/contentUtils";
import projectData from "../libs/projectData";
import { SITE_URL } from "../libs/socialMetadata.mjs";

// Rendered per request (cached at the edge) like /rss.xml. A build-time file in
// public/ is never refreshed on Vercel, so new articles would not appear.
const STATIC_PATHS = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/articles", priority: 0.9, changefreq: "weekly" },
  { path: "/projects", priority: 0.9, changefreq: "weekly" },
  { path: "/books", priority: 0.8, changefreq: "weekly" },
  { path: "/about", priority: 0.7, changefreq: "weekly" },
  { path: "/experience", priority: 0.7, changefreq: "weekly" },
  { path: "/contacts", priority: 0.7, changefreq: "monthly" },
];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// An unparseable date drops only that entry's lastmod.
const toLastmod = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
};

export function buildSitemap(articles) {
  const entries = [
    ...STATIC_PATHS,
    ...projectData.map((p) => ({
      path: `/projects/${p.id}`,
      priority: 0.8,
      changefreq: "monthly",
    })),
    ...articles
      .filter(isInternalArticle)
      .map((a) => ({
        path: `/articles/${encodeURIComponent(String(a.slug).trim())}`,
        priority: 0.8,
        changefreq: "monthly",
        lastmod: toLastmod(a.date),
      })),
  ];

  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(SITE_URL + e.path)}</loc>${
      e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""
    }
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  // A failed fetch still serves the static and project URLs, uncached, so the
  // next request retries instead of pinning an article-less sitemap.
  const { ok, articles } = await fetchArticles();

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    ok ? "public, s-maxage=3600, stale-while-revalidate=600" : "no-store",
  );
  res.write(buildSitemap(ok ? articles : []));
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
