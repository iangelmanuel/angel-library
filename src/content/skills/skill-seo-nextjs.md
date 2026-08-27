---
title: "Skill: SEO en Next.js (generar o migrar)"
description: Skill propio con el código completo de la receta empaquetado en references/ — SITE.seo, buildMetadata(), los builders de JSON-LD, robots.ts/sitemap.ts y el layout raíz, listos para que Claude Code los lea e implemente.
category: skills
stack: ia-skills
order: 21
tags: [ai, skill, seo, nextjs]
tool: Claude Code
related: [recipes/nextjs-seo-completo]
updatedAt: 2026-08-17
---

Mismo criterio que el [skill de SEO para Astro](/skills/skill-seo-astro): carpeta completa, no un prompt directamente línea. `SKILL.md` liviano más `references/` con el código real de [SEO completo en Next.js](/recipes/nextjs-seo-completo) — `buildMetadata()`, los 5 builders de JSON-LD, el title template nativo, todo.

Este sitio no tiene descarga en `.zip` — copias cada bloque de código de abajo al archivo indicado en el título, respetando la carpeta `references/`. El resultado en disco es idéntico a lo que sería descargar una carpeta.

## Estructura final

```text
.claude/skills/nextjs-seo/
├── SKILL.md
└── references/
    ├── config.md        # SITE.seo completo
    ├── libs.md            # src/libs/seo.ts — buildMetadata + los 3 builders de JSON-LD
    ├── components.md       # src/components/JsonLd.tsx
    └── assembly.md          # app/robots.ts, app/sitemap.ts, app/layout.tsx, páginas de ejemplo
```

## `SKILL.md`

```md title=".claude/skills/nextjs-seo/SKILL.md"
---
description: Set up or migrate a complete SEO system in a Next.js (App Router) project (SITE.seo config, buildMetadata, JSON-LD, robots.ts, sitemap.ts) following a consistent, documented pattern
argument-hint: [migrate|generate] (optional — auto-detected if omitted)
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npm run build:*), Bash(pnpm build:*)
---

You're implementing SEO for a Next.js (App Router) project following a specific, opinionated pattern — not inventing your own structure. This skill bundles the full working code as reference files inside `references/`. Read the one you need before writing anything; don't guess field names or function shapes.

## 1. Detect current state

Search the project for an existing site-wide config object (commonly `SITE`, in `src/config/`), an existing `buildMetadata`-style helper or ad-hoc `metadata` exports scattered across pages, and existing `app/robots.ts`/`app/sitemap.ts`.

- Nothing found, or clearly incomplete → follow the **Generate** flow.
- Something exists, scattered or inconsistent → follow the **Migrate** flow.

## 2. References

- `references/config.md` — the complete `SITE.seo` object, every field explained inline.
- `references/libs.md` — the full `src/libs/seo.ts`: `buildMetadata()`, `buildBusinessSchema()`, `buildWebsiteSchema()`, `buildBreadcrumbSchema()`, plus optional `buildProductSchema()`/`buildArticleSchema()` for catalogs/blogs.
- `references/components.md` — `src/components/JsonLd.tsx`.
- `references/assembly.md` — `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx` (root layout, declares the title template once), and working example pages (static + dynamic).

## 3. Generate flow (no existing SEO setup)

1. Ask the user for their real company data if it's not already evident from the codebase (name, description, canonical URL, city/country, social links, brand colors). Don't block on missing pieces — use clearly-marked placeholders for anything not provided (`"TODO: replace"`), never invent business details silently.
2. Create `SITE.seo` following `references/config.md` exactly, with the user's real data instead of the example values.
3. Create `src/libs/seo.ts` and `src/components/JsonLd.tsx` following `references/libs.md` and `references/components.md`.
4. Create `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts` following `references/assembly.md`.
5. Update `app/layout.tsx` to declare the title template (`title: { default, template }`) and inject the global JSON-LD — do not build the title suffix by hand anywhere else.
6. Update at least the home page (and one dynamic route if the project has one) to use `buildMetadata`/`generateMetadata`.
7. Run the project's build to confirm nothing broke.

## 4. Migrate flow (partial or inconsistent existing setup)

1. Read whatever SEO-related code already exists (config object, per-page `metadata` exports, any JSON-LD already rendered somewhere).
2. Map every real value found (company name, description, images, socials, coordinates) onto the target `SITE.seo` shape from `references/config.md` — never discard real data in favor of a placeholder.
3. While migrating, fix these common issues instead of carrying them forward as-is (all of these happened in the original draft this pattern is based on — see `references/libs.md` for the full explanation of each):
   - Data written directly inside metadata objects/schema builders instead of read from config
   - Duplicate sources of truth for the same value (e.g. coordinates or currency defined in two different sub-objects)
   - `openGraph.images`/`twitter.images` width/height hardcoded instead of reusing the image size already stored somewhere
   - Title suffix built by hand in every page instead of Next's native `title: { default, template }` mechanism
   - A schema builder referencing a field on the wrong object — double check every `SITE.x.y` path actually exists in `references/config.md` before assuming it does
4. Consolidate scattered per-page metadata into calls to a single `buildMetadata()` helper.
5. Add whatever's entirely missing (JSON-LD component, `robots.ts`, `sitemap.ts`, global schemas in the root layout — see `references/assembly.md`) without duplicating what's already correct.
6. Run the project's build to confirm nothing broke, and summarize exactly what changed and why.

## 5. Always

- Don't publish or commit anything — this skill only edits the working tree.
- End with a short summary: what was created or changed, and which fields in `SITE.seo` still hold placeholder data the user needs to replace with real information.
```

