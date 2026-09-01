import { SITE } from "@/config/site"

export interface SeoProps {
  title?: string
  description?: string
  image?: string
  canonical?: string
  keywords?: readonly string[]
  ogType?: "website" | "article"
  noindex?: boolean
}

export interface JsonLdBlock {
  id: string
  data: object | object[]
}

const SITE_URL = SITE.seo.url

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).href
}

/** Identidad editorial que publica la biblioteca. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.info.name,
    legalName: SITE.info.legalName,
    url: SITE_URL,
    logo: absoluteUrl(SITE.seo.logo),
    description: SITE.info.description,
    founder: {
      "@type": "Person",
      name: SITE.info.author,
      sameAs: SITE.social.github
    },
    sameAs: Object.values(SITE.social).filter(Boolean),
    knowsAbout: SITE.seo.keywords
  } as const
}

/** El sitio como publicación web, relacionado con su entidad editora. */
export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.info.name,
    description: SITE.seo.description,
    inLanguage: SITE.seo.locale,
    publisher: { "@id": `${SITE_URL}/#organization` }
  } as const
}

export interface ArticleLdInput {
  title: string
  description: string
  url: string
  dateModified?: Date
}

/** Información estructurada de una entrada Markdown. */
export function articleLd({
  title,
  description,
  url,
  dateModified
}: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(SITE.seo.image),
    inLanguage: SITE.seo.locale,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(dateModified && { dateModified: dateModified.toISOString() })
  } as const
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/** Ruta de navegación que acompaña a las páginas de contenido. */
export function breadcrumbLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  } as const
}
