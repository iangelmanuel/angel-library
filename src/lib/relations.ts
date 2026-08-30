import { buildEntryMap, entryKey, type AnyEntry } from "./content"

/**
 * Relaciones entre entradas. Salen de tres sitios, sin declarar nada dos
 * veces: el campo `related`, los backlinks de quien apunta aquí, y los tags
 * compartidos. Las integraciones y recetas se detectan por `technologies`.
 */

export interface RelatedData {
  /** Declaradas en el campo `related` de esta entrada. */
  explicit: AnyEntry[]
  /** Entradas que apuntan a esta en su `related`. */
  backlinks: AnyEntry[]
  /** Integraciones que la incluyen en `technologies`. */
  integrations: AnyEntry[]
  /** Recetas que la incluyen en `technologies` o `related`. */
  recipes: AnyEntry[]
  /** Recursos externos relacionados. */
  resources: AnyEntry[]
  /** Hasta 6 entradas con tags en común. */
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

/** Falla el build si una referencia apunta a una entrada inexistente. */
export function validateContentRelations(all: AnyEntry[]): void {
  const entryMap = buildEntryMap(all)
  const errors = all.flatMap((entry) =>
    referencesOf(entry)
      .filter((ref) => !entryMap.has(ref))
      .map((ref) => `  ${entry.collection}/${entry.id} → "${ref}" no existe`)
  )

  if (errors.length > 0) {
    throw new Error(`[contenido] Referencias rotas:\n${errors.join("\n")}`)
  }
}

export function getRelated(
  entry: AnyEntry,
  all: AnyEntry[],
  entryMap: Map<string, AnyEntry> = buildEntryMap(all)
): RelatedData {
  const self = entryKey(entry)
  const seen = new Set<string>([self])

  /** Añade la entrada a un grupo si no salió ya en otro. */
  const take = (group: AnyEntry[], item: AnyEntry | undefined): boolean => {
    if (!item || seen.has(entryKey(item))) return false
    seen.add(entryKey(item))
    group.push(item)
    return true
  }

  const integrations: AnyEntry[] = []
  const recipes: AnyEntry[] = []
  const resources: AnyEntry[] = []
  const backlinks: AnyEntry[] = []

  for (const other of all) {
    if (entryKey(other) === self) continue
    const data = other.data as Refs
    const asTech = data.technologies?.includes(self) ?? false
    const asRelated = data.related?.includes(self) ?? false

    // Los grupos con nombre propio ganan a "Relacionado".
    if (other.collection === "integrations" && asTech) {
      if (take(integrations, other)) continue
    }
    if (other.collection === "recipes" && (asTech || asRelated)) {
      if (take(recipes, other)) continue
    }
    if (asRelated) {
      take(other.collection === "resources" ? resources : backlinks, other)
    }
  }

  const explicit: AnyEntry[] = []
  for (const ref of (entry.data as Refs).related ?? []) {
    const target = entryMap.get(ref)
    take(target?.collection === "resources" ? resources : explicit, target)
  }

  const myTags = new Set(entry.data.tags ?? [])
  const byTags = all
    .filter((other) => !seen.has(entryKey(other)))
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
