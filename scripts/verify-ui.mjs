import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import projectData from "../libs/projectData.js";

const baseUrl = process.env.TARGET_URL || "http://localhost:3000";
const artifactDir = process.env.UI_ARTIFACT_DIR || "/tmp/ozzo-ui";
await mkdir(artifactDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
});
const errors = [];

function trackErrors(page) {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|didn't match|does not recognize|invalid.*prop/i.test(
        message.text(),
      )
    )
      errors.push(message.text());
  });
}
async function visit(page, url) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.locator("[data-brand-wordmark]").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const heading = document.querySelector("h1");
    for (let element = heading; element; element = element.parentElement) {
      if (getComputedStyle(element).opacity !== "1") return false;
    }
    return Boolean(heading);
  });
  return response;
}
async function assertTextContrast(page, label) {
  const failures = await page.evaluate(() => {
    const canvas = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
    const rgba = (color) => {
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = color;
      canvas.fillRect(0, 0, 1, 1);
      const result = [...canvas.getImageData(0, 0, 1, 1).data];
      result[3] /= 255;
      return result;
    };
    const luminance = (rgb) =>
      rgb
        .slice(0, 3)
        .map((v) => {
          const n = v / 255;
          return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
    return [
      ...document.querySelectorAll(
        "main p, main time, main h1, main h2, main h3, main a, nav a, footer a",
      ),
    ]
      .filter((el) =>
        [...el.childNodes].some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
        ),
      )
      .flatMap((el) => {
        if (!el.getClientRects().length) return [];
        const style = getComputedStyle(el);
        let background = rgba(getComputedStyle(document.body).backgroundColor);
        const ancestors = [];
        for (let parent = el; parent; parent = parent.parentElement) {
          if (getComputedStyle(parent).opacity === "0") return [];
          ancestors.unshift(parent);
        }
        for (const parent of ancestors) {
          const color = rgba(getComputedStyle(parent).backgroundColor);
          const alpha = color[3] ?? 1;
          background = background.map(
            (v, i) => color[i] * alpha + v * (1 - alpha),
          );
        }
        // Mermaid's HTML labels sit over SVG fills, not CSS backgrounds.
        const shape = el.closest(".node")?.querySelector(".label-container");
        if (shape) background = rgba(getComputedStyle(shape).fill);
        const color = rgba(style.color);
        const alpha = color[3] ?? 1;
        const foreground = background.map(
          (v, i) => color[i] * alpha + v * (1 - alpha),
        );
        const levels = [luminance(foreground), luminance(background)].sort(
          (a, b) => b - a,
        );
        const ratio = (levels[0] + 0.05) / (levels[1] + 0.05);
        const large =
          parseFloat(style.fontSize) >= 24 ||
          (parseFloat(style.fontSize) >= 18.66 &&
            Number(style.fontWeight) >= 700);
        return ratio + 0.02 < (large ? 3 : 4.5)
          ? [{ text: el.innerText.slice(0, 80), ratio }]
          : [];
      });
  });
  assert.deepEqual(failures, [], `${label}: text contrast`);
}
async function captureState(page, label) {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const mode of ["light", "dark"]) {
      if (
        !(await page.locator("html").getAttribute("class"))
          .split(" ")
          .includes(mode)
      )
        await page.getByRole("button", { name: "Toggle theme" }).click();
      await expect(page.locator("html")).toHaveClass(
        new RegExp(`\\b${mode}\\b`),
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${label}: ${width}px overflow`,
      );
      await assertTextContrast(page, `${label}: ${width}px ${mode}`);
      await page.screenshot({
        path: `${artifactDir}/${label}-${width}-${mode}.png`,
        fullPage: true,
      });
    }
  }
}
const routes = [
  "/",
  "/about",
  "/articles",
  "/books",
  "/projects",
  "/contacts",
  "/experience",
  "/newsletter/pending",
  "/newsletter/confirmed",
  "/not-a-page",
  ...projectData.map(({ id }) => `/projects/${id}`),
];
for (const section of ["articles", "books"]) {
  const html = await (await fetch(`${baseUrl}/${section}`)).text();
  const data = JSON.parse(
    html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    )[1],
  );
  const records = (data.props.pageProps[section] || []).filter(
    (record) => record.slug,
  );
  const byLength = [...records].sort((a, b) => a.title.length - b.title.length);
  const selected = [
    records[0],
    byLength[0],
    byLength.at(-1),
    records.find((record) => !record.thumbnail && !record.cover),
  ].filter(Boolean);
  for (const record of selected) {
    const route = `/${section}/${record.slug}`;
    if (!routes.includes(route)) routes.push(route);
  }
}
try {
  for (const colorScheme of ["light", "dark"]) {
    const context = await browser.newContext({
      colorScheme,
      viewport: { width: 1280, height: 900 },
    });
    await context.route("**/_next/**/*.js*", (route) => route.abort());
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(baseUrl + route, { waitUntil: "domcontentloaded" });
      await page.addStyleTag({ content: "* { opacity: 1 !important; }" });
      await assertTextContrast(
        page,
        `Before hydration ${colorScheme} ${route}`,
      );
    }
    await context.close();
    console.log(
      `PASS ${colorScheme}: server-rendered headings, prose and links before hydration`,
    );
  }
  for (const width of [320, 390, 1280]) {
    for (const colorScheme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      trackErrors(page);
      for (const route of routes) {
        const response = await visit(page, baseUrl + route);
        assert.equal(
          response.status(),
          route === "/not-a-page" ? 404 : 200,
          route,
        );
        await expect(
          page.getByRole("heading", { level: 1 }).first(),
        ).toBeVisible();
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${width}px ${route} overflow`,
        );
        await expect(page.locator("html")).toHaveClass(
          new RegExp(`\\b${colorScheme}\\b`),
        );
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.body).backgroundColor,
          ),
          colorScheme === "light" ? "rgb(247, 245, 242)" : "rgb(26, 26, 30)",
        );
        assert.match(
          await page
            .getByRole("heading", { level: 1 })
            .first()
            .evaluate((el) => getComputedStyle(el).fontFamily),
          /^\/(articles|books)\//.test(route) ? /Merriweather/ : /Bricolage/,
          `${route} display font on direct visit`,
        );
        if (route === "/")
          await expect(page.locator("main canvas").locator("..")).toHaveCSS(
            "touch-action",
            "none",
          );
        if (route.startsWith("/books/")) {
          const misaligned = await page
            .locator("[data-reading-step]")
            .evaluateAll((steps) =>
              steps.flatMap((step, index) => {
                const marker = step
                  .querySelector("[data-reading-marker]")
                  .getBoundingClientRect();
                const icon = step.querySelector("svg").getBoundingClientRect();
                const markerX = marker.x + marker.width / 2;
                if (
                  Math.abs(icon.x + icon.width / 2 - markerX) > 0.5 ||
                  Math.abs(
                    icon.y + icon.height / 2 - marker.y - marker.height / 2,
                  ) > 0.5
                )
                  return ["Icon is off centre"];
                if (index === steps.length - 1) return [];
                const rail = getComputedStyle(step, "::before");
                const railX =
                  step.getBoundingClientRect().x +
                  parseFloat(rail.left) +
                  new DOMMatrix(rail.transform).e +
                  parseFloat(rail.width) / 2;
                return Math.abs(railX - markerX) > 0.5
                  ? ["Rail is off centre"]
                  : [];
              }),
            );
          assert.deepEqual(
            misaligned,
            [],
            `${route}: reading marker/rail alignment`,
          );
        }
        if (route === "/books") {
          for (const title of await page.locator("main h3").all()) {
            await expect(title).toHaveCSS("-webkit-line-clamp", "none");
            assert.ok(
              (await title.boundingBox()).width >= 120,
              "Book title reading width",
            );
          }
          const frames = await page.locator("main img").evaluateAll((images) =>
            images.map((image) => ({
              width: image.clientWidth,
              height: image.clientHeight,
            })),
          );
          assert.ok(
            frames.every(
              ({ width, height }) => Math.abs(width / height - 2 / 3) < 0.02,
            ),
            "Consistent portrait book frames",
          );
        }
        if (route === "/projects") {
          for (const image of await page.locator("main img").all())
            await image.scrollIntoViewIfNeeded();
          await page.waitForFunction(() =>
            [...document.querySelectorAll("main img")]
              .filter((image) => new URL(image.src).origin === location.origin)
              .every((image) => image.complete && image.naturalWidth > 0),
          );
          await page.evaluate(() => scrollTo(0, 0));
        }
        await assertTextContrast(page, `${width}px ${colorScheme} ${route}`);
        await page.screenshot({
          path: `${artifactDir}/${width}-${colorScheme}-${route.replaceAll("/", "_")}.png`,
          fullPage: true,
        });
      }
      console.log(
        `PASS ${width}px ${colorScheme}: all ${routes.length} normal/local project routes, typography, theme, overflow, contrast`,
      );
      for (const section of ["articles", "books"]) {
        await visit(page, `${baseUrl}/${section}`);
        const search = page.getByRole("textbox", { name: `Search ${section}` });
        await search.fill("no-match-for-this-ui-regression-check");
        await expect(
          page.getByRole("heading", { name: `No ${section} found` }),
        ).toBeVisible();
        await page.getByRole("button", { name: "Clear filters" }).click();
        await expect(search).toHaveValue("");
        await page
          .getByRole("combobox", { name: `Sort ${section}` })
          .selectOption("alphabetical");
        await expect(
          page.getByText("Sorted alphabetically", { exact: true }),
        ).toBeVisible();
        const tag = page
          .getByRole("button", { pressed: false })
          .filter({ hasText: /\(\d+\)/ })
          .first();
        if (await tag.count()) {
          const label = await tag.textContent();
          await tag.click();
          await expect(
            page.getByRole("button", { name: label, exact: true }),
          ).toHaveAttribute("aria-pressed", "true");
          await page.getByRole("button", { name: "Clear filters" }).click();
        }
      }
      if (width < 768) {
        await page
          .getByRole("button", { name: "Options", exact: true })
          .focus();
        await page.keyboard.press("Enter");
        await expect(
          page.getByRole("menuitem", { name: "Articles", exact: true }),
        ).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(
          page.getByRole("button", { name: "Options", exact: true }),
        ).toBeFocused();
        await page
          .getByRole("button", { name: "Options", exact: true })
          .click();
        await page
          .getByRole("menuitem", { name: "Contacts", exact: true })
          .click();
        await expect(page).toHaveURL(`${baseUrl}/contacts`);
      }
      await page.getByRole("button", { name: "Toggle theme" }).click();
      const alternate = colorScheme === "light" ? "dark" : "light";
      await expect(page.locator("html")).toHaveClass(
        new RegExp(`\\b${alternate}\\b`),
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveClass(
        new RegExp(`\\b${alternate}\\b`),
      );
      await context.close();
    }
  }
  const statePage = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  statePage.setDefaultTimeout(15000);
  trackErrors(statePage);
  await statePage.route("**/thumbs/buildlog.svg", (route) => route.abort());
  await visit(statePage, `${baseUrl}/projects/buildlog`);
  const fallbackImage = statePage.getByRole("img", {
    name: "Buildlog",
    exact: true,
  });
  await expect(fallbackImage).toHaveAttribute("src", "/thumbs/portfolio.png");
  await expect
    .poll(() => fallbackImage.evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);
  await statePage.unroute("**/thumbs/buildlog.svg");
  await fallbackImage.evaluate((image) => {
    image.src = "/thumbs/missing-image-fixture.png";
  });
  await expect(fallbackImage).toHaveAttribute("src", "/thumbs/portfolio.png");
  await expect
    .poll(() => fallbackImage.evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);
  for (const section of ["articles", "books"]) {
    for (const state of ["empty", "error"]) {
      const error =
        state === "error"
          ? { error: `Failed to load ${section}. Please try again later.` }
          : {};
      const pattern = `**/_next/data/**/${section}.json*`;
      await statePage.route(pattern, (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            pageProps: { [section]: [], ...error },
            __N_SSG: section === "books",
            __N_SSP: section === "articles",
          }),
        }),
      );
      await visit(statePage, `${baseUrl}/projects`);
      await statePage
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", {
          name: section === "books" ? "Books" : "Articles",
          exact: true,
        })
        .click();
      if (state === "empty")
        await expect(
          statePage.getByRole("heading", { name: `No ${section} found` }),
        ).toBeVisible();
      else
        await expect(
          statePage.getByText(error.error, { exact: true }),
        ).toBeVisible();
      await captureState(statePage, `${section}-${state}`);
      await statePage.setViewportSize({ width: 1280, height: 900 });
      await statePage.unroute(pattern);
    }
  }
  await statePage.close();
  console.log(
    "PASS mocked empty/error article/book listings on client navigation",
  );
  const page = await browser.newPage({ reducedMotion: "reduce" });
  page.setDefaultTimeout(15000);
  trackErrors(page);
  await visit(page, baseUrl);
  let submissions = 0;
  let release;
  await page.route("**/api/newsletter", async (route) => {
    submissions++;
    assert.deepEqual(route.request().postDataJSON(), {
      email: "reader@example.com",
    });
    await new Promise((resolve) => {
      release = resolve;
    });
    await route.fulfill({
      status: submissions === 1 ? 500 : 200,
      contentType: "application/json",
      body: "{}",
    });
  });
  const email = page.getByRole("textbox", { name: "Email address" });
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  assert.equal(
    submissions,
    0,
    "Native required/email validation must prevent submission",
  );
  await email.fill("reader@example.com");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Subscribing…" }),
  ).toBeDisabled();
  await expect(email).toBeDisabled();
  await captureState(page, "newsletter-loading");
  await expect.poll(() => submissions).toBe(1);
  release();
  await expect(page.locator("form").getByRole("alert")).toHaveText(
    "Something went wrong. Try again.",
  );
  await captureState(page, "newsletter-error");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect.poll(() => submissions).toBe(2);
  release();
  await expect(page).toHaveURL(`${baseUrl}/newsletter/pending`);
  await page.close();
  assert.deepEqual(errors, [], "Browser runtime/hydration errors");
  console.log(
    "PASS native filters/sort/tags, keyboard menu, saved theme, newsletter validation/loading/error/mocked success; no real submissions",
  );
} finally {
  await browser.close();
}