## `references/config.md`

```md title=".claude/skills/nextjs-seo/references/config.md"
# SITE.seo — target shape

​```ts title="src/config/site.ts"
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SITE = {
  // ...the rest of SITE already exists in the project — company, location, contact,
  // whatsapp, businessHours, social, legal. Not repeated here because it's brand
  // identity and contact data, not SEO — the target of this skill is only what's below.

  seo: {
    /** Default title — used as-is on the home page, and as the " — {name}" suffix elsewhere. */
    title: "Acme — Software, marca y comunicación para empresas",
    /** Next applies this template to any child page that only sets its own `title`. */
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

    /** Site authorship — feeds the author/creator/publisher metas. This used to be derived
     *  from `info.founders`; it's now an explicit SEO field, since the content author
     *  doesn't always match the company's founder list. */
    author: "Jane Doe",
    creator: "Jane Doe",
    publisher: "Acme Studio",

    /** Canonical site URL, no trailing slash. */
    url: SITE_URL,
    /** BCP-47 with hyphen (es-CO) — used for hreflang, <html lang>, and schema.org inLanguage as-is. */
    locale: "es-CO",
    lang: "es",
    currency: "COP",
    /** Broad region for JSON-LD's ContactPoint — separate from `geo.region`, which is the department/state code. */
    contactRegion: "LATAM",
    /** Languages the business operates in — feeds `availableLanguage` in the Organization schema. */
    languages: ["Spanish", "English"],
    /**
     * Published locales, to generate <link hreflang> without repeating code.
     * One entry today; adding a second object here is enough for a real multi-language site.
     */
    locales: [{ hreflang: "es-CO", default: true }] as const,
    /** ISO 3166-2 code of the region/department (Bogotá D.C. → "DC") plus city-level coordinates. */
    geo: { region: "DC", latitude: 4.60971, longitude: -74.08175 },

    image: "/opengraph-image.png",
    imageAlt: "Logo de Acme sobre fondo blanco",
    imageWidth: 1200,
    imageHeight: 630,
    /** Brand logo for the Organization schema — distinct from the social share image above. */
    logo: "/brand/logo.png",

    ogType: "website" as "website" | "article",
    /** Content author's account (twitter:creator), separate from the site account (twitter:site). */
    twitterAuthor: "@acmestudio" as string | null,
    twitterHandle: "@acmestudio" as string | null,
    twitterCard: "summary_large_image" as
      | "summary"
      | "summary_large_image"
      | "app"
      | "player",
    noindex: false,

    /** meta name="category" / "classification" — industry classification, rarely changes. */
    category: "technology",
    classification: "Business",
    /** priceRange for the ProfessionalService schema: $, $$, $$$, or $$$$. */
    priceRange: "$$",

    /** Same colors as theme-color meta and the web manifest — one place for both. */
    themeColor: { light: "#FFFFFF", dark: "#000000" },
    /** Web manifest categories (fixed PWA taxonomy: business, design, productivity, etc.). */
    manifestCategories: ["business", "design", "productivity"],

    /** areaServed for Organization/ProfessionalService — generic objects, the "@type" is added in src/libs/seo.ts. */
    areaServed: [
      { type: "Country", name: "Colombia" },
      { type: "Place", name: "Latin America" },
    ],
  },
} as const;
​```

Two decisions worth keeping when generating or migrating:

- **`titleTemplate` instead of concatenating the string by hand** — declared once in the root layout (`references/assembly.md`), any child page that only sets `title: "Servicios"` comes out as `"Servicios | Acme"` automatically.
- **One single source of coordinates** — `SITE.seo.geo` is the only place with latitude/longitude. Don't let a second copy exist anywhere else (e.g. under `location`) — that's the exact bug this pattern fixes.
```

