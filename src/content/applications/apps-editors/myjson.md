---
title: Configuración personal de VS Code
description: Preferencias personales de editor, terminal, explorador, formato, Git y asistentes para Visual Studio Code.
type: commands
tags: [vscode, configuración, editor, terminal, personal]
command: /myjson
whenToUse: Ejecuta /myjson en la terminal interna para abrir esta configuración privada.
warnings:
  - "Esta entrada es privada y queda fuera del sidebar, los listados, las etiquetas y el índice de búsqueda público."
  - "Algunas preferencias dependen de extensiones instaladas en VS Code, como Prettier, ESLint, One Dark Pro y Flow Deep."
private: true
updatedAt: 2026-08-26
---

## Cómo abrirla

Escribe `/myjson` en la terminal de búsqueda de `angel.library`. El comando abre
esta entrada directamente en `/applications/apps-editors/myjson` y conserva el mismo layout,
tipografía, navegación y bloques de código que el resto de la documentación.

También puedes copiar el bloque completo y pegarlo en **Preferences: Open User
Settings (JSON)** para aplicarlo a tu perfil global de VS Code. Si solo quieres
usarlo en un proyecto, guárdalo como `.vscode/settings.json`; en ese caso, la
configuración queda limitada a ese workspace.

## Antes de aplicarla

El archivo usa **JSONC (JSON with Comments)**, la variante que VS Code acepta en
sus archivos de configuración. Por eso conserva comentarios `//`, aunque no
sería JSON estricto para un parser externo. No elimines los comentarios: explican
la intención de cada grupo y hacen que la configuración sea más fácil de mantener.

Esta es una configuración personal, no una plantilla universal. Revisa el tema,
la fuente, los iconos y los identificadores de extensiones antes de copiarla a
otro equipo. Las opciones que comienzan con `oneDarkPro.`, por ejemplo, solo
tienen efecto si la extensión correspondiente está instalada.

## Configuración completa

El siguiente bloque conserva exactamente la configuración original compartida
para esta página, incluidos comentarios, emojis y valores.

