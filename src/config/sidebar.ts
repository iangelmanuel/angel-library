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

/** Los bloques y las categorías que lleva cada uno. */
export const SIDEBAR_GROUPS = CATEGORY_GROUPS.map((group) => ({
  label: GROUP_LABELS[group.id] ?? group.id,
  categories: (group.categories as readonly CategoryId[]).map(
    (category) => CATEGORIES[category].label
  )
}))

/** Icono y color de cada categoría, por su etiqueta. */
export const CATEGORY_BY_LABEL: Record<
  string,
  { icon: string; color: string }
> = Object.fromEntries(
  Object.values(CATEGORIES).map((category) => [
    category.label,
    { icon: category.icon, color: category.color }
  ])
)

interface SidebarLink {
  label: string
  link: string
}

interface SidebarGroup {
  label: string
  collapsed: true
  items: (SidebarLink | SidebarGroup)[]
}

interface Doc {
  title: string
  link: string
}

/** Carpetas de una categoría. */
function foldersOf(category: CategoryId): string[] {
  const dir = path.join(DOCS_DIR, category)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

/** Subcategorías en el orden del config, el resto detrás. */
function subcategoriesOf(
  category: CategoryId
): { id: string; label: string }[] {
  const folders = foldersOf(category)
  const known = getSubcategoriesForCategory(category)

  const ordered = known
    .filter((subcategory) => folders.includes(subcategory.id))
    .map((subcategory) => ({ id: subcategory.id, label: subcategory.label }))

  const rest = folders
    .filter((id) => !ordered.some((subcategory) => subcategory.id === id))
    .map((id) => ({ id, label: id }))

  return [...ordered, ...rest]
}

/** Título del frontmatter; fuera si es privada o borrador. */
function readDoc(file: string): Doc | null {
  const raw = fs.readFileSync(file, "utf8").slice(0, 1500)
  if (/^(private|draft):\s*true\s*$/m.test(raw)) return null

  const title = /^title:\s*(.+)$/m.exec(raw)?.[1]?.trim()
  if (!title) return null

  const link = file
    .replace(/\\/g, "/")
    .replace(`${DOCS_DIR}/`, "/")
    .replace(/\.md$/, "")

  return { title: title.replace(/^["']|["']$/g, ""), link }
}

/** Entradas de una carpeta, por título. */
function docsIn(dir: string): SidebarLink[] {
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => readDoc(path.join(dir, entry.name)))
    .filter((doc): doc is Doc => doc !== null)
    .sort((a, b) => a.title.localeCompare(b.title, "es"))
    .map((doc) => ({ label: doc.title, link: doc.link }))
}

/** Menú: categoría → subcategoría → entradas. */
export function buildSidebar(): SidebarGroup[] {
  const categories = CATEGORY_GROUPS.flatMap(
    (group) => group.categories as readonly CategoryId[]
  )

  return categories
    .map((category) => ({
      label: CATEGORIES[category].label,
      collapsed: true as const,
      items: [
        // Entradas sueltas en la raíz de la categoría.
        ...docsIn(path.join(DOCS_DIR, category)),
        ...subcategoriesOf(category)
          .map((subcategory) => ({
            label: subcategory.label,
            collapsed: true as const,
            items: docsIn(path.join(DOCS_DIR, category, subcategory.id))
          }))
          .filter((subcategory) => subcategory.items.length > 0)
      ]
    }))
    .filter((category) => category.items.length > 0)
}
