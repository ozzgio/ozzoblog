import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const HOST = "127.0.0.1";
const ARTICLE_PATH = "/articles/markdown-table-fixture";
const BOOK_PATH = "/books/markdown-table-book-fixture";
const TABLE_MARKDOWN = [
  "| Left | Center | Right |",
  "| :--- | :---: | ---: |",
  "| A long left value | A centred value | A long right value |",
  "| Another row | Keeps readable spacing | Tests overflow handling |",
].join("\n");

const fixtureArticles = [{
  title: "Markdown table fixture",
  description: "Stable renderer fixture",
  date: "2026-08-09",
  slug: "markdown-table-fixture",
  content: ["# Markdown table fixture", "This verifies article prose.", TABLE_MARKDOWN].join("\n\n"),
}];

const fixtureBooks = [{
  title: "Markdown table fixture book",
  author: "Ozzo",
  date: "2026-08-09",
  slug: "markdown-table-book-fixture",
  notes: [
    "**What it teaches**",
    "This verifies the compact prose path.",
    "**Implementation**",
    TABLE_MARKDOWN,
  ].join("\n\n"),
}];

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function listen(server) {
  server.listen(0, HOST);
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string", "Expected a local server address");
  return address.port;
}

async function createFixtureServer() {
  const server = createServer((request, response) => {
    const path = new URL(request.url || "/", "http://" + HOST).pathname;
    const payload = path === "/articles.json"
      ? fixtureArticles
      : path === "/books.json"
        ? fixtureBooks
        : null;

    if (!payload) {
      response.writeHead(404);
      response.end();
      return;
    }

    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(payload));
  });

  const port = await listen(server);
  return {
    server,
    baseUrl: "http://" + HOST + ":" + port,
  };
}

async function findAvailablePort() {
  const server = createServer();
  const port = await listen(server);
  server.close();
  await once(server, "close");
  return port;
}

async function waitForSite(baseUrl, siteProcess, getOutput) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (siteProcess.exitCode !== null) {
      throw new Error("The fixture site exited during startup:\n" + getOutput());
    }

    try {
      const response = await fetch(baseUrl + "/");
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await delay(250);
  }

  throw new Error("Timed out waiting for the fixture site:\n" + getOutput());
}

async function startFixtureSite(fixtureBaseUrl) {
  if (!existsSync(".next/BUILD_ID")) {
    throw new Error("A production build is required before this check. Run npm run build first.");
  }

  const port = await findAvailablePort();
  let output = "";
  const siteProcess = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORTFOLIO_ARTICLES_URL: fixtureBaseUrl + "/articles.json",
        PORTFOLIO_BOOKS_URL: fixtureBaseUrl + "/books.json",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const appendOutput = (chunk) => {
    output = (output + String(chunk)).slice(-10_000);
  };
  siteProcess.stdout.on("data", appendOutput);
  siteProcess.stderr.on("data", appendOutput);

  const baseUrl = "http://" + HOST + ":" + port;
  await waitForSite(baseUrl, siteProcess, () => output);

  return { siteProcess, baseUrl };
}

async function stopProcess(processToStop) {
  if (!processToStop || processToStop.exitCode !== null) return;

  processToStop.kill("SIGTERM");
  await Promise.race([once(processToStop, "exit"), delay(5_000)]);

  if (processToStop.exitCode === null) {
    processToStop.kill("SIGKILL");
    await once(processToStop, "exit");
  }
}

async function closeServer(server) {
  if (!server?.listening) return;
  server.close();
  await once(server, "close");
}

async function tableMetrics(page) {
  const table = page.locator("table").first();
  await assert.doesNotReject(
    () => table.waitFor({ state: "visible", timeout: 15_000 }),
    "Expected a visible Markdown table",
  );

  return table.evaluate((element) => {
    const header = element.querySelector("th");
    const cell = element.querySelector("td");
    const container = element.parentElement;
    const tableStyle = getComputedStyle(element);
    const headerStyle = header && getComputedStyle(header);
    const cellStyle = cell && getComputedStyle(cell);
    const containerStyle = container && getComputedStyle(container);

    return {
      tableDisplay: tableStyle.display,
      headerBorderBottomWidth: headerStyle?.borderBottomWidth,
      headerPaddingLeft: headerStyle?.paddingLeft,
      headerBackground: headerStyle?.backgroundColor,
      headerAlignments: [...element.querySelectorAll("th")].map(
        (item) => getComputedStyle(item).textAlign,
      ),
      cellBorderBottomWidth: cellStyle?.borderBottomWidth,
      cellPaddingLeft: cellStyle?.paddingLeft,
      cellFontSize: cellStyle?.fontSize,
      cellAlignments: [...element.querySelectorAll("tbody td")].slice(0, 3).map(
        (item) => getComputedStyle(item).textAlign,
      ),
      containerClientWidth: container?.clientWidth ?? 0,
      containerScrollWidth: container?.scrollWidth ?? 0,
      containerOverflowX: containerStyle?.overflowX,
      containerRole: container?.getAttribute("role"),
      containerLabel: container?.getAttribute("aria-label"),
      containerTabIndex: container?.tabIndex,
    };
  });
}

