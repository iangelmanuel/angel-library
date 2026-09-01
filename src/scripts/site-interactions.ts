/** Handlers globales del sitio: copiar, buscar, navegar, sidebar. */

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

/** Activa el tab pnpm/bun/npm en todos los bloques de la página. */
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
  "--accent-pink",
  "--accent-red",
  "--accent-indigo",
  "--accent-lime"
]

/** Cada entrada del puntero avanza un color. */
document.addEventListener("pointerover", (event) => {
  const target = event.target as HTMLElement
  const logo = target.closest<HTMLElement>("[data-logo-cycle]")
  const previousTarget = event.relatedTarget
  if (
    !logo ||
    (previousTarget instanceof Node && logo.contains(previousTarget))
  )
    return

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
      article?.querySelectorAll<HTMLPreElement>(
        ".markdown pre[data-filename]"
      ) ?? []
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
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
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

/* Desplaza solo la columna de navegación, nunca el documento. */
function revealInSidebar(el: Element | null, behavior: ScrollBehavior) {
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
    const href = (link.getAttribute("href") ?? "").replace(/\/+$/, "") || "/"
    const isActive = href === path
    link.classList.toggle("is-active", isActive)
    if (isActive) {
      active = link
      link.setAttribute("aria-current", "page")
      // Todos los ancestros: la entrada vive en subcategoría Y categoría.
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

/* Al desplegar una categoría larga, acompaña la apertura. */
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

// Aplica el package manager guardado en cada carga y navegación.
document.addEventListener("astro:page-load", () => {
  const stored = window.localStorage.getItem("angel:pm")
  applyPmPreference(stored ?? "pnpm")
  revealInSidebar(
    document.querySelector("#sidebar .nav-link.is-active"),
    "auto"
  )
})
