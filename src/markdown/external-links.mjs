import { visit } from "unist-util-visit"

/** Abre enlaces externos de Markdown en otra pestaña de forma segura. */
export function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a") return

      const href = node.properties?.href
      if (typeof href !== "string" || !/^https?:\/\//i.test(href)) return

      node.properties.target = "_blank"
      node.properties.rel = "noopener noreferrer"
    })
  }
}
