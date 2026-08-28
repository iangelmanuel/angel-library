# Changelog

Todos los cambios relevantes de `angel.library` se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

- Nuevas notas, snippets y mejoras de contenido que todavía no formen parte de una versión publicada.

## [0.6.1] — 2026-08-27

Bugs reales de GitHub Actions encontrados al usar el CI de `/myastro` en un
proyecto real, ESLint reescrito para Astro con el bloqueo real de TypeScript
7.0, workflow de CI simplificado a un solo diseño (paralelo), y un aviso
nuevo sobre `content.config.ts` que hasta ahora no estaba documentado en
ningún lado.

### Añadido

- Aviso en [Content Collections](/guides/astro-content-collections) sobre la
  ruta exacta de `src/content.config.ts`: moverlo a `src/content/index.ts` (o
  cualquier otra ruta) no rompe el build con un error claro — la colección
  queda vacía en silencio, y el síntoma aparece después, en `astro check`,
  como `Property 'data' does not exist on type 'never'` en cualquier
  componente que la consuma.
- Nota de secuencia en el paso de ESLint de `/myastro`: TypeScript en `< 7`
  primero → `typescript-eslint` → `eslint.config.mjs` → `pnpm install` (para
  sincronizar `pnpm-lock.yaml`) → recién ahí `pnpm sync` y
  `check`/`eslint`/`prettier:check`. Saltarse el orden deja el lockfile
  desincronizado y `pnpm install --frozen-lockfile` (paso 3) falla en CI
  aunque en local funcione.
- Dos ítems nuevos en el checklist final de `/myastro`: TypeScript `< 7` antes
  de instalar `typescript-eslint`, y `pnpm-lock.yaml` regenerado tras
  cualquier cambio de versión en `package.json`.

### Cambiado

- `eslint.config.mjs` de `/myastro` reescrito: `@eslint/js` +
  `typescript-eslint` + `eslint-plugin-astro`, con dos reglas explícitas
  (`no-explicit-any`, `no-unused-vars` con `argsIgnorePattern`/
  `varsIgnorePattern`) y un bloque de globals para archivos `.mjs`.
  Documentado por qué el orden del array importa (`jseslint` sin `...`,
  `tseslint`/`astro` con `...`, y por qué Astro va al final) y por qué las
  variables se llaman `jseslint`/`tseslint`/`astro` — nombrados por paquete,
  no genéricos, para que no se confundan entre sí.
- Workflow de GitHub Actions de `/myastro` y `/mynext` reducido a un solo
  diseño: se quitó el workflow secuencial de un job y quedó únicamente el de
  dos jobs (`quality` en matriz + `build` con `needs`), que antes se
  presentaba como "variante en paralelo". La prosa que explicaba
  `--frozen-lockfile`, `pnpm/action-setup` sin `version` y los pasos
  pendientes se fusionó en el único workflow que queda.

### Arreglado

- `pnpm/action-setup@v4` con `with: version` fijo chocaba con `packageManager`
  en `package.json`: dos fuentes de versión de pnpm desincronizadas producían
  `ERR_PNPM_BAD_PM_VERSION`. Quitado el `version:` explícito en los workflows
  de `/myastro` y `/mynext`, y en `github-actions-matrices-cache.md` y
  `repository-rules-security.md` — la action ahora lee la versión solo de
  `packageManager`. Agregada una nota en `/myastro` y `/mynext` explicando por
  qué no debe fijarse en los dos lugares.
- `github-actions-matrices-cache.md` tenía `actions/setup-node` con
  `cache: pnpm` **antes** de `pnpm/action-setup`: el cache necesita el binario
  `pnpm` ya en el PATH para resolver el store, así que quedaba desactivado sin
  fallar el job. Orden corregido.

### Verificado

- `pnpm build` sin errores (1417 páginas).
- Los 5 archivos con `pnpm/action-setup` revisados uno por uno; solo esa guía
  tenía el orden invertido, el resto ya era correcto.

## [0.6.0] — 2026-08-27

Directorios en plural en toda la documentación (`lib` → `libs`), `SITE`
reestructurada con autoría de SEO explícita, y dos pasos nuevos —GitHub
Actions y ESLint— en las páginas ocultas `/myastro` y `/mynext`.

### Añadido

- Paso de **GitHub Actions** en `/myastro` y `/mynext` (paso 3 en ambos): un
  workflow que corre `check`, `eslint`, `prettier:check` y `build` con pnpm,
  más una variante en paralelo documentada (matriz con `fail-fast: false` para
  las tres verificaciones rápidas, y `needs:` para que el build espere a que
  pasen).
