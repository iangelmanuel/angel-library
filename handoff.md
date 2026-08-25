# Handoff — angel.library

Resumen para retomar sin releer todo el historial. Reemplaza el handoff anterior (Backend, Git & GitHub, IA Tools & Skills) — esta cubre lo que se sumó después: Docker, Terminal & CLI, SEO (Astro/Next.js) + patrón `SITE`, Arquitectura (principios/patrones), y un refinamiento grande de plataforma (progreso de lectura, tabs de package manager, scroll-spy del TOC).

## 1. Objetivo de esta sesión

- Crear **Docker** dentro de la categoría `devops` ya existente: 6 subcategorías, de conceptos básicos a Compose, con una sección propia para levantar Postgres.
- Crear **Terminal & CLI** (categoría nueva): subcategoría Terminal (gestión de archivos multiplataforma Win/Mac/Linux, comandos importantes, 12 herramientas instalables) + subcategoría CLI (13 CLIs de servicios).
- Nutrir **IA Tools & Skills → Comandos**: traducir los 5 comandos existentes de voseo argentino a inglés (son prompts para IA, no prosa del sitio) + 5 comandos nuevos (`/code-audit`, `/refactor`, `/explain`, `/add-tests`, `/pr-description`).
- Agregar `canirun.ai` a Recursos/IA.
- Guía de alias de imports en TypeScript (`tsconfig` `paths`).
- Crear **Frontend → SEO**: dos recetas completas paso a paso ("SEO completo en Astro" / "SEO completo en Next.js"), dos skills reales de Claude Code (carpeta `SKILL.md` + `references/`, no un resumen), y un patrón `SITE` (variable global de configuración) en la subcategoría `libs`.
- Crear **Arquitectura**: 3 subcategorías nuevas — Principios (SOLID, DRY/KISS/YAGNI, etc.), Patrones de diseño (GoF relevantes a JS/TS), Patrones arquitectónicos (MVC, hexagonal, repository, DI, event-driven, monolito vs microservicios).
- Refinamiento de plataforma (no contenido): barra de progreso de lectura, tabs pnpm/bun/npm automáticos en **todo** comando `npm install`/`npx` del sitio, deduplicar instalación repetida en `libraries`, scroll-spy en el TOC.

## 2. Estado al terminar

**Build limpio**: `pnpm build` → 726 páginas, 0 errores. `pnpm check` → 0 errores (mismo warning preexistente de `execCommand`, sin tocar). **367 archivos de contenido en total** (+95 sobre el handoff anterior).

### Docker (`category: devops`) — 25 archivos

6 subcategorías nuevas (`stack: docker-conceptos/imagenes/contenedores/redes-volumenes/compose/bases-datos`): conceptos (4), imágenes (6), contenedores (5), redes/volúmenes (3), Compose (4), bases de datos — Postgres con `docker run` y con Compose (3).

### Terminal & CLI (`category: terminal`, nueva) — 35 archivos

| Subcategoría | Contenido |
| --- | --- |
| Terminal (`stack: terminal`) | Gestión de archivos/directorios multiplataforma (5), comandos importantes — procesos, puertos, red (5), guía puente a Docker (1), 11 herramientas instalables (Chocolatey, nvm, pnpm, npm, bun, curl, PowerShell, Linux CLI, SSH, WSL, Scoop) |
| CLI (`stack: cli`) | 13 CLIs: Vercel, Supabase, Prisma, Astro, Wrangler, AWS, Railway, Turso, Neon, OpenAI, OpenRouter, Cloudinary, Playwright — investigados contra doc oficial, no inventados |

**Ojo con dos casos**: OpenRouter no tiene CLI oficial de gestión (la guía lo dice y documenta el patrón real vía API/SDK); el CLI viejo de `pip install openai` está deprecado, hoy es un binario Go separado — se evitaron nombres de modelo no verificados.

### SEO (`category: frontend`, `stack: seo`, nueva) — 4 archivos + patrón

