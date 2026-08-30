import type { APIRoute } from "astro"
import { CATEGORIES, CONTENT_TYPES, type ContentTypeId } from "@/config/site"
import { getAllEntries, getEntryUrl, stripMarkdown } from "@/lib/content"

/** Índice que descarga el buscador del cliente una vez por sesión. */
export const GET: APIRoute = async () => {
  const entries = await getAllEntries()

  const docs = entries.map((entry) => {
    const type = CONTENT_TYPES[entry.collection as ContentTypeId]
    const category = CATEGORIES[entry.data.category]

    return {
      title: entry.data.title,
      description: entry.data.description,
      url: getEntryUrl(entry),
      type: entry.collection,
      typeLabel: type.label,
      typeSingular: type.singular,
      typeIcon: type.icon,
      categoryId: category.id,
      categoryLabel: category.label,
      categoryIcon: category.icon,
      categoryColor: category.color,
      tags: entry.data.tags ?? [],
      content: stripMarkdown(entry.body ?? "").slice(0, 1200)
    }
  })

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  })
}
