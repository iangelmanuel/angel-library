import type { SearchDoc } from "./search"

export interface TagIndexItem {
  tag: string
  count: number
}

export interface CategoryItem {
  id: string
  label: string
}

/** Una línea del historial visible: el comando y su respuesta. */
export interface TerminalMessage {
  id: number
  command: string
  lines: string[]
  tone?: MessageTone
}

export type MessageTone = "default" | "error" | "success"

export interface QuizQuestion {
  topic: string
  question: string
  choices: readonly string[]
  answer: number
  explanation: string
}

export interface TerminalProps {
  variant?: "page" | "dialog"
  onRequestClose?: () => void
  initialInput?: string
}

/** Una opción de la lista de resultados. */
export type MenuItem =
  { kind: "document"; doc: SearchDoc } | { kind: "tag"; tag: TagIndexItem }

/** Qué está escribiendo el usuario: texto, #tag o /comando. */
export type InputMode =
  | { kind: "documents"; needle: string }
  | { kind: "tags"; needle: string }
  | { kind: "command"; name: string; args: string }

/** Temas del índice. Todos viven dentro del mundo del sitio: negro, la
    escala azul, grises neutros y blanco. Ninguno sale de la paleta. */
export const TERMINAL_THEMES = [
  "angel",
  "esmalte",
  "tinta",
  "niebla",
  "hielo"
] as const

export type TerminalTheme = (typeof TERMINAL_THEMES)[number]
export type TerminalEffect = "none"

export const MAX_RESULTS = 12