```jsonc title="settings.json"
{
  "editor.cursorBlinking": "expand",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.fontLigatures": true,
  "editor.inlineSuggest.enabled": true,
  "editor.linkedEditing": true,
  "editor.minimap.autohide": "mouseover",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.stickyScroll.enabled": false,

  "workbench.layoutControl.enabled": false,
  "workbench.editor.empty.hint": "hidden",
  "workbench.activityBar.location": "bottom",
  "workbench.sideBar.location": "right",

  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,

  "window.menuBarVisibility": "compact",
  "window.commandCenter": false,

  "diffEditor.wordWrap": "on",
  "update.mode": "manual",
  "breadcrumbs.enabled": false,

  // TERMINAL
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.env.osx": {},
  "terminal.integrated.env.windows": {},

  // FILE CONFIG
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "tsconfig.json": "tsconfig.*.json",
    "package.json": "package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb, tsconfig.json, postcss.config.js, postcss.config.mjs, tailwind.config.js, tailwind.config.mjs, tailwind.config.cjs, tailwind.config.ts, .gitignore, .gitattributes, .eslintrc.json, .eslintrc.cjs, eslint.config.mjs, eslint.config.js, .eslintignore, .prettierrc, .prettierignore, next.config.js, next.config.ts, next.config.mjs, nuxt.config.ts, next-env.d.ts, astro.config.mjs, astro.config.ts, vite.config.ts, vite.config.js, README.md, CHANGELOG.md, AGENTS.md, CLAUDE.md, INSTALL.md, LICENSE, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, FUNDING.yml, SUPPORT.md, .editorconfig, .env, .env.local, .env.example, .env.template, jest.config.js, nextauth.d.ts, components.json, bun.lock, pnpm-workspace.yaml, vite-env.d.ts, app.json, skills-lock.json, expo-env.d.ts, babel.config.js, metro.config.js, nativewind-env.d.ts, prisma.config.ts, .dockerignore, docker-compose.yml, Dockerfile, .nvmrc, .nvmrc, .node-version, tsconfig.tsbuildinfo, tsconfig.tsbuildinfo, vercel.json"
  },
  "workbench.editor.customLabels.patterns": {
    // NEXT JS APP ROUTER
    "**/app/**/layout.tsx": "${filename}.${extname} - 📐 Layout",
    "**/app/**/page.tsx": "${filename}.${extname} - 📚 Pages",
    "**/app/**/ui/**": "${filename}.${extname} - 🖼️ PageUI",
    "**/app/**": "${filename}.${extname} - 📦 Others",
    "**/app/**/loading.tsx": "${filename}.${extname} - 🔃 Loader",
    "**/app/**/not-found.tsx": "${filename}.${extname} - ⛔ 404",

    // OTHER FRAMEWORKS
    "**/pages/**": "${filename}.${extname} - 📚 Pages",
    "**/prisma/**": "${filename}.${extname} - 📑 Prisma",

    // GENERAL
    "**/types/**": "${filename}.${extname} - 🌀 T",
    "**/actions/**": "${filename}.${extname} - 💻 Act",
    "**/components/**": "${filename}.${extname} - 📗 Comp",
    "**/config/**": "${filename}.${extname} - ⚙️ Config",
    "**/consts/**": "${filename}.${extname} - 📘 Consts",
    "**/data/**": "${filename}.${extname} - 🗞️ Datas",
    "**/lib/**": "${filename}.${extname} - 📔 Lib",
    "**/provider/**": "${filename}.${extname} - 🏎️ Prov",
    "**/schema/**": "${filename}.${extname} - 🌲 Schemas",
    "**/store/**": "${filename}.${extname} - 🎒 Stores",
    "**/styles/**": "${filename}.${extname} - 🎨 Styles",
    "**/utils/**": "${filename}.${extname} - ✏️ Utils"
  },

  // FONTS
  "editor.fontSize": 15,
  "editor.fontFamily": "JetBrains Mono, Cascadia Code, Consolas",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.fontFamily": "JetBrains Mono",

  // THEME
  "workbench.colorTheme": "One Dark Pro Darker",
  "oneDarkPro.editorTheme": "Just Black",
  "workbench.preferredDarkColorTheme": "Ocean High Contrast",
  "oneDarkPro.bold": true,
  "oneDarkPro.italic": false,
  "oneDarkPro.vivid": true,
  "workbench.iconTheme": "flow-deep",

  // EDITOR FORMAT CONFIG
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // PRETTIER CONFIG
  "prettier.documentSelectors": ["**/*.astro"],
  "prettier.bracketSpacing": true,
  "prettier.semi": false,
  "prettier.singleQuote": false,
  "prettier.jsxSingleQuote": false,
  "prettier.quoteProps": "preserve",
  "prettier.trailingComma": "none",
  "prettier.singleAttributePerLine": true,
  "prettier.htmlWhitespaceSensitivity": "css",
  "prettier.proseWrap": "preserve",
  "prettier.printWidth": 80,
  "prettier.tabWidth": 2,
  "prettier.embeddedLanguageFormatting": "auto",
  "prettier.requireConfig": false,
  "prettier.enableDebugLogs": false,

  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ESLINT
  "eslint.codeActionsOnSave.rules": null,
  "eslint.format.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  // GIT GITHUB
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true,
    "scminput": false
  },

  // IA
  "github.copilot.nextEditSuggestions.enabled": true,
  "claudeCode.preferredLocation": "panel",
  "security.promptForLocalFileProtocolHandling": false
}
```

## Qué controla cada configuración

Esta sección funciona como una referencia rápida para recordar qué hace cada
clave sin tener que abrir la documentación de VS Code. La columna **Efecto en
esta configuración** describe el valor escrito en el bloque; **Cuándo tenerlo
en cuenta** explica el caso de uso o la precaución asociada.

### 1. Editor y escritura

