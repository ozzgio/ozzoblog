import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const baseUrl = process.env.TARGET_URL || "http://localhost:3000";
const artifactDir = process.env.INTRO_ARTIFACT_DIR || "/tmp/ozzo-intro";
await mkdir(artifactDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE_PATH && {
    executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  }),
});
const errors = [];

async function ready(page) {
  for (let i = 0; i < 100; i++) {
    await page.clock.runFor(16);
    if (
      await page
        .locator(
          '[data-testid="brand-intro"], a[aria-label="Ozzo, home"] [data-brand-wordmark]',
        )
        .count()
    )
      return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.fail("The application did not hydrate");
}

async function open(options = {}, path = "/") {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const time = Date.now();
  await page.clock.install({ time });
  await page.clock.pauseAt(time + 1000);
  await page.goto(baseUrl + path, { waitUntil: "domcontentloaded" });
  await ready(page);
  return { context, page };
}

async function assertReleased(page) {
  for (let i = 0; i < 5; i++) await page.clock.fastForward(2000);
  await page.getByTestId("brand-intro").waitFor({ state: "detached" });
  assert.equal(await page.locator("[inert]").count(), 0);
  assert.notEqual(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  await page
    .getByRole("link", { name: "Ozzo, home" })
    .locator("[data-brand-wordmark]")
    .waitFor();
}

async function animateFor(page, duration) {
  // Sample the endpoints without rendering every frame of the moon behind the overlay.
  await page.clock.runFor(32);
  await page.clock.fastForward(duration - 64);
  await page.clock.runFor(32);
}

try {
  for (const width of [320, 390, 1280]) {
    for (const colorScheme of ["light", "dark"]) {
      const { context, page } = await open({
        viewport: { width, height: 900 },
        colorScheme,
      });
      const skip = page.getByRole("button", { name: "Skip intro" });
      await skip.waitFor();
      assert.equal(
        await skip.evaluate((node) => node === document.activeElement),
        true,
      );
      assert.equal(await page.locator("[inert]").count(), 1);
      assert.ok((await skip.boundingBox()).height >= 44);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      const intro = page.getByTestId("brand-intro");
      await animateFor(page, 1100);
      assert.equal(await intro.getAttribute("data-phase"), "word");
      await page.screenshot({
        path: `${artifactDir}/${width}-${colorScheme}-word.png`,
      });
      await page.clock.fastForward(450);
      assert.equal(await intro.getAttribute("data-phase"), "merge");
      await animateFor(page, 1150);
      assert.equal(await intro.getAttribute("data-phase"), "formed");
      const letters = await intro
        .locator("[data-intro-letter]")
        .evaluateAll((nodes) =>
          nodes.map((node) => {
            const shape = node.querySelector("circle, path");
            const box = shape.getBoundingClientRect();
            return {
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
              opacity: getComputedStyle(node).opacity,
            };
          }),
        );
      assert.ok(Math.abs(letters[0].x - letters[3].x) < 1, "Both Os merge");
      assert.ok(Math.abs(letters[1].x - letters[2].x) < 1, "Both Zs merge");
      assert.ok(
        letters[0].width > letters[1].width * 1.5,
        "The O encloses the Z",
      );
      await animateFor(page, 200);
      assert.equal(
        await intro
          .locator('[data-intro-letter="2"]')
          .evaluate((node) => getComputedStyle(node).opacity),
        "0",
      );
      await page.screenshot({
        path: `${artifactDir}/${width}-${colorScheme}-formed.png`,
      });
      await page.clock.fastForward(200);
      assert.equal(await intro.getAttribute("data-phase"), "mark");
      await animateFor(page, 450);
      const orbit = intro.locator('[data-brand-orbit][data-loading="true"]');
      const glyph = intro.locator('[data-brand-glyph="z"]');
      const rotation = await orbit.evaluate(
        (node) => getComputedStyle(node).transform,
      );
      const glyphBefore = await glyph.boundingBox();
      await animateFor(page, 250);
      assert.notEqual(
        await orbit.evaluate((node) => getComputedStyle(node).transform),
        rotation,
        "The orange rim rotates",
      );
      assert.deepEqual(
        await glyph.boundingBox(),
        glyphBefore,
        "The Z stays still",
      );
      assert.equal(
        await page.locator("[inert]").count(),
        1,
        "Keep the page locked during loading",
      );
      await page.screenshot({
        path: `${artifactDir}/${width}-${colorScheme}-loading.png`,
      });
      await assertReleased(page);
      // Wait beyond the original sequence: skipping must cancel every phase timer.
      await page.clock.fastForward(6000);
      assert.equal(await page.getByTestId("brand-intro").count(), 0);
      await page.reload({ waitUntil: "domcontentloaded" });
      await ready(page);
      assert.equal(await page.getByTestId("brand-intro").count(), 0);
      await assertReleased(page);
      assert.equal(await page.getByTestId("brand-intro").count(), 0);
      await context.close();
      console.log(
        `PASS ${width}px ${colorScheme}: fusion, enclosing O, rotating rim, focus, repeat visit`,
      );
    }
  }

  for (const [phase, advances] of [
    ["word", []],
    ["merge", [1500]],
    ["formed", [1500, 1100]],
    ["mark", [1500, 1100, 350]],
  ]) {
    for (const method of ["button", "Escape"]) {
      const { context, page } = await open();
      for (const delay of advances) await page.clock.fastForward(delay);
      assert.equal(
        await page.getByTestId("brand-intro").getAttribute("data-phase"),
        phase,
      );
      if (method === "button")
        await page
          .getByRole("button", { name: "Skip intro" })
          .click({ force: true });
      else await page.keyboard.press("Escape");
      await assertReleased(page);
      await page.clock.fastForward(6000);
      assert.equal(await page.getByTestId("brand-intro").count(), 0);
      await context.close();
    }
  }
  console.log("PASS button and Escape dismissal during every intro phase");

  const reduced = await open({ reducedMotion: "reduce" });
  await assertReleased(reduced.page);
  assert.equal(await reduced.page.getByTestId("brand-intro").count(), 0);
  await reduced.context.close();

  const live = await open();
  await live.page.getByRole("dialog").waitFor();
  await live.page.emulateMedia({ reducedMotion: "reduce" });
  await assertReleased(live.page);
  await live.context.close();

  const deepLink = await open({}, "/projects");
  await assertReleased(deepLink.page);
  await deepLink.page
    .getByRole("link", { name: "Ozzo, home" })
    .click({ force: true });
  await deepLink.page.waitForURL(baseUrl + "/", {
    waitUntil: "domcontentloaded",
  });
  await ready(deepLink.page);
  await assertReleased(deepLink.page);
  assert.equal(await deepLink.page.getByTestId("brand-intro").count(), 0);
  await deepLink.context.close();

  const blockedStorage = await browser.newContext();
  await blockedStorage.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new DOMException("Storage disabled", "SecurityError");
      },
    });
  });
  const storagePage = await blockedStorage.newPage();
  storagePage.on("pageerror", (error) => errors.push(error.message));
  const time = Date.now();
  await storagePage.clock.install({ time });
  await storagePage.clock.pauseAt(time + 1000);
  await storagePage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await ready(storagePage);
  await storagePage
    .getByRole("button", { name: "Skip intro" })
    .click({ force: true });
  await assertReleased(storagePage);
  await blockedStorage.close();

  assert.deepEqual(errors, [], "Unexpected browser errors");
  console.log(
    "PASS reduced motion, live preference, direct links, disabled storage; no browser errors",
  );
} finally {
  await browser.close();
}
