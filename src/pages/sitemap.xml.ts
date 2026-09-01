import type { APIRoute } from "astro"
import { CATEGORY_LIST } from "@/config/categories"
import { CONTENT_TYPE_LIST } from "@/config/content-types"
import { SITE } from "@/config/site"
import { getAllEntries, getAllTags, getEntryUrl } from "@/lib/content"

interface SitemapRoute {
  path: string
  lastmod?: Date
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;"
      })[character] ?? character
  )
}

export const GET: APIRoute = async () => {
  const entries = await getAllEntries()
  const categoryRoutes = CATEGORY_LIST.map(({ id }) => ({
    path: `/categories/${id}`
  }))
  const typeRoutes = CONTENT_TYPE_LIST.map(({ id }) => ({
    path: `/tipos/${id}`
  }))
  const tagRoutes = getAllTags(entries).map(({ tag }) => ({
    path: `/tags/${encodeURIComponent(tag)}`
  }))
  const entryRoutes = entries.map((entry) => ({
    path: getEntryUrl(entry),
    lastmod: entry.data.updatedAt
  }))
  const routes: SitemapRoute[] = [
    { path: "/" },
    ...categoryRoutes,
    ...typeRoutes,
    ...tagRoutes,
    ...entryRoutes
  ]

  const urls = routes
    .map((route) => {
      const lastmod = route.lastmod
        ? `\n    <lastmod>${route.lastmod.toISOString()}</lastmod>`
        : ""
      return `  <url>\n    <loc>${escapeXml(
        new URL(route.path, `${SITE.seo.url}/`).href
      )}</loc>${lastmod}\n  </url>`
    })
    .join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  })
}
