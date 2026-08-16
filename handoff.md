# Handoff — angel.library

Sesión larga. Resumen para retomar sin releer todo el historial.

## 1. Objetivo

Biblioteca personal de conocimiento técnico (Astro + Markdown, estática, español). Durante esta sesión:

- Reorganizar `general` (JS/CSS/TS) con orden e iconos coherentes.
- Documentar Zod a fondo.
- Crear una sección **Frontend** con subcategorías **Astro / React / Next.js**, cada una con temas nativos del framework, dependencias (npm) y kits de componentes, bien diferenciados por icono y agrupados en el sidebar — mismo patrón que ya usaba `Recursos` con sus subcategorías.
- Cubrir una lista de temas específicos por stack que el usuario fue dando (y ampliando) a lo largo de la sesión.

## 2. En qué estado terminó todo

**Build limpio**: `pnpm build` → 219 páginas, 0 errores. `pnpm check` → 0 errores, 0 warnings nuevos (solo 1 warning preexistente de `execCommand` deprecado en `BaseLayout.astro`, no se tocó).

**Sidebar "Frontend"** con 3 subgrupos agrupados y ordenados (campo `order` en frontmatter, no alfabético):

| Stack | Entradas | Icono nativo |
| --- | --- | --- |
| Astro | 17 (15 guías + 2 libs) | Cohete naranja `#FF5D01` (logo real) |
| React | 19 (8 hooks + 9 libs + 2 kits) | Átomo cian `#61dafb` (mismo SVG que usa React) |
| Next.js | 18 (todas guías) | Círculo/N blanco `#ececee` (logo real) |

Reglas de icono (aplican en toda la librería, no solo Frontend): `libraries` → paquete verde `#4ade80`; `components` → icono amarillo `#facc15`; Zod → "Z" cian (caso especial); `language: css`/`typescript` → glifo de marca; resto → icono genérico del tipo.

**`general`** (JS/CSS/TS): Zod primero, después 7 snippets CSS, después 9 utilities JS/TS, todo agrupado por `order`/lenguaje.

**Botón "copiar código completo"** en cada entrada con bloques `title="archivo.ts"` — junta todo el archivo real en un solo copy.

## 3. Archivos y cambios que realizaste

### Arquitectura (tocar esto para entender el sistema)

- `src/config/site.ts` — `STACK_IDS`/`STACKS`/`STACK_LIST` (astro/react/nextjs).
- `src/content.config.ts` — campos `stack` y `order` agregados a `baseFields` (opcionales, afectan a toda colección).
- `src/lib/nav.ts` — `iconFor()` (reglas de icono descritas arriba), `sortForNav()` (respeta `order`), `stackGroups` (análogo a `resourceGroups` pero por stack).
- `src/lib/icons.ts` — logos de marca a mano (`BRAND_ICONS`) + recoloreo de iconos lucide (`RECOLORED_ICONS`). Sin dependencia de `simple-icons` (se probó y se sacó, ver sección 4).
- `src/components/shared/DynamicIcon.tsx` — mismos logos duplicados a mano para las islas React (Sidebar usa Astro, MobileNav usa React — dos sistemas, hay que tocar los dos).
- `src/components/layout/Sidebar.astro` / `MobileNav.tsx` — renderizan `resourceGroups ?? stackGroups`, más los items sueltos (entradas sin `stack`) debajo.
- `src/pages/categories/[category].astro` — agrupa por stack cuando `category.id === 'frontend'`.
- `src/pages/[type]/[...slug].astro` + `src/layouts/BaseLayout.astro` — botón "copiar código completo" (detecta bloques con `title=` en el markdown crudo, concatena en el click).
- `.claude/launch.json` — nuevo, apunta el preview a `pnpm dev` en 4321.

### Contenido nuevo

| Carpeta | Qué hay | Cantidad |
| --- | --- | --- |
| `src/content/utilities/` | dom (renombrado), form, array, string, storage, date, number, fetch, clipboard | 9 |
| `src/content/snippets/` | css-reset, css-variables, css-fonts, css-gradients, css-animations, css-layout-tricks, css-scroll | 7 |
| `src/content/libraries/` | zod (reescrito), react-hook-form (actualizado), zustand, motion, atropos, react-dropzone, react-email, react-router, axios, tanstack-query, nanostores, gsap | 12 |
| `src/content/components/` | shadcn-ui, magicui | 2 |
| `src/content/guides/` (Astro) | astro-islas, astro-layouts, astro-directivas, astro-global-object, astro-styles, astro-image-picture, astro-get-static-paths, astro-content-collections, astro-view-transitions, astro-env-vars, astro-endpoints, astro-server-actions, astro-middleware, astro-server-islands, astro-integrations | 15 |
| `src/content/guides/` (React) | react-usestate, react-context-api, react-usereducer, react-useref, react-useeffect, react-usetransition, react-useoptimistic, react-useactionstate | 8 |
| `src/content/guides/` (Next.js) | nextjs-directivas, nextjs-layouts, nextjs-page-error-loading, nextjs-params-searchparams, nextjs-link, nextjs-usepathname, nextjs-usesearchparams, nextjs-userouter, nextjs-redirect-notfound, nextjs-generate-static-params, nextjs-server-actions, nextjs-endpoints, nextjs-proxy, nextjs-metadata-seo, nextjs-fetching-revalidate, nextjs-revalidate-path, nextjs-font, nextjs-image | 18 |