- `recipes/astro-seo-completo.md` y `recipes/nextjs-seo-completo.md`: paso a paso completo (SITE.seo → JsonLd → helpers de schema.org → meta tags/Metadata API → manifest/robots/sitemap → caso de uso), datos de una empresa simulada (**Acme**) consistentes entre las dos.
- `skills/skill-seo-astro.md` y `skills/skill-seo-nextjs.md`: skill real de Claude Code (`SKILL.md` liviano + carpeta `references/` con el código completo, no un resumen) — detecta solo si migrar o generar de cero.
- `patterns/site-config-global.md`: el objeto `SITE` completo (identidad, ubicación, contacto, redes, navegación, horarios, legal, stats, y el bloque `seo`) — ahora vive en `Frontend → Libs` porque aplica más allá del SEO. La implementación usa `src/config/site.ts` y `@/config/site` en Astro, Next.js y los demás frameworks documentados. **La estructura la reescribió el usuario a mitad de sesión** (agregó wrapper `info`, `teams`, `navigation`, `site` técnico) — se resincronizaron los 4 archivos de arriba para que usen `SITE.info.*` en vez de los paths viejos (`SITE.name`, `SITE.company.*`).

### Arquitectura (`category: architecture`) — 23 archivos + 1 integrado

| Subcategoría | Contenido |
| --- | --- |
| Principios (`stack: principios`) | SOLID, DRY/KISS/YAGNI, cohesión/acoplamiento, composición sobre herencia, deuda técnica, ADR (6) — más `practices/validate-at-boundaries.md` que ya existía, ahora integrado a este stack |
| Patrones de diseño (`stack: patrones-diseno`) | Los GoF relevantes a JS/TS con ejemplos idiomáticos (funciones/closures, no clases traducidas de Java): Factory/Singleton/Builder, Adapter/Facade/Decorator/Proxy, Observer/Strategy/Command (10) |
| Patrones arquitectónicos (`stack: patrones-arquitectonicos`) | MVC (conceptual, linkea a `patterns/backend-mvc-structure.md` real), capas, hexagonal, repository, DI, event-driven, monolito vs microservicios (7) |

### Refinamiento de plataforma (sin contenido nuevo)

1. **Barra de progreso de lectura** — `components/layout/ReadingProgress.astro`, franja azul (`--accent-blue`) fija arriba, solo en páginas de entrada (no en listados). Mide contra `<article>` completo, no solo `.markdown` — medirlo solo contra `.markdown` hacía que la barra "empezara tarde" (había que scrollear todo el header/meta de la entrada antes de que reaccionara).
2. **Tabs pnpm → bun → npm automáticos**, sitio completo, no solo `libraries`: pipeline nuevo `pm-commands.mjs` (traductor) → `remark-pm-tabs.mjs` (detecta bloques bash de `npm install`/`i`/`npx` y los triplica en pnpm/bun/npm) → `transformerPackageManagerMeta` en Shiki → agrupado en `rehype-code-blocks.mjs` → handler de tabs + persistencia en `localStorage` en `BaseLayout.astro`. El campo `install:` de `libraries` (renderizado por `EntryMeta.astro`) usa la misma función traductora.
3. **Deduplicación de instalación** en `libraries/*.md` — 10 archivos reales tenían el comando de instalación dos veces (una vez en `EntryMeta` vía frontmatter, otra a mano en el cuerpo).
4. **Scroll-spy en el TOC** (`Toc.astro`) — marca el heading activo según scroll, mismo azul que los tabs.

## 3. Arquitectura — qué se extendió

- **`src/config/site.ts`**: `STACK_IDS` sumó `docker-*` (6), `terminal`/`cli`, `seo`, `principios`/`patrones-diseno`/`patrones-arquitectonicos`. `STACK_GROUPED_CATEGORIES` sumó `devops`, `terminal`, `architecture` (además de `general`, que el usuario agregó en paralelo con stacks `css`/`utils` propios — no tocado, solo respetado). Nueva categoría `terminal` completa (`CATEGORY_IDS`/`CATEGORIES`).
- **Íconos**: por cada stack nuevo, una entrada en `RECOLORED_ICONS` (`icons.ts`) + su espejo en `DynamicIcon.tsx` (los "dos sistemas" que exige `CLAUDE.md` — varias veces se rompió el build por desincronizarlos, ver lecciones). Cambios visuales pedidos por el usuario: CSS pasó del glifo `{}` al escudo real de CSS3 (hermano del de HTML5 ya existente); Utils y la guía de alias de TS comparten el glifo "TS" de TypeScript; `libs` usa el icono verde de paquete.
- **`iconFor()` en `nav.ts`**: mecanismo de casos especiales (ya existía para Zod) usado para forzar el ícono de una entrada puntual sin stack propio — se usa para la guía de alias de TS; el patrón `SITE` ahora recibe el icono de `libs` por su stack.
- **Pipeline de Markdown** (`astro.config.mjs`): antes solo tenía `rehypePlugins`. Ahora también `remarkPlugins: [remarkPmTabs]` — mismo patrón que ya usaba `transformerCodeFilename()` para `title="..."` (meta del fence → atributo `data-*` en el `<pre>` de Shiki → un plugin rehype arma la estructura final), aplicado ahora a la detección de comandos npm.

