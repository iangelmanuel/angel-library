import { getCollection, type CollectionEntry } from "astro:content"
import {
  CATEGORY_LIST,
  getSubcategoriesForCategory,
  type CategoryId,
  type ContentTypeId,
  type SubcategoryId
} from "@/config/site"

/** Una entrada de la biblioteca. */
export type AnyEntry = CollectionEntry<"library">

// ── Cargar ──

/** Todas las entradas; los borradores solo en dev. */
export async function getAllEntries(includePrivate = false): Promise<AnyEntry[]> {
  const entries = await getCollection("library")

  return entries.filter((entry) => {
    if (!includePrivate && entry.data.private) return false
    return import.meta.env.DEV || !entry.data.draft
  })
}

// ── Ubicación ──

/** Categoría = primera carpeta del id. */
export function categoryOf(entry: AnyEntry): CategoryId {
  return entry.id.split("/")[0] as CategoryId
}

/** Subcategoría = segunda carpeta, si la hay. */
export function subcategoryOf(entry: AnyEntry): SubcategoryId | undefined {
  const segments = entry.id.split("/")
  return segments.length > 2 ? (segments[1] as SubcategoryId) : undefined
}

/** URL pública: el id. */
export function getEntryUrl(entry: AnyEntry): string {
  return `/${entry.id}`
}

/** Clave de referencia: el id. */
export function entryKey(entry: AnyEntry): string {
  return entry.id
}

export function buildEntryMap(entries: AnyEntry[]): Map<string, AnyEntry> {
  return new Map(entries.map((entry) => [entryKey(entry), entry]))
}

// ── Ordenar ──

/** Curva de lectura: fundamentos primero. */
const LEARNING_TYPE_ORDER: ContentTypeId[] = [
  "technologies",
  "guides",
  "practices",
  "patterns",
  "libraries",
  "integrations",
  "hooks",
  "utilities",
  "snippets",
  "commands",
  "tricks",
  "recipes",
  "resources",
  "skills"
]

function byTitle(a: AnyEntry, b: AnyEntry): number {
  return a.data.title.localeCompare(b.data.title, "es")
}

export function sortByTitle<T extends AnyEntry>(entries: T[]): T[] {
  return [...entries].sort(byTitle)
}

export function sortByLearningPath<T extends AnyEntry>(entries: T[]): T[] {
  const rank = (entry: AnyEntry) => {
    const index = LEARNING_TYPE_ORDER.indexOf(entry.data.type)
    return index === -1 ? Infinity : index
  }
  const order = (entry: AnyEntry) => entry.data.order ?? Infinity

  return [...entries].sort(
    (a, b) => rank(a) - rank(b) || order(a) - order(b) || byTitle(a, b)
  )
}

// ── Agrupar ──

interface EntryGroup {
  id: string
  label: string
  /** Descripción del grupo. */
  description?: string
  entries: AnyEntry[]
}

function toGroups(
  source: readonly { id: string; label: string; description?: string }[],
  pick: (id: string) => AnyEntry[]
): EntryGroup[] {
  return source
    .map(({ id, label, description }) => ({
      id,
      label,
      description,
      entries: pick(id)
    }))
    .filter((group) => group.entries.length > 0)
}

/** Entradas de una categoría, agrupadas por subcategoría. */
export function getCategoryEntries(all: AnyEntry[], category: CategoryId) {
  const entries = all.filter((entry) => categoryOf(entry) === category)

  return {
    entries,
    groups: toGroups(getSubcategoriesForCategory(category), (id) =>
      sortByLearningPath(entries.filter((entry) => subcategoryOf(entry) === id))
    ),
    ungrouped: sortByLearningPath(entries.filter((entry) => !subcategoryOf(entry)))
  }
}

interface CategorySection {
  label: string
  icon?: string
  description?: string
  entries: AnyEntry[]
}

/** Secciones de /categories/<id>. */
export function getCategorySections(
  all: AnyEntry[],
  category: CategoryId
): { entries: AnyEntry[]; sections: CategorySection[] } {
  const { entries, groups, ungrouped } = getCategoryEntries(all, category)
  const loose = (label: string, description: string): CategorySection[] =>
    ungrouped.length > 0
      ? [{ label, icon: "book-open", description, entries: ungrouped }]
      : []

  if (category === "resources") {
    return {
      entries,
      sections: [
        ...loose(
          "Guías y fundamentos",
          "Cómo elegir y evaluar un recurso antes de meterlo en un proyecto."
        ),
        ...groups.map((group) => ({ ...group, icon: "bookmark" }))
      ]
    }
  }

  return { entries, sections: [...groups, ...loose(
      "Fundamentos y referencias",
      "Contenido de la categoría que no pertenece a ninguna subcategoría."
    )] }
}

/** Agrupa por categoría. */
export function groupEntriesByCategory(entries: AnyEntry[]) {
  return CATEGORY_LIST.map((meta) => ({
    meta,
    entries: sortByLearningPath(
      entries.filter((entry) => categoryOf(entry) === meta.id)
    )
  })).filter((group) => group.entries.length > 0)
}

/** Categorías con contenido y su conteo. */
export function getCategoryCounts(entries: AnyEntry[]) {
  return CATEGORY_LIST.map((meta) => ({
    ...meta,
    count: entries.filter((entry) => categoryOf(entry) === meta.id).length
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

/** Markdown a texto plano. */
export function stripMarkdown(body: string): string {
  return body
    .replace(/```(\w*)\n?/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
