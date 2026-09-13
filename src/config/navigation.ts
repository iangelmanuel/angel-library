import { SITE } from "./site"

export const SITE_NAV = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/categories" },
  { label: "Tags", href: "/tags" }
] as const

export const SOCIAL_LINKS = [
  { label: "GitHub", icon: "brand-github", href: SITE.social.github },
  { label: "X", icon: "brand-x", href: SITE.social.x }
] as const
