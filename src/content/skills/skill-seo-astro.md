---
title: "Skill: SEO en Astro (generar o migrar)"
description: Skill propio con el código completo de la receta empaquetado en references/ — SITE.seo, JsonLd, seo.ts, BaseHead y el ensamblado final, listos para que Claude Code los lea e implemente.
category: skills
stack: ia-skills
order: 20
tags: [ai, skill, seo, astro]
tool: Claude Code
related: [recipes/astro-seo-completo]
updatedAt: 2026-08-17
---

Skill propio, no de skills.sh. A diferencia de un comando directamente sola instrucción, esto es una **carpeta completa** — `SKILL.md` liviano más una carpeta `references/` con el código real (funciones, variables, los 5 schemas, el orden de meta tags) sacado directo de [SEO completo en Astro](/recipes/astro-seo-completo). Claude Code lee cada archivo de `references/` solo cuando lo necesita (progressive disclosure) — no es un resumen, es el código funcionando.

Este sitio no tiene descarga en `.zip` — copias cada bloque de código de abajo al archivo indicado en el título, respetando la carpeta `references/`. El resultado en disco es idéntico a lo que sería descargar una carpeta.

## Estructura final

```text
.claude/skills/astro-seo/
├── SKILL.md
└── references/
    ├── config.md        # SITE.seo completo
    ├── components.md     # JsonLd.astro + src/lib/seo.ts
    ├── head.md            # BaseHead.astro + bugs a evitar
    └── assembly.md         # Layout.astro + rutas API + página de ejemplo
```

## `SKILL.md`

```md title=".claude/skills/astro-seo/SKILL.md"
---
description: Set up or migrate a complete SEO system in an Astro project (SITE.seo config, JSON-LD, BaseHead, sitemap, robots, manifest) following a consistent, documented pattern
argument-hint: [migrate|generate] (optional — auto-detected if omitted)
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npm run build:*), Bash(pnpm build:*)
---

You're implementing SEO for an Astro project following a specific, opinionated pattern — not inventing your own structure. This skill bundles the full working code as reference files inside `references/`. Read the one you need before writing anything; don't guess field names or function shapes.

## 1. Detect current state

Search the project for an existing site-wide config object (commonly `SITE`, `siteInfo`, or similar, in `src/lib/` or `src/config/`), an existing head/meta component, and existing `robots.txt`/`sitemap.xml` routes.

- Nothing found, or clearly incomplete → follow the **Generate** flow.
- Something exists, scattered or inconsistent → follow the **Migrate** flow.

## 2. References

- `references/config.md` — the complete `SITE.seo` object, every field explained inline.
- `references/components.md` — `JsonLd.astro` and the full `src/lib/seo.ts` (all 5 schema.org builder functions: `organizationLd`, `webSiteLd`, `professionalServiceLd`, `servicesLd`, `faqLd`).
- `references/head.md` — the full `BaseHead.astro`, the tag ordering rationale, and 3 real bugs to not reintroduce.
- `references/assembly.md` — `Layout.astro`, the 3 API routes (`manifest.webmanifest.ts`, `robots.txt.ts`, `sitemap.xml.ts`), and a full working example page.

## 3. Generate flow (no existing SEO setup)

1. Ask the user for their real company data if it's not already evident from the codebase (name, description, canonical URL, city/country, social links, brand colors). Don't block on missing pieces — use clearly-marked placeholders for anything not provided (`"TODO: replace"`), never invent business details silently.
2. Create `SITE.seo` following `references/config.md` exactly, with the user's real data instead of the example values.
3. Create `JsonLd.astro` and `src/lib/seo.ts` following `references/components.md` — drop `servicesLd`/`faqLd` if the project has no services/FAQ content to back them.
4. Create `BaseHead.astro` following `references/head.md` — keep the tag order as-is, it's deliberate.
5. Create `Layout.astro` and the 3 API routes following `references/assembly.md`.
6. Update at least the home page to use the new layout.
7. Run the project's build to confirm nothing broke.

## 4. Migrate flow (partial or inconsistent existing setup)

1. Read whatever SEO-related code already exists (config object, meta tags, JSON-LD if any).
2. Map every real value found (company name, description, images, socials, coordinates) onto the target `SITE.seo` shape from `references/config.md` — never discard real data in favor of a placeholder.
3. While migrating, fix these common issues instead of carrying them forward as-is (all three happened in the original draft this pattern is based on — see `references/head.md` for the full explanation of each):
   - Data written directly in components/functions instead of read from config
   - Duplicate sources of truth for the same value (e.g. coordinates or a locale string defined in two places)
   - `og:image:width`/`height` hardcoded instead of reusing the image size already stored somewhere
   - A title that gets the brand suffix appended twice on the home page
   - Missing `hreflang`/canonical, or an `<html lang>` not wired to the actual locale
4. Rebuild the head component with the tag ordering from `references/head.md`.
5. Add whatever's entirely missing (JSON-LD component, robots, sitemap, manifest — see `references/assembly.md`) without duplicating what's already correct.
6. Run the project's build to confirm nothing broke, and summarize exactly what changed and why.

## 5. Always

- Don't publish or commit anything — this skill only edits the working tree.
- End with a short summary: what was created or changed, and which fields in `SITE.seo` still hold placeholder data the user needs to replace with real information.
```