- Paso de **ESLint** en `/myastro` (paso 9: `eslint-plugin-astro` +
  `typescript-eslint` con configuración plana) y en `/mynext` (paso 7: revisar
  la config que ya genera `create-next-app`, con `FlatCompat`,
  `next/core-web-vitals` y `next/typescript`).
- Campos nuevos en `SITE.seo`: `author`, `creator`, `publisher`,
  `twitterAuthor` y `twitterCard`, todos con consumidor real en las seis
  implementaciones.
- Bloque `SITE.site` (URL, locale, lang, timezone, currency) y `SITE.legal`,
  `SITE.navigation`, `SITE.stats` presentes ahora también en el `SITE` de
  `/mynext`, que antes era una versión reducida del de Astro.
- `SITE.contact` con `countryCode`, `phone`, `phoneDisplay()` y `whatsapp()`
  como funciones derivadas, en vez de un número escrito dos veces.

### Cambiado

- **Directorios en plural en toda la documentación**: `lib` → `libs` en 47
  archivos de contenido (149 rutas `@/lib/` y `src/lib/`, más diagramas de
  árbol, prosa, `_lib/` → `_libs/` y el alias `@lib/*` → `@libs/*`). `config`
  se mantiene en singular a propósito; el resto de directorios ya estaba en
  plural.
- Archivos de referencia de la skill de Next renombrados a `libs.md` y
  `components.md`, para que coincidan con los de la skill de Astro.
- Scripts de `package.json` en `/myastro`: se agregan `start` y `astro`, y
  `format`/`format:check` pasan a `prettier`/`prettier:check`. En `/mynext` se
  adaptan al mismo criterio (`preview`, `next`, `check`, `eslint`,
  `eslint:fix`, `prettier`, `prettier:check`).
- `meta author`/`creator`/`publisher` leen `SITE.seo.*` en vez de derivarse de
  `info.founders` y `info.legalName`; `twitter:card` y `twitter:creator` leen
  `twitterCard` y `twitterAuthor`.
- Pasos renumerados en ambas páginas ocultas (`/myastro` 1–14, `/mynext` 1–18)
  y las referencias cruzadas actualizadas al paso correcto.

### Eliminado

- `SITE.services` y la sección "Crear una página con metadata propia" de
  `/myastro`. El listado de servicios vive en `SERVICES`, que ya existía como
  export hermano.
- Bloques `certificates`, `work` y `featured` de `SITE.info`, junto con
  `tagline`, que no tenía ningún consumidor.

### Arreglado

- `SITE_URL` se usaba sin declarar en el fragmento de `site.ts` de
  `astro-seo-completo` y `skill-seo-astro`: copiar ese bloque fallaba con
  `Cannot find name 'SITE_URL'`.
- `SITE.contact.whatsapp` pasó a ser función, pero trece consumidores la
  seguían usando como string, lo que habría serializado la función dentro de
  la URL de WhatsApp y del JSON-LD.
- `slogan` y `founders` estaban definidos pero sin consumidor en Next —
  conectados a `buildBusinessSchema()`, igual que ya hacía Astro.
- `alternates.languages` de Next tenía el locale fijo, así que un segundo
  idioma en `SITE.seo.locales` nunca generaba su `hreflang`.
- `contactRegion`, `category` y `classification` no se consumían en Next, ni
  `currency` en Astro — todos conectados a su meta o schema correspondiente.
- El paso "Añadir los archivos del repositorio" volvía a listar el workflow de
  CI como pendiente, cuando ya se crea en el paso 3.

### Verificado

- `pnpm build` sin errores (1417 páginas) y `pnpm check` con 0 errores y 0
  warnings.
- Paridad exacta de campos de `SITE.seo` entre los 7 archivos que la
  documentan, con `titleTemplate` solo en los tres de Next.
- Cada campo de `SITE.seo` tiene al menos un consumidor real en las seis
  implementaciones.

## [0.5.0] — 2026-08-27

Nueva subcategoría Paquetes en General, endurecimiento del patrón `SITE`/SEO
tras varias rondas de revisión, y sincronización completa entre las páginas
ocultas `/myastro`/`/mynext`, la categoría SEO y la skill de SEO.

### Añadido

