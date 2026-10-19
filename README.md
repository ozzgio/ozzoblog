# ozzo.blog

[![Production](https://img.shields.io/badge/Production-Live-00C58E?logo=vercel&logoColor=white)](https://ozzo.blog)
[![Preview](https://img.shields.io/badge/Preview-Available-999999?logo=vercel&logoColor=white)](https://devozzo-portfolio.vercel.app)

Ozzo's personal notebook: articles on building software, book notes, a project catalog, and a weekly newsletter. Built on Next.js and Chakra UI, with content sourced from an Obsidian vault through a public JSON layer.

---

## Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra--UI-319795?logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![Framer Motion](https://img.shields.io/badge/Framer--Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![React Markdown](https://img.shields.io/badge/React--Markdown-000000?logo=markdown&logoColor=white)](https://github.com/remarkjs/react-markdown)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)

---

## Running locally

```bash
git clone https://github.com/ozzgio/ozzoblog.git
cd ozzoblog
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Checks

```bash
npm run lint          # ESLint
npm run build         # Next.js production build
npm run verify:native # Verify native filesystem integration
```

The SEO health workflow (`.github/workflows/seo-health.yml`) runs on every PR and `main` push:
- Builds the site and starts `next start`
- Verifies `/rss.xml` returns 200 with a valid RSS envelope
- Verifies every URL in `public/sitemap.xml` returns 200
- Checks key pages carry all required SEO tags: `title`, `meta description`, `canonical`, `og:*`, `twitter:card`

## Security and quality automation

- Dependabot opens grouped weekly npm and GitHub Actions update PRs. Security updates are grouped separately from normal version updates.
- Dependency Health runs Dependency Review plus a full dependency audit on every PR and `main` push, and repeats weekly.
- CodeQL runs the JavaScript/TypeScript `security-and-quality` suite on PRs, `main`, and weekly.

---

## UI system and browser checks

The homepage pairs its interactive Three.js moon with the latest essay and recent writing. The former portfolio narrative and biography live at `/about`; `/experience` keeps the detailed work history. Book cards use two desktop columns, complete titles, and consistent portrait thumbnails (landscape photos are cropped in the listing).

The homepage bookshelf lets readers take a random finished book, open a page of Ozzo's reading notes, and take another without an immediate repeat. The current read stays visible below the shelf. See [the interaction and verification record](docs/interactive-bookshelf.md).

The site uses Chakra UI 3.37 with semantic light/dark colors in `libs/theme.js`, `next-themes` for the saved/system preference, and the existing Next.js Pages Router. Shared fonts load through `_app.js` and `_document.js`; the moon remains a lazy-loaded Three.js scene.

With a production or development server running:

```bash
TARGET_URL=http://localhost:3167 npm run verify:ui
TARGET_URL=http://localhost:3167 npm run verify:intro
TARGET_URL=http://localhost:3167 npm run verify:players
npm run verify:project-referrals
```

`verify:ui` checks public routes, all local project pages, representative article/book details, both themes at 320/390/1280px, filters, menu keyboard access, and mocked newsletter/listing states. Screenshots go to `/tmp/ozzo-ui`. Install Playwright's Chromium or set `BROWSER_EXECUTABLE_PATH` to an existing browser. See [the migration coverage record](docs/chakra-3-verification.md) and [the notebook design follow-up](docs/notebook-design-direction.md).

Projects prioritize Synergym and One Nil. Public product contact uses each project's `hello@` inbox; public author metadata uses Ozzo. Outgoing product links include `ref=ozzo.blog` and UTM attribution through `libs/projectReferral.mjs`. Destination analytics must read those parameters to report visits. See [the projects and privacy coverage record](docs/projects-privacy-refactor.md).

## Sharing projects

Project detail pages have a **Share on X** link that opens an editable draft with the final `https://ozzo.blog/projects/<id>` URL. Drafts use each project's `shareText` in `libs/projectData.js`, so each project can speak to its own audience. Cards credit `@ozzgio`.

Each page declares a 640×480 Player Card pointing to `/embed/projects/<id>`, a public preview with screenshot, stack, and project details. Existing raster images remain the social posters.

Inline rendering depends on X and its clients; it requires a deployed-site test. See [implementation research and limitations](docs/x-player-cards.md). With the site running locally, check the cards and sandbox behavior with:

```bash
TARGET_URL=http://localhost:3000 node scripts/verify-project-players.mjs
```

## Content pipeline

Articles and books are fetched from [portfolio-data](https://github.com/ozzgio/portfolio-data) and cached at the edge:

- **Articles**: `https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json`
- **Books**: `https://raw.githubusercontent.com/ozzgio/portfolio-data/main/books.json`

```
Obsidian vault -> portfolio-data (public JSON) -> ozzoblog
```

Content is authored in the vault. `portfolio-data` is the publishing layer. This repo handles presentation, rendering, SEO, and layout only.

---

## Repository boundaries

- **Lives here**: UI, page composition, article and book rendering, project cards, SEO, animations
- **Does not live here**: content authoring, vault notes, publishing automation
- **Local source of truth**: `libs/projectData.js` for project cards
- **External source of truth**: `portfolio-data` for articles and books

For agent-facing rules, see [AGENTS.md](./AGENTS.md).

---

## Branches

- **`main`**: production (deployed to ozzo.blog)
- **`preview`**: staging

---

## License

[MIT](./LICENSE)
