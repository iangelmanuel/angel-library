/**
 * Handlers globales (una sola vez por sesión; el documento sobrevive
 * a las view transitions):
 * - [data-open-search] / [data-open-nav] → eventos para las islas
 * - [data-copy] → copiar un bloque de código
 * - [data-copy-all] → copiar todos los bloques con nombre de archivo
 *   de la entrada, concatenados en un solo bloque
 * - Ctrl/Cmd+K y "/" → abrir la terminal global
 * - astro:after-swap → resincronizar el estado activo de la sidebar
 *   (persistida con transition:persist)
 */

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    (el as HTMLElement).isContentEditable
  )
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    textarea.remove()
  }
}

/**
 * Activa el tab `pm` (pnpm/bun/npm) en TODOS los bloques con tabs de la
 * página: destapa su <pre>, oculta los otros, y marca el botón activo.
 * Si `pm` no existe en un bloque puntual (no debería pasar, los 3 se
 * generan siempre juntos), no hace nada en ese bloque.
 */
function applyPmPreference(pm: string): void {
  document.querySelectorAll<HTMLElement>(".code-block--pm").forEach((block) => {
    const target = block.querySelector<HTMLElement>(`pre[data-pm="${pm}"]`)
    if (!target) return
    block.querySelectorAll<HTMLElement>("pre[data-pm]").forEach((pre) => {
      pre.hidden = pre !== target
    })
    block.querySelectorAll<HTMLElement>("[data-pm-tab]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-pm-tab") === pm)
    })
  })
}

function flashCopyLabel(button: Element): void {
  const label = button.querySelector("[data-copy-label]")
  if (!label) return
  const original = label.textContent
  label.textContent = "copiado"
  window.setTimeout(() => {
    label.textContent = original
  }, 1600)
}

const logoColors = [
  "--accent-blue",
  "--accent-cyan",
  "--accent-green",
  "--accent-yellow",
  "--accent-orange",
  "--accent-pink",
  "--accent-purple",
  "--accent-red",
  "--accent-teal",
  "--accent-indigo",
  "--accent-lime",
  "--accent-amber",
  "--accent-slate"
]

/** Cada nueva entrada del puntero avanza un color de la paleta. */
document.addEventListener("pointerover", (event) => {
  const target = event.target as HTMLElement
  const logo = target.closest<HTMLElement>("[data-logo-cycle]")
  const previousTarget = event.relatedTarget
  if (!logo || (previousTarget instanceof Node && logo.contains(previousTarget))) return

  const current = Number(logo.dataset.logoColorIndex ?? "-1")
  const next = (current + 1) % logoColors.length
  logo.dataset.logoColorIndex = String(next)
  logo.style.setProperty("--logo-hover-color", `var(${logoColors[next]})`)
})

document.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement

  const searchTrigger = target.closest("[data-open-search]")
  if (searchTrigger) {
    event.preventDefault()
    window.dispatchEvent(new CustomEvent("angel:open-search"))
    return
  }

  const navTrigger = target.closest("[data-open-nav]")
  if (navTrigger) {
    event.preventDefault()
    window.dispatchEvent(new CustomEvent("angel:toggle-nav"))
    return
  }

  const copyButton = target.closest("[data-copy]")
  if (copyButton) {
    const block = copyButton.closest(".code-block")
    const pre =
      block?.querySelector<HTMLElement>("pre:not([hidden])") ??
      block?.querySelector<HTMLElement>("pre")
    const text = pre?.innerText ?? ""
    if (!text) return
    await copyToClipboard(text)
    flashCopyLabel(copyButton)
    return
  }

  const pmTab = target.closest("[data-pm-tab]")
  if (pmTab) {
    const pm = pmTab.getAttribute("data-pm-tab")
    if (pm) {
      window.localStorage.setItem("angel:pm", pm)
      applyPmPreference(pm)
    }
    return
  }

  const copyAllButton = target.closest("[data-copy-all]")
  if (copyAllButton) {
    const article = copyAllButton.closest("article")
    const blocks = Array.from(
      article?.querySelectorAll<HTMLPreElement>(".markdown pre[data-filename]") ?? []
    )
    if (blocks.length === 0) return

    const filenames = new Set(blocks.map((block) => block.dataset.filename))
    const parts = blocks.map((block) => {
      const filename = block.dataset.filename
      const code = block.innerText
      return filenames.size > 1 && filename ? `// ${filename}\n${code}` : code
    })

    await copyToClipboard(parts.join("\n\n"))
    flashCopyLabel(copyAllButton)
  }
})

