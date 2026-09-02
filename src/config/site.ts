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

const PRODUCTION_URL = "https://angel-library.vercel.app"
const DEV_URL = "http://localhost:4321"
const isDev = process.argv.includes("dev")

const SITE_URL = (
  process.env.SITE ?? (isDev ? DEV_URL : PRODUCTION_URL)
).replace(/\/$/, "")
const IS_LOCAL = SITE_URL.startsWith("http://localhost")
const DESCRIPTION =
  "Biblioteca personal de conocimiento técnico: snippets, recetas, comandos y referencias rápidas para desarrollo web."

export const SITE = {
  name: "angel.library",
  description: DESCRIPTION,
  locale: "es",

  info: {
    name: "angel.library",
    legalName: "angel.library",
    description: DESCRIPTION,
    slogan: "Segundo cerebro técnico para desarrollo web.",
    founded: 2026,
    founders: [{ name: "iangelmanuel", role: "Founder & Developer" }],
    author: "Angel DM"
  },

  config: {
    SITE_URL,
    IS_LOCAL,
    isDev,
    locale: "es-CO",
    lang: "es",
    timezone: "America/Bogota",
    currency: "COP"
  },

  social: {
    instagram: "https://instagram.com/iangelmanuel",
    linkedin: "https://linkedin.com/in/iangelmanuel",
    x: "https://x.com/iangelmanuel",
    github: "https://github.com/iangelmanuel/angel-library",
    tiktok: null as string | null,
    youtube: "https://youtube.com/@iangelmanuel"
  },

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

    author: "Angel DM",
    creator: "Angel DM",
    publisher: "angel.library",

    url: SITE_URL,
    locale: "es-CO",
    lang: "es",
    currency: "COP",
    contactRegion: "CO",
    languages: ["Spanish"],
    locales: [{ hreflang: "es-CO", default: true }] as const,
    geo: {
      region: "CO",
      latitude: "4.710989",
      longitude: "-74.072090"
    },

    image: "/icon.webp",
    imageAlt: "angel.library, segundo cerebro técnico para desarrollo web",
    imageWidth: 1254,
    imageHeight: 1254,
    logo: "/icon.webp",

    ogType: "website" as "website" | "article",
    twitterAuthor: "@iangelmanuel",
    twitterHandle: "@iangelmanuel",
    twitterCard: "summary" as
      "summary" | "summary_large_image" | "app" | "player",
    noindex: IS_LOCAL,

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
