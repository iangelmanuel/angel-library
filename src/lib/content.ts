import { getCollection, type CollectionEntry } from "astro:content"
import {
  CATEGORY_LIST,
  CONTENT_TYPE_IDS,
  RESOURCE_CATEGORY_LIST,
  STACK_GROUPED_CATEGORIES,
  getStacksForCategory,
  type CategoryId,
  type ContentTypeId
} from "@/config/site"

/** Una entrada de cualquier colección de la biblioteca. */
export type AnyEntry =
  | CollectionEntry<"technologies">
  | CollectionEntry<"libraries">
  | CollectionEntry<"integrations">
  | CollectionEntry<"recipes">
  | CollectionEntry<"snippets">
  | CollectionEntry<"hooks">
  | CollectionEntry<"utilities">
  | CollectionEntry<"resources">
  | CollectionEntry<"skills">
  | CollectionEntry<"commands">
  | CollectionEntry<"patterns">
  | CollectionEntry<"practices">
  | CollectionEntry<"guides">
  | CollectionEntry<"tricks">

/* ---------------------------------------------------------------- */
/* Cargar                                                            */
/* ---------------------------------------------------------------- */

/** Todas las entradas. Los borradores solo salen en desarrollo. */
export async function getAllEntries(includePrivate = false): Promise<AnyEntry[]> {
  const collections = await Promise.all(
    CONTENT_TYPE_IDS.map((id) => getCollection(id as "libraries"))
  )

  return (collections.flat() as AnyEntry[]).filter((entry) => {
    if (!includePrivate && entry.data.private) return false
    return import.meta.env.DEV || !entry.data.draft
  })
}

/** URL pública: /<coleccion>/<id> */
export function getEntryUrl(entry: AnyEntry): string {
  return `/${entry.collection}/${entry.id}`
}

/** Clave "coleccion/id" con la que se referencian entre sí. */
export function entryKey(entry: AnyEntry): string {
  return `${entry.collection}/${entry.id}`
}

export function buildEntryMap(entries: AnyEntry[]): Map<string, AnyEntry> {
  return new Map(entries.map((entry) => [entryKey(entry), entry]))
}

/* ---------------------------------------------------------------- */
/* Ordenar                                                           */
/* ---------------------------------------------------------------- */

/**
 * Curva de lectura compartida por sidebar, categorías y anterior/siguiente:
 * primero los fundamentos, al final lo aplicado.
 */
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
    const index = LEARNING_TYPE_ORDER.indexOf(entry.collection as ContentTypeId)
    return index === -1 ? Infinity : index
  }
  const order = (entry: AnyEntry) => entry.data.order ?? Infinity

  return [...entries].sort(
    (a, b) => rank(a) - rank(b) || order(a) - order(b) || byTitle(a, b)
  )
}

/* ---------------------------------------------------------------- */
/* Agrupar                                                           */
/* ---------------------------------------------------------------- */

export interface EntryGroup {
  id: string
  label: string
  entries: AnyEntry[]
}

function toGroups(
  source: readonly { id: string; label: string }[],
  pick: (id: string) => AnyEntry[]
): EntryGroup[] {
  return source
    .map(({ id, label }) => ({ id, label, entries: pick(id) }))
    .filter((group) => group.entries.length > 0)
}

/**
 * Entradas de una categoría separadas en subgrupos (por categoría de recurso
 * o por stack) y sueltas. Sin subgrupos, todas quedan en `ungrouped`.
 */
export function getCategoryEntries(all: AnyEntry[], category: CategoryId) {
  const entries = all.filter((entry) => entry.data.category === category)

  if (category === "resources") {
    return {
      entries,
      groups: toGroups(RESOURCE_CATEGORY_LIST, (id) =>
        entries.filter(
          (entry) =>
            entry.collection === "resources" && entry.data.resourceCategory === id
        )
      ),
      ungrouped: sortByLearningPath(
        entries.filter((entry) => entry.collection !== "resources")
      )
    }
  }

  if (STACK_GROUPED_CATEGORIES.includes(category)) {
    return {
      entries,
      groups: toGroups(getStacksForCategory(category), (id) =>
        sortByLearningPath(entries.filter((entry) => entry.data.stack === id))
      ),
      ungrouped: sortByLearningPath(entries.filter((entry) => !entry.data.stack))
    }
  }

  return {
    entries,
    groups: [] as EntryGroup[],
    ungrouped: sortByLearningPath(entries)
  }
}

export interface CategorySection {
  label: string
  icon?: string
  entries: AnyEntry[]
}

/** Las secciones tal cual se dibujan en /categories/<id>. */
export function getCategorySections(
  all: AnyEntry[],
  category: CategoryId
): { entries: AnyEntry[]; sections: CategorySection[] } {
  const { entries, groups, ungrouped } = getCategoryEntries(all, category)
  const loose = (label: string): CategorySection[] =>
    ungrouped.length > 0 ? [{ label, icon: "book-open", entries: ungrouped }] : []

  if (category === "resources") {
    return {
      entries,
      sections: [
        ...loose("Guías y fundamentos"),
        ...groups.map((group) => ({ ...group, icon: "bookmark" }))
      ]
    }
  }

  if (STACK_GROUPED_CATEGORIES.includes(category)) {
    return { entries, sections: [...groups, ...loose("Fundamentos y referencias")] }
  }

  return { entries, sections: [{ label: "Ruta de aprendizaje", entries: ungrouped }] }
}

/** Agrupa una selección de entradas en el orden público de categorías. */
export function groupEntriesByCategory(entries: AnyEntry[]) {
  return CATEGORY_LIST.map((meta) => ({
    meta,
    entries: sortByLearningPath(
      entries.filter((entry) => entry.data.category === meta.id)
    )
  })).filter((group) => group.entries.length > 0)
}

/** Categorías con contenido y cuántas entradas tiene cada una. */
export function getCategoryCounts(entries: AnyEntry[]) {
  return CATEGORY_LIST.map((meta) => ({
    ...meta,
    count: entries.filter((entry) => entry.data.category === meta.id).length
  })).filter((category) => category.count > 0)
}

export function getEntriesByType(
  entries: AnyEntry[],
  type: ContentTypeId
): AnyEntry[] {
  return entries.filter((entry) => entry.collection === type)
}

/* ---------------------------------------------------------------- */
/* Tags                                                              */
/* ---------------------------------------------------------------- */

export interface TagCount {
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

/* ---------------------------------------------------------------- */
/* Texto                                                             */
/* ---------------------------------------------------------------- */

const dateFormatter = new Intl.DateTimeFormat("es", { dateStyle: "medium" })

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}

/** Markdown a texto plano, para el índice de búsqueda. */
export function stripMarkdown(body: string): string {
  return body
    .replace(/```(\w*)\n?/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
