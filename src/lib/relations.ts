import type { AnyEntry } from "./content"

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
    const data = other.data
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
  for (const ref of entry.data.related ?? []) {
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
