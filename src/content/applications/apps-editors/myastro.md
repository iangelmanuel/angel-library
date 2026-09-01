---
title: Configuración inicial de Astro
description: Paso a paso privado para iniciar un proyecto Astro con metadatos, configuración base, GitHub Actions, aliases, Tailwind, Prettier, ESLint, SITE, SEO y archivos de repositorio.
type: commands
tags:
  [
    astro,
    configuración,
    setup,
    tailwind,
    typescript,
    prettier,
    eslint,
    github-actions,
    seo,
    privado
  ]
command: /myastro
whenToUse: Ejecuta /myastro en la terminal interna cuando quieras iniciar un proyecto Astro con esta configuración.
warnings:
  - "Esta entrada es privada y solo se abre mediante el comando /myastro en la terminal de búsqueda."
  - "Completa únicamente los datos reales del proyecto y conserva en null los campos que no apliquen."
private: true
related:
  - frontend/astro/astro-getting-started
  - frontend/astro/astro-project-configuration
  - general/typescript/typescript-path-aliases
  - general/config/site-config-global
  - seo/astro/astro-seo-completo
updatedAt: 2026-08-27
---

## Antes de comenzar

Esta receta está ordenada para ejecutarse de arriba hacia abajo. Cada paso deja
preparado lo que necesita el siguiente: el alias se configura antes de usar
imports con @/, Tailwind se instala antes de registrarlo en Astro y SITE existe
antes de construir los componentes de SEO.

Los comandos de instalación aparecen en un único bloque con pestañas para pnpm,
Bun y npm. Elige un gestor al comenzar y conserva su lockfile durante todo el
proyecto.

## 1. Crear el proyecto Astro

### Objetivo

Crear una base con la plantilla oficial `basics`, que ya incluye una página, un
layout, componentes, assets y la organización inicial de Astro. Es la base
adecuada para este flujo; `minimal` es una plantilla vacía pensada para empezar
prácticamente desde cero.

```bash
pnpm create astro@latest mi-proyecto --template basics
```

En el asistente selecciona:

| Pregunta                    | Selección                              |
| --------------------------- | -------------------------------------- |
| Instalar dependencias       | Sí                                     |
| Inicializar repositorio Git | Sí                                     |
| TypeScript                  | Strict                                 |
| Plantilla                   | Basics: estructura inicial recomendada |

Entra al directorio creado:

```bash
cd mi-proyecto
```

A partir de este punto todos los archivos de la receta se crean dentro de esa
carpeta. No vuelvas a ejecutar la instalación inicial ni mezcles pnpm-lock.yaml,
package-lock.json y bun.lock.

## 2. Completar los datos del proyecto

### Objetivo

Dejar package.json como la ficha técnica del repositorio. El instalador de Astro
ya añadió las dependencias; aquí se completan identidad, enlaces, compatibilidad
y scripts.

```json title="package.json"
{
  "name": "mi-proyecto-astro",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "description": "Descripción breve y concreta del proyecto",
  "license": "...",
  "packageManager": "pnpm@...",
  "homepage": "https://github.com/usuario/mi-proyecto-astro",
  "keywords": ["astro", "typescript", "tailwindcss", "web-development"],
  "author": {
    "name": "Tu nombre",
    "email": "tu@correo.com",
    "url": "https://github.com/usuario"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/usuario/mi-proyecto-astro.git"
  },
  "bugs": {
    "url": "https://github.com/usuario/mi-proyecto-astro/issues"
  },
  "engines": {
    "node": ">=...",
    "pnpm": ">=..."
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "start": "astro dev",
    "astro": "astro",
    "check": "astro check",
    "sync": "astro sync",
    "eslint": "eslint .",
    "prettier": "prettier --write .",
    "prettier:check": "prettier . --check"
  }
}
```

Los `"..."` (`license`, `packageManager`, `engines`) dependen del proyecto y del
gestor elegido — reemplázalos antes de continuar, no dejes el literal `"..."`
en el archivo real. Mantén las dependencias que creó Astro debajo de estos
campos. private: true evita publicar accidentalmente el proyecto como paquete
de npm, pero no impide subirlo a GitHub.

## 3. Configurar GitHub Actions

### Objetivo

Dejar la verificación automática lista antes de escribir código: cada push y
cada pull request corren los mismos comandos que se ejecutan en local. El
workflow solo llama a los scripts declarados en el paso 2, así que el archivo
no cambia aunque después se agreguen ESLint, Prettier o el SEO.

