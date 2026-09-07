import { useEffect, useState } from "react"
import { isTerminalTheme } from "../parse"
import type { TerminalEffect, TerminalTheme } from "../types"

const THEME_KEY = "angel:terminal-theme"

/** Tema del índice, compartido entre la página /search y el diálogo. */
export function useAppearance() {
  const [theme, setThemeState] = useState<TerminalTheme>("angel")
  const [effect, setEffect] = useState<TerminalEffect>("none")

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY)
    if (isTerminalTheme(stored)) setThemeState(stored)

    const syncTheme = (event: Event) => {
      const next = (event as CustomEvent<string>).detail
      if (isTerminalTheme(next)) setThemeState(next)
    }

    window.addEventListener(THEME_KEY, syncTheme)
    return () => window.removeEventListener(THEME_KEY, syncTheme)
  }, [])

  function setTheme(next: TerminalTheme) {
    setThemeState(next)
    window.localStorage.setItem(THEME_KEY, next)
    window.dispatchEvent(new CustomEvent(THEME_KEY, { detail: next }))
  }

  return { theme, effect, setTheme, setEffect }
}
