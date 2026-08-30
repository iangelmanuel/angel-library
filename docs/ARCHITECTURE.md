# Arquitectura

## Qué es la aplicación

Angel Library es un sitio privado y estático construido con Astro 7. Funciona como segundo cerebro técnico: el contenido vive en colecciones Markdown locales, Astro genera las páginas y React se limita a las interacciones que necesitan estado en el cliente, como la búsqueda y la navegación móvil.

## Estructura principal

```text
.
├── astro.config.mjs
├── public/                  # Archivos estáticos servidos sin transformación
├── src/
│   ├── assets/              # Imágenes procesadas por Astro
│   ├── components/
│   │   ├── content/         # Tarjetas, metadatos y relaciones de las entradas
│   │   ├── layout/          # Header, sidebar, navegación móvil y footer
│   │   ├── shared/          # Componentes pequeños reutilizados por varias áreas
│   │   └── ui/              # Primitivas React realmente usadas
│   ├── features/
│   │   └── terminal/        # La consola: componentes, hooks, comandos y datos
│   ├── config/
│   │   ├── site.ts          # Tipos, categorías, stacks y orden
│   │   └── icons.ts         # Tabla única de iconos (Astro y React)
│   ├── content/             # Markdown organizado por colección
│   ├── content.config.ts    # Esquemas de las colecciones
│   ├── layouts/             # Documento base y composición de páginas
│   ├── lib/                 # Contenido, relaciones, navegación, iconos y Markdown
│   ├── pages/               # Rutas Astro y endpoints estáticos
│   ├── scripts/             # Interacciones globales del navegador
│   └── styles/global.css    # Tokens y estilos globales del sitio
└── docs/                    # Documentación interna del proyecto
```

## Flujo principal

1. `src/config/site.ts` define el vocabulario y el orden de la aplicación.
2. `src/content.config.ts` valida el frontmatter y Astro carga el Markdown de `src/content/`.
3. `src/lib/content.ts` carga, ordena y agrupa las entradas. Es el único sitio donde vive esa lógica.
4. Las rutas de `src/pages/` piden los datos que necesitan y los renderizan. Durante el build se validan las referencias entre entradas.
5. `DocsLayout.astro` compone navegación, contenido y tabla de contenidos. `BaseLayout.astro` define el documento HTML y carga las interacciones globales.
6. React hidrata únicamente la terminal (`src/features/terminal/`) y la navegación móvil.
7. `pnpm build` genera el sitio estático y falla si una referencia de contenido es inválida.

## Módulos importantes

- `src/config/site.ts`: fuente de verdad de tipos de contenido, categorías, grupos de navegación y stacks.
- `src/config/icons.ts`: tabla única de iconos. `BRAND_ICONS` son logos propios; `RECOLORED_ICONS` son iconos de lucide con un color fijo.
- `src/content.config.ts`: contratos de frontmatter por colección.
- `src/lib/content.ts`: cargar, ordenar, agrupar por categoría o stack, y tags.
- `src/lib/relations.ts`: valida referencias y calcula relaciones explícitas, inversas y por afinidad.
- `src/lib/nav.ts`: convierte configuración y contenido en el árbol que dibujan sidebar y menú móvil.
- `src/lib/icons.ts`: construye el SVG en build para `<Icon>`; `DynamicIcon.tsx` hace lo mismo en React desde la misma tabla.
- `src/lib/search.ts`: descarga el índice y configura Fuse.
- `src/features/terminal/`: la consola de `/search` y de Ctrl/Cmd + K. `commands/` tiene un archivo por familia de comandos, `hooks/` el estado y `components/` el render. Su propio README explica cómo añadir un comando.
- `src/scripts/site-interactions.ts`: eventos globales de búsqueda, navegación, copia, tabs de package manager y sidebar.
- `src/lib/remark-pm-tabs.mjs`, `src/lib/rehype-code-blocks.mjs` y `src/lib/shiki-transformers.mjs`: pipeline de bloques de código.

## Límites entre capas

- **Configuración:** `site.ts` e `icons.ts` definen el vocabulario. Los ids se derivan de las claves de sus mapas; no hay listas paralelas que mantener.
- **Contenido:** `content.ts` y `relations.ts` cargan, validan, ordenan y relacionan entradas sin conocer componentes.
- **Presentación:** rutas, layouts y componentes renderizan modelos ya preparados; no repiten filtros ni agrupaciones.
- **Cliente:** React y `src/scripts/` solo contienen lo que debe correr en el navegador.
- **Features:** cuando una parte de la interfaz tiene estado, datos y reglas propias, vive completa en `src/features/<nombre>/` en vez de repartirse entre carpetas por tipo de archivo.

## Cómo añadir código o contenido

- Para añadir contenido, crea un `.md` en `src/content/<colección>/`. Las rutas se generan solas.
- Usa referencias con namespace, por ejemplo `technologies/react`. No dupliques relaciones inversas: las calcula `relations.ts`.
- Modifica primero `src/config/site.ts` cuando añadas tipos, categorías, stacks u orden de navegación.
- Los iconos nuevos van en `src/config/icons.ts`, un único sitio para Astro y React.
- Los comandos personales van en `src/content/commands/` con `private: true`.
- Mantén Astro para contenido y composición; usa React solo cuando la interacción necesite estado en el cliente.

El procedimiento completo está en [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

## Reglas de mantenimiento

- Usa Node.js `>=22.12.0`, pnpm 11 y no añadas otro gestor de paquetes.
- Conserva `site.ts` como fuente de verdad y evita duplicar configuración en componentes.
- Prefiere módulos explícitos con una sola responsabilidad; no crees capas sin un consumidor real.
- Después de cambiar esquemas ejecuta `pnpm sync`. Para cualquier cambio ejecuta `pnpm check` y `pnpm build`.
- No guardes secretos ni datos reales en el repositorio.
