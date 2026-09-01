import { SKIP, visit } from "unist-util-visit"

/** Traduce instalaciones entre npm, pnpm y Bun y crea sus pestañas Markdown. */

const INSTALL_RE = /^(npm|pnpm|bun)\s+(install|i|add)\b(.*)$/
const ASTRO_ADD_RE = /^(?:npx\s+astro|pnpm\s+astro|bunx\s+astro)\s+add\s+(.+)$/
const RUNNER_RE = /^(npx|pnpm\s+dlx|bunx)\s+(.+)$/
const CREATE_RE = /^(npm|pnpm|bun)\s+(create|init)\b(.*)$/
const KNOWN_FLAGS = new Set(["-D", "-d", "--save-dev", "-g", "--global"])
const PM_LANGS = new Set(["bash", "sh", "shell"])

function splitArgs(rest) {
  const tokens = rest.trim().split(/\s+/).filter(Boolean)
  return {
    flags: tokens.filter((token) => token.startsWith("-")),
    packages: tokens.filter((token) => !token.startsWith("-"))
  }
}

function hasFlag(flags, ...names) {
  return flags.some((flag) => names.includes(flag))
}

/** Traduce una línea; devuelve null si no reconoce el comando completo. */
function translateLine(line) {
  const trimmed = line.trim()
  if (trimmed === "" || trimmed.startsWith("#")) {
    return { pnpm: line, bun: line, npm: line }
  }

  const install = INSTALL_RE.exec(trimmed)
  if (install) {
    const { flags, packages } = splitArgs(install[3])
    if (flags.some((flag) => !KNOWN_FLAGS.has(flag))) return null

    const dev = hasFlag(flags, "-D", "-d", "--save-dev")
    const global = hasFlag(flags, "-g", "--global")
    const hasPackages = packages.length > 0
    const pnpmFlags = [dev && "-D", global && "-g"].filter(Boolean)
    const bunFlags = [dev && "-d", global && "-g"].filter(Boolean)
    const npmFlags = [dev && "-D", global && "-g"].filter(Boolean)

    return {
      pnpm: [
        "pnpm",
        hasPackages ? "add" : "install",
        ...pnpmFlags,
        ...packages
      ].join(" "),
      bun: [
        "bun",
        hasPackages ? "add" : "install",
        ...bunFlags,
        ...packages
      ].join(" "),
      npm: ["npm", "install", ...npmFlags, ...packages].join(" ")
    }
  }

  const astroAdd = ASTRO_ADD_RE.exec(trimmed)
  if (astroAdd) {
    return {
      pnpm: `pnpm astro add ${astroAdd[1]}`,
      bun: `bunx astro add ${astroAdd[1]}`,
      npm: `npx astro add ${astroAdd[1]}`
    }
  }

  const runner = RUNNER_RE.exec(trimmed)
  if (runner) {
    return {
      pnpm: `pnpm dlx ${runner[2]}`,
      bun: `bunx ${runner[2]}`,
      npm: `npx ${runner[2]}`
    }
  }

  const create = CREATE_RE.exec(trimmed)
  if (create) {
    const rest = create[3].trim()
    // `npm init -y` no ejecuta un inicializador con nombre.
    if (!rest || (create[2] === "init" && rest.startsWith("-"))) return null

    return {
      pnpm: `pnpm create ${rest}`,
      bun: `bun create ${rest}`,
      npm: `npm create ${rest}`
    }
  }

  return null
}

/** Traduce un bloque entero; si una línea no encaja, conserva el bloque original. */
export function translateBlock(text) {
  const lines = text.split("\n")
  if (lines.every((line) => line.trim() === "")) return null

  const result = { pnpm: [], bun: [], npm: [] }
  for (const line of lines) {
    const translated = translateLine(line)
    if (!translated) return null
    result.pnpm.push(translated.pnpm)
    result.bun.push(translated.bun)
    result.npm.push(translated.npm)
  }

  return {
    pnpm: result.pnpm.join("\n"),
    bun: result.bun.join("\n"),
    npm: result.npm.join("\n")
  }
}

/** Expande instalaciones bash en tres bloques que Shiki resaltará por igual. */
export function remarkPackageManagerTabs() {
  let counter = 0

  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || index === undefined || !PM_LANGS.has(node.lang)) return

      const translated = translateBlock(node.value ?? "")
      if (!translated) return

      const group = `pm${counter++}`
      const variants = [
        { pm: "pnpm", value: translated.pnpm, isDefault: true },
        { pm: "bun", value: translated.bun, isDefault: false },
        { pm: "npm", value: translated.npm, isDefault: false }
      ]
      const blocks = variants.map((variant) => ({
        type: "code",
        lang: node.lang,
        meta: `pm="${variant.pm}" pmGroup="${group}"${variant.isDefault ? " pmDefault" : ""}`,
        value: variant.value
      }))

      parent.children.splice(index, 1, ...blocks)
      return [SKIP, index + blocks.length]
    })
  }
}
