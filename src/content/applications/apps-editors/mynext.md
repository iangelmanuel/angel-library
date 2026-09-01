---
title: Configuración inicial de Next.js
description: Paso a paso privado para iniciar un proyecto Next.js con Tailwind CSS, configuración base, GitHub Actions, Prettier, ESLint, SITE, SEO y archivos de repositorio.
type: commands
tags: [nextjs, react, configuración, setup, tailwind, typescript, prettier, eslint, github-actions, seo, privado]
command: /mynext
whenToUse: Ejecuta /mynext en la terminal interna cuando quieras iniciar un proyecto Next.js con esta configuración.
warnings:
  - "Esta entrada es privada y solo se abre mediante el comando /mynext en la terminal de búsqueda."
  - "Reemplaza los nombres, dominios y datos de Acme antes de publicar."
private: true
related:
  - frontend/nextjs/nextjs-getting-started
  - frontend/nextjs/nextjs-project-structure-configuration
  - seo/nextjs/nextjs-metadata-seo
  - general/typescript/typescript-path-aliases
  - general/config/site-config-global
  - seo/nextjs/nextjs-seo-completo
updatedAt: 2026-08-27
---

## Antes de comenzar

Esta receta se ejecuta de arriba hacia abajo. La creación inicial ya incorpora
TypeScript, ESLint, Tailwind CSS, App Router, Turbopack, el directorio `src/` y
el alias `@/*`. Después se configura el framework, el formato y finalmente el
SEO que consume la variable `SITE`.

Los comandos de instalación y creación aparecen en un único bloque con tabs
para pnpm, Bun y npm. Elige un gestor al comenzar y conserva solamente su
lockfile durante todo el proyecto.

## 1. Crear el proyecto Next.js

### Objetivo

Crear una aplicación con el App Router y todas las decisiones base definidas
desde el instalador. De esta manera no hay que instalar Tailwind ni configurar
el alias manualmente después.

~~~bash
pnpm create next-app@latest mi-proyecto --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --turbopack --yes
~~~

El comando deja preparadas estas decisiones:

| Opción | Resultado |
| --- | --- |
| `--ts` | TypeScript y tipos del proyecto |
| `--eslint` | ESLint con la configuración de Next.js |
| `--tailwind` | Tailwind CSS integrado desde la creación |
| `--app` | App Router en lugar del Pages Router |
| `--src-dir` | Código de la aplicación dentro de `src/` |
| `--import-alias "@/*"` | Imports absolutos desde `src/` |
| `--turbopack` | Turbopack como bundler de desarrollo |
| `--yes` | Usa las opciones indicadas sin abrir el asistente |

Entra al proyecto:

~~~bash
cd mi-proyecto
~~~

No mezcles `pnpm-lock.yaml`, `package-lock.json` y `bun.lock`. El lockfile
identifica el gestor seleccionado y debe versionarse en Git.

## 2. Completar los datos del proyecto

### Objetivo

Convertir `package.json` en la ficha técnica del repositorio. Conserva las
dependencias y versiones creadas por `create-next-app`; agrega o ajusta los
campos de identidad y los scripts del siguiente ejemplo.

~~~json title="package.json"
{
  "name": "mi-proyecto-next",
  "version": "0.1.0",
  "private": true,
  "description": "Descripción breve y concreta del proyecto",
  "license": "...",
  "packageManager": "pnpm@...",
  "homepage": "https://github.com/usuario/mi-proyecto-next",
  "keywords": [
    "nextjs",
    "react",
    "typescript",
    "tailwindcss",
    "app-router"
  ],
  "author": {
    "name": "Tu nombre",
    "email": "tu@correo.com",
    "url": "https://github.com/usuario"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/usuario/mi-proyecto-next.git"
  },
  "bugs": {
    "url": "https://github.com/usuario/mi-proyecto-next/issues"
  },
  "engines": {
    "node": ">=...",
    "pnpm": ">=..."
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "next start",
    "start": "next start",
    "next": "next",
    "check": "tsc --noEmit",
    "eslint": "eslint .",
    "eslint:fix": "eslint . --fix",
    "prettier": "prettier --write .",
    "prettier:check": "prettier . --check"
  }
}
~~~

Los `"..."` (`license`, `packageManager`, `engines`) dependen del proyecto y del
gestor elegido — reemplázalos antes de continuar, no dejes el literal `"..."`
en el archivo real. No reemplaces el archivo completo con ese fragmento:
`next`, `react`, `react-dom`, Tailwind, TypeScript y ESLint deben conservar las
versiones que instaló el CLI.

