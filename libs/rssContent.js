import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";

// Mermaid (components/mermaid-diagram.js) only renders in a browser via
// useEffect -- there's no diagram to draw server-side, so RSS readers and
// email clients get this text note instead.
const MERMAID_PLACEHOLDER = "[Diagram available on ozzo.blog]";

const SITE_URL = "https://ozzo.blog";

// On the site, a root-relative path like "/articles/other-post" resolves
// against ozzo.blog automatically. In an emailed/exported copy of this HTML
// (Buttondown's RSS-to-Email importer) there's no implicit origin, so it
// would silently 404. Absolutize it here only -- the live article page
// renders this same markdown through markdown-prose.js untouched.
const absolutize = (url) =>
  typeof url === "string" && url.startsWith("/") ? `${SITE_URL}${url}` : url;

const components = {
  a: ({ href, children }) => <a href={absolutize(href)}>{children}</a>,
  img: ({ src, alt }) => <img src={absolutize(src)} alt={alt} />,
  pre: ({ children }) => {
    const child = Array.isArray(children) ? children[0] : children;
    const className = child?.props?.className || "";

    if (className === "language-mermaid") {
      return <p>{MERMAID_PLACEHOLDER}</p>;
    }

    return (
      <pre>
        <code className={className || undefined}>
          {child?.props?.children}
        </code>
      </pre>
    );
  },
};

// Renders article markdown to plain HTML for the RSS <content:encoded>
// field -- same markdown source as the article page (rendered there via
// components/markdown-prose.js), but without the Chakra styling layer,
// which feed readers and email clients can't load anyway.
export const renderArticleHtml = (markdown) =>
  renderToStaticMarkup(
    <ReactMarkdown components={components}>{markdown}</ReactMarkdown>,
  );

// CDATA sections can't contain a literal "]]>" -- split it across two
// sections if the rendered HTML ever contains that sequence.
const escapeForCdata = (html) => html.replace(/]]>/g, "]]]]><![CDATA[>");

export const buildContentEncoded = (markdown) => {
  if (!markdown) return "";
  const html = escapeForCdata(renderArticleHtml(markdown));
  return `<content:encoded><![CDATA[${html}]]></content:encoded>`;
};
