import { CATEGORIES } from "@/config/categories"
import {
  type AnyEntry,
  categoryOf,
  getAllEntries,
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
  categoryList: LandingCategoryCount[]
  recent: LandingRecent[]
}

function countSubcategories(entries: AnyEntry[]): number {
  const seen = new Set<string>()

  for (const entry of entries) {
    const subcategory = subcategoryOf(entry)
    if (subcategory) seen.add(`${categoryOf(entry)}/${subcategory}`)
  }

  return seen.size
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
    categoryList: getCategoryCounts(entries),
    recent: buildRecent(entries)
  }
}

export async function loadStats(): Promise<LandingStats> {
  return getStats(await getAllEntries())
}