El grupo `editor.*` define la experiencia diaria al escribir código. Estas
opciones no cambian la lógica de la aplicación: cambian la forma en que VS Code
presenta, completa y ajusta el texto.

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `editor.cursorBlinking` | `expand` | Hace que el cursor use una animación de expansión al parpadear. | Es una preferencia visual; usa `solid` si la animación distrae. |
| `editor.cursorSmoothCaretAnimation` | `on` | Suaviza el desplazamiento del cursor entre posiciones. | Ayuda a seguirlo en archivos largos; puede sentirse menos inmediato en equipos lentos. |
| `editor.fontLigatures` | `true` | Permite que la fuente represente combinaciones como `=>`, `!=` o `===` con ligaduras visuales. | Solo cambia la apariencia; no cambia el texto ni el código ejecutado. |
| `editor.inlineSuggest.enabled` | `true` | Muestra sugerencias insertadas dentro de la línea actual. | Acelera la escritura, pero revisa siempre el código sugerido antes de aceptarlo. |
| `editor.linkedEditing` | `true` | Mantiene sincronizados nombres relacionados, como etiquetas HTML de apertura y cierre. | Es útil en HTML, JSX y Astro; no sustituye la validación del framework. |
| `editor.minimap.autohide` | `mouseover` | Oculta el minimapa hasta pasar el puntero por su zona. | Conserva espacio para el código sin perder la vista panorámica. |
| `editor.tabSize` | `2` | Define cuántos espacios representa una tabulación visual. | Debe coincidir con `.editorconfig` y con las reglas del proyecto. |
| `editor.wordWrap` | `on` | Ajusta visualmente las líneas largas al ancho disponible. | No inserta saltos reales en el archivo; solo evita el scroll horizontal. |
| `editor.stickyScroll.enabled` | `false` | Desactiva los encabezados que permanecen fijos al desplazarte. | Puede ser más limpio para snippets; actívalo en archivos grandes y muy anidados. |

`editor.tabSize: 2` no convierte tabs existentes en espacios ni formatea por sí
solo un archivo. Solo establece su representación visual y sirve como valor por
defecto del editor.

### 2. Interfaz, ventanas y explorador

`workbench.*`, `window.*`, `explorer.*` y `breadcrumbs.enabled` controlan el
*workbench*, es decir, el espacio de trabajo completo de VS Code: paneles,
pestañas, explorador y controles de navegación.

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `workbench.layoutControl.enabled` | `false` | Oculta el control visual para cambiar rápidamente el layout de paneles. | Reduce ruido; todavía puedes cambiarlo desde la paleta de comandos. |
| `workbench.editor.empty.hint` | `hidden` | Oculta las sugerencias de la pantalla sin editores abiertos. | Deja una pantalla inicial más limpia sin eliminar comandos. |
| `workbench.activityBar.location` | `bottom` | Mueve la barra de actividad a la parte inferior. | La barra contiene explorador, búsqueda, control de código fuente y extensiones. |
| `workbench.sideBar.location` | `right` | Coloca la barra lateral a la derecha. | Puede funcionar mejor junto a un editor ancho; la izquierda suele ser más familiar. |
| `explorer.confirmDelete` | `false` | No pide confirmación antes de borrar desde el explorador. | Agiliza el flujo, pero aumenta el riesgo de borrar algo por error. |
| `explorer.confirmDragAndDrop` | `false` | No pide confirmación al mover archivos mediante arrastrar y soltar. | Útil para reorganizar; actívalo si sueles mover archivos accidentalmente. |
| `window.menuBarVisibility` | `compact` | Reduce la barra de menús a una presentación compacta. | Recupera espacio vertical; la paleta de comandos sigue disponible. |
| `window.commandCenter` | `false` | Oculta el Command Center de la barra superior. | `Ctrl/Cmd + Shift + P` sigue abriendo la paleta. |
| `diffEditor.wordWrap` | `on` | Ajusta las líneas largas en la vista de diferencias. | Mejora la lectura de textos extensos, aunque puede dificultar comparar columnas anchas. |
| `update.mode` | `manual` | Evita que VS Code gestione actualizaciones automáticamente. | Da control sobre el momento de actualizar; revisa actualizaciones de seguridad. |
| `breadcrumbs.enabled` | `false` | Oculta las migas con archivo, símbolo y estructura. | Reduce elementos visuales; actívalas para navegar clases, funciones o propiedades. |

