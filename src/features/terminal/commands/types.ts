import type { SearchDoc } from "@/lib/search"
import type {
  CategoryItem,
  MenuItem,
  MessageTone,
  QuizQuestion,
  TagIndexItem,
  TerminalEffect,
  TerminalTheme
} from "../types"

/**
 * Todo lo que un comando puede leer y hacer. La terminal lo arma en cada
 * ejecución; los comandos no conocen React ni el estado interno.
 */
export interface TerminalContext {
  /** El comando completo tal como se escribió: "/theme matrix". */
  command: string
  /** Lo escrito después del nombre: en "/theme matrix" es "matrix". */
  args: string

  docs: SearchDoc[] | null
  categories: CategoryItem[]
  tags: TagIndexItem[]
  /** Comandos anteriores, sin incluir el que se está ejecutando. */
  history: string[]
  /** Resultados que se mostraban antes, para /open <n>. */
  results: MenuItem[]

  theme: TerminalTheme
  effect: TerminalEffect
  scanlines: boolean
  quiz: QuizQuestion | null

  /** Escribe una respuesta en la salida. */
  print: (lines: string[], tone?: MessageTone) => void
  /** Escribe una respuesta marcada como error. */
  fail: (lines: string[]) => void
  clearOutput: () => void
  clearHistory: () => void

  /** Deja este texto en el prompt en vez de vaciarlo. */
  setInput: (value: string) => void
  /** Navega dentro del sitio; ignora rutas externas. */
  go: (url: string) => void
  /** Abre una URL https en otra pestaña. */
  openExternal: (url: string) => void
  /** Cierra la terminal si está en diálogo. */
  close: (() => void) | undefined

  setTheme: (theme: TerminalTheme) => void
  setScanlines: (enabled: boolean) => void
  setEffect: (effect: TerminalEffect) => void
  setQuiz: (question: QuizQuestion | null) => void
}

export interface Command {
  /** Texto del autocompletado. Sin descripción = comando oculto. */
  description?: string
  /** Espera argumentos: al completar con Tab se añade un espacio. */
  args?: boolean
  /** Otros nombres que ejecutan lo mismo. */
  aliases?: readonly string[]
  /** No se guarda en el historial. */
  skipHistory?: boolean
  /** No vacía el prompt al terminar; el comando decide qué queda. */
  keepInput?: boolean
  run: (ctx: TerminalContext) => void
}

export type CommandMap = Record<string, Command>
