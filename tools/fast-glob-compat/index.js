// Replace the unpatched braces chain (GHSA-vfj7-8cjw-p6xm).
// Only next-sitemap's callable async API and Next ESLint's globSync are used.
// Remove when both upstream tools stop depending on vulnerable braces.
const { glob, globSync } = require("tinyglobby");
const { isAbsolute } = require("node:path");
// tinyglobby defaults to relative results even for absolute input patterns.
const optionsFor = (pattern, options) => ({ absolute: isAbsolute(pattern), expandDirectories: false, ...options });
module.exports = (pattern, options) => glob(pattern, optionsFor(pattern, options));
module.exports.globSync = (pattern, options) => globSync(pattern, optionsFor(pattern, options))
  .map((path) => path.length > 1 ? path.replace(/\/$/, "") : path);
