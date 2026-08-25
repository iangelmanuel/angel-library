---
title: "SITE — variable global de configuración"
description: Un solo objeto con todo lo que cambia de empresa a empresa — identidad, ubicación, contacto, redes, navegación y SEO — para no tener datos de la empresa repartidos ni duplicados por el código.
category: frontend
stack: libs
order: 2
tags: [frontend, site-config, seo, architecture]
problem: Datos de la empresa (nombre, contacto, SEO, redes, horario, navegación) repetidos o hardcodeados en distintos componentes, sin una sola fuente de verdad que renderizar en el HTML.
related: [recipes/astro-seo-completo, recipes/nextjs-seo-completo, skills/skill-seo-astro, skills/skill-seo-nextjs]
updatedAt: 2026-08-17
---

## La idea

`SITE` es un objeto, de solo lectura (`as const`), con **todo** lo que puede cambiar si mañana este proyecto se usa para otra empresa: identidad, ubicación, contacto, redes, navegación, y el bloque de SEO completo. Ningún componente escribe un dato de la empresa a mano — todos importan `SITE` y leen de ahí. Cambiar de empresa es, en teoría, editar un solo archivo.

Es independiente del framework — el mismo objeto sirve en Astro, Next.js o cualquier otro. La regla de esta biblioteca es que el archivo vive dentro de la carpeta `config` del proyecto; lo único que cambia entre frameworks es la forma de leerlo y consumirlo (ver [Dónde vive esto por framework](#dónde-vive-esto-por-framework)). El bloque `seo` de aquí es exactamente el que consumen [SEO completo en Astro](/recipes/astro-seo-completo) y [SEO completo en Next.js](/recipes/nextjs-seo-completo) — mismos nombres de campo, mismos datos de ejemplo.

## Estructura completa

```ts title="src/config/site.ts"
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
| Astro | `src/config/site.ts` |
| Next.js | `src/config/site.ts` |
| SvelteKit, Remix o Vite | `src/config/site.ts` |

El nombre del archivo es deliberadamente el mismo: `site.ts`. Así, cualquier componente puede importar `SITE` desde `@/config/site` y la migración entre frameworks no obliga a buscar y cambiar rutas arbitrarias. Si el proyecto no usa `src`, conserva la misma convención en `config/site.ts`.

El patrón no depende del framework — solo el **consumo** cambia (meta tags a mano en Astro vs. la Metadata API de Next.js), no la forma del objeto. `config` es el hogar de la configuración compartida; `lib` queda para helpers y lógica reutilizable que lee esa configuración.

## Qué debe vivir dentro de `SITE`

Incluye datos de identidad y decisiones de configuración que varias partes del sitio necesitan conocer:

- **Identidad:** nombre comercial, nombre legal, descripción, slogan, fundación y equipo.
- **Ubicación y contacto:** dirección, zona horaria, email, teléfono, WhatsApp y mensajes reutilizables.
- **Navegación y negocio:** enlaces principales, CTA, servicios, horarios, métricas y páginas legales.
- **Presentación técnica:** URL pública, idioma, locale, moneda y zona horaria del sitio.
- **SEO:** título, descripción, keywords, imagen social, locales, datos geográficos y color de tema.

No pongas secretos, tokens, contraseñas, credenciales privadas ni datos que cambien por usuario. `SITE` puede terminar incluido en el bundle del cliente; cualquier valor sensible debe vivir en variables de entorno del servidor y exponerse únicamente a través de una función o endpoint que filtre lo necesario.

## Cómo implementarlo en un proyecto existente

1. Crea `src/config/site.ts` y exporta un único objeto `SITE` con `as const`.
2. Traslada los datos repetidos de marca, contacto y SEO al objeto; conserva en cada página únicamente el contenido propio de esa página.
3. Cambia los imports a `@/config/site` y elimina los módulos paralelos (`site-info`, `info`, `brand-config`, etc.).
4. Haz que layouts, metadata, JSON-LD, manifest, sitemap, robots y footer consuman `SITE`.
5. Ejecuta una búsqueda final de emails, dominios, teléfonos y colores hardcodeados para detectar copias que hayan quedado fuera.

La migración debe ser gradual: primero agrega `SITE`, luego conecta un consumidor a la vez y al final elimina la configuración duplicada. No mantengas dos objetos activos con el mismo propósito porque terminarán divergiendo.

## Separar configuración de contenido

`SITE` describe la identidad y las reglas globales del sitio, no todo el contenido de la aplicación. Una lista de artículos, productos, preguntas frecuentes o servicios con campos propios debe vivir en su colección, base de datos o archivo de contenido correspondiente. `SITE.services` puede servir para navegación, footer o JSON-LD cuando la lista es corta y realmente global; si cada servicio tiene slug, precio, imágenes o SEO propio, ya no es configuración.

La misma separación aplica al SEO: `SITE.seo` contiene defaults globales. Una página puede sobrescribir su título, descripción, imagen o canonical mediante props o metadata local, pero debe partir de esos defaults y no repetirlos a mano.

## Variables de entorno y valores por despliegue

Usa `SITE` para la forma estable de la configuración y variables de entorno para valores que cambian entre local, preview y producción. Por ejemplo, el objeto puede leer una URL pública ya validada por el framework:

```ts title="src/config/site.ts"
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "http://localhost:4321";

export const SITE = {
  site: {
    url: siteUrl.replace(/\/$/, ""),
  },
  // ...el resto de la configuración compartida
} as const;
```

En Next.js sustituye `import.meta.env.PUBLIC_SITE_URL` por `process.env.NEXT_PUBLIC_SITE_URL`. No mezcles APIs de entorno entre frameworks y no marques como públicas variables que contengan secretos.

## Tipado, validación y pruebas

`as const` mantiene los literales y evita mutaciones accidentales, pero no valida datos externos. Si parte de la configuración llega desde variables de entorno o un CMS, valida esa entrada antes de construir `SITE` y falla durante el build si falta un campo obligatorio.

Como mínimo, verifica que:

- `SITE.site.url` sea una URL absoluta y no termine con `/`.
- `SITE.seo.url` y `SITE.site.url` no se contradigan.
- cada red social sea una URL válida o `null`.
- los locales tengan `hreflang`, idioma y canonical coherentes.
- ningún consumidor vuelva a declarar datos que ya existen en `SITE`.

## Patrón de imports y helpers

Los consumidores importan la configuración desde la misma ruta:

```ts
import { SITE, whatsAppMessage } from "@/config/site";

const canonical = new URL("/contacto", SITE.seo.url).href;
const whatsappHref = whatsAppMessage(SITE.whatsappMessages.appointment);
```

Los helpers pequeños que derivan URLs, títulos o mensajes pueden exportarse junto a `SITE` mientras sean puros y no tengan efectos secundarios. Si la lógica crece o necesita acceso a secretos, muévela a `src/lib/` o a una capa de servidor, manteniendo `SITE` como su fuente de datos.

## Reglas del patrón

- Si un dato de la empresa aparece escrito más directamente vez en el código (un email, una URL, un color), es señal de que debería vivir en `SITE` en vez de repetirse.
- `SITE` es de solo lectura (`as const`) — se lee en build time o request time, nunca se muta. Para un dato que sí cambia en runtime (el tema claro/oscuro elegido por el usuario, por ejemplo), eso va en estado de la app, no aquí.
- Las secciones marcadas "opcional" en la tabla de arriba solo se agregan si el proyecto las va a usar de verdad — un `businessHours` sin ningún componente que lo lea es peso muerto, no "por si acaso".

## Consideraciones

- Esta es la plantilla completa — las dos recetas de SEO ([Astro](/recipes/astro-seo-completo), [Next.js](/recipes/nextjs-seo-completo)) y sus [skills](/skills/skill-seo-astro) correspondientes solo documentan a fondo el bloque `seo`, y asumen que el resto ya existe siguiendo esta forma — es justamente el motivo por el que esta plantilla vive en la raíz de Frontend en vez de dentro de la subcategoría SEO: aplica más allá del SEO.
- `site` y `seo` repiten `url`/`locale`/`lang`/`currency` a propósito — `site` es para cualquier parte de la UI que necesite esos valores sin depender del bloque de SEO, `seo` se mantiene autocontenido para que `seo.ts`/`buildMetadata()` no tengan que importar nada más.
- Reemplazar todos los datos de Acme por los reales de la empresa antes de publicar — son datos de ejemplo con forma real, no placeholders vacíos.
