import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import projectData from "../libs/projectData.js";
import { SITE_URL } from "../libs/socialMetadata.mjs";

const baseUrl = process.env.TARGET_URL || "http://localhost:3000";
const meta = (html, name) =>
  html.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]+)"`))?.[1];

for (const project of projectData) {
  const response = await fetch(`${baseUrl}/projects/${project.id}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  const shareHref = html.match(
    /href="(https:\/\/x\.com\/intent\/post\?[^\"]+)"/,
  )?.[1];
  const draft = new URL(shareHref.replaceAll("&amp;", "&"));
  assert.equal(
    draft.searchParams.get("url"),
    `${SITE_URL}/projects/${project.id}`,
  );
  assert.equal(draft.searchParams.get("text"), project.shareText);
  assert.ok(project.shareText.length + 24 <= 280);
  assert.equal(meta(html, "twitter:card"), "player");
  assert.equal(meta(html, "twitter:site"), "@ozzgio");
  assert.equal(meta(html, "twitter:creator"), "@ozzgio");
  assert.equal(
    meta(html, "twitter:player"),
    `${SITE_URL}/embed/projects/${project.id}`,
  );
  assert.equal(meta(html, "twitter:player:width"), "640");
  assert.equal(meta(html, "twitter:player:height"), "480");
  const poster = meta(html, "twitter:image");
  assert.equal(
    poster,
    `${SITE_URL}${project.socialImage || project.thumbnail}`,
  );
  const image = await fetch(poster.replace(SITE_URL, baseUrl));
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type"), /^image\/(png|jpeg|webp)/);

  const embed = await fetch(`${baseUrl}/embed/projects/${project.id}`);
  assert.equal(embed.status, 200);
  assert.equal(embed.headers.get("x-frame-options"), null);
  assert.match(
    embed.headers.get("content-security-policy"),
    /frame-ancestors 'self' https:\/\/x\.com/,
  );
  const embedHtml = await embed.text();
  if (project.id === "portfolio") {
    const font = embedHtml.match(/href="([^"]+\.woff2)"/)?.[1];
    assert.ok(font, "The player must preload its display font");
    const fontResponse = await fetch(new URL(font, baseUrl));
    assert.equal(fontResponse.status, 200);
    assert.equal(
      fontResponse.headers.get("access-control-allow-origin"),
      "*",
      "Opaque sandbox origins must be able to load public fonts",
    );
  }

  assert.doesNotMatch(embedHtml, /<nav\b|<footer\b|data-testid="brand-intro"/);
  assert.match(meta(embedHtml, "robots"), /noindex/);
}
assert.equal(
  (await fetch(`${baseUrl}/embed/projects/not-a-project`)).status,
  404,
);
console.log(
  `PASS all ${projectData.length} project metadata sets, raster posters, frame headers, SSR embed shells, missing ID`,
);

const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE_PATH && {
    executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  }),
});
const errors = [];
try {
  for (const viewport of [
    { width: 640, height: 480 },
    { width: 1280, height: 900 },
    { width: 320, height: 568 },
    { width: 390, height: 844 },
  ]) {
    const mobile = viewport.width < 640;
    const context = await browser.newContext({
      viewport,
      hasTouch: mobile,
      isMobile: mobile,
    });
    context.setDefaultTimeout(15000);
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    for (const project of projectData) {
      await page.goto(`${baseUrl}/embed/projects/${project.id}`, {
        waitUntil: "networkidle",
      });
      await page
        .getByRole("heading", { name: project.title, exact: true })
        .waitFor();
      await page.waitForFunction(() => {
        const image = document.querySelector("main img");
        return image?.complete && image.naturalWidth > 0;
      });
      assert.equal(await page.locator("nav,footer,form").count(), 0);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      for (const link of await page.getByRole("link").all()) {
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.match(await link.getAttribute("rel"), /noopener/);
        const box = await link.boundingBox();
        assert.ok(box.height >= 44);
        if (mobile) assert.ok(box.y + box.height <= viewport.height * 0.7);
      }
      await page.getByRole("tab", { name: "Preview", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      await expect(
        page.getByRole("tab", { name: "Stack", exact: true }),
      ).toHaveAttribute("aria-selected", "true");
      await page
        .getByRole("tabpanel")
        .getByText(project.stack[0], { exact: true })
        .waitFor();
      await page.getByRole("tab", { name: "About", exact: true }).click();
      await page
        .getByRole("tabpanel")
        .getByText(project.description, { exact: true })
        .waitFor();
      assert.equal(
        await page.getByRole("link", { name: "Live app" }).count(),
        project.demo ? 1 : 0,
      );
    }
    await context.close();
    console.log(
      `PASS ${viewport.width}px: every project, keyboard tabs, links, touch targets, safe area`,
    );
  }

  const context = await browser.newContext();
  context.setDefaultTimeout(15000);
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => {
    if (request.url().includes("/_next/static/media/"))
      errors.push("Sandbox font failed: " + request.url());
  });
  await page.route(`${baseUrl}/player-test-frame`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<iframe title="Project player" width="640" height="480" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" src="${baseUrl}/embed/projects/buildlog"></iframe>`,
    }),
  );
  await page.goto(`${baseUrl}/player-test-frame`, {
    waitUntil: "networkidle",
  });
  const frame = page.frameLocator('iframe[title="Project player"]');
  await frame.getByRole("tab", { name: "Stack", exact: true }).click();
  await frame
    .getByRole("tabpanel")
    .getByText("Ruby on Rails", { exact: true })
    .waitFor();
  await context.close();

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(`${baseUrl}/embed/projects/buildlog`);
  await staticPage
    .getByRole("heading", { name: "Buildlog", exact: true })
    .waitFor();
  await staticPage.getByRole("link", { name: "Project story" }).waitFor();
  assert.equal(await staticPage.locator("nav,footer").count(), 0);
  await noScript.close();

  assert.deepEqual(errors, [], "Unexpected browser errors");
  console.log(
    "PASS sandbox without forms/same-origin storage, no-JS fallback; no browser errors",
  );
} finally {
  await browser.close();
}