## `references/libs.md`

```md title=".claude/skills/nextjs-seo/references/libs.md"
# src/libs/seo.ts

​```ts title="src/libs/seo.ts"
import type { Metadata } from "next";
import { SITE } from "@/config/site";

export interface SeoOptions {
  /** Short page title — Next applies the root layout's template automatically. */
  title?: string;
  /** Already-built title, bypassing the template — for pages that shouldn't carry the brand suffix. */
  fullTitle?: string;
  description?: string;
  /** Relative path — "/servicios", "/blog/mi-post". */
  path?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: "website" | "article";
  publishedTime?: string | Date;
  modifiedTime?: string | Date;
  authors?: string[];
  section?: string;
  tags?: string[];
  /** Extra keywords — added to SITE.seo.keywords, not a replacement. */
  keywords?: string[];
}

/** Converts a relative path to an absolute URL; returns it unchanged if already absolute. */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : new URL(path, `${SITE.seo.url}/`).href;
}

const toIso = (value?: string | Date): string | undefined => (value ? new Date(value).toISOString() : undefined);

/**
 * Builds the full Next `Metadata` object for a page: title (via the native
 * template), description, Open Graph, Twitter, robots, canonical, and hreflang.
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
    keywords = [],
  } = options;

  const cleanPath = (path.split("?")[0] ?? "/").replace(/\/+$/, "") || "/";
  const blockIndexing = noindex || SITE.seo.noindex;
  const imageUrl = absoluteUrl(image);
  const resolvedTitle = fullTitle ?? title ?? SITE.seo.title;
  const resolvedAlt = imageAlt ?? SITE.seo.imageAlt;

  return {
    // No `fullTitle`: a plain string — Next applies the root layout's `template` alone.
    // With `fullTitle`: `absolute` skips the template on purpose (a campaign landing
    // page that already carries its own full branding, for example).
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
          SITE.seo.locales.map((l) => [l.hreflang, cleanPath]),
        ),
        "x-default": cleanPath,
      },
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
            "max-video-preview": -1,
          },
        },

    openGraph: {
      type,
      siteName: SITE.info.name,
      title: resolvedTitle,
      description,
      url: cleanPath,
      locale: SITE.seo.locale.replace("-", "_"),
      images: [{ url: imageUrl, width: SITE.seo.imageWidth, height: SITE.seo.imageHeight, alt: resolvedAlt }],
      ...(type === "article" ? { publishedTime: toIso(publishedTime), modifiedTime: toIso(modifiedTime), authors, section, tags } : {}),
    },

    twitter: {
      card: SITE.seo.twitterCard,
      title: resolvedTitle,
      description,
      images: [{ url: imageUrl, alt: resolvedAlt }],
      ...(SITE.seo.twitterHandle ? { site: SITE.seo.twitterHandle, creator: SITE.seo.twitterAuthor ?? SITE.seo.twitterHandle } : {}),
    },

    other: {
      "geo.region": `CO-${SITE.seo.geo.region}`,
      "geo.placename": SITE.location.city,
      "geo.position": `${SITE.seo.geo.latitude};${SITE.seo.geo.longitude}`,
      ICBM: `${SITE.seo.geo.latitude}, ${SITE.seo.geo.longitude}`,
    },
  };
}

/** Maps Spanish day names to English — schema.org expects `dayOfWeek` in English. */
const dayNameEn: Record<string, string> = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
  Domingo: "Sunday",
};

