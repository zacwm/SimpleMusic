module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "standard",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  ignorePatterns: ["**/old-commands/*.js"],
  rules: {
    indent: ["error", 2],
    semi: ["error", "always"],
    "eol-last": ["error", "never"],
    quotes: ["error", "double"],
    "arrow-parens": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
  },
};