// @ts-check

/** @type {import("@trivago/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  bracketSpacing: true,
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  semi: true,
  printWidth: 80,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^@", "<THIRD_PARTY_MODULES>", "^[.][.]", "^[.]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = config;
