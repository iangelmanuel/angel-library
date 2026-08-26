---
title: Configuración personal de VS Code
description: Mis preferencias de editor, terminal, explorador, formato, Git y asistentes para Visual Studio Code.
category: applications
stack: apps-editors
tags: [vscode, configuración, editor, terminal, personal]
command: /myjson
whenToUse: Ejecuta /myjson en la terminal interna para abrir esta configuración privada.
warnings:
  - "Esta entrada queda fuera del sidebar, los listados, las etiquetas y el índice de búsqueda."
  - "La configuración utiliza extensiones de VS Code como Prettier, ESLint, One Dark Pro y Flow Deep."
private: true
updatedAt: 2026-08-25
---

## Uso

Ejecuta `/myjson` en la terminal interna de `angel.library`. El comando abre esta
entrada directamente en `/commands/myjson`, usando el mismo layout que cualquier
otra documentación del sitio. También puedes copiar el bloque completo y pegarlo
en **Preferences: Open User Settings (JSON)** o en `.vscode/settings.json` si solo
quieres aplicarlo a un proyecto.

El bloque no contiene comentarios para que puedas copiarlo directamente. VS Code
acepta este contenido como JSON válido.

```json title="settings.json"
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
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.env.osx": {},
  "terminal.integrated.env.windows": {},
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "tsconfig.json": "tsconfig.*.json",
    "package.json": "package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb, tsconfig.json, postcss.config.js, postcss.config.mjs, tailwind.config.js, tailwind.config.mjs, tailwind.config.cjs, tailwind.config.ts, .gitignore, .gitattributes, .eslintrc.json, .eslintrc.cjs, eslint.config.mjs, eslint.config.js, .eslintignore, .prettierrc, .prettierignore, next.config.js, next.config.ts, next.config.mjs, nuxt.config.ts, next-env.d.ts, astro.config.mjs, astro.config.ts, vite.config.ts, vite.config.js, README.md, CHANGELOG.md, AGENTS.md, CLAUDE.md, INSTALL.md, LICENSE, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, FUNDING.yml, SUPPORT.md, .editorconfig, .env, .env.local, .env.example, .env.template, jest.config.js, nextauth.d.ts, components.json, bun.lock, pnpm-workspace.yaml, vite-env.d.ts, app.json, skills-lock.json, expo-env.d.ts, babel.config.js, metro.config.js, nativewind-env.d.ts, prisma.config.ts, .dockerignore, docker-compose.yml, Dockerfile, .nvmrc, .node-version, tsconfig.tsbuildinfo, vercel.json"
  },
  "workbench.editor.customLabels.patterns": {
    "**/app/**/layout.tsx": "${filename}.${extname} - Layout",
    "**/app/**/page.tsx": "${filename}.${extname} - Pages",
    "**/app/**/ui/**": "${filename}.${extname} - PageUI",
    "**/app/**": "${filename}.${extname} - Others",
    "**/app/**/loading.tsx": "${filename}.${extname} - Loader",
    "**/app/**/not-found.tsx": "${filename}.${extname} - 404",
    "**/pages/**": "${filename}.${extname} - Pages",
    "**/prisma/**": "${filename}.${extname} - Prisma",
    "**/types/**": "${filename}.${extname} - T",
    "**/actions/**": "${filename}.${extname} - Act",
    "**/components/**": "${filename}.${extname} - Comp",
    "**/config/**": "${filename}.${extname} - Config",
    "**/consts/**": "${filename}.${extname} - Consts",
    "**/data/**": "${filename}.${extname} - Datas",
    "**/lib/**": "${filename}.${extname} - Lib",
    "**/provider/**": "${filename}.${extname} - Prov",
    "**/schema/**": "${filename}.${extname} - Schemas",
    "**/store/**": "${filename}.${extname} - Stores",
    "**/styles/**": "${filename}.${extname} - Styles",
    "**/utils/**": "${filename}.${extname} - Utils"
  },
  "editor.fontSize": 15,
  "editor.fontFamily": "JetBrains Mono, Cascadia Code, Consolas",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.fontFamily": "JetBrains Mono",
  "workbench.colorTheme": "One Dark Pro",
  "oneDarkPro.editorTheme": "Just Black",
  "workbench.preferredDarkColorTheme": "Ocean High Contrast",
  "oneDarkPro.bold": true,
  "oneDarkPro.italic": false,
  "oneDarkPro.vivid": true,
  "workbench.iconTheme": "flow-deep",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
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
  "eslint.codeActionsOnSave.rules": null,
  "eslint.format.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true,
    "scminput": false
  },
  "github.copilot.nextEditSuggestions.enabled": true,
  "claudeCode.preferredLocation": "panel",
  "security.promptForLocalFileProtocolHandling": false
}
```

