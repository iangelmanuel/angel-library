import { z } from "astro/zod"
import fs from "node:fs"
import path from "node:path"

/** Solo los bloques del menú. Las categorías se descubren en las carpetas. */
export const NAVIGATION_GROUPS = [
  { id: "construir", label: "Construir" },
  { id: "producto", label: "Producto" },
  { id: "flujo", label: "Flujo" },
  { id: "calidad", label: "Calidad" },
  { id: "referencia", label: "Referencia" }
] as const

export const DOCS_DIR = "src/content/docs"

const folderId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const subcategorySchema = z
  .object({
    label: z.string().min(1).optional(),
    description: z.string().optional(),
    // Algunas fichas existentes ocultan esta insignia bajo el título.
    badge: z.boolean().default(true)
  })
  .strict()

const metadataSchema = z
  .object({
    label: z.string().min(1).optional(),
    description: z.string().default(""),
    icon: z.string().min(1).default("folder"),
    color: z
      .string()
      .regex(/^--[a-z][a-z0-9-]*$/)
      .default("--accent-blue"),
    group: z
      .enum(NAVIGATION_GROUPS.map((group) => group.id))
      .default("referencia"),
    order: z.number().int().nonnegative().default(1000),
    subcategories: z.record(folderId, subcategorySchema).default({})
  })
  .strict()

export interface Subcategory {
  id: string
  label: string
  description?: string
  badge: boolean
}

export interface Category {
  id: string
  label: string
  description: string
  icon: string
  color: string
  group: (typeof NAVIGATION_GROUPS)[number]["id"]
  order: number
  subcategories: Subcategory[]
}

/** Lee únicamente carpetas reales, con nombres válidos para las URLs. */
function foldersIn(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => {
      if (!folderId.safeParse(entry.name).success) {
        throw new Error(
          "[catálogo] Nombre de carpeta inválido: " +
            path.join(directory, entry.name)
        )
      }
      return entry.name
    })
}

function labelFromFolder(id: string): string {
  return id
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function readMetadata(directory: string) {
  const file = path.join(directory, "_meta.json")
  try {
    const value: unknown = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, "utf8"))
      : {}
    return metadataSchema.parse(value)
  } catch (error) {
    throw new Error("[catálogo] Revisa " + file + ": " + String(error))
  }
}

/**
 * Una lectura por carga del módulo, durante build o arranque de desarrollo.
 * El navegador recibe HTML; no recorre el disco ni descarga el catálogo.
 */
export function readCatalog(directory = DOCS_DIR): Category[] {
  const categories = foldersIn(directory).map((id) => {
    const categoryDir = path.join(directory, id)
    const metadata = readMetadata(categoryDir)
    const folders = foldersIn(categoryDir)
    const configured = Object.keys(metadata.subcategories).filter((id) =>
      folders.includes(id)
    )
    const automatic = folders.filter((id) => !configured.includes(id)).sort()
    const subcategories = [...configured, ...automatic].map((id) => {
      const details = metadata.subcategories[id]
      return {
        id,
        label: details?.label ?? labelFromFolder(id),
        description: details?.description,
        badge: details?.badge ?? true
      }
    })

    return {
      id,
      label: metadata.label ?? labelFromFolder(id),
      description: metadata.description,
      icon: metadata.icon,
      color: metadata.color,
      group: metadata.group,
      order: metadata.order,
      subcategories
    }
  })

  const labels = new Set<string>()
  for (const category of categories) {
    if (labels.has(category.label)) {
      throw new Error(
        '[catálogo] La etiqueta "' +
          category.label +
          '" está repetida. Ajusta _meta.json.'
      )
    }
    labels.add(category.label)
  }

  return categories.sort(
    (a, b) =>
      NAVIGATION_GROUPS.findIndex((group) => group.id === a.group) -
        NAVIGATION_GROUPS.findIndex((group) => group.id === b.group) ||
      a.order - b.order ||
      a.label.localeCompare(b.label, "es")
  )
}

export const CATEGORY_LIST = readCatalog()
export const CATEGORY_IDS = CATEGORY_LIST.map((category) => category.id)
export const CATEGORIES: Record<string, Category> = Object.fromEntries(
  CATEGORY_LIST.map((category) => [category.id, category])
)

export function getSubcategoriesForCategory(category: string): Subcategory[] {
  return CATEGORIES[category]?.subcategories ?? []
}

export function getSubcategory(
  category: string,
  subcategory?: string
): Subcategory | undefined {
  if (!subcategory) return undefined
  return getSubcategoriesForCategory(category).find(
    (item) => item.id === subcategory
  )
}

// Las categorías editoriales de recursos proceden de sus propias subcarpetas.
export const RESOURCE_CATEGORY_IDS = getSubcategoriesForCategory(
  "resources"
).map((item) => item.id)
export const RESOURCE_CATEGORIES: Record<string, string> = Object.fromEntries(
  getSubcategoriesForCategory("resources").map((item) => [item.id, item.label])
)
