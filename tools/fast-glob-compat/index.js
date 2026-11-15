// Replace the unpatched braces chain (GHSA-vfj7-8cjw-p6xm).
// Only Next ESLint's globSync is used (the callable async API is kept for parity).
// Remove when Next ESLint stops depending on vulnerable braces.
const { glob, globSync } = require("tinyglobby");
const { isAbsolute } = require("node:path");
// tinyglobby defaults to relative results even for absolute input patterns.
const optionsFor = (pattern, options) => ({ absolute: isAbsolute(pattern), expandDirectories: false, ...options });
module.exports = (pattern, options) => glob(pattern, optionsFor(pattern, options));
module.exports.globSync = (pattern, options) => globSync(pattern, optionsFor(pattern, options))
  .map((path) => path.length > 1 ? path.replace(/\/$/, "") : path);