Dos jobs, no uno: `quality` corre `check`, `eslint` y `prettier:check` en
paralelo —son independientes entre sí, así que no hay razón para serializarlos—
y `build` espera a que los tres pasen. Es el paso más lento; no vale la pena
pagarlo sobre código que ya se sabe roto por tipos o lint.

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        task: [check, eslint, "prettier:check"]

    steps:
      - uses: actions/checkout@v5

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm sync

      - run: pnpm ${{ matrix.task }}

  build:
    needs: quality
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build
```

| Clave                     | Qué hace                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `strategy.matrix.task`    | Crea un job por verificación; los tres arrancan a la vez                                                                                |
| `fail-fast: false`        | Sin esto, el primer job que falla cancela a los otros dos — perderías la visibilidad de si además tenías errores de ESLint o de formato |
| `pnpm sync`               | Genera los tipos de Astro en `.astro/` antes de `check`, que los necesita                                                               |
| `needs: quality`          | `build` espera a que los tres terminen en verde; si uno falla, se salta                                                                 |
| `pnpm ${{ matrix.task }}` | El nombre del script sale de la matriz — agregar una verificación es agregar un elemento a la lista                                     |

`--frozen-lockfile` hace fallar el job si el lockfile no coincide con
`package.json`, en vez de resolver versiones nuevas silenciosamente en CI —
por eso cualquier cambio de versión en `package.json` necesita un `pnpm
install` local antes de commitear, para que `pnpm-lock.yaml` quede
sincronizado.

`pnpm/action-setup@v4` no lleva `with: version` — sin ese input, la action lee
la versión directamente de `packageManager` en `package.json` (paso 2). Fijarla
en los dos lugares a la vez es la causa típica de `ERR_PNPM_BAD_PM_VERSION`
en cuanto se desincronizan.

`"prettier:check"` va entre comillas porque los dos puntos sin comillas son
sintaxis de mapa en YAML.

Cada job es una máquina distinta, así que cada uno reinstala dependencias: son
cuatro instalaciones en vez de una. La caché de `setup-node` con `cache: pnpm`
lo abarata bastante y, a cambio, el PR muestra los cuatro resultados por
separado en vez de uno solo que se corta en el primer error.

Los pasos `eslint` y `prettier:check` fallarán hasta completar los pasos 8 y
9, que crean sus configuraciones. Es esperado: el workflow se agrega al
principio para que ningún commit posterior quede sin verificar.

## 4. Configurar la base de Astro

### Objetivo

Definir primero las decisiones propias del framework: dominio canónico, modo de
salida, barras finales y compresión. Tailwind todavía no aparece porque se instala
en un paso posterior.

```js title="astro.config.mjs"
import { defineConfig } from "astro/config"

export default defineConfig({
  site: "https://example.com",
  output: "static",
  trailingSlash: "never",
  compressHTML: true
})
```

| Opción        | Qué controla                                                  |
| ------------- | ------------------------------------------------------------- |
| site          | Origen absoluto usado para canonical, sitemap y URLs sociales |
| output        | static genera HTML durante el build                           |
| trailingSlash | Evita publicar dos formas de una misma URL                    |
| compressHTML  | Reduce el HTML generado                                       |

Reemplaza example.com por el dominio definitivo. Si todavía no existe, usa el
dominio previsto y corrígelo antes de desplegar. base solo se agrega cuando el
sitio se publica dentro de una subruta, por ejemplo /docs.

## 5. (Opcional) Preparar Vercel para renderizado bajo demanda

### Cuándo usar este paso

Astro genera un sitio estático por defecto y no necesita un adaptador para ese
caso. Añade el adaptador de Vercel solo si necesitas páginas renderizadas en cada
solicitud, sesiones, acciones o lógica que deba ejecutarse en el servidor. El
renderizado bajo demanda también se conoce como SSR (Server-Side Rendering).

Usa el comando de integraciones de Astro. Este instala el adaptador y registra
su importación en la configuración:

```bash
pnpm astro add vercel
```

Después revisa la configuración resultante y conserva las decisiones de la base:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"

export default defineConfig({
  site: "https://example.com",
  output: "static",
  adapter: vercel(),
  trailingSlash: "never",
  compressHTML: true
})
```

Mantén `output: "static"` como valor inicial. Cuando necesites que las rutas se
rendericen bajo demanda por defecto, cambia ese valor a `"server"`; el comentario
junto a la propiedad sirve como recordatorio dentro de la configuración.

Si solamente una ruta necesita servidor, conserva `output: "static"` y opta esa
ruta al renderizado bajo demanda:

```astro title="src/pages/cuenta.astro"
---
export const prerender = false

const session = Astro.cookies.get("session")
---

<h1>Cuenta privada</h1>
```

El adaptador aporta el runtime de servidor. `prerender = false` afecta solo esa
ruta; `output: "server"` cambia el valor predeterminado de todo el proyecto. No
uses cookies como única prueba de autenticación: valida la sesión y los permisos
en el servidor.

## 6. Configurar el alias de TypeScript

### Objetivo

Hacer que @/ apunte a src/ antes de utilizar ese alias en layouts, estilos o
componentes SEO.

```json title="tsconfig.json"
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "baseUrl": ".", // deprecado en TypeScript 7.0
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Comprueba el alias con un import pequeño:

```ts
import { SITE } from "@/config/site"
```

No añadas jsxImportSource ni configuración de React mientras el proyecto no use
React. Si más adelante agregas un framework de interfaz, su integración puede
actualizar tsconfig automáticamente.

## 7. Instalar Tailwind CSS

### Objetivo

Instalar Tailwind CSS 4 con el comando oficial de integraciones, conectarlo con
Vite y crear el stylesheet global. Ahora sí puede usarse @/ porque el alias ya
existe.

```bash
pnpm astro add tailwind
```

El comando instala `tailwindcss` y `@tailwindcss/vite` y modifica
`astro.config.mjs`. Revisa el resultado conservando la configuración base del
paso 4:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  site: "https://example.com",
  output: "static",
  trailingSlash: "never",
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()]
  }
})
```

