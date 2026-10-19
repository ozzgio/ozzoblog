import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const baseUrl = process.env.TARGET_URL || "http://localhost:3000";
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
  await page.clock.fastForward(4000);
  await page.clock.fastForward(2000);
  await page.clock.fastForward(2000);
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
      if (width === 320) await skip.click({ force: true });
      else if (width === 390) await page.keyboard.press("Escape");
      else {
        await page.clock.fastForward(2500);
        assert.equal(
          await page.getByTestId("brand-intro").getAttribute("data-phase"),
          "word",
          "Keep the text visible long enough to read",
        );
      }
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
        `PASS ${width}px ${colorScheme}: intro, dismissal, focus, repeat visit`,
      );
    }
  }

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
