import { itemUrl, pickRandom } from "../parse"
import type { CommandMap } from "./types"

/** Atajos a una entrada personal concreta. */
const SHORTCUTS: Record<string, string> = {
  myjson: "/applications/apps-editors/myjson",
  myastro: "/applications/apps-editors/myastro",
  mynext: "/applications/apps-editors/mynext"
}

const shortcutCommands: CommandMap = Object.fromEntries(
  Object.entries(SHORTCUTS).map(([name, url]) => [
    name,
    { keepInput: true, run: (ctx) => ctx.go(url) }
  ])
)

/** Comandos que mueven al lector por el sitio. */
export const navegacionCommands: CommandMap = {
  ls: {
    description: "listar categorías como directorios",
    aliases: ["categories"],
    run: (ctx) =>
      ctx.print(
        ctx.categories.length > 0
          ? ctx.categories.map(({ id, label }) => `drwx  ${id}/  — ${label}`)
          : ["el índice todavía se está montando…"]
      )
  },

  tree: {
    description: "dibujar el árbol de categorías",
    run: (ctx) =>
      ctx.print([
        "angel.library/",
        ...ctx.categories.map(
          ({ id }, index) =>
            `${index === ctx.categories.length - 1 ? "└──" : "├──"} ${id}/`
        )
      ])
  },

  cd: {
    description: "navegar a una categoría o sección",
    args: true,
    keepInput: true,
    run: (ctx) => {
      const raw = ctx.args.trim()
      if (raw === "/" || raw === "~" || raw === "..") return ctx.go("/")

      const destination = raw.replace(/^\.\//, "").replace(/\/$/, "")
      if (destination === "search" || destination === "/search")
        return ctx.go("/search")
      if (destination === "tags" || destination === "/tags")
        return ctx.go("/tags")

      const category = ctx.categories.find(({ id }) => id === destination)
      if (category) return ctx.go(`/categories/${category.id}`)

      ctx.fail([
        "directorio no encontrado; ejecuta /ls para ver las categorías"
      ])
      ctx.setInput("")
    }
  },

  open: {
    description: "abrir un resultado anterior o una ruta",
    args: true,
    keepInput: true,
    run: (ctx) => {
      const position = Number.parseInt(ctx.args, 10)
      const selected =
        /^\d+$/.test(ctx.args) && position > 0
          ? ctx.results[position - 1]
          : undefined
      if (selected) return ctx.go(itemUrl(selected))
      if (ctx.args.startsWith("/")) return ctx.go(ctx.args)

      ctx.fail(["uso: /open <número de resultado|/ruta>"])
      ctx.setInput("")
    }
  },

  random: {
    description: "abrir un documento al azar",
    keepInput: true,
    run: (ctx) => {
      if (!ctx.docs?.length) {
        ctx.fail(["el índice todavía no está disponible"])
        ctx.setInput("")
        return
      }
      ctx.go(pickRandom(ctx.docs).url)
    }
  },

  home: {
    description: "ir al inicio de la biblioteca",
    keepInput: true,
    run: (ctx) => ctx.go("/")
  },

  back: {
    description: "volver a la página anterior",
    keepInput: true,
    run: (ctx) => {
      ctx.close?.()
      window.history.back()
    }
  },

  reload: {
    description: "recargar la página actual",
    keepInput: true,
    run: () => window.location.reload()
  },

  exit: {
    description: "cerrar la terminal global",
    keepInput: true,
    run: (ctx) => {
      if (ctx.close) ctx.close()
      else ctx.go("/")
    }
  },

  ...shortcutCommands
}