Crea el archivo global:

```css title="src/styles/global.css"
@import "tailwindcss";
```

Impórtalo una sola vez en el layout raíz:

```astro title="src/layouts/Layout.astro"
---
import "@/styles/global.css"
---

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

No necesitas tailwind.config.js para esta configuración de Tailwind 4. Añádelo
solo si una capacidad concreta del proyecto lo exige.

## 8. Instalar y configurar Prettier

### Objetivo

Instalar el formateador, el soporte de Astro, el orden real de imports, el orden
de clases de Tailwind y las herramientas necesarias para ejecutar `astro check`.

```bash
pnpm add -D prettier prettier-plugin-astro @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss @astrojs/check typescript
```

Crea .prettierrc en la raíz con la configuración definida para este proyecto:

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
  "tailwindStylesheet": "..."
}
```

El orden resultante es Astro, paquetes externos, tipos internos, alias, imports
relativos y estilos. `@trivago/prettier-plugin-sort-imports` hace efectivas las
propiedades `importOrder`; sin ese plugin Prettier las ignoraría.

`prettier-plugin-tailwindcss` debe permanecer al final del arreglo de plugins.
Reemplaza `tailwindStylesheet: "..."` por la ruta real del CSS creado en el
paso 7 (`./src/styles/global.css`).

Crea también el archivo de exclusiones:

```text title=".prettierignore"
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

`.astro`, `.vercel`, `dist` y `node_modules` contienen archivos generados. Los
lockfiles no deben reformatearse y solo debe existir el correspondiente al
gestor elegido.

Confirma que `package.json` ya tiene los scripts para ejecutar Prettier (paso 2):

```json title="package.json (scripts)"
{
  "scripts": {
    "prettier": "prettier --write .",
    "prettier:check": "prettier . --check"
  }
}
```

`prettier` reescribe los archivos; `prettier:check` solo falla si algo no está
formateado, útil para CI.

## 9. Instalar y configurar ESLint

### Objetivo

Detectar errores reales de Astro y TypeScript que el formateador no ve.
Prettier decide cómo se ve el código; ESLint decide qué código es correcto.

### Antes de instalar: fija TypeScript por debajo de 7.0

Al momento de escribir esto, `typescript-eslint` todavía no soporta
TypeScript 7 — instalarlo tal cual (`pnpm add -D typescript`, sin versión)
puede traer un TypeScript 7.x y romper `astro check`/`eslint` con errores que
no tienen que ver con tu código. Revisa `typescript` en `package.json` (paso 8) y, si hace falta, fíjalo explícitamente:

```bash
pnpm add -D typescript@^6
```

Antes de escribir un `tsconfig.json` nuevo o actualizar `typescript-eslint`,
confirma en la documentación oficial de `typescript-eslint` si ya soporta
TypeScript 7 — este freno es temporal, no una regla permanente del proyecto.

El orden importa, y saltárselo es la causa más común de que esta sección
falle a medias: TypeScript en `< 7` primero → instalar `typescript-eslint` →
escribir `eslint.config.mjs` → `pnpm install` para sincronizar
`pnpm-lock.yaml` con la versión fijada → recién ahí `pnpm sync` y
`check`/`eslint`/`prettier:check`. Cambiar una versión en `package.json` sin
correr `pnpm install` después dejará el lockfile desincronizado, y
`pnpm install --frozen-lockfile` (paso 3) fallará en CI aunque en local todo
funcione.

```bash
pnpm add -D eslint @eslint/js eslint-plugin-astro typescript-eslint
```

Crea la configuración plana en la raíz:

```js title="eslint.config.mjs"
import jseslint from "@eslint/js"
import astro from "eslint-plugin-astro"
import tseslint from "typescript-eslint"

