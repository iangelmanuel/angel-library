import fs from "node:fs"
import path from "node:path"
import { CATEGORY_LIST, DOCS_DIR, NAVIGATION_GROUPS } from "./catalog"

/** Datos de presentación para el override de Starlight. */
export const SIDEBAR_GROUPS = NAVIGATION_GROUPS.map((group) => ({
  label: group.label,
  categories: CATEGORY_LIST.filter(
    (category) => category.group === group.id
  ).map((category) => category.label)
}))

export const CATEGORY_BY_LABEL = Object.fromEntries(
  CATEGORY_LIST.map((category) => [
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

/** Título del frontmatter; privadas y borradores no aparecen en el menú. */
function readDoc(file: string): SidebarLink | null {
  const raw = fs.readFileSync(file, "utf8")
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw)?.[1]
  if (!frontmatter || /^(private|draft):\s*true\s*$/m.test(frontmatter))
    return null

  const title = /^title:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim()
  if (!title) return null

  return {
    label: title.replace(/^["']|["']$/g, ""),
    link:
      "/" +
      path.relative(DOCS_DIR, file).replace(/\\/g, "/").replace(/\.md$/, "")
  }
}

function docsIn(directory: string): SidebarLink[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => readDoc(path.join(directory, entry.name)))
    .filter((entry): entry is SidebarLink => entry !== null)
    .sort((a, b) => a.label.localeCompare(b.label, "es"))
}

/** Categoría → subcategoría → artículos, sin registrar las carpetas otra vez. */
export function buildSidebar(): SidebarGroup[] {
  return CATEGORY_LIST.map((category) => ({
    label: category.label,
    collapsed: true as const,
    items: [
      ...docsIn(path.join(DOCS_DIR, category.id)),
      ...category.subcategories
        .map((subcategory) => ({
          label: subcategory.label,
          collapsed: true as const,
          items: docsIn(path.join(DOCS_DIR, category.id, subcategory.id))
        }))
        .filter((subcategory) => subcategory.items.length > 0)
    ]
  })).filter((category) => category.items.length > 0)
}
