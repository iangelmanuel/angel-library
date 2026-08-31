# Changelog

Todos los cambios relevantes de `angel.library` se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

- Nuevas notas, snippets y mejoras de contenido que todavía no formen parte de una versión publicada.

## [0.16.1] — 2026-08-31

Los títulos de Hallazgos y Recursos adoptan el patrón `[nombre] — [qué hace]`
que ya usaban Aplicaciones y otras categorías.

### Cambiado

- **37 títulos** reescritos con el patrón `[nombre] — [qué hace]`: las 5
  entradas de Hallazgos, las 31 de Recursos y **Borumi** en Aplicaciones, que
  era la única de su subcategoría sin descriptor y desentonaba junto a Figma y
  Excalidraw.
- El descriptor se mantiene corto, entre tres y siete palabras, para que la
  barra lateral siga siendo legible: `Squoosh — comprimir y convertir imágenes
  en el navegador`, `Buzz — espacio de trabajo para personas y agentes`.

### Verificado

- Auditoría del frontmatter: las 40 entradas de Hallazgos y Recursos cumplen
  el patrón, sin excepciones.
- Barra lateral comprobada en el navegador: Borumi aparece con el mismo
  formato que Figma, Excalidraw y Notion dentro de Aplicaciones.
- `pnpm check` con 0 errores y `pnpm build` con 1630 páginas estáticas.

### Nota

- `img.xyz — verificar antes de usar` conserva su descriptor de advertencia en
  lugar de uno funcional: el dominio no sirve hoy una herramienta operativa y
  el aviso es más útil que describir lo que debería hacer.

## [0.16.0] — 2026-08-31

Cada subcategoría explica ahora qué contiene, los recursos se reagrupan por lo
que realmente son, y los enlaces del contenido se distinguen del texto.

### Añadido

- **Descripción en las 101 subcategorías** del sitio, escrita en lenguaje
  claro para alguien que empieza sin resultar obvia para quien ya sabe. Se
  muestra bajo el título de cada sección en la página de categoría, que es
  donde alguien decide en qué apartado entrar.
- **Descripción en las 15 subcategorías de Recursos**, con el mismo criterio.
- Subcategoría **Imágenes y mockups** en Recursos, con PostSpark, Shots,
  Squoosh e img.xyz.
- **Aprende SQL** en Cursos → Midudev: curso interactivo de 26 lecciones con
  editor SQL en cada una y certificado en PDF publicable en LinkedIn.

### Cambiado

- Los enlaces dentro del contenido pasan de gris a un **azul tenue**
  (`#93bbfc`), con el subrayado en el mismo tono al 45 %. Antes solo se
  distinguían por el subrayado, que en un párrafo largo cuesta ver.
- **DESIGN.md** se mueve de Hallazgos a IA Tools & Skills → Fundamentos: es un
  formato para hablarle a un agente de codificación, no un proyecto que se use
  como herramienta.
- Las subcategorías de recursos **Gradientes** y **Glassmorphism** se fusionan
  en **CSS**: las tres eran generadores de CSS y separarlas dejaba grupos de
  una sola entrada.
- Reescrita la presentación de Midudev en su catálogo: se retira la
  explicación del esquema `midu.link`, y en su lugar se menciona que emite en
  directo casi a diario en Twitch y YouTube, con enlace a su comunidad de
  Discord.
- La fila de SQL del catálogo apunta a `aprendesql.dev` en vez de a la
  playlist, por ser el material actual y con certificado.
