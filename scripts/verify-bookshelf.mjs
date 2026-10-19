import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { pickShelfBook } from "../libs/randomBook.mjs";

const base = process.env.TARGET_URL || "http://localhost:3167";
const artifactDir = "/tmp/ozzo-bookshelf";
await mkdir(artifactDir, { recursive: true });

const originalRandom = Math.random;
const candidates = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];
try {
  assert.equal(pickShelfBook([], null), null);
  assert.equal(pickShelfBook([candidates[0]], "a"), candidates[0]);
  const reached = new Set();
  for (const value of [0, 0.34, 0.67, 0.999999]) {
    Math.random = () => value;
    reached.add(pickShelfBook(candidates, null).slug);
    for (const previous of candidates)
      assert.notEqual(
        pickShelfBook(candidates, previous.slug).slug,
        previous.slug,
      );
  }
  assert.equal(reached.size, 3, "Every book can be drawn");
} finally {
  Math.random = originalRandom;
}

const require = createRequire(import.meta.url);
const home = await require("../.next/server/pages/index.js");
const about = await require("../.next/server/pages/about.js");
const originalFetch = global.fetch;
const finished = {
  slug: "a",
  title: "A real book",
  author: "Author",
  status: "read",
  concept: "A real concept from my reading notes.",
  notes:
    "**The problem**\nA real note about the problem.\n\n**The concept**\nAnother real note.",
};
const reading = {
  title: "Currently reading",
  author: "Reader",
  status: "reading",
  slug: "reading",
};
try {
  for (const page of [home, about]) {
    global.fetch = async (url) => ({
      ok: true,
      json: async () =>
        String(url).includes("books")
          ? [
              null,
              finished,
              finished,
              reading,
              { ...finished, slug: "paused", status: "paused" },
              { slug: "bad", title: {}, author: "Author" },
              { title: "No notes", author: "Author" },
            ]
          : [],
    });
    const { props } = await page.getServerSideProps({
      res: { setHeader() {} },
    });
    assert.equal(
      props.shelfBooks.length,
      1,
      "Only finished books with real notes; no duplicates",
    );
    assert.equal(
      props.shelfBooks[0].excerpt,
      "A real concept from my reading notes.",
    );
    assert.deepEqual(props.currentBook, {
      title: reading.title,
      author: reading.author,
    });
    for (const [lesson, expected] of [
      ["A useful lesson.", "A useful lesson."],
      ["", "A real note about the problem."],
    ]) {
      global.fetch = async (url) => ({
        ok: true,
        json: async () =>
          String(url).includes("books")
            ? [{ ...finished, concept: "", lesson }]
            : [],
      });
      const fallback = await page.getServerSideProps({
        res: { setHeader() {} },
      });
      assert.equal(fallback.props.shelfBooks[0].excerpt, expected);
    }
    global.fetch = async (url) =>
      String(url).includes("books")
        ? { ok: false }
        : { ok: true, json: async () => [] };
    const unavailableBooks = await page.getServerSideProps({
      res: { setHeader() {} },
    });
    assert.equal(unavailableBooks.props.articlesError, false);
    assert.deepEqual(unavailableBooks.props.shelfBooks, []);
    global.fetch = async () => ({ ok: false });
    const unavailable = await page.getServerSideProps({
      res: { setHeader() {} },
    });
    assert.deepEqual(unavailable.props.shelfBooks, []);
    assert.equal(unavailable.props.currentBook, null);
    assert.equal(unavailable.props.articlesError, true);
  }
} finally {
  global.fetch = originalFetch;
}
console.log(
  "PASS selection and Home/About data contracts, duplicates, malformed records, upstream failure",
);

