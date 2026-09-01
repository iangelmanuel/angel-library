import {
  BANNER_LINES,
  BUG_LINES,
  CAT_LINES,
  COFFEE_LINES,
  DUCK_LINES,
  FORTUNES,
  JOKES
} from "../data/ascii"
import { pickRandom } from "../parse"
import { TERMINAL_THEMES } from "../types"
import type { CommandMap } from "./types"

/** Respuestas fijas: solo imprimen y ya. */
const REPLIES: Record<string, { lines: string[]; tone?: "error" | "success" }> =
  {
    cat: { lines: [...CAT_LINES, "miau: índice protegido."] },
    coffee: { lines: COFFEE_LINES, tone: "success" },
    bug: { lines: BUG_LINES },
    duck: { lines: DUCK_LINES },
    banner: { lines: BANNER_LINES, tone: "success" },
    ping: { lines: ["pong — 0.042 ms desde localhost"], tone: "success" },
    hello: {
      lines: ["hola, dev. Todo sistema saludable comienza con curiosidad."],
      tone: "success"
    },
    "42": {
      lines: ["42 — la respuesta era sencilla; la pregunta sigue en backlog."],
      tone: "success"
    },
    sudo: {
      lines: [
        "dev no está en el archivo sudoers. Este intento será documentado."
      ],
      tone: "error"
    },
    rm: {
      lines: [
        "operación bloqueada: este segundo cerebro sí hace copias de seguridad."
      ],
      tone: "error"
    }
  }

const replyCommands: CommandMap = Object.fromEntries(
  Object.entries(REPLIES).map(([name, { lines, tone }]) => [
    name,
    { run: (ctx) => ctx.print(lines, tone) }
  ])
)

/** Comandos ocultos: no aparecen en /help ni en el autocompletado. */
export const secretosCommands: CommandMap = {
  ...replyCommands,

  fortune: {
    run: (ctx) => ctx.print([pickRandom(FORTUNES)])
  },

  joke: {
    run: (ctx) => ctx.print([pickRandom(JOKES)])
  },

  matrix: {
    run: (ctx) => {
      ctx.setTheme("matrix")
      ctx.setEffect("none")
      ctx.print(
        [
          "wake up, dev…",
          "the docs have you.",
          "follow the white rabbit: /cat"
        ],
        "success"
      )
    }
  },

  party: {
    run: (ctx) => {
      const theme = pickRandom(
        TERMINAL_THEMES.filter((item) => item !== ctx.theme)
      )
      ctx.setTheme(theme)
      ctx.setEffect("rainbow")
      ctx.print(
        [`♪ tema ${theme} desbloqueado · /rainbow para detener ♪`],
        "success"
      )
    }
  },

  rainbow: {
    run: (ctx) => {
      const next = ctx.effect === "rainbow" ? "none" : "rainbow"
      ctx.setEffect(next)
      ctx.print(
        [`rainbow mode: ${next === "rainbow" ? "on" : "off"}`],
        "success"
      )
    }
  }
}