- Subcategoría `Paquetes` en General, con ícono propio (`brand-packages`).
- `npm-check-updates.md`: instalación, `ncu` vs `ncu -u`, flags principales,
  `--target` en detalle, modo interactivo, modo `--doctor`, workspaces,
  `.ncurc.json` y `--errorLevel` para CI.
- `SERVICES`/`FAQ_ITEMS` (con sus interfaces `Service`/`FaqItem`) documentados
  como exports hermanos de `SITE` en el mismo `src/config/site.ts`, en vez de
  importarse de módulos `@/content/faq`/`@/content/services` que nunca se
  definían — sincronizado en `/myastro`, `astro-seo-completo`, `skill-seo-astro`
  y el patrón `SITE`.
- Script `"astro": "astro"` en el `package.json` de ejemplo de `/myastro`.
- Comentario `// deprecado en TypeScript 7.0` junto a `baseUrl` en los 5
  lugares del sitio que lo mencionan (`/myastro`, guías de configuración de
  Astro y Next.js, guía de alias de TypeScript), más una nota explícita en
  esta última.

### Cambiado

- `zod.md` movido de `stack: config` a `stack: packages`.
- `package.json`/`.prettierrc` de ejemplo en `/myastro` y `/mynext`: los
  campos que dependen del proyecto o del gestor (`license`, `packageManager`,
  `engines`, `tailwindStylesheet`) ahora son placeholders `"..."` explícitos
  en vez de valores concretos que quedaban desactualizados; orden de campos
  sincronizado entre ambos.
- Orden de `SITE.seo` sincronizado entre Astro y Next.js: `areaServed` al
  final del bloque, en `/myastro`, `/mynext` y las 4 recetas/skills de SEO.
- Orden de meta tags de `BaseHead.astro` sincronizado entre `/myastro`, la
  receta `astro-seo-completo` y `skill-seo-astro`: `<title>` antes de
  `charset`/`viewport`, con un ejemplo comentado de precarga de fuente.
- Comentarios eliminados de los bloques de código para copiar de `/myastro`
  (JsonLd.astro, seo.ts, BaseHead.astro, sitemap.xml.ts) — están pensados
  para pegarse tal cual en un proyecto real.
- `SITE.ts` propio del proyecto (`src/config/site.ts`): `name`/`description`/
  `locale` agrupados bajo `SITE.info` en vez de ir sueltos en la raíz.

### Arreglado

- `const URL = SITE.seo.url` tapaba el constructor global `URL`, rompiendo
  `new URL(...)` con `Type 'String' has no construct signatures.ts(2351)` —
  renombrado a `SITE_URL` en `/myastro`, `astro-seo-completo` y
  `skill-seo-astro`.
- `titleTemplate` (patrón `%s`) eliminado de la `SITE` de `/myastro` — es una
  función de la Metadata API de Next.js, Astro nunca la consumía.

### Verificado

- `pnpm build` sin errores tras cada tanda de cambios (1417 páginas).

## [0.4.0] — 2026-08-26

Categoría Aplicaciones ampliada y auditada, documentación completa de monorepos,
descripciones faltantes en Utilities, y un rediseño del sistema visual: tema
de código, tipografías, colores de encabezados, logo real y la sidebar
terminada.

### Añadido

- Tema de resaltado de código Tokyo Night, tipografía Fira Code para bloques
  de código y JetBrains Mono para el texto general del sitio, autohospedadas
  vía Fontsource.
- Logo real del proyecto (pixel art) en el header y como favicon, con una
  interacción de color al pasar el cursor por encima.
- Cursor de selección `❯` estilo terminal para la entrada activa de la
  sidebar, coloreado según la categoría.
- Sección "Instalación" verificada contra documentación oficial en las 4
  guías de aplicaciones existentes (VS Code, Cursor, Insomnia, Warp), que
  antes solo enlazaban a documentación externa.
- 5 aplicaciones nuevas en la categoría Aplicaciones: Docker Desktop, Figma,
  Excalidraw, Notion y Discord, cada una con instalación, funcionalidad base
  y ejemplos.
- 4 subcategorías nuevas en Aplicaciones: DevOps y contenedores, Diseño y
  diagramación, Notas y documentación, Comunicación.
- Campo `website` en el schema de `guides`, para reutilizar la card de
  enlace externo que ya usaban `technologies` y `libraries`.
- Subcategoría `Monorepo` en General, con 5 guías nuevas: qué es un monorepo
  y cómo funciona, monorepo con pnpm, con npm, con Bun, y un ejemplo
  completo de frontend + backend (Express + Vite) con un comando de
  desarrollo único por gestor.
