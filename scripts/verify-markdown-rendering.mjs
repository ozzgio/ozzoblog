import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { remarkPlugins } from "../libs/markdown-plugins.mjs";

const table = `| Signal | Next move |
| --- | --- |
| View | Ask for an example. |`;

const html = renderToStaticMarkup(
  React.createElement(ReactMarkdown, { remarkPlugins }, table),
);

assert.match(html, /^<table>/, "GFM tables must render as semantic tables");
assert.match(html, /<thead>/, "GFM tables must include table headers");
assert.match(html, /<td>Ask for an example\.<\/td>/, "GFM table cells must render");

console.log("GFM Markdown table rendering verified.");