export default [
  { ignores: ["dist/**", ".astro/**", ".vercel/**", "node_modules/**"] },
  jseslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  }
]
```

| Paquete               | Para qué                                                     |
| --------------------- | ------------------------------------------------------------ |
| `eslint`              | El motor de reglas                                           |
| `@eslint/js`          | Reglas base de JavaScript (`jseslint.configs.recommended`)   |
| `typescript-eslint`   | Parser y reglas para TypeScript                              |
| `eslint-plugin-astro` | Entiende la sintaxis de un `.astro` (frontmatter + template) |

`eslint-plugin-astro` es ESM, por eso la configuración se llama
`eslint.config.mjs` y no `.js`. El bloque `ignores` debe ir primero y
reemplaza al antiguo `.eslintignore`, que la configuración plana ya no lee.

`jseslint.configs.recommended` va **sin** `...` porque `@eslint/js` exporta
`recommended` como un único objeto de configuración. `tseslint.configs.recommended`
y `astro.configs.recommended` sí llevan `...` porque cada uno exporta un
**arreglo** de configuraciones encadenadas (parser, reglas base, reglas por
tipo de archivo) — sin el spread, `eslint.config.mjs` terminaría con un
arreglo dentro de otro arreglo y ESLint lo rechaza. Cuando agregues un plugin
nuevo, revisa qué exporta su `recommended` antes de copiar el patrón: no todos
son arreglos.

`tseslint.configs.recommended` no requiere información de tipos; si más
adelante quieres reglas que sí la usen, cambia a
`tseslint.configs.recommendedTypeChecked` y agrega `parserOptions.project`.

Las dos reglas del bloque final no son parte de `recommended` en ningún
plugin — se agregan a mano porque son las que de verdad importan en un
proyecto nuevo: `no-explicit-any` obliga a tipar en vez de escapar con `any`,
y `no-unused-vars` con `argsIgnorePattern`/`varsIgnorePattern` permite
prefijar con `_` un parámetro o variable que se declara a propósito sin usar
(por ejemplo, en la firma de un callback).

Si algún archivo `.mjs` del proyecto (scripts de build, por ejemplo) usa
globals de Node como `console` o `process`, decláralos explícitamente en vez
de que ESLint los marque como no definidos:

```js title="eslint.config.mjs (fragmento, si aplica)"
{
  files: ["**/*.mjs"],
  languageOptions: {
    globals: { console: "readonly", process: "readonly" }
  }
}
```

Comprueba que corre:

```bash
pnpm install
pnpm eslint
```

ESLint y Prettier no compiten en esta configuración: ni `jseslint`, ni
`tseslint` ni `astro` traen reglas de formato en sus sets `recommended`, así
que no hace falta `eslint-config-prettier`. (En Next.js sí se agrega, porque
`eslint-config-next` arrastra `eslint-plugin-react`, que sí las tiene — ver el
paso 7 de `/mynext`.)

## 10. Crear SITE

### Objetivo

Centralizar identidad, contacto, navegación, dominio y valores SEO antes de crear
los componentes que los consumen. Este es el mismo bloque documentado en el
patrón SITE de la biblioteca.

```ts title="src/config/site.ts"
/** Configuración de identidad y SEO global del sitio. */

export interface Service {
  id: string
  eyebrow: string
  h3: string
  body: string
  items: string[]
}

export interface FaqItem {
  q: string
  a: string
}

const SITE_URL = (import.meta.env.SITE ?? "http://localhost:4321").replace(
  /\/$/,
  ""
)

const DESCRIPTION =
  "Biblioteca personal de conocimiento técnico: snippets, recetas, comandos y referencias rápidas para desarrollo web."

/**
 * Fuente única para los datos que describen al sitio, no para su catálogo.
 * Categorías, tipos, subcategorías y orden editorial viven en módulos hermanos.
 * Los campos sin aplicación comercial se mantienen explícitos como null para
 * que la estructura pueda crecer sin inventar información.
 */
export const SITE = {
  name: "angel.library",
  description: DESCRIPTION,
  locale: "es",

  info: {
    name: "angel.library",
    legalName: "angel.library",
    description: DESCRIPTION,
    slogan: "Segundo cerebro técnico para desarrollo web.",
    founded: null as number | null,
    founders: [{ name: "iangelmanuel", role: null as string | null }],
    teams: null as Array<{ name: string; lead: string }> | null,
    author: "iangelmanuel"
  },

  site: {
    url: SITE_URL,
    locale: "es-CO",
    lang: "es",
    timezone: "America/Bogota",
    currency: null as string | null
  },

  location: {
    address: null as string | null,
    city: null as string | null,
    state: null as string | null,
    country: null as string | null,
    countryCode: null as string | null,
    postalCode: null as string | null,
    timezone: "America/Bogota",
    display: null as string | null
  },

  contact: {
    email: null as string | null,
    countryCode: null as string | null,
    phone: null as string | null,
    phoneDisplay: () => null as string | null,
    whatsapp: () => null as string | null,
    landline: null as string | null
  },

  whatsAppMessage: {
    general: null as string | null,
    service: (_service: string) => null as string | null,
    appointment: null as string | null
  },

  social: {
    instagram: null as string | null,
    linkedin: null as string | null,
    x: null as string | null,
    github: "https://github.com/iangelmanuel/angel-library",
    tiktok: null as string | null,
    youtube: null as string | null
  },

  businessHours: null as Array<{
    day: string
    open: string | null
    close: string | null
  }> | null,

  legal: null as Array<{
    slug: string
    title: string
    updatedAt: string
  }> | null,

  navigation: {
    main: null as Array<{ name: string; href: string }> | null,
    cta: null as { label: string; href: string } | null
  },

  stats: null as Array<{
    value: string
    label: string
    sublabel: string
  }> | null,

  seo: {
    title: "angel.library — segundo cerebro técnico para desarrollo web",
    description: DESCRIPTION,
    keywords: [
      "desarrollo web",
      "JavaScript",
      "TypeScript",
      "Astro",
      "React",
      "Next.js",
      "Git",
      "GitHub",
      "frontend",
      "backend",
      "bases de datos",
      "accesibilidad",
      "SEO"
    ],

    author: "iangelmanuel",
    creator: "iangelmanuel",
    publisher: "angel.library",

    url: SITE_URL,
    locale: "es-CO",
    lang: "es",
    currency: null as string | null,
    contactRegion: null as string | null,
    languages: ["Spanish"],
    locales: [{ hreflang: "es-CO", default: true }] as const,
    geo: {
      region: null as string | null,
      latitude: null as number | null,
      longitude: null as number | null
    },

    image: "/opengraph-image.svg",
    imageAlt: "angel.library, segundo cerebro técnico para desarrollo web",
    imageWidth: 1200,
    imageHeight: 630,
    logo: "/icon.svg",

    ogType: "website" as "website" | "article",
    twitterAuthor: null as string | null,
    twitterHandle: null as string | null,
    twitterCard: "summary_large_image" as
      | "summary"
      | "summary_large_image"
      | "app"
      | "player",
    /** El fallback local no debe indexarse; el deploy define SITE explícitamente. */
    noindex: SITE_URL === "http://localhost:4321",

    category: "technology",
    classification: "Education",
    priceRange: null as string | null,

    themeColor: { light: "#000000", dark: "#000000" },
    manifestCategories: ["education", "reference", "developer-tools"],

    areaServed: null as Array<{ type: string; name: string }> | null
  }
} as const

