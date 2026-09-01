import { visit } from "unist-util-visit"

/** Pipeline visual de bloques de código: metadatos Shiki, cabeceras y tabs. */

function rawMeta(meta) {
  const value =
    meta && typeof meta === "object" && "__raw" in meta ? meta.__raw : meta
  return String(value ?? "")
}

function filenameFromMeta(meta) {
  const match = /title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/.exec(rawMeta(meta))
  return match?.[1] ?? match?.[2] ?? match?.[3]
}

function packageManagerFromMeta(meta) {
  const value = rawMeta(meta)
  const pm = /pm="([^"]+)"/.exec(value)?.[1]
  if (!pm) return null

  return {
    pm,
    group: /pmGroup="([^"]+)"/.exec(value)?.[1],
    isDefault: /(?:^|\s)pmDefault(?:\s|$)/.test(value)
  }
}

function findPre(root) {
  return root.children.find(
    (child) => child.type === "element" && child.tagName === "pre"
  )
}

function setFilename(node, meta) {
  const filename = filenameFromMeta(meta)
  if (!filename || !node) return
  node.properties ??= {}
  node.properties["data-filename"] = filename
}

function setPackageManager(node, meta) {
  const info = packageManagerFromMeta(meta)
  if (!info || !node) return
  node.properties ??= {}
  node.properties["data-pm"] = info.pm
  if (info.group) node.properties["data-pm-group"] = info.group
  if (info.isDefault) node.properties["data-pm-default"] = ""
}

/** Conserva `title=` del fence como data-filename. */
export function transformerCodeFilename() {
  return {
    name: "angel-library-code-filename",
    preprocess(code, options) {
      const filename = filenameFromMeta(options.meta)
      if (filename) {
        const existing =
          options.meta && typeof options.meta === "object" ? options.meta : {}
        options.meta = { ...existing, "data-filename": filename }
      }
      return code
    },
    pre(node) {
      setFilename(node, this.options.meta)
    },
    root(root) {
      setFilename(findPre(root), this.options.meta)
    }
  }
}

/** Conserva el meta del plugin remark como atributos data-pm. */
export function transformerPackageManagerMeta() {
  return {
    name: "angel-library-pm-tabs",
    pre(node) {
      setPackageManager(node, this.options.meta)
    },
    root(root) {
      setPackageManager(findPre(root), this.options.meta)
    }
  }
}

function element(tagName, properties = {}, children = []) {
  return { type: "element", tagName, properties, children }
}

function text(value) {
  return { type: "text", value }
}

/** Lee una propiedad HAST en camelCase o con guiones. */
function property(node, camel, hyphenated) {
  return node.properties?.[camel] ?? node.properties?.[hyphenated]
}

function copyButton(label) {
  const icon = element(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 13,
      height: 13,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    },
    [
      element("rect", { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }),
      element("path", {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      })
    ]
  )

  return element(
    "button",
    {
      type: "button",
      className: ["code-block__copy"],
      "data-copy": "",
      ariaLabel: label,
      title: label
    },
    [icon, element("span", { "data-copy-label": "" }, [text("copiar")])]
  )
}

function header(children) {
  return element("div", { className: ["code-block__header"] }, children)
}

function buildPackageManagerBlock(blocks, group) {
  const isDefault = (pre) =>
    property(pre, "dataPmDefault", "data-pm-default") !== undefined

  for (const pre of blocks) {
    pre.properties ??= {}
    pre.properties.hidden = !isDefault(pre)
    delete pre.properties.dataPmGroup
    delete pre.properties["data-pm-group"]
    pre.__pmHandled = true
  }

  const tabs = element(
    "div",
    { className: ["code-block__pm-tabs"], role: "tablist" },
    blocks.map((pre) => {
      const pm = property(pre, "dataPm", "data-pm")
      const className = isDefault(pre)
        ? ["code-block__pm-tab", "is-active"]
        : ["code-block__pm-tab"]
      return element(
        "button",
        { type: "button", className, "data-pm-tab": pm },
        [text(pm)]
      )
    })
  )

  return element(
    "div",
    { className: ["code-block", "code-block--pm"], "data-pm-group": group },
    [header([tabs, copyButton("Copiar comando")]), ...blocks]
  )
}

function packageManagerGroup(node) {
  if (node?.type !== "element" || node.tagName !== "pre") return undefined
  return property(node, "dataPmGroup", "data-pm-group")
}

function groupPackageManagerBlocks(children) {
  const result = []
  let changed = false
  let index = 0

  while (index < children.length) {
    const group = packageManagerGroup(children[index])
    const blocks = [children[index]]
    let next = index + 1

    while (group && next < children.length) {
      const child = children[next]
      if (child?.type === "text" && String(child.value ?? "").trim() === "") {
        next++
        continue
      }
      if (packageManagerGroup(child) !== group) break
      blocks.push(child)
      next++
    }

    if (group && blocks.length === 3) {
      result.push(buildPackageManagerBlock(blocks, group))
      changed = true
      index = next
    } else {
      result.push(children[index])
      index++
    }
  }

  return changed ? result : children
}

function codeLabel(pre) {
  const filename = property(pre, "dataFilename", "data-filename")
  if (filename) return String(filename)

  const language = property(pre, "dataLanguage", "data-language")
  if (language) return String(language)

  const code = pre.children.find(
    (child) => child.type === "element" && child.tagName === "code"
  )
  const languageClass = (code?.properties?.className ?? []).find(
    (name) => typeof name === "string" && name.startsWith("language-")
  )
  return languageClass
    ? String(languageClass).slice("language-".length)
    : "code"
}

/** Agrupa tabs y añade etiqueta y botón de copia a cada bloque. */
export function rehypeCodeBlocks() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.children)
        node.children = groupPackageManagerBlocks(node.children)
    })

    visit(tree, "element", (node, index, parent) => {
      if (
        !parent ||
        index === undefined ||
        node.tagName !== "pre" ||
        node.__pmHandled
      )
        return
      const hasCode = node.children.some(
        (child) => child.type === "element" && child.tagName === "code"
      )
      if (!hasCode) return

      parent.children[index] = element("div", { className: ["code-block"] }, [
        header([
          element("span", { className: ["code-block__label"] }, [
            text(codeLabel(node))
          ]),
          copyButton("Copiar código")
        ]),
        node
      ])
    })
  }
}
