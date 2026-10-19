Scope: edit the blog's locally authored interface copy in the ongoing Chakra migration. Use plain first-person English, specific labels, and short sentences without em dashes. Keep the existing author facts, newsletter cadence, project descriptions, and external editorial text. No layout, data, or subscription changes.

| Surface/state | Coverage plan | Result |
| --- | --- | --- |
| Home, About, Articles, Books, Projects, Contacts | 320/390/1280, light/dark; text, links, overflow | Pass: full route sweep, screenshots, contrast, filters and keyboard menu |
| Shared newsletter | Copy checked on Home, About, article detail; native validation, loading/error/retry/mocked success on Home | Pass: all consumers show the weekly note description; existing subscription checks pass |
| Shared metadata and logo | All public routes; new description/accessible name; intro checks | Pass: SEO and intro checks, including keyboard focus, skip, repeat visit and reduced motion |
| Newsletter pending/confirmed | Both themes, all three widths; confirmation copy | Pass: included in route sweep |
| Book/article details | Representative dynamic templates, including short/long titles; external text preserved | Pass: route sweep and contrast; no editorial text changes |
| 11 project detail pages, background, 404 | Full shared consumer sweep; original project and career facts retained | Pass: all public/local routes at three widths in both themes |
| 11 project embeds | Generated title text checked; visual embed behavior unchanged | Pass: all 11 return 200 and use the updated title; interaction tests skipped because only the document title changed |
| RSS | Channel description/title; existing item content and links retained | Pass: exact channel copy and SEO/RSS health checks |
| Empty/loading/error states | Existing UI checks; updated Home/About wording checked with fixtures | Pass: Home/About empty/error fixtures at three widths in both themes; listing empty/error and newsletter states pass |
| Safari/physical devices, forced fatal 500, real subscriptions, deployment | Skipped: local Chromium and mocked requests; no layout or behavior changes | Skipped |

Route inventory and previous visual baseline: [notebook design direction](notebook-design-direction.md). External article and book prose remains owned by portfolio-data; the frontend does not rewrite it during rendering. Date-range en dashes and source-code comments are outside the copy edit.

Result: removed em dashes from locally authored UI text, document titles, and the logo's accessible label. Replaced the repeated demand/delivery/distribution positioning with a first-person description of the projects, books, and writing. Shortened newsletter copy and clarified confirmation steps, page introductions, and empty states. RSS, structured descriptions, and social/search metadata follow the same voice. Updated the intro verification script for the new accessible logo name.

Validation: production build and lint passed (four existing warnings, zero errors). Prettier and `git diff --check` passed. The full UI check passed 162 route/viewport/theme combinations plus first-render contrast and interaction/state checks, with no browser runtime/hydration errors. Additional checks cover all embed titles, the RSS channel, every newsletter copy consumer, and 24 Home/About empty/error combinations. Screenshots were visually inspected on Home and About at 320px and Home at 1280px. No new dependencies or application behavior changes.

Artifacts: `/tmp/ozzo-copy-{build,lint,ui,intro,seo,states}.log`, `/tmp/ozzo-copy-ui/`, `/tmp/ozzo-copy-states/`, `/tmp/playwright-test-copy.js`. Local preview rebuilt and running detached on port 3167. No commit or production deployment.
