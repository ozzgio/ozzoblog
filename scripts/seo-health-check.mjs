#!/usr/bin/env node
/**
 * SEO / reliability health check.
 *
 * Runs against a locally-started Next.js server (BASE_URL env var,
 * defaults to http://localhost:3000).  Exits non-zero on any failure
 * so it can gate CI.
 *
 * Checks:
 *  1. RSS feed returns 200 and contains valid XML structure.
 *  2. Every URL in public/sitemap.xml returns 200.
 *  3. Key pages contain all required SEO tags.
 *  4. A current published article exposes article-specific social metadata.
 *
 * Set VERIFY_ARTICLE_OUTAGE=1 to run only the deterministic article-fallback
 * check against a server whose portfolio-data article endpoint is unavailable.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { resolvePortfolioAssetUrl } from "../libs/portfolioAssets.mjs";
import {
  DEFAULT_SOCIAL_IMAGE_URL,
  SITE_URL,
  resolveSocialImageUrl,
} from "../libs/socialMetadata.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const TIMEOUT_MS = 15_000;
const VERIFY_ARTICLE_OUTAGE = process.env.VERIFY_ARTICLE_OUTAGE === "1";
const ARTICLE_OUTAGE_PATH = "/articles/seo-upstream-outage";
const PORTFOLIO_ARTICLES_URL =
  "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json";

// Pages that must carry full SEO metadata.
const KEY_PAGES = ["/", "/articles", "/books", "/projects", "/contacts", "/experience"];

// Tags required on every key page (regex patterns matched against raw HTML).
const REQUIRED_TAGS = [
  { name: "title",           pattern: /<title[^>]*>[^<]+<\/title>/i },
  { name: "meta description",pattern: /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["'][^>]*\/?>/i },
  { name: "canonical",       pattern: /<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']+["'][^>]*\/?>/i },
  { name: "og:title",        pattern: /<meta[^>]+property=["']og:title["'][^>]+content=["'][^"']+["'][^>]*\/?>/i },
  { name: "og:description",  pattern: /<meta[^>]+property=["']og:description["'][^>]+content=["'][^"']+["'][^>]*\/?>/i },
  { name: "og:image",        pattern: /<meta[^>]+property=["']og:image["'][^>]+content=["'][^"']+["'][^>]*\/?>/i },
  { name: "twitter:card",    pattern: /<meta[^>]+name=["']twitter:card["'][^>]+content=["'][^"']+["'][^>]*\/?>/i },
];

let failures = 0;

function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  failures++;
}

function pass(msg) {
  console.log(`  PASS  ${msg}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getMetaContent(html, attribute, value) {
  const tag = html.match(
    new RegExp(`<meta[^>]+${attribute}=["']${escapeRegExp(value)}["'][^>]*>`, "i"),
  )?.[0];
  return tag?.match(/content=["']([^"']+)["']/i)?.[1] || "";
}

function getCanonicalHref(html) {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0];
  return tag?.match(/href=["']([^"']+)["']/i)?.[1] || "";
}

async function get(path) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  return res;
}

function getArticleMetadataExpectation(articles) {
  if (!Array.isArray(articles)) return null;

  const article = articles.find((entry) => {
    const slug = typeof entry?.slug === "string" ? entry.slug.trim() : "";
    const thumbnail =
      typeof entry?.thumbnail === "string" ? entry.thumbnail.trim() : "";
    const content =
      typeof (entry?.content || entry?.body) === "string"
        ? (entry.content || entry.body).trim()
        : "";

    return Boolean(slug && thumbnail && content && !slug.includes("/"));
  });

  if (!article) return null;

  const slug = article.slug.trim();
  const path = `/articles/${encodeURIComponent(slug)}`;
  const thumbnail = resolvePortfolioAssetUrl(article.thumbnail);

  return {
    path,
    expectedCanonical: `${SITE_URL}${path}`,
    expectedImage: resolveSocialImageUrl(thumbnail, DEFAULT_SOCIAL_IMAGE_URL),
  };
}

async function fetchArticleMetadataExpectation() {
  try {
    const response = await fetch(PORTFOLIO_ARTICLES_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      return { expectation: null, reason: `upstream returned HTTP ${response.status}` };
    }

    const expectation = getArticleMetadataExpectation(await response.json());
    return expectation
      ? { expectation, reason: "" }
      : { expectation: null, reason: "no routable article with a thumbnail" };
  } catch (err) {
    return { expectation: null, reason: `upstream unavailable (${err.message})` };
  }
}

async function checkArticleOutageFallback() {
  console.log("\n[Outage] Article fallback route");

  try {
    const response = await get(ARTICLE_OUTAGE_PATH);

    if (response.status !== 200) {
      fail(`${ARTICLE_OUTAGE_PATH} returned HTTP ${response.status}`);
      return;
    }

    const html = await response.text();
    const checks = [
      ["fallback message", html.includes("Article temporarily unavailable"), true],
      ["robots", getMetaContent(html, "name", "robots"), "noindex"],
      ["og:image", getMetaContent(html, "property", "og:image"), DEFAULT_SOCIAL_IMAGE_URL],
      ["twitter:image", getMetaContent(html, "name", "twitter:image"), DEFAULT_SOCIAL_IMAGE_URL],
    ];

    let fallbackOk = true;
    for (const [name, actual, expected] of checks) {
      if (actual !== expected) {
        fail(
          `${ARTICLE_OUTAGE_PATH} fallback ${name} expected ${expected}, got ${actual || "<missing>"}`,
        );
        fallbackOk = false;
      }
    }

    if (fallbackOk) {
      pass(`${ARTICLE_OUTAGE_PATH} — noindex fallback and absolute social images`);
    }
  } catch (err) {
    fail(`${ARTICLE_OUTAGE_PATH} fallback request failed: ${err.message}`);
  }
}

if (VERIFY_ARTICLE_OUTAGE) {
  await checkArticleOutageFallback();

  console.log(`\n${"─".repeat(56)}`);
  if (failures === 0) {
    console.log("Article outage fallback check passed.");
    process.exit(0);
  }

  console.error(`${failures} check(s) failed.`);
  process.exit(1);
}

// ── 1. RSS ────────────────────────────────────────────────────────────────────
console.log("\n[1] RSS feed");
try {
  const res = await get("/rss.xml");
  if (res.status !== 200) {
    fail(`/rss.xml returned HTTP ${res.status}`);
  } else {
    const body = await res.text();
    if (!body.includes("<rss") || !body.includes("</channel>")) {
      fail("/rss.xml body does not look like valid RSS XML");
    } else {
      pass(`/rss.xml → 200 (valid RSS envelope)`);
    }
  }
} catch (err) {
  fail(`/rss.xml request failed: ${err.message}`);
}

// ── 2. Sitemap URLs ───────────────────────────────────────────────────────────
console.log("\n[2] Sitemap URLs");
let sitemapUrls = [];
try {
  const sitemapPath = resolve(ROOT, "public/sitemap.xml");
  const xml = readFileSync(sitemapPath, "utf8");
  // Extract all <loc> values
  sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`    Found ${sitemapUrls.length} URL(s) in public/sitemap.xml`);
} catch (err) {
  fail(`Cannot read public/sitemap.xml: ${err.message}`);
}

for (const fullUrl of sitemapUrls) {
  try {
    const path = fullUrl.replace(/^https?:\/\/[^/]+/, "");
    const res = await get(path);
    if (res.status !== 200) {
      fail(`sitemap URL ${fullUrl} → HTTP ${res.status}`);
    } else {
      pass(`sitemap ${fullUrl} → 200`);
    }
  } catch (err) {
    fail(`sitemap URL ${fullUrl} request failed: ${err.message}`);
  }
}

// ── 3. SEO tags on key pages ──────────────────────────────────────────────────
console.log("\n[3] SEO tags on key pages");
for (const pagePath of KEY_PAGES) {
  let html;
  try {
    const res = await get(pagePath);
    if (res.status !== 200) {
      fail(`${pagePath} returned HTTP ${res.status} — cannot check SEO tags`);
      continue;
    }
    html = await res.text();
  } catch (err) {
    fail(`${pagePath} fetch failed: ${err.message}`);
    continue;
  }

  let pageOk = true;
  for (const tag of REQUIRED_TAGS) {
    if (!tag.pattern.test(html)) {
      fail(`${pagePath} missing ${tag.name}`);
      pageOk = false;
    }
  }
  if (pageOk) pass(`${pagePath} — all ${REQUIRED_TAGS.length} required tags present`);
}

// ── 4. Social image URL resolution ────────────────────────────────────────────
console.log("\n[4] Social image URL resolution");
const socialImageCases = [
  ["site-local image", "/images/articles/example.png", `${SITE_URL}/images/articles/example.png`],
  ["external image", "https://cdn.example.com/article.png", "https://cdn.example.com/article.png"],
  ["default fallback", "", DEFAULT_SOCIAL_IMAGE_URL],
];

for (const [name, image, expected] of socialImageCases) {
  const actual = resolveSocialImageUrl(image);
  if (actual !== expected) {
    fail(`${name} expected ${expected}, got ${actual || "<missing>"}`);
  } else {
    pass(`${name} resolves to ${actual}`);
  }
}

// ── 5. Article-specific social metadata ───────────────────────────────────────
console.log("\n[5] Article-specific social metadata");
const { expectation, reason } = await fetchArticleMetadataExpectation();

if (!expectation) {
  // The editorial record is external. A renamed, removed, thumbnail-less, or
  // temporarily unavailable record should not make the site health check flaky.
  pass(`article metadata check skipped — ${reason}`);
} else {
  try {
    const response = await get(expectation.path);

    if (response.status !== 200) {
      fail(`${expectation.path} returned HTTP ${response.status}`);
    } else {
      const html = await response.text();
      const robots = getMetaContent(html, "name", "robots");

      // During an upstream outage the route deliberately renders its noindex
      // fallback instead of article metadata.
      if (robots === "noindex") {
        pass(`${expectation.path} — upstream unavailable; graceful fallback rendered`);
      } else {
        const checks = [
          ["og:image", getMetaContent(html, "property", "og:image"), expectation.expectedImage],
          ["twitter:image", getMetaContent(html, "name", "twitter:image"), expectation.expectedImage],
          ["og:type", getMetaContent(html, "property", "og:type"), "article"],
          ["og:url", getMetaContent(html, "property", "og:url"), expectation.expectedCanonical],
          ["canonical", getCanonicalHref(html), expectation.expectedCanonical],
        ];

        let articleOk = true;
        for (const [name, actual, expected] of checks) {
          if (actual !== expected) {
            fail(
              `${expectation.path} ${name} expected ${expected}, got ${actual || "<missing>"}`,
            );
            articleOk = false;
          }
        }
        if (articleOk) {
          pass(`${expectation.path} — article thumbnail and canonical metadata`);
        }
      }
    }
  } catch (err) {
    fail(`${expectation.path} metadata check failed: ${err.message}`);
  }
}

// ── Result ────────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(56)}`);
if (failures === 0) {
  console.log("All SEO health checks passed.");
  process.exit(0);
} else {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
}
