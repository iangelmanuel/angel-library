# Handoff — angel.library

Resumen para retomar sin releer todo el historial. Reemplaza el handoff anterior (Docker, Terminal & CLI, SEO + patrón `SITE`, Arquitectura, refinamiento de plataforma) — esta cubre una sesión larga y muy distinta: **rediseño visual completo del sitio**, reorganización de taxonomía, categoría Aplicaciones ampliada y auditada, documentación completa de monorepos, y un endurecimiento del patrón `SITE`/SEO tras una revisión línea por línea del usuario.

## 1. Objetivo de esta sesión

No fue un objetivo único — fue una sesión larga de iteración continua sobre el mismo sitio, en este orden real:

1. **Rediseño visual completo**: tema de código, tipografías, sistema de color de encabezados, tags, badges, logo, y la navegación lateral entera.
2. **Reorganización de taxonomía**: `General → Libs` renombrado a `Config` + guía de Prettier, categoría `Herramientas` eliminada, `Git & GitHub` reorganizada con una subcategoría `Perfil y cuenta` nueva, `IA` relabeleada a `IA SDK`.
3. **Sidebar rediseñada de cero**: bloques agrupados (`CATEGORY_GROUPS`), jerarquía de tres niveles por tipografía en vez de sangría, scroll que seguía a la entrada activa.
4. **Categoría Aplicaciones auditada y ampliada**: instalación verificada en las 4 que ya existían + 5 aplicaciones nuevas.
5. **Documentación completa de monorepos**: 5 guías nuevas (qué es, pnpm, npm, Bun, ejemplo real de frontend + backend).
6. **Auditoría de Utilities**: 3 archivos sin descripciones por función, corregidos.
7. **Versionado**: `CHANGELOG.md` + `package.json` a `0.4.0`.
8. **Endurecimiento del patrón SEO/SITE**: el usuario revisó el código de `seo.ts` línea por línea, encontró un valor hardcodeado (`"LATAM"`) que no salía de `SITE`, y una falta real de documentación (`SERVICES`/`FAQ_ITEMS` nunca definidos en ningún lado) — ambas corregidas.

## 2. Estado al terminar

**Build limpio**: `pnpm build` → **1415 páginas**, 0 errores. `pnpm check` → 0 errores (mismo warning preexistente de `execCommand`, sin tocar). **609 archivos de contenido en total** (+5 netos sobre el handoff anterior: +15 nuevos, −10 de Herramientas eliminada).

**Git en buen estado**: a diferencia de handoffs anteriores, esta vez la mayoría del trabajo de la sesión **quedó commiteado** (commit `3b70373`, "refactor: remove outdated guides and improve navigation structure"). Solo quedan **7 archivos sin commitear** al cierre — el fix de `contactRegion`/`SERVICES`/`FAQ_ITEMS` del último tramo (`myastro.md`, `mynext.md`, `site-config-global.md`, `astro-seo-completo.md`, `nextjs-seo-completo.md`, `skill-seo-astro.md`, `skill-seo-nextjs.md`). Vale la pena un commit chico para cerrar esto.

`tricks` ya no está vacía (3 archivos) — el warning que arrastraban los últimos 2-3 handoffs se resolvió solo en algún punto entre sesiones.

### 2.1 Rediseño visual — estado final

Se iteró mucho en vivo con el usuario (varias vueltas de "no me gusta, probemos otra cosa"); esto es el estado **final**, no el recorrido:

| Elemento                                   | Estado final                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Tema de código (Shiki)                     | `tokyo-night` (bundled) — se probaron antes un tema Vercel a mano y `vitesse-black`              |
| Fuente de código                           | Fira Code (se probó Cascadia Code antes, el usuario la rechazó)                                  |
| Fuente de texto general                    | JetBrains Mono (reemplaza a Geist Sans en `--font-sans`)                                         |
| Fuente de títulos/badges                   | Geist Pixel (sin cambios)                                                                        |
| Título (h1)                                | Naranja (`--accent-orange`)                                                                      |
| Subtítulo (h2)                             | Amarillo (`--accent-yellow`)                                                                     |
| h3                                         | Cian (`--accent-cyan`)                                                                           |
| h4                                         | Gris apagado (`--muted-foreground`)                                                              |
| `section-label` (etiquetas de sección)     | Azul (`--accent-blue`)                                                                           |
| Tags                                       | Morado único, estilo pill (se probó color por hash del texto, el usuario lo rechazó)             |
| Badges por defecto (accesos rápidos, home) | Gris terminal (`--accent-slate`)                                                                 |
| Código inline en texto                     | Sin fondo, solo borde, Geist Pixel (se probaron pills naranja y azul con acento antes)           |
| Nav-link activo (sidebar)                  | Cursor `❯` estilo terminal, coloreado por categoría (se probaron caja rellena y subrayado antes) |
| Logo                                       | Pixel art real (`src/assets/logo/`), en header y favicon, con ciclo de color al hover            |

