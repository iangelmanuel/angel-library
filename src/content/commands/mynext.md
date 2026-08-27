---
title: Configuración inicial de Next.js
description: Paso a paso privado para iniciar un proyecto Next.js con Tailwind CSS, configuración base, Prettier, imports ordenados, SITE, SEO y archivos de repositorio.
category: applications
stack: apps-editors
tags: [nextjs, react, configuración, setup, tailwind, typescript, prettier, seo, privado]
command: /mynext
whenToUse: Ejecuta /mynext en la terminal interna cuando quieras iniciar un proyecto Next.js con esta configuración.
warnings:
  - "Esta entrada es privada y solo se abre mediante el comando /mynext en la terminal de búsqueda."
  - "Reemplaza los nombres, dominios, datos de Acme y servicios de ejemplo antes de publicar."
private: true
related:
  - guides/nextjs-getting-started
  - guides/nextjs-project-structure-configuration
  - guides/nextjs-metadata-seo
  - guides/typescript-path-aliases
  - patterns/site-config-global
  - recipes/nextjs-seo-completo
updatedAt: 2026-08-26
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
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
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

## 3. Revisar Tailwind y el alias generado

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

## 4. Configurar next.config.ts

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

## 5. Instalar y configurar Prettier

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
ruta real del CSS creado en el paso 3 (`./src/app/globals.css`).

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
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
~~~

`format` reescribe los archivos; `format:check` solo falla si algo no está
formateado, útil para CI.

## 6. Preparar variables de entorno

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

## 7. Crear SITE

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
    founded: 2025
  },

  location: {
    address: "Cra. 50 #13-95",
    city: "Bogotá",
    state: "Cundinamarca",
    country: "Colombia",
    countryCode: "CO",
    postalCode: "110111"
  },

  contact: {
    email: "hola@acme.studio",
    whatsapp: "+573001234567"
  },

  social: {
    instagram: "https://instagram.com/acmestudio",
    linkedin: "https://linkedin.com/company/acmestudio",
    x: "https://x.com/acmestudio",
    github: "https://github.com/acmestudio",
    youtube: null as string | null
  },

  businessHours: [
    { day: "Lunes", open: "09:00", close: "18:00" },
    { day: "Martes", open: "09:00", close: "18:00" },
    { day: "Miércoles", open: "09:00", close: "18:00" },
    { day: "Jueves", open: "09:00", close: "18:00" },
    { day: "Viernes", open: "09:00", close: "18:00" },
    { day: "Sábado", open: "10:00", close: "14:00" },
    { day: "Domingo", open: null, close: null }
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
      "Bogotá",
      "Colombia"
    ],
    languages: ["Spanish", "English"],
    url: SITE_URL,
    locale: "es-CO",
    lang: "es",
    currency: "COP",
    image: "/opengraph-image.png",
    imageAlt: "Logo de Acme sobre fondo oscuro",
    imageWidth: 1200,
    imageHeight: 630,
    logo: "/brand/logo.png",
    ogType: "website" as "website" | "article",
    twitterHandle: "@acmestudio" as string | null,
    noindex: false,
    priceRange: "$$$",
    contactRegion: "LATAM",
    geo: {
      region: "DC",
      latitude: 4.60971,
      longitude: -74.08175
    },
    themeColor: {
      light: "#fafafa",
      dark: "#050505"
    },
    manifestCategories: ["business", "design", "productivity"],
    areaServed: [
      { type: "Country", name: "Colombia" },
      { type: "Place", name: "Latin America" }
    ]
  }
} as const
~~~

Antes de continuar reemplaza todos los datos de Acme. `SITE.seo.url` se obtiene
de la variable de entorno, y el fallback local permite ejecutar el proyecto sin
configuración adicional. `as const` evita mutaciones accidentales, pero no
convierte datos públicos en secretos.

## 8. Crear los helpers de SEO

### Objetivo

