import { type CollectionEntry, getCollection } from "astro:content"
import { CATEGORY_LIST, getSubcategoriesForCategory } from "@/config/catalog"
import {
  CONTENT_TYPES,
  type ContentTypeId,
  isLearningContentType
} from "@/config/content-types"
import {
  validateContentRelations,
  validateContentStructure,
  validateInternalLinks
} from "./validation"

/** Una entrada de la biblioteca. */
export type AnyEntry = CollectionEntry<"docs">

// ── Cargar ──

/** Todas las entradas; los borradores solo en dev. */
let checked = false

export async function getAllEntries(
  includePrivate = false
): Promise<AnyEntry[]> {
  const entries = await getCollection("docs")

  if (!checked) {
    validateContent(entries)
    checked = true
  }

  return entries.filter((entry) => {
    if (!includePrivate && entry.data.private) return false
    return import.meta.env.DEV || !entry.data.draft
  })
}

/** Rompe el build si el contenido está mal. */
function validateContent(entries: AnyEntry[]): void {
  for (const entry of entries) {
    if (!entry.data.type) {
      throw new Error(`[contenido] "${entry.id}" no declara "type".`)
    }
  }

  validateContentStructure(entries)
  validateContentRelations(entries)
  validateInternalLinks(entries)
}

/** Tipo editorial de la entrada. */
export function typeOf(entry: AnyEntry): ContentTypeId {
  return entry.data.type as ContentTypeId
}

// ── Ubicación ──

/** Categoría = primera carpeta del id. */
export function categoryOf(entry: AnyEntry): string {
  return entry.id.split("/")[0]
}

/** Subcategoría = segunda carpeta, si la hay. */
export function subcategoryOf(entry: AnyEntry): string | undefined {
  const segments = entry.id.split("/")
  return segments.length > 2 ? segments[1] : undefined
}

/** URL pública: el id. */
export function getEntryUrl(entry: AnyEntry): string {
  return `/${entry.id}`
}

// ── Ordenar ──

function byTitle(a: AnyEntry, b: AnyEntry): number {
  return a.data.title.localeCompare(b.data.title, "es")
}

export function sortByTitle<T extends AnyEntry>(entries: T[]): T[] {
  return [...entries].sort(byTitle)
}

export function sortByLearningPath<T extends AnyEntry>(entries: T[]): T[] {
  const rank = (entry: AnyEntry) => CONTENT_TYPES[typeOf(entry)].learningOrder
  const order = (entry: AnyEntry) => entry.data.order ?? Infinity

  return [...entries].sort(
    (a, b) => rank(a) - rank(b) || order(a) - order(b) || byTitle(a, b)
  )
}

/** Orden visible: aprendizaje primero; consulta alfabética después. */
export function sortForDisplay<T extends AnyEntry>(entries: T[]): T[] {
  const learning = entries.filter((entry) =>
    isLearningContentType(entry.data.type ?? "")
  )
  const reference = entries.filter(
    (entry) => !isLearningContentType(entry.data.type ?? "")
  )
  return [...sortByLearningPath(learning), ...sortByTitle(reference)]
}

// ── Agrupar ──

interface EntryGroup {
  id: string
  label: string
  /** Descripción del grupo. */
  description?: string
  entries: AnyEntry[]
}

/** Entradas de una categoría, agrupadas por subcategoría. */
export function getCategoryEntries(all: AnyEntry[], category: string) {
  const entries = all.filter((entry) => categoryOf(entry) === category)
  const bySubcategory = new Map<string | undefined, AnyEntry[]>()
  for (const entry of entries) {
    const id = subcategoryOf(entry)
    const group = bySubcategory.get(id) ?? []
    group.push(entry)
    bySubcategory.set(id, group)
  }

  const groups: EntryGroup[] = getSubcategoriesForCategory(category)
    .map(({ id, label, description }) => ({
      id,
      label,
      description,
      entries: sortForDisplay(bySubcategory.get(id) ?? [])
    }))
    .filter((group) => group.entries.length > 0)

  return {
    entries,
    groups,
    ungrouped: sortForDisplay(bySubcategory.get(undefined) ?? [])
  }
}

/** Categorías con contenido y su conteo. */
export function getCategoryCounts(entries: AnyEntry[]) {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    const category = categoryOf(entry)
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  return CATEGORY_LIST.map((meta) => ({
    ...meta,
    count: counts.get(meta.id) ?? 0
  })).filter((category) => category.count > 0)
}

export function getEntriesByType(
  entries: AnyEntry[],
  type: ContentTypeId
): AnyEntry[] {
  return entries.filter((entry) => entry.data.type === type)
}

// ── Tags ──

interface TagCount {
  tag: string
  count: number
}

export function getAllTags(entries: AnyEntry[]): TagCount[] {
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
  return sortByTitle(entries.filter((entry) => entry.data.tags?.includes(tag)))
}

// ── Texto ──

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "medium" })

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}