**Terminología:** la *activity bar* es la barra de vistas principales y la
*sidebar* es el panel que muestra el contenido de la vista seleccionada.

### 3. Terminal y variables de entorno

La terminal integrada ejecuta un *shell*, el programa que interpreta comandos
como `pnpm`, `git` o `cd`. Estas claves fijan el perfil y dejan explícito que no
se agregan variables personalizadas.

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `terminal.integrated.defaultProfile.windows` | `PowerShell` | Usa PowerShell como perfil predeterminado en Windows. | Requiere que el perfil exista; puedes elegir Git Bash, WSL o Command Prompt. |
| `terminal.integrated.env.osx` | `{}` | No agrega ni sobrescribe variables en macOS. | No es un archivo `.env` ni carga secretos; solo deja el entorno intacto. |
| `terminal.integrated.env.windows` | `{}` | No agrega ni sobrescribe variables en Windows. | Mantiene el entorno del sistema y reduce diferencias con una terminal externa. |

No coloques tokens, contraseñas ni claves privadas en estos objetos: una variable
configurada aquí puede quedar disponible para procesos iniciados desde VS Code.

### 4. Agrupación de archivos en el explorador

*File nesting* crea una relación visual padre-hijo. No mueve, renombra ni
elimina archivos; únicamente cambia cómo se presentan en el explorador.

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `explorer.fileNesting.enabled` | `true` | Activa la agrupación visual de archivos relacionados. | Mantiene proyectos grandes compactos; desactívala si prefieres una lista plana. |
| `explorer.fileNesting.patterns` | objeto de patrones | Declara qué archivos se muestran debajo de otro archivo padre. | Los nombres y rutas reales no cambian. |

| Archivo padre | Archivos que agrupa | Motivo práctico |
| --- | --- | --- |
| `tsconfig.json` | `tsconfig.*.json` | Mantiene juntas las variantes de configuración de TypeScript. |
| `package.json` | Lockfiles, PostCSS, Tailwind, ESLint, Prettier, frameworks, documentación, variables de entorno de ejemplo, Docker, Prisma, Vite, TypeScript y otros archivos de proyecto. | Presenta `package.json` como centro de configuración y evita saturar la raíz visual. |

El patrón largo incluye archivos como `pnpm-lock.yaml`, `bun.lock`,
`next.config.*`, `astro.config.*`, `README.md`, `.env.example`, `Dockerfile`,
`prisma.config.ts` y `vercel.json`. Si un equipo necesita encontrarlos siempre
en la raíz, conviene quitar esos nombres del patrón.

### 5. Etiquetas visuales para pestañas

`workbench.editor.customLabels.patterns` cambia el texto mostrado en la pestaña
según la ruta. La expresión `${filename}.${extname}` conserva el nombre y la
extensión originales; el texto después del guion es solo una etiqueta.

| Ruta detectada | Etiqueta | Para qué sirve |
| --- | --- | --- |
| `**/app/**/layout.tsx` | `📐 Layout` | Identifica layouts del App Router de Next.js. |
| `**/app/**/page.tsx` | `📚 Pages` | Identifica páginas dentro de `app`. |
| `**/app/**/ui/**` | `🖼️ PageUI` | Señala componentes de interfaz de una página. |
| `**/app/**` | `📦 Others` | Etiqueta archivos restantes dentro de `app`. |
| `**/app/**/loading.tsx` | `🔃 Loader` | Identifica estados de carga de Next.js. |
| `**/app/**/not-found.tsx` | `⛔ 404` | Identifica la UI de recurso no encontrado. |
| `**/pages/**` | `📚 Pages` | Marca páginas o rutas de otros frameworks o del Pages Router. |
| `**/prisma/**` | `📑 Prisma` | Identifica esquemas, migraciones o archivos de Prisma. |
| `**/types/**` | `🌀 T` | Señala tipos y contratos compartidos. |
| `**/actions/**` | `💻 Act` | Señala acciones del servidor o funciones de mutación. |
| `**/components/**` | `📗 Comp` | Identifica componentes reutilizables. |
| `**/config/**` | `⚙️ Config` | Identifica configuración centralizada. |
| `**/consts/**` | `📘 Consts` | Identifica constantes compartidas. |
| `**/data/**` | `🗞️ Datas` | Identifica datos estáticos o semillas. |
| `**/lib/**` | `📔 Lib` | Identifica módulos de infraestructura o integración. |
| `**/provider/**` | `🏎️ Prov` | Identifica proveedores de contexto o servicios. |
| `**/schema/**` | `🌲 Schemas` | Identifica esquemas de validación o persistencia. |
| `**/store/**` | `🎒 Stores` | Identifica módulos de estado. |
| `**/styles/**` | `🎨 Styles` | Identifica estilos y tokens visuales. |
| `**/utils/**` | `✏️ Utils` | Identifica utilidades pequeñas y reutilizables. |