`private: true` evita publicar accidentalmente la aplicación como paquete de
npm; no impide subir el repositorio a GitHub ni desplegarlo.

## 3. Configurar GitHub Actions

### Objetivo

Dejar la verificación automática lista antes de escribir código: cada push y
cada pull request corren los mismos comandos que se ejecutan en local. El
workflow solo llama a los scripts declarados en el paso 2, así que el archivo
no cambia aunque después se agreguen Prettier, ESLint o el SEO.

Dos jobs, no uno: `quality` corre `check`, `eslint` y `prettier:check` en
paralelo —son independientes entre sí, así que no hay razón para serializarlos—
y `build` espera a que los tres pasen. Es el paso más lento; no vale la pena
pagarlo sobre código que ya se sabe roto por tipos o lint.

~~~yaml title=".github/workflows/ci.yml"
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

      - run: pnpm ${{ matrix.task }}

  build:
    needs: quality
    runs-on: ubuntu-latest

    env:
      NEXT_PUBLIC_SITE_URL: https://example.com

    steps:
      - uses: actions/checkout@v5

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build
~~~

| Clave | Qué hace |
| --- | --- |
| `strategy.matrix.task` | Crea un job por verificación; los tres arrancan a la vez |
| `fail-fast: false` | Sin esto, el primer job que falla cancela a los otros dos — perderías la visibilidad de si además tenías errores de ESLint o de formato |
| `needs: quality` | `build` espera a que los tres terminen en verde; si uno falla, se salta |
| `pnpm ${{ matrix.task }}` | El nombre del script sale de la matriz — agregar una verificación es agregar un elemento a la lista |

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

`NEXT_PUBLIC_SITE_URL` baja al job de `build`, que es el único que la necesita:
`check`, `eslint` y `prettier:check` no leen `SITE`. Declararla a nivel de
workflow también funciona, pero deja de ser evidente qué paso depende de ella.

Cada job es una máquina distinta, así que cada uno reinstala dependencias: son
cuatro instalaciones en vez de una. La caché de `setup-node` con `cache: pnpm`
lo abarata bastante y, a cambio, el PR muestra los cuatro resultados por
separado en vez de uno solo que se corta en el primer error.

Los pasos `eslint` y `prettier:check` fallarán hasta completar los pasos 6 y
7, que crean sus configuraciones. Es esperado: el workflow se agrega al
principio para que ningún commit posterior quede sin verificar.

## 4. Revisar Tailwind y el alias generado

### Objetivo

Confirmar que dos decisiones necesarias para los siguientes pasos ya existen.
No vuelvas a instalar Tailwind ni dupliques la configuración del alias.

La hoja global debe comenzar con la importación de Tailwind CSS:

~~~css title="src/app/globals.css"
@import "tailwindcss";

:root {
  color-scheme: dark;
}

body {
  margin: 0;
  background: #050505;
  color: #f5f5f5;
}
~~~

El `layout.tsx` generado ya importa `./globals.css`. Mantén esa importación una
sola vez en el layout raíz; cada página recibe los estilos por herencia.

Revisa también el alias en `tsconfig.json`:

~~~json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
~~~

Con ese alias, `@/config/site` resuelve `src/config/site.ts`. No agregues
`baseUrl` si el archivo generado no lo necesita.

## 5. Configurar next.config.ts

### Objetivo

Definir solo decisiones globales que realmente necesita la aplicación. Next.js
funciona sin opciones obligatorias, por eso esta base evita flags experimentales
y configuraciones que pertenecen a un caso de despliegue específico.

~~~ts title="next.config.ts"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: {
    formats: ["image/avif", "image/webp"]
  }
}

export default nextConfig
~~~

| Opción | Qué controla |
| --- | --- |
| `reactStrictMode` | Activa comprobaciones adicionales de React durante desarrollo |
| `poweredByHeader` | Evita enviar el header informativo `X-Powered-By` |
| `typedRoutes` | Comprueba rutas literales usadas por `Link` y navegación |
| `images.formats` | Permite que `next/image` negocie AVIF y WebP |

Eliminar `X-Powered-By` reduce información innecesaria, pero no reemplaza
headers de seguridad, validación, autenticación ni protección contra abuso.

Si `next/image` debe cargar imágenes de un CDN externo, agrega únicamente el
origen real y limita su ruta:

~~~ts title="next.config.ts (images opcional)"
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "cdn.example.com",
      pathname: "/images/**"
    }
  ]
}
~~~