## `references/config.md`

```md title=".claude/skills/astro-seo/references/config.md"
# SITE.seo — target shape

The single source of truth for every SEO-related value in the project. Nothing SEO-related should be written directly in a component or function — it all reads from here.

​```ts title="src/lib/site-info.ts"
export const SITE = {
  // ...the rest of SITE already exists in the project — name, legalName, slogan,
  // founded, location, contact, social, founders. Not repeated here because it's
  // brand identity, not SEO — the target of this skill is only what's below.

  seo: {
    /** Default title — used as-is on the home page, and as the " — {name}" suffix elsewhere. */
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
      "software boutique",
    ],
    /** Languages the business operates in — feeds `availableLanguage` in the Organization schema. */
    languages: ["Spanish", "English"],

    /** Canonical site URL, no trailing slash. */
    url: "https://acme.studio",
    /** BCP-47 with hyphen (es-CO) — used for hreflang, <html lang>, and schema.org inLanguage as-is. */
    locale: "es-CO",
    /**
     * Published locales, to generate <link hreflang> without repeating code.
     * One entry today; adding a second object here is enough for a real multi-language site.
     */
    locales: [{ hreflang: "es-CO", default: true }] as const,

    image: "/opengraph-image.png",
    imageAlt: "Logo de Acme sobre fondo blanco",
    imageWidth: 1200,
    imageHeight: 630,
    /** Brand logo for the Organization schema — distinct from the social share image above. */
    logo: "/brand/logo.png",

    ogType: "website" as "website" | "article",
    twitterHandle: "@acmestudio",
    noindex: false,

    /** meta name="category" / "classification" — industry classification, rarely changes. */
    category: "technology",
    classification: "Business",
    /** priceRange for the ProfessionalService schema: $, $$, $$$, or $$$$. */
    priceRange: "$$$",

    /** areaServed for Organization/ProfessionalService — generic objects, the "@type" is added in src/lib/seo.ts. */
    areaServed: [
      { type: "Country", name: "Colombia" },
      { type: "Place", name: "Latin America" },
    ],

    /** Local geo-targeting (meta geo.*/ICBM) — city-level coordinates, not an exact street address. */
    geo: {
      /** ISO 3166-2 code of the region/department (Bogotá D.C. → "DC"). */
      region: "DC",
      latitude: 4.60971,
      longitude: -74.08175,
    },

    /** Same colors as theme-color meta and the web manifest — one place for both. */
    themeColor: { light: "#FAFAFA", dark: "#0A0A0F" },
    /** Web manifest categories (fixed PWA taxonomy: business, design, productivity, etc.). */
    manifestCategories: ["business", "design", "productivity"],
  },
} as const;
​```

Every field has exactly one consumer somewhere in `references/components.md`, `references/head.md`, or `references/assembly.md` — if a field here ends up unused, it doesn't belong.
```

## `references/components.md`

```md title=".claude/skills/astro-seo/references/components.md"
# JsonLd.astro + src/lib/seo.ts

## JsonLd.astro

Generic, reusable — no company data inside, it only serializes whatever it's given.

​```astro title="src/components/seo/JsonLd.astro"
---
interface Props {
  id: string;
  data: object | object[];
}

const { id, data } = Astro.props;

// `<` is escaped so the payload can never close the <script> tag early
// (protects against injection if a value ever contains untrusted text).
const json = JSON.stringify(data).replace(/</g, "\\u003c");
---

