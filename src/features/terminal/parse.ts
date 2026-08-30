import type { SearchDoc } from "@/lib/search"
import { TERMINAL_THEMES, type InputMode, type MenuItem, type TerminalTheme } from "./types"

/** Decide si el usuario está buscando, filtrando tags o ejecutando algo. */
export function parseInput(value: string): InputMode {
  const trimmed = value.trim()

  if (trimmed.startsWith("#")) {
    return { kind: "tags", needle: trimmed.slice(1).trim() }
  }

  if (trimmed.startsWith("/")) {
    const [rawName = "", ...parts] = trimmed.slice(1).trimStart().split(/\s+/)
    return {
      kind: "command",
      name: rawName.toLocaleLowerCase("es"),
      args: parts.join(" ").trim()
    }
  }

  return { kind: "documents", needle: trimmed }
}

/** Ruta estilo terminal que se muestra debajo de cada resultado. */
export function documentPath(doc: SearchDoc): string {
  const name = doc.url.split("/").filter(Boolean).at(-1) ?? "document"
  return `${doc.categoryId}/${name}`
}

export function itemUrl(item: MenuItem): string {
  return item.kind === "document"
    ? item.doc.url
    : `/tags/${encodeURIComponent(item.tag.tag)}`
}

export function isTerminalTheme(value: string | null): value is TerminalTheme {
  return TERMINAL_THEMES.includes(value as TerminalTheme)
}

/** Sin acentos ni mayúsculas, para comparar temas escritos a mano. */
export function normalizeKeyword(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es")
}

/** Elige un elemento al azar. */
export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