export const SERVICES: Service[] = []

export const FAQ_ITEMS: FaqItem[] = []

export function whatsAppMessage(message: string) {
  const phone = SITE.contact.whatsapp()

  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null
}
```

En este proyecto los datos de identidad ya están adaptados a `angel.library`.
Los campos sin aplicación comercial se dejan explícitamente en `null`: no se
deben inventar teléfonos, direcciones, horarios, datos legales o perfiles
sociales. `import.meta.env.SITE` proviene de la opción `site` de
`astro.config.mjs`, por lo que el dominio se define una sola vez y
`SITE.site.url` y `SITE.seo.url` nunca se desincronizan. El fallback local
permite que el módulo siga siendo válido si `site` todavía no está configurado.

`as const` evita mutaciones accidentales, pero no valida datos externos ni
protege secretos. `SERVICES` y `FAQ_ITEMS` se conservan como listas vacías
porque esta biblioteca no tiene servicios comerciales ni preguntas frecuentes.
Si una futura sección necesita esos datos, completa sus listas; si el catálogo
crece (slug, precio, imágenes o SEO por servicio), sácalo de aquí y llévalo a
su propia colección de contenido.

## 11. Implementar el SEO de Astro

Esta sección sigue la implementación documentada en SEO completo en Astro. El
orden importa: primero se crean los datos estructurados y sus helpers, después el
head y el layout, y al final las rutas técnicas.

### 11.1 Crear JsonLd.astro

El componente serializa cualquier entidad de Schema.org y escapa el carácter <
para que un valor no pueda cerrar la etiqueta script antes de tiempo.

```astro title="src/components/seo/JsonLd.astro"
---
interface Props {
  id: string
  data: object | object[]
}

const { id, data } = Astro.props

const json = JSON.stringify(data).replace(/</g, "\\u003c")
---

<script
  id={id}
  type="application/ld+json"
  is:inline
  set:html={json}
/>
```

is:inline mantiene el JSON-LD dentro del HTML y cada bloque debe tener un id
único, como ld-organization o ld-website.

### 11.2 Crear los helpers de Schema.org

Cada función obtiene los datos desde SITE. SERVICES y FAQ_ITEMS se definieron
como exports hermanos de SITE en el paso 10 — reemplázalos con contenido real
del proyecto antes de publicar.

```ts title="src/libs/seo.ts"
import { FAQ_ITEMS, SERVICES, SITE } from "@/config/site"

const SITE_URL = SITE.seo.url
const LOGO_URL = new URL(SITE.seo.logo, SITE_URL).href
const OG_URL = new URL(SITE.seo.image, SITE_URL).href

const areaServed = () =>
  (SITE.seo.areaServed ?? []).map((a) => ({ "@type": a.type, name: a.name }))

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE.info.name,
    legalName: SITE.info.legalName,
    url: SITE_URL,
    logo: LOGO_URL,
    image: OG_URL,
    description: SITE.seo.description,
    slogan: SITE.info.slogan,
    foundingDate: String(SITE.info.founded),
    founder: SITE.info.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressCountry: SITE.location.countryCode
    },
    areaServed: areaServed(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE.contact.email,
        telephone: SITE.contact.whatsapp(),
        availableLanguage: SITE.seo.languages,
        areaServed: [SITE.location.countryCode, SITE.seo.contactRegion]
      }
    ],
    sameAs: Object.values(SITE.social),
    knowsAbout: SITE.seo.keywords
  } as const
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE.info.name,
    description: SITE.seo.description,
    inLanguage: SITE.seo.locale,
    publisher: { "@id": `${SITE_URL}#organization` }
  } as const
}

