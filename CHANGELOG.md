# Changelog

Todos los cambios relevantes de `angel.library` se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

- Nuevas notas, snippets y mejoras de contenido que todavía no formen parte de una versión publicada.
- Reorganización de la taxonomía: HTML, CSS y JavaScript pasan a la nueva categoría `Lenguajes`; TypeScript queda en `General` junto a las librerías y utilidades.
- La categoría `General` concentra TypeScript, librerías, utilidades, snippets y patrones reutilizables; `Libs` pasa de Frontend a General.
- Nuevo comando privado `/myastro` con la receta de configuración inicial de Astro: Tailwind, alias de TypeScript, Prettier, `SITE`, archivos de repositorio y SEO.
- Reordenamiento de `/myastro` como flujo ejecutable de principio a fin y corrección global de las pestañas npm, pnpm y Bun para evitar bloques de instalación repetidos.
- La receta `/myastro` ahora parte de la plantilla oficial `basics` y documenta de forma opcional el adaptador de Vercel para renderizado bajo demanda.
- `/myastro` adopta la misma estructura ejecutable de `/mynext`: comandos actuales de integraciones, imports ordenados con Prettier, dominio único desde `import.meta.env.SITE`, renderizado por ruta, archivos de repositorio al final y árbol final del proyecto.
- Nuevo comando privado `/mynext` con una receta ordenada para crear proyectos Next.js con Tailwind CSS, configuración del framework, Prettier, imports, `SITE`, SEO y archivos de repositorio.
- Las pestañas de gestores de paquetes también reconocen comandos `create` e `init`, por lo que los scaffolds e instalaciones equivalentes ya no necesitan bloques Bash repetidos.

## [0.2.0] — 2026-08-25

Nueva funcionalidad para guardar configuraciones personales como comandos
privados dentro de la biblioteca, conservando el layout y el flujo de contenido
existentes.

### Añadido

- Comando secreto `/myjson` en la terminal interna, con redirección a su entrada
  de configuración personal de VS Code.
- Entrada `commands/myjson` con la configuración completa de VS Code y explicación
  detallada por secciones.
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
- Build estático de producción generado correctamente, incluida la ruta
  `/commands/myjson`.

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

[Unreleased]: https://github.com/iangelmanuel/angel-library/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.2.0
[0.1.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.1.0
