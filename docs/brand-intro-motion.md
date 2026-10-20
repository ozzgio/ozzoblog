# Brand intro motion

Scope: the first homepage visit in a browser session. The sequence reuses the existing SVG Z, brand colors, session guard, shared navbar transition, skip control, and reduced-motion handling. No dependencies or editorial data contracts change.

Sequence: word (1.5s), letter fusion (1.1s), enclosed Z hold (0.35s), logo with rotating orange rim (1.4s), page/nav reveal (1s). The page loads underneath the overlay; the rim indicates the intro transition rather than network progress. Both Zs overlap at the center and both Os expand to enclose them. Duplicate shapes fade once aligned. Only the orange rim rotates on the final logo.

## Coverage matrix

Browser: local Chromium, production build at `http://localhost:3187`. Intro artifacts: `/tmp/ozzo-intro`. General page artifacts: `/tmp/ozzo-ui`.

| Surface/state | Viewports | Themes | Verification |
| --- | --- | --- | --- |
| `/`: word, fusion, Z inside O, rotating rim, reveal | 320, 390, 1280 | light, dark | `verify:intro`: phase sequence, aligned duplicates, larger enclosing O, stationary Z, changing rim transform, screenshots |
| `/`: skip button / Escape in all four active phases | desktop | light | `verify:intro`: cancel timers, restore scroll and content access |
| `/`: repeat visits, reduced motion, live preference change, blocked storage | desktop + repeat visits at all sizes | light + repeat visits in both themes | `verify:intro` |
| `/projects` → `/`: direct entry / client navigation | desktop | light | `verify:intro`: no unexpected intro |
| `/`, `/about`, `/articles`, `/books`, `/projects`, `/contacts`, `/experience`, `/newsletter/pending`, `/newsletter/confirmed`, 404 | 320, 390, 1280 | light, dark | `verify:ui`: shared layout, newsletter marks, overflow, theme, contrast |
| All 11 local `/projects/<id>` pages | 320, 390, 1280 | light, dark | `verify:ui`: shared layout, images, typography |
| Article/book detail templates | 320, 390, 1280 | light, dark | `verify:ui`: first, shortest-title, longest-title, and missing-image records when available; external records are unbounded |
| Listings: empty/error/filter/sort; newsletter: validation/loading/error/success; navigation menu/theme | 320, 390, 1280 | light, dark | `verify:ui`: existing mocked state coverage, no real newsletter submission |
| `/embed/projects/<id>`, RSS, API endpoints, server error page | skipped | skipped | These do not render the changed intro or moon mark; no server behavior changed |
| Firefox, Safari, physical devices | skipped | skipped | Local Chromium checks only; native browser/device review remains available |

Run with a server at `TARGET_URL` and optionally `BROWSER_EXECUTABLE_PATH` pointing to a local Chromium executable:

```sh
npm run lint
npm run build
npm run verify:intro
npm run verify:ui
```

Validation: production build and lint passed (four existing lint warnings). The complete intro suite passed at all three widths in both themes, including dismissal in every phase, reduced motion, repeat visits, direct entry, and blocked storage.

The full `verify:ui` suite also passed: all 27 selected public routes before hydration and at 320/390/1280px in both themes; filters, keyboard menu, saved theme, fallback images, mocked article/book empty/error states, and newsletter validation/loading/error/success. No browser runtime errors or real form submissions.
