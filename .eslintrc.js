// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "warn",
    eqeqeq: "warn",
    "no-constant-binary-expression": "error",
  },
  overrides: [
    {
      files: [".eslintrc.*", ".prettierrc.*", "*.config.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "no-undef": "off",
      },
    },
  ],
};

module.exports = config;