No agregues `output: "standalone"` para un despliegue normal en Vercel. Esa
salida se usa principalmente cuando la aplicación se empaqueta en un contenedor
o en una infraestructura que necesita un servidor autocontenido.

## 6. Instalar y configurar Prettier

### Objetivo

Formatear TypeScript, JSX y CSS; ordenar imports; y ordenar las clases de
Tailwind. El plugin de imports se declara explícitamente para que las opciones
`importOrder` no sean campos sin efecto.

~~~bash
pnpm add -D prettier @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss
~~~

Crea `.prettierrc` en la raíz:

~~~json title=".prettierrc"
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
  "tailwindStylesheet": "..."
}
~~~

El orden resultante es React, Next.js, paquetes externos, alias internos,
imports relativos y estilos. `prettier-plugin-tailwindcss` debe permanecer al
final del arreglo de plugins. Reemplaza `tailwindStylesheet: "..."` por la
ruta real del CSS creado en el paso 4 (`./src/app/globals.css`).

Crea el archivo de exclusiones:

~~~text title=".prettierignore"
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
~~~

Los lockfiles son artefactos del gestor y no deben ser reformateados. Mantén en
el repositorio solo el que corresponda al gestor elegido.

Confirma que `package.json` ya tiene los scripts para ejecutar Prettier (paso 2):

~~~json title="package.json (scripts)"
{
  "scripts": {
    "prettier": "prettier --write .",
    "prettier:check": "prettier . --check"
  }
}
~~~

`prettier` reescribe los archivos; `prettier:check` solo falla si algo no está
formateado, útil para CI.

## 7. Configurar ESLint

### Objetivo

`create-next-app` ya instaló ESLint con la configuración de Next.js, así que
aquí casi no se instala nada: se revisa lo generado, se confirma la versión de
TypeScript y se agrega la única pieza que el CLI no trae.

### Antes de tocar la config: confirma que TypeScript está por debajo de 7.0

`eslint-config-next/typescript` está construido sobre
[`typescript-eslint`](https://typescript-eslint.io), que al momento de escribir
esto todavía no soporta TypeScript 7. Si `create-next-app` instaló un
TypeScript 7.x, `pnpm eslint` y `pnpm check` fallarán con errores que no tienen
que ver con tu código. Revisa la versión que quedó:

~~~bash
pnpm list typescript
~~~

Si es 7.x, fíjala explícitamente:

~~~bash
pnpm add -D typescript@^6
~~~

Antes de escribir un `tsconfig.json` nuevo o actualizar dependencias, confirma
en la documentación oficial de `typescript-eslint` si ya soporta TypeScript 7
— este freno es temporal, no una regla permanente del proyecto.

El orden importa, y saltárselo es la causa más común de que esta sección falle
a medias: TypeScript en `< 7` primero → revisar `eslint.config.mjs` →
`pnpm install` para sincronizar `pnpm-lock.yaml` con la versión fijada → recién
ahí `check`/`eslint`/`prettier:check`. Cambiar una versión en `package.json`
sin correr `pnpm install` después deja el lockfile desincronizado, y
`pnpm install --frozen-lockfile` (paso 3) fallará en CI aunque en local todo
funcione.

### La configuración

Next recomienda `eslint-config-prettier` para que las reglas de formato que
llegan vía `eslint-plugin-react` no discutan con Prettier. Es lo único que hay
que instalar:

~~~bash
pnpm add -D eslint-config-prettier
~~~

Revisa el archivo que creó el CLI y déjalo así:

~~~js title="eslint.config.mjs"
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])
])

export default eslintConfig
~~~

| Configuración | Qué aporta |
| --- | --- |
| `eslint-config-next/core-web-vitals` | Reglas de Next.js, React y React Hooks; sube a error las que afectan Core Web Vitals |
| `eslint-config-next/typescript` | Reglas de `typescript-eslint` (`recommended`) para los archivos `.ts`/`.tsx` |
| `eslint-config-prettier/flat` | Apaga las reglas de formato que chocarían con Prettier — va **después** de las anteriores para poder desactivarlas |

`eslint-config-next` exporta configuración plana nativa: se importa directo,
sin el puente `FlatCompat` que hacía falta cuando estas configs solo existían
en el formato antiguo (`eslintrc`). Si encuentras un ejemplo con
`compat.extends("next/core-web-vitals")`, está desactualizado.