### Borrado / limpiado

- `src/content/technologies/css.md`, `javascript.md` — placeholders sin contenido real.
- `src/content/tricks/formdata-to-object.md` — reemplazado por `utilities/form.md` (más completo). La colección `tricks` quedó vacía (0 entradas, es válido).
- Referencias rotas limpiadas en `node.md`, `zod.md` y varios `resources/*.md` que apuntaban a los `.md` borrados.

## 4. Intentos fallidos

- **Iconos de marca, primer intento**: usé letras simples (A de Astro, N de Next) para todo. El usuario rechazó la de Astro ("una A no es suficiente") y el cuadro verde literal de "dependencia" ("no un cuadro, un icono de paquete"). Se corrigió con el logo real de Astro (SVG oficial) y el icono `package` de lucide recoloreado. Next.js quedó con letra hasta que, en la última ronda, también pidió el logo real — ya está corregido.
- **`simple-icons` como dependencia npm**: se instaló para sacar los paths de CSS/TS/Zod, después el usuario pidió iconos más simples (no logos completos) y se desinstaló. Para el logo real de Astro/Next.js más adelante, en vez de reinstalar el paquete, se usó `curl` contra el CDN de jsdelivr — mismo resultado, sin agregar dependencia.
- **Regex con diacríticos en `string.md`**: al escribir `slugify()`, tipear el rango Unicode de marcas diacríticas como caracter literal en el `Edit` tool resultó en un no-op silencioso (el editor normalizaba el string y el "antes"/"después" quedaban idénticos). Se resolvió generando la línea con Node (construyendo el string por code points) para garantizar el escape `̀-ͯ` literal en el archivo.
- **Cache de content layer corrupta**: un `rm -rf node_modules/.astro` a mitad de sesión, con un dev server corriendo, lo dejó en un estado roto (Astro perdía el lock del proceso). Hubo que matar el proceso huérfano y reiniciar limpio más de una vez a lo largo de la sesión — quedó como hábito: siempre limpiar `dist .astro node_modules/.astro` **antes** de levantar el preview, no mientras corre.
- **Puerto 4321 ocupado repetidamente**: procesos de preview anteriores quedaban colgados: hubo que matarlos a mano (`Stop-Process`) varias veces antes de cada verificación en navegador.
- **Tool `navigate` reportando "denied or failed"** en varias ocasiones aunque la página cargaba bien por debajo (confirmado con `document.title`/`javascript_exec`) — no es un bug del sitio, es un falso negativo del tool en este entorno. Se aprendió a no confiar en su status y verificar con JS directo.

## 5. Próximos pasos exactos

1. **Repasar el contenido de Next.js con ojo crítico de versión**: se documentó contra Next 16.3.1 (docs oficiales en vivo, verificado con fetch real), que incluye conceptos muy nuevos (`proxy.ts` reemplazando a `middleware.ts`, Cache Components/`use cache` como modelo opcional). Si el proyecto real del usuario usa una versión de Next más vieja, confirmar qué partes aplican.
2. **Revisar en navegador, no solo build**: se verificó estructura/orden/iconos con scripts JS, pero no hubo revisión visual real (screenshots) porque el entorno no soporta captura en este sesión. Vale la pena que el usuario abra `/categories/frontend` y las 3 subcategorías con sus propios ojos.
3. **Decidir si "general" necesita más CSS** — quedó en 7 entradas a propósito ("no tantas como las Utils"); si hace falta más (grid/flexbox a fondo, container queries, etc.), es la próxima ronda natural ahí.
4. **Evaluar si el patrón de subcategorías (`stack`) se extiende a otras categorías** — hoy solo `frontend` lo usa (Astro/React/Next.js), pero la arquitectura en `nav.ts`/`site.ts` ya es genérica: agregar un stack nuevo es solo sumarlo a `STACK_IDS`/`STACKS` en `site.ts`.
5. **Sin tests ni linter configurados** — `pnpm build` + `pnpm check` siguen siendo la única validación real. Si el contenido sigue creciendo mucho, considerar si vale la pena algo más (no se tocó nada de esto esta sesión, es solo una observación).
