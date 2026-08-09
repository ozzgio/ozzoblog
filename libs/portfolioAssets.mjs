const DATA_REPO = "ozzgio/portfolio-data";
const DATA_BRANCH = "main";

const getTextContent = (value) =>
  typeof value === "string" ? value.trim() : "";

// Keep portfolio-data image paths usable by page UI and social metadata alike.
// Root-relative paths deliberately stay root-relative here: Layout turns those
// into absolute URLs only when rendering social metadata.
export const resolvePortfolioAssetUrl = (url, directory = "images") => {
  const value = getTextContent(url);

  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }

  return `https://cdn.jsdelivr.net/gh/${DATA_REPO}@${DATA_BRANCH}/${directory}/${value}`;
};
