import type { Command, CommandMap } from "./types"

/** Buscador externo: mismo comportamiento, distinta URL y textos. */
function externalSearch(options: {
  description: string
  usage: string[]
  /** Recibe el texto sin codificar. */
  url: (query: string) => string
  running: (query: string) => string
}): Command {
  return {
    description: options.description,
    args: true,
    run: (ctx) => {
      if (!ctx.args) {
        ctx.fail(options.usage)
        return
      }
      ctx.openExternal(options.url(ctx.args))
      ctx.print([options.running(ctx.args)], "success")
    }
  }
}

const google = (query: string) =>
  `https://www.google.com/search?hl=es&q=${encodeURIComponent(query)}`

/** Comandos que buscan, dentro de la biblioteca o fuera. */
export const busquedaCommands: CommandMap = {
  search: {
    description: "buscar documentación indexada",
    args: true,
    keepInput: true,
    run: (ctx) => {
      if (!ctx.args) {
        ctx.fail(["uso: /search <texto>"])
        ctx.setInput("")
        return
      }
      ctx.setInput(ctx.args)
    }
  },

  tags: {
    description: "entrar al modo de búsqueda por tags",
    args: true,
    keepInput: true,
    run: (ctx) => ctx.setInput(ctx.args ? `#${ctx.args}` : "#")
  },

  diccionario: {
    ...externalSearch({
      description: "buscar la definición de un término en Google",
      usage: [
        "uso: /diccionario <palabra o concepto>",
        "ejemplo: /diccionario closure"
      ],
      url: (query) => google(`define:${query}`),
      running: (query) => `abriendo en Google la definición de “${query}”…`
    }),
    aliases: ["define", "dict"]
  },

  google: externalSearch({
    description: "abrir una consulta en Google",
    usage: ["uso: /google <consulta>"],
    url: google,
    running: (query) => `buscando “${query}” en Google…`
  }),

  mdn: externalSearch({
    description: "buscar una tecnología web en MDN",
    usage: [
      "uso: /mdn <API, elemento o propiedad>",
      "ejemplo: /mdn AbortController"
    ],
    url: (query) =>
      `https://developer.mozilla.org/es/search?q=${encodeURIComponent(query)}`,
    running: (query) => `buscando “${query}” en MDN Web Docs…`
  }),

  npm: externalSearch({
    description: "buscar un paquete en npm",
    usage: ["uso: /npm <paquete o término>"],
    url: (query) =>
      `https://www.npmjs.com/search?q=${encodeURIComponent(query)}`,
    running: (query) => `buscando “${query}” en npm…`
  }),

  caniuse: externalSearch({
    description: "consultar compatibilidad entre navegadores",
    usage: [
      "uso: /caniuse <funcionalidad web>",
      "ejemplo: /caniuse container queries"
    ],
    url: (query) => `https://caniuse.com/?search=${encodeURIComponent(query)}`,
    running: (query) => `consultando la compatibilidad de “${query}”…`
  })
}
