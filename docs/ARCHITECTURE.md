# Arquitectura

Cómo está montado `angel.library` y por qué. Si vas a tocar código, empieza por
aquí; si solo vas a escribir una entrada, ve a [CONTENT_GUIDE.md](./CONTENT_GUIDE.md).

## La idea en una frase

Es un sitio estático de Astro con **Starlight** encima: Starlight pone el layout,
el menú y el buscador; el proyecto pone la organización del contenido (carpetas,
tipos, tags y relaciones).

## El mapa

```
src/
├─ content/docs/          las 718 entradas, en carpetas
├─ config/                categorías, subcategorías, tipos, iconos, menú
├─ lib/                   leer y relacionar entradas
├─ pages/                 la portada y las páginas propias
├─ components/            tarjeta de entrada y overrides de Starlight
├─ features/landing/      la portada, aislada del resto
├─ markdown/              el plugin de pestañas pnpm · bun · npm
└─ styles/                tokens y las dos hojas de estilo
```

## 1. El contenido vive en carpetas

```
src/content/docs/<categoría>/<subcategoría>/<archivo>.md
```

La carpeta **es** la clasificación. `frontend/astro/astro-islands.md` es de la
categoría `frontend`, la subcategoría `astro`, y su URL es
`/frontend/astro/astro-islands`. Mover el archivo lo recategoriza: no hay base
de datos ni panel donde repetir esa información.

El frontmatter solo añade lo que la carpeta no sabe: el **tipo** editorial
(`guides`, `commands`, `resources`…), los tags y las relaciones.

## 2. El esquema: Starlight más lo nuestro

`src/content.config.ts` declara una sola colección, `docs`, con
`docsSchema({ extend: … })`:

- **De Starlight**: `title`, `description`, `sidebar`, `draft`, `tableOfContents`…
- **Nuestros**: `type`, `tags`, `related`, `private`, `updatedAt` y los campos
  propios de cada tipo (`command`, `url`, `technologies`…).

Las tres reglas por tipo viven en un `superRefine` al final del archivo:

| Tipo           | Exige                      |
| -------------- | -------------------------- |
| `commands`     | `command`                  |
| `resources`    | `url` y `resourceCategory` |
| `integrations` | 2+ `technologies`          |

`type` es opcional en el esquema porque las páginas propias (tags, categorías,
tipos) usan el mismo layout y no son entradas de contenido. Quien exige que toda
entrada real lo declare es `getAllEntries()`.

## 3. El config manda sobre la interfaz

`src/config/` es la única fuente de verdad de la clasificación:

- `categories.ts` — las 23 categorías, su color y su grupo (`CATEGORY_GROUPS`).
- `subcategories.ts` — la etiqueta legible de cada subcarpeta.
- `content-types.ts` — los 14 tipos editoriales.
- `resources.ts` — las categorías de recurso.
- `icons.ts` — la tabla de iconos.
- `sidebar.ts` — construye el menú de Starlight leyendo lo anterior **y** las
  carpetas reales.

El menú tiene tres niveles: **grupo → categoría → subcategoría → entradas**.
Las entradas se listan una a una, ordenadas por título; las privadas y los
borradores no salen.

## 4. Leer y relacionar

`src/lib/content.ts` es la puerta de entrada al contenido:

- `getAllEntries()` — todas las entradas visibles. Filtra privadas y borradores,
  y **valida el contenido una vez por build**.
- `categoryOf()`, `subcategoryOf()`, `typeOf()` — de dónde sale cada cosa.
- `getCategoryEntries()`, `getEntriesByType()`, `getAllTags()`,
  `getEntriesByTag()` — lo que consumen las páginas propias.

`src/lib/relations.ts` hace dos cosas:

1. **Relaciona**: `getRelated()` devuelve las entradas conectadas por seis vías —
   `related` explícitas, retroenlaces, integraciones y recetas que la citan,
   recursos, y afinidad por tags (máximo 6).
2. **Valida**: `validateContentStructure()` (carpetas desconocidas),
   `validateContentRelations()` (referencias rotas) y `validateInternalLinks()`
   (enlaces `](/…)` que no llevan a ninguna parte). Si algo falla, **el build se
   rompe** con un mensaje en español.

## 5. Las páginas

Starlight genera las 718 páginas de documentación. Además hay cinco páginas
propias, todas envueltas en `<StarlightPage>` para heredar cabecera, menú y TOC:

| Ruta                     | Qué muestra                            |
| ------------------------ | -------------------------------------- |
| `/`                      | La portada (layout propio)             |
| `/categories`            | Las 23 categorías con su conteo        |
| `/categories/[category]` | Sus entradas, agrupadas por subcarpeta |
| `/tipos/[type]`          | Todo lo declarado con ese tipo         |
| `/tags` y `/tags/[tag]`  | El cruce por tags                      |
| `/buscar`                | Abre el buscador de Starlight          |

## 6. Los overrides de Starlight

En `src/components/starlight/`:

- `PageTitle.astro` — bajo el título añade los metadatos con sus enlaces:
  categoría, subcategoría, tipo, tags, comando o instalación, campos propios del
  tipo, tecnologías, enlaces externos y avisos.
- `Footer.astro` — añade las relaciones de la entrada sobre el pie normal.
- `ThemeSelect.astro` — vacío: el sitio es solo oscuro.

Se declaran en `astro.config.mjs`, en `starlight.components`.

## 7. Markdown

Starlight se encarga de casi todo (Expressive Code para los bloques de código).
Lo único propio es `src/markdown/package-manager.mjs`: detecta un bloque de
instalación y lo convierte en **pestañas pnpm · bun · npm**, traduciendo el
comando. El cambio de pestaña lo maneja `public/pm-tabs.js`, que recuerda la
elección en `localStorage`.

## 8. Estilos

Dos hojas, según quién pinte la página:

- `src/styles/starlight.css` — traduce los tokens a las variables de Starlight
  (`--sl-color-*`) y ajusta menú, buscador, código y paginación. La cargan las
  páginas de documentación.
- `src/styles/global.css` — Tailwind y las primitivas propias. Solo la portada.

Los tokens (`src/styles/tokens.css`) son la fuente común. `DESIGN.md` explica el
sistema visual: color que rellena, un hilo de 1px, sin cantos.

## 9. Qué rompe el build a propósito

- Una entrada sin `type`.
- Una carpeta que no existe en el config.
- Una referencia de `related` a una entrada que no existe.
- Un enlace interno a una ruta muerta.
- Un tipo sin su campo obligatorio.

Es la red de seguridad: nada se degrada en silencio.
