Scope: continue the session-owned Chakra migration and existing local preview. References are read-only: Money's synthetic screenshots and interface CSS; One Nil's brand guide and ruled-row screens; Buildlog's feed and Synergym's semantic panels. No reference application behavior, private finance data, dependencies, or content authoring moves into the blog.

Direction: a personal publication with a compact product interface. One signature illustration (the existing interactive moon), strong typographic hierarchy, quiet shared surfaces, compact ruled archives, neutral controls, orange used for wayfinding. Keep the approved ozzo. wordmark and Projects catalog content.

| Surface/state | Coverage planned | Result |
| --- | --- | --- |
| Home | 320/390/768/1280, light/dark, moon drag/reduced motion, newsletter | Pass: compact moon/identity header, latest essay above 600px, balanced writing/sidebar panels; canvas drag and reduced motion |
| About | 320/390/1280, both themes | Pass: moon moved to Home; biography and narrative retained |
| Articles | 320/390/1280, both themes, title edge records/search/tags/sort/empty/error | Pass: compact introduction, full-title archive rows, all filter/empty/error checks |
| Books | 320/390/1280, both themes, covers/titles/filters/empty/error | Pass: repeated labels/counts removed; all portrait frames, titles and filters fit |
| Book detail reading arc | 320/390/768/1280, both themes, all steps | Pass: one 32px grid column; icon/marker/rail centres within 0.5px at all four widths in both themes |
| Article/book detail templates | Newest/shortest/longest titles, 320/390/1280, both themes | Pass: representative detail typography, content and contrast; surrounding blank padding reduced |
| Projects + 11 local details, contacts, background, confirmations, 404 | Full public route sweep, 320/390/1280 both themes | Pass: all 27 public/local-detail routes at 320/390/1280 in both themes; no runtime/hydration errors |
| Nav/footer/intro | Keyboard, saved/system themes, reduced motion | Pass: wordmark retained; common navbar width; keyboard, saved theme and complete intro checks |
| 11 embeds | Shared theme unchanged; no shell or embed edits | Retained previous session’s complete player checks; no embed or shared-theme changes in this pass |
| Failure/loading/form states | Mocked requests only, all three widths/both themes | Pass: upstream failures, listing empty/error, newsletter required-email validation/loading/error/retry/mocked confirmation |
| Physical devices/Safari/Firefox, actual submissions, publication, forced fatal 500 | Skipped: local Chromium and mocked requests only | Outside local design pass |

Reference evidence:
- Money: `src/style.css`, `src/components/PrivateApp.tsx`, and its synthetic `docs/screenshots/desktop.png`: restrained neutral surfaces, a single strong headline, compact related controls, readable rows, icon-led secondary actions.
- One Nil: `docs/brand.md` and its group screen: ruled rows, literal labels, typographic hierarchy before extra color, and a recognizable brand detail.
- Buildlog: its feed and `app/assets/tailwind/application.css`: a personal publishing identity, distinct display/reading type, and related information grouped into useful panels.
- Synergym: semantic surface/theme tokens: light/dark consistency and distinct raised surfaces rather than one undifferentiated page.

The inferred common taste is compact and useful rather than empty: a clear primary subject, strong type, grouped controls, quiet borders, and one recognizable visual identity. The blog keeps its existing wordmark, orange accents and Three.js moon, and uses its installed Bricolage/Playfair/reading fonts. Reference application data and assets were not copied into public output.

Implementation reaches Home, About, the article archive/card, the bookshelf introduction/featured card, book timeline, surrounding detail-page padding, shared navbar width, newsletter button, footer spacing, and route checks. Article/book fetching, public routes, Markdown/SEO/RSS, newsletter handling, the Projects catalog, theme persistence and intro behavior are retained. The homepage remains a public-data presentation layer.

The reading arc uses a 32px marker column at every viewport. Each connector is drawn on that column's centre and ends at the next marker; icons share the marker centre. Headings and note bodies occupy a separate flexible column. Geometry assertions cover both icon-to-marker and marker-to-rail alignment.

Artifacts: `/tmp/ozzo-direction-{width}-{theme}-{route}.png`, `/tmp/ozzo-direction-ui/`, `/tmp/ozzo-direction-{build,lint,ui,intro,focus,data,seo}.log`, and `/tmp/playwright-test-direction.js`. The previous session's generated caches remain preserved in `/tmp`; this pass additionally moved the generated build cache to `/tmp/ozzo-direction-build-cache` to avoid filling the NUC root disk.

Final validation: production build passed, full lint had no errors and the four existing warnings, and SEO/RSS/sitemap plus upstream-data failure checks passed. The shared route sweep covered 162 route/viewport/theme combinations, and both-theme first-render contrast passed with application scripts blocked. The focused visual/geometry sweep covered Home, Articles, Books, Deep Work and About at 320/390/768/1280 in both themes. After moving the newsletter into the desktop sidebar and allowing its fields to wrap naturally, the final build was checked again on Home, About and article detail at all four widths, with a readable email-field width assertion; all mocked listing/newsletter states passed again. These final checks are in `/tmp/playwright-test-direction-final.js` and `/tmp/ozzo-direction-{final-home,states}.log`.

The reference applications were inspected for appearance only. Physical Safari/Firefox/device behavior, actual newsletter/social submissions, a forced fatal 500, and a separate missing-media/Markdown fixture build were not exercised. Existing renderer/fetch logic and project embeds were preserved; the prior session’s Markdown and player checks remain the baseline. No commits, reference-repository edits, new dependencies, or production deployment were made. Preview: `http://localhost:3167`.