Se instaló `sharp` (primera vez que el proyecto usa `astro:assets` para optimizar imágenes).

### 2.2 Sidebar — rediseño estructural

`CATEGORY_GROUPS` nuevo en `site.ts`: 5 bloques separados por línea — construir (General/Lenguajes/Frontend/Backend/BD/Testing/DevOps), producto (UI-UX/IA SDK/IA Tools & Skills), flujo (Git & GitHub/Terminal), calidad (Arquitectura/Seguridad/Performance/Accesibilidad/SEO), referencia (Aplicaciones/Recursos). `CATEGORY_LIST` ahora se **deriva** de `CATEGORY_GROUPS`, con un guard en build que rompe si una categoría queda sin grupo asignado.

Jerarquía de 3 niveles por tipografía (13px categoría con color propio → 11.5px subcategoría en mono → 12.5px entrada), no por sangría — el diseño viejo llegaba a 548 de 599 enlaces truncados por sangría acumulada; el nuevo da 0 truncados. El sidebar sigue a la entrada activa con scroll propio (nunca mueve el documento), y acompaña la apertura de una categoría larga si el contenido queda fuera de vista.

Contador numérico por categoría/subcategoría (`.nav-count`) — se agregó y después se **sacó** a pedido del usuario.

### 2.3 Reorganización de taxonomía

- `General → Libs` (`stack: libs`) renombrado a `Config` (`stack: config`, ícono `settings-2`). Zod sigue viviendo ahí aunque el nombre "Config" le queda raro — **pendiente de decidir**, el usuario no lo resolvió cuando se lo señalé.
- Categoría **Herramientas eliminada por completo**: 10 archivos borrados (incluidas 3 guías editoriales sobre cómo mantener la propia biblioteca — el usuario eligió borrar todo, sin rescatarlas). Se limpiaron referencias entrantes en 4 archivos que sobrevivieron para no romper el build.
- **Git & GitHub reorganizada**: `github-actions` (categoría separada) fusionada como subcategoría. Subcategoría nueva **Perfil y cuenta** con 4 guías (README de perfil como PWA/repo especial, presentación pública, claves SSH, firma de commits) — cubre un hueco real que la categoría no tenía.
- **IA → IA SDK**: relabel para distinguirla de "IA Tools & Skills" (asistentes de código).

### 2.4 Categoría Aplicaciones — auditoría + ampliación

Las 4 que ya existían (VS Code, Cursor, Insomnia, Warp) tenían buen contenido pero **cero sección de instalación** — solo un link a doc externa. Se agregó `## Instalación` verificada contra doc oficial (winget/brew/apt/snap) a las 4.

5 aplicaciones nuevas, cada una con instalación, funcionalidad base y ejemplos: **Docker Desktop**, **Figma**, **Excalidraw**, **Notion**, **Discord**. 4 subcategorías nuevas: DevOps y contenedores, Diseño y diagramación, Notas y documentación, Comunicación.

Campo `website` agregado al schema de `guides` (antes solo lo tenían `technologies`/`libraries`) — reutiliza la card de enlace externo de `EntryMeta.astro` en vez de un link suelto en el cuerpo del texto.

**Dato no obvio documentado**: Excalidraw **no tiene app de escritorio oficial** — la tuvo en Electron, la deprecaron, hoy la vía oficial es instalar como PWA desde el navegador. Fácil de documentar mal si no se verifica contra la fuente.

### 2.5 Monorepo — documentación completa nueva

Subcategoría `Monorepo` en General, 5 guías: qué es y cómo funciona (workspaces, hoisting, protocolo `workspace:`), monorepo con pnpm, con npm, con Bun, y un ejemplo completo de frontend + backend (Express + Vite + paquete de tipos compartido) con **el comando que abre ambos a la vez, verificado por gestor**:

- pnpm: `pnpm run --parallel --filter api --filter web dev` (flag real, sin él respeta orden topológico y el segundo proceso nunca arranca).
- Bun: `bun run --filter api --filter web dev` (paralelo **por defecto**, sin flag extra).
- npm: no tiene nada nativo — se documentó `concurrently` como la solución real.

