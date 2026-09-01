---
title: Prettier
description: Formateador de código con opinión — instalación, plugins para ordenar imports y clases de Tailwind, qué hace cada campo, .prettierignore y las configuraciones listas para Astro y Next.js.
type: guides
order: 1
tags: [prettier, formato, configuracion, imports, tailwind, eslint]
scope: configuración de Prettier
related:
  - general/typescript/typescript-path-aliases
  - general/config/site-config-global
updatedAt: 2026-08-26
---

Prettier es un **formateador con opinión**: recibe el código, descarta el formato original y lo reimprime siguiendo sus propias reglas. No analiza lógica, no detecta errores y no cambia el comportamiento del programa — solo decide dónde van los saltos de línea, las comillas y la indentación.

Esa distinción importa porque define el reparto de responsabilidades con ESLint: **Prettier decide cómo se ve el código, ESLint decide si el código tiene problemas**. Cuando ambos intentan controlar la misma regla de estilo aparecen conflictos y reformateos en bucle al guardar.

## Instalación

La base mínima es el propio Prettier:

```bash
pnpm add -D prettier
```

Con los tres plugins que se documentan más abajo:

```bash
pnpm add -D prettier @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss prettier-plugin-astro
```

Prettier se instala **siempre como dependencia de desarrollo**: es una herramienta del entorno de trabajo, no forma parte de lo que se ejecuta en producción.

Añade los scripts al `package.json`:

