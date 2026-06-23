import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";

// Mermaid (components/mermaid-diagram.js) only renders in a browser via
// useEffect -- there's no diagram to draw server-side, so RSS readers and
// email clients get this text note instead.
const MERMAID_PLACEHOLDER = "[Diagram available on ozzo.blog]";

const components = {
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
