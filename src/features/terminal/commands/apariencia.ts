import { isTerminalTheme, pickRandom } from "../parse"
import { TERMINAL_THEMES } from "../types"
import type { CommandMap } from "./types"

/** Comandos que cambian el aspecto de la terminal. */
export const aparienciaCommands: CommandMap = {
  theme: {
    description: "consultar o cambiar el tema visual",
    args: true,
    aliases: ["bg"],
    run: (ctx) => {
      const argument = ctx.args.toLocaleLowerCase("es")

      if (!argument || argument === "list") {
        ctx.print([
          `tema actual: ${ctx.theme}`,
          `disponibles: ${TERMINAL_THEMES.join(", ")}`,
          "uso: /theme <nombre|next|random>"
        ])
        return
      }

      let requested: string = argument
      if (requested === "next") {
        const current = TERMINAL_THEMES.indexOf(ctx.theme)
        requested = TERMINAL_THEMES[(current + 1) % TERMINAL_THEMES.length]
      }
      if (requested === "random") {
        requested = pickRandom(
          TERMINAL_THEMES.filter((theme) => theme !== ctx.theme)
        )
      }

      if (!isTerminalTheme(requested)) {
        ctx.fail([
          `tema desconocido: ${ctx.args}`,
          `usa: ${TERMINAL_THEMES.join(", ")}`
        ])
        return
      }

      ctx.setTheme(requested)
      ctx.print([`tema aplicado: ${requested}`], "success")
    }
  },

  reset: {
    description: "restaurar la apariencia de la terminal",
    run: (ctx) => {
      ctx.setTheme("angel")
      ctx.setEffect("none")
      ctx.print(["apariencia restaurada"], "success")
    }
  }
}