## Editor y escritura

`editor.cursorBlinking` usa la animación `expand` para que el cursor se expanda
al parpadear. `editor.cursorSmoothCaretAnimation` suaviza sus desplazamientos.
Las ligaduras de fuente permiten que combinaciones como `=>` se representen de
forma visualmente unificada, y `editor.inlineSuggest.enabled` activa sugerencias
insertadas directamente en la línea actual.

`editor.linkedEditing` mantiene sincronizadas etiquetas relacionadas. El minimapa
se oculta hasta pasar el ratón por su zona. Dos espacios definen cada tabulación,
el texto se ajusta al ancho disponible y el sticky scroll no fija encabezados
mientras recorres un archivo.

## Interfaz y explorador

Se eliminan controles secundarios de la interfaz: el control de layout, la ayuda
del editor vacío, el command center y las breadcrumbs. La activity bar baja y la
sidebar se desplaza a la derecha. El explorador deja de pedir confirmación al
borrar o mover archivos.

El ajuste de línea del editor de diferencias permite comparar líneas largas sin
desplazamiento horizontal. `update.mode: manual` deja las actualizaciones bajo
control manual.

El anidamiento del explorador agrupa archivos relacionados bajo `package.json` y
las variantes bajo `tsconfig.json`. Incluye locks de npm, yarn, pnpm y Bun,
configuraciones de Astro, Vite, Next.js, Nuxt, Tailwind, ESLint, Prettier,
Docker, Prisma y archivos de documentación o entorno.

Las etiquetas personalizadas del editor solo cambian la forma en que se muestran
las pestañas. Identifican layouts, páginas, UI, loaders, 404, Prisma, tipos,
acciones, componentes, configuración, datos, librerías, providers, schemas,
stores, estilos y utilidades sin renombrar ningún archivo real.

## Terminal, fuentes y tema

PowerShell es el perfil predeterminado de la terminal en Windows. Los objetos de
entorno vacíos dejan explícito que esta configuración no inyecta variables
adicionales en Windows ni macOS.

El editor usa tamaño 15, JetBrains Mono como primera opción y Cascadia Code o
Consolas como alternativas. La terminal usa tamaño 14 y JetBrains Mono. One Dark
Pro es el tema principal, Just Black su variante de editor y Ocean High Contrast
el tema oscuro preferido. Las opciones de One Dark Pro activan negritas, quitan
cursivas y habilitan vivid. Flow Deep define los iconos del explorador.

## Formato y calidad

Prettier formatea al guardar y es el formateador global. Astro usa su extensión
oficial; HTML, JavaScript, TypeScript y las variantes React usan Prettier.

La configuración de Prettier conserva dos espacios, ancho de línea 80, comillas
dobles, sin punto y coma, sin comas finales y atributos individuales en líneas
separadas. Conserva las comillas de propiedades, los saltos de texto y el formato
automático de lenguajes incrustados. No exige un archivo de configuración y no
emite logs de depuración.

ESLint mantiene activo el formateo y valida JavaScript, JavaScript React,
TypeScript y TypeScript React. Al guardar, sus correcciones se ejecutan de forma
explícita mediante `source.fixAll.eslint`.

## Git, asistentes y seguridad

Git hace fetch automáticamente, no solicita confirmación al sincronizar y permite
smart commit. GitHub Copilot queda activo en general y en Markdown, pero no en
texto plano ni en entradas de control de código fuente. Sus sugerencias de
siguiente edición están activadas y Claude Code se abre preferentemente en el
panel.

La opción de protocolo local evita el aviso de VS Code al manejar enlaces
`file://`. Es una preferencia personal: comprueba siempre el destino antes de
abrir enlaces locales.

## Privacidad de la entrada

El campo `private: true` mantiene esta entrada fuera de `getAllEntries()` público.
Por eso no aparece en sidebar, páginas de categoría, listados de tipo, tags ni
`search-index.json`. La ruta se genera únicamente para el detalle dinámico y se
abre por el comando secreto.

Para añadir futuras configuraciones personales, crea otra entrada Markdown en
`src/content/commands/`, conserva `private: true` y registra su nombre en
`SECRET_COMMANDS` junto con su caso de navegación en
`src/components/search/SearchResults.tsx`.
