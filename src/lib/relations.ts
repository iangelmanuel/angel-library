import {
  CATEGORY_IDS,
  CONTENT_TYPE_IDS,
  getSubcategoriesForCategory,
  type CategoryId,
  type ContentTypeId
} from "@/config/site"
import type { AnyEntry } from "./content"

/** Relaciones entre entradas y validaciones de build. */

interface RelatedData {
  /** Declaradas en `related`. */
  explicit: AnyEntry[]
  /** Quien apunta aquí. */
  backlinks: AnyEntry[]
  /** La incluyen en `technologies`. */
  integrations: AnyEntry[]
  /** La incluyen en `technologies`. */
  recipes: AnyEntry[]
  /** Recursos externos. */
  resources: AnyEntry[]
  /** Hasta 6, por tags en común. */
  byTags: AnyEntry[]
}

interface Refs {
  related?: string[]
  technologies?: string[]
  libraries?: string[]
}

function referencesOf(entry: AnyEntry): string[] {
  const data = entry.data as Refs
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

/** Falla si la carpeta no está declarada en site.ts. */
export function validateContentStructure(all: AnyEntry[]): void {
  const errors = all.flatMap((entry) => {
    const segments = entry.id.split("/")
    if (segments.length < 2 || segments.length > 3) {
      return [`  ${entry.id} → se esperaba <categoría>/<subcategoría>/<archivo>`]
    }

    const [category, subcategory] = segments
    if (!CATEGORY_IDS.includes(category as CategoryId)) {
      return [`  ${entry.id} → "${category}" no es una categoría`]
    }

    if (segments.length === 3) {
      const valid = getSubcategoriesForCategory(category as CategoryId)
      if (!valid.some((group) => group.id === subcategory)) {
        return [`  ${entry.id} → "${subcategory}" no es una subcategoría de "${category}"`]
      }
    }

    return []
  })

  if (errors.length > 0) {
    throw new Error(
      `[contenido] Carpetas desconocidas (declara la categoría o la subcategoría en src/config/site.ts):\n${errors.join("\n")}`
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
        (first === "categories" && CATEGORY_IDS.includes(second as CategoryId)) ||
        (first === "tipos" && CONTENT_TYPE_IDS.includes(second as ContentTypeId))

      if (!exists) errors.push(`  ${entry.id} → "${href}" no lleva a ninguna parte`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`[contenido] Enlaces internos rotos:\n${errors.join("\n")}`)
  }
}

export function getRelated(
  entry: AnyEntry,
  all: AnyEntry[],
  entryMap: Map<string, AnyEntry> = new Map(all.map((item) => [item.id, item]))
): RelatedData {
  const self = entry.id
  const seen = new Set<string>([self])

  /** Añade sin repetir. */
  const take = (group: AnyEntry[], item: AnyEntry | undefined): boolean => {
    if (!item || seen.has(item.id)) return false
    seen.add(item.id)
    group.push(item)
    return true
  }

  const integrations: AnyEntry[] = []
  const recipes: AnyEntry[] = []
  const resources: AnyEntry[] = []
  const backlinks: AnyEntry[] = []

  for (const other of all) {
    if (other.id === self) continue
    const data = other.data as Refs
    const asTech = data.technologies?.includes(self) ?? false
    const asRelated = data.related?.includes(self) ?? false

    // Grupo con nombre propio gana a "Relacionado".
    if (other.data.type === "integrations" && asTech) {
      if (take(integrations, other)) continue
    }
    if (other.data.type === "recipes" && (asTech || asRelated)) {
      if (take(recipes, other)) continue
    }
    if (asRelated) {
      take(other.data.type === "resources" ? resources : backlinks, other)
    }
  }

  const explicit: AnyEntry[] = []
  for (const ref of (entry.data as Refs).related ?? []) {
    const target = entryMap.get(ref)
    take(target?.data.type === "resources" ? resources : explicit, target)
  }

  const myTags = new Set(entry.data.tags ?? [])
  const byTags = all
    .filter((other) => !seen.has(other.id))
    .map((other) => ({
      other,
      shared: (other.data.tags ?? []).filter((tag) => myTags.has(tag)).length
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        a.other.data.title.localeCompare(b.other.data.title, "es")
    )
    .slice(0, 6)
    .map(({ other }) => other)

  return { explicit, backlinks, integrations, recipes, resources, byTags }
}
