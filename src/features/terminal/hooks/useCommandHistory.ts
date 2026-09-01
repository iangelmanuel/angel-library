import { useEffect, useRef, useState } from "react"

const HISTORY_KEY = "angel:terminal-history"
const MAX_ENTRIES = 30

function readStored(value: string | null): string[] | null {
  try {
    const parsed = JSON.parse(value ?? "[]")
    if (!Array.isArray(parsed)) return []
    return parsed.filter((entry): entry is string => typeof entry === "string").slice(-MAX_ENTRIES)
  } catch {
    return null
  }
}

/** Historial con ↑ ↓, compartido entre terminales. */
export function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([])
  /** Posición; null = texto nuevo. */
  const [cursor, setCursor] = useState<number | null>(null)
  /** Borrador previo. */
  const draft = useRef("")

  useEffect(() => {
    const stored = readStored(window.localStorage.getItem(HISTORY_KEY))
    if (stored === null) window.localStorage.removeItem(HISTORY_KEY)
    else setHistory(stored)

    const sync = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail
      if (!Array.isArray(detail)) return
      setHistory(
        detail.filter((entry): entry is string => typeof entry === "string").slice(-MAX_ENTRIES)
      )
    }
    window.addEventListener(HISTORY_KEY, sync)
    return () => window.removeEventListener(HISTORY_KEY, sync)
  }, [])

  function save(entries: string[]) {
    setHistory(entries)
    setCursor(null)
    if (entries.length > 0) {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
    } else {
      window.localStorage.removeItem(HISTORY_KEY)
    }
    window.dispatchEvent(new CustomEvent(HISTORY_KEY, { detail: entries }))
  }

  return {
    history,
    cursor,

    remember: (command: string) => save([...history, command].slice(-MAX_ENTRIES)),
    clear: () => save([]),

    resetCursor: () => {
      setCursor(null)
      draft.current = ""
    },

    /** Comando anterior. */
    previous(currentInput: string): string | null {
      if (history.length === 0 || (currentInput !== "" && cursor === null)) return null

      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
      if (cursor === null) draft.current = currentInput
      setCursor(next)
      return history[next]
    },

    /** Comando siguiente o el borrador. */
    next(): string | null {
      if (cursor === null) return null

      const position = cursor + 1
      if (position >= history.length) {
        setCursor(null)
        return draft.current
      }
      setCursor(position)
      return history[position]
    }
  }
}
