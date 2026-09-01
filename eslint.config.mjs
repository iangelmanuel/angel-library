import jseslint from "@eslint/js"
import astro from "eslint-plugin-astro"
import tseslint from "typescript-eslint"

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      ".vercel/**",
      "node_modules/**",
      "src/env.d.ts"
    ]
  },
  jseslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly"
      }
    }
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  }
]
