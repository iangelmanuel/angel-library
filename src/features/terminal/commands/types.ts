import type { SearchDoc } from "../search"
import type {
  CategoryItem,
  MenuItem,
  MessageTone,
  QuizQuestion,
  TagIndexItem,
  TerminalEffect,
  TerminalTheme
} from "../types"

/** Lo que un comando puede leer y hacer. */
export interface TerminalContext {
  /** Lo escrito entero: "/theme matrix". */
  command: string
  /** Solo los argumentos: "matrix". */
  args: string

  docs: SearchDoc[] | null
  categories: CategoryItem[]
  tags: TagIndexItem[]
  /** Comandos anteriores. */
  history: string[]
  /** Resultados previos, para /open <n>. */
  results: MenuItem[]

  theme: TerminalTheme
  effect: TerminalEffect
  scanlines: boolean
  quiz: QuizQuestion | null

  /** Responde en la salida. */
  print: (lines: string[], tone?: MessageTone) => void
  /** Responde con error. */
  fail: (lines: string[]) => void
  clearOutput: () => void
  clearHistory: () => void

  /** Deja texto en el prompt. */
  setInput: (value: string) => void
  /** Navega dentro del sitio. */
  go: (url: string) => void
  /** Abre una URL externa. */
  openExternal: (url: string) => void
  /** Cierra el diálogo. */
  close: (() => void) | undefined

  setTheme: (theme: TerminalTheme) => void
  setScanlines: (enabled: boolean) => void
  setEffect: (effect: TerminalEffect) => void
  setQuiz: (question: QuizQuestion | null) => void
}

export interface Command {
  /** Sin descripción = oculto. */
  description?: string
  /** Espera argumentos. */
  args?: boolean
  /** Alias del comando. */
  aliases?: readonly string[]
  /** No entra en el historial. */
  skipHistory?: boolean
  /** No vacía el prompt. */
  keepInput?: boolean
  run: (ctx: TerminalContext) => void
}

export type CommandMap = Record<string, Command>
