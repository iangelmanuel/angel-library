# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuario primario: el autor (Angel DM), desarrollador web hispanohablante, consultando mientras programa — necesita recordar un concepto, recuperar un comando o copiar una receta sin salir del flujo de trabajo.

Audiencia secundaria confirmada: otros desarrolladores hispanohablantes que llegan al sitio público como referencia. Las decisiones se toman primero para el uso personal, pero la biblioteca está pensada para que otros la usen.

## Product Purpose

`angel.library` es un segundo cerebro técnico: una biblioteca personal de conocimiento sobre desarrollo de software (guías, comandos, recetas, snippets, librerías, patrones, recursos) organizada por contexto en vez de como una lista plana de enlaces.

Éxito = recuperar lo que ya se aprendió y reutilizarlo en un proyecto real en segundos, sin releer un artículo completo.

## Positioning

Dos cosas la separan de un blog o de notas en Notion, confirmadas por el autor:

- **Reutilizable, no leíble.** El contenido son snippets, comandos y recetas listos para copiar en proyectos reales, no artículos largos para leer de corrido.
- **La terminal es la interfaz.** Buscar y navegar se hace por comandos (Ctrl/Cmd+K), no por menús de blog.

## Operating Context

- Se consulta desde el editor/terminal, en medio de una tarea de programación, normalmente buscando algo concreto que ya se guardó antes.
- Contenido escrito y consultado en español latinoamericano.
- Autoría por archivos: se añade una entrada creando un `.md` en `src/content/docs/<categoría>/<subcategoría>/`. La carpeta decide la categoría; mover el archivo lo recategoriza.
- El repositorio es público (GitHub, `iangelmanuel/angel-library`); se publica como sitio estático (Vercel, `angel-library.vercel.app`).

## Capabilities and Constraints

Restricciones vinculantes confirmadas por el autor:

- **Estático y casi sin JS.** Astro en modo `static`, sin backend. React solo en la terminal y la navegación móvil; el resto es `.astro`. Nada que exija cliente pesado.
- **Entradas `private` y `draft`.** Una entrada `private: true` conserva su ruta de detalle pero queda fuera de navegación, listados, tags y búsqueda. `draft: true` se ve en dev y se excluye del build de producción. Cualquier trabajo futuro debe respetar ambos filtros.

Capacidades y hechos técnicos actuales (implementación incumbente, no declarada inmutable por el autor):

- 737 entradas en 24 categorías y 170 subcategorías; el último build generó 1793 páginas.
- Tipos editoriales en uso: guides (419), resources (105), skills (80), libraries (40), patterns (19), recipes (19), utilities (12), hooks (9), practices (9), technologies (9), snippets (7), commands (4), tricks (3), integrations (2).
- `src/config/` reúne la configuración: `site.ts` (identidad y SEO), `catalog.ts` (categorías y subcategorías), `content-types.ts`, `sidebar.ts`, `icons.ts` y `navigation.ts`. Las rutas, el menú y la validación de build se derivan de esas fuentes.
- Starlight genera las páginas de documentación y el proyecto añade `/`, `/categories`, `/tipos/[type]`, `/tags`, 404, sitemap, robots y manifest.
- El build valida estructura de carpetas, relaciones rotas y enlaces internos muertos, y falla con mensaje en español.
- Búsqueda estática gestionada por Starlight y Pagefind; no existe un índice paralelo que mantener.
- Tema oscuro único (`<html class="dark">`), cantos finos (`--radius-thin: 2px`, `--radius: 4px`, `--radius-field: 6px`), Tailwind v4 sin config: los tokens son variables CSS en `src/styles/tokens.css` y `global.css` solo encadena los imports. Fuentes Geist Sans y Geist Mono autoalojadas — la Pixel salió del diseño.
- Sin test runner. `pnpm build` es la validación real; `pnpm check` corre diagnósticos de Astro/TypeScript.
- Portada propia (`src/features/landing/`) sin barra lateral, con sus estilos en `styles/landing.css` dentro de `@layer components`, como el resto de hojas del sitio.

Decisión abierta: el español latinoamericano y el dark-only son la implementación actual, pero el autor no los marcó como compromisos inamovibles; confirmar antes de tratarlos como intocables o de reemplazarlos. La estética sí quedó decidida en esta iteración: «El Esmalte» —campos rellenos sobre negro, sin cantos— y una terminal de búsqueda moderna; el pixel art y el cromo CRT quedaron descartados explícitamente (ver `DESIGN.md`).

## Brand Commitments

- Nombre: `angel.library`. Autor: Angel DM (`iangelmanuel`).
- Lema en uso: «Segundo cerebro técnico para desarrollo web.»
- Redes reales en `SITE.social`: GitHub, LinkedIn, X, Instagram, YouTube. TikTok no existe.

## Evidence on Hand

- Contenido real: 737 entradas Markdown propias en `src/content/docs/`.
- Documentación del repo: `README.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT_GUIDE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `src/features/landing/README.md`.
- Licencias reales: código MIT; contenido educativo CC BY-NC-SA 4.0.
- No existen testimonios, clientes, métricas de tráfico, precios ni casos de estudio. No inventarlos.

## Product Principles

1. **Recuperar vence a leer.** Cada superficie se juzga por qué tan rápido devuelve algo copiable, no por cuánto explica.
2. **Los archivos mandan.** La estructura de carpetas y `site.ts` son la verdad; la UI se deriva, nunca se mantiene a mano en paralelo.
3. **La terminal es el camino principal.** Comandos y teclado antes que menús; la navegación visual es el respaldo, no el eje.
4. **El build es la red de seguridad.** Si el contenido se rompe, el build falla — nada se degrada en silencio.
5. **Nada pesado en el cliente.** Interactividad solo donde paga su coste (terminal, nav móvil).

## Accessibility & Inclusion

No se estableció un estándar formal ni un requisito específico de usuario. `accessibility` existe como categoría de contenido, no como compromiso declarado del producto.
