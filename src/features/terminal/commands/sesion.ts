import type { CommandMap } from "./types"

const HELP_LINES = [
  "/search <texto>   pasar a una búsqueda de documentación",
  "/diccionario <término>  buscar una definición en Google",
  "/google <consulta> · /mdn <tema> · /npm <paquete>",
  "/caniuse <función>      revisar soporte entre navegadores",
  "/quiz [tema] · /respuesta <n|ver> · /tip [tema]",
  "/tags [texto]     listar o filtrar tags; #texto es el atajo directo",
  "/open <n|ruta>    abrir un resultado anterior o una ruta interna",
  "/ls               listar las categorías disponibles",
  "/cd <directorio>  entrar a una categoría, /search, /tags o /",
  "/stats            mostrar estadísticas del índice local",
  "/random           abrir un documento al azar",
  "/theme [nombre]   cambiar el fondo; usa /theme list para ver todos",
  "/scanlines [on|off] · /reset · /motd · /tree",
  "/pwd · /whoami · /date · /url · /echo <texto>",
  "/history          mostrar los últimos comandos ejecutados",
  "/clear | /cls     limpiar la salida de la terminal",
  "/back · /reload · /home · /exit",
  "tip: /cat, /coffee y /fortune son solo el comienzo…"
]

/** Comandos sobre la propia sesión: ayuda, salida, historial e identidad. */
export const sesionCommands: CommandMap = {
  help: {
    description: "mostrar comandos y ejemplos de uso",
    run: (ctx) => ctx.print(HELP_LINES)
  },

  clear: {
    description: "limpiar la salida sin borrar el historial",
    aliases: ["cls"],
    skipHistory: true,
    run: (ctx) => ctx.clearOutput()
  },

  history: {
    description: "ver o limpiar comandos anteriores",
    args: true,
    run: (ctx) => {
      if (ctx.args.toLocaleLowerCase("es") === "clear") {
        ctx.clearHistory()
        ctx.print(["historial eliminado"], "success")
        return
      }

      const entries = [...ctx.history, ctx.command]
      ctx.print(
        entries.map((entry, index) => `${String(index + 1).padStart(2, "0")}  ${entry}`)
      )
    }
  },

  stats: {
    description: "resumen del índice y de la sesión",
    run: (ctx) =>
      ctx.print(
        [
          `${ctx.docs?.length ?? 0} documentos indexados`,
          `${ctx.tags.length} tags únicos`,
          `${ctx.categories.length} categorías`,
          `${ctx.history.length + 1} comandos en esta sesión`
        ],
        "success"
      )
  },

  pwd: {
    description: "mostrar el directorio virtual actual",
    run: (ctx) => ctx.print(["~/angel.library"], "success")
  },

  whoami: {
    description: "mostrar la identidad de la sesión",
    run: (ctx) =>
      ctx.print(
        ["dev — constructor, depurador y archivista de este segundo cerebro"],
        "success"
      )
  },

  date: {
    description: "mostrar fecha y hora local",
    run: (ctx) =>
      ctx.print([
        new Intl.DateTimeFormat("es", {
          dateStyle: "full",
          timeStyle: "medium"
        }).format(new Date())
      ])
  },

  motd: {
    description: "mostrar el mensaje de la sesión",
    run: (ctx) =>
      ctx.print(
        [
          "Message Of The Day",
          "documenta lo que hoy parece obvio; mañana será contexto valioso.",
          `índice listo: ${ctx.docs?.length ?? 0} documentos disponibles`
        ],
        "success"
      )
  },

  echo: {
    description: "imprimir texto en la salida",
    args: true,
    run: (ctx) => ctx.print([ctx.args || ""])
  },

  url: {
    run: (ctx) =>
      ctx.print([window.location.pathname + window.location.search], "success")
  }
}
