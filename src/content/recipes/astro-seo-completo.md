---
title: "SEO completo en Astro — meta tags, JSON-LD, sitemap y manifest"
description: "Paso a paso real: SITE.seo como única fuente de verdad, componente JsonLd, helpers de schema.org, BaseHead reordenado y manifest/robots/sitemap desde cero."
category: seo
stack: astro
order: 1
tags: [astro, seo, json-ld, structured-data, meta-tags, opengraph]
problem: "Tener el SEO técnico completo de un sitio Astro centralizado en un solo lugar (SITE.seo), sin datos sueltos hardcodeados por el código."
technologies: [guides/astro-endpoints]
updatedAt: 2026-08-17
---

## Idea general

Todo lo que cambia de proyecto a proyecto (título, descripción, keywords, imagen social, coordenadas, colores de marca) vive en **un solo objeto: `SITE.seo`**. Ningún componente ni ninguna API route de esta receta escribe un dato de la empresa a mano — todos lo leen de ahí. Copiar este setup a un proyecto nuevo es, en teoría, editar un solo archivo.

Los datos de esta receta son directamente empresa simulada — **Acme**, una firma boutique de software en Bogotá — para reemplazar por los reales al copiar. La forma y profundidad de los campos sí está pensada para ser real, no un placeholder vacío.

Requisitos: proyecto Astro con TypeScript, alias `@/*` configurado —consulta [Alias de imports en TypeScript](/guides/typescript-path-aliases)— y un `SITE` global existente con al menos `info`, `location`, `contact` y `social`. Consulta [SITE: variable global de configuración](/patterns/site-config-global) para esa parte. Aquí se documenta a fondo solo el bloque `seo`.

## Paso 1 — `SITE.seo`: la fuente de verdad

Este es el bloque que se toca en el día a día. Cada campo existe porque algo más adelante en esta receta lo consume — no hay nada "por si acaso".

```ts title="src/config/site.ts"
export interface Service {
  /** Usado en el fragmento del JSON-LD: `${URL}#service-${id}`. */
  id: string
  /** Etiqueta corta arriba del título (categoría o tipo de servicio). */
  eyebrow: string
  /** Título visible del servicio — se mapea a `name` en el JSON-LD. */
  h3: string
  /** Descripción corta — se mapea a `description`. */
  body: string
  /** Ítems del catálogo de ofertas de ese servicio (JSON-LD `OfferCatalog`). */
  items: string[]
}

export interface FaqItem {
  /** La pregunta — se mapea a `name` en el JSON-LD Question. */
  q: string
  /** La respuesta — se mapea a `acceptedAnswer.text`. */
  a: string
}

/** Sale de la opción `site` de astro.config.mjs — un solo lugar define el dominio. */
const SITE_URL = (import.meta.env.SITE ?? "http://localhost:4321").replace(
  /\/$/,
  ""
)

