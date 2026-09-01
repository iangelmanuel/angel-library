import type { CSSProperties } from "react"
import { DynamicIcon } from "@/components/shared/DynamicIcon"
import { findCommand } from "../commands"

interface Props {
  commands: readonly string[]
  selectedIndex: number
  listboxId: string
  optionId: (index: number) => string
  onHover: (index: number) => void
  onSelect: (command: string) => void
}

/** Autocompletado que aparece al escribir "/". */
export function CommandOptions({
  commands,
  selectedIndex,
  listboxId,
  optionId,
  onHover,
  onSelect
}: Props) {
  return (
    <div
      id={listboxId}
      className="search-terminal__menu search-terminal__command-menu"
      role="listbox"
      aria-label="Comandos disponibles"
    >
      {commands.map((command, index) => {
        const details = findCommand(command)
        return (
          <button
            id={optionId(index)}
            key={command}
            type="button"
            role="option"
            aria-selected={index === selectedIndex}
            tabIndex={-1}
            className="search-terminal__result search-terminal__command-option"
            style={{ "--result-accent": "var(--terminal-accent)" } as CSSProperties}
            onMouseEnter={() => onHover(index)}
            onClick={() => onSelect(command)}
          >
            <span className="search-terminal__cursor" aria-hidden="true">
              ❯
            </span>
            <DynamicIcon name="terminal" className="size-3.5 text-[var(--terminal-accent)]" />
            <span className="search-terminal__result-content">
              <strong>/{command}</strong>
              <small>{details?.description}</small>
            </span>
            <span className="search-terminal__result-meta">
              {details?.args ? "args" : "run"}
            </span>
          </button>
        )
      })}
    </div>
  )
}
