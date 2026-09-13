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
backend, tema oscuro único.

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

Starlight genera los artículos. El proyecto añade `/`, `/categories`,
`/categories/[category]`, `/tags`, `/tags/[tag]`.

### Overrides de Starlight

Solo `Header.astro`, `PageTitle.astro` y `ThemeSelect.astro` en
`src/components/starlight/`. El Sidebar y el Footer son los de Starlight
sin tocar.

### Estilos

`src/styles/starlight.css` mapea el sistema visual a las variables de
Starlight. `src/styles/global.css` (Tailwind v4) es solo para la portada.

## Escribir contenido

Ver `docs/CONTENT_GUIDE.md`. Copia el frontmatter de una entrada parecida.

## Notas

- Alias `@/*` → `./src/*`.
- Los tipos de `astro:content` salen de `.astro/`; corre `pnpm sync` si algo
  parece desactualizado.