<script id={id} type="application/ld+json" is:inline set:html={json} />
​```

`is:inline` tells Astro not to process or bundle this `<script>` — it has to stay literal in the final HTML, because a JSON-LD block that ends up in an external bundled `.js` file isn't read as reliably by crawlers. `id` should be unique per block (`ld-organization`, `ld-faq`, etc.) to avoid collisions and to help debugging in a validator like Google's Rich Results Test.

## src/lib/seo.ts

Five functions, one per schema.org type. Every value comes from `SITE` — nothing written inline.

​```ts title="src/lib/seo.ts"
import { SITE } from "@/lib/site-info";
// Example — in the real project these come from the project's own content modules,
// not from SITE (the services list and FAQ are page content, not brand identity).
import { FAQ_ITEMS } from "@/content/faq";
import { SERVICES } from "@/content/services";

const URL = SITE.seo.url;
const LOGO_URL = new URL(SITE.seo.logo, URL).href;
const OG_URL = new URL(SITE.seo.image, URL).href;

/** areaServed in schema.org shape — one place that adds the "@type". */
const areaServed = () => SITE.seo.areaServed.map((a) => ({ "@type": a.type, name: a.name }));

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${URL}#organization`,
    name: SITE.info.name,
    legalName: SITE.info.legalName,
    url: URL,
    logo: LOGO_URL,
    image: OG_URL,
    description: SITE.seo.description,
    slogan: SITE.info.slogan,
    foundingDate: String(SITE.info.founded),
    founder: SITE.info.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressCountry: SITE.location.countryCode,
    },
    areaServed: areaServed(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE.contact.email,
        telephone: SITE.contact.whatsapp,
        availableLanguage: SITE.seo.languages,
        areaServed: [SITE.location.countryCode, "LATAM"],
      },
    ],
    // Object.values instead of listing every network by hand — adding a new one to
    // SITE.social is enough for it to show up here too, without touching this file.
    sameAs: Object.values(SITE.social),
    knowsAbout: SITE.seo.keywords,
  } as const;
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${URL}#website`,
    url: URL,
    name: SITE.info.name,
    description: SITE.seo.description,
    inLanguage: SITE.seo.locale,
    publisher: { "@id": `${URL}#organization` },
  } as const;
}

export function professionalServiceLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${URL}#business`,
    name: SITE.info.name,
    image: LOGO_URL,
    url: URL,
    telephone: SITE.contact.whatsapp,
    email: SITE.contact.email,
    priceRange: SITE.seo.priceRange,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressCountry: SITE.location.countryCode,
    },
    areaServed: areaServed(),
    parentOrganization: { "@id": `${URL}#organization` },
  } as const;
}

export function servicesLd() {
  return SERVICES.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service-${s.id}`,
    name: s.h3,
    serviceType: s.eyebrow,
    description: s.body,
    provider: { "@id": `${URL}#organization` },
    areaServed: areaServed(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.eyebrow,
      itemListElement: s.items.map((item, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  }));
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${URL}#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } as const;
}
​```

| Function | schema.org type | For |
| --- | --- | --- |
| `organizationLd` | `Organization` | Who the company is — the root entity the others hang off of via `@id` |
| `webSiteLd` | `WebSite` | The site as a web property, tied to the Organization as `publisher` |
| `professionalServiceLd` | `ProfessionalService` | Local business with address/phone — what Google uses for price/location rich results |
| `servicesLd` | `Service` (one per service) | Each service as an individual offering, with its own catalog |
| `faqLd` | `FAQPage` | FAQ — can generate the accordion rich result directly in search |
```

## `references/head.md`

```md title=".claude/skills/astro-seo/references/head.md"
# BaseHead.astro

Tag order matters: charset → viewport → title → description → canonical + hreflang → robots → Open Graph → Twitter → secondary meta → geo/theme-color/icons last. Canonical and robots are indexing signals everything else depends on, so they come before OG/Twitter (which are only for social sharing).

​```astro title="src/components/seo/BaseHead.astro"
---
import { SITE } from "@/lib/site-info";

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

// No custom title: use the default as-is (home page doesn't end up "Acme — ... — Acme").
// Custom title: append the brand suffix.
const pageTitle = title ? `${title} — ${SITE.info.name}` : SITE.seo.title;

const ogImage = new URL(image, SITE.seo.url).href;
const ogLocale = SITE.seo.locale.replace("-", "_");
const authors = SITE.info.founders.map((f) => f.name).join(", ");
const robots = noindex ? "noindex, nofollow" : "index, follow";
const googlebot = noindex
  ? robots
  : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
