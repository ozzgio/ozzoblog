import remarkGfm from "remark-gfm";

// Keep Markdown parsing consistent wherever article bodies are rendered.
// GitHub-flavored Markdown adds tables, strikethrough, task lists, and
// autolink literals to the CommonMark baseline used by react-markdown.
export const remarkPlugins = [remarkGfm];
