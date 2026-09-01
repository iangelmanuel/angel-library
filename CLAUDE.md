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

### The content model: folders decide, frontmatter declares the type

`src/content/<category>/<subcategory>/<file>.md`. **The folder is the source of truth** for category and subcategory; the frontmatter only declares `type` (`guides`, `commands`, `resources`…). Moving a file recategorizes it — there is nothing to edit.

One collection (`library`) holds everything; its schema is a `z.discriminatedUnion("type", …)` so each type keeps its own required fields. The entry id is its path, and the URL is the id.

### Single source of truth: `src/config/site.ts`

Content types, knowledge categories, subcategories, and resource categories are declared as `as const` arrays + metadata records. Everything derives from them: the sidebar/nav (`src/lib/nav.ts`), routes, command palette, badges, and the build-time validation of folder names.

Ids are the keys of those maps — `CONTENT_TYPE_IDS`, `CATEGORY_IDS`, `SUBCATEGORY_IDS` are derived, never hand-written lists.

Adding a content type = add its `CONTENT_TYPE_DEFINITIONS` entry, add an `entryType("<id>", …)` line to the union in `content.config.ts`, place it in `LEARNING_TYPE_ORDER`. No folder, route, or component changes needed.

Adding a category = add its `CATEGORY_DEFINITIONS` entry + place its id in `CATEGORY_GROUPS` (the build throws if you forget) + create `src/content/<id>/`.

Adding a subcategory = add `id: "Label"` to `SUBCATEGORY_LABELS` + place it in `CATEGORY_SUBCATEGORY_ORDER`. Its icon is `brand-<id>` unless listed in `SUBCATEGORY_ICONS`. In the `resources` category the subfolders are `RESOURCE_CATEGORY_DEFINITIONS` ids instead.

### Routing

Three dynamic routes cover the whole site:

- `src/pages/[...slug].astro` — every entry. URL = the entry id = `/<category>/<subcategory>/<file>`.
- `src/pages/tipos/[type].astro` — listing per content type.
- `src/pages/categories/[category].astro` — listing per category.

Plus `/`, `/search`, `/tags`, `/tags/[tag]`, and `/search-index.json` (build-time API route).

Dropping a `.md` file into a category folder generates its page automatically.

### Content relations

Frontmatter references are the target's **id, i.e. its path**: `frontend/react/react-context-api`. Regex-enforced in the schema.

`src/lib/relations.ts` derives relations from three sources: explicit `related`, backlinks (entries pointing here), and shared-tag affinity (max 6). `integrations` and `recipes` that list an entry in their `technologies` are surfaced on that entry automatically — never declare relations in both directions.

Three validations run inside `getStaticPaths()` of `[...slug].astro` and **fail the build** with a Spanish message: `validateContentStructure()` (unknown category/subcategory folder), `validateContentRelations()` (broken reference), `validateInternalLinks()` (`](/…)` link in a body that leads nowhere). This is the safety net for content edits.

### Search

Build-time `src/pages/search-index.json.ts` emits every entry (body stripped to 1200 chars via `stripMarkdown`). The client fetches it **once per session** (`src/lib/search.ts` module-level cache, survives view transitions) and runs Fuse.js locally. `useSearchIndex` in the terminal feature is the only consumer.

### Icons — one table, two renderers

`src/config/icons.ts` is the single source: `BRAND_ICONS` (own logos/glyphs, stored as `viewBox` + `fill` + inner SVG `body`) and `RECOLORED_ICONS` (a lucide icon painted a fixed color).

- Astro: `<Icon name="git-branch" />` → `src/lib/icons.ts` builds the SVG at build time, reading plain lucide names from `node_modules/lucide-static`. Unknown name = build error. Zero client JS.
- React islands: `DynamicIcon` reads the same table; it only keeps a `LUCIDE` import map because `lucide-react` cannot be imported by name at runtime. A brand or recolored icon added to `icons.ts` works in both without further edits.

### Markdown pipeline

`astro.config.mjs` wires Shiki (`tokyo-night`) with:
- `src/lib/shiki-transformers.mjs` — `transformerCodeFilename()` reads ` ```ts title="src/app.ts" ` into `data-filename`.
- `src/lib/rehype-code-blocks.mjs` — rehype plugin wrapping each `<pre>` in `.code-block` with a header (label + copy button), and merging the pnpm/bun/npm triples produced by `remark-pm-tabs.mjs` into one tabbed block. The copy button carries **no inline JS**; a single delegated `click` listener in `src/scripts/site-interactions.ts` handles `[data-copy]` globally.

`EntryMeta.astro` hand-duplicates that copy-button markup for `command` / `install` frontmatter fields — change one, change the other.

### Client-side interactivity

`src/scripts/site-interactions.ts` (loaded once from `BaseLayout.astro`) holds all global scripts, wired via `CustomEvent` to the React islands so the islands stay decoupled: `angel:open-search`, `angel:toggle-search`, `angel:toggle-nav`. Also Ctrl/Cmd+K and `/` shortcuts, and `astro:after-swap` → `syncSidebarState()` (needed because the sidebar uses `transition:persist` and doesn't re-render on navigation).

React is used only for the terminal (`src/features/terminal/`), `MobileNav`, and the shadcn `ui/` primitives. Everything else is `.astro`.

### The terminal — `src/features/terminal/`

Self-contained feature behind `/search` and Ctrl/Cmd+K: `components/` renders, `hooks/` holds the state (search index, output, history, appearance), `commands/` has one file per family, `data/` the long texts. A command is `{ description?, args?, aliases?, run(ctx) }` in its family's map; `TerminalContext` (`commands/types.ts`) is the only thing a command may touch. Commands with a `description` must be listed in `PUBLIC_COMMANDS` (`commands/index.ts`) — that array is the autocomplete order and the module throws at load if it drifts. Its README documents the flow.

### Styling

Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config`. All tokens are CSS variables in `src/styles/global.css` (`:root` + `@theme inline`). Dark-only: `<html class="dark">` is hardcoded, `--radius: 0rem` (square, terminal-ish aesthetic). Fonts self-hosted via Fontsource: Geist Sans / Mono / **Pixel** (`font-pixel` is used for headings and uppercase micro-labels).

shadcn/ui is configured (`components.json`, new-york, zinc); new primitives land in `src/components/ui/`.

## Content authoring

Each type has its own schema on top of a shared base (`title`, `description`, `type`, `tags`, `related`, `draft`, `private`, `updatedAt`). Read `src/content.config.ts` before adding frontmatter — e.g. `commands` require `command`, `resources` require `url` + `resourceCategory`, `integrations` require ≥2 `technologies`. Use `private: true` for personal command/configuration entries: they retain their generated detail route but stay out of public navigation, listings, tags, and search.

`draft: true` entries render in dev and are excluded from production builds (`getAllEntries()`).

There is no content generator script: add a `.md` to a `<category>/<subcategory>/` folder and copy the frontmatter of a similar entry. `docs/CONTENT_GUIDE.md` has ready-to-copy templates.

## Notes

- Path alias `@/*` → `./src/*`.
- `astro:content` types come from `.astro/`; run `pnpm sync` if imports look stale.
- An OpenAI Codex config exists at `~/.codex`. If you'd like to import its MCP servers, commands, or instructions into Claude Code, reply `/import` to see what's importable.
