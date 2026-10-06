import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const fixture = mkdtempSync(join(tmpdir(), "ozzo-glob-"));
try {
  mkdirSync(join(fixture, "pages"));
  writeFileSync(join(fixture, "pages", "index.html"), "fixture");
  writeFileSync(join(fixture, "pages", "ignore.txt"), "fixture");
  // Resolve from the actual consumers: a broken npm override must fail here.
  const sitemapRequire = createRequire(require.resolve("next-sitemap"));
  const eslintRequire = createRequire(require.resolve("@next/eslint-plugin-next"));
  assert.deepEqual(await sitemapRequire("fast-glob")(fixture + "/**/*.html"),
    [fixture + "/pages/index.html"]);
  assert.deepEqual(eslintRequire("fast-glob").globSync(fixture + "/*", { onlyDirectories: true }),
    [fixture + "/pages"]);
  assert.deepEqual(eslintRequire("fast-glob").globSync(fixture + "/pages", { onlyDirectories: true }),
    [fixture + "/pages"]);
  assert.deepEqual(await sitemapRequire("fast-glob")("pages/*.html", { cwd: fixture }),
    ["pages/index.html"]);
  const mermaidRequire = createRequire(require.resolve("mermaid"));
  assert.match(mermaidRequire("katex").renderToString("x^2", { throwOnError: true }), /class="katex"/);
  console.log("Sitemap/ESLint glob APIs and patched KaTeX rendering verified.");
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
