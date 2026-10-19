import {
  fetchArticles,
  fetchBooks,
  createExcerpt,
  getBookNotes,
  getBookSlug,
  parseBookNotesSections,
  getArticleSummary,
  getTextContent,
  isInternalArticle,
  resolvePortfolioAssetUrl,
} from "./contentUtils";

const formatAbsoluteDate = (dateStr) => {
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

const normalizeArticle = (article) => {
  const internal = isInternalArticle(article);
  const slug =
    typeof article.slug === "string" && article.slug.trim()
      ? article.slug.trim()
      : "";
  const externalUrl =
    typeof article.url === "string" && article.url.trim()
      ? article.url.trim()
      : "";
  const url = internal ? `/articles/${slug}` : externalUrl;

  return {
    title: String(article.title || ""),
    description: String(article.description || ""),
    summary: getArticleSummary(article, 140),
    url,
    date: String(article.date || ""),
    formattedDate: formatAbsoluteDate(article.date || ""),
    source: internal ? "internal" : "external",
    thumbnail: article.thumbnail
      ? resolvePortfolioAssetUrl(article.thumbnail)
      : "",
    book: String(article.book || ""),
    book_url: String(article.book_url || ""),
  };
};

export async function getServerSideProps({ res }) {
  // The helpers never reject (they resolve to { ok:false } on any failure),
  // so Promise.all is safe and each source degrades independently via .ok.
  const [articlesPayload, booksPayload] = await Promise.all([
    fetchArticles(),
    fetchBooks(),
  ]);

  let latestArticles = [];
  let articlesError = false;
  let currentBook = null;
  let shelfBooks = [];

  if (articlesPayload.ok && Array.isArray(articlesPayload.articles)) {
    latestArticles = articlesPayload.articles
      .filter((article) => article && article.title && article.date)
      .map(normalizeArticle)
      .filter((article) => article.url)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  } else {
    articlesError = true;
  }

  if (booksPayload.ok && Array.isArray(booksPayload.books)) {
    const books = booksPayload.books.filter(
      (book) => getTextContent(book?.title) && getTextContent(book?.author),
    );
    const reading = books.find((b) => b.status === "reading");
    if (reading) {
      currentBook = {
        title: String(reading.title),
        author: String(reading.author),
      };
    }
    shelfBooks = books
      .filter((book) => !book.status || book.status === "read")
      .map((book) => ({
        slug: getBookSlug(book),
        title: getTextContent(book.title),
        author: getTextContent(book.author),
        excerpt: createExcerpt(
          getTextContent(book.concept) ||
            getTextContent(book.lesson) ||
            parseBookNotesSections(getBookNotes(book))[0]?.body,
          420,
        ),
      }))
      .filter((book) => book.slug && book.title && book.author && book.excerpt);
    shelfBooks = [
      ...new Map(shelfBooks.map((book) => [book.slug, book])).values(),
    ];
  }

  // The homepage still renders fully (with a fallback message in the
  // latest-writing section) when only the articles fetch fails, so this
  // stays a 200 and skips the shared cache rather than serving a 503 for a
  // page that can render.
  res.setHeader(
    "Cache-Control",
    articlesError ? "no-store" : "s-maxage=60, stale-while-revalidate=300",
  );

  return {
    props: { latestArticles, articlesError, currentBook, shelfBooks },
  };
}
