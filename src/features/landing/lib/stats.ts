import { CATEGORIES } from "@/config/categories"
import {
  type AnyEntry,
  categoryOf,
  getAllEntries,
  getAllTags,
  getCategoryCounts,
  subcategoryOf
} from "@/lib/content"

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

  const categoryMeta = CATEGORIES[categoryId as keyof typeof CATEGORIES]
  const subMeta = (
    categoryMeta.subcategories as Record<string, { label: string }>
  )[subcategoryId ?? ""]

  return {
    root: "src/content/docs/",
    category: {
      segment: `${category}/`,
      label: categoryMeta.label,
      href: `/categories/${categoryId}`
    },
    subcategory: {
      segment: `${subcategory}/`,
      label: subMeta?.label ?? subcategory
    },
    file: { segment: `${file}.md`, title: entry.data.title },
    url: `/${entry.id}`
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
      const meta = CATEGORIES[categoryOf(entry) as keyof typeof CATEGORIES]
      return {
        title: entry.data.title,
        url: `/${entry.id}`,
        category: { label: meta.label, color: meta.color },
        updatedAt: entry.data.updatedAt as Date
      }
    })
}

function getStats(entries: AnyEntry[]): LandingStats {
  return {
    docs: entries.length,
    categories: Object.keys(CATEGORIES).length,
    subcategories: countSubcategories(entries),
    tags: getAllTags(entries).length,
    categoryList: getCategoryCounts(entries).sort((a, b) => b.count - a.count),
    route: buildRoute(entries),
    recent: buildRecent(entries)
  }
}

export async function loadStats(): Promise<LandingStats> {
  return getStats(await getAllEntries())
}
