import fs from "node:fs"
import path from "node:path"
import { CATEGORIES, CATEGORY_GROUPS } from "./categories"
import type { CategoryId } from "./categories"
import { getSubcategoriesForCategory } from "./subcategories"

const DOCS_DIR = "src/content/docs"

// Títulos de los bloques del menú.
const GROUP_LABELS: Record<string, string> = {
  construir: "Construir",
  producto: "Producto",
  flujo: "Flujo",
  calidad: "Calidad",
  referencia: "Referencia"
}

type SidebarItem =
  | { autogenerate: { directory: string } }
  | { label: string; collapsed: true; items: SidebarItem[] }

/** Carpetas reales de una categoría. */
function foldersOf(category: CategoryId): string[] {
  const dir = path.join(DOCS_DIR, category)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

/** Orden del config primero, el resto detrás. */
function sortedFolders(category: CategoryId): { id: string; label: string }[] {
  const folders = foldersOf(category)
  const known = getSubcategoriesForCategory(category)

  const preferred = known
    .filter((subcategory) => folders.includes(subcategory.id))
    .map((subcategory) => ({ id: subcategory.id, label: subcategory.label }))

  const rest = folders
    .filter((id) => !preferred.some((subcategory) => subcategory.id === id))
    .map((id) => ({ id, label: id }))

  return [...preferred, ...rest]
}

/** Menú de Starlight, tal como está en disco. */
export function buildSidebar(): SidebarItem[] {
  return CATEGORY_GROUPS.map((group) => ({
    label: GROUP_LABELS[group.id] ?? group.id,
    collapsed: true as const,
    items: (group.categories as readonly CategoryId[])
      .map((category) => ({
        label: CATEGORIES[category].label,
        collapsed: true as const,
        items: sortedFolders(category).map((subcategory) => ({
          label: subcategory.label,
          collapsed: true as const,
          items: [
            { autogenerate: { directory: `${category}/${subcategory.id}` } }
          ]
        }))
      }))
      .filter((category) => category.items.length > 0)
  })).filter((group) => group.items.length > 0)
}