El orden importa cuando varias rutas coinciden: las excepciones específicas de
`layout.tsx`, `page.tsx`, `loading.tsx` y `not-found.tsx` se evalúan junto a las
rutas del App Router. Estas etiquetas no afectan imports, rutas, compilación ni
nombres en el sistema de archivos.

### 6. Fuentes y ligaduras

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `editor.fontSize` | `15` | Define el tamaño del texto del editor. | Un tamaño mayor mejora lectura; uno menor muestra más código. |
| `editor.fontFamily` | `JetBrains Mono, Cascadia Code, Consolas` | Define fuentes de respaldo en orden de preferencia. | Todas son monoespaciadas; si falta la primera, se intenta la siguiente. |
| `terminal.integrated.fontSize` | `14` | Define el tamaño de la fuente de la terminal integrada. | Puede ser menor que el editor para mostrar más salida. |
| `terminal.integrated.fontFamily` | `JetBrains Mono` | Usa JetBrains Mono en la terminal. | Si no está instalada, el sistema usa una alternativa. |

Una fuente monoespaciada asigna el mismo ancho a cada carácter, algo útil para
tablas, diagramas ASCII y salidas de comandos. Las ligaduras siguen siendo un
recurso visual y no sustituyen entender los operadores.

### 7. Tema, color e iconos

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `workbench.colorTheme` | `One Dark Pro Darker` | Selecciona el tema general de colores. | Necesita la extensión o tema instalado para verse igual. |
| `oneDarkPro.editorTheme` | `Just Black` | Define la variante del editor de One Dark Pro. | Solo tiene efecto con One Dark Pro. |
| `workbench.preferredDarkColorTheme` | `Ocean High Contrast` | Indica el tema oscuro preferido. | El alto contraste mejora legibilidad, pero revisa la semántica de colores. |
| `oneDarkPro.bold` | `true` | Activa pesos tipográficos en negrita. | Mejora jerarquía visual; puede ser intenso en archivos muy coloridos. |
| `oneDarkPro.italic` | `false` | Desactiva cursivas del tema. | Evita variaciones de inclinación en comentarios o tokens. |
| `oneDarkPro.vivid` | `true` | Usa colores de sintaxis más intensos. | Facilita distinguir tokens; reduce la intensidad si genera fatiga visual. |
| `workbench.iconTheme` | `flow-deep` | Selecciona el conjunto de iconos del explorador. | Requiere que el tema de iconos esté instalado. |

`colorTheme` cambia colores de la interfaz y la sintaxis; `iconTheme` cambia
iconos de archivos y carpetas. Las claves `oneDarkPro.*` pueden permanecer
guardadas aunque la extensión no esté instalada.

### 8. Formato al guardar y acciones de código

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `editor.defaultFormatter` | `esbenp.prettier-vscode` | Selecciona Prettier como formateador general. | Requiere la extensión; un workspace puede sobrescribirlo. |
| `editor.formatOnSave` | `true` | Formatea el archivo al guardarlo. | Mantiene consistencia, pero revisa el diff si el proyecto usa otras reglas. |
| `editor.codeActionsOnSave.source.fixAll.eslint` | `explicit` | Ejecuta correcciones globales de ESLint al guardar explícitamente. | Limpia problemas automáticamente, pero depende de las reglas del proyecto. |