**Bug real de npm documentado**: el protocolo `workspace:` aparece en documentación de npm pero **lanza `EUNSUPPORTEDPROTOCOL` en la práctica** (npm/cli#8845) — se documentó la alternativa que sí funciona (`"*"` o versión normal) en vez de repetir la doc rota.

### 2.6 Utilities — descripciones faltantes

De 12 archivos, 9 ya tenían descripción por función. **`object.md`, `promise.md`, `url.md`** no — título directo a bloque de código. Se agregaron descripciones y se alineó la estructura completa (grupos `##`, tabla Resumen, sección Consideraciones) que ya tenían los otros 9.

### 2.7 Versionado

`CHANGELOG.md` + `package.json`: `0.3.0` → `0.4.0` (minor, sin breaking changes, pre-1.0). La entrada nueva documenta todo lo de 2.1–2.6. Los 7 archivos sin commitear del cierre (ver abajo, sección 2.8) **no están reflejados en el changelog** — quedaron pendientes de una entrada `0.4.1` o de sumarse a `Unreleased`.

### 2.8 Patrón SITE/SEO — endurecido tras revisión del usuario

El usuario revisó `seo.ts` (documentado en `/myastro`, `/mynext`, las 2 recetas de SEO y las 2 skills) línea por línea y encontró dos problemas reales:

1. **`"LATAM"` hardcodeado** en `contactPoint.areaServed`, sin salir de `SITE` — inconsistente con el resto del archivo, que sí es 100% `SITE`-driven. Fix: campo nuevo `SITE.seo.contactRegion` (nombrado distinto a `geo.region`, que ya existe con otro significado — código ISO de departamento/estado). Reemplazado en los 5 archivos que tenían el hardcodeo (`myastro.md`, `astro-seo-completo.md`, `nextjs-seo-completo.md`, `skill-seo-astro.md`, `skill-seo-nextjs.md`); campo agregado a los 7 (los 5 + `mynext.md`, que no tenía el bug pero sí necesitaba el campo por consistencia, + el patrón canónico `site-config-global.md`).
2. **`SERVICES`/`FAQ_ITEMS` nunca documentados** — el código las importa (`@/content/services`, `@/content/faq`) con un comentario que dice "no vienen de SITE" pero nunca mostraba qué forma debían tener. Se agregó una sección nueva en `patterns/site-config-global.md` con la interfaz TypeScript exacta (`Service`: `id`/`eyebrow`/`h3`/`body`/`items`; `FaqItem`: `q`/`a`) y ejemplo de archivo, enlazada desde los 3 lugares que las importan sin explicarlas (`myastro.md`, `astro-seo-completo.md`, `skill-seo-astro.md` — los 3 de Next.js no las usan, no implementan `Service`/`FAQPage`).

Importante: `package.json` de ejemplo en `/myastro` y `/mynext` también se reordenó (`name → type → version → private → description → license → keywords → packageManager → homepage → author(objeto) → repository → bugs → engines → scripts`) a pedido del usuario, pero **con los mismos valores ficticios de siempre** — el usuario aclaró explícitamente que no quería datos reales suyos en el contenido, solo el orden.

## 3. Arquitectura — qué se extendió

- **`src/config/site.ts`**: `CATEGORY_GROUPS` nuevo (con guard de build). Stacks nuevos: `config` (reemplaza `libs`), `monorepo`, `apps-devops`/`apps-design`/`apps-productivity`/`apps-comms`, `github-profile`. `guides` (en `content.config.ts`) ahora incluye `...linkFields` (`website`/`github`), antes solo lo tenían `technologies`/`libraries`.
- **Íconos**: cada stack nuevo tiene entrada en `icons.ts` (`RECOLORED_ICONS`) + espejo en `DynamicIcon.tsx` — los "dos sistemas" de siempre, sincronizados sin romper el build esta vez.
- **`EntryMeta.astro`**: el bloque `showWebsite` (antes exclusivo de `technologies`/`libraries`) ahora también dispara para `guides` gracias al campo nuevo — sin cambios en el componente, solo en el schema.
- **`BaseLayout.astro`**: lógica de scroll de la sidebar nueva (`revealInSidebar()`, listener de `toggle` en fase de captura para acompañar la apertura de categorías largas).

## 4. Intentos fallidos / bugs propios / lecciones de esta sesión

- **El dev server no recarga solo tras tocar `astro.config.mjs` o `content.config.ts`**: el store de contenido queda cacheado y las páginas nuevas dan 404 aunque el archivo exista. Hay que `pnpm astro dev stop` + relanzar, no alcanza con esperar. Pasó varias veces en esta sesión.
- **Lock de Astro apuntando a un proceso ajeno**: en un punto, `preview_start` levantaba un proceso que moría al instante sin explicación — Astro tenía un lock de una sesión de dev **previa** (un PID corriendo en el puerto 4322, no 4321, iniciado fuera de esta sesión). `pnpm astro dev stop` lo resolvió; matar el PID a mano en el puerto equivocado no.
- **YAML rompe con `"palabra: "` sin comillas dentro de un valor plano**: `description: ...protocolo workspace: no es fiable...` (dos puntos + espacio sin comillas) tira `bad indentation of a mapping entry`. Hay que envolver en comillas cualquier descripción que mencione algo como `workspace:` literal.
- **El traductor de tabs pnpm/bun/npm es "todo o nada" por bloque, confirmado con pruebas reales**: comandos con `--filter`/`-w`/`--parallel` (flags específicos de un gestor) no están en `KNOWN_FLAGS`, así que `translateLine` devuelve `null` para esa línea y **todo el bloque** queda sin tocar — no hay riesgo de traducir mal `pnpm add zod --filter web` a un falso equivalente de npm. Se verificó en vivo para las 4 guías de monorepo antes de confiar en el comportamiento.
- **Los anchors de heading no siempre son lo que uno adivina**: `"npm — necesita \`concurrently\`"`generó el id`npm--necesita-concurrently`(doble guión, por el em-dash + backticks), no`npm-necesita-concurrently` como se escribió a mano al armar un link cruzado. Hay que verificar el id real en el HTML generado, no asumirlo.
- **La memoria de la conversación no es la fuente de verdad del estado del repo**: en un punto se encontró trabajo ya commiteado (tema Tokyo Night en `astro.config.mjs`, un logo con ciclo de color al hover) que no correspondía a nada hecho explícitamente en los turnos visibles de esta sesión — probablemente de contexto comprimido/resumido antes. La lección: para cualquier tarea de auditoría o changelog, `git diff`/`git status` contra HEAD es la fuente de verdad, no el recuerdo de la conversación.
- **Instalación de aplicaciones y datos de proyectos externos, siempre verificados contra fuente real** (WebSearch/WebFetch), nunca inventados: se confirmaron IDs de winget (`Microsoft.VisualStudioCode`, `Docker.DockerDesktop`, `Figma.Figma`, `Notion.Notion`, `Discord.Discord`, `Warp.Warp`, `Insomnia.Insomnia`) y casks de Homebrew uno por uno. Se encontraron 2 datos genuinamente no obvios en el camino: el bug de `workspace:` en npm (arriba) y que Excalidraw no tiene app de escritorio oficial.
- **El screenshot del navegador de este entorno sigue sin funcionar** (ya era lección del handoff anterior, sigue igual) — toda verificación visual de esta sesión (colores, tema de código, sidebar, cursor de nav-link, cards) se hizo leyendo estilos computados y estructura del DOM vía `javascript_tool`, nunca por captura de pantalla. Lo que depende de una interacción real (hover del logo, blink del cursor en las cards) **no se verificó visualmente** — queda para que el usuario lo mire.

## 5. Próximos pasos / cosas a decidir

1. **Commitear los 7 archivos pendientes** del fix de `contactRegion`/`SERVICES`/`FAQ_ITEMS` — y decidir si entran en una entrada `0.4.1` del changelog o se acumulan en `Unreleased`.
2. **"Config" como nombre de subcategoría para Zod**: se lo señalé al usuario (Zod es una librería de validación, no configuración) y no lo resolvió — sigue ahí.
3. **Verificación visual real pendiente**: todo lo que depende de interacción (ciclo de color del logo al hover, cursor `❯` del nav-link activo, blink del cursor en las cards de Aplicaciones) — el entorno no puede tomar screenshots, se verificó por estado computado, no por ojo.
4. **Catálogos que van a desactualizarse** (lección recurrente de handoffs anteriores, ahora también aplica a las 9 apps de Aplicaciones y a los comandos de monorepo): nombres de paquete de winget/brew, versiones de dependencias en los ejemplos (`react@^19`, `vite@^6`, etc.) — no son "documentar una vez y listo".
5. **Sin tests ni linter** — sigue siendo solo `pnpm build` + `pnpm check`.
