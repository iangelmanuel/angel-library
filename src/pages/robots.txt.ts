import type { APIRoute } from "astro"
import { SITE } from "@/config/site"

export const GET: APIRoute = () => {
  const body = SITE.seo.noindex
    ? ["User-agent: *", "Disallow: /", ""].join("\n")
    : [
        "User-agent: *",
        "Allow: /",
        "Disallow: /_astro/",
        "",
        `Sitemap: ${SITE.seo.url}/sitemap.xml`,
        `Host: ${SITE.seo.url}`,
        ""
      ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  })
}
