---
title: "SEO completo en Next.js — Metadata API, JSON-LD, sitemap y manifest"
description: "Paso a paso real: SITE.seo como única fuente de verdad, buildMetadata() sobre la Metadata API nativa, schemas de schema.org, robots.ts y sitemap.ts."
type: recipes
order: 2
tags: [nextjs, seo, json-ld, structured-data, metadata, opengraph]
problem: "Tener el SEO técnico completo de un sitio Next.js (App Router) centralizado en SITE.seo, sin datos sueltos hardcodeados en cada función o página."
technologies: [seo/nextjs/nextjs-metadata-seo]
related: [seo/astro/astro-seo-completo]
updatedAt: 2026-08-17
---

## Idea general

Mismo principio que la [versión de Astro](/seo/astro/astro-seo-completo): todo lo que cambia de proyecto a proyecto vive en **un solo objeto, `SITE.seo`**. Ninguna función ni ninguna página de esta receta escribe un dato de la empresa a mano.

La diferencia con Astro no es de fondo, es de API: Next.js tiene una [Metadata API](/seo/nextjs/nextjs-metadata-seo) nativa (`export const metadata`, `generateMetadata`, `app/robots.ts`, `app/sitemap.ts`) en vez de meta tags escritos a mano — esta receta usa esa API a fondo en vez de reinventarla, y esa es la mejora principal sobre una implementación que arma los `<meta>` uno por uno.

Mismos datos de ejemplo que la versión de Astro — la empresa simulada **Acme**, firma boutique en Bogotá — para que ambas recetas describan la misma empresa de punta a punta.

Requisitos: proyecto Next.js 15+ con App Router y TypeScript, alias `@/*` configurado —consulta [Alias de imports en TypeScript](/general/typescript/typescript-path-aliases)— y un `SITE` global existente con al menos `info`, `location`, `contact`, `social` y `businessHours`. Consulta [SITE: variable global de configuración](/general/config/site-config-global) para esa parte. Aquí se documenta a fondo solo el bloque `seo`.

## Paso 1 — `SITE.seo`: la fuente de verdad

```ts title="src/config/site.ts"
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "")

export const SITE = {
  // ...el resto de SITE ya existe en tu proyecto — info, location, contact,
  // whatsAppMessage, businessHours, social, legal. No se repite aquí porque no es SEO,
  // es identidad de marca y datos de contacto (ver el patrón "SITE: variable global
  // de configuración"); el foco de esta receta es solo lo de abajo.

  seo: {
    /** Título por defecto — se usa tal cual en la home, y como sufijo `Página — Acme` en el resto. */
    title: "Acme — Software, marca y comunicación para empresas",
    /** Next aplica este template a cualquier página hija que solo defina su `title`. */
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
      "software boutique"
    ],

    /** Autoría del sitio — alimenta meta author/creator/publisher. Antes se derivaba de
     *  `info.founders`; ahora es un dato de SEO explícito, que no siempre coincide con
     *  la lista de fundadores de la empresa. */
    author: "Jane Doe",
    creator: "Jane Doe",
    publisher: "Acme Studio",

    /** URL canónica del sitio, sin slash final. */
    url: SITE_URL,
    /** BCP-47 con guion (es-CO) — sirve para hreflang, <html lang>, y schema.org inLanguage tal cual. */
    locale: "es-CO",
    lang: "es",
    currency: "COP",
    /** Región amplia para el ContactPoint de JSON-LD — separada de `geo.region`, que es el código del departamento/estado. */
    contactRegion: "LATAM",
    /** Idiomas en los que la empresa atiende — alimenta `availableLanguage` en el schema de Organization. */
    languages: ["Spanish", "English"],
    /**
     * Idiomas publicados del sitio, para generar los <link hreflang> sin repetir código.
     * Hoy hay uno solo; agregar un segundo objeto aquí alcanza para un sitio multi-idioma real.
     */
    locales: [{ hreflang: "es-CO", default: true }] as const,
    /** Código ISO 3166-2 de la región/departamento (Bogotá D.C. → "DC") y coordenadas a nivel ciudad. */
    geo: { region: "DC", latitude: 4.60971, longitude: -74.08175 },

    image: "/opengraph-image.png",
    imageAlt: "Logo de Acme sobre fondo blanco",
    imageWidth: 1200,
    imageHeight: 630,
    /** Logo de marca para el schema de Organization — distinto de la imagen social de arriba. */
    logo: "/brand/logo.png",

    ogType: "website" as "website" | "article",
    /** Cuenta del autor del contenido (twitter:creator), separada de la cuenta del sitio (twitter:site). */
    twitterAuthor: "@acmestudio" as string | null,
    twitterHandle: "@acmestudio" as string | null,
    twitterCard: "summary_large_image" as
      "summary" | "summary_large_image" | "app" | "player",
    noindex: false,

    /** meta name="category" / "classification" — clasificación de industria, no cambia seguido. */
    category: "technology",
    classification: "Business",
    /** priceRange del schema ProfessionalService: $, $$, $$$ o $$$$. */
    priceRange: "$$",

    /** Mismos colores que theme-color y que el manifest — un solo lugar para los dos. */
    themeColor: { light: "#FFFFFF", dark: "#000000" },
    /** Categorías del manifest.webmanifest (taxonomía fija de PWA: business, design, productivity, etc.). */
    manifestCategories: ["business", "design", "productivity"],

    /** areaServed de Organization/ProfessionalService — objetos genéricos, el "@type" de schema.org se arma en src/libs/seo.ts. */
    areaServed: [
      { type: "Country", name: "Colombia" },
      { type: "Place", name: "Latin America" }
    ]
  }
} as const
```

