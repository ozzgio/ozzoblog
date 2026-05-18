# AGENTS.md - portfolio

Operational guide for coding agents working in this repository.

## Mission

Maintain the public frontend for `ozzo.blog`: homepage, projects, articles, books, and contact-oriented presentation.

This repo is a presentation layer. It is not the authoring location for long-form content.

## Session startup

Read before editing:

1. `README.md`
2. `pages/index.js`
3. `pages/projects.js`
4. `pages/articles.js`
5. `pages/books.js`
6. `libs/projectData.js`

Then inspect the specific page/components relevant to the task.

## Source of truth

- Public editorial data comes from `portfolio-data`, fetched from GitHub raw URLs.
- Project cards are defined locally in `libs/projectData.js`.
- This repo should not become a second content-management system.

## Non-negotiables

- Do not move article/book content authoring into this repo.
- Preserve graceful handling when external JSON fetches fail.
- Treat the site as public and user-facing: prioritize build stability, SEO, and mobile behavior.
- Keep the visual language coherent with the existing site unless a redesign is explicitly requested.

## High-signal areas

- `pages/index.js`: homepage narrative and positioning
- `pages/projects.js`: local project catalog UI
- `pages/articles.js`: article listing fed by `portfolio-data`
- `pages/books.js`: book listing fed by `portfolio-data`
- `pages/rss.xml.js`: feed generation from external article data

## Verification

Use the repo's normal checks when relevant:

```bash
npm run lint
npm run build
```

For content-related tasks, verify both articles and books pages because they depend on external JSON contracts.

## Codex code review guidelines

When reviewing pull requests, focus on high-signal issues that can break production, weaken quality, or create user-facing regressions. Avoid commenting on trivial style preferences unless they hide a real bug.

Flag as high priority:

- changes that can break `npm run build`, `npm run lint`, or Vercel deployment
- runtime errors in Next.js pages, data fetching, routing, SEO metadata, or RSS generation
- regressions in mobile responsiveness, dark mode, accessibility, or navigation
- unsafe assumptions around external `portfolio-data` JSON shape, missing fields, failed fetches, or unavailable images
- changes that move article/book authoring concerns into this presentation repo
- project-card changes that make `libs/projectData.js` inconsistent with the UI
- dependency changes that are unnecessary, risky, or incompatible with the current Next.js/React stack
- secrets, tokens, private URLs, vault-private content, or personal data accidentally committed
- missing tests or manual verification notes for behavior that affects public pages

For comments:

- explain the concrete risk
- point to the affected file or behavior
- suggest a practical fix when possible
- keep feedback concise and actionable