export const SITE = {
  // ...el resto de SITE ya existe en tu proyecto — info, location, contact, social.
  // No se repite aquí porque no es SEO, es identidad de marca (ver el patrón
  // "SITE: variable global de configuración"); el foco de esta receta es solo lo de abajo.

  seo: {
    /** Título por defecto — se usa tal cual en la home, y como sufijo `Página — Acme` en el resto. */
    title: "Acme — Software, marca y comunicación para empresas",
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
      | "summary"
      | "summary_large_image"
      | "app"
      | "player",
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

// SERVICES y FAQ_ITEMS alimentan servicesLd()/faqLd() en el Paso 3 — exports
// hermanos de SITE, en el mismo archivo, porque son listas cortas y globales.
// Si el catálogo crece (slug, precio, imágenes o SEO por servicio), sácalo de
// aquí y llévalo a su propia colección de contenido.

export const SERVICES: Service[] = [
  {
    id: "desarrollo-software",
    eyebrow: "Desarrollo",
    h3: "Desarrollo de Software",
    body: "Aplicaciones a medida, desde el diagnóstico hasta el despliegue.",
    items: ["Aplicaciones web", "Automatización de procesos", "Integraciones"]
  }
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Cuánto tarda un proyecto típico?",
    a: "Entre 4 y 8 semanas según el alcance, con entregas parciales revisables."
  }
]
```

Cada campo tiene un único consumidor claro más abajo en esta receta — si en algún punto un campo de aquí no se termina usando en ningún archivo, es señal de que sobra.

## Paso 2 — `<JsonLd />`: inyectar structured data

Componente genérico y reutilizable — no tiene datos de la empresa adentro, solo sabe serializar lo que le pasen.

```astro title="src/components/seo/JsonLd.astro"
---
interface Props {
  id: string;
  data: object | object[];
}

const { id, data } = Astro.props;

// Se escapa `<` para que el payload nunca pueda cerrar la etiqueta <script> antes de tiempo
// (protección contra inyección si algún dato llegara a incluir texto no confiable).
const json = JSON.stringify(data).replace(/</g, "\\u003c");
---

<script id={id} type="application/ld+json" is:inline set:html={json} />
```

- **`is:inline`** le dice a Astro que no procese ni empaquete este `<script>` — tiene que quedar literal en el HTML final, porque un JSON-LD que termina en un `.js` externo bundleado no lo leen los crawlers de la misma forma confiable.
- **`id`** único por bloque (`ld-organization`, `ld-faq`, etc.) evita colisiones si se renderiza más de uno en la misma página, y sirve como referencia si hay que debuggear cuál JSON-LD está fallando en una herramienta de validación como el [Rich Results Test](https://search.google.com/test/rich-results) de Google.

## Paso 3 — `src/libs/seo.ts`: los helpers de schema.org

Cada función arma un tipo de [schema.org](https://schema.org) distinto. Antes tenían datos sueltos escritos a mano en el archivo (`"Colombia"`, `"Spanish"`, `"$$$"` literales) — aquí todo sale de `SITE`.

```ts title="src/libs/seo.ts"
import { FAQ_ITEMS, SERVICES, SITE } from "@/config/site"

const SITE_URL = SITE.seo.url
const LOGO_URL = new URL(SITE.seo.logo, SITE_URL).href
const OG_URL = new URL(SITE.seo.image, SITE_URL).href

/** areaServed en formato schema.org — un solo lugar que le agrega el "@type". */
const areaServed = () =>
  SITE.seo.areaServed.map((a) => ({ "@type": a.type, name: a.name }))

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
    // Object.values en vez de listar cada red a mano — agregar una red nueva a SITE.social
    // alcanza para que aparezca aquí también, sin tocar este archivo.
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

Cinco schemas, cinco propósitos:

| Función                 | Tipo schema.org              | Para qué                                                                                        |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `organizationLd`        | `Organization`               | Quién es la empresa — la entidad "raíz" de la que cuelgan las demás vía `@id`                   |
| `webSiteLd`             | `WebSite`                    | El sitio como propiedad web, ligado a la Organization como `publisher`                          |
| `professionalServiceLd` | `ProfessionalService`        | Negocio local con dirección/teléfono — lo que Google usa para resultados con precio y ubicación |
| `servicesLd`            | `Service` (uno por servicio) | Cada servicio como oferta individual, con su propio catálogo                                    |
| `faqLd`                 | `FAQPage`                    | Preguntas frecuentes — puede generar el acordeón de rich results directo en el buscador         |

## Paso 4 — `<BaseHead />`: los meta tags, en el orden que importa

Reordenado respecto al original: `<title>` va primero (antes que `charset` y `viewport`), canonical y robots suben porque son señales de indexación de las que depende todo lo demás, y OG/Twitter (que son para compartir en redes, no para indexación) bajan un escalón. Lo puramente cosmético o secundario (geo, theme-color, manifest) queda al final.

```astro title="src/components/seo/BaseHead.astro"
---
import { SITE } from "@/config/site";

interface Props {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  keywords?: readonly string[];
  ogType?: "website" | "article";
  noindex?: boolean;
}

const {
  title,
  description = SITE.seo.description,
  image = SITE.seo.image,
  canonical = new URL(Astro.url.pathname, SITE.seo.url).href,
  keywords = SITE.seo.keywords,
  ogType = SITE.seo.ogType,
  noindex = SITE.seo.noindex,
} = Astro.props;

// Sin título propio: se usa el default tal cual (la home no queda "Acme — ... — Acme").
// Con título propio: se le agrega el sufijo de marca.
const pageTitle = title ? `${title} — ${SITE.info.name}` : SITE.seo.title;

const ogImage = new URL(image, SITE.seo.url).href;
const ogLocale = SITE.seo.locale.replace("-", "_");
const robots = noindex ? "noindex, nofollow" : "index, follow";
const googlebot = noindex
  ? robots
  : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
---

<title>{pageTitle}</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

<!-- <link rel="preload" as="font" href="/fonts/mi-fuente.woff2" type="font/woff2" crossorigin /> -->

<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{SITE.seo.locales.map((locale) => <link rel="alternate" hreflang={locale.hreflang} href={canonical} />)}
<link rel="alternate" hreflang="x-default" href={canonical} />

<meta name="robots" content={robots} />
<meta name="googlebot" content={googlebot} />

<meta property="og:type" content={ogType} />
<meta property="og:site_name" content={SITE.info.name} />
<meta property="og:title" content={pageTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:locale" content={ogLocale} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content={String(SITE.seo.imageWidth)} />
<meta property="og:image:height" content={String(SITE.seo.imageHeight)} />
<meta property="og:image:alt" content={SITE.seo.imageAlt} />

<meta name="twitter:card" content={SITE.seo.twitterCard} />
<meta name="twitter:site" content={SITE.seo.twitterHandle} />
<meta name="twitter:creator" content={SITE.seo.twitterAuthor} />
<meta name="twitter:title" content={pageTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<meta name="keywords" content={keywords.join(", ")} />
<meta name="author" content={SITE.seo.author} />
<meta name="creator" content={SITE.seo.creator} />
<meta name="publisher" content={SITE.seo.publisher} />
<meta name="application-name" content={SITE.info.name} />
<meta name="category" content={SITE.seo.category} />
<meta name="classification" content={SITE.seo.classification} />
<meta name="generator" content={Astro.generator} />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<meta name="format-detection" content="telephone=no, address=no, email=no" />

<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content={SITE.info.name} />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<meta name="geo.region" content={`${SITE.location.countryCode}-${SITE.seo.geo.region}`} />
<meta name="geo.placename" content={SITE.location.city} />
<meta name="geo.position" content={`${SITE.seo.geo.latitude};${SITE.seo.geo.longitude}`} />
<meta name="ICBM" content={`${SITE.seo.geo.latitude}, ${SITE.seo.geo.longitude}`} />

<meta name="color-scheme" content="dark light" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content={SITE.seo.themeColor.light} />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content={SITE.seo.themeColor.dark} />

<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="manifest" href="/manifest.webmanifest" />
```

Tres bugs reales que tenía la versión original, arreglados aquí:

1. **Título duplicado en la home**: `title` tenía como default `SITE.seo.title`, así que la condición `title ? ... : SITE.seo.title` siempre era verdadera — la home terminaba con `"Acme — Software... — Acme"`. Ahora `title` no tiene default; sin prop, se usa `SITE.seo.title` tal cual.
2. **`og:image:width`/`og:image:height` hardcodeados** en `"1200"`/`"630"` aunque `SITE.seo.imageWidth`/`imageHeight` ya existían — si algún día cambia el tamaño de la imagen social, antes había que acordarse de tocar dos lugares. Ahora los meta leen del mismo campo que ya se usaba para generar la imagen.
3. **`hreflang` fijo** (`es-CO` escrito una sola vez a mano) — ahora itera `SITE.seo.locales`, listo para un segundo idioma sin duplicar la etiqueta.

## Paso 5 — `Layout.astro`: ensamblar todo

```astro title="src/layouts/Layout.astro"
---
import BaseHead from "@/components/seo/BaseHead.astro";
import JsonLd from "@/components/seo/JsonLd.astro";
import { SITE } from "@/config/site";
import { faqLd, organizationLd, professionalServiceLd, servicesLd, webSiteLd } from "@/libs/seo";
import "@/styles/globals.css";

interface Props {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  keywords?: readonly string[];
  ogType?: "website" | "article";
  noindex?: boolean;
}

const { title, description, image, canonical, keywords, ogType, noindex } = Astro.props;
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

    <JsonLd id="ld-organization" data={organizationLd()} />
    <JsonLd id="ld-website" data={webSiteLd()} />
    <JsonLd id="ld-business" data={professionalServiceLd()} />
    <JsonLd id="ld-services" data={servicesLd()} />
    <JsonLd id="ld-faq" data={faqLd()} />
  </head>

  <body class="antialiased">
    <slot />
  </body>
</html>
```

El `Layout` no define ningún dato — recibe las mismas props opcionales que `BaseHead` (mismo `interface Props`, a propósito, para que TypeScript avise si se desalinean) y se las reenvía. Cada página elige qué pisar; lo que no pase, cae al default de `SITE.seo`. Bug arreglado aquí: la versión original usaba `SITE.seo.locale` en `<html lang>` sin importar `SITE` — faltaba el `import { SITE } from "@/config/site"`.

## Paso 6 — `manifest.webmanifest`

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

Un archivo `.ts` dentro de `src/pages/` con un `export const GET` es una ruta de API de Astro. Consulta [Endpoints (rutas de API)](/guides/astro-endpoints) para el mecanismo general. Aquí sirve para generar el manifiesto dinámicamente en vez de un JSON estático en `public/`, por lo que también puede leer `SITE`.

## Paso 7 — `robots.txt`

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

`Disallow: /_astro/` bloquea la carpeta de assets compilados (JS/CSS con hash) — no aportan nada a un crawler y no tiene sentido que los rastree.

## Paso 8 — `sitemap.xml`

```ts title="src/pages/sitemap.xml.ts"
import type { APIRoute } from "astro"
import { SITE } from "@/config/site"

/** Una página, una entrada. Agregar rutas aquí conforme crezca el sitio. */
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

`ROUTES` se mantiene manual a propósito: para un sitio con pocas páginas estáticas es más simple y explícito que generarlo automáticamente a partir del sistema de archivos. Si el sitio crece a decenas de páginas dinámicas —blog o catálogo—, conviene generar este arreglo desde una colección de contenido en vez de escribirlo a mano.

## Paso 9 — Caso de uso: una página real

```astro title="src/pages/servicios.astro"
---
import Layout from "@/layouts/Layout.astro";
import { SERVICES, SITE } from "@/config/site";
---

<Layout
  title="Servicios"
  description="Desarrollo de software, identidad de marca y comunicación organizacional para empresas en Bogotá y toda Latinoamérica."
  canonical={new URL("/servicios", SITE.seo.url).href}
>
  <main>
    <h1>Servicios</h1>
    <ul>
      {SERVICES.map((service) => <li>{service.h3}</li>)}
    </ul>
  </main>
</Layout>
```

Esta página pisa `title`, `description` y `canonical` — todo lo demás (`image`, `keywords`, `ogType`, `noindex`) cae a los defaults de `SITE.seo` sin que la página tenga que repetirlos. El resultado: `<title>Servicios — Acme</title>`, meta description propia, OG/Twitter con esa misma descripción, canonical apuntando a `/servicios`, y los 5 bloques de JSON-LD (Organization, WebSite, ProfessionalService, Services, FAQ) inyectados igual que en cualquier otra página — porque viven en el `Layout`, no en cada página individual.

Para una página que no debería indexarse (una de "gracias" después de un formulario, por ejemplo), el mismo patrón con un flag más:

```astro
<Layout title="Gracias" noindex={true}>
```

## Consideraciones

- Todo dato que cambia de empresa a empresa vive en `SITE.seo` — si al copiar este setup a un proyecto nuevo hace falta tocar un archivo que no sea `src/config/site.ts`, es señal de que algo quedó hardcodeado y conviene subirlo a `SITE.seo`.
- `servicesLd()` y `faqLd()` dependen de `SERVICES`/`FAQ_ITEMS`, que no son parte de `SITE` — son contenido de página (qué servicios ofrece, qué preguntas responde), no identidad de marca. Cada proyecto los define donde le haga sentido (una content collection, un archivo de constantes); la forma exacta que `seo.ts` espera está en [el patrón SITE](/patterns/site-config-global#forma-de-los-servicios-y-las-preguntas-frecuentes).
- Validar el resultado con el [Rich Results Test](https://search.google.com/test/rich-results) de Google y con el [debugger de Open Graph de Meta](https://developers.facebook.com/tools/debug/) antes de dar por buena la implementación — un JSON-LD con un typo en el `"@type"` no rompe la build, solo deja de generar el rich result esperado, y eso no se nota sin probarlo.
- `SITE.seo.locales` con un solo idioma ya genera el `hreflang` correcto para un sitio de un idioma — el campo está pensado para escalar, no es sobre-ingeniería para el caso simple.
- Reemplazar **todos** los datos de Acme (nombre, URL, coordenadas, redes, keywords) por los reales antes de publicar — son datos de ejemplo con forma real, no placeholders tipo `"TODO"`.
