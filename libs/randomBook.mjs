export function pickShelfBook(books, previousSlug) {
  const candidates =
    books.length > 1
      ? books.filter((book) => book.slug !== previousSlug)
      : books;
  return candidates[Math.floor(Math.random() * candidates.length)] || null;
}
