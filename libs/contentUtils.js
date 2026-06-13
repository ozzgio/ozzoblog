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

export const getArticleBody = (article) =>
  getTextContent(article?.content || article?.body);

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