Dos decisiones que vale la pena explicar:

- **`titleTemplate` en vez de armar el string a mano**: Next tiene soporte nativo para templates de título (`metadata.title = { default, template }`) — declarados una vez en el layout raíz, cualquier página hija que solo ponga `title: "Servicios"` sale como `"Servicios | Acme"` sin que la función de `buildMetadata` tenga que concatenar nada. Ver Paso 2 y Paso 7.
- **Una sola fuente de coordenadas**: `SITE.seo.geo` es el único lugar con latitud/longitud — evita el bug típico de tener las coordenadas escritas en dos objetos distintos (por ejemplo `location.geo` y `seo.geo`) que con el tiempo se desincronizan.

## Paso 2 — `src/libs/seo.ts`: los helpers

Una función central (`buildMetadata`) que arma el objeto `Metadata` de Next completo, más tres funciones que arman JSON-LD.

```ts title="src/libs/seo.ts"
import type { Metadata } from "next"
import { SITE } from "@/config/site"

export interface SeoOptions {
  /** Título corto de la página — Next le aplica el template del layout raíz automáticamente. */
  title?: string
  /** Título ya armado, sin pasar por el template — para casos puntuales que no deben llevar el sufijo de marca. */
  fullTitle?: string
  description?: string
  /** Ruta relativa — "/servicios", "/blog/mi-post". */
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
  /** Keywords adicionales — se agregan a las de SITE.seo, no las reemplazan. */
  keywords?: string[]
}

/** Convierte una ruta relativa a URL absoluta; si ya es absoluta, la devuelve tal cual. */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//i.test(path)
    ? path
    : new URL(path, `${SITE.seo.url}/`).href
}

const toIso = (value?: string | Date): string | undefined =>
  value ? new Date(value).toISOString() : undefined

/**
 * Arma el objeto `Metadata` completo directamente página: título (vía el template nativo
 * de Next), description, Open Graph, Twitter, robots, canonical y hreflang.
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: "Servicios",
 *   description: "Conoce nuestro rango de servicios digitales.",
 *   path: "/servicios",
 * })
 */
export function buildMetadata(options: SeoOptions = {}): Metadata {
  const {
    title,
    fullTitle,
    description = SITE.seo.description,
    path = "/",
    image = SITE.seo.image,
    imageAlt,
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
  const imageUrl = absoluteUrl(image)
  const resolvedTitle = fullTitle ?? title ?? SITE.seo.title
  const resolvedAlt = imageAlt ?? SITE.seo.imageAlt

  return {
    // Sin `fullTitle`: un string plano — Next le aplica el `template` del layout raíz solo.
    // Con `fullTitle`: `absolute` se salta el template a propósito (útil para una página
    // que ya trae su propio branding en el título, ej. una landing de campaña).
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
          url: imageUrl,
          width: SITE.seo.imageWidth,
          height: SITE.seo.imageHeight,
          alt: resolvedAlt
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
      images: [{ url: imageUrl, alt: resolvedAlt }],
      ...(SITE.seo.twitterHandle
        ? {
            site: SITE.seo.twitterHandle,
            creator: SITE.seo.twitterAuthor ?? SITE.seo.twitterHandle
          }
        : {})
    },

    other: {
      "geo.region": `CO-${SITE.seo.geo.region}`,
      "geo.placename": SITE.location.city,
      "geo.position": `${SITE.seo.geo.latitude};${SITE.seo.geo.longitude}`,
      ICBM: `${SITE.seo.geo.latitude}, ${SITE.seo.geo.longitude}`
    }
  }
}

/** Mapea días en español a inglés — schema.org espera `dayOfWeek` en inglés. */
const dayNameEn: Record<string, string> = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
  Domingo: "Sunday"
}

/**
 * Schema JSON-LD de Organization/ProfessionalService — contacto, ubicación,
 * horarios y redes sociales. Se pinta una sola vez, en el layout raíz (Paso 7).
 */
export function buildBusinessSchema(): Record<string, unknown> {
  const openingHours = SITE.businessHours
    .filter((d) => d.open !== null && d.close !== null)
    .map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayNameEn[d.day] ?? d.day}`,
      opens: d.open,
      closes: d.close
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
    areaServed: SITE.seo.areaServed.map((a) => ({
      "@type": a.type,
      name: a.name
    })),
    openingHoursSpecification: openingHours,
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
    ...(sameAs.length > 0 ? { sameAs } : {})
  }
}

