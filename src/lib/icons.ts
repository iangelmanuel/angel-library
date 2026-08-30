import { readFileSync } from "node:fs"
import { join } from "node:path"
import { BRAND_ICONS, RECOLORED_ICONS } from "@/config/icons"

const cache = new Map<string, string>()

/** Lee el SVG de lucide-static. */
function readLucide(name: string): string {
  const cached = cache.get(name)
  if (cached) return cached

  let svg: string
  try {
    svg = readFileSync(
      join(process.cwd(), "node_modules", "lucide-static", "icons", `${name}.svg`),
      "utf8"
    )
  } catch {
    throw new Error(
      `Icono "${name}" no existe en lucide-static. Nombres: https://lucide.dev/icons`
    )
  }

  svg = svg
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<svg[\s\S]*?)\sclass="[^"]*"/, "$1")
    .trim()
  cache.set(name, svg)
  return svg
}

/** SVG listo para set:html. Cero JavaScript en el cliente. */
export function getIcon(name: string, className = "size-4"): string {
  const attrs = `class="${className}" aria-hidden="true" focusable="false"`

  const brand = BRAND_ICONS[name]
  if (brand) {
    const fill = brand.fill ? ` fill="${brand.fill}"` : ""
    return `<svg ${attrs} viewBox="${brand.viewBox}"${fill}>${brand.body}</svg>`
  }

  const recolored = RECOLORED_ICONS[name]
  const svg = readLucide(recolored?.base ?? name)
  const colored = recolored ? svg.replace(/currentColor/g, recolored.color) : svg
  return colored.replace("<svg", `<svg ${attrs}`)
}