- Descripciones faltantes en 3 archivos de Utilities (`object`, `promise`,
  `url`), alineados a la estructura de grupos, tabla resumen y
  consideraciones que ya usaba el resto de la categoría.

### Cambiado

- Gama de color fija para encabezados de contenido: título en naranja,
  subtítulo en amarillo, tercer nivel en cian, cuarto nivel en gris —
  reemplaza la rotación decorativa anterior sin significado por posición.
- Etiquetas de sección (`section-label`) recoloreadas a azul, consistente en
  toda la navegación.
- Color de los tags unificado a un único morado con estilo de pill (antes
  variaba por hash del texto).
- Badges por defecto (accesos rápidos de la sidebar, listado de categorías
  del inicio) recoloreados a gris terminal.
- Código inline en el cuerpo del texto sin fondo, solo borde, en Geist
  Pixel.
- Sidebar sin contador numérico de entradas por categoría/subcategoría.
- Ancho de sidebar y color de los accesos rápidos (Inicio, Buscar, Tags)
  corregidos tras el rediseño agrupado de la versión anterior.

### Verificado

- `pnpm check` sin errores tras cada tanda de cambios.
- Build estático de producción generado correctamente.
- Comandos de instalación de aplicaciones (winget, Homebrew, apt/snap)
  verificados contra documentación oficial antes de publicarlos.
- Referencias de contenido y schemas validados durante el build.

## [0.3.0] — 2026-08-26

Reestructuración de la taxonomía de conocimiento, nueva sección de GitHub
Actions, guías de perfil de GitHub, guía de Prettier y mejoras en la
navegación agrupada de la sidebar.

### Añadido

- Nueva categoría `Lenguajes` para HTML, CSS y JavaScript, extraída de General.
- Categoría `Git & GitHub` integrada: GitHub Actions, GitHub CLI, plataforma,
  perfil de cuenta y gestión de repositorios en una sola sección.
- Subcategoría `github-profile` con guías de presentación, README, claves SSH
  y commits verificados.
- Subcategoría `config` para configuración de proyectos en General.
- Guía de Prettier con configuración, integración y uso en Astro.
- `CATEGORY_GROUPS` en `site.ts` para navegación agrupada por bloques:
  construir, producto/IA, flujo de trabajo, calidad y referencia.
- Sidebar agrupada por categorías en vez de listado plano.
- Enlaces rápidos (Inicio, Buscar, Tags) en la parte superior de la sidebar.
- Validación en build para detectar categorías sin grupo en `CATEGORY_GROUPS`.

### Cambiado

- `CATEGORY_LIST` se deriva de `CATEGORY_GROUPS` en vez de `CATEGORY_IDS`.
- Sidebar ampliada de `w-60` a `w-72` para alojar el nuevo diseño.
- `category: tools` eliminada; su contenido se reasignó a otras categorías.
- `category: github-actions` eliminada; se fusionó en Git & GitHub.
- `stack: libs` renombrado a `stack: config` en General.
- IA relabelada de "IA" a "IA SDK" en la categoría.
- `stack: github-actions` y `stack: github-profile` añadidos a Git & GitHub.
- Las pestañas de gestores de paquetes reconocen comandos `create` e `init`.
- Reformato de `site.ts` a comillas dobles y sin punto y coma.

### Eliminado

- Guías de herramientas generales: `tools-calidad-codigo`,
  `tools-chrome-devtools`, `tools-debugging-workflow`,
  `tools-documentacion-tecnica`, `tools-vite-build`,
  `tools-vscode-workspace`, `developer-tools-fundamentals`.
- Guías de recursos: `resources-evaluation-guide`,
  `resources-segundo-cerebro`.
- Guía `content-references` (contenido reubicado).

### Verificado

- `pnpm sync` ejecutado tras actualizar el schema de contenido.
- `pnpm check` sin errores.
- Build estático de producción generado correctamente.

## [0.2.0] — 2026-08-25

Nueva funcionalidad para guardar configuraciones personales como comandos
privados dentro de la biblioteca, conservando el layout y el flujo de contenido
existentes.

### Añadido

- Comando secreto `/myjson` en la terminal interna, con redirección a su entrada
  de configuración personal de VS Code.
- Comandos secretos `/myastro` y `/mynext` con recetas completas de
  configuración inicial para Astro y Next.js respectivamente.
- Entradas `commands/myjson`, `commands/myastro` y `commands/mynext` con
  configuraciones detalladas y explicación por secciones.