`globalIgnores()` reemplaza al antiguo `.eslintignore`, que la configuración
plana ya no lee. Los cuatro patrones son los que `eslint-config-next` ignora
por defecto: declararlos explícitamente evita perderlos al sobrescribir la
configuración.

Comprueba que corre:

~~~bash
pnpm install
pnpm eslint
~~~

Desde Next.js 16 el comando `next lint` ya no existe: se invoca al CLI de
ESLint directamente, que es justamente lo que hace el script `eslint` del
paso 2.

## 8. Preparar variables de entorno

### Objetivo

Separar el dominio por entorno sin escribir una URL distinta en cada helper de
SEO. Las variables con prefijo `NEXT_PUBLIC_` pueden llegar al navegador; nunca
coloques secretos en ellas.

~~~dotenv title=".env.local"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
~~~

Versiona únicamente una plantilla sin credenciales:

~~~dotenv title=".env.example"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
~~~

En producción configura `NEXT_PUBLIC_SITE_URL` con el origen definitivo, por
ejemplo `https://example.com`, sin una barra final. Tokens, claves privadas y
URLs internas deben usar variables sin `NEXT_PUBLIC_` y solo consumirse desde
Server Components, Route Handlers o Server Actions.

## 9. Crear SITE

### Objetivo

Centralizar la identidad y los datos que consumen la metadata, el manifest y
JSON-LD. El ejemplo usa la misma empresa ficticia de la documentación SEO del
proyecto para que Astro y Next.js compartan la misma fuente conceptual.

~~~ts title="src/config/site.ts"
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "")

export const SITE = {
  info: {
    name: "Acme",
    legalName: "Acme Studio",
    description:
      "Firma boutique en Bogotá, Colombia. Construimos sitios web, software a medida, identidad de marca y comunicación para empresas que quieren ser vistas, entendidas y elegidas.",
    slogan: "Construimos lo que tu negocio necesita, no lo que sobra.",
    founded: 2025,
    founders: [{ name: "Jane Doe", role: "Cofundadora" }],
    teams: [] as Array<{ name: string; lead: string }>,
  },

  site: {
    url: SITE_URL,
    locale: "es-CO",
    lang: "es",
    timezone: "America/Bogota",
    currency: "COP",
  },

  location: {
    address: "Cra. 50 #13-95",
    city: "Bogotá",
    state: "Cundinamarca",
    country: "Colombia",
    countryCode: "CO",
    postalCode: "110111",
    timezone: "America/Bogota",
    display: "Bogotá, Colombia",
  },

  contact: {
    email: "hola@acme.studio",
    countryCode: "+57",
    phone: "300 123 4567",
    phoneDisplay: () => `${SITE.contact.countryCode} ${SITE.contact.phone}`,
    whatsapp: () =>
      `${SITE.contact.countryCode}${SITE.contact.phone.replace(/\s/g, "")}`,
    landline: null as string | null,
  },

  whatsAppMessage: {
    general: "Hola, quiero conocer más sobre los servicios.",
    service: (service: string) =>
      `Hola, estoy interesado en el servicio de ${service}. ¿Podrías darme más información?`,
    appointment: "Hola, quiero agendar una reunión.",
  },

  social: {
    instagram: "https://instagram.com/acmestudio",
    linkedin: "https://linkedin.com/company/acmestudio",
    x: "https://x.com/acmestudio",
    github: "https://github.com/acmestudio",
    tiktok: null as string | null,
    youtube: "https://youtube.com/@acmestudio",
  },

  businessHours: [
    { day: "Lunes", open: "09:00", close: "18:00" },
    { day: "Martes", open: "09:00", close: "18:00" },
    { day: "Miércoles", open: "09:00", close: "18:00" },
    { day: "Jueves", open: "09:00", close: "18:00" },
    { day: "Viernes", open: "09:00", close: "18:00" },
    { day: "Sábado", open: "10:00", close: "14:00" },
    { day: "Domingo", open: null, close: null },
  ],

  legal: [
    { slug: "privacidad", title: "Política de Privacidad", updatedAt: "2025-02-15" },
    { slug: "terminos", title: "Términos y Condiciones", updatedAt: "2025-02-15" },
    { slug: "cookies", title: "Política de Cookies", updatedAt: "2025-02-15" },
  ],

  navigation: {
    main: [
      { name: "Inicio", href: "/" },
      { name: "Servicios", href: "/servicios" },
      { name: "Portafolio", href: "/portafolio" },
      { name: "Blog", href: "/blog" },
      { name: "Contacto", href: "/contacto" },
    ],
    cta: { label: "Catálogo", href: "/catalogo" },
  },

  stats: [
    { value: "+120", label: "Proyectos entregados", sublabel: "Desde 2025" },
    { value: "98%", label: "Clientes que renuevan", sublabel: "Retención anual" },
  ],

  seo: {
    title: "Acme — Software, marca y comunicación para empresas",
    titleTemplate: "%s | Acme",
    description:
      "Firma boutique en Bogotá, Colombia. Construimos sitios web, software a medida, identidad de marca y comunicación para empresas que quieren ser vistas, entendidas y elegidas.",
    keywords: [
      "agencia digital",
      "desarrollo web",
      "desarrollo de software",
      "diseño web Bogotá",
      "identidad de marca",
      "comunicación organizacional",
      "e-commerce",
      "landing pages",
      "Bogotá",
      "Colombia",
      "software boutique",
    ],

    author: "Jane Doe",
    creator: "Jane Doe",
    publisher: "Acme Studio",

    url: SITE_URL,
    locale: "es-CO",
    lang: "es",
    currency: "COP",
    contactRegion: "LATAM",
    languages: ["Spanish", "English"],
    locales: [{ hreflang: "es-CO", default: true }] as const,
    geo: { region: "DC", latitude: 4.60971, longitude: -74.08175 },

    image: "/opengraph-image.png",
    imageAlt: "Logo de Acme sobre fondo blanco",
    imageWidth: 1200,
    imageHeight: 630,
    logo: "/brand/logo.png",

    ogType: "website" as "website" | "article",
    twitterAuthor: "@acmestudio" as string | null,
    twitterHandle: "@acmestudio" as string | null,
    twitterCard: "summary_large_image" as
      | "summary"
      | "summary_large_image"
      | "app"
      | "player",
    noindex: false,

    category: "technology",
    classification: "Business",
    priceRange: "$$",

    themeColor: { light: "#FFFFFF", dark: "#000000" },
    manifestCategories: ["business", "design", "productivity"],

    areaServed: [
      { type: "Country", name: "Colombia" },
      { type: "Place", name: "Latin America" },
    ],
  },
} as const

