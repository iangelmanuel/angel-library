# Arquitectura

## Qué es la aplicación

Angel Library es un sitio privado y estático construido con Astro 7. Funciona como segundo cerebro técnico: el contenido vive en colecciones Markdown locales, Astro genera las páginas y React se limita a las interacciones que necesitan estado en el cliente, como la búsqueda y la navegación móvil.

## Estructura principal

```text
.
├── astro.config.mjs
├── scripts/
│   └── new-content.ts       # Generador y catálogo interactivo de contenido
├── public/                  # Archivos estáticos servidos sin transformación
├── src/
│   ├── assets/              # Imágenes procesadas por Astro
│   ├── components/
│   │   ├── content/         # Tarjetas, metadatos y relaciones de las entradas
│   │   ├── layout/          # Header, sidebar, navegación móvil y footer
│   │   ├── search/          # Terminal de búsqueda, comandos y sus datos
│   │   ├── shared/          # Componentes pequeños reutilizados por varias áreas
│   │   └── ui/              # Primitivas React realmente usadas
│   ├── config/site.ts       # Fuente de verdad de tipos, categorías, stacks y orden
│   ├── content/             # Markdown organizado por colección
│   ├── content.config.ts    # Esquemas de las colecciones
│   ├── layouts/             # Documento base y composición de páginas de documentación
│   ├── lib/                 # Carga, relaciones, navegación, iconos y Markdown
│   ├── pages/               # Rutas Astro y endpoints estáticos
│   ├── scripts/             # Interacciones globales del navegador
│   └── styles/global.css    # Tokens y estilos globales del sitio
└── docs/                    # Documentación interna del proyecto
```

## Flujo principal

1. `src/config/site.ts` define el vocabulario y el orden de la aplicación.
2. `src/content.config.ts` valida el frontmatter y Astro carga el Markdown de `src/content/`.
3. `src/lib/content-groups.ts` aplica una sola vez las reglas editoriales de agrupación; `src/lib/page-data.ts` conserva únicamente las preparaciones de página que combinan varias operaciones.
4. Las rutas dinámicas de `src/pages/[type]/` componen directamente los helpers sencillos y renderizan los resultados. Durante el build se validan referencias y relaciones.
5. `DocsLayout.astro` compone navegación, contenido y tabla de contenidos. `BaseLayout.astro` define el documento HTML y carga las interacciones globales.
6. React hidrata únicamente la búsqueda global, sus resultados y la navegación móvil.
7. `pnpm build` genera el sitio estático y falla si una relación de contenido es inválida.

## Módulos importantes

- `src/config/site.ts`: única fuente de verdad para tipos de contenido, categorías, grupos, stacks, iconos y orden de navegación.
- `src/content.config.ts`: contratos de frontmatter por colección.
- `src/lib/content.ts`: carga, claves, URLs, orden y utilidades de contenido.
- `src/lib/content-groups.ts`: reglas únicas para agrupar por categoría, stack o categoría de recurso.
- `src/lib/page-data.ts`: preparación de inicio, detalle e índice de búsqueda, donde sí intervienen varias operaciones.
- `src/lib/relations.ts`: valida referencias y calcula relaciones explícitas, inversas y por afinidad.
- `src/lib/nav.ts`: transforma la configuración y el contenido en el árbol consumido por desktop y móvil.
- `src/lib/icons.ts` y `src/components/shared/DynamicIcon.tsx`: registros independientes de iconos para Astro y React.
- `src/lib/search.ts`: carga el índice y configura Fuse.
- `src/components/search/terminal.ts`: tipos, comandos, textos y funciones puras de la terminal.
- `src/components/search/SearchResults.tsx`: estado, ejecución de comandos y renderizado de la terminal.
- `src/scripts/site-interactions.ts`: eventos globales de búsqueda, navegación, copia, tabs de package manager y sincronización de sidebar.
- `scripts/new-content.ts`: crea borradores válidos y presenta el catálogo derivado de la configuración.
- `src/lib/remark-pm-tabs.mjs`, `src/lib/rehype-code-blocks.mjs` y `src/lib/shiki-transformers.mjs`: pipeline de bloques de código Markdown.

## Límites entre capas

- **Configuración:** `site.ts` define el vocabulario editorial. Los IDs se derivan de sus mapas cuando comparten orden; `CATEGORY_IDS` permanece explícito porque su orden público es distinto del orden visual de navegación.
- **Contenido:** `content.ts`, `relations.ts` y `content-groups.ts` cargan, validan, ordenan y relacionan entradas sin conocer componentes.
- **Preparación compleja:** `page-data.ts` combina operaciones solo cuando dejarlas en una ruta ocultaría su propósito.
- **Presentación:** las rutas, layouts y componentes renderizan modelos ya preparados; no vuelven a implementar filtros o agrupaciones.
- **Cliente:** React y `src/scripts/` contienen únicamente comportamiento que debe ejecutarse en el navegador.

## Cómo añadir código o contenido

- Para añadir contenido, usa `pnpm content:new`; las rutas se generan automáticamente.
- Usa referencias con namespace, por ejemplo `technologies/react`. No dupliques relaciones inversas que ya calcula `relations.ts`.
- Modifica primero `src/config/site.ts` cuando añadas tipos, categorías, stacks, etiquetas u orden de navegación.
- Si introduces un icono nuevo en la configuración, regístralo tanto en `src/lib/icons.ts` como en `src/components/shared/DynamicIcon.tsx`.
- Los comandos personales pertenecen a `src/content/commands/` con `private: true`.
- Mantén Astro para contenido y composición; usa React solo cuando la interacción requiera estado en el cliente.

El procedimiento completo, incluidos ejemplos y ampliaciones de categorías o stacks, está en [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

## Reglas de mantenimiento

- Usa Node.js `>=22.12.0`, pnpm 11 y no añadas otro gestor de paquetes.
- Conserva `site.ts` como fuente de verdad y evita duplicar configuración en componentes.
- Prefiere módulos explícitos con una sola responsabilidad; no crees capas o abstracciones sin un consumidor real.
- Después de cambiar esquemas ejecuta `pnpm sync`. Para cualquier cambio ejecuta `pnpm check` y `pnpm build`.
- No guardes secretos ni datos reales en el repositorio.
