const DATA_REPO = "ozzgio/portfolio-data";
const DATA_BRANCH = "main";

export const getTextContent = (value) =>
  typeof value === "string" ? value.trim() : "";

export const slugify = (value = "") =>
  getTextContent(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const resolvePortfolioAssetUrl = (url, directory = "images") => {
  const value = getTextContent(url);

  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }

  return `https://cdn.jsdelivr.net/gh/${DATA_REPO}@${DATA_BRANCH}/${directory}/${value}`;
};

export const stripMarkdown = (value = "") =>
  getTextContent(value)
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, " ")
    .replace(/^>\s?/gm, "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/[*_~#>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const createExcerpt = (value, maxLength = 220) => {
  const text = stripMarkdown(value);

  if (!text) return "";
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const safeBoundary = truncated.lastIndexOf(" ");

  return `${(safeBoundary > maxLength * 0.6
    ? truncated.slice(0, safeBoundary)
    : truncated
  ).trimEnd()}…`;
};

// Article bodies in portfolio-data open with their own "# Title" line by
// authoring convention, duplicating the page's own styled H1. Strip a
// leading H1 (and the blank line after it) so the title renders exactly
// once.
const stripLeadingHeading = (text) =>
  text.replace(/^\s*#\s+.+\n+/, "");

export const getArticleBody = (article) =>
  stripLeadingHeading(getTextContent(article?.content || article?.body));

export const getArticleBookReference = (article) =>
  getTextContent(article?.book);

export const getArticleBookUrl = (article) =>
  getTextContent(article?.book_url || article?.bookUrl);

export const isInternalArticle = (article) =>
  Boolean(getTextContent(article?.slug) && getArticleBody(article));

export const getArticleSummary = (article, maxLength = 220) => {
  const contentPreview = createExcerpt(getArticleBody(article), maxLength);
  if (contentPreview) return contentPreview;

  return createExcerpt(article?.description || article?.excerpt, maxLength);
};

export const getBookNotes = (book) =>
  getTextContent(book?.notes || book?.content);

// Every book entry in portfolio-data writes notes as a sequence of
// **Label** paragraphs ("The problem", "The concept", "The decision", ...).
// Parse that convention into labeled sections so the UI can render a single
// reading arc instead of one undifferentiated block of markdown.
export const parseBookNotesSections = (notes) => {
  const text = getTextContent(notes);
  if (!text) return [];

  const headingPattern = /\*\*([^*\n]+)\*\*\s*\n*/g;
  const matches = [...text.matchAll(headingPattern)];
  if (matches.length < 2) return [];

  return matches
    .map((match, index) => {
      const label = match[1].trim();
      const start = match.index + match[0].length;
      const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
      const body = text.slice(start, end).trim();
      return { label, body };
    })
    .filter((section) => section.body);
};

export const getBookSlug = (book) =>
  getTextContent(book?.slug) || slugify(book?.title || "");

export const hasBookNotes = (book) => Boolean(getBookNotes(book));

export const isInternalBook = (book) => Boolean(getBookSlug(book));

export const getBookSummary = (book, maxLength = 220) => {
  const notesPreview = createExcerpt(getBookNotes(book), maxLength);
  if (notesPreview) return notesPreview;

  return createExcerpt(book?.lesson || book?.description, maxLength);
};

export const formatAbsoluteDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

// --- Portfolio-data fetching -------------------------------------------------
//
// One fetcher for every page that reads portfolio-data, so the timeout and
// retry policy lives in exactly one place. The raw CDN is slowest in the
// minute or two after a publish (edge revalidation) and rate-limits under
// load; a bare fetch() with no deadline can hang past Vercel's serverless
// timeout and surface as a 500 — almost always on the newest article, since
// it has no cached page yet and must generate on demand.
//
// Returns { ok, data } where data is the validated array on success or [] on
// failure. Callers own their own filtering/normalization and decide how to
// degrade (graceful empty list, "temporarily unavailable", or notFound).

const PORTFOLIO_ARTICLES_URL =
  "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json";
const PORTFOLIO_BOOKS_URL =
  "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/books.json";
const PORTFOLIO_FETCH_TIMEOUT_MS = 8000;
const PORTFOLIO_FETCH_RETRIES = 1;

async function fetchPortfolioArray(url) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(PORTFOLIO_FETCH_TIMEOUT_MS),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) return { ok: true, data };
      }
    } catch {
      // Timeout, DNS, or JSON parse error — retry once, then give up gracefully.
    }
    if (attempt >= PORTFOLIO_FETCH_RETRIES) return { ok: false, data: [] };
  }
}

export async function fetchArticles() {
  const { ok, data } = await fetchPortfolioArray(PORTFOLIO_ARTICLES_URL);
  return { ok, articles: ok ? data : [] };
}

export async function fetchBooks() {
  const { ok, data } = await fetchPortfolioArray(PORTFOLIO_BOOKS_URL);
  return { ok, books: ok ? data : [] };
}
