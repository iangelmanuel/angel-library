import { SITE } from "./site"

export const SITE_NAV = [
  { label: "Inicio", href: "/" },
  {
    label: "Documentación",
    href: "/general/general-fundamentos/ruta-aprendizaje-web"
  }
] as const

export const SOCIAL_LINKS = [
  { label: "GitHub", icon: "brand-github", href: SITE.social.github },
  { label: "X", icon: "brand-x", href: SITE.social.x }
] as const