Construir la Metadata API y los datos estructurados desde una sola fuente. La
función `buildMetadata` sirve para páginas estáticas y para
`generateMetadata`; los builders de Schema.org alimentan JSON-LD.

~~~ts title="src/lib/seo.ts"
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
    alternates: {
      canonical: cleanPath,
      languages: {
        [SITE.seo.locale]: cleanPath,
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
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [{ url: absoluteUrl(image), alt: imageAlt }],
      ...(SITE.seo.twitterHandle
        ? {
            site: SITE.seo.twitterHandle,
            creator: SITE.seo.twitterHandle
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
    url: SITE.seo.url,
    logo: absoluteUrl(SITE.seo.logo),
    image: absoluteUrl(SITE.seo.image),
    telephone: SITE.contact.whatsapp,
    email: SITE.contact.email,
    foundingDate: String(SITE.info.founded),
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
      telephone: SITE.contact.whatsapp,
      availableLanguage: SITE.seo.languages
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

## 9. Crear el componente JSON-LD

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

## 10. Crear manifest, robots y sitemap

### 10.1 Manifest

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

### 10.2 Robots

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

### 10.3 Sitemap

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

## 11. Completar el layout raíz

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
} from "@/lib/seo"

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

## 12. Usar metadata por página

### Página estática

Una página estática puede exportar el resultado de `buildMetadata` directamente.

~~~tsx title="src/app/servicios/page.tsx"
import { buildMetadata } from "@/lib/seo"

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
import { getPostBySlug } from "@/lib/posts"
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/seo"

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

## 13. Añadir recursos públicos

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

## 14. Añadir los archivos del repositorio

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
| CI | Instalación congelada, tipos, lint y build |

`CODEOWNERS`, plantillas y archivos de comunidad se agregan cuando exista una
persona responsable de mantenerlos. Nunca guardes tokens reales en ejemplos,
Issues, logs de CI o capturas de pantalla.

## 15. Estructura final recomendada

~~~text
mi-proyecto/
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
│   └── lib/
│       └── seo.ts
├── .env.example
├── .env.local
├── .prettierignore
├── .prettierrc
├── next.config.ts
├── package.json
└── tsconfig.json
~~~

Coloca componentes compartidos en `src/components`, acceso a datos y helpers en
`src/lib`, y decisiones de identidad en `src/config`. Las carpetas internas de
una ruta pueden vivir junto a esa ruta cuando no se reutilizan fuera de ella.

## 16. Verificar el proyecto

Ejecuta las comprobaciones en este orden:

~~~bash
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm start
~~~

`next dev` ayuda durante el desarrollo, pero no sustituye `next build`. El build
descubre errores de Server Components, metadata, rutas dinámicas, variables de
entorno y código que depende accidentalmente del navegador.

### Checklist final

- El proyecto fue creado con App Router, TypeScript, Tailwind, ESLint y `src/`.
- Existe un solo lockfile.
- `package.json` conserva las dependencias generadas y tiene datos reales.
- `next.config.ts` contiene únicamente opciones que el proyecto utiliza.
- Prettier ordena imports y clases de Tailwind.
- `.env.example` no contiene secretos.
- `SITE` contiene el dominio y los datos reales del proyecto.
- `metadataBase`, canonical, Open Graph y Twitter usan el dominio correcto.
- `robots.txt`, `sitemap.xml` y `manifest.webmanifest` responden correctamente.
- Los schemas JSON-LD describen contenido visible y verificable.
- Favicon, imagen social, logo e iconos existen en las rutas documentadas.
- `format:check`, `lint`, `typecheck` y `build` terminan sin errores.

Referencias oficiales: [instalación de Next.js](https://nextjs.org/docs/app/getting-started/installation),
[next.config](https://nextjs.org/docs/app/api-reference/config/next-config-js) y
[Metadata y Open Graph](https://nextjs.org/docs/app/getting-started/metadata-and-og-images).
