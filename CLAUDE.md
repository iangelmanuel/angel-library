# CLAUDE.md

Guía para Claude Code (claude.ai/code) al trabajar en este repositorio.

## Comandos

Gestor de paquetes: **pnpm**.

```bash
pnpm dev
```

```bash
pnpm build
```

```bash
pnpm check
```

`pnpm check` = `astro check`. `pnpm sync` regenera los tipos tras tocar
`src/content.config.ts`. `pnpm preview` sirve `dist/`. `pnpm eslint` y
`pnpm prettier:check` son lo que corre el CI.

No hay tests: `pnpm build` es la validación real.

## Qué es esto

Sitio estático con **Astro + Starlight**: una biblioteca técnica personal en
español. Todo el contenido son Markdown locales en `src/content/docs/`. Sin
backend, tema oscuro único.

Los textos de interfaz, los comentarios y el contenido van **en español**.

## Arquitectura

### Contenido: la carpeta manda

`src/content/docs/<categoría>/<subcategoría>/<archivo>.md`. La carpeta decide
categoría y subcategoría; el frontmatter solo declara `type`. Mover un archivo
lo recategoriza. La URL es la ruta: `/frontend/astro/astro-content-collections`.

Una sola colección, `docs`, la de Starlight. Su esquema
(`src/content.config.ts`) es `docsSchema({ extend: … })`: los campos de
Starlight más los propios (`type`, `tags`, `related`, `private`, `updatedAt` y
los específicos de cada tipo). `type` es opcional en el esquema porque las
páginas propias usan el mismo layout; `getAllEntries()` falla si una entrada de
contenido no lo declara.

Las reglas por tipo (`commands` exige `command`, `resources` exige `url` y
`resourceCategory`, `integrations` exige dos tecnologías) viven en un
`superRefine` al final del esquema.

### Config: la única fuente

`src/config/` define categorías, subcategorías, tipos de contenido, categorías
de recurso e iconos. De ahí salen el menú, las páginas de listado y los colores.

`src/config/sidebar.ts` construye el menú de Starlight leyendo esas listas y las
carpetas reales de `src/content/docs/`. Grupo → categoría → subcategoría →
entradas (`autogenerate`).

### Rutas

Starlight genera todas las páginas de documentación. Además hay páginas propias
en `src/pages/`, todas envueltas en `<StarlightPage>` para heredar el layout:

- `/` — la portada (`src/features/landing/`), con su propio layout.
- `/categories` y `/categories/[category]`
- `/tipos/[type]`
- `/tags` y `/tags/[tag]`
- `/buscar` — abre el buscador de Starlight al entrar.

### Relaciones

`src/lib/relations.ts` deriva las relaciones de una entrada: `related`
explícitas, retroenlaces, integraciones y recetas que la citan, y afinidad por
tags. Se pintan al pie de cada entrada mediante el override
`src/components/starlight/Footer.astro`.

### Búsqueda

La de Starlight (Pagefind). No hay índice propio.

### Estilos

Dos hojas, según quién pinte la página:

- `src/styles/starlight.css` — mapea el sistema «El Esmalte» a las variables de
  Starlight (`--sl-color-*`). La cargan las páginas de documentación.
- `src/styles/global.css` — Tailwind v4 y las primitivas propias. Solo la usa la
  portada.

Los tokens viven en `src/styles/tokens.css` y los consumen las dos. `DESIGN.md`
documenta el sistema visual.

### Bloques de código

Expressive Code, el de Starlight. Los colores se ajustan desde
`expressiveCode.styleOverrides` en `astro.config.mjs`.

### Iconos

`src/config/icons.ts` es la tabla única: `BRAND_ICONS` (logos propios) y
`RECOLORED_ICONS` (un icono de lucide con color fijo). `<Icon name="…" />`
resuelve en build; `DynamicIcon` hace lo mismo en las islas de React.

## Escribir contenido

Copia el frontmatter de una entrada parecida y lee `src/content.config.ts`.
`docs/CONTENT_GUIDE.md` tiene plantillas. Usa `private: true` para entradas
personales (conservan su ruta pero salen de listados y navegación) y
`draft: true` para lo que aún no se publica.

## Notas

- Alias `@/*` → `./src/*`.
- Los tipos de `astro:content` salen de `.astro/`; corre `pnpm sync` si algo
  parece desactualizado.
