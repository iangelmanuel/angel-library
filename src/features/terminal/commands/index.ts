import { aparienciaCommands } from "./apariencia"
import { aprendizajeCommands } from "./aprendizaje"
import { busquedaCommands } from "./busqueda"
import { navegacionCommands } from "./navegacion"
import { secretosCommands } from "./secretos"
import { sesionCommands } from "./sesion"
import type { Command, CommandMap } from "./types"

export type { Command, TerminalContext } from "./types"

/** Un comando por nombre. */
const COMMANDS: CommandMap = {
  ...sesionCommands,
  ...navegacionCommands,
  ...busquedaCommands,
  ...aprendizajeCommands,
  ...aparienciaCommands,
  ...secretosCommands
}

/** Orden del autocompletado. */
export const PUBLIC_COMMANDS = [
  "help",
  "clear",
  "pwd",
  "ls",
  "stats",
  "tree",
  "history",
  "search",
  "diccionario",
  "google",
  "mdn",
  "npm",
  "caniuse",
  "quiz",
  "respuesta",
  "tip",
  "tags",
  "open",
  "cd",
  "random",
  "theme",
  "scanlines",
  "reset",
  "motd",
  "whoami",
  "date",
  "echo",
  "back",
  "reload",
  "home",
  "exit"
] as const

const named = Object.entries(COMMANDS)

// Un comando sin listar desaparecería del autocompletado sin avisar.
const listed = new Set<string>(PUBLIC_COMMANDS)
const missing = named
  .filter(([name, command]) => command.description && !listed.has(name))
  .map(([name]) => name)
const unknown = PUBLIC_COMMANDS.filter((name) => !COMMANDS[name])
if (missing.length > 0 || unknown.length > 0) {
  throw new Error(
    `[terminal] PUBLIC_COMMANDS desincronizado. Faltan: ${missing.join(", ") || "—"}. No existen: ${unknown.join(", ") || "—"}.`
  )
}

export const COMMAND_DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  named
    .filter(([, command]) => command.description)
    .map(([name, command]) => [name, command.description as string])
)

/** Comandos que esperan argumentos. */
export const COMMANDS_WITH_ARGS = new Set(
  named.filter(([, command]) => command.args).map(([name]) => name)
)

const BY_NAME = new Map<string, Command>()
for (const [name, command] of named) {
  BY_NAME.set(name, command)
  for (const alias of command.aliases ?? []) BY_NAME.set(alias, command)
}

/** Nombres válidos, alias incluidos. */
export const COMMAND_SET = new Set(BY_NAME.keys())

export function findCommand(name: string): Command | undefined {
  return BY_NAME.get(name)
}
