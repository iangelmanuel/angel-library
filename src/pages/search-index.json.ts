import type { APIRoute } from "astro"
import {
  CATEGORIES,
  CONTENT_TYPES,
  type CategoryId,
  type ContentTypeId
} from "@/config/site"
import { getAllEntries, getEntryUrl, stripMarkdown } from "@/lib/content"

export const GET: APIRoute = async () => {
  const entries = await getAllEntries()

  const docs = entries.map((entry) => {
    const typeMeta = CONTENT_TYPES[entry.collection as ContentTypeId]
    const categoryMeta = CATEGORIES[entry.data.category as CategoryId]
    return {
      title: entry.data.title,
      description: entry.data.description,
      url: getEntryUrl(entry),
      type: entry.collection,
      typeLabel: typeMeta.label,
      typeSingular: typeMeta.singular,
      typeIcon: typeMeta.icon,
      categoryLabel: categoryMeta.label,
      tags: entry.data.tags ?? [],
      content: stripMarkdown(entry.body ?? "").slice(0, 1200)
    }
  })

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  })
}