/** Schema JSON-LD de WebSite — liga el sitio a la Organization vía `@id`. */
export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.seo.url}/#website`,
    url: SITE.seo.url,
    name: SITE.info.name,
    inLanguage: SITE.seo.locale,
    publisher: { "@id": `${SITE.seo.url}/#organization` }
  }
}

/**
 * Schema JSON-LD de BreadcrumbList — mejora cómo aparece la ruta de navegación en los resultados de Google.
 *
 * @example
 * buildBreadcrumbSchema([
 *   { label: "Inicio", href: "/" },
 *   { label: "Blog", href: "/blog" },
 *   { label: post.title, href: `/blog/${post.slug}` },
 * ])
 */
export function buildBreadcrumbSchema(
  crumbs: { label: string; href: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href)
    }))
  }
}
```

## Paso 3 — `<JsonLd />`

```tsx title="src/components/JsonLd.tsx"
type Schema = Record<string, unknown>

/**
 * Inyecta uno o varios bloques JSON-LD en la página.
 *
 * `dangerouslySetInnerHTML` en vez de renderizar el objeto: los datos estructurados
 * tienen que llegar tal cual en el HTML inicial (los crawlers no ejecutan JS para
 * leerlos), y el escape manual de `<` evita que un valor con texto no confiable
 * pueda cerrar la etiqueta `<script>` antes de tiempo.
 */
export function JsonLd({ schema }: { schema: Schema | Schema[] }) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c")
          }}
        />
      ))}
    </>
  )
}
```

Acepta un solo schema o un array — así el layout raíz (Paso 7) puede mandar `Organization` y `WebSite` juntos en un solo `<JsonLd>`, y una página de blog puede mandar el `BreadcrumbList` en otro aparte.

## Paso 4 — `app/manifest.ts`

```ts title="app/manifest.ts"
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
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }]
  }
}
```

Convención de archivo de Next: `app/manifest.ts` con `export default` genera `/manifest.webmanifest` solo, sin ruta manual — mismo mecanismo que `robots.ts`/`sitemap.ts` de los próximos dos pasos. Es el archivo que el layout raíz (Paso 7) ya linkea con `<link rel="manifest" href="/manifest.webmanifest" />`.

## Paso 5 — `app/robots.ts`

```ts title="app/robots.ts"
import type { MetadataRoute } from "next"
import { SITE } from "@/config/site"