export function whatsAppMessage(message: string) {
  return `https://wa.me/${SITE.contact.whatsapp()}?text=${encodeURIComponent(message)}`
}
~~~

Antes de continuar reemplaza todos los datos de Acme. `SITE.seo.url` se obtiene
de la variable de entorno, y el fallback local permite ejecutar el proyecto sin
configuración adicional. `as const` evita mutaciones accidentales, pero no
convierte datos públicos en secretos.

## 10. Crear los helpers de SEO

### Objetivo

Construir la Metadata API y los datos estructurados desde una sola fuente. La
función `buildMetadata` sirve para páginas estáticas y para
`generateMetadata`; los builders de Schema.org alimentan JSON-LD.

~~~ts title="src/libs/seo.ts"
import type { Metadata } from "next"

import { SITE } from "@/config/site"

export interface SeoOptions {
  title?: string
  fullTitle?: string
  description?: string
  path?: string
  image?: string
  imageAlt?: string
  noindex?: boolean
  nofollow?: boolean
  type?: "website" | "article"
  publishedTime?: string | Date
  modifiedTime?: string | Date
  authors?: string[]
  section?: string
  tags?: string[]
  keywords?: string[]
}

export function absoluteUrl(path: string): string {
  return /^https?:\/\//i.test(path)
    ? path
    : new URL(path, `${SITE.seo.url}/`).href
}

function toIso(value?: string | Date): string | undefined {
  return value ? new Date(value).toISOString() : undefined
}

