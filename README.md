# 🧑‍💻 Ozzo's Developer Portfolio

[![Production - ozzo.blog](https://img.shields.io/badge/Production-Live-00C58E?logo=vercel&logoColor=white)](https://ozzo.blog)
[![Preview - Vercel](https://img.shields.io/badge/Preview-Available-999999?logo=vercel&logoColor=white)](https://devozzo-portfolio.vercel.app)

Welcome to my portfolio website — a modern, responsive web app showcasing my background, skills, and projects as a web developer. Built with cutting-edge tools and designed to evolve alongside my work.

---

## 🚀 Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra--UI-319795?logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![Framer Motion](https://img.shields.io/badge/Framer--Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![React Markdown](https://img.shields.io/badge/React--Markdown-000000?logo=markdown&logoColor=white)](https://github.com/remarkjs/react-markdown)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/)
[![React Icons](https://img.shields.io/badge/React%20Icons-EFD81D?logo=react&logoColor=black)](https://react-icons.github.io/react-icons/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)

---

## 📸 Features

- Fully responsive, mobile-first layout
- Dark mode support
- Dynamic content from Obsidian vault (via GitHub)
- SEO-friendly metadata with automated CI health checks
- RSS feed (`/rss.xml`) with runtime error guardrails
- Animated transitions
- Book and article deep-dive detail pages with Markdown rendering
- Individual project detail pages
- Experience timeline page
- Clean and consistent component structure
- Easy-to-maintain codebase with Prettier & ESLint

---

## 🛠 Getting Started

To run the project locally:

```bash
git clone https://github.com/ozzgio/ozzoblog.git
cd ozzoblog
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Checks & Verification

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

## 📊 Content Management

This portfolio dynamically fetches articles and books from the public `portfolio-data` repository:

- **Articles**: `https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json`
- **Books**: `https://raw.githubusercontent.com/ozzgio/portfolio-data/main/books.json`

Current flow:

`Obsidian vault -> exported public JSON/images -> portfolio-data -> portfolio`

This means:
- long-form content is authored outside this repo
- `portfolio-data` is the public publishing layer
- this repo focuses on presentation, layout, filtering, SEO, and rendering quality

See the [portfolio-data repository](https://github.com/ozzgio/portfolio-data) for the public JSON files.

## 🧭 Repository Boundaries

- **Lives here**: UI, layout, page composition, project cards, animations, SEO pages, detail page rendering
- **Does not live here**: article/book authoring workflow, vault-private notes, publishing automation state
- **Local source of truth**: `libs/projectData.js` for project cards
- **External source of truth**: `portfolio-data` for articles/books

For agent-facing repo rules, see [AGENTS.md](./AGENTS.md).

---

## 🌿 Branches

- **`main`**: Production-ready code (deployed to ozzo.blog)
- **`preview`**: Preview/staging branch for testing
- **`notion-posts-integ`**: Archived branch with the previous Notion API implementation (for reference)

---

## 🧾 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🙌 Inspiration

This site was inspired by the aesthetic and simplicity of [Devaslife](https://youtube.com/@devaslife) and minimalist portfolio best practices.

---

## 📬 Contact

Got feedback or want to connect?
Please reach out via the contact page of the site.

---