## 4. Intentos fallidos / bugs propios / lecciones de esta sesión

- **Bug propio real, atrapado antes del build**: al agrupar tríos de `<pre>` pnpm/bun/npm en `rehype-code-blocks.mjs`, el primer pase volvía a visitar el wrapper recién creado y lo re-agrupaba — recursión infinita. Fix: borrar el marcador `data-pm-group` de cada `<pre>` apenas se consume.
- **Bug propio real, en contenido**: al borrar el ícono `brand-utils` pensando que quedaba huérfano tras un pedido de cambio de ícono, rompió el build — las entradas de `utilities/*.md` calculan su ícono como `brand-${stack}` directo (no vía `STACKS[stack].icon`), sin ese ícono no resuelve. Se restauró apuntando al mismo glifo de TS.
- **Auditoría de bugs reales en las recetas de SEO** (el usuario pidió explícitamente revisar si "conecta todo"): título duplicado en la home de Astro (default siempre truthy), `og:image:width/height` hardcodeados aunque los campos ya existían, `Layout.astro` sin importar `SITE`, `hreflang` fijo en vez de iterar — y en Next.js: `app/manifest.ts` **completamente faltante** aunque el layout ya lo linkeaba, `imageAlt` con fallback incorrecto (al título en vez de a la imagen), y `SITE.seo.languages` definido pero sin ningún consumidor real.
- **Bug propio en mi propia auditoría de duplicados**: el primer escaneo para el punto de deduplicación (`libraries` con `install:` repetido en el cuerpo) comparaba mal — contra la propia línea de frontmatter, no contra el cuerpo real — e infló el resultado a "30 archivos duplicados". El recuento correcto, con el frontmatter excluido de verdad, era **10**. Se corrigió antes de tocar los 20 archivos de más que no tenían nada que arreglar.
- **`grep` sobre HTML tokenizado por Shiki da falsos negativos**: Shiki envuelve cada palabra de un comando en su propio `<span>`, así que un patrón como `grep -oE 'pnpm add[^<]*'` no encuentra texto que sí está ahí, partido entre spans. Dos veces se persiguió un "bug" que no existía por esto — la forma confiable de inspeccionar HTML generado por Shiki es con `node -e` leyendo el archivo y haciendo slice, no `grep`.
- **El navegador de este entorno no compone frames en background**: los `screenshot` fallan siempre ("Browser pane no está mostrado"), y acciones de `scroll` programático tampoco parecen aplicar (verificado: `window.scrollTo()` no movió `scrollY`). La verificación de todo lo que depende de scroll real (barra de progreso moviéndose, scroll-spy del TOC activándose) quedó por revisión de código + chequeos estructurales vía JS (estado de clases, `localStorage`), no visual. **Pendiente que el usuario lo mire con sus propios ojos.**
- **Un mensaje propio salió corrupto** (texto repetido sin sentido) en un punto de la sesión — se lo marqué al usuario y seguimos, sin causa identificada.

## 5. Próximos pasos / cosas a decidir

1. **Verificación visual real pendiente**: barra de progreso moviéndose con el scroll, y si el offset de activación del scroll-spy del TOC (96px desde arriba) se siente bien o hay que ajustarlo.
2. **Segunda categoría nueva, nunca definida**: al empezar Docker el usuario dijo "la segunda la haremos cuando terminemos Docker" y no volvió sobre eso — confirmar si sigue en pie y cuál es.
3. **Catálogos que van a desactualizarse** (ya era lección del handoff anterior, sigue vigente y ahora aplica también a Terminal & CLI): instalaciones/nombres de paquete de las 13 CLIs y las 12 herramientas instalables cambian con el tiempo, no son un "documentar una vez y listo".
4. **Nada commiteado en git en toda la sesión** (ni en esta ni en la anterior) — sigue acumulándose trabajo sin respaldo. Vale la pena parar y armar un commit (o varios) antes de seguir sumando.
5. **`tricks` collection declarada pero sin contenido** (`src/content/tricks/` no existe) — warning inofensivo en cada build, nunca se pidió resolverlo, sigue ahí.
6. **Sin tests ni linter** — sigue siendo solo `pnpm build` + `pnpm check`.