export function buildMetadata(options: SeoOptions = {}): Metadata {
  const {
    title,
    fullTitle,
    description = SITE.seo.description,
    path = "/",
    image = SITE.seo.image,
    imageAlt = SITE.seo.imageAlt,
    noindex = false,
    nofollow = false,
    type = SITE.seo.ogType,
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    keywords = []
  } = options

  const cleanPath = (path.split("?")[0] ?? "/").replace(/\/+$/, "") || "/"
  const blockIndexing = noindex || SITE.seo.noindex
  const resolvedTitle = fullTitle ?? title ?? SITE.seo.title

  return {
    title: fullTitle ? { absolute: fullTitle } : title,
    description,
    keywords: [...SITE.seo.keywords, ...keywords],
    authors: [{ name: SITE.seo.author }],
    creator: SITE.seo.creator,
    publisher: SITE.seo.publisher,
    category: SITE.seo.category,
    other: { classification: SITE.seo.classification },
    alternates: {
      canonical: cleanPath,
      languages: {
        ...Object.fromEntries(
          SITE.seo.locales.map((l) => [l.hreflang, cleanPath])
        ),
        "x-default": cleanPath
      }
    },
    robots: blockIndexing
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: !nofollow,
          googleBot: {
            index: true,
            follow: !nofollow,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        },
    openGraph: {
      type,
      siteName: SITE.info.name,
      title: resolvedTitle,
      description,
      url: cleanPath,
      locale: SITE.seo.locale.replace("-", "_"),
      images: [
        {
          url: absoluteUrl(image),
          width: SITE.seo.imageWidth,
          height: SITE.seo.imageHeight,
          alt: imageAlt
        }
      ],
      ...(type === "article"
        ? {
            publishedTime: toIso(publishedTime),
            modifiedTime: toIso(modifiedTime),
            authors,
            section,
            tags
          }
        : {})
    },
    twitter: {
      card: SITE.seo.twitterCard,
      title: resolvedTitle,
      description,
      images: [{ url: absoluteUrl(image), alt: imageAlt }],
      ...(SITE.seo.twitterHandle
        ? {
            site: SITE.seo.twitterHandle,
            creator: SITE.seo.twitterAuthor ?? SITE.seo.twitterHandle
          }
        : {})
    }
  }
}

const dayNameEn: Record<string, string> = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
  Domingo: "Sunday"
}

export function buildBusinessSchema(): Record<string, unknown> {
  const openingHours = SITE.businessHours
    .filter((day) => day.open !== null && day.close !== null)
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayNameEn[day.day] ?? day.day}`,
      opens: day.open,
      closes: day.close
    }))

  const sameAs = Object.values(SITE.social).filter(
    (url): url is string => typeof url === "string" && url.length > 0
  )

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.seo.url}/#organization`,
    name: SITE.info.name,
    legalName: SITE.info.legalName,
    description: SITE.info.description,
    slogan: SITE.info.slogan,
    url: SITE.seo.url,
    logo: absoluteUrl(SITE.seo.logo),
    image: absoluteUrl(SITE.seo.image),
    telephone: SITE.contact.whatsapp(),
    email: SITE.contact.email,
    foundingDate: String(SITE.info.founded),
    founder: SITE.info.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role
    })),
    priceRange: SITE.seo.priceRange,
    currenciesAccepted: SITE.seo.currency,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.location.address,
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.state,
      postalCode: SITE.location.postalCode,
      addressCountry: SITE.location.countryCode
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.seo.geo.latitude,
      longitude: SITE.seo.geo.longitude
    },
    areaServed: SITE.seo.areaServed.map((area) => ({
      "@type": area.type,
      name: area.name
    })),
    openingHoursSpecification: openingHours,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.contact.email,
      telephone: SITE.contact.whatsapp(),
      availableLanguage: SITE.seo.languages,
      areaServed: [SITE.location.countryCode, SITE.seo.contactRegion]
    },
    sameAs
  }
}

export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.seo.url}/#website`,
    url: SITE.seo.url,
    name: SITE.info.name,
    description: SITE.seo.description,
    inLanguage: SITE.seo.locale,
    publisher: { "@id": `${SITE.seo.url}/#organization` }
  }
}

export function buildBreadcrumbSchema(
  crumbs: { label: string; href: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href)
    }))
  }
}
~~~

`metadataBase`, que se configura en el layout raíz más adelante, permite que
Next.js resuelva canonical y otras rutas relativas contra el dominio de
`SITE.seo.url`.

## 11. Crear el componente JSON-LD

### Objetivo

Insertar uno o varios schemas de Schema.org en el HTML inicial. El reemplazo de
`<` evita que un valor no confiable cierre la etiqueta `script` antes de tiempo.

~~~tsx title="src/components/seo/JsonLd.tsx"
type Schema = Record<string, unknown>

interface JsonLdProps {
  schema: Schema | Schema[]
}

