import { useEffect, useState } from "react"
import { isTerminalTheme } from "../parse"
import type { TerminalEffect, TerminalTheme } from "../types"

const THEME_KEY = "angel:terminal-theme"
const SCANLINES_KEY = "angel:terminal-scanlines"

/** Tema y efectos, compartidos entre las dos terminales. */
export function useAppearance() {
  const [theme, setThemeState] = useState<TerminalTheme>("default")
  const [scanlines, setScanlinesState] = useState(true)
  const [effect, setEffect] = useState<TerminalEffect>("none")

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY)
    if (isTerminalTheme(stored)) setThemeState(stored)
    setScanlinesState(window.localStorage.getItem(SCANLINES_KEY) !== "off")

    const syncTheme = (event: Event) => {
      const next = (event as CustomEvent<string>).detail
      if (isTerminalTheme(next)) setThemeState(next)
    }
    const syncScanlines = (event: Event) => {
      setScanlinesState((event as CustomEvent<boolean>).detail)
    }

    window.addEventListener(THEME_KEY, syncTheme)
    window.addEventListener(SCANLINES_KEY, syncScanlines)
    return () => {
      window.removeEventListener(THEME_KEY, syncTheme)
      window.removeEventListener(SCANLINES_KEY, syncScanlines)
    }
  }, [])

  function setTheme(next: TerminalTheme) {
    setThemeState(next)
    window.localStorage.setItem(THEME_KEY, next)
    window.dispatchEvent(new CustomEvent(THEME_KEY, { detail: next }))
  }

  function setScanlines(enabled: boolean) {
    setScanlinesState(enabled)
    window.localStorage.setItem(SCANLINES_KEY, enabled ? "on" : "off")
    window.dispatchEvent(new CustomEvent(SCANLINES_KEY, { detail: enabled }))
  }

  return { theme, scanlines, effect, setTheme, setScanlines, setEffect }
}
