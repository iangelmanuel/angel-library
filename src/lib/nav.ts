import {
  CATEGORIES,
  CATEGORY_GROUPS,
  CONTENT_TYPES,
  STACKS,
  type CategoryId,
  type ContentTypeId
} from "@/config/site"
import { getCategoryEntries, getEntryUrl, sortByLearningPath, type AnyEntry } from "./content"

/** Datos de la sidebar (Astro) y del menú móvil (React). */

export interface NavItem {
  title: string
  url: string
  icon: string
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

export interface NavCategory {
  id: CategoryId
  label: string
  icon: string
  color: string
  /** Entradas sin subcategoría, sueltas bajo la categoría. */
  items: NavItem[]
  /** Subcategorías desplegables (por stack o por tipo de recurso). */
  groups: NavGroup[]
}

export interface NavData {
  groups: { id: string; categories: NavCategory[] }[]
}

/** Iconos de marca que ganan al icono del tipo o del stack. */
const ICON_OVERRIDES: Record<string, string> = {
  "libraries/zod": "brand-zod",
  "guides/typescript-path-aliases": "brand-typescript",
  "patterns/site-config-global": "brand-typescript",
  "hooks/*": "brand-typescript",
  "libraries/*": "stack-dependency"
}

const LANGUAGE_ICONS: Record<string, string> = {
  css: "brand-css",
  typescript: "brand-typescript"
}

/** Icono de una entrada: excepción, stack, lenguaje o tipo. */
function iconFor(entry: AnyEntry): string {
  const override =
    ICON_OVERRIDES[`${entry.collection}/${entry.id}`] ??
    ICON_OVERRIDES[`${entry.collection}/*`]
  if (override) return override

  if (entry.data.stack) return STACKS[entry.data.stack].icon

  const language = (entry.data as { language?: string }).language
  return (
    (language && LANGUAGE_ICONS[language]) ||
    CONTENT_TYPES[entry.collection as ContentTypeId].icon
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

  // Un bloque entero vacío no dibuja su separador.
  return {
    groups: CATEGORY_GROUPS.map((group) => ({
      id: group.id,
      categories: (group.categories as readonly CategoryId[])
        .map((id) => buildCategory(all, id))
        .filter(hasContent)
    })).filter((group) => group.categories.length > 0)
  }
}
