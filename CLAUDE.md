# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm**.

```bash
pnpm dev
```

```bash
pnpm build
```

```bash
pnpm check
```

`pnpm check` = `astro check` (TypeScript + Astro diagnostics). `pnpm sync` regenerates `.astro/types.d.ts` after changing `src/content.config.ts`. `pnpm preview` serves `dist/`.

No test runner, no linter, no formatter configured. Content integrity is verified at build time (see below), so `pnpm build` is the real validation step.

## What this is

Static Astro 7 site: a personal Spanish-language technical knowledge library. All content is local Markdown under `src/content/`. Zero backend, dark theme only, mostly zero client JS.

UI text, comments, frontmatter values and content are **in Spanish**. Match that.

## Architecture

### Single source of truth: `src/config/site.ts`

Content types, knowledge categories, and resource categories are declared as `as const` arrays + metadata records. Everything derives from them: Zod enums in `src/content.config.ts`, sidebar/nav (`src/lib/nav.ts`), routes, command palette, badges.

Adding a content type = add id to `CONTENT_TYPE_IDS`, add its `CONTENT_TYPES` entry, add a `defineCollection` in `content.config.ts`, add its `CollectionEntry<...>` to the `AnyEntry` union in `src/lib/content.ts`, create `src/content/<id>/`. No route or component changes needed.

Adding a category = add to `CATEGORY_IDS` + `CATEGORIES` only.

### Routing

Three dynamic routes cover the whole site:

- `src/pages/[type]/[...slug].astro` — every entry of every collection. URL = `/<collection>/<id>`.
- `src/pages/[type]/index.astro` — listing per content type.
- `src/pages/categories/[category].astro` — listing per category.

Plus `/`, `/search`, `/tags`, `/tags/[tag]`, and `/search-index.json` (build-time API route).

Dropping a `.md` file into a collection folder generates its page automatically.

### Content relations

Frontmatter references are **namespaced ids**: `collection/id` (e.g. `technologies/react`, `resources/design/uiverse` — resources are nested in subfolders, so the id includes the subfolder). Regex-enforced in the schema.

`src/lib/relations.ts` derives relations from three sources: explicit `related`, backlinks (entries pointing here), and shared-tag affinity (max 6). `integrations` and `recipes` that list an entry in their `technologies` are surfaced on that entry automatically — never declare relations in both directions.

`validateContentRelations()` runs inside `getStaticPaths()` of `[type]/[...slug].astro`. **A broken reference fails the build** with `[contenido] Referencias rotas:`. This is the safety net for content edits.

### Search

Build-time `src/pages/search-index.json.ts` emits every entry (body stripped to 1200 chars via `stripMarkdown`). The client fetches it **once per session** (`src/lib/search.ts` module-level cache, survives view transitions) and runs Fuse.js locally. Both `CommandPalette.tsx` and `SearchResults.tsx` consume the same index.

### Icons — two systems, keep both in sync

- Astro components: `<Icon name="git-branch" />` → `src/lib/icons.ts` reads the SVG from `node_modules/lucide-static/icons/<name>.svg` at build. Unknown name = build error. Zero client JS.
- React islands: `DynamicIcon` in `src/components/shared/DynamicIcon.tsx` uses an **explicit hand-maintained map** of `lucide-react` imports, falling back to `FileText`. Any icon name added to `site.ts` must also be registered there, or islands silently render the wrong icon.

### Markdown pipeline

`astro.config.mjs` wires Shiki (`github-dark-default`) with:
- `src/lib/shiki-transformers.mjs` — `transformerCodeFilename()` reads ` ```ts title="src/app.ts" ` into `data-filename`.
- `src/lib/rehype-code-blocks.mjs` — rehype plugin wrapping each `<pre>` in `.code-block` with a header (label + copy button). The copy button carries **no inline JS**; a single delegated `click` listener in `BaseLayout.astro` handles `[data-copy]` globally.

`EntryMeta.astro` hand-duplicates that copy-button markup for `command` / `install` frontmatter fields — change one, change the other.

### Client-side interactivity

`BaseLayout.astro` holds all global scripts, wired via `CustomEvent` to the React islands so the islands stay decoupled: `angel:open-search`, `angel:toggle-search`, `angel:toggle-nav`. Also Ctrl/Cmd+K and `/` shortcuts, and `astro:after-swap` → `syncSidebarState()` (needed because the sidebar uses `transition:persist` and doesn't re-render on navigation).

React is used only for `CommandPalette`, `MobileNav`, `SearchResults`, and the shadcn `ui/` primitives. Everything else is `.astro`.

### Styling

Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config`. All tokens are CSS variables in `src/styles/global.css` (`:root` + `@theme inline`). Dark-only: `<html class="dark">` is hardcoded, `--radius: 0rem` (square, terminal-ish aesthetic). Fonts self-hosted via Fontsource: Geist Sans / Mono / **Pixel** (`font-pixel` is used for headings and uppercase micro-labels).

shadcn/ui is configured (`components.json`, new-york, zinc); new primitives land in `src/components/ui/`.

## Content authoring

Each collection has its own schema on top of a shared base (`title`, `description`, `category`, `tags`, `related`, `draft`, `updatedAt`). Read `src/content.config.ts` before adding frontmatter — e.g. `commands` require `command`, `resources` require `url` + `resourceCategory`, `integrations` require ≥2 `technologies`.

`draft: true` entries render in dev and are excluded from production builds (`getAllEntries()`).

## Notes

- Path alias `@/*` → `./src/*`.
- `astro:content` types come from `.astro/`; run `pnpm sync` if imports look stale.
- An OpenAI Codex config exists at `~/.codex`. If you'd like to import its MCP servers, commands, or instructions into Claude Code, reply `/import` to see what's importable.