export function professionalServiceLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}#business`,
    name: SITE.info.name,
    image: LOGO_URL,
    url: SITE_URL,
    telephone: SITE.contact.whatsapp(),
    email: SITE.contact.email,
    priceRange: SITE.seo.priceRange,
    currenciesAccepted: SITE.seo.currency,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressCountry: SITE.location.countryCode
    },
    areaServed: areaServed(),
    parentOrganization: { "@id": `${SITE_URL}#organization` }
  } as const
}

export function servicesLd() {
  return SERVICES.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}#service-${s.id}`,
    name: s.h3,
    serviceType: s.eyebrow,
    description: s.body,
    provider: { "@id": `${SITE_URL}#organization` },
    areaServed: areaServed(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.eyebrow,
      itemListElement: s.items.map((item, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: item }
      }))
    }
  }))
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  } as const
}
```

Si el proyecto todavía no tiene servicios o preguntas frecuentes, comienza con
organizationLd y webSiteLd. Agrega los otros helpers cuando exista contenido
visible que los respalde.

### 11.3 Crear BaseHead.astro

BaseHead centraliza título, descripción, canonical, hreflang, robots, Open Graph,
Twitter, metadatos de marca, icono y manifest.

```astro title="src/components/seo/BaseHead.astro"
---
import { SITE } from "@/config/site"

interface Props {
  title?: string
  description?: string
  image?: string
  canonical?: string
  keywords?: readonly string[]
  ogType?: "website" | "article"
  noindex?: boolean
}

const {
  title,
  description = SITE.seo.description,
  image = SITE.seo.image,
  canonical = new URL(Astro.url.pathname, SITE.seo.url).href,
  keywords = SITE.seo.keywords,
  ogType = SITE.seo.ogType,
  noindex = SITE.seo.noindex
} = Astro.props

const pageTitle = title ? `${title} — ${SITE.info.name}` : SITE.seo.title

const ogImage = new URL(image, SITE.seo.url).href
const ogLocale = SITE.seo.locale.replace("-", "_")
const robots = noindex ? "noindex, nofollow" : "index, follow"
const googlebot = noindex
  ? robots
  : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
---

<title>{pageTitle}</title>
<meta charset="utf-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=5"
/>

<!-- <link rel="preload" as="font" href="/fonts/mi-fuente.woff2" type="font/woff2" crossorigin /> -->

<meta
  name="description"
  content={description}
/>
<link
  rel="canonical"
  href={canonical}
/>
{
  SITE.seo.locales.map((locale) => (
    <link
      rel="alternate"
      hreflang={locale.hreflang}
      href={canonical}
    />
  ))
}
<link
  rel="alternate"
  hreflang="x-default"
  href={canonical}
/>

<meta
  name="robots"
  content={robots}
/>
<meta
  name="googlebot"
  content={googlebot}
/>

<meta
  property="og:type"
  content={ogType}
/>
<meta
  property="og:site_name"
  content={SITE.info.name}
/>
<meta
  property="og:title"
  content={pageTitle}
/>
<meta
  property="og:description"
  content={description}
/>
<meta
  property="og:url"
  content={canonical}
/>
<meta
  property="og:locale"
  content={ogLocale}
/>
<meta
  property="og:image"
  content={ogImage}
/>
<meta
  property="og:image:width"
  content={String(SITE.seo.imageWidth)}
/>
<meta
  property="og:image:height"
  content={String(SITE.seo.imageHeight)}
/>
<meta
  property="og:image:alt"
  content={SITE.seo.imageAlt}
/>

<meta
  name="twitter:card"
  content={SITE.seo.twitterCard}
/>
<meta
  name="twitter:site"
  content={SITE.seo.twitterHandle}
/>
<meta
  name="twitter:creator"
  content={SITE.seo.twitterAuthor}
/>
<meta
  name="twitter:title"
  content={pageTitle}
/>
<meta
  name="twitter:description"
  content={description}
/>
<meta
  name="twitter:image"
  content={ogImage}
/>

<meta
  name="keywords"
  content={keywords.join(", ")}
/>
<meta
  name="author"
  content={SITE.seo.author}
/>
<meta
  name="creator"
  content={SITE.seo.creator}
/>
<meta
  name="publisher"
  content={SITE.seo.publisher}
/>
<meta
  name="application-name"
  content={SITE.info.name}
/>
<meta
  name="category"
  content={SITE.seo.category}
/>
<meta
  name="classification"
  content={SITE.seo.classification}
/>
<meta
  name="generator"
  content={Astro.generator}
/>
<meta
  name="referrer"
  content="strict-origin-when-cross-origin"
/>
<meta
  name="format-detection"
  content="telephone=no, address=no, email=no"
/>

<meta
  name="mobile-web-app-capable"
  content="yes"
/>
<meta
  name="apple-mobile-web-app-title"
  content={SITE.info.name}
/>
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>

<meta
  name="geo.region"
  content={`${SITE.location.countryCode}-${SITE.seo.geo.region}`}
