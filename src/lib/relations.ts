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

interface RelationIndex {
  byId: Map<string, AnyEntry>
  backlinks: Map<string, AnyEntry[]>
  technologyUsers: Map<string, AnyEntry[]>
  tagUsers: Map<string, AnyEntry[]>
}

const indexCache = new WeakMap<AnyEntry[], RelationIndex>()

function addToIndex(
  index: Map<string, AnyEntry[]>,
  key: string,
  entry: AnyEntry
): void {
  const entries = index.get(key) ?? []
  entries.push(entry)
  index.set(key, entries)
}

function buildIndex(all: AnyEntry[]): RelationIndex {
  const index: RelationIndex = {
    byId: new Map(all.map((entry) => [entry.id, entry])),
    backlinks: new Map(),
    technologyUsers: new Map(),
    tagUsers: new Map()
  }

  for (const entry of all) {
    for (const ref of entry.data.related ?? []) {
      addToIndex(index.backlinks, ref, entry)
    }
    for (const technology of entry.data.technologies ?? []) {
      addToIndex(index.technologyUsers, technology, entry)
    }
    for (const tag of entry.data.tags ?? []) {
      addToIndex(index.tagUsers, tag, entry)
    }
  }

  return index
}

function getIndex(all: AnyEntry[]): RelationIndex {
  const cached = indexCache.get(all)
  if (cached) return cached

  const index = buildIndex(all)
  indexCache.set(all, index)
  return index
}

export function getRelated(entry: AnyEntry, all: AnyEntry[]): RelatedData {
  const index = getIndex(all)
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

  for (const other of index.technologyUsers.get(self) ?? []) {
    if (other.data.type === "integrations") take(integrations, other)
    if (other.data.type === "recipes") take(recipes, other)
  }

  for (const other of index.backlinks.get(self) ?? []) {
    if (other.data.type === "recipes") take(recipes, other)
    else take(other.data.type === "resources" ? resources : backlinks, other)
  }

  const explicit: AnyEntry[] = []
  for (const ref of entry.data.related ?? []) {
    const target = index.byId.get(ref)
    take(target?.data.type === "resources" ? resources : explicit, target)
  }

  const myTags = new Set(entry.data.tags ?? [])
  const sharedTags = new Map<string, number>()
  for (const tag of myTags) {
    for (const other of index.tagUsers.get(tag) ?? []) {
      if (!seen.has(other.id)) {
        sharedTags.set(other.id, (sharedTags.get(other.id) ?? 0) + 1)
      }
    }
  }

  const byTags = [...sharedTags.entries()]
    .map(([id, shared]) => ({ other: index.byId.get(id), shared }))
    .filter((item): item is { other: AnyEntry; shared: number } =>
      Boolean(item.other)
    )
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        a.other.data.title.localeCompare(b.other.data.title, "es")
    )
    .slice(0, 6)
    .map(({ other }) => other)

  return { explicit, backlinks, integrations, recipes, resources, byTags }
}
