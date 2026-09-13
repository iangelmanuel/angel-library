# Agent Instructions

- Astro 7 + Starlight 0.42 site. Use Node.js `>=22.12.0` and pnpm `11`; do not introduce another package manager.
- `pnpm check` for Astro/TypeScript diagnostics, `pnpm build` for the real integration check. ESLint and Prettier have package scripts. Run `pnpm sync` after changing `src/content.config.ts`.
- Site identity lives in `src/config/site.ts`. Categories/subcategories are a plain static object in `src/config/categories.ts` — no filesystem discovery, no per-folder metadata files. Adding a category means adding an entry there and creating the matching folder under `src/content/docs/`.
- The sidebar is native Starlight: `src/config/sidebar.ts` exports a static `SIDEBAR` array using `autogenerate: { directory }` per subcategory, passed straight into `astro.config.mjs`. There is no custom Sidebar component.
- Content is local Markdown in `src/content/docs/<category>/<subcategory>/<module>.md` — the folder is the only classification, there is no `type` field. `src/content.config.ts` extends Starlight's schema with a handful of optional fields; nothing is required by category.
- There is no build-time link/reference validation and no "related content" feature — removed on purpose for simplicity.
- Personal entries carry `private: true`: they keep their route but are excluded from public navigation, listings, tags, and search.
- Starlight generates every documentation entry page; `categories/[category].astro` and `tags/[tag].astro` generate the custom listings.
- Icons live in `src/config/icons.ts`. Own logos are SVG files in `src/icons/`; `src/components/shared/Icon.astro` resolves both sources.
- Astro and Starlight own the site UI. Tailwind is v4 via `@tailwindcss/vite`, used only by the landing page.
- Match the repository's Spanish-language content and UI conventions.
- For fuller architecture notes, consult `docs/ARCHITECTURE.md` and `docs/CONTENT_GUIDE.md`.
