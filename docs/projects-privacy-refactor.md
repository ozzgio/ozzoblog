# Projects and privacy refactor

Problem: the catalog prioritizes a journal over the two main products, feels cramped on wide screens, and exposes the author's legal name. Shared navigation and footer colors also use a JavaScript theme fallback that can paint text too dark on first load. Bio links inherit a negative indent, while book covers lack a stable frame.

Plan: use Ozzo throughout public presentation and metadata; remove contact URLs carrying the legal name; use a font-independent, larger Z. Move navigation and footer colors to CSS semantic tokens. Replace the bio hanging indent with a responsive date/prose grid and keep its links inline. Give book covers a bounded frame with `object-fit: contain`, matching the uncropped project artwork. Give Projects its own wider container with two featured product cards, single-column on phones and two columns on larger screens, followed by smaller tool cards and a compact earlier-work list. Each full card links to its product or project story with sibling links for further details. Write first-person notes about the problem and learning, rather than effort scores or a stack inventory.

Reference: [marclou.com](https://marclou.com/) for a scannable, product-first catalog. Keep the blog's existing paper/ink/orange palette and article typography. Reuse the existing One Nil project record, page, and artwork from the local feature worktree.

Referral links will carry `ref=ozzo.blog` and standard UTM source/medium/campaign/content values, without personal identifiers. They attribute visits in the destination's analytics; they do not install an analytics service or send click events by themselves.

| Surface/state | Coverage | Outcome |
| --- | --- | --- |
| Shared name/author/contact output | Public source plus 505 generated HTML/JSON/browser artifacts; both project inboxes | Pass: Ozzo, X/GitHub handles and project emails; no former identity matches |
| Navbar and logo | Direct article visits with system/saved dark theme, first paint with app JS blocked, keyboard/menu, reduced motion, small logo and intro | Pass; larger vector Z is independent of reset/font loading |
| Projects catalog | 320/390/768/1280/1536, both themes, hover/focus, card-edge click, private/missing URLs | Pass: 11 records, Synergym/One Nil first; desktop width grows; product opens in new tab, notes link remains separate |
| All local project details including One Nil | All 11 at 320/390/1280, both themes, links/images/metadata | Pass |
| All project players | All 11 at 640/1280/320/390, scoped frame permissions, raster posters, tabs/keyboard, sandbox/no-JS fallback | Pass |
| Homepage | Updated priorities and links; six bio rows at 320/390/768/1280/1536, both themes | Pass: product order, no overlapping date/prose, links inline with zero indent |
| Books image frames | All 12 covers at 320/390/768/1280/1536, both themes; portrait and landscape sources, featured and compact cards | Pass: loaded, contained in frame, original proportions |
| Articles/books and remaining public routes | 26 routes at 320/390/1280, both themes; six edge article/book records; native search/tags/sort, keyboard menu, saved theme; mocked loading/empty/error/newsletter validation/retry/success | Pass: no runtime or hydration errors |
| Referral URL helper | Existing query/hash, exact attribution, internal/non-web URLs, destination link coverage | Pass: home, catalog, details, players, sources and experience; canonical/share URLs stay clean |
| Build/lint and applicable browser scripts | Normal repository checks, including final footer token rebuild | Pass: build, lint (four existing warnings), referral assertions, intro, players, UI, Markdown, fetch-failure fixtures and SEO |
| Deployment, erasing external profiles/search caches/history, live destination conversion analytics, Safari/Firefox/physical devices | Not performed by this local source change | Skipped |

The final footer uses semantic tokens too. A separate check visits the same 26 routes at 320/390/1280 in both themes with app JavaScript blocked, verifying readable text and link colors before hydration. Its script is `/tmp/playwright-test-footer-colors.js`.

Verification evidence: `/tmp/ozzo-feedback` contains the five-width light/dark Projects, bio and Books screenshots, keyboard focus captures and direct article first-paint captures. The focused browser matrix is `/tmp/playwright-test-project-feedback.js` (its five-width visual/image matrix passed; its original saved-theme fixture was corrected and rerun separately); the corrected saved-preference fixture and actual card click/focus checks are `/tmp/playwright-test-article-first-paint.js` and `/tmp/playwright-test-feedback-interactions.js`. The saved theme key is `chakra-ui-color-mode`. The scripts mock product navigation and newsletter submissions; they do not contact customers or publish posts.

Public product emails are `hello@synergym.app` and `hello@onenil.org`; no-reply addresses are not contact actions. The One Nil repo remains private and its internal URL is absent from public output. Existing public profiles, repository history, search indexes and already-deployed versions are outside this source change.

Additional checks passed: `npm run verify:project-referrals`, `verify:intro`, `verify:players`, `verify:ui`, `verify:markdown`, `verify:detail-generation`, and the SEO health script against port 3167. Fetch failures in the detail-generation test are intentional fixtures. Lint has no errors and four existing warnings (three native image elements and the article date hydration guard).