Prettier organiza el estilo; ESLint analiza problemas y puede aplicar
correcciones. Si ambos intentan controlar la misma regla, el resultado depende
del orden y de la configuración del proyecto.

### 9. Preferencias de Prettier

Prettier es un formateador automático: recibe código y devuelve una versión con
un estilo consistente. El archivo `.prettierrc` del proyecto puede tener
prioridad sobre estas preferencias globales.

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `prettier.documentSelectors` | `**/*.astro` | Hace que Prettier reconozca archivos Astro mediante ese selector. | El selector `[astro]` usa después el formateador oficial de Astro. |
| `prettier.bracketSpacing` | `true` | Deja espacios dentro de objetos: `{ name }`. | Es estilo, no comportamiento. |
| `prettier.semi` | `false` | No agrega punto y coma al final. | Usa la regla del proyecto si el equipo exige semicolons. |
| `prettier.singleQuote` | `false` | Prefiere comillas dobles en JavaScript y TypeScript. | Puede cambiar comillas existentes al guardar. |
| `prettier.jsxSingleQuote` | `false` | Prefiere comillas dobles en atributos JSX. | Mantiene JSX alineado con la preferencia general. |
| `prettier.quoteProps` | `preserve` | Conserva las comillas existentes en propiedades válidas. | Evita cambios innecesarios en claves como `{ "data-id": value }`. |
| `prettier.trailingComma` | `none` | No agrega comas finales. | Produce diffs pequeños; otros equipos prefieren `all`. |
| `prettier.singleAttributePerLine` | `true` | Coloca cada atributo HTML o JSX en su propia línea cuando se divide. | Mejora lectura y diffs de componentes con muchos atributos. |
| `prettier.htmlWhitespaceSensitivity` | `css` | Tiene en cuenta cómo CSS puede afectar los espacios HTML. | Evita cambios visibles en texto inline. |
| `prettier.proseWrap` | `preserve` | Conserva saltos escritos en Markdown o texto. | Útil para documentación con intención editorial. |
| `prettier.printWidth` | `80` | Intenta mantener líneas dentro de 80 columnas. | Es una guía; cadenas largas pueden superarlo. |
| `prettier.tabWidth` | `2` | Usa dos espacios al indentar. | Debe coincidir con `editor.tabSize`. |
| `prettier.embeddedLanguageFormatting` | `auto` | Formatea lenguajes incrustados cuando los identifica. | Afecta CSS, JavaScript o HTML dentro de otros archivos. |
| `prettier.requireConfig` | `false` | Permite formatear sin `.prettierrc`. | Práctico para archivos aislados; los equipos pueden exigir config compartida. |
| `prettier.enableDebugLogs` | `false` | Mantiene desactivados los logs detallados. | Actívalos temporalmente para diagnosticar detección o configuración. |

#### Formateadores por lenguaje

| Selector | Formateador | Resultado |
| --- | --- | --- |
| `[astro]` | `astro-build.astro-vscode` | Extensión oficial para `.astro`. |
| `[html]` | `esbenp.prettier-vscode` | Prettier para HTML. |
| `[javascript]` | `esbenp.prettier-vscode` | Prettier para JavaScript. |
| `[typescript]` | `esbenp.prettier-vscode` | Prettier para TypeScript. |
| `[typescriptreact]` | `esbenp.prettier-vscode` | Prettier para TSX. |
| `[javascriptreact]` | `esbenp.prettier-vscode` | Prettier para JSX. |

`typescriptreact` representa TypeScript con JSX, no una extensión concreta del
archivo.

### 10. ESLint

ESLint es análisis estático: revisa el código sin ejecutarlo y detecta errores,
patrones riesgosos o incumplimientos de estilo.

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `eslint.codeActionsOnSave.rules` | `null` | No limita las correcciones a una lista de reglas concreta. | Delega la selección a la configuración del proyecto. |
| `eslint.format.enable` | `true` | Permite que ESLint participe como formateador. | Si compite con Prettier, define un único responsable del formato. |
| `eslint.validate` | JavaScript, JavaScript React, TypeScript y TypeScript React | Indica los lenguajes que ESLint analizará. | Astro depende de su extensión y configuración correspondiente. |

