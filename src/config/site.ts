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
      "summary" | "summary_large_image" | "app" | "player",
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
