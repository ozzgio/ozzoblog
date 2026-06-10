# ozzo.blog

[![Production](https://img.shields.io/badge/Production-Live-00C58E?logo=vercel&logoColor=white)](https://ozzo.blog)
[![Preview](https://img.shields.io/badge/Preview-Available-999999?logo=vercel&logoColor=white)](https://devozzo-portfolio.vercel.app)

Personal technical blog. Articles on software architecture, Rails, and building in public. Books page with reading notes. Built on Next.js and Chakra UI, content sourced from an Obsidian vault via a public JSON layer.

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

---

## Content pipeline

Articles and books are fetched at build time from [portfolio-data](https://github.com/ozzgio/portfolio-data):

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