const response = await fetch(base);
assert.equal(response.status, 200);
const html = await response.text();
const data = JSON.parse(
  html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  )[1],
);
assert.ok(data.props.pageProps.shelfBooks.length > 1);
assert.ok(
  !html.includes("data-open-book="),
  "No surprise open book on server render",
);
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
});
const errors = [];
try {
  for (const mode of ["light", "dark"]) {
    for (const reducedMotion of ["reduce", "no-preference"]) {
      const context = await browser.newContext({
        colorScheme: mode,
        reducedMotion,
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          /hydration|didn't match|does not recognize/i.test(message.text())
        )
          errors.push(message.text());
      });
      for (const width of [320, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(base, { waitUntil: "domcontentloaded" });
        if (await page.getByRole("button", { name: "Skip intro" }).count())
          await page.getByRole("button", { name: "Skip intro" }).click();
        await page.locator("[data-brand-wordmark]").waitFor();
        await page.evaluate(() => document.fonts.ready);
        if (data.props.pageProps.currentBook)
          await expect(
            page.getByText(data.props.pageProps.currentBook.title, {
              exact: true,
            }),
          ).toBeVisible();
        const shelf = page.getByRole("region", { name: "On the bookshelf" });
        const trigger = shelf.getByRole("button", {
          name: "Take a book",
          exact: true,
        });
        if (reducedMotion === "no-preference") {
          await page.evaluate(() => {
            window.__initialCoverOpacity = null;
            const observer = new MutationObserver(() => {
              const cover = document.querySelector("[data-book-cover]");
              if (cover) {
                window.__initialCoverOpacity = cover.style.opacity;
                observer.disconnect();
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });
          });
        }
        await trigger.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog", {
          name: "A page from the shelf",
        });
        await expect(dialog).toBeVisible();
        const openBook = dialog.locator("[data-open-book]");
        await openBook.waitFor();
        const first = await openBook.getAttribute("data-open-book");
        const record = data.props.pageProps.shelfBooks.find(
          (book) => book.slug === first,
        );
        await expect(
          dialog.getByRole("heading", { name: record.title, exact: true }),
        ).toBeVisible();
        await expect(
          dialog.getByText(record.excerpt, { exact: true }),
        ).toBeVisible();
        await expect(
          dialog.getByRole("link", { name: "Read my notes" }),
        ).toHaveAttribute("href", `/books/${encodeURIComponent(first)}`);
        if (reducedMotion === "reduce")
          assert.equal(await dialog.locator("[data-book-cover]").count(), 0);
        else {
          assert.equal(
            await page.evaluate(() => window.__initialCoverOpacity),
            "1",
            "Cover begins visibly closed on the first opening",
          );
          await expect(dialog.locator("[data-book-cover]")).toHaveCSS(
            "opacity",
            "0",
          );
        }
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press("Tab");
          assert.ok(
            await dialog.evaluate((el) => el.contains(document.activeElement)),
            "Dialog traps keyboard focus",
          );
        }
        for (let i = 0; i < 4; i++) {
          const previous = await openBook.getAttribute("data-open-book");
          await dialog.getByRole("button", { name: "Take another" }).click();
          await expect
            .poll(() => openBook.getAttribute("data-open-book"))
            .not.toBe(previous);
        }
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          )
          .toBe(true);
        const bounds = await dialog.boundingBox();
        assert.ok(
          bounds.x >= 0 && bounds.x + bounds.width <= width + 1,
          "Book fits viewport",
        );
        await page.screenshot({
          path: `${artifactDir}/open-${width}-${mode}-${reducedMotion}.png`,
          fullPage: true,
        });
        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
        await expect(trigger).toBeEnabled();
        await shelf.screenshot({
          path: `${artifactDir}/shelf-${width}-${mode}-${reducedMotion}.png`,
        });
      }
      console.log(
        `PASS ${mode} ${reducedMotion}: four widths, draw/open/another, focus/close, current read`,
      );
      // A preference change during the pull must never leave the button disabled.
      if (reducedMotion === "no-preference") {
        await page
          .getByRole("button", { name: "Take a book", exact: true })
          .click();
        await page.emulateMedia({ reducedMotion: "reduce" });
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.getByRole("button", { name: "Close book" }).click();
        await expect(page.getByRole("dialog")).toBeHidden();
      }
      await context.close();
    }
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  for (const books of [[], [data.props.pageProps.shelfBooks[0]]]) {
    const pattern = `**/_next/data/${data.buildId}/index.json*`;
    await page.route(pattern, (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          pageProps: {
            ...data.props.pageProps,
            shelfBooks: books,
            currentBook: null,
          },
          __N_SSP: true,
        }),
      }),
    );
    await page.goto(base + "/about");
    await page.locator("[data-brand-wordmark]").waitFor();
    await page.evaluate(() => window.next.router.push("/"));
    const trigger = page.getByRole("button", {
      name: "Take a book",
      exact: true,
    });
    if (!books.length) {
      await expect(trigger).toHaveCount(0);
      await expect(
        page.getByText("My reading list", { exact: true }),
      ).toBeVisible();
    } else {
      await trigger.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Take another" }),
      ).toHaveCount(0);
      await page.getByRole("link", { name: "Read my notes" }).click();
      await expect(page).toHaveURL(`${base}/books/${books[0].slug}`);
      await expect(page.getByRole("dialog")).toHaveCount(0);
    }
    await page.unroute(pattern);
  }
  for (const path of [
    "/about",
    "/articles",
    "/books",
    "/articles/make-time-for-it",
    "/books/deep-work",
  ]) {
    assert.equal((await page.goto(base + path)).status(), 200);
    await page.locator("h1").waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    );
  }
  assert.deepEqual(errors, [], "Runtime/hydration errors");
  console.log(
    "PASS empty/single shelves, notes navigation, related routes; no runtime/hydration errors",
  );
} finally {
  await browser.close();
}