/** Organization/ProfessionalService JSON-LD — contact, address, hours, social. Rendered once, in the root layout. */
export function buildBusinessSchema(): Record<string, unknown> {
  const openingHours = SITE.businessHours
    .filter((d) => d.open !== null && d.close !== null)
    .map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayNameEn[d.day] ?? d.day}`,
      opens: d.open,
      closes: d.close,
    }));

  const sameAs = Object.values(SITE.social).filter((url): url is string => typeof url === "string" && url.length > 0);

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
      jobTitle: f.role,
    })),
    priceRange: SITE.seo.priceRange,
    currenciesAccepted: SITE.seo.currency,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.location.address,
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.state,
      postalCode: SITE.location.postalCode,
      addressCountry: SITE.location.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.seo.geo.latitude,
      longitude: SITE.seo.geo.longitude,
    },
    areaServed: SITE.seo.areaServed.map((a) => ({ "@type": a.type, name: a.name })),
    openingHoursSpecification: openingHours,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE.contact.email,
        telephone: SITE.contact.whatsapp(),
        availableLanguage: SITE.seo.languages,
        areaServed: [SITE.location.countryCode, SITE.seo.contactRegion],
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** WebSite JSON-LD — ties the site to the Organization via `@id`. */
export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.seo.url}/#website`,
    url: SITE.seo.url,
    name: SITE.info.name,
    inLanguage: SITE.seo.locale,
    publisher: { "@id": `${SITE.seo.url}/#organization` },
  };
}

/** BreadcrumbList JSON-LD — improves how the navigation path shows up in Google results. */
export function buildBreadcrumbSchema(crumbs: { label: string; href: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

// ── Optional: only add these two if the project actually has a catalog or a blog ──

export function buildProductSchema(product: {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  image: string;
  availability: "instock" | "outofstock";
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
      availability: product.availability === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE.seo.url}/#organization` },
    },
  };
}

export function buildArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
  author: string;
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
      logo: { "@type": "ImageObject", url: absoluteUrl(SITE.seo.logo) },
    },
  };
}
​```

## Bugs to not reintroduce when migrating

- `buildProductSchema` comparing a bare `availability` (undefined in scope) instead of `product.availability` — never compiled in the original draft this is based on.
- Coordinates duplicated across two objects with different key names (`lat`/`lng` in one, `latitude`/`longitude` in another) — `SITE.seo.geo` must be the only source.
- `openGraph.images`/`twitter.images` width/height hardcoded instead of `SITE.seo.imageWidth`/`imageHeight`.
- Title suffix built by hand instead of using Next's native `title: { default, template }`.
- `imageAlt` falling back to the page title instead of `SITE.seo.imageAlt` when no per-page alt is given — the alt text should describe the image, not repeat the title.
- `SITE.seo.languages` defined but never consumed anywhere — always wire it into `buildBusinessSchema()`'s `contactPoint.availableLanguage`, otherwise it's a field with no real consumer.
- `app/manifest.ts` missing while the root layout already links to `/manifest.webmanifest` — that link 404s until the file exists.
```

## `references/components.md`

```md title=".claude/skills/nextjs-seo/references/components.md"
# src/components/JsonLd.tsx

​```tsx title="src/components/JsonLd.tsx"
type Schema = Record<string, unknown>;

/**
 * Injects one or more JSON-LD blocks into the page.
 *
 * `dangerouslySetInnerHTML` instead of rendering the object: structured data has
 * to arrive as-is in the initial HTML (crawlers don't execute JS to read it), and
 * manually escaping `<` prevents an untrusted value from closing the `<script>`
 * tag early.
 */
