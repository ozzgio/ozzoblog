# Chakra 3 migration and visual refactor

Scope: migrate the existing Next.js/React site to Chakra UI 3.37.0 and improve its shared editorial presentation. Preserve public URLs, SEO/RSS, external portfolio-data contracts and failure handling, newsletter behavior, reduced-motion support, the slower moon-brand intro, social links, and all project Player Card previews. No Web Components rewrite, new CMS, external posting, or deployment.

Before editing: existing screenshots in /tmp/ozzo-*.png cover available public routes at 320/390/1280, light/dark. Article/book detail rendering and production build were blocked by the stale local dependency installation (missing remark-gfm and older installed ESLint/Next/React). A source backup preserving all prior work is /tmp/ozzoblog-before-chakra3.tgz.

Visual plan: warm paper and dark ink surfaces, restrained orange accents, Bricolage display headings and existing reading fonts. Compact article/book introductions; clear filters; consistent image framing and calmer cards. Keep the moon/orbit mark as the signature graphic. Single-column mobile layouts and readable desktop text widths. Improve shared primitives before touching page composition.

| Surface/state | Intended verification | Outcome |
| --- | --- | --- |
| Home and introduction | 320/390/1280 light/dark, readable hold, skip, repeat, reduced-motion/live preference | Pass — `verify:intro`; all viewport/theme combinations and live preference/storage cases |
| Projects and all 10 local details | 320/1280 both themes; imagery, links, metadata | Pass — all 10 details and catalog at 320/390/1280, both themes; local images loaded |
| All 10 player embeds | 640x480, 1280 desktop, 320/390 touch; keyboard tabs, sandbox, posters, no shell | Pass — every project at 640/1280/320/390, sandbox/no-JS, fonts, posters and headers |
| Articles listing | 320/390/1280, search/sort/tags/reset/empty/error | Pass — native search/sort/tags/reset; empty/error fixtures at all three widths in both themes |
| Books listing | 320/390/1280, search/sort/tags/reset/empty/error, missing covers | Pass — filters and empty/error fixtures; cover proportions and featured/standard hover states |
| Article and book detail templates | Representative real and fixture records: long title, tables, code, Mermaid, missing media/metadata | Pass — six real edge records and isolated article/book table/Mermaid/optional-media fixtures |
| Experience, Contacts | 320/1280; social links and responsive content | Pass — all viewport/theme combinations; contact anchors and social links |
| Newsletter | Pristine/validation/loading/error and mocked success only; pending/confirmed pages | Pass — validation/loading/error/retry/mocked confirmation; loading/error screenshots at all widths/themes |
| Header/menu/theme/footer | Every normal route; keyboard focus, touch targets, saved/system theme and SSR | Pass — keyboard menu/open/Escape/navigation, focus return, system/saved theme and direct visits |
| 404/error, RSS, sitemap/SEO | Production/HTTP checks and relevant fixtures | Pass — 404, feed, sitemap and SEO; upstream error contracts. Fatal 500 response not forced |
| Build/lint/native/content/dependency checks | Repository checks | Pass — clean npm ci/lint/build; Markdown, data-failure and dependency checks; four existing lint warnings |
| Safari/Firefox/real devices, live X card rendering, actual newsletter/social submissions | Unavailable/not authorized; local Chromium and sandbox cover application behavior | Skipped |


Implementation follows the [Chakra 3 migration guide](https://chakra-ui.com/docs/get-started/migration) and [dark-mode integration](https://chakra-ui.com/docs/styling/dark-mode). The application uses `createSystem`, semantic colors and recipes, native input/select events, compound Menu/Tabs/List/Tag/Table APIs, and a small `next-themes` color-mode module. Removed the unused provider, Chakra icons, Emotion styled dependency, and unused Raleway font. Framer Motion remains a direct application dependency.

Shared fonts are included in the application entry and declared on the document root, so direct visits and portal content use the same fonts. Reading/canvas fonts load when needed; only brand/display fonts preload. Public generated media has CORS enabled for opaque sandbox origins. Frame permissions remain scoped to project embeds.

`verify:ui` visits all 19 normal/local-project routes and six external-content examples at each viewport/theme. Article examples cover the newest illustrated entry (`make-time-for-it`), a short title (`one-true-signal`), and a long title (`bounded-context-test-not-folder`). Book examples are `meditations-marcus-aurelius`, `deep-work`, and `fundamentals-of-software-architecture`. The isolated Markdown fixtures additionally cover absent covers/optional metadata, distinct social images, narrow/wide tables, and Mermaid math rendering. External content remains in portfolio-data.

Evidence: browser screenshots in `/tmp/ozzo-ui`; build/check logs in `/tmp/ozzo-chakra3-*.log`; isolated clean-install workspace `/tmp/portfolio-verify.2i1mwi`. These are local review artifacts, not site content.

Verification commands: `npm run lint`, `npm run build`, `npm run verify:native`, `npm run verify:markdown`, `npm run verify:markdown:presentation`, `npm run verify:detail-generation`, `npm run verify:dependency-compat`, `npm run verify:ui`, `npm run verify:intro`, `npm run verify:players`, and `BASE_URL=... node scripts/seo-health-check.mjs`. Browser scripts accept `TARGET_URL` and `BROWSER_EXECUTABLE_PATH`.

Known limits: lint reports four existing warnings (three intentional native-image uses and the article date hydration guard). Next reports the existing large article-list payload, which supports full-text search; this pass preserves that behavior. The unrelated lockfile above the repo produces a Next tracing warning. Chromium is the available browser; actual Safari/iOS/X rendering and real newsletter submissions remain outside this local verification. No deployment or social posting was performed.

Final outcome (2026-10-16): production build and all local checks passed. The complete route sweep covered 150 route/viewport/theme combinations. Focused failure-state checks additionally verified image errors before/after hydration, mocked listing errors and newsletter loading/error/retry in both themes at all three widths. The preview is served from the workspace on `127.0.0.1:3167`.
