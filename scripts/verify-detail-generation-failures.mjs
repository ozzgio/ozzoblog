import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const originalFetch = global.fetch;

global.fetch = async () => ({ ok: false });

try {
  const articlePage = await require("../.next/server/pages/articles/[slug].js");
  const bookPage = await require("../.next/server/pages/books/[slug].js");

  await assert.rejects(
    () => articlePage.getStaticProps({ params: { slug: "existing-article" } }),
    /Failed to fetch article content from portfolio-data/,
  );
  await assert.rejects(
    () => bookPage.getStaticProps({ params: { slug: "existing-book" } }),
    /Failed to fetch book content from portfolio-data/,
  );

  global.fetch = async () => ({ ok: true, json: async () => [] });

  assert.deepEqual(
    await articlePage.getStaticProps({ params: { slug: "missing-article" } }),
    { notFound: true, revalidate: 60 },
  );
  assert.deepEqual(
    await bookPage.getStaticProps({ params: { slug: "missing-book" } }),
    { notFound: true, revalidate: 60 },
  );

  console.log("Detail generation rejects upstream failures and preserves genuine 404s.");
} finally {
  global.fetch = originalFetch;
}
