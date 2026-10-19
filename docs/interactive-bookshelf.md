Scope: add a random-book interaction to the homepage bookshelf in the existing Chakra migration. Keep the current read visible. Draw only from external finished-book data with real reading notes; open a page of the author's notes, with a link to the full book page. No copied book pages, editorial authoring, dependencies, or automatic motion on page load.

| Surface/state | Planned checks | Result |
| --- | --- | --- |
| Home shelf | 320/390/768/1280, both themes; current read, long titles, pull animation | Pass in both motion settings; Carnegie remains visible below the shelf |
| Open book | Same widths/themes; cover opening, another pick, full-notes link | Pass: visible first cover before the flip, four consecutive new picks per combination, full-notes destination |
| Keyboard/dialog | Enter, focus trap, Escape, close, focus return | Pass: Enter opens, tab stays in the dialog, closing returns focus to the enabled shelf button; new content uses a polite live region |
| Reduced motion | Direct open without pull/flip; live preference change | Pass: no decorative cover in reduced motion; switching preference mid-pull never leaves a disabled control |
| Data edges | No books, one book, malformed optional fields, missing current read, upstream failure | Pass: SSR contracts for Home/About, optional concept/lesson/notes fallbacks, duplicate/paused/malformed filtering, empty/single browser fixtures |
| Random selection | Empty/single book, all alternatives reachable, no immediate repeats | Pass: deterministic edge/reachability assertions and repeated browser draws |
| About | Shared homepage loader adds only compact shelf data; current read and newsletter retained | Pass: shared loader contracts; browser layout at 390px light; other appearances retained from the copy-edit baseline because About markup/styles are unchanged |
| Articles/Books + representative details | Data contract/navigation and layout regression | Pass: all return 200 without overflow at 390px light; other appearances retained from the unchanged listing/detail baseline |
| Short viewports | 320×568 and 640×360; long title/passage, scroll and close/another controls | Pass: close button in view, another pick reachable, Escape/focus return, live region and no horizontal overflow |
| Projects + 11 details, contacts, background, confirmations, 404, 11 embeds, intro/nav/footer/newsletter states | Skipped for this delta: no shared shell, metadata, renderer, or form changes; retain copy-edit verification baseline |
| Real devices/Safari, live submissions, publication | Skipped: local Chromium and mocked requests only | Skipped |

Previous whole-site verification: [copy edit](copy-edit.md). New shared consumers: Home uses the shelf component; Home/About use the data loader. Existing book lists and detail pages continue to use their original data contracts.

After a production build, with the preview running, verify this interaction with `TARGET_URL=http://localhost:3167 node scripts/verify-bookshelf.mjs`. Set `BROWSER_EXECUTABLE_PATH` when using an existing Chromium installation. The check covers the server data loader as well as the browser interaction.

Implementation: `components/bookshelf.js` renders semantic neutral/orange spines and uses the existing Framer Motion library for the pull and a 480ms CSS-3D cover opening. Chakra's dialog provides focus trapping, dismissal and scroll management. Mobile uses a single readable page with a narrow gutter; desktop uses a book spread. Selection excludes the immediately previous book, with sensible empty/single-book behavior. No modal opens automatically on page load.

The shared loader sends only slug, title, author and a maximum 420-character excerpt per eligible book. Excerpts prefer the published concept section, then the existing key lesson, then a parsed note section. This keeps the interaction useful while avoiding sending complete book notes in homepage props. The same external `portfolio-data` source and existing failure handling remain in place.

Verification: production build passed; full lint passed with four existing warnings, and targeted lint/Prettier/diff checks passed. The final interaction suite passed all 16 viewport/theme/motion combinations, data/selection checks, keyboard/dialog behavior, live preference changes, empty/single shelves, and related routes without runtime/hydration errors. Additional short-viewport checks passed. Screenshots visually inspected on the narrow shelf, desktop spread, and mobile dark page.

Artifacts: `scripts/verify-bookshelf.mjs`, `/tmp/ozzo-bookshelf/`, `/tmp/ozzo-shelf-{build,lint,checks}.log`. Preview runs detached on 3167 with the existing loopback books data override on 3168, keeping the previously requested Carnegie reading entry. No dependencies, editorial source changes, commits of the frontend migration, or live deployment.
