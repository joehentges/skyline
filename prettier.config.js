/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 80,
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/types$",
    "^@/env(.*)$",
    "^@/types/(.*)$",
    "^@/errors",
    "^@/config",
    "^@/config/(.*)$",
    "^@/providers",
    "^@/db",
    "^@/db/(.*)$",
    "^@/auth",
    "^@/cache-session",
    "^@/client/(.*)$",
    "^@/lib/(.*)$",
    "^@/containers/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/hooks/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
}
