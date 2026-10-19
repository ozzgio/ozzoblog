# Writing-first homepage and visual feedback

Follow-up: the moon has returned to Home and the layout has been refined from the owner’s other interfaces. See [the current notebook design](notebook-design-direction.md).

The homepage now leads with the newest essay, five recent entries, and the newsletter. Books and projects remain discoverable below the writing. The former homepage, including the moon scene, positioning, and biography, lives at `/about`; About replaces Source Code in the navbar. `/experience` retains the detailed work history. Both home and About reuse the existing external-data loader in `libs/homeData.js`, with independent fallbacks for article and book fetches.

The navbar uses a typographic `ozzo.` wordmark while keeping the intro landing transition and route-change pulse. The Projects shell is capped at 64rem instead of 75rem, preserving its content and catalog structure. Books uses at most two columns, full titles/authors/summaries, and small portrait thumbnails rather than full-height image panels. Landscape source photos are cropped to the same 2:3 frame; detail-page source images are unchanged.

Dark-mode text previously hydrated with different Emotion classes from the server, leaving some light-theme colors in place until a theme toggle. Main text, card metadata, quotes, tables, filters, and newsletter colors now use CSS semantic tokens. Remaining JavaScript theme consumers use a hydration snapshot so the initial client render matches the server before reading the selected theme. No dependencies or editorial content were added.

Boundary: this repository's current working tree, production preview on NUC port 3167. Browser coverage uses local Chromium; the MacBook's configured SSH address was unreachable. Article/book content remains in portfolio-data.

| Surface/state | Coverage | Result |
| --- | --- | --- |
| Home and About | 320/390/1280, light/dark; writing order, biography, moon scene, newsletter, canonical metadata | Pass: full route sweep plus focused layout checks |
| Books listing | 320/390/768/1280, both themes; complete titles, author width, uniform thumbnails, featured/standard cards | Pass: full route sweep plus focused layout checks |
| Articles and books | Native search, tags, sort/reset, empty/error fixtures | Pass: full route sweep plus focused layout checks |
| Article/book details | Short/long/newest records; prose/link colors and shared layouts | Pass: full route sweep plus focused layout checks |
| Projects and all 11 local details | 320/390/1280, light/dark; narrower catalog, media, links | Pass: full route sweep plus focused layout checks |
| Contact, background, newsletter confirmation pages, 404 | 320/390/1280, both themes; shared navigation and colors | Pass: full route sweep plus focused layout checks |
| Before hydration | All discovered public routes, both themes, 1280; headings, prose, links | Pass: all 27 routes in both themes, with application JS blocked |
| Navbar, footer, intro | Menu keyboard navigation, saved/system theme, skip/repeat/reduced motion and disabled storage | Pass: intro, menu, focus, saved/system theme and direct visits |
| All 11 project embeds | Metadata, poster/frame headers, 640/1280/320/390, keyboard, sandbox | Pass: all 11 embeds, every listed width, sandbox/no-JS and keyboard checks |
| Build, lint, content-fetch failure, Markdown, SEO/RSS/sitemap | Normal checks plus home/About upstream failure assertions | Build/SEO/Markdown/fetch failures passed; lint has four pre-existing warnings |
| Isolated missing-media/Markdown fixture build | Skipped this pass: its runner replaces the active production build; renderer structure is unchanged, real edge records and Markdown rendering assertions were checked | Skipped |
| Fatal 500, real submissions, publishing, Safari/Firefox/physical devices | Not exercised: no forced crash, mocked newsletter requests, local Chromium only, local preview requested | Skipped |

Evidence: `/tmp/ozzo-feedback-*.png`, `/tmp/ozzo-feedback-ui/`, and `/tmp/ozzo-feedback-{build,lint,ui,intro,players,seo}.log`. Focused geometry checks are in `/tmp/playwright-test-feedback-current.js`. Persistent route checks in `scripts/verify-ui.mjs` now include readable server-rendered headings/prose/links, contrast after hydration, complete book titles and consistent portrait frames. The intro script checks the new navbar wordmark. The SEO script includes `/about`.

Environment note: the NUC root disk filled during verification. The generated dev cache was moved from `.next/dev` to `/tmp/ozzo-feedback-dev-cache`, preserving it and restoring roughly 0.9 GiB of free space after also moving the generated build cache to `/tmp/ozzo-feedback-build-cache`. The verification script was restored and linted after a failed write; application sources and the production preview remained intact. Disk cleanup beyond these generated task artifacts remains outside this pass.

Final verification: the route sweep passed all 27 routes at 320/390/1280 in both themes (162 combinations), plus both-theme pre-hydration contrast checks. It exposed light-theme error text at 4.44:1, fixed by changing the shared error token to red.700. After the final build, the affected article/book error and newsletter loading/error/retry/mocked-success checks were rerun using the same state-check section of `verify-ui.mjs` (`/tmp/ozzo-feedback-state-checks.mjs`, log `/tmp/ozzo-feedback-states.log`), and the homepage was rechecked at 320/390/768/1280 in both themes, including 44px essay-link targets. No runtime/hydration errors were recorded. The final build, targeted lint, content-fetch failure assertions and SEO checks passed; the full lint run has the four existing warnings.