El análisis al guardar es una ayuda local, no reemplaza el CI ni una revisión
del código. Ejecuta el script de lint del proyecto antes de compartir cambios.

### 11. Git, GitHub y asistentes

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `git.autofetch` | `true` | Consulta referencias nuevas del remoto. | No hace merge ni rebase automáticamente. |
| `git.confirmSync` | `false` | No pide confirmación adicional al sincronizar. | Revisa rama y remoto antes de usar Sync. |
| `git.enableSmartCommit` | `true` | Permite confirmar cambios directamente si no hay un commit preparado, según el flujo de VS Code. | Revisa los archivos incluidos para no confirmar secretos o archivos incorrectos. |
| `github.copilot.enable` | objeto por lenguaje | Activa o desactiva Copilot según el lenguaje. | Depende de extensión, cuenta, políticas de privacidad y servicio disponible. |
| `github.copilot.nextEditSuggestions.enabled` | `true` | Activa sugerencias que anticipan la siguiente edición relacionada. | Valida que respeten el contexto y las reglas del repositorio. |
| `claudeCode.preferredLocation` | `panel` | Abre Claude Code preferentemente en el panel. | Solo cambia la ubicación visual de la herramienta. |

En `github.copilot.enable`, `"*": true` significa activo por defecto;
`plaintext: false` evita sugerencias en texto plano, `markdown: true` las
permite en documentación y `scminput: false` las evita en entradas de control
de código fuente.

Antes de aceptar código generado, revisa dependencias, permisos, errores, datos
sensibles y licencias. Que el código compile no significa que sea correcto o
seguro para el proyecto.

### 12. Seguridad de enlaces locales

| Configuración | Valor | Qué hace | Cuándo tenerlo en cuenta |
| --- | --- | --- | --- |
| `security.promptForLocalFileProtocolHandling` | `false` | Desactiva el aviso al abrir enlaces con protocolo `file://`. | Reduce una confirmación, pero elimina una barrera contra enlaces locales inesperados. |

Un enlace `file://` puede apuntar a un archivo del equipo. No aceptes enlaces de
proyectos, issues o documentación desconocidos sin revisar su destino. Si el
workspace se comparte, considera volver a `true`.

## Mapa rápido de la configuración

| Necesidad | Grupo que debes revisar |
| --- | --- |
| Cursor, tabs, ajuste de líneas y sugerencias | `editor.*` |
| Paneles, menú y navegación | `workbench.*`, `window.*`, `breadcrumbs.enabled` |
| Shell y entorno de terminal | `terminal.integrated.*` |
| Agrupar archivos | `explorer.fileNesting.*` |
| Etiquetas de pestañas | `workbench.editor.customLabels.patterns` |
| Fuente y apariencia | `editor.font*`, `terminal.integrated.font*`, `workbench.*Theme`, `oneDarkPro.*` |
| Formato automático | `editor.defaultFormatter`, `editor.formatOnSave`, `prettier.*` |
| Diagnóstico y correcciones | `eslint.*`, `editor.codeActionsOnSave` |
| Git y asistencia de IA | `git.*`, `github.copilot.*`, `claudeCode.*` |
| Avisos de enlaces locales | `security.*` |

Cuando una opción no tenga efecto, revisa que la clave esté escrita exactamente,
que el valor sea válido para tu versión de VS Code y que la extensión propietaria
esté instalada. Si existe una configuración de usuario, workspace o carpeta,
comprueba cuál tiene prioridad desde **Developer: Inspect Settings**.

## Privacidad de esta página

El campo `private: true` mantiene esta entrada fuera de la navegación pública,
los listados de colección, las etiquetas y el índice de búsqueda. La ruta de
detalle sigue existiendo para que `/myjson` pueda abrirla directamente.

La configuración se conserva como conocimiento personal del proyecto. Antes de
compartirla, revisa especialmente rutas locales, extensiones instaladas,
preferencias de asistentes y cualquier futura variable de entorno que decidas
añadir.
