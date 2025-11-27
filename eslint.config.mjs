import tseslint from "typescript-eslint"

export default [
  {
    ignores: ["node_modules", ".next", "dist"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        projectService: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {},
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
]


