import { useMemo, useState } from "react"

interface TagItem {
  tag: string
  count: number
}

type SortMode = "frequency" | "alphabetical"

export default function TagExplorer({ tags }: { tags: TagItem[] }) {
  const [query, setQuery] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("frequency")

  const visibleTags = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es")
    const filtered = normalizedQuery
      ? tags.filter(({ tag }) =>
          tag.toLocaleLowerCase("es").includes(normalizedQuery)
        )
      : [...tags]

    return filtered.sort((a, b) =>
      sortMode === "frequency"
        ? b.count - a.count || a.tag.localeCompare(b.tag, "es")
        : a.tag.localeCompare(b.tag, "es")
    )
  }, [query, sortMode, tags])

  return (
    <div className="tag-explorer">
      <div className="terminal-toolbar">
        <span
          className="terminal-toolbar__prompt"
          aria-hidden="true"
        >
          $
        </span>
        <label
          className="sr-only"
          htmlFor="tag-filter"
        >
          Filtrar tags
        </label>
        <input
          id="tag-filter"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="grep --tags nombre"
          autoComplete="off"
        />
        <span
          className="terminal-toolbar__count"
          aria-hidden="true"
        >
          {visibleTags.length}/{tags.length}
        </span>
      </div>

      <div className="tag-explorer__controls">
        <span className="text-muted-foreground">orden:</span>
        <button
          type="button"
          className="terminal-toggle"
          aria-pressed={sortMode === "frequency"}
          onClick={() => setSortMode("frequency")}
        >
          frecuencia
        </button>
        <button
          type="button"
          className="terminal-toggle"
          aria-pressed={sortMode === "alphabetical"}
          onClick={() => setSortMode("alphabetical")}
        >
          a—z
        </button>
      </div>

      <p
        className="sr-only"
        aria-live="polite"
      >
        {visibleTags.length} tag{visibleTags.length === 1 ? "" : "s"} visible
        {query ? ` para ${query}` : ""}.
      </p>

      {visibleTags.length > 0 ? (
        <div className="tag-grid">
          {visibleTags.map(({ tag, count }) => (
            <a
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="tag tag--tile"
            >
              <span className="tag__name">{tag}</span>
              <span
                className="tag__count"
                aria-label={`${count} entradas`}
              >
                {count}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p className="terminal-empty">
          <span aria-hidden="true">exit 1:</span> no hay tags que coincidan con
          “{query}”
        </p>
      )}
    </div>
  )
}
