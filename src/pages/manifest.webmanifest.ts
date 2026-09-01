import type { APIRoute } from "astro"
import { SITE } from "@/config/site"

export const GET: APIRoute = () => {
  const manifest = {
    name: SITE.info.legalName,
    short_name: SITE.info.name,
    description: SITE.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE.seo.themeColor.dark,
    theme_color: SITE.seo.themeColor.dark,
    lang: SITE.seo.lang,
    categories: SITE.seo.manifestCategories,
    icons: [
      {
        src: SITE.seo.logo,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" }
  })
}
