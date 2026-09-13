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

export function getEntryUrl(entry: AnyEntry): string {
  return `/${entry.id}`
}

// por `order` si lo declara, si no alfabético
export function sortEntries<T extends AnyEntry>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) =>
      (a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
      a.data.title.localeCompare(b.data.title, "es")
  )
}

interface EntryGroup {
  id: string
  label: string
  description?: string
  entries: AnyEntry[]
}

export function getCategoryEntries(all: AnyEntry[], category: string) {
  const entries = all.filter((entry) => categoryOf(entry) === category)
  const bySubcategory = new Map<string | undefined, AnyEntry[]>()
  for (const entry of entries) {
    const id = subcategoryOf(entry)
    const group = bySubcategory.get(id) ?? []
    group.push(entry)
    bySubcategory.set(id, group)
  }

  const subcategories =
    CATEGORIES[category as keyof typeof CATEGORIES]?.subcategories ?? {}
  const groups: EntryGroup[] = Object.entries(subcategories)
    .map(([id, meta]) => ({
      id,
      label: meta.label,
      description: "description" in meta ? meta.description : undefined,
      entries: sortEntries(bySubcategory.get(id) ?? [])
    }))
    .filter((group) => group.entries.length > 0)

  return {
    entries,
    groups,
    ungrouped: sortEntries(bySubcategory.get(undefined) ?? [])
  }
}

export function getCategoryCounts(entries: AnyEntry[]) {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    const category = categoryOf(entry)
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  return Object.entries(CATEGORIES)
    .map(([id, meta]) => ({ id, ...meta, count: counts.get(id) ?? 0 }))
    .filter((category) => category.count > 0)
}

export function getAllTags(entries: AnyEntry[]) {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "es"))
}

export function getEntriesByTag(entries: AnyEntry[], tag: string): AnyEntry[] {
  return sortEntries(entries.filter((entry) => entry.data.tags?.includes(tag)))
}

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "medium" })

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}
