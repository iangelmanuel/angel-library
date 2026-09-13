# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio.

## Comandos

Gestor de paquetes: **pnpm**.

```bash
pnpm dev
pnpm build
pnpm check
```

`pnpm eslint` y `pnpm prettier:check` son lo que corre el CI. `pnpm sync`
regenera los tipos tras tocar `src/content.config.ts`.

## Qué es esto

Sitio estático con **Astro + Starlight**: una biblioteca técnica personal en
español. Todo el contenido son Markdown locales en `src/content/docs/`. Sin
backend; tema claro y oscuro.

Los textos de interfaz, los comentarios y el contenido van **en español**.

## Arquitectura

### Contenido: la carpeta manda

`src/content/docs/<categoría>/<subcategoría>/<archivo>.md`. La carpeta
decide categoría y subcategoría — es la única clasificación, no hay un
campo `type`. La URL es la ruta.

Categorías y subcategorías están declaradas a mano en
`src/config/categories.ts` (un objeto plano, sin descubrimiento por
filesystem). El sidebar de Starlight es otro archivo estático,
`src/config/sidebar.ts`, con `autogenerate: { directory }` por subcategoría
— Starlight arma el árbol nativamente en build.

`src/content.config.ts` extiende `docsSchema` con campos opcionales
(`tags`, `command`, `url`, `technologies`…). Nada se exige por tipo o
categoría.

### Sin validación ni relaciones (a propósito)

No hay chequeo de enlaces/referencias rotas en build, ni una sección de
"relacionadas" al pie de cada entrada. Es una decisión deliberada por
simplicidad — ver `docs/ARCHITECTURE.md`.

### Rutas

Starlight genera los artículos y su sidebar es la única navegación por
categoría/tag — no hay páginas propias de listado. El proyecto solo añade
`/` (la portada).

### Overrides de Starlight

`Header.astro`, `PageTitle.astro`, `Sidebar.astro` (solo el primer nivel
del menú) y `ThemeSelect.astro` (renderiza el botón de tema) en
`src/components/starlight/`. El Footer es el de Starlight sin tocar.
El buscador y el botón de tema son componentes compartidos con la portada:
`src/components/shared/SearchButton.astro` y `ThemeToggle.astro`.

### Estilos

`src/styles/tokens.css` define el sistema visual («Tema de editor», ver
`DESIGN.md`): oscuro en `:root`, claro en `:root[data-theme="light"]`.
`src/styles/starlight.css` lo mapea a las variables de Starlight.
`src/styles/global.css` (Tailwind v4) es solo para la portada.

Los bloques de código usan Night Owl (oscuro) y Night Owl Light (claro) solo
para las letras (`astro.config.mjs` → `expressiveCode`); el fondo sale de los tokens. Las
transiciones entre páginas son solo CSS (`@view-transition` en
`chrome.css`), sin `ClientRouter`.

## Escribir contenido

Ver `docs/CONTENT_GUIDE.md`. Copia el frontmatter de una entrada parecida.

## Notas

- Alias `@/*` → `./src/*`.
- Los tipos de `astro:content` salen de `.astro/`; corre `pnpm sync` si algo
  parece desactualizado.
- Tras cambiar `expressiveCode` en `astro.config.mjs`, corre
  `pnpm astro sync --force`: Starlight guarda el Markdown ya renderizado y
  seguiría enlazando la hoja de estilos de código anterior.