export function JsonLd({ schema }: { schema: Schema | Schema[] }) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((item, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}
​```

Accepts a single schema or an array — the root layout sends `Organization` + `WebSite` together in one `<JsonLd>`, and a blog page can send its own `BreadcrumbList` separately.
```

## `references/assembly.md`

```md title=".claude/skills/nextjs-seo/references/assembly.md"
# robots.ts, sitemap.ts, root layout, example pages

## app/manifest.ts

​```ts title="app/manifest.ts"
import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

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
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
​```

File convention: `app/manifest.ts` with `export default` generates `/manifest.webmanifest` on its own, same mechanism as `robots.ts`/`sitemap.ts` below. This is the file the root layout already links via `<link rel="manifest" href="/manifest.webmanifest" />`.

## app/robots.ts

​```ts title="app/robots.ts"
import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/** Generates /robots.txt. With SITE.seo.noindex on (staging/preview), blocks the entire site. */
export default function robots(): MetadataRoute.Robots {
  if (SITE.seo.noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    sitemap: `${SITE.seo.url}/sitemap.xml`,
    host: SITE.seo.url,
  };
}
​```

## app/sitemap.ts

​```ts title="app/sitemap.ts"
import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/** Static routes. Add here as the site grows. */
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/servicios", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.seo.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamic routes (blog, catalog) — pull slugs from the project's real data source.
  // const blogSlugs = await getPublishedBlogSlugs()
  // const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
  //   url: `${SITE.seo.url}/blog/${slug}`,
  //   lastModified: now,
  //   changeFrequency: "weekly",
  //   priority: 0.7,
  // }))

  return staticRoutes;
}
​```

## app/layout.tsx — root layout

​```tsx title="app/layout.tsx"
import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { buildBusinessSchema, buildWebsiteSchema } from "@/libs/seo";
import { JsonLd } from "@/components/JsonLd";

// The title template is declared ONCE, here — any page that only exports
// `title: "Servicios"` (via buildMetadata) comes out as "Servicios | Acme" automatically.
export const metadata: Metadata = {
  title: { default: SITE.seo.title, template: SITE.seo.titleTemplate },
  description: SITE.seo.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.seo.lang}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <JsonLd schema={[buildBusinessSchema(), buildWebsiteSchema()]} />
      </head>
      <body>{children}</body>
    </html>
  );
}
​```

`Organization` and `WebSite` are injected exactly once, here — never per page. schema.org expects a single Organization per site, and `@id` is what lets every other schema (breadcrumbs, products, articles) reference it without repeating it.

## Example pages

Static page, short title Next merges with the root layout's template on its own:

​```tsx title="app/servicios/page.tsx"
import { buildMetadata } from "@/libs/seo";

export const metadata = buildMetadata({
  title: "Servicios",
  description: "Servicios digitales: desarrollo web, software a medida, identidad de marca y comunicación.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <main>
      <h1>Nuestros servicios</h1>
      {/* page content — the real services list lives in the project itself, not in SITE.seo */}
    </main>
  );
}
​```

Dynamic page, metadata generated from real data plus its own `BreadcrumbList`:

​```tsx title="app/blog/[slug]/page.tsx"
import { notFound } from "next/navigation";
import { buildMetadata, buildBreadcrumbSchema } from "@/libs/seo";
import { JsonLd } from "@/components/JsonLd";
import { getBlogPostBySlug } from "@/libs/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return buildMetadata();

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
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { label: "Inicio", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${slug}` },
        ])}
      />
      <article>
        <h1>{post.title}</h1>
      </article>
    </>
  );
}
​```
```

## Consideraciones

- El `SKILL.md` no repite el código de los `references/` — solo dice cuál leer para cada archivo que hay que crear. Eso es lo que lo mantiene liviano en contexto y completo en contenido a la vez.
- Los 4 archivos de `references/` son el mismo código de [SEO completo en Next.js](/recipes/nextjs-seo-completo), campo por campo — la receta es la versión para leer y entender; esta skill es la misma información empaquetada para que un agente la ejecute.
- Si tu herramienta no soporta la carpeta `references/`, pegar los 4 bloques uno atrás del otro dentro de un único `SKILL.md` funciona igual — se pierde el ahorro de contexto de la carga diferida, no la información.
