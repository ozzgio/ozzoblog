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
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const TIMEOUT_MS = 15_000;

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

async function get(path) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  return res;
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

// ── Result ────────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(56)}`);
if (failures === 0) {
  console.log("All SEO health checks passed.");
  process.exit(0);
} else {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
}