<title>{pageTitle}</title>
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

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content={SITE.seo.twitterHandle} />
<meta name="twitter:creator" content={SITE.seo.twitterHandle} />
<meta name="twitter:title" content={pageTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<meta name="keywords" content={keywords.join(", ")} />
<meta name="author" content={authors} />
<meta name="creator" content={SITE.info.legalName} />
<meta name="publisher" content={SITE.info.legalName} />
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
​```

## Three bugs to not reintroduce when migrating an existing project

1. **Duplicated title on the home page** — if `title` defaults to `SITE.seo.title`, the condition `title ? ... : SITE.seo.title` is always true, so the home ends up `"Acme — Software... — Acme"`. `title` must have **no default** for the ternary above to work.
2. **`og:image:width`/`og:image:height` hardcoded** as `"1200"`/`"630"` even when `SITE.seo.imageWidth`/`imageHeight` already exist — always read from those fields, never repeat the numbers.
3. **Fixed `hreflang`** written once by hand instead of iterating `SITE.seo.locales` — breaks the moment a second language is added.
```

## `references/assembly.md`

```md title=".claude/skills/astro-seo/references/assembly.md"
# Layout, API routes, and a working example

## Layout.astro

​```astro title="src/layouts/Layout.astro"
---
import BaseHead from "@/components/seo/BaseHead.astro";
import JsonLd from "@/components/seo/JsonLd.astro";
import { SITE } from "@/lib/site-info";
import { faqLd, organizationLd, professionalServiceLd, servicesLd, webSiteLd } from "@/lib/seo";
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
​```

`Layout` doesn't define any data itself — same `interface Props` as `BaseHead` on purpose (so TypeScript flags it if they drift apart), and just forwards. **Bug this fixes:** the original draft used `SITE.seo.locale` in `<html lang>` without importing `SITE` at all.

## manifest.webmanifest.ts

​```ts title="src/pages/manifest.webmanifest.ts"
import type { APIRoute } from "astro";
import { SITE } from "@/lib/site-info";

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
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
};
​```

## robots.txt.ts

​```ts title="src/pages/robots.txt.ts"
import type { APIRoute } from "astro";
import { SITE } from "@/lib/site-info";

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /_astro/",
    "",
    `Sitemap: ${SITE.seo.url}/sitemap.xml`,
    `Host: ${SITE.seo.url}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
​```

## sitemap.xml.ts

​```ts title="src/pages/sitemap.xml.ts"
import type { APIRoute } from "astro";
import { SITE } from "@/lib/site-info";

/** One page, one entry. Add routes here as the site grows. */
const ROUTES = [{ path: "/", changeFrequency: "monthly", priority: "1.0" }];

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString();

  const urls = ROUTES.map(
    (route) => `  <url>
    <loc>${SITE.seo.url}${route.path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  ).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
​```

`ROUTES` stays manual on purpose — for a site with few static pages that's simpler and more explicit than generating it from the filesystem. Only worth automating (reading slugs from a database or content collection) once the site has real dynamic content.

## Example page

​```astro title="src/pages/servicios.astro"
---
import Layout from "@/layouts/Layout.astro";
import { SITE } from "@/lib/site-info";
---

<Layout
  title="Servicios"
  description="Desarrollo de software, identidad de marca y comunicación organizacional para empresas en Bogotá y toda Latinoamérica."
  canonical={new URL("/servicios", SITE.seo.url).href}
>
  <main>
    <h1>Servicios</h1>
    <ul>
      {SITE.services.map((service) => <li>{service}</li>)}
    </ul>
  </main>
</Layout>
​```

Overrides `title`, `description`, and `canonical` — everything else (`image`, `keywords`, `ogType`, `noindex`) falls back to `SITE.seo` defaults without the page repeating them. For a page that shouldn't be indexed (a "thank you" page after a form, for example), same pattern plus one flag: `<Layout title="Gracias" noindex={true}>`.
```

## Consideraciones

- El `SKILL.md` no repite el código de los `references/` — le dice a Claude exactamente cuál leer para cada archivo que tiene que crear. Eso es lo que hace que sea liviano en contexto y completo en contenido al mismo tiempo.
- Los 4 archivos de `references/` son, campo por campo y línea por línea, el mismo código de [SEO completo en Astro](/recipes/astro-seo-completo) — la receta es la versión para leer y entender; esta skill es la misma información empaquetada para que un agente la ejecute.
- Si tu herramienta no soporta la carpeta `references/` (algunas integraciones de terceros solo leen un archivo), pegar los 4 bloques de código uno atrás del otro dentro de un único `SKILL.md` funciona igual — se pierde el ahorro de contexto de la carga diferida, no la información.
