import { SITE } from "./site"

/** Enlaces que aparecen en las cabeceras y el pie del sitio. */
export const SITE_NAV = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/categories" },
  { label: "Tipos", href: "/tipos/guides" },
  { label: "Tags", href: "/tags" }
] as const

export const SEARCH_LINK = { label: "Buscar", href: "/buscar" } as const

export const SOCIAL_LINKS = [
  { label: "GitHub", icon: "brand-github", href: SITE.social.github },
  { label: "X", icon: "brand-x", href: SITE.social.x }
] as const