- Campo `private` en el schema compartido para mantener entradas personales fuera
  de la navegación, listados, tags e índice de búsqueda públicos.
- Soporte para que las entradas privadas conserven sus rutas dinámicas y el mismo
  layout, metadata, navegación anterior/siguiente y bloques de código que las
  entradas públicas.
- Instrucciones en `AGENTS.md` y `CLAUDE.md` para añadir futuras configuraciones
  personales sin crear páginas aisladas.

### Verificado

- `pnpm sync` ejecutado tras actualizar el schema de contenido.
- `pnpm check` sin errores.
- Build estático de producción generado correctamente, incluidas las rutas
  `/commands/myjson`, `/commands/myastro` y `/commands/mynext`.

## [0.1.0] — 2026-08-25

Primera versión organizada para publicar el proyecto en GitHub. `angel.library` funciona como un segundo cerebro técnico: sirve para aprender desde cero, recordar rápidamente y reutilizar ejemplos en proyectos reales.

### Añadido

- Taxonomía de conocimiento por categorías y subcategorías, con curva de aprendizaje y navegación por contexto.
- Documentación base y ampliada de HTML moderno, CSS avanzado y JavaScript, incluyendo tipos, operadores, ciclos, funciones, objetos, arrays, APIs nativas, DOM, eventos, asincronía, módulos, Web Components, multimedia y almacenamiento.
- Documentación de Astro, React y Next.js: fundamentos, routing, renderizado, datos, formularios, estado, Server Components, Server Actions, performance y testing.
- Documentación backend para Node.js y Express: APIs, autenticación, sesiones, errores, validación, persistencia, seguridad, archivos, jobs y observabilidad.
- Categorías y contenido de bases de datos, arquitectura, DevOps, seguridad, performance, accesibilidad, UI/UX, SEO, IA, terminal, herramientas y recursos.
- Sección de Git & GitHub para gestión de repositorios: README, licencia, CONTRIBUTING, SECURITY, CODEOWNERS, Issues, Pull Requests, reglas de ramas, CI y releases.
- Guías de licencias de software y criterios para elegir una licencia según el proyecto.
- Categoría Aplicaciones con documentación de VSCode, Cursor, Warp e Insomnia.
- Guías de testing unitario, integración, contratos, bases de datos, React Testing Library, Astro, Next.js, E2E, property-based testing y mutation testing.
- Testing asistido por IA con principios de uso y una guía de Midscene.js integrada con Playwright.
- SDKs y flujos para OpenAI, Vercel AI SDK y OpenRouter, incluyendo streaming, memoria, headers y comunicación frontend/backend.
- Sistema de pestañas para comandos de instalación compatibles con npm, pnpm y Bun desde un único bloque de código.
- Búsqueda tipo terminal con rutas de índice, comandos, historial, tags, navegación con teclado y acceso rápido mediante `Ctrl + K`.
- Temas de terminal, tema `angel`, comandos interactivos, comandos educativos y detalles visuales pixel art/terminal.
- Iconos coloreados por categoría y subcategoría, con excepciones corporativas para Next.js y GitHub.
- Español latinoamericano como tono editorial general.

### Cambiado

- Reorganización de SEO fuera de Frontend y de los SDKs de IA fuera de Backend hacia sus categorías semánticas.
- Orden editorial de las subcategorías para colocar fundamentos antes de integraciones, utilidades, snippets y recetas.
- Recursos reservado para enlaces externos; las guías sobre curación y mantenimiento del segundo cerebro pasaron a Herramientas → Documentación técnica.
- React dejó de incluir duplicados de shadcn/ui y Magic UI; sus documentos se mantienen en UI/UX como librerías.
- El contenido de accesibilidad, performance, seguridad y testing fue ampliado con explicaciones, casos de uso, ejemplos y buenas prácticas.
- La colección vacía de componentes fue retirada del catálogo activo para evitar rutas fantasma y ruido durante el build.
- El prompt de navegación usa `$` y una ruta de terminal genérica, sin referencias a un equipo o sistema operativo específico.

### Verificado

- `pnpm check` sin errores.
- Build estático de producción generado correctamente.
- Referencias de contenido y schemas validados durante el build.

[Unreleased]: https://github.com/iangelmanuel/angel-library/compare/v0.6.1...HEAD
[0.6.1]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.6.1
[0.6.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.6.0
[0.5.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.5.0
[0.4.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.4.0
[0.3.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.3.0
[0.2.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.2.0
[0.1.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.1.0
