import type { CSSProperties } from "react"
import { DynamicIcon } from "@/components/shared/DynamicIcon"
import { documentPath, itemUrl } from "../parse"
import type { MenuItem } from "../types"

interface Props {
  items: MenuItem[]
  activeIndex: number
  listboxId: string
  label: string
  optionId: (index: number) => string
  onHover: (index: number) => void
  onSelect: () => void
}

/** Documentos y tags encontrados, numerados para usarlos con /open. */
export function ResultOptions({
  items,
  activeIndex,
  listboxId,
  label,
  optionId,
  onHover,
  onSelect
}: Props) {
  return (
    <div id={listboxId} className="search-terminal__menu" role="listbox" aria-label={label}>
      {items.map((item, index) => {
        const shared = {
          id: optionId(index),
          href: itemUrl(item),
          role: "option" as const,
          "aria-selected": index === activeIndex,
          tabIndex: -1,
          className: "search-terminal__result",
          onMouseEnter: () => onHover(index),
          onClick: onSelect
        }

        if (item.kind === "tag") {
          return (
            <a
              {...shared}
              key={`tag-${item.tag.tag}`}
              style={{ "--result-accent": "var(--accent-yellow)" } as CSSProperties}
            >
              <span className="search-terminal__cursor" aria-hidden="true">
                ❯
              </span>
              <DynamicIcon name="tags" className="size-3.5 text-[var(--accent-yellow)]" />
              <span className="search-terminal__result-content">
                <strong>
                  {index + 1}. #{item.tag.tag}
                </strong>
                <small>~/tags/{item.tag.tag}</small>
              </span>
              <span className="search-terminal__result-meta">
                {item.tag.count} doc{item.tag.count === 1 ? "" : "s"}
              </span>
            </a>
          )
        }

        const { doc } = item
        return (
          <a
            {...shared}
            key={doc.url}
            style={{ "--result-accent": `var(${doc.categoryColor})` } as CSSProperties}
          >
            <span className="search-terminal__cursor" aria-hidden="true">
              ❯
            </span>
            <span style={{ color: `var(${doc.categoryColor})` }}>
              <DynamicIcon name={doc.categoryIcon} className="size-3.5" />
            </span>
            <span className="search-terminal__result-content">
              <strong>
                {index + 1}. {doc.title}
              </strong>
              <small>~/{documentPath(doc)}</small>
            </span>
            <span className="search-terminal__result-meta">{doc.typeSingular}</span>
          </a>
        )
      })}
    </div>
  )
}