/>
<meta
  name="geo.placename"
  content={SITE.location.city}
/>
<meta
  name="geo.position"
  content={`${SITE.seo.geo.latitude};${SITE.seo.geo.longitude}`}
/>
<meta
  name="ICBM"
  content={`${SITE.seo.geo.latitude}, ${SITE.seo.geo.longitude}`}
/>

<meta
  name="color-scheme"
  content="dark light"
/>
<meta
  name="theme-color"
  media="(prefers-color-scheme: light)"
  content={SITE.seo.themeColor.light}
/>
<meta
  name="theme-color"
  media="(prefers-color-scheme: dark)"
  content={SITE.seo.themeColor.dark}
/>

<link
  rel="icon"
  href="/icon.svg"
  type="image/svg+xml"
/>
<link
  rel="manifest"
  href="/manifest.webmanifest"
/>
```

La canonical debe ser absoluta y coincidir con enlaces internos, redirecciones y
sitemap. noindex no protege contenido privado: las rutas privadas requieren
autenticación y autorización.

### 11.4 Completar el layout raíz

Reemplaza el layout provisional del paso de Tailwind por la implementación
definitiva. El import de global.css sigue funcionando porque el alias se configuró
antes.

```astro title="src/layouts/Layout.astro"
---
import BaseHead from "@/components/seo/BaseHead.astro"
import JsonLd from "@/components/seo/JsonLd.astro"
import { SITE } from "@/config/site"
import {
  faqLd,
  organizationLd,
  professionalServiceLd,
  servicesLd,
  webSiteLd
} from "@/libs/seo"
import "@/styles/globals.css"

interface Props {
  title?: string
  description?: string
  image?: string
  canonical?: string
  keywords?: readonly string[]
  ogType?: "website" | "article"
  noindex?: boolean
}

const { title, description, image, canonical, keywords, ogType, noindex } =
  Astro.props
---

<html lang={SITE.seo.locale}>
  <head>
    <BaseHead
      title={title}
      description={description}
      image={image}
      canonical={canonical}
      keywords={keywords}
      ogType={ogType}
      noindex={noindex}
    />

    <JsonLd
      id="ld-organization"
      data={organizationLd()}
    />
    <JsonLd
      id="ld-website"
      data={webSiteLd()}
    />
    <JsonLd
      id="ld-business"
      data={professionalServiceLd()}
    />
    <JsonLd
      id="ld-services"
      data={servicesLd()}
    />
    <JsonLd
      id="ld-faq"
      data={faqLd()}
    />
  </head>

  <body class="antialiased">
    <slot />
  </body>
</html>
```

Retira del layout los helpers que todavía no tengan datos reales. No publiques
FAQPage, Service ni ProfessionalService con contenido inventado.

### 11.5 Crear manifest.webmanifest

```ts title="src/pages/manifest.webmanifest.ts"
import type { APIRoute } from "astro"
import { SITE } from "@/config/site"

export const GET: APIRoute = () => {
  const manifest = {
    name: SITE.info.legalName,
    short_name: SITE.info.name,
    description: SITE.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE.seo.themeColor.dark,
    theme_color: SITE.seo.themeColor.dark,
    lang: SITE.seo.locale,
    categories: SITE.seo.manifestCategories,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ]
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" }
  })
}
```

El manifest reutiliza nombre, descripción, colores e iconos de SITE.

### 11.6 Crear robots.txt

```ts title="src/pages/robots.txt.ts"
import type { APIRoute } from "astro"
import { SITE } from "@/config/site"

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /_astro/",
    "",
    `Sitemap: ${SITE.seo.url}/sitemap.xml`,
    `Host: ${SITE.seo.url}`,
    ""
  ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  })
}
```

robots.txt controla rastreo, no acceso. No bloquees recursos necesarios para
renderizar la página y no lo uses para ocultar información sensible.

### 11.7 Crear sitemap.xml

```ts title="src/pages/sitemap.xml.ts"
import type { APIRoute } from "astro"
import { SITE } from "@/config/site"