function assertTablePresentation(metrics, context, mode) {
  assert.equal(metrics.tableDisplay, "table", context.name + " " + mode + ": must retain table semantics");
  assert.notEqual(metrics.headerBorderBottomWidth, "0px", context.name + " " + mode + ": headers need a visible separator");
  assert.notEqual(metrics.cellBorderBottomWidth, "0px", context.name + " " + mode + ": rows need visible separators");
  assert.ok(parseFloat(metrics.headerPaddingLeft) >= 12, context.name + " " + mode + ": headers need readable horizontal padding");
  assert.ok(parseFloat(metrics.cellPaddingLeft) >= 12, context.name + " " + mode + ": cells need readable horizontal padding");
  assert.equal(metrics.cellFontSize, context.fontSize, context.name + " " + mode + ": must use its configured prose size");
  assert.deepEqual(metrics.headerAlignments, ["left", "center", "right"], context.name + " " + mode + ": must preserve GFM header alignment");
  assert.deepEqual(metrics.cellAlignments, ["left", "center", "right"], context.name + " " + mode + ": must preserve GFM cell alignment");
  assert.notEqual(metrics.headerBackground, "rgba(0, 0, 0, 0)", context.name + " " + mode + ": headers need a distinct surface");
  assert.equal(metrics.containerRole, "region", context.name + " " + mode + ": horizontal scroll must be a named region");
  assert.equal(metrics.containerTabIndex, 0, context.name + " " + mode + ": horizontal scroll must be keyboard-focusable");
  assert.match(metrics.containerLabel || "", /scroll horizontally/i, context.name + " " + mode + ": scroll region needs instructions");
}

async function assertMobileLayout(page, context, mode) {
  const metrics = await tableMetrics(page);
  assertTablePresentation(metrics, context, mode + " mobile");

  const viewportMetrics = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  assert.ok(
    viewportMetrics.documentWidth <= viewportMetrics.viewportWidth,
    context.name + " " + mode + " mobile: the page must not overflow horizontally (" +
      viewportMetrics.documentWidth + "px > " + viewportMetrics.viewportWidth + "px; table " +
      metrics.containerClientWidth + "px / " + metrics.containerScrollWidth + "px)",
  );
  assert.ok(
    ["auto", "scroll"].includes(metrics.containerOverflowX),
    context.name + " " + mode + " mobile: the container must handle horizontal overflow",
  );
  assert.ok(
    metrics.containerScrollWidth > metrics.containerClientWidth,
    context.name + " " + mode + " mobile: wide tables must scroll inside the container",
  );
}

async function setColorMode(page, expectedMode) {
  const currentMode = await page.evaluate(() => (
    document.body.classList.contains("chakra-ui-dark") ? "dark" : "light"
  ));

  if (currentMode !== expectedMode) {
    await page.getByRole("button", { name: "Toggle theme" }).click();
  }

  const resolvedMode = await page.evaluate(() => (
    document.body.classList.contains("chakra-ui-dark") ? "dark" : "light"
  ));
  assert.equal(resolvedMode, expectedMode, "Expected " + expectedMode + " color mode");
}

const contexts = [
  { name: "article prose", path: ARTICLE_PATH, fontSize: "15px" },
  { name: "compact book prose", path: BOOK_PATH, fontSize: "14px" },
];

const fixture = await createFixtureServer();
let site;
let browser;

try {
  site = await startFixtureSite(fixture.baseUrl);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  for (const proseContext of contexts) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(site.baseUrl + proseContext.path, { waitUntil: "networkidle" });

    await setColorMode(page, "light");
    const lightMetrics = await tableMetrics(page);
    assertTablePresentation(lightMetrics, proseContext, "light desktop");

    await setColorMode(page, "dark");
    const darkMetrics = await tableMetrics(page);
    assertTablePresentation(darkMetrics, proseContext, "dark desktop");
    assert.notEqual(
      darkMetrics.headerBackground,
      lightMetrics.headerBackground,
      proseContext.name + ": table headers must adapt to the active color mode",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "networkidle" });
    await setColorMode(page, "dark");
    await assertMobileLayout(page, proseContext, "dark");

    await setColorMode(page, "light");
    await assertMobileLayout(page, proseContext, "light");
  }

  console.log("Markdown table presentation verified with stable article and compact-book fixtures.");
} finally {
  await browser?.close();
  await stopProcess(site?.siteProcess);
  await closeServer(fixture.server);
}