/** Genera /robots.txt. Con SITE.seo.noindex activo (staging/preview), bloquea todo el sitio. */
export default function robots(): MetadataRoute.Robots {
  if (SITE.seo.noindex) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    sitemap: `${SITE.seo.url}/sitemap.xml`,
    host: SITE.seo.url
  }
}
```

`SITE.seo.noindex` como flag global (no solo el `noindex` por página que ya vimos en `buildMetadata`) es lo que permite tener un deploy de staging completo, con datos reales, sin arriesgarse a que Google lo indexe por error — una sola variable en un solo archivo.

## Paso 6 — `app/sitemap.ts`

```ts title="app/sitemap.ts"
import type { MetadataRoute } from "next"
import { SITE } from "@/config/site"

/** Rutas estáticas. Agregar aquí conforme crezca el sitio. */
const STATIC_ROUTES: {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/servicios", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.seo.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }))

  // Rutas dinámicas (blog, catálogo) — traer los slugs de la fuente real del proyecto.
  // const blogSlugs = await getPublishedBlogSlugs()
  // const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
  //   url: `${SITE.seo.url}/blog/${slug}`,
  //   lastModified: now,
  //   changeFrequency: "weekly",
  //   priority: 0.7,
  // }))

  return staticRoutes
}
```

Igual que en la versión de Astro: para un sitio con pocas páginas estáticas, un array a mano es más simple y explícito que generarlo automáticamente — recién conviene automatizarlo (leer slugs directamente base de datos o content collection) cuando el sitio tiene contenido dinámico de verdad.

## Paso 7 — `app/layout.tsx`: layout raíz

```tsx title="app/layout.tsx"
import type { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { SITE } from "@/config/site"
import { buildBusinessSchema, buildWebsiteSchema } from "@/libs/seo"

// El title template se declara UNA sola vez, aquí — cualquier página que solo
// exporte `title: "Servicios"` (vía buildMetadata) sale como "Servicios | Acme" sin repetir nada.
export const metadata: Metadata = {
  title: { default: SITE.seo.title, template: SITE.seo.titleTemplate },
  description: SITE.seo.description
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={SITE.seo.lang}>
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
        />
        <link
          rel="manifest"
          href="/manifest.webmanifest"
        />
        <JsonLd schema={[buildBusinessSchema(), buildWebsiteSchema()]} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

`Organization` y `WebSite` se inyectan una única vez aquí, no en cada página — schema.org espera una sola Organization por sitio, y `@id` es lo que permite que el resto de schemas (breadcrumbs, productos, artículos) la referencien sin repetirla.

## Paso 8 — Caso de uso: páginas reales

Página estática, título corto que Next combina solo con el template del layout raíz:

```tsx title="app/servicios/page.tsx"
import { buildMetadata } from "@/libs/seo"

export const metadata = buildMetadata({
  title: "Servicios",
  description:
    "Servicios digitales: desarrollo web, software a medida, identidad de marca y comunicación.",
  path: "/servicios"
})

export default function ServiciosPage() {
  return (
    <main>
      <h1>Nuestros servicios</h1>
      {/* contenido de la página — la lista real de servicios vive en el propio proyecto, no en SITE.seo */}
    </main>
  )
}
```

Resultado: `<title>Servicios | Acme</title>`, canonical en `/servicios`, y los 2 bloques de JSON-LD globales (heredados del layout) sin que esta página tenga que declararlos.

Página dinámica, con metadata generada a partir de datos y su propio `BreadcrumbList`:

```tsx title="app/blog/[slug]/page.tsx"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/JsonLd"
import { getBlogPostBySlug } from "@/libs/db"
import { buildBreadcrumbSchema, buildMetadata } from "@/libs/seo"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return buildMetadata()

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author.name],
    section: "Blog",
    tags: post.tags
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
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
```

Ver [Metadata para SEO](/seo/nextjs/nextjs-metadata-seo) para el detalle general de `generateMetadata` (por qué solo corre en Server Components, cómo evitar pedir el mismo dato dos veces con `cache` de React) — aquí se cubre solo el ensamblado con `SITE.seo`.

## Paso 9 — Extra: schemas por tipo de contenido

Para un catálogo de productos o un blog, dos builders más en el mismo `src/libs/seo.ts`, siguiendo el mismo patrón (reciben el dato de la página, arman el schema):

```ts title="src/libs/seo.ts (agregar)"
export function buildProductSchema(product: {
  id: string
  name: string
  description: string
  slug: string
  price: number
  image: string
  availability: "instock" | "outofstock"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.seo.url}/producto/${product.slug}/#product`,
    name: product.name,
    description: product.description,
    url: `${SITE.seo.url}/producto/${product.slug}`,
    image: absoluteUrl(product.image),
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${SITE.seo.url}/producto/${product.slug}`,
      price: product.price,
      priceCurrency: SITE.seo.currency,
      availability:
        product.availability === "instock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE.seo.url}/#organization` }
    }
  }
}

