import { useEffect, useMemo, useState } from "react"
import { type SearchDoc, createFuse, loadSearchIndex } from "../search"
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

  const derived = useMemo(() => {
    if (docs === null) {
      return {
        fuse: null,
        tags: [] as TagIndexItem[],
        categories: [] as CategoryItem[]
      }
    }

    const counts = new Map<string, TagIndexItem>()
    const categoryIndex = new Map<string, CategoryItem>()
    for (const doc of docs) {
      categoryIndex.set(doc.categoryId, {
        id: doc.categoryId,
        label: doc.categoryLabel
      })
      for (const tag of doc.tags) {
        const key = tag.toLocaleLowerCase("es")
        const current = counts.get(key)
        counts.set(key, {
          tag: current?.tag ?? tag,
          count: (current?.count ?? 0) + 1
        })
      }
    }

    return {
      fuse: createFuse(docs),
      tags: [...counts.values()].sort(
        (a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "es")
      ),
      categories: [...categoryIndex.values()].sort((a, b) =>
        a.label.localeCompare(b.label, "es")
      )
    }
  }, [docs])

  return { docs, failed, ...derived }
}