```json title="package.json"
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

`--write` reescribe los archivos; `--check` solo informa cuáles no cumplen el formato y termina con código de salida distinto de cero. Usa `--check` en integración continua: falla el pipeline sin modificar el repositorio.

## Los plugins

Prettier por sí solo no ordena imports ni entiende `.astro`. Cada capacidad extra llega como plugin declarado en el campo `plugins`.

| Plugin                                  | Qué aporta                                                       | Obligatorio para               |
| --------------------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| `@trivago/prettier-plugin-sort-imports` | Ordena y agrupa los `import` según patrones que tú defines       | Que `importOrder` tenga efecto |
| `prettier-plugin-tailwindcss`           | Ordena las clases de Tailwind en el orden canónico del framework | Diffs estables en componentes  |
| `prettier-plugin-astro`                 | Enseña a Prettier a leer y formatear archivos `.astro`           | Proyectos Astro                |

### Ordenar los imports

Este es el plugin que resuelve el desorden real de un proyecto: sin él, cada archivo termina con los `import` en el orden accidental en que se fueron agregando.

**El punto crítico:** los campos `importOrder`, `importOrderSeparation` e `importOrderSortSpecifiers` **no son opciones nativas de Prettier**. Si declaras esos campos sin instalar y registrar el plugin, Prettier los ignora en silencio — el archivo se ve configurado y no ordena nada.

`importOrder` recibe un arreglo de **expresiones regulares** que se evalúan en orden contra la ruta de cada import. El primer patrón que coincide determina el grupo, y los grupos se imprimen en el orden del arreglo:

```json title=".prettierrc"
{
  "importOrder": [
    "^react$",
    "^react/(.*)$",
    "^next$",
    "^next/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^(?!.*\\.css$)[./]",
    "^.+\\.css$"
  ]
}
```

| Patrón                  | Qué captura                                                          | Ejemplo                                         |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| `^react$`               | El paquete exacto, sin subrutas                                      | `import React from "react"`                     |
| `^react/(.*)$`          | Solo las subrutas del paquete                                        | `import { createRoot } from "react-dom/client"` |
| `<THIRD_PARTY_MODULES>` | Comodín del plugin: todo lo de `node_modules` que no coincidió antes | `import clsx from "clsx"`                       |
| `^@/(.*)$`              | El alias interno del proyecto                                        | `import { SITE } from "@/config/site"`          |
| `^(?!.*\\.css$)[./]`    | Rutas relativas que **no** terminan en `.css`                        | `import { Card } from "./Card"`                 |
| `^.+\\.css$`            | Cualquier import de hoja de estilos                                  | `import "./globals.css"`                        |

El resultado es un orden que va **de lo más externo a lo más local**: framework, paquetes de terceros, código propio por alias, código propio relativo y estilos al final.

Dos detalles que se pasan por alto:

- **Los estilos van últimos a propósito.** En CSS el orden de importación afecta la cascada, así que mover un `import "./globals.css"` puede cambiar qué regla gana. El patrón con `negative lookahead` (`(?!.*\.css$)`) existe justamente para que las hojas de estilo queden fuera del grupo de rutas relativas y no se mezclen.
- **El orden del arreglo importa más que el contenido.** `^react$` debe ir antes que `<THIRD_PARTY_MODULES>`; si estuviera después, React caería en el comodín y nunca llegaría a su propio grupo.

Los otros dos campos del plugin:

| Campo                       | Valor usado | Qué hace                                                                                           |
| --------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `importOrderSeparation`     | `false`     | No inserta una línea en blanco entre cada grupo. Con `true`, cada grupo queda separado visualmente |
| `importOrderSortSpecifiers` | `true`      | Ordena alfabéticamente lo que va **dentro** de las llaves: `import { a, b, c }`                    |

### Ordenar las clases de Tailwind

`prettier-plugin-tailwindcss` reordena las clases al orden oficial del framework, lo que hace que dos personas que escriben las mismas clases en distinto orden produzcan exactamente el mismo diff.

**Debe ser siempre el último elemento del arreglo `plugins`.** El plugin está diseñado para envolver a los demás; si otro plugin se declara después, el orden de clases deja de aplicarse.

En Tailwind CSS 4 la configuración vive en el propio CSS, así que el plugin necesita saber cuál es la hoja de entrada:

```json title=".prettierrc"
{
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "tailwindStylesheet": "./src/styles/global.css"
}
```

`tailwindStylesheet` es el reemplazo de `tailwindConfig`, que apuntaba al `tailwind.config.js` de Tailwind 3.

## Qué hace cada campo

Estos son los campos nativos de Prettier. La columna **Por defecto** indica el valor que Prettier usa cuando no declaras nada, para que puedas distinguir qué estás cambiando de verdad.

### Puntuación y comillas

| Campo            | Por defecto   | Qué hace                                                                                                                                |
| ---------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `semi`           | `true`        | Termina cada sentencia con punto y coma. Con `false`, Prettier los omite y añade un `;` inicial solo en las líneas que serían ambiguas  |
| `singleQuote`    | `false`       | Comillas simples en JavaScript y TypeScript. `false` mantiene dobles                                                                    |
| `jsxSingleQuote` | `false`       | Lo mismo para los atributos JSX, que se configura por separado                                                                          |
| `quoteProps`     | `"as-needed"` | Cuándo poner comillas en las claves de objeto. `"preserve"` respeta lo que ya escribiste; `"as-needed"` las quita cuando no hacen falta |
| `trailingComma`  | `"all"`       | Coma final en listas multilínea. `"none"` no la pone; `"all"` la incluye incluso en parámetros de función                               |

`trailingComma: "all"` produce diffs más limpios (agregar un elemento toca una sola línea), pero `"none"` genera archivos visualmente más sobrios. Es una elección de equipo, no técnica.

### Espaciado y ancho

| Campo            | Por defecto | Qué hace                                                                                                   |
| ---------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `printWidth`     | `80`        | Ancho objetivo de línea. **Es una guía, no un límite**: una cadena larga o una URL lo superan sin romperse |
| `tabWidth`       | `2`         | Espacios por nivel de indentación. Debe coincidir con `editor.tabSize` y con `.editorconfig`               |
| `useTabs`        | `false`     | Indenta con espacios. Con `true` usa tabulaciones reales                                                   |
| `bracketSpacing` | `true`      | Espacios dentro de las llaves de objeto: `{ name }` frente a `{name}`                                      |
| `arrowParens`    | `"always"`  | Paréntesis en el parámetro único de una función flecha: `(x) => x` frente a `x => x`                       |

### JSX, HTML y marcado

| Campo                        | Por defecto | Qué hace                                                                                                                                                            |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bracketSameLine`            | `false`     | Coloca el `>` de una etiqueta multilínea en su propia línea                                                                                                         |
| `singleAttributePerLine`     | `false`     | Un atributo por línea cuando el elemento se parte. Con `true`, los componentes con muchas props quedan en columna y los diffs señalan el atributo exacto que cambió |
| `htmlWhitespaceSensitivity`  | `"css"`     | Respeta el `display` que CSS aplicaría al decidir dónde puede insertar saltos. Evita cambiar el renderizado de texto en línea                                       |
| `vueIndentScriptAndStyle`    | `false`     | Indenta el contenido de `<script>` y `<style>` en archivos Vue                                                                                                      |
| `embeddedLanguageFormatting` | `"auto"`    | Formatea el código incrustado en otro lenguaje (CSS dentro de HTML, SQL en template literals) cuando lo reconoce                                                    |

### Texto y pragmas

| Campo                   | Por defecto  | Qué hace                                                                                                                           |
| ----------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `proseWrap`             | `"preserve"` | Conserva los saltos de línea que escribiste en Markdown. `"always"` los reajusta a `printWidth`                                    |
| `insertPragma`          | `false`      | Añade un comentario `@format` en los archivos que formatea                                                                         |
| `requirePragma`         | `false`      | Formatea únicamente archivos que ya tengan el comentario `@format`. Sirve para adoptar Prettier gradualmente en un proyecto grande |
| `experimentalTernaries` | `false`      | Formato experimental para ternarios anidados                                                                                       |

En Markdown, `proseWrap: "preserve"` es casi siempre la opción correcta: los saltos de línea de un texto suelen ser una decisión editorial, y `"always"` los reescribiría.

## Formato por lenguaje

El campo `overrides` permite aplicar reglas distintas a un conjunto de archivos sin partir la configuración en varios archivos:

```json title=".prettierrc"
{
  "overrides": [
    {
      "files": "*.md",
      "options": { "printWidth": 100 }
    }
  ]
}
```