export function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return schemas.map((item, index) => (
    <script
      key={`schema-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(item).replace(/</g, "\\u003c")
      }}
    />
  ))
}
~~~

Los valores del schema deben salir de datos controlados o validados. Escapar el
carácter `<` protege la frontera HTML, pero no convierte contenido falso o
incorrecto en datos estructurados válidos.

## 12. Crear manifest, robots y sitemap

### 12.1 Manifest

`src/app/manifest.ts` genera `/manifest.webmanifest` mediante una convención del
App Router.

~~~ts title="src/app/manifest.ts"
import type { MetadataRoute } from "next"

import { SITE } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
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
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
}
~~~

### 12.2 Robots

`src/app/robots.ts` genera `/robots.txt`. El flag `noindex` permite bloquear un
entorno completo de staging sin modificar varias páginas.

~~~ts title="src/app/robots.ts"
import type { MetadataRoute } from "next"

import { SITE } from "@/config/site"

export default function robots(): MetadataRoute.Robots {
  if (SITE.seo.noindex) {
    return {
      rules: { userAgent: "*", disallow: "/" }
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"]
    },
    sitemap: `${SITE.seo.url}/sitemap.xml`,
    host: SITE.seo.url
  }
}
~~~

`robots.txt` expresa preferencias de rastreo; no protege rutas privadas. Una
ruta sensible sigue necesitando autenticación y autorización en el servidor.

### 12.3 Sitemap

`src/app/sitemap.ts` genera `/sitemap.xml`. Comienza con rutas reales y agrega
las dinámicas cuando exista una fuente de contenido.

~~~ts title="src/app/sitemap.ts"
import type { MetadataRoute } from "next"

import { SITE } from "@/config/site"

const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/servicios", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.7 }
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return STATIC_ROUTES.map((route) => ({
    url: `${SITE.seo.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }))
}
~~~

No incluyas rutas inexistentes, páginas con `noindex`, resultados internos de
búsqueda ni URLs privadas.

## 13. Completar el layout raíz

### Objetivo

Definir la metadata global, el title template, el viewport, el idioma y los dos
schemas que representan al negocio y al sitio completo.

~~~tsx title="src/app/layout.tsx"
import type { Metadata, Viewport } from "next"

import { JsonLd } from "@/components/seo/JsonLd"
import { SITE } from "@/config/site"
import {
  buildBusinessSchema,
  buildMetadata,
  buildWebsiteSchema
} from "@/libs/seo"

import "./globals.css"

const baseMetadata = buildMetadata({ path: "/" })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.seo.url),
  ...baseMetadata,
  title: {
    default: SITE.seo.title,
    template: SITE.seo.titleTemplate
  },
  applicationName: SITE.info.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: SITE.seo.themeColor.light
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: SITE.seo.themeColor.dark
    }
  ]
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE.seo.lang}>
      <body>
        <JsonLd schema={[buildBusinessSchema(), buildWebsiteSchema()]} />
        {children}
      </body>
    </html>
  )
}
~~~

La metadata está disponible solo en Server Components. No agregues
`"use client"` al layout raíz para resolver una interacción; mueve esa
interacción a un componente cliente pequeño.

## 14. Usar metadata por página

### Página estática

Una página estática puede exportar el resultado de `buildMetadata` directamente.

~~~tsx title="src/app/servicios/page.tsx"
import { buildMetadata } from "@/libs/seo"

export const metadata = buildMetadata({
  title: "Servicios",
  description: "Conoce nuestros servicios digitales.",
  path: "/servicios"
})

export default function ServicesPage() {
  return (
    <main>
      <h1>Servicios</h1>
      <p>Contenido real de la página.</p>
    </main>
  )
}
~~~

El título final será `Servicios | Acme` porque el layout aplica
`SITE.seo.titleTemplate`.

### Página dinámica

Cuando la metadata depende de un registro, usa `generateMetadata`. El mismo
`slug` debe cargar tanto la metadata como el contenido visible.

