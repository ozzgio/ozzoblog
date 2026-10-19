Scope: continue the existing local Chakra migration in the session-owned checkout. Match article archive tags to the regular book-card tags, and make the newsletter controls respond to their containing form. No global theme, routing, data, or subscription behavior changes.

| Surface/state | Coverage | Result |
| --- | --- | --- |
| Article archive + Books reference | 320/390/480/600/768/1280, light/dark; computed tag colors/shape/size, filters | Pass: archive tags exactly match regular book tags; keyboard topic selection/reset works on both listings |
| Home newsletter | Same widths/themes; pristine/filled; validation/loading/error/retry/mocked success at 768px both themes | Pass: narrow-card controls stack at full width; email-to-submit keyboard path works |
| About + article detail newsletter consumers | Same widths/themes; container layout; all form states at 768px both themes | Pass: controls fit; wide forms use one row; native validation, disabled loading and retry retained |
| Article/book details | Make Time for It / Deep Work, same widths/themes; tag wrapping and overflow | Pass: no overflow or runtime/hydration errors |
| Other public routes: Projects + 11 details + 11 embeds, contacts, experience, newsletter confirmations, 404 | Skipped this delta: no changed component consumers; prior notebook design coverage retained |
| Missing/long content, empty/error listings, nav/footer/intro | Skipped this delta: data, content rendering and shared shell unchanged; prior coverage retained |
| Physical MacBook/Safari, actual subscription delivery, production | Skipped: local Chromium with mocked subscription requests; no deployment |

Route inventory and previous full-surface verification: [notebook design direction](notebook-design-direction.md). Newsletter callers: Home, About, article detail. ArticleCard caller: article archive only. Book cards and detail tags are references; their rendering stays unchanged.

Implementation: article-card tags reuse the book-card semantic orange colors, pill radius, font size and padding. The newsletter form establishes an inline-size container; its control grid switches from a full-width column to an input/button row only above 28rem of available form width. This accommodates the homepage sidebar independently of the screen breakpoint.

Validation: production build passed; lint passed with the four existing warnings, no errors; Prettier and `git diff --check` passed. Chromium checked 72 route/viewport/theme combinations and all form states on each consumer, with no real requests to the subscription service. Visual inspection included the 768px light homepage sidebar, 320px dark homepage, and article archive. Preview restarted detached on port 3167.

Artifacts: `/tmp/playwright-test-tags-newsletter.js`, `/tmp/ozzo-tags-newsletter/`, `/tmp/ozzo-tags-newsletter-{build,lint,browser}.log`. No new dependencies, commits, or production deployment.
