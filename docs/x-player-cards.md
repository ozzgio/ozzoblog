# Project shares and X Player Cards

Checked 16 October 2026. This is implementation research, not a guarantee of X rendering or approval.

## What we can support

Build a small, public project experience on a dedicated embed route, with a good static poster and a normal project URL. Treat in-post interaction as an experiment and keep the project usable outside X. Rosebud's own engineering report, published 10 October 2026, reports successful interactive game embeds using Player Cards; it explicitly says inline play depends on X and the viewer's client. This is current firsthand implementation evidence, not an X platform commitment. [Rosebud engineering report](https://lab.rosebud.ai/engineering/making-rosebud-games-playable-in-x-posts)

## Verified first-party details

- X's sample landing page sets `twitter:card=player`, `twitter:site`, title, description, poster, player URL, width, and height. Its dimensions are **480 × 480**, so the suggested 640 × 480 is an example, not a universal requirement. The separate container is a responsive HTML video player. [Official page sample](https://github.com/xdevplatform/cards-player-samples/blob/main/player/page.html), [official container](https://github.com/xdevplatform/cards-player-samples/blob/main/player/container.html)
- X's current Cards policy requires HTTPS assets and cards that render across supported platforms. Audio/video needs stop or pause controls and muted autoplay. It prohibits circumventing a card's limitations or intended use, unrelated or misleading actions, unapproved third-party sponsored content, and monetary incentives. [Current X Developer Policy, X Cards](https://docs.x.com/developer-terms/policy#x-cards)
- Rosebud reports a dedicated embed route, X/Twitter framing permission, and card caching. Its implementation selects Player Cards for Twitterbot while preserving image cards for other consumers. This repository does not need that request-dependent complexity just to test one public project experience. [Rosebud implementation](https://lab.rosebud.ai/engineering/making-rosebud-games-playable-in-x-posts)

## Framing and sandbox

Use a **response header** on the embed route, for example:

```http
Content-Security-Policy: frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com
```

`frame-ancestors` does not work in a meta tag. Every ancestor must match; a nested third-party runtime needs its own compatible framing policy. An enforced `frame-ancestors` overrides `X-Frame-Options` in modern standards, but omitting conflicting `DENY` or `SAMEORIGIN` on the embed route avoids legacy conflicts. Do not remove framing protection throughout the entire site. [CSP specification, frame-ancestors](https://w3c.github.io/webappsec-csp/#directive-frame-ancestors)

Sandbox capabilities belong to the embedding page. HTML independently controls scripts, forms, popups, and same-origin access. A `_blank` link still needs popup permission; `fetch` is not a universal escape from sandbox, origin, or CORS restrictions. Prefer an anonymous, read-only demo with no form submission or login dependency. The current exact X sandbox token list was not established. [HTML iframe sandbox specification](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox)

## Corrections to the shared recipe

- **Use the final HTTPS hostname, not necessarily `www`.** A live HEAD request on 16 October returned 200 for `https://ozzo.blog/projects/buildlog`; `https://www.ozzo.blog/projects/buildlog` returned 307 to the apex URL. These URLs are our observed production responses, not an X rule. Use `https://ozzo.blog/...` in project, player, and poster URLs.
- **Keep important content above the bottom third on mobile as a design precaution.** No current first-party X specification was found establishing a fixed 30% overlay across mobile clients.
- **Do not promise instant card refresh.** Rosebud observes that X re-reads cached cards; no current official cache lifetime or refresh guarantee was verified.

## Eligibility and remaining uncertainty

Legacy official Player Card, troubleshooting, and getting-started URLs currently redirect to the generic docs overview. The current [documentation index](https://docs.x.com/llms.txt) does not establish a replacement Player Card approval process. The surviving official sample is video-oriented; the accessible current Cards policy does not explicitly repeat a linear-audio/video-only rule. Therefore this investigation cannot establish that a generic interactive project showcase is officially supported, nor conclude a current blanket prohibition from old documentation. Treat it as experimental, with a useful poster and direct project link when inline rendering is absent. [Legacy Player Card URL, now redirects](https://developer.x.com/en/docs/x-for-websites/cards/overview/player-card), [current Cards policy](https://docs.x.com/developer-terms/policy#x-cards)

Before calling it verified, deploy the HTTPS page, confirm crawler-visible metadata and deployed headers, then test an actual X post on desktop and the native mobile clients. Local browser framing tests verify our implementation, not X eligibility, crawling, caching, or client behavior.

## Local implementation

Every local project has its own draft copy (`shareText` in `libs/projectData.js`), so trainers, self-hosters, and developers can receive different messages. The draft remains editable before posting. Cards credit `@ozzgio` using `twitter:site` and `twitter:creator`.

Share the existing `/projects/<id>` page. Its server-rendered metadata points to `/embed/projects/<id>` with 640×480 dimensions and a raster poster. Embed pages render without the website shell on the server, expose Preview/Stack/About tabs, and open project/live/source links in a new tab. These are project showcases; actual apps open at their existing public URLs. Private and paused projects are described honestly in their drafts. No live app is placed in a nested iframe.

The embed pages require no account, storage, forms, remote data fetches, or API credentials. Touch layouts reserve the bottom third as a precaution for client overlays. Framing permission is scoped to the embed routes; their `noindex` metadata and sitemap exclusion keep them separate from the indexable project stories. No deployment or X post has been made.

### Verification coverage

| Surface/state | Coverage | Result |
| --- | --- | --- |
| All 10 project detail pages | Raw HTML player tags, @ozzgio attribution, raster posters, individual drafts and final canonical URLs | Passed local checks |
| All 10 embed pages | 640×480 desktop and 320px touch; keyboard tabs, correct live/private links, 44px targets, controls above the lower third | Passed local checks |
| All 10 detail + embed pages | 320px light and 1280px dark; 40 screenshots, no horizontal overflow | Passed |
| Additional mobile example | Buildlog at 390×844, screenshot and stack views | Passed |
| Anonymous sandbox | Scripts/popups allowed, forms and same-origin/storage access absent; keyboard/tab interactions | Passed |
| JavaScript disabled | Static project title and project link; no website shell | Passed |
| Missing embed ID | HTTP response | 404 as expected |
| Shared website layout | Home, projects, articles, books, experience, contacts, both newsletter result pages, 404 | Nine smoke checks passed |
| Existing homepage introduction | 320px, dismissal, content release, navbar restoration | Passed |
| Article/book detail templates and content variations | Shared Markdown renderer unchanged | Blocked by existing missing remark-gfm dependency in the local installation |
| Forms/newsletter submission, RSS/API behavior | No product behavior changed | Skipped; no submissions or API writes |
| Safari, Firefox, real devices, actual X cards, crawler cache refresh | Not available locally / not deployed | Not verified |

The reusable check is `TARGET_URL=http://localhost:3000 node scripts/verify-project-players.mjs`. If Playwright's default Chromium is not installed, set `BROWSER_EXECUTABLE_PATH` to an installed Chromium binary. Browser screenshots and the route results from this session are in `/tmp/ozzo-cards-*.png` and `/tmp/ozzo-project-card-surface-results.json`.

Targeted lint passes against the installed legacy toolchain. The normal `npm run lint` command currently fails because the installed ESLint/Next packages are older than the repository's flat-config setup. Production build verification remains subject to that mismatch and the already missing Markdown dependency; resolve the local installation before calling the whole site production-verified.

Final production-build attempt (`npm run build`) failed on the existing missing `remark-gfm` import, after also reporting the installed lint-version mismatch. Log: `/tmp/ozzo-project-cards-build.log`. The local preview was restored on `127.0.0.1:3167` for SSH forwarding. No dependency manifest or lockfile was changed.
