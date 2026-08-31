// ESLint 10 removes .eslintrc support and eslint-config-next ships a flat
// config entry from v16, so this replaces .eslintrc.json.
import next from "eslint-config-next";

const config = [
  ...next,
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-sitemap.config.js"],
  },
  {
    rules: {
      "react/display-name": "off",
      // ESLint 9 changed caughtErrors to default "all", which flags unused
      // catch bindings that were fine before. Keep the same "_" opt-out the
      // args and vars patterns already use.
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // New in eslint-config-next 16. The three current hits are the
      // deliberate "mounted" guard used to keep the first client render
      // identical to the server's (see components/section.js). Replacing
      // them with useSyncExternalStore is a real refactor of render
      // behaviour, so it is tracked separately rather than folded into a
      // dependency bump. Warn keeps the signal without failing the gate.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
