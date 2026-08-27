# Changelog

Todos los cambios relevantes de `angel.library` se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

- Nuevas notas, snippets y mejoras de contenido que todavía no formen parte de una versión publicada.

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

[Unreleased]: https://github.com/iangelmanuel/angel-library/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.4.0
[0.3.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.3.0
[0.2.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.2.0
[0.1.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.1.0
