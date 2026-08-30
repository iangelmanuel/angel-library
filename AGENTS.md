# Agent Instructions

- This is a single private Astro 7 site. Use Node.js `>=22.12.0` and pnpm `11` (`pnpm@11.19.0`); do not introduce another package manager.
- Run `pnpm check` for Astro/TypeScript diagnostics and `pnpm build` for the real content-integrity check. There is no test runner, linter, or formatter. Run `pnpm sync` after changing `src/content.config.ts` or when generated Astro types are stale.
- The app is wired from `src/config/site.ts`: content types, categories, stacks, labels, navigation, and ordering derive from its constants (ids are the map keys, never a parallel list). Update that source of truth before adding related schema or UI behavior.
- Content is local Markdown in `src/content/<collection>/`; there is no generator script, so copy the frontmatter of a similar entry (templates in `docs/CONTENT_GUIDE.md`). Read `src/content.config.ts` before editing frontmatter; collection-specific required fields differ. `draft: true` is visible in development but excluded from production.
- Personal command/configuration entries belong in `src/content/commands/` with `private: true`; they still get the standard detail route but are excluded from public navigation, listings, tags, and search.
- Content references use namespaced keys such as `technologies/react` (including nested resource paths), not bare ids. `validateContentRelations()` runs during static generation and a broken reference fails `pnpm build`; integrations and recipes discover technology relationships through `technologies` rather than duplicated reverse links.
- The dynamic routes in `src/pages/[type]/` generate collection listings and entry pages automatically; normally adding a Markdown file needs no route change.
- Icons live in one table, `src/config/icons.ts`: `BRAND_ICONS` for own logos and `RECOLORED_ICONS` for tinted lucide icons. `src/lib/icons.ts` (Astro, build time) and `src/components/shared/DynamicIcon.tsx` (React) both read it; plain lucide names need no registration on the Astro side.
- Astro owns most UI; React is limited to the terminal feature (`src/features/terminal/`, with its own README), mobile navigation, and `src/components/ui/`. Tailwind is v4 via `@tailwindcss/vite`; there is no `tailwind.config`.
- Match the repository’s Spanish-language content and UI conventions. Do not commit secrets or real data; environment files are ignored except `.env.example`.
- For the fuller verified architecture notes and content-authoring conventions, consult `CLAUDE.md` and `CONTRIBUTING.md`.
