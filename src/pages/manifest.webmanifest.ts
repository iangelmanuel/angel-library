import type { APIRoute } from "astro"
import { SITE } from "@/config/site"

const MIME_BY_EXTENSION: Record<string, string> = {
  svg: "image/svg+xml",
  webp: "image/webp",
  png: "image/png",
  ico: "image/x-icon"
}

const extension = SITE.seo.logo.split(".").pop() ?? ""
const logoType = MIME_BY_EXTENSION[extension] ?? "image/png"
const logoSizes =
  logoType === "image/svg+xml"
    ? "any"
    : `${SITE.seo.imageWidth}x${SITE.seo.imageHeight}`

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
        sizes: logoSizes,
        type: logoType,
        purpose: "any"
      }
    ]
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" }
  })
}
