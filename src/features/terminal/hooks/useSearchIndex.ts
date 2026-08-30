import { useEffect, useMemo, useState } from "react"
import { createFuse, loadSearchIndex, type SearchDoc } from "@/lib/search"
import type { CategoryItem, TagIndexItem } from "../types"

/**
 * Descarga el índice una vez y deriva de él lo que la terminal consulta:
 * el buscador, los tags y las categorías.
 */
export function useSearchIndex() {
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    loadSearchIndex()
      .then(setDocs)
      .catch(() => {
        setDocs([])
        setFailed(true)
      })
  }, [])

  const fuse = useMemo(() => (docs ? createFuse(docs) : null), [docs])

  const tags = useMemo<TagIndexItem[]>(() => {
    if (!docs) return []

    const counts = new Map<string, TagIndexItem>()
    for (const doc of docs) {
      for (const tag of doc.tags) {
        const key = tag.toLocaleLowerCase("es")
        const current = counts.get(key)
        counts.set(key, { tag: current?.tag ?? tag, count: (current?.count ?? 0) + 1 })
      }
    }

    return [...counts.values()].sort(
      (a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "es")
    )
  }, [docs])

  const categories = useMemo<CategoryItem[]>(() => {
    if (!docs) return []

    const index = new Map<string, CategoryItem>()
    for (const doc of docs) {
      index.set(doc.categoryId, { id: doc.categoryId, label: doc.categoryLabel })
    }

    return [...index.values()].sort((a, b) => a.label.localeCompare(b.label, "es"))
  }, [docs])

  return { docs, failed, fuse, tags, categories }
}