- Crédito de los apuntes de Majo ampliado con su perfil de GitHub,
  [majoledesma](https://github.com/majoledesma).
- Títulos de PostSpark y Shots con el patrón `[nombre] — [qué hace]`.

### Eliminado

- Sección "Aviso sobre el certificado de SQL" del catálogo de Midudev, que
  advertía sobre un enlace de afiliado a DataCamp. Sale de la biblioteca por
  completo: el curso de SQL con certificado gratuito es `aprendesql.dev`.

### Verificado

- Las páginas de categoría muestran la descripción bajo cada subcategoría;
  comprobado en Recursos, Cursos, Hallazgos, Frontend e IA Tools & Skills.
- Recursos queda en 12 grupos con contenido, sin subcategorías de una sola
  entrada por división artificial.
- El color de enlace calculado en el navegador es `rgb(147, 187, 252)` frente
  al `rgb(156, 156, 165)` del párrafo, contraste suficiente para distinguirlo.
- `pnpm check` con 0 errores y `pnpm build` con 1630 páginas estáticas.

### Nota

- Las descripciones se muestran en la página de categoría, no en la barra
  lateral. Un `[nombre] — [descripción]` en la etiqueta habría ocupado tres
  líneas por subcategoría en una columna de 288 px, con 101 subcategorías en
  el árbol; la barra lateral conserva solo el nombre.

## [0.15.0] — 2026-08-30

Revisión de tono y precisión sobre lo publicado en las últimas versiones:
un tono innecesario en la entrada de Midudev, un formato que no aportaba
distinción real, un título sin nombre propio, y **Shots**, la herramienta
de mockups que faltaba junto a PostSpark.

### Añadido

- **Shots** en Recursos → Developer Tools, junto a PostSpark: mockups de
  dispositivo animables a partir de una captura o un diseño estático.

### Cambiado

- Reescrita la introducción de "Cursos de Midudev por tecnología": el párrafo
  explicaba el esquema de enlaces `midu.link` en un tono que sonaba a señalar
  un defecto de Miguel Ángel Durán, cuando el problema era solo que un
  acortador no revela su destino. La introducción ahora presenta quién es y
  qué más publica, sin comentar sus enlaces.
- El formato **"Directo grabado"** se fusionó con **"Video"**. La mayoría de
  los cursos en formato video de Midudev son directos re-subidos tal cual a
  YouTube, así que la distinción no describía nada que el lector fuera a
  encontrar distinto; queda una nota breve sobre eso dentro del formato
  "Video" en vez de una categoría propia.
- El título del recurso de color pasa de una frase descriptiva sin nombre a
  **"UX Planet — alternativas al negro puro en texto y fondos"**, y el de la
  plantilla de CV a **"Midudev — plantilla de CV para desarrollo"**: el resto
  de títulos de la categoría ya incluían el nombre de su fuente y estos dos
  eran la excepción.

### Corregido

- Enlace cruzado entre PostSpark y Shots en ambas entradas, con una tabla que
  compara cuándo conviene cada una.

### Verificado

- Los 388 enlaces externos del cuerpo Markdown siguen con `target="_blank"` y
  `rel="noopener noreferrer"` tras los cambios de esta versión.
- Estructura de las 34 entradas de Cursos y Hallazgos revisada de nuevo:
  entre 1 y 7 secciones cada una, consistente con el resto de la categoría.
- `pnpm check` con 0 errores y `pnpm build` con 1629 páginas estáticas.

## [0.14.0] — 2026-08-30

Los enlaces externos del contenido pasan a abrirse en otra pestaña, y las
categorías Cursos y Hallazgos se reordenan tras revisarlas entrada por entrada.

### Corregido

- **Los enlaces externos del Markdown se abrían en la misma pestaña**, sacando
  al lector del sitio. Un plugin nuevo, `src/lib/rehype-external-links.mjs`,
  les añade `target="_blank"` y `rel="noopener noreferrer"` durante el build.
  Sin `noopener`, la página de destino recibe una referencia a la nuestra por
  `window.opener` y puede redirigirla. Afecta a **388 enlaces** repartidos por
  todo el contenido. Los enlaces internos se dejan intactos para no romper las
  View Transitions.

### Añadido

- Subcategoría **Empleo y entrevistas** en Cursos, con la plantilla de CV y la
  guía de entrevistas de DevCaress. Ninguna de las dos enseña una tecnología,
  así que desentonaban en Midudev y en Repositorios.

### Cambiado

- Los dos cursos de **Next.js** dejan de tener entrada propia y pasan al
  catálogo de cursos de Midudev, con sus dos enlaces y la explicación de la
  diferencia entre App Router y Pages Router. La playlist de App Router queda
  enlazada como playlist completa, no como un video suelto.
- **LLMs from Scratch** se mueve de Hallazgos a Cursos → Repositorios y
  apuntes: es el código que acompaña a un libro, o sea material de estudio, no
  un proyecto que se use como herramienta.
- Orden recalculado dentro de las subcategorías afectadas.

### Verificado

- Auditoría del HTML generado: los 388 enlaces externos del cuerpo Markdown
  llevan `target="_blank"` con `rel` completo, y ningún enlace interno abre en
  pestaña nueva.
- Las 31 entradas de Cursos y Hallazgos revisadas una a una: todas tienen
  crédito al autor, entre 1 y 7 secciones y entre 159 y 623 palabras.
- `pnpm check` con 0 errores y `pnpm build` con 1626 páginas estáticas.

### Nota

- **InShot no se añadió.** El sitio `inshot.com` es una aplicación móvil de
  edición de video y foto, no una herramienta web para convertir capturas en
  mockups. Queda pendiente confirmar a qué producto se refería la petición.

## [0.13.0] — 2026-08-30

Categoría **Hallazgos** para repositorios y proyectos que vale la pena
conocer, más créditos explícitos a quien publica cada recurso en las 40
entradas de Cursos y Hallazgos.

### Añadido

- Categoría **Hallazgos**, entre Cursos y Recursos, con dos subcategorías:
  `IA y agentes` y `Web y producto`.
- Siete entradas en Hallazgos: **Buzz** (espacio de trabajo donde personas y
  agentes comparten salas, sobre un relé Nostr), **Open Executive** (ocho
  agentes especializados tras una sola voz ejecutiva), **LLMs from Scratch**
  (construir un modelo tipo GPT paso a paso), **DESIGN.md** (formato para
  describir una identidad visual a agentes de codificación), **HyperFrames**
  (HTML a video MP4 determinista), **Astro Storefront** (referencia de
  comercio electrónico con Astro) y **los 12 principios de la animación**
  aplicados a interfaces.
- Dos librerías en UI / UX → UI con React: **GridStack.js** para dashboards
  con widgets arrastrables y **Untitled UI React**, componentes abiertos sobre
  Tailwind y React Aria.
- Tres recursos: **PostSpark** en Developer Tools, **transition.style** en
  Animaciones y el artículo sobre **alternativas al negro puro** en Colores.
- Crédito explícito al autor o la organización de cada recurso, al inicio de
  las 40 entradas de Cursos y Hallazgos, con enlace a su perfil y la licencia
  cuando aplica.

### Cambiado

- La subcategoría de cursos pasa a mostrarse como **Midudev**, con mayúscula.
  El id `cursos-midudev`, los tags y las rutas `midu.link` no cambian.

### Verificado

- Los seis repositorios contrastados contra la API de GitHub: estrellas,
  licencia, lenguaje y fecha del último cambio.
- `withastro/storefront` está marcado como alfa y su último cambio es de
  octubre de 2024; queda advertido en la entrada para que no se tome como
  plantilla de arranque.
- `transition.style` identificado como el paquete `transition-style`, del
  repositorio `argyleink/transition.css` de Adam Argyle.
- Los 12 enlaces internos de las entradas nuevas devuelven 200, y las dos
  subcategorías de Hallazgos aparecen en la navegación y en su página de
  categoría con sus 7 entradas.
- `pnpm check` con 0 errores y `pnpm build` con 1627 páginas estáticas.

### Nota

- La entrada de PostSpark quedó en la subcategoría **Developer Tools**, junto
  a Squoosh y img.xyz. La referencia de InShot que motivaba la ubicación no
  existe en la biblioteca.

## [0.12.0] — 2026-08-30

La categoría Cursos deja de estar vacía: 28 entradas repartidas en cinco
subcategorías por procedencia, con el formato real de cada recurso verificado
enlace por enlace.

### Añadido

- Cinco subcategorías en **Cursos**, ordenadas por procedencia del material:
  `midudev`, `Microsoft`, `Google`, `Repositorios y apuntes` y
  `Plataformas y comunidad`.
- Seis entradas de **midudev**: catálogo de cursos por tecnología con su
  formato resuelto, el bootcamp JS Camp, los dos cursos de Next.js separados
  por enrutador, los libros gratuitos, las plantillas de CV y el repositorio
  del curso de React.
- Cuatro de **Microsoft**: las series de Reactor sobre Python + Agentes y
  sobre MCP, el Centro de estudiantes de Microsoft Learn con sus currículos
  abiertos de GitHub, y las rutas de LinkedIn con certificado.
- Dos de **Google**: el programa por cohortes GEAR Get Certified de Google
  Cloud y el certificado profesional de IA en Coursera.
- Siete de **repositorios y apuntes**: preguntas de JavaScript de
  lydiahallie, 30 Days of JavaScript, Node.js Best Practices, algoritmos y
  estructuras de datos de trekhleb, Clean Code en JavaScript, la guía de
  entrevistas de DevCaress y los apuntes manuscritos de Majo.
- Nueve de **plataformas y comunidad**: cursos gratuitos de NVIDIA, CS50x en
  español, Exercism, la certificación A2 de inglés de freeCodeCamp,
  curso-ingles.com, Learn Testing de web.dev, Replit Learn, Learn MCP de
  Cloudflare y dos chuletas en PDF de Git y CSS.
- Iconos de las cinco subcategorías nuevas en `src/config/icons.ts`.
- Sección en `docs/CONTENT_GUIDE.md` sobre el error
  `bad indentation of a mapping entry`, que aparece cuando un valor del
  frontmatter contiene `: ` sin comillas.

### Corregido

- Formatos mal atribuidos en la lista de cursos de midudev. Al resolver los
  acortadores `midu.link`, seis enlaces que figuraban como video suelto son en
  realidad playlists completas (SQL, CSS, TypeScript) o directos grabados
  (Docker), lo que cambia por completo el tiempo que requieren.
- El enlace que circula como "certificado de SQL de midudev" lleva a la
  certificación *SQL Associate* de DataCamp, que es de pago y ajena a
  midudev; queda advertido en la entrada correspondiente.
- Las dos series de Microsoft Reactor estaban cruzadas: `S-1567` es el MCP
  Bootcamp LATAM y `S-1633` es Python + Agentes, no dos ediciones de lo mismo.

### Verificado

- Los 25 enlaces `midu.link` resueltos a su destino final con `curl` para
  documentar el formato real de cada curso.
- Los ocho repositorios de GitHub contrastados contra la API: estrellas,
  licencia, última actualización y existencia real de la traducción al
  español. `devictoribero/clean-code-javascript` resultó ser un fork sin
  cambios desde 2024, así que la entrada apunta al original.
- Requisitos de acceso comprobados donde condicionan el uso: GEAR Get
  Certified exige trabajar en una empresa cliente de Google Cloud con correo
  corporativo, y las plantillas de CV requieren sesión de Google.
- Los 9 enlaces internos de las entradas nuevas devuelven 200.
- `pnpm check` con 0 errores y `pnpm build` con 1590 páginas estáticas.

## [0.11.0] — 2026-08-30

Tres subcategorías nuevas y 19 entradas: el gateway de WhatsApp OpenWA, una
sección completa de estilos visuales de interfaz con demostraciones
renderizadas, una aplicación de video, una librería de skeletons y dos
recursos de IA.

### Añadido

- Subcategoría **WhatsApp API** en General, con cinco guías de OpenWA: qué es
  y sus riesgos reales de bloqueo, instalación con Docker y perfiles de
  servicios, sesiones y envío de mensajes por REST, webhooks con verificación
  HMAC y filtros previos al envío, y el servidor MCP para agentes de IA.
- Subcategoría **Estilos visuales** en UI / UX, con un panorama comparativo de
  los nueve estilos y una guía por cada uno: skeuomorphism, neumorphism,
  glassmorphism, claymorphism, minimalism, maximalism, brutalism, Liquid Glass
  y Spatial UI. Siete incluyen una demostración renderizada en la propia
  página, además del CSS comentado y notas de accesibilidad.
- Subcategoría **Video y grabación** en Aplicaciones, con Borumi: editor de
  escritorio para macOS y Windows con grabación por escenas y edición por
  transcripción.
- Boneyard en UI / UX → UI con React: genera los skeletons de carga midiendo
  los componentes reales con Playwright en tres anchos, en vez de mantenerlos
  a mano.
- Recursos de IA: Napkin AI, que convierte texto en diagramas editables
  (la exportación a SVG requiere plan de pago), y Vibiz AI, que genera embudos
  de marketing completos a partir de la URL de un sitio.
- Iconos `brand-whatsapp` (logotipo propio), `brand-ui-ux-estilos` y
  `brand-apps-video` en `src/config/icons.ts`.

### Cambiado

- `CATEGORY_STACK_ORDER` sitúa las subcategorías nuevas en su lugar de la
  curva de lectura: `whatsapp` al final de General, `ui-ux-estilos` justo
  después de los fundamentos de UI / UX, y `apps-video` entre Diseño y
  diagramación y Notas y documentación.

### Verificado

- Datos de los cinco proyectos externos contrastados contra su fuente real
  —API de GitHub, registro de npm y README oficial— y no contra resúmenes
  automáticos, que confundían OpenWA con el proyecto homónimo
  `@open-wa/wa-automate` y le atribuían una licencia equivocada.
- Las nueve páginas de estilos revisadas en el navegador: el HTML embebido se
  renderiza como demostración real y no queda escapado como texto; el
  `backdrop-filter` del ejemplo de glassmorphism se aplica de verdad.
- Enlaces internos de las entradas nuevas comprobados uno por uno; las tres
  subcategorías aparecen en la navegación y en su página de categoría.
- `pnpm check` con 0 errores y `pnpm build` con 1518 páginas estáticas.

### Nota

- Los tres iconos nuevos quedan registrados por coherencia, pero hoy no se
  dibujan en ninguna página: los iconos de subcategoría solo se renderizan en
  entradas sueltas de categorías sin agrupación, y las entradas nuevas viven
  dentro de una subcategoría.

## [0.10.0] — 2026-08-30

Refactorización completa del código para que sea legible y modificable sin
conocer el proyecto de antemano. La salida pública del sitio no cambia: las
1469 páginas generadas son idénticas a las de 0.9.0.

### Añadido

- `src/config/icons.ts`: tabla única de iconos que leen tanto `<Icon>` (Astro)
  como `DynamicIcon` (React). `BRAND_ICONS` guarda los logos propios y
  `RECOLORED_ICONS` los iconos de lucide con un color fijo.
- `src/features/terminal/`: la consola de `/search` y de Ctrl/Cmd + K como
  feature autocontenido, con su propio README para añadir comandos.
- Guard en build que falla si un comando con descripción no está listado en
  `PUBLIC_COMMANDS`, igual que el que ya existía para `CATEGORY_GROUPS`.
- Plantillas de frontmatter listas para copiar en `docs/CONTENT_GUIDE.md`,
  una por colección.

### Cambiado

- Los iconos dejaron de tener dos registros paralelos. Antes había 40 nombres
  registrados solo en el lado de Astro: no se veía en pantalla, pero cualquier
  icono nuevo podía caer en el genérico sin avisar.
- `src/config/site.ts` deriva los ids de las claves de sus mapas y las
  subcategorías se declaran como `id: "Etiqueta"`; el icono `brand-<id>` se
  calcula solo, con cuatro excepciones declaradas. 945 → 655 líneas.
- `src/lib/content-groups.ts` y `src/lib/page-data.ts` se integraron en
  `src/lib/content.ts` y en las propias rutas. La página de categoría recibe
  una lista de secciones en vez de una unión de tres formas distintas.
- La sidebar y el menú móvil reciben un único campo `groups` en lugar de
  `resourceGroups` y `stackGroups`, que ya se trataban igual.
- La terminal pasó de dos archivos de 1578 líneas a 22 archivos separados por
  responsabilidad: el estado en cuatro hooks, un archivo por familia de
  comandos y los textos largos en `data/`. `executeCommand`, que ocupaba 534
  líneas seguidas, es ahora una tabla de comandos; `COMMAND_DESCRIPTIONS`,
  `COMMANDS_WITH_ARGS` y `COMMAND_SET` se derivan de ella.
- `src/lib/rehype-code-blocks.mjs` construye los nodos con un helper `h()`.
- Cada sección de la página de categoría lleva `aria-label` con su título.

### Eliminado

- `scripts/new-content.ts` y el comando `pnpm content:new`. Para crear una
  entrada se copia el frontmatter de una similar.
- Código sin uso: `groupByType`, `STACK_LIST`, `LEARNING_TYPE_ORDER`
  exportado, y los campos `dependencies` y `library` de las relaciones, que no
  existían en ningún schema.
- `src/content/guides/node_modules/`, una caché de Vite creada por error
  dentro de la carpeta de contenido.

### Corregido

- `text-var(--accent-green)` en la home: no era una clase válida de Tailwind y
  dejaba el icono del badge sin color.

### Verificado

- `pnpm check` con 0 errores; permanece el hint conocido de `document.execCommand`.
- `pnpm build` con 1469 páginas estáticas.
- Comparación página por página del HTML generado contra la versión anterior:
  1449 de 1469 idénticas, 19 con solo el `aria-label` nuevo y diferencias de
  espacios sin efecto visual, y `index.html` por un cambio previo sin publicar.
- Terminal probada en el navegador: los 31 comandos públicos, el ciclo de
  `/quiz`, el historial con flechas, el autocompletado con Tab, la navegación
  con `/open` y `/cd`, y el diálogo abriendo y cerrando con Ctrl+K, `/` y Escape.

## [0.9.0] — 2026-08-29

Reorganización estructural de la aplicación, flujo asistido para crear
contenido y ampliación de Git, GitHub, gestión de repositorios y GitHub
Actions, manteniendo sin cambios la salida pública del sitio.

### Añadido

- Comando interactivo `pnpm content:new` para crear borradores Markdown en la
  colección correcta, con validación de tipo, categoría, subcategoría,
  referencias, orden y campos específicos.
- Opción `pnpm content:new -- --list` para consultar los tipos, categorías,
  subcategorías y categorías de recursos directamente desde la configuración
  vigente, sin tener que leer el código.
- Guía completa de autoría en `docs/CONTENT_GUIDE.md`, con el paso a paso para
  crear, relacionar, publicar y organizar entradas, además de ampliar
  categorías, stacks y colecciones.
- Documentación de arquitectura en `docs/ARCHITECTURE.md`, centrada en el flujo
  real de configuración, contenido, relaciones, rutas y comportamiento del
  navegador.
- Módulos internos para agrupar contenido por categoría, stack o tipo de
  recurso y para preparar los datos complejos de inicio, detalle y búsqueda.
- Componente compartido para los botones de copia usados en comandos e
  instalaciones.

### Cambiado

- Git & GitHub se organizó en seis subcategorías claras: Git, GitHub,
  Gestión de repositorios, Perfil y cuenta, GitHub CLI y GitHub Actions.
- Se ampliaron las rutas de aprendizaje de Git, trabajo colaborativo,
  repositorios locales y remotos, forks, pull/push, configuración comunitaria,
  seguridad, workflows, matrices, caché, secretos, permisos y despliegues.
- Las reglas de agrupación que estaban repetidas entre páginas de categorías,
  tags y navegación ahora viven en un único módulo explícito.
- Los esquemas de las 14 colecciones reutilizan un único constructor para el
  loader y los campos base, conservando los mismos campos, defaults y errores.
- Los IDs de tipos, stacks y categorías de recursos se derivan de sus mapas.
  `CATEGORY_IDS` conserva su orden público histórico de forma explícita.
- La configuración y las funciones puras de la terminal se separaron del
  estado y renderizado de `SearchResults.tsx`.
- Las interacciones globales del navegador se extrajeron del script inline de
  `BaseLayout.astro` a un módulo dedicado.
- README y guía de contribución enlazan ahora el generador y la documentación
  de autoría.

### Eliminado

- Componentes internos sin consumidores: `Kbd.astro`, `ui/button.tsx` y
  `ui/command.tsx`.
- Dependencias directas que dejaron de ser necesarias: `cmdk`,
  `class-variance-authority` y `@radix-ui/react-slot`.
- Listas duplicadas de IDs cuando su orden podía derivarse sin modificar la
  API pública.

### Verificado

- `pnpm check` con 0 errores y 0 warnings; permanece un único hint conocido
  por el fallback de copia con `document.execCommand`.
- `pnpm build` completado correctamente con 1469 páginas estáticas.
- Los exports públicos de tipos, categorías, recursos y stacks conservan los
  mismos valores y el mismo orden que en la versión anterior.
- Comparación de 1470 salidas textuales sin diferencias funcionales y hash
  idéntico para el índice de búsqueda.
- Generador validado con catálogo, combinaciones categoría/subcategoría,
  integraciones y creación en modo `--dry-run`.

## [0.8.0] — 2026-08-28

Expansión de las guías de Base de Datos y Testing, incorporación de
herramientas CLI, una nueva categoría para Cursos y nuevos recursos técnicos.

### Añadido

- Recurso `Shadow Palette Generator` en la subcategoría CSS, con una guía
  breve para convertir sus niveles de sombra en tokens de elevación.
- Recursos `RapidAPI Hub` en APIs y `Apify MCP Connectors` en IA, con
  criterios para evaluar proveedores, costos, credenciales y permisos.
- Nueva categoría vacía `Cursos`, ubicada después de Aplicaciones y preparada
  para incorporar rutas de estudio progresivamente.
- Nueva subcategoría `CLI` en Aplicaciones, con una guía de
  instalación y flujo esencial de Git.
- Siete módulos para Testing: plan de pruebas y calidad no funcional, datos y
  fixtures, MSW, Testcontainers para Node.js, Playwright práctico, regresión
  visual/accesibilidad y evals para aplicaciones con IA.
- Ocho guías nuevas para Base de Datos: tipos, `NULL` e integridad; patrones de
  modelado; escritura SQL segura; SQL avanzado; mantenimiento y seguridad de
  PostgreSQL; MongoDB; Redis; y observabilidad y seguridad operacional.

### Cambiado

- GitHub CLI, Vercel CLI, Supabase CLI, Railway CLI, NVM, pnpm, Bun y
  Chocolatey se organizaron dentro de Aplicaciones y se ampliaron con
  instalación, verificación, autenticación cuando corresponde, comandos de
  uso diario, seguridad, automatización y errores habituales.
- Las instalaciones basadas en pnpm, Bun o npm de las nuevas guías CLI usan
  el selector unificado por pestañas del proyecto.
- Las cinco subcategorías propias de Testing y sus apartados de React, Astro y
  Next.js se ampliaron con ejemplos, tablas de consulta, criterios de nivel,
  aislamiento, datos, flakiness, CI, seguridad y diagnóstico.
- La curva de Testing ahora avanza desde terminología, estrategia y diseño de
  casos hacia Vitest, integración/contratos, frameworks, Playwright y testing
  asistido por IA, manteniendo accesos rápidos para consulta.
- Las seis subcategorías de Base de Datos ahora siguen una curva progresiva
  para aprender desde cero y conservan tablas, ejemplos y listas rápidas para
  consulta: fundamentos → modelado → SQL → PostgreSQL → NoSQL → operación.
- Las nueve guías existentes de Base de Datos se ampliaron con terminología,
  casos de uso, errores frecuentes, seguridad, concurrencia, migraciones sin
  interrupción, recuperación, pooling y diagnóstico.

### Verificado

- Diagnósticos de Astro y TypeScript mediante `pnpm check`.
- Generación estática y validación de relaciones de contenido mediante
  `pnpm build`.

## [0.7.0] — 2026-08-27

Subcategorías HTML y React en UI/UX con catálogos de componentes reales,
logos de marca oficiales para IA Tools & Skills, subcategorías CSS y Utils
en General, y el menú móvil reescrito con accordion real.

### Añadido

- Subcategorías `HTML` y `React` en UI/UX con 15 librerías/catálogos de
  componentes: shadcn/ui, HeroUI, Magic UI, Chakra UI, Mantine, Material UI
  y Ant Design (React); Tailwind Plus, Flowbite, daisyUI, Preline UI,
  HyperUI, Bootstrap, Bulma y Pico CSS (HTML). Cada una con instalación,
  configuración inicial y link a documentación oficial.
- Bloque "documentación oficial" (+ GitHub) en `EntryMeta.astro` para
  cualquier entrada con `website`/`github` en el frontmatter — esos campos
  existían hace tiempo pero no se renderizaban en ningún lado del sitio.
- Subcategorías `CSS` y `Utils` en General, agrupando los 7 snippets de CSS
  y las 9 utilities existentes. Ícono nuevo `brand-utils` (wrench en ámbar).
- Logos de marca reales (paths oficiales de simple-icons) para Claude Code,
  Codex/OpenAI, Cursor y OpenCode en IA Tools & Skills, reemplazando los
  glifos de texto ("CC"/"OC"/"Cu"/"Cx") que tenían antes.

### Cambiado

- Menú móvil (`MobileNav.tsx`) reescrito con accordion nativo
  `<details>/<summary>`, igual que la sidebar de escritorio: categorías y
  subgrupos cierran por defecto y solo se auto-abre la rama que contiene la
  página activa. Antes listaba todo expandido de una — scroll larguísimo e
  imposible de navegar rápido en teléfono.
- `technologies/react.md` con `stack: react` asignado, para que viva dentro
  de la subcategoría React de Frontend en vez de aparecer como entrada
  suelta e independiente en el sidebar.

### Eliminado

- Componente "Dialog reutilizable con shadcn/ui" (duplicado de
  `shadcn-ui.md`), junto con la referencia rota que quedaba en ese archivo.

### Verificado

- `pnpm check` sin errores tras cada tanda de cambios.
- Accordion del menú móvil verificado en viewport 375×812: en una página de
  contenido solo se auto-abre la categoría y el subgrupo con la entrada
  activa, el resto del árbol queda colapsado.

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

[Unreleased]: https://github.com/iangelmanuel/angel-library/compare/v0.16.1...HEAD
[0.16.1]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.16.1
[0.16.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.16.0
[0.15.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.15.0
[0.14.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.14.0
[0.13.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.13.0
[0.12.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.12.0
[0.11.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.11.0
[0.10.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.10.0
[0.9.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.9.0
[0.8.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.8.0
[0.7.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.7.0
[0.6.1]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.6.1
[0.6.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.6.0
[0.5.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.5.0
[0.4.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.4.0
[0.3.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.3.0
[0.2.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.2.0
[0.1.0]: https://github.com/iangelmanuel/angel-library/releases/tag/v0.1.0