document.addEventListener("keydown", (event) => {
  if (
    (event.metaKey || event.ctrlKey) &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault()
    window.dispatchEvent(new CustomEvent("angel:toggle-search"))
    return
  }
  if (event.key === "/" && !isTypingTarget(document.activeElement)) {
    event.preventDefault()
    window.dispatchEvent(
      new CustomEvent("angel:open-search", {
        detail: { initialInput: "/" }
      })
    )
  }
})

/* Desplaza SOLO la columna de navegación, nunca el documento: el
   lector no pierde su posición en el artículo porque la sidebar
   tuviera que moverse. */
function revealInSidebar(
  el: Element | null,
  behavior: ScrollBehavior
) {
  const nav = document.querySelector("#sidebar nav")
  if (!nav || !el) return
  const navBox = nav.getBoundingClientRect()
  const elBox = el.getBoundingClientRect()
  const margin = 56
  if (elBox.top < navBox.top + margin) {
    nav.scrollBy({ top: elBox.top - navBox.top - margin, behavior })
  } else if (elBox.bottom > navBox.bottom - margin) {
    nav.scrollBy({ top: elBox.bottom - navBox.bottom + margin, behavior })
  }
}

function syncSidebarState() {
  const path = location.pathname.replace(/\/+$/, "") || "/"
  let active: Element | null = null
  document.querySelectorAll("#sidebar a[href]").forEach((link) => {
    const href =
      (link.getAttribute("href") ?? "").replace(/\/+$/, "") || "/"
    const isActive = href === path
    link.classList.toggle("is-active", isActive)
    if (isActive) {
      active = link
      link.setAttribute("aria-current", "page")
      // Todos los ancestros, no solo el más cercano: una entrada vive
      // dentro de subcategoría Y categoría, y abrir solo la interna
      // la dejaba oculta dentro de una categoría cerrada.
      let parent = link.parentElement
      while (parent && parent.closest("#sidebar")) {
        if (parent instanceof HTMLDetailsElement) parent.open = true
        parent = parent.parentElement
      }
    } else {
      link.removeAttribute("aria-current")
    }
  })
  if (active) revealInSidebar(active, "auto")
}
document.addEventListener("astro:after-swap", syncSidebarState)

/* Al desplegar una categoría larga, acompaña la apertura: si su
   contenido queda por debajo del borde visible, sube el encabezado.
   `toggle` no burbujea, de ahí la fase de captura. */
document.addEventListener(
  "toggle",
  (event) => {
    const details = event.target
    if (!(details instanceof HTMLDetailsElement)) return
    if (!details.open || !details.closest("#sidebar")) return
    const summary = details.querySelector(":scope > summary")
    if (!summary) return
    requestAnimationFrame(() => {
      const nav = document.querySelector("#sidebar nav")
      if (!nav) return
      const overflows =
        details.getBoundingClientRect().bottom >
        nav.getBoundingClientRect().bottom
      revealInSidebar(overflows ? summary : details, "smooth")
    })
  },
  true
)

// Aplica la preferencia de package manager guardada (o "pnpm" por
// defecto) a los bloques con tabs de cada página que carga — corre en
// la carga inicial Y después de cada navegación con View Transitions.
document.addEventListener("astro:page-load", () => {
  const stored = window.localStorage.getItem("angel:pm")
  applyPmPreference(stored ?? "pnpm")
  revealInSidebar(
    document.querySelector("#sidebar .nav-link.is-active"),
    "auto"
  )
})

