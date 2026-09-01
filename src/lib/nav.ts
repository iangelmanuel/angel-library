import {
  CATEGORIES,
  CATEGORY_GROUPS,
  type CategoryId
} from "@/config/categories"
import { CONTENT_TYPES, type ContentTypeId } from "@/config/content-types"
import { SUBCATEGORIES } from "@/config/subcategories"
import {
  type AnyEntry,
  getCategoryEntries,
  getEntryUrl,
  sortByLearningPath,
  subcategoryOf
} from "./content"

/** Datos de la sidebar y del menú móvil. */

interface NavItem {
  title: string
  url: string
  icon: string
}

interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

interface NavCategory {
  id: CategoryId
  label: string
  icon: string
  color: string
  /** Entradas sueltas. */
  items: NavItem[]
  /** Subcategorías desplegables. */
  groups: NavGroup[]
}

export interface NavData {
  groups: { id: string; categories: NavCategory[] }[]
}

/** Excepciones por entrada. */
const ICON_BY_ENTRY: Record<string, string> = {
  "general/packages/zod": "brand-zod",
  "general/typescript/typescript-path-aliases": "brand-typescript",
  "general/config/site-config-global": "brand-typescript"
}

/** Excepciones por tipo. */
const ICON_BY_TYPE: Partial<Record<ContentTypeId, string>> = {
  hooks: "brand-typescript",
  libraries: "stack-dependency"
}

const LANGUAGE_ICONS: Record<string, string> = {
  css: "brand-css",
  typescript: "brand-typescript"
}

/** Icono de una entrada. */
function iconFor(entry: AnyEntry): string {
  const override = ICON_BY_ENTRY[entry.id] ?? ICON_BY_TYPE[entry.data.type]
  if (override) return override

  // En `resources` la subcategoría no tiene icono propio.
  const subcategory = subcategoryOf(entry)
  const icon = subcategory ? SUBCATEGORIES[subcategory]?.icon : undefined
  if (icon) return icon

  const language = (entry.data as { language?: string }).language
  return (
    (language && LANGUAGE_ICONS[language]) ||
    CONTENT_TYPES[entry.data.type].icon
  )
}

function toNavItems(entries: AnyEntry[]): NavItem[] {
  return sortByLearningPath(entries).map((entry) => ({
    title: entry.data.title,
    url: getEntryUrl(entry),
    icon: iconFor(entry)
  }))
}

function buildCategory(all: AnyEntry[], id: CategoryId): NavCategory {
  const { groups, ungrouped } = getCategoryEntries(all, id)

  return {
    ...CATEGORIES[id],
    items: toNavItems(ungrouped),
    groups: groups.map((group) => ({
      id: group.id,
      label: group.label,
      items: toNavItems(group.entries)
    }))
  }
}

export function buildNavData(all: AnyEntry[]): NavData {
  const hasContent = (category: NavCategory) =>
    category.items.length > 0 || category.groups.length > 0

  // Bloque vacío no dibuja separador.
  return {
    groups: CATEGORY_GROUPS.map((group) => ({
      id: group.id,
      categories: (group.categories as readonly CategoryId[])
        .map((id) => buildCategory(all, id))
        .filter(hasContent)
    })).filter((group) => group.categories.length > 0)
  }
}