export function buildArticleSchema(article: {
  title: string
  description: string
  image: string
  slug: string
  publishedAt: Date
  updatedAt?: Date
  author: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: absoluteUrl(article.image),
    url: `${SITE.seo.url}/blog/${article.slug}`,
    datePublished: article.publishedAt.toISOString(),
    dateModified: (article.updatedAt ?? article.publishedAt).toISOString(),
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SITE.info.name,
      logo: { "@type": "ImageObject", url: absoluteUrl(SITE.seo.logo) }
    }
  }
}
```

Solo agregar si el proyecto de verdad tiene catálogo o blog — un schema `Product`/`BlogPosting` sin contenido real detrás no aporta nada.

## Consideraciones

- Bug real que tenía el borrador original de esta receta, corregido aquí: `product.availability` se comparaba como `availability` a secas (variable que no existía en ese scope) — `buildProductSchema` nunca hubiera compilado tal cual estaba.
- Mismo bug de coordenadas duplicadas que en la versión de Astro: el borrador tenía latitud/longitud en dos objetos distintos (`location.geo` con claves `lat`/`lng`, y `seo.geo` con claves `latitude`/`longitude`) — aquí `SITE.seo.geo` es la única fuente, ambos formatos consolidados.
- `og:image:width`/`height` ahora leen `SITE.seo.imageWidth`/`imageHeight` en vez de `1200`/`630` escritos dos veces (mismo tipo de bug que se corrigió en la versión de Astro).
- `imageAlt` sin pasar por prop cae a `SITE.seo.imageAlt` (describe la imagen), no al título de la página — usar el título como alt del OG image es un error de accesibilidad común, el alt debería describir la imagen, no repetir el `<title>`.
- `buildBusinessSchema()` agrega `contactPoint` con `availableLanguage: SITE.seo.languages` — sin esto, ese campo de `SITE.seo` quedaba definido pero sin ningún consumidor real en esta receta (si un campo del patrón `SITE` no lo usa nada, sobra).
- El title template nativo de Next (Paso 1 y 6) reemplaza tener que concatenar `` `${title} — ${SITE.info.name}` `` a mano en cada llamada — menos código, y el layout raíz es el único lugar que decide el formato del sufijo.
- Validar con el [Rich Results Test](https://search.google.com/test/rich-results) de Google y el [debugger de Open Graph de Meta](https://developers.facebook.com/tools/debug/) antes de dar por buena la implementación, igual que con Astro.
- Reemplazar todos los datos de Acme (nombre, URL, coordenadas, redes, keywords, horarios) por los reales antes de publicar.
