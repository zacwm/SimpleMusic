module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    "standard"
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    indent: ["error", 2],
    semi: ["error", "always"],
    "eol-last": ["error", "never"],
    quotes: ["error", "double"],
    "arrow-parens": ["error", "always"]
  }
};