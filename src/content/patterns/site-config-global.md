---
title: "SITE — variable global de configuración"
description: Un solo objeto con todo lo que cambia de empresa a empresa — identidad, ubicación, contacto, redes, navegación y SEO — para no tener datos de la empresa repartidos ni duplicados por el código.
category: frontend
tags: [frontend, site-config, seo, architecture]
problem: Datos de la empresa (nombre, contacto, SEO, redes, horario, navegación) repetidos o hardcodeados en distintos componentes, sin una sola fuente de verdad que renderizar en el HTML.
related: [recipes/astro-seo-completo, recipes/nextjs-seo-completo, skills/skill-seo-astro, skills/skill-seo-nextjs]
updatedAt: 2026-08-17
---

## La idea

`SITE` es un objeto, de solo lectura (`as const`), con **todo** lo que puede cambiar si mañana este proyecto se usa para otra empresa: identidad, ubicación, contacto, redes, navegación, y el bloque de SEO completo. Ningún componente escribe un dato de la empresa a mano — todos importan `SITE` y leen de ahí. Cambiar de empresa es, en teoría, editar un solo archivo.

Es independiente del framework — el mismo objeto sirve en Astro, Next.js, o cualquier otro. Lo único que cambia es la carpeta donde vive (ver [Dónde vive esto](#dónde-vive-esto-por-framework) más abajo). El bloque `seo` de aquí es exactamente el que consumen [SEO completo en Astro](/recipes/astro-seo-completo) y [SEO completo en Next.js](/recipes/nextjs-seo-completo) — mismos nombres de campo, mismos datos de ejemplo.

## Estructura completa

```ts title="src/lib/site-info.ts"
export const SITE = {
  info: {
    name: "Acme",
    legalName: "Acme Studio",
    description:
      "Firma boutique en Bogotá, Colombia. Construimos sitios web, software a medida, identidad de marca y comunicación para empresas que quieren ser vistas, entendidas y elegidas.",
    slogan: "Infraestructura digital, simplificada.",
    tagline: "De invisible a inevitable.",
    founded: 2025,
    founders: [{ name: "Jane Doe", role: "Cofundadora" }],
    teams: [
      { name: "Desarrollo de Software", lead: "Jane Doe" },
      { name: "Identidad de Marca", lead: "John Smith" },
      { name: "Comunicación Organizacional", lead: "Alice Johnson" },
    ],
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
    whatsapp: "+573001234567",
    whatsappDisplay: "+57 300 123 4567",
    landline: "+57 (1) 123 4567",
  },

  whatsappMessages: {
    general: "Hola, quiero conocer más sobre los servicios.",
    service: (service: string) => `Hola, me interesa el servicio de ${service}.`,
    appointment: "Hola, quiero agendar una reunión.",
  },

  social: {
    instagram: "https://instagram.com/acmestudio",
    linkedin: "https://linkedin.com/company/acmestudio",
    x: "https://x.com/acmestudio",
    github: "https://github.com/acmestudio",
    tiktok: "https://tiktok.com/@acmestudio",
    youtube: null as string | null,
  },

  services: [
    "Desarrollo de Software",
    "Identidad de Marca",
    "Comunicación Organizacional",
    "Gestión de Contenido",
  ],

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
    { value: "+340%", label: "En consultas mensuales", sublabel: "Caso: cliente real" },
    { value: "×3", label: "Reconocimiento de marca", sublabel: "En 6 meses" },
  ],

  site: {
    url: "https://acme.studio",
    locale: "es-CO",
    lang: "es",
    timezone: "America/Bogota",
    currency: "COP",
  },

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
    languages: ["Spanish", "English"],

    url: "https://acme.studio",
    locale: "es-CO",
    lang: "es",
    currency: "COP",

    locales: [{ hreflang: "es-CO", default: true }] as const,

    image: "/opengraph-image.png",
    imageAlt: "Logo de Acme sobre fondo blanco",
    imageWidth: 1200,
    imageHeight: 630,
    logo: "/brand/logo.png",

    ogType: "website" as "website" | "article",
    twitterHandle: "@acmestudio" as string | null,
    noindex: false,

    category: "technology",
    classification: "Business",
    priceRange: "$$$",

    areaServed: [
      { type: "Country", name: "Colombia" },
      { type: "Place", name: "Latin America" },
    ],

    geo: { region: "DC", latitude: 4.60971, longitude: -74.08175 },
    themeColor: { light: "#FAFAFA", dark: "#0A0A0F" },
    manifestCategories: ["business", "design", "productivity"],
  },
} as const;

export function whatsAppMessage(message: string) {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
```

## Qué hace cada sección

| Sección | Para qué | ¿Obligatoria? |
| --- | --- | --- |
| `info` (`name`, `legalName`, `description`, `slogan`, `tagline`, `founded`, `founders`, `teams`) | Marca, equipo — títulos, JSON-LD Organization/ProfessionalService (`description` es la de "quiénes somos", distinta de `seo.description`) | Sí |
| `location` | Dirección física — JSON-LD PostalAddress, footer, contacto | Sí (aunque el negocio no tenga local físico, al menos ciudad/país) |
| `contact` / `whatsappMessages` / `whatsAppMessage()` | Canales de contacto y sus CTAs — botones, JSON-LD ContactPoint | Sí |
| `social` | Redes — alimenta `sameAs` en JSON-LD, íconos de footer | Sí (puede ir vacío/`null` en las que no se usan) |
| `services` | Lista de servicios — navegación, JSON-LD Service | Sí si el negocio vende servicios (no productos) |
| `businessHours` | Horario de atención — JSON-LD openingHoursSpecification | Opcional |
| `legal` | Páginas legales — datos para generar rutas `/legal/[slug]`; agregarlas al sitemap es a mano, las dos recetas dejan `ROUTES` manual a propósito | Opcional |
| `navigation` | Links del header/footer y el CTA principal — un solo lugar para el menú | Sí |
| `stats` | Métricas destacadas — sección de la home | Opcional |
| `site` | Config técnica compartida (URL, locale, lang, timezone, currency) fuera del contexto de SEO — formateo de fechas, precios, etc. | Sí |
| `seo` | Todo lo de SEO técnico — ver las dos recetas | Sí |

## `whatsAppMessage()`

```ts
whatsAppMessage(SITE.whatsappMessages.general)
// → "https://wa.me/573001234567?text=Hola%2C%20quiero..."

whatsAppMessage(SITE.whatsappMessages.service("Identidad de Marca"))
```

Une `SITE.contact.whatsapp` con un mensaje de `whatsappMessages` (o cualquier string) y arma el link `wa.me` listo para un `href` — el `encodeURIComponent` no se repite en cada botón que abre WhatsApp.

## Dónde vive esto por framework

| Framework | Archivo |
| --- | --- |
| Astro | `src/lib/site-info.ts` |
| Next.js | `src/config/info.ts` |
| Otro (SvelteKit, Remix, Vite plano) | Cualquier módulo importable desde donde haga falta — `src/lib/site.ts` alcanza |

El patrón no depende del framework — solo el **consumo** cambia (meta tags a mano en Astro vs. la Metadata API de Next.js), no la forma del objeto.

## Reglas del patrón

- Si un dato de la empresa aparece escrito más directamente vez en el código (un email, una URL, un color), es señal de que debería vivir en `SITE` en vez de repetirse.
- `SITE` es de solo lectura (`as const`) — se lee en build time o request time, nunca se muta. Para un dato que sí cambia en runtime (el tema claro/oscuro elegido por el usuario, por ejemplo), eso va en estado de la app, no aquí.
- Las secciones marcadas "opcional" en la tabla de arriba solo se agregan si el proyecto las va a usar de verdad — un `businessHours` sin ningún componente que lo lea es peso muerto, no "por si acaso".

## Consideraciones

- Esta es la plantilla completa — las dos recetas de SEO ([Astro](/recipes/astro-seo-completo), [Next.js](/recipes/nextjs-seo-completo)) y sus [skills](/skills/skill-seo-astro) correspondientes solo documentan a fondo el bloque `seo`, y asumen que el resto ya existe siguiendo esta forma — es justamente el motivo por el que esta plantilla vive en la raíz de Frontend en vez de dentro de la subcategoría SEO: aplica más allá del SEO.
- `site` y `seo` repiten `url`/`locale`/`lang`/`currency` a propósito — `site` es para cualquier parte de la UI que necesite esos valores sin depender del bloque de SEO, `seo` se mantiene autocontenido para que `seo.ts`/`buildMetadata()` no tengan que importar nada más.
- Reemplazar todos los datos de Acme por los reales de la empresa antes de publicar — son datos de ejemplo con forma real, no placeholders vacíos.
