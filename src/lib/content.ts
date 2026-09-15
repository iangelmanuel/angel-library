import { type CollectionEntry, getCollection } from "astro:content"
import { CATEGORIES } from "@/config/categories"

export type AnyEntry = CollectionEntry<"docs">

export async function getAllEntries(
  includePrivate = false
): Promise<AnyEntry[]> {
  const entries = await getCollection("docs")
  return entries.filter((entry) => {
    if (!includePrivate && entry.data.private) return false
    return import.meta.env.DEV || !entry.data.draft
  })
}

export function categoryOf(entry: AnyEntry): string {
  return entry.id.split("/")[0]
}

export function subcategoryOf(entry: AnyEntry): string | undefined {
  const segments = entry.id.split("/")
  return segments.length > 2 ? segments[1] : undefined
}

// El índice de la portada se lee en este orden: primero con qué se
// construye, después el producto y los agentes, luego la calidad, el flujo
// de trabajo y al final el material de referencia. Sin esto, las categorías
// salían en el orden en que están escritas en `categories.ts`, que es
// alfabético por clave y no dice nada.
const GROUP_ORDER = [
  "construir",
  "producto",
  "calidad",
  "flujo",
  "referencia"
] as const

export function getCategoryCounts(entries: AnyEntry[]) {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    const category = categoryOf(entry)
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  const groupIndex = (group: string) => {
    const index = GROUP_ORDER.indexOf(group as (typeof GROUP_ORDER)[number])
    return index === -1 ? GROUP_ORDER.length : index
  }
  return Object.entries(CATEGORIES)
    .map(([id, meta]) => ({ id, ...meta, count: counts.get(id) ?? 0 }))
    .filter((category) => category.count > 0)
    .sort(
      (a, b) =>
        groupIndex(a.group) - groupIndex(b.group) ||
        a.order - b.order ||
        a.label.localeCompare(b.label, "es")
    )
}

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "medium" })

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}
