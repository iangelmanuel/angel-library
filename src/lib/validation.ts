import { CATEGORY_IDS, getSubcategoriesForCategory } from "@/config/catalog"
import { CONTENT_TYPE_IDS, type ContentTypeId } from "@/config/content-types"
import type { AnyEntry } from "./content"

function referencesOf(entry: AnyEntry): string[] {
  const data = entry.data
  return [
    ...(data.related ?? []),
    ...(data.technologies ?? []),
    ...(data.libraries ?? [])
  ]
}

/** Falla si una referencia no existe. */
export function validateContentRelations(all: AnyEntry[]): void {
  const entryMap = new Map(all.map((entry) => [entry.id, entry]))
  const errors = all.flatMap((entry) =>
    referencesOf(entry)
      .filter((ref) => !entryMap.has(ref))
      .map((ref) => `  ${entry.id} → "${ref}" no existe`)
  )

  if (errors.length > 0) {
    throw new Error(`[contenido] Referencias rotas:\n${errors.join("\n")}`)
  }
}

/** La ruta debe corresponder a una categoría y subcarpeta del catálogo. */
export function validateContentStructure(all: AnyEntry[]): void {
  const errors = all.flatMap((entry) => {
    const segments = entry.id.split("/")
    if (segments.length < 2 || segments.length > 3) {
      return [
        `  ${entry.id} → se esperaba <categoría>/<subcategoría>/<archivo>`
      ]
    }

    const [category, subcategory] = segments
    if (!CATEGORY_IDS.includes(category)) {
      return [`  ${entry.id} → "${category}" no es una categoría`]
    }

    if (segments.length === 3) {
      const valid = getSubcategoriesForCategory(category)
      if (!valid.some((group) => group.id === subcategory)) {
        return [
          `  ${entry.id} → "${subcategory}" no es una subcategoría de "${category}"`
        ]
      }
    }

    return []
  })

  if (errors.length > 0) {
    throw new Error(
      `[contenido] Revisa las carpetas dentro de src/content/docs/:\n${errors.join("\n")}`
    )
  }
}

/** Enlaces internos del cuerpo. */
const INTERNAL_LINK = /\]\((\/[^)\s#]*)(?:#[^)]*)?\)/g

/** Falla si un enlace interno no existe. */
export function validateInternalLinks(all: AnyEntry[]): void {
  const ids = new Set(all.map((entry) => entry.id))
  const errors: string[] = []

  for (const entry of all) {
    for (const [, href] of (entry.body ?? "").matchAll(INTERNAL_LINK)) {
      const target = href.replace(/\/$/, "").slice(1)
      const [first, second] = target.split("/")

      const exists =
        target === "" ||
        target === "search" ||
        first === "tags" ||
        ids.has(target) ||
        (first === "categories" && CATEGORY_IDS.includes(second)) ||
        (first === "tipos" &&
          CONTENT_TYPE_IDS.includes(second as ContentTypeId))

      if (!exists)
        errors.push(`  ${entry.id} → "${href}" no lleva a ninguna parte`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`[contenido] Enlaces internos rotos:\n${errors.join("\n")}`)
  }
}
