import fs from "node:fs"
import path from "node:path"
import { CATEGORY_LIST, DOCS_DIR, NAVIGATION_GROUPS } from "./catalog.ts"
import {
  CONTENT_TYPES,
  type ContentTypeId,
  isLearningContentType
} from "./content-types.ts"

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

interface ParsedSidebarLink extends SidebarLink {
  type?: ContentTypeId
  order?: number
}

interface SidebarGroup {
  label: string
  collapsed: true
  items: (SidebarLink | SidebarGroup)[]
}

function frontmatterValue(
  frontmatter: string,
  field: string
): string | undefined {
  return new RegExp(`^${field}:\\s*(.+)$`, "m").exec(frontmatter)?.[1]?.trim()
}

/** Título del frontmatter; privadas y borradores no aparecen en el menú. */
function readDoc(file: string): ParsedSidebarLink | null {
  const raw = fs.readFileSync(file, "utf8")
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw)?.[1]
  if (!frontmatter) return null

  const isHidden = ["private", "draft"].some(
    (field) => frontmatterValue(frontmatter, field) === "true"
  )
  if (isHidden) {
    return null
  }

  const title = frontmatterValue(frontmatter, "title")
  if (!title) return null

  const type = frontmatterValue(frontmatter, "type") as
    ContentTypeId | undefined
  const orderValue = frontmatterValue(frontmatter, "order")
  const order = orderValue === undefined ? undefined : Number(orderValue)

  return {
    label: title.replace(/^["']|["']$/g, ""),
    link:
      "/" +
      path.relative(DOCS_DIR, file).replace(/\\/g, "/").replace(/\.md$/, ""),
    type,
    order: Number.isFinite(order) ? order : undefined
  }
}

function compareDocs(a: ParsedSidebarLink, b: ParsedSidebarLink): number {
  const aLearning = a.type !== undefined && isLearningContentType(a.type)
  const bLearning = b.type !== undefined && isLearningContentType(b.type)

  if (aLearning && bLearning) {
    const typeOrder =
      CONTENT_TYPES[a.type as ContentTypeId].learningOrder -
      CONTENT_TYPES[b.type as ContentTypeId].learningOrder
    const moduleOrder = (a.order ?? Infinity) - (b.order ?? Infinity)
    return typeOrder || moduleOrder || a.label.localeCompare(b.label, "es")
  }

  // Los módulos de consulta no reciben una prioridad didáctica nueva.
  if (aLearning !== bLearning) return aLearning ? -1 : 1
  return a.label.localeCompare(b.label, "es")
}

function docsIn(directory: string): SidebarLink[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => readDoc(path.join(directory, entry.name)))
    .filter((entry): entry is ParsedSidebarLink => entry !== null)
    .sort(compareDocs)
    .map(({ label, link }) => ({ label, link }))
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