~~~tsx title="src/app/blog/[slug]/page.tsx"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/seo/JsonLd"
import { getPostBySlug } from "@/libs/posts"
import { buildBreadcrumbSchema, buildMetadata } from "@/libs/seo"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return buildMetadata({ noindex: true })

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
    tags: post.tags
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { label: "Inicio", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${slug}` }
        ])}
      />
      <article>
        <h1>{post.title}</h1>
      </article>
    </>
  )
}
~~~

Este ejemplo se agrega cuando el proyecto ya tenga un blog y una implementación
real de `getPostBySlug`. No crees datos estructurados de artículos, productos o
servicios que no existan como contenido visible.

## 15. Añadir recursos públicos

### Objetivo

Completar las rutas utilizadas por metadata, manifest y JSON-LD.

~~~text
src/app/
├── favicon.ico
└── opengraph-image.png

public/
├── apple-touch-icon.png
├── brand/
│   └── logo.png
└── icons/
    ├── icon-192.png
    └── icon-512.png
~~~

La imagen Open Graph debe medir `1200 × 630`, coincidir con la descripción de
`SITE.seo.imageAlt` y verse correctamente sobre fondos claros y oscuros. Los
iconos del manifest deben ser cuadrados y no depender de transparencia para
mantener legibilidad.

## 16. Añadir los archivos del repositorio

### Objetivo

Presentar el proyecto correctamente en GitHub sin crear documentos vacíos que
nadie mantendrá.

~~~text
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
~~~

| Archivo | Contenido mínimo |
| --- | --- |
| `README.md` | Propósito, requisitos, instalación, variables, scripts y despliegue |
| `LICENSE` | Licencia del código, por ejemplo MIT |
| `LICENSE-CONTENT.md` | Condiciones del contenido, textos y recursos visuales |
| `CHANGELOG.md` | Cambios agrupados por versión |
| `CONTRIBUTING.md` | Ramas, commits, comprobaciones y pull requests |
| `SECURITY.md` | Canal privado para reportes y versiones soportadas |
| `.env.example` | Variables requeridas sin secretos |
| `.gitignore` | `.next`, `node_modules`, `.env*` y artefactos locales |
| `.editorconfig` | UTF-8, LF, espacios y tamaño de indentación |
| `eslint.config.mjs` | Configuración de ESLint (paso 7) |

`.github/workflows/ci.yml` ya existe desde el paso 3 — aquí solo aparece para
que el árbol muestre el repositorio completo. `CODEOWNERS`, plantillas y
archivos de comunidad se agregan cuando exista una persona responsable de
mantenerlos. Nunca guardes tokens reales en ejemplos,
Issues, logs de CI o capturas de pantalla.

## 17. Estructura final recomendada

~~~text
mi-proyecto/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── brand/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   └── seo/JsonLd.tsx
│   ├── config/
│   │   └── site.ts
│   └── libs/
│       └── seo.ts
├── .env.example
├── .env.local
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
~~~

Coloca componentes compartidos en `src/components`, acceso a datos y helpers en
`src/lib`, y decisiones de identidad en `src/config`. Las carpetas internas de
una ruta pueden vivir junto a esa ruta cuando no se reutilizan fuera de ella.

## 18. Verificar el proyecto

Ejecuta las comprobaciones en el mismo orden que el CI del paso 3, para que un
fallo local sea exactamente el mismo fallo que verías en el pull request:

~~~bash
pnpm check
pnpm eslint
pnpm prettier:check
pnpm build
pnpm start
~~~

Si `prettier:check` falla, corre `pnpm prettier` para reescribir los archivos y
vuelve a verificar.

`next dev` ayuda durante el desarrollo, pero no sustituye `next build`. El build
descubre errores de Server Components, metadata, rutas dinámicas, variables de
entorno y código que depende accidentalmente del navegador.

### Checklist final

- [ ] El proyecto fue creado con App Router, TypeScript, Tailwind, ESLint y `src/`.
- [ ] Existe un solo lockfile.
- [ ] `package.json` conserva las dependencias generadas y tiene datos reales.
- [ ] `next.config.ts` contiene únicamente opciones que el proyecto utiliza.
- [ ] Prettier ordena imports y clases de Tailwind.
- [ ] typescript está en `< 7` (`typescript-eslint` todavía no soporta TypeScript 7).
- [ ] ESLint corre con `eslint-config-next` y `eslint-config-prettier` sin errores.
- [ ] pnpm-lock.yaml quedó regenerado (`pnpm install`) tras cualquier cambio de versión en package.json.
- [ ] El workflow de GitHub Actions corre check, eslint, prettier:check y build.
- [ ] `.env.example` no contiene secretos.
- [ ] `SITE` contiene el dominio y los datos reales del proyecto.
- [ ] `metadataBase`, canonical, Open Graph y Twitter usan el dominio correcto.
- [ ] `robots.txt`, `sitemap.xml` y `manifest.webmanifest` responden correctamente.
- [ ] Los schemas JSON-LD describen contenido visible y verificable.
- [ ] Favicon, imagen social, logo e iconos existen en las rutas documentadas.
- [ ] `check`, `eslint`, `prettier:check` y `build` terminan sin errores.

Referencias oficiales: [instalación de Next.js](https://nextjs.org/docs/app/getting-started/installation),
[next.config](https://nextjs.org/docs/app/api-reference/config/next-config-js) y
[Metadata y Open Graph](https://nextjs.org/docs/app/getting-started/metadata-and-og-images).