const ROUTES = [{ path: "/", changeFrequency: "monthly", priority: "1.0" }]

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString()

  const urls = ROUTES.map(
    (route) => `  <url>
    <loc>${SITE.seo.url}${route.path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  ).join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  })
}
```

Para un sitio pequeño, ROUTES puede mantenerse explícito. En blogs o catálogos
genera las rutas desde la colección de contenido y utiliza fechas reales de
modificación.

### 11.8 Añadir los recursos públicos

### Objetivo

Completar todas las rutas utilizadas por `BaseHead`, el manifest y JSON-LD.

```text
public/
├── brand/
│   └── logo.png
├── icon.svg
└── opengraph-image.png
```

La imagen social debe medir 1200 × 630 si SITE declara esas dimensiones. Verifica
que todas las rutas usadas por BaseHead, manifest y JSON-LD existan realmente.

## 12. Añadir los archivos del repositorio

### Objetivo

Presentar el proyecto correctamente en GitHub sin crear documentos vacíos que
nadie mantendrá.

```text
.
├── .editorconfig
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── LICENSE-CONTENT.md
├── README.md
├── SECURITY.md
└── .github/
    ├── CODEOWNERS
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/ci.yml
```

| Archivo              | Contenido mínimo                                                     |
| -------------------- | -------------------------------------------------------------------- |
| `README.md`          | Propósito, requisitos, instalación, scripts, estructura y despliegue |
| `LICENSE`            | Licencia MIT para el código                                          |
| `LICENSE-CONTENT.md` | Condiciones de uso de documentación, textos y recursos visuales      |
| `CHANGELOG.md`       | Cambios agrupados por versión                                        |
| `CONTRIBUTING.md`    | Ramas, commits, comprobaciones y pull requests                       |
| `SECURITY.md`        | Canal privado para reportes y versiones soportadas                   |
| `.env.example`       | Variables requeridas sin secretos                                    |
| `.gitignore`         | `node_modules`, `dist`, `.astro`, `.env` y artefactos locales        |
| `.editorconfig`      | UTF-8, LF, espacios y tamaño de indentación                          |
| `eslint.config.mjs`  | Configuración de ESLint (paso 9)                                     |

`.github/workflows/ci.yml` ya existe desde el paso 3 — aquí solo aparece para
que el árbol muestre el repositorio completo. `CODEOWNERS`, plantillas de
Issues y pull requests se agregan cuando exista una persona responsable de
mantenerlos. Nunca guardes tokens reales en ejemplos,
logs de CI, Issues o capturas de pantalla.

## 13. Estructura final recomendada

Esta estructura permite comprobar visualmente que cada archivo creado durante
la receta quedó en el lugar correcto:

```text
mi-proyecto/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── brand/
│   │   └── logo.png
│   ├── icon.svg
│   ├── manifest.webmanifest
│   └── opengraph-image.png
├── src/
│   ├── components/
│   │   └── seo/
│   │       ├── BaseHead.astro
│   │       └── JsonLd.astro
│   ├── config/
│   │   └── site.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── libs/
│   │   └── seo.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── robots.txt.ts
│   │   └── sitemap.xml.ts
│   └── styles/
│       └── global.css
├── .prettierignore
├── .prettierrc
├── astro.config.mjs
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

`src/pages` define rutas públicas, `src/layouts` construye la estructura HTML,
`src/components` guarda piezas reutilizables, `src/libs` concentra lógica sin UI
y `src/config` mantiene identidad y decisiones globales. El contenido que no
debe publicarse directamente no se coloca dentro de `src/pages`.

Si instalaste el adaptador de Vercel, también aparecerán su dependencia en
`package.json` y su registro en `astro.config.mjs`; no necesita una carpeta
adicional dentro de `src/`.

## 14. Verificar el proyecto

Ejecuta las comprobaciones en el mismo orden que el CI del paso 3, para que un
fallo local sea exactamente el mismo fallo que verías en el pull request:

```bash
pnpm sync
pnpm check
pnpm eslint
pnpm prettier:check
pnpm build
pnpm preview
```

Si `prettier:check` falla, corre `pnpm prettier` para reescribir los archivos y
vuelve a verificar.

Revisa manualmente /robots.txt, /sitemap.xml y /manifest.webmanifest. En el HTML
de una página confirma title, description, canonical, lang, Open Graph y JSON-LD.

### Checklist final

- [ ] Se eligió un solo gestor de paquetes y existe un solo lockfile.
- [ ] package.json contiene identidad, enlaces, engines y scripts.
- [ ] astro.config.mjs declara site antes de cualquier integración.
- [ ] El adaptador de Vercel solo se instaló si el proyecto necesita SSR.
- [ ] @/* funciona antes de utilizar imports con alias.
- [ ] Tailwind está instalado, registrado en Vite e importado una sola vez.
- [ ] Prettier reconoce Astro y ordena imports y clases de Tailwind.
- [ ] typescript está en `< 7` (revisar antes de instalar typescript-eslint).
- [ ] ESLint corre sobre archivos .astro y .ts sin errores.
- [ ] pnpm-lock.yaml quedó regenerado (`pnpm install`) tras cualquier cambio de versión en package.json.
- [ ] El workflow de GitHub Actions corre check, eslint, prettier:check y build.
- [ ] Los archivos del repositorio explican cómo instalar, contribuir y reportar.
- [ ] SITE obtiene el dominio desde `import.meta.env.SITE` y no incluye secretos.
- [ ] BaseHead, JSON-LD, manifest, robots y sitemap usan SITE.
- [ ] La estructura final coincide con las rutas realmente creadas.
- [ ] pnpm check, pnpm eslint, pnpm prettier:check y pnpm build terminan sin errores.

Referencias oficiales: [instalación de Astro](https://docs.astro.build/en/install-and-setup/),
[Tailwind CSS 4 en Astro](https://docs.astro.build/en/guides/styling/),
[configuración de Astro](https://docs.astro.build/en/guides/configuring-astro/) y
[renderizado bajo demanda](https://docs.astro.build/en/guides/on-demand-rendering/).
