import { CATEGORIES, CATEGORY_IDS, getSubcategory } from "@/config/catalog"
import { CONTENT_TYPES, CONTENT_TYPE_IDS } from "@/config/content-types"
import type { ContentTypeId } from "@/config/content-types"
import {
  type AnyEntry,
  categoryOf,
  getAllEntries,
  getAllTags,
  getCategoryCounts,
  subcategoryOf,
  typeOf
} from "@/lib/content"

export interface LandingTypeCount {
  id: ContentTypeId
  label: string
  count: number
  share: number
}

export interface LandingCategoryCount {
  id: string
  label: string
  icon: string
  description: string
  color: string
  count: number
}

export interface LandingRoute {
  root: string
  category: { segment: string; label: string; href: string }
  subcategory: { segment: string; label: string }
  file: { segment: string; title: string }
  url: string
  type: { id: ContentTypeId; label: string }
}

export interface LandingRecent {
  title: string
  url: string
  category: { label: string; color: string }
  updatedAt: Date
}

export interface LandingStats {
  docs: number
  categories: number
  subcategories: number
  tags: number
  types: LandingTypeCount[]
  categoryList: LandingCategoryCount[]
  route: LandingRoute | null
  recent: LandingRecent[]
}

const PREFERRED_ROUTE_ID = "frontend/astro/astro-content-collections"

function countSubcategories(entries: AnyEntry[]): number {
  const seen = new Set<string>()

  for (const entry of entries) {
    const subcategory = subcategoryOf(entry)
    if (subcategory) seen.add(`${categoryOf(entry)}/${subcategory}`)
  }

  return seen.size
}

function buildRoute(entries: AnyEntry[]): LandingRoute | null {
  const usable = entries.filter((entry) => entry.id.split("/").length === 3)
  const entry =
    usable.find((candidate) => candidate.id === PREFERRED_ROUTE_ID) ?? usable[0]

  if (!entry) return null

  const [category, subcategory, file] = entry.id.split("/")
  const categoryId = categoryOf(entry)
  const subcategoryId = subcategoryOf(entry)

  return {
    root: "src/content/",
    category: {
      segment: `${category}/`,
      label: CATEGORIES[categoryId].label,
      href: `/categories/${categoryId}`
    },
    subcategory: {
      segment: `${subcategory}/`,
      label:
        getSubcategory(categoryId, subcategoryId ?? "")?.label ?? subcategory
    },
    file: { segment: `${file}.md`, title: entry.data.title },
    url: `/${entry.id}`,
    type: {
      id: typeOf(entry),
      label: CONTENT_TYPES[typeOf(entry)].label
    }
  }
}

function buildRecent(entries: AnyEntry[]): LandingRecent[] {
  return entries
    .filter((entry) => entry.data.updatedAt instanceof Date)
    .sort(
      (a, b) =>
        (b.data.updatedAt as Date).getTime() -
        (a.data.updatedAt as Date).getTime()
    )
    .slice(0, 5)
    .map((entry) => {
      const meta = CATEGORIES[categoryOf(entry)]
      return {
        title: entry.data.title,
        url: `/${entry.id}`,
        category: { label: meta.label, color: meta.color },
        updatedAt: entry.data.updatedAt as Date
      }
    })
}

function getStats(entries: AnyEntry[]): LandingStats {
  const counted = CONTENT_TYPE_IDS.map((id) => ({
    id,
    label: CONTENT_TYPES[id].label,
    count: entries.filter((entry) => entry.data.type === id).length
  }))
    .filter((type) => type.count > 0)
    .sort((a, b) => b.count - a.count)

  const largest = counted[0]?.count ?? 1

  return {
    docs: entries.length,
    categories: CATEGORY_IDS.length,
    subcategories: countSubcategories(entries),
    tags: getAllTags(entries).length,
    types: counted.map((type) => ({
      ...type,
      share: type.count / largest
    })),
    categoryList: getCategoryCounts(entries).sort((a, b) => b.count - a.count),
    route: buildRoute(entries),
    recent: buildRecent(entries)
  }
}

export async function loadStats(): Promise<LandingStats> {
  return getStats(await getAllEntries())
}