En VS Code, la elección del formateador por lenguaje se hace del lado del editor, no de Prettier:

```json title="settings.json"
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  }
}
```

## .prettierignore

`.prettierignore` usa la misma sintaxis que `.gitignore` y excluye rutas del formateo. Es tan importante como el `.prettierrc`: sin él, `prettier --write .` recorre carpetas generadas y puede tardar minutos o modificar archivos que no deberían tocarse.

```text title=".prettierignore"
.next
.astro
.vercel
build
coverage
dist
node_modules
bun.lock
bun.lockb
package-lock.json
pnpm-lock.yaml
```

Qué se excluye y por qué:

| Entrada                                              | Motivo                                                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `node_modules`                                       | Código de terceros. Formatearlo no aporta nada y se pierde en la siguiente instalación                                          |
| `.next`, `.astro`, `.vercel`, `dist`, `build`, `out` | Artefactos de compilación. Se regeneran en cada build                                                                           |
| `coverage`                                           | Reportes generados por el runner de tests                                                                                       |
| Lockfiles                                            | Los genera el gestor de paquetes con su propio formato. Reformatearlos produce diffs enormes y puede confundir a la herramienta |

Del bloque de lockfiles, **solo debería existir en el repositorio el del gestor que realmente usas**. Listarlos todos en `.prettierignore` es una precaución barata; tener los tres archivos versionados sí es un problema.

## Prettier y ESLint juntos

Ambos pueden opinar sobre el mismo código, y ahí está el conflicto habitual: el archivo se reformatea al guardar y ESLint lo marca como error, o al revés.

La regla práctica: **un solo responsable del formato**. Prettier se encarga del estilo; ESLint queda para reglas que analizan el código (variables sin usar, hooks mal llamados, imports inexistentes).

En VS Code eso se traduce en que Prettier formatea y ESLint corrige aparte:

```json title="settings.json"
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Formatear al guardar es una comodidad local, **no una comprobación**. Quien decide si el repositorio cumple el formato es `format:check` en CI: la máquina de un colaborador puede no tener la extensión instalada.

## Precedencia de la configuración

Prettier busca su configuración subiendo desde el archivo que va a formatear hasta la raíz del proyecto, y se detiene en la primera que encuentra. Si algo no aplica como esperas, revisa en este orden:

1. Que exista un `.prettierrc` (o `prettier.config.js`, o la clave `prettier` en `package.json`) y que sea JSON válido.
2. Que el plugin que aporta el campo esté instalado **y declarado** en `plugins`.
3. Que la ruta no esté cubierta por `.prettierignore`.
4. Que el editor esté usando Prettier y no otro formateador para ese lenguaje.

Un `.prettierrc` con un error de sintaxis hace que Prettier falle o caiga a los valores por defecto, según el contexto. Si el formato cambió de golpe en todo el proyecto, ese archivo es el primer sospechoso.

## Configuración para Astro

```bash
pnpm add -D prettier prettier-plugin-astro @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss @astrojs/check typescript
```

```json title=".prettierrc"
{
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "semi": false,
  "experimentalTernaries": false,
  "singleQuote": false,
  "jsxSingleQuote": false,
  "quoteProps": "preserve",
  "trailingComma": "none",
  "singleAttributePerLine": true,
  "htmlWhitespaceSensitivity": "css",
  "vueIndentScriptAndStyle": false,
  "proseWrap": "preserve",
  "insertPragma": false,
  "printWidth": 80,
  "requirePragma": false,
  "tabWidth": 2,
  "useTabs": false,
  "embeddedLanguageFormatting": "auto",
  "plugins": [
    "prettier-plugin-astro",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "importOrder": [
    "^astro$",
    "^astro/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)/types$",
    "^@/(.*)$",
    "^(?!.*\\.css$)[./]",
    "^.+\\.css$"
  ],
  "importOrderSeparation": false,
  "importOrderSortSpecifiers": true,
  "tailwindStylesheet": "./src/styles/global.css"
}
```

```text title=".prettierignore"
.next
.astro
.vercel
build
coverage
dist
node_modules
bun.lock
bun.lockb
package-lock.json
pnpm-lock.yaml
```

## Configuración para Next.js

```bash
pnpm add -D prettier @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss
```

```json title=".prettierrc"
{
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "semi": false,
  "experimentalTernaries": false,
  "singleQuote": false,
  "jsxSingleQuote": false,
  "quoteProps": "preserve",
  "trailingComma": "none",
  "singleAttributePerLine": true,
  "proseWrap": "preserve",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "embeddedLanguageFormatting": "auto",
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "importOrder": [
    "^react$",
    "^react/(.*)$",
    "^next$",
    "^next/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^(?!.*\\.css$)[./]",
    "^.+\\.css$"
  ],
  "importOrderSeparation": false,
  "importOrderSortSpecifiers": true,
  "tailwindStylesheet": "./src/app/globals.css"
}
```

```text title=".prettierignore"
.next
build
coverage
dist
node_modules
out
bun.lock
bun.lockb
package-lock.json
pnpm-lock.yaml
```
