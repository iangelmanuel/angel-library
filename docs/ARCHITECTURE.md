# Arquitectura

## Qué es la aplicación

`angel.library` es un sitio privado y estático construido con Astro 7. Funciona como segundo cerebro técnico: el contenido es Markdown local organizado por categoría, Astro genera todas las páginas en build y React se limita a lo que necesita estado en el cliente (la terminal y el menú móvil).

## Estructura

```text
.
├── astro.config.mjs         # Integraciones y pipeline de Markdown
├── public/                  # Archivos estáticos servidos sin transformación
├── src/
│   ├── assets/              # Imágenes procesadas por Astro
│   ├── components/
│   │   ├── content/         # Tarjetas, metadatos y relaciones de las entradas
│   │   ├── layout/          # Header, sidebar, navegación móvil, TOC y footer
│   │   ├── shared/          # Iconos, logo y botón de copiar
│   ├── config/
│   │   ├── site.ts          # Tipos, categorías, subcategorías y orden
│   │   └── icons.ts         # Tabla única de iconos (Astro y React)
│   ├── content/             # <categoría>/<subcategoría>/<módulo>.md
│   ├── content.config.ts    # Esquema único, unión discriminada por `type`
│   ├── features/terminal/   # La consola: componentes, hooks, comandos y datos
│   ├── layouts/             # Documento base y composición de páginas
│   ├── lib/                 # Contenido, relaciones, navegación e iconos
│   ├── markdown/            # Transformaciones de Markdown y bloques de código
│   ├── pages/               # Rutas y endpoints estáticos
│   ├── scripts/             # Interacciones globales del navegador
│   └── styles/              # Tokens y parciales de estilo
└── docs/                    # Documentación interna
```

## El modelo de contenido

**La carpeta manda.** El id de una entrada es su ruta dentro de `src/content/`, y esa ruta es también su URL:

```
src/content/frontend/react/react-context-api.md
        →  categoría "frontend", subcategoría "react"
        →  /frontend/react/react-context-api
```

Hay **una sola colección** (`library`). Su schema es una unión discriminada por `type`, así que cada tipo de documento conserva sus campos obligatorios sin necesidad de una colección por tipo. Mover un archivo de carpeta es todo lo que hace falta para recategorizarlo.

Cómo crear y modificar categorías, subcategorías, módulos y secciones está en [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

## Flujo

1. `src/config/site.ts` define el vocabulario: tipos, categorías, subcategorías, grupos de navegación y orden.
2. `src/content.config.ts` valida el frontmatter y Astro carga el Markdown de `src/content/`.
3. `src/lib/content.ts` carga las entradas, deduce categoría y subcategoría del id, ordena y agrupa. Es el único sitio donde vive esa lógica.
4. `src/lib/relations.ts` valida el contenido y calcula las relaciones entre entradas.
5. Las rutas de `src/pages/` piden los datos que necesitan y los renderizan.
6. `DocsLayout.astro` compone navegación, contenido y TOC; `BaseLayout.astro` define el documento y carga las interacciones globales.
7. React hidrata solo la terminal y el menú móvil.
8. `pnpm build` genera el sitio estático y falla si el contenido es inválido.

## Rutas

| Ruta                                             | Genera                                           |
| ------------------------------------------------ | ------------------------------------------------ |
| `src/pages/[...slug].astro`                      | Cada entrada. La URL es su id                    |
| `src/pages/categories/[category].astro`          | Listado por categoría, agrupado por subcategoría |
| `src/pages/tipos/[type].astro`                   | Listado por tipo de documento                    |
| `src/pages/tags/index.astro`, `tags/[tag].astro` | Nube de tags y listado por tag                   |
| `src/pages/index.astro`, `search.astro`          | Home y consola de búsqueda                       |
| `src/pages/search-index.json.ts`                 | Índice de búsqueda, generado en build            |

## Validación en build

Las tres corren dentro de `getStaticPaths()` de `[...slug].astro` y paran el build con un mensaje en español:

- `validateContentStructure` — la carpeta debe ser una categoría y subcategoría declaradas.
- `validateContentRelations` — `related`, `technologies` y `libraries` deben apuntar a ids existentes.
- `validateInternalLinks` — los enlaces `](/…)` del cuerpo deben llevar a algún sitio.

A eso se suman dos redes de seguridad en configuración: una categoría fuera de `CATEGORY_GROUPS` y un comando de terminal fuera de `PUBLIC_COMMANDS` también rompen el build.

## Módulos importantes

- `src/config/site.ts` — fuente de verdad del vocabulario. Los ids son las claves de sus mapas; no hay listas paralelas.
- `src/config/icons.ts` — tabla única de iconos: `BRAND_ICONS` (logos propios) y `RECOLORED_ICONS` (lucide con color fijo).
- `src/content.config.ts` — contrato de frontmatter por tipo, en una colección.
- `src/lib/content.ts` — cargar, ubicar, ordenar, agrupar y tags.
- `src/lib/relations.ts` — validaciones y relaciones explícitas, inversas y por afinidad de tags.
- `src/lib/nav.ts` — convierte configuración y contenido en el árbol de la sidebar y el menú móvil.
- `src/lib/icons.ts` — construye el SVG en build para `<Icon>`; `DynamicIcon.tsx` hace lo mismo en React desde la misma tabla.
- `src/markdown/package-manager.mjs` — traduce instalaciones y crea las pestañas pnpm, Bun y npm.
- `src/markdown/code-blocks.mjs` — conserva metadatos de Shiki y construye las cabeceras de los bloques.
- `src/markdown/external-links.mjs` — asegura y abre aparte los enlaces externos del Markdown.
- `src/features/terminal/` — la consola de `/search` y de Ctrl/Cmd + K, incluido su índice de búsqueda. Su propio README explica cómo añadir un comando.
- `src/scripts/site-interactions.ts` — eventos globales: copiar código, abrir la terminal, tabs de package manager y estado de la sidebar.

## Límites entre capas

- **Configuración:** `site.ts` e `icons.ts` definen el vocabulario y nada más.
- **Contenido:** los cuatro archivos de `src/lib/` cargan, validan, ordenan, relacionan, preparan la navegación y resuelven iconos sin conocer componentes.
- **Markdown:** `src/markdown/` transforma el contenido durante el build; nada de esa carpeta llega al cliente.
- **Presentación:** rutas, layouts y componentes renderizan modelos ya preparados; no repiten filtros ni agrupaciones.
- **Cliente:** React y `src/scripts/` solo contienen lo que debe correr en el navegador.
- **Features:** una parte de la interfaz con estado, datos y reglas propias vive completa en `src/features/<nombre>/`.

## Estilos

Tailwind v4 (`@tailwindcss/vite`), sin `tailwind.config`. Todos los tokens son variables CSS en `src/styles/tokens.css`; `global.css` solo importa parciales en orden de general a específico. Tema oscuro fijo y `--radius: 0rem`. Las fuentes (Geist Sans, Mono y Pixel) se sirven desde el propio sitio con Fontsource.

## Reglas de mantenimiento

- Node.js `>=22.12.0` y pnpm 11. No añadas otro gestor de paquetes.
- `site.ts` es la fuente de verdad: no dupliques configuración en componentes.
- Después de cambiar el esquema, `pnpm sync`. Para cualquier cambio, `pnpm check` y `pnpm build`.
- No guardes secretos ni datos reales en el repositorio.
