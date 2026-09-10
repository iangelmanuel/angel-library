// Pestañas pnpm · bun · npm de los bloques de instalación.
;(function () {
  var KEY = "angel:pm"
  var ORDER = ["pnpm", "bun", "npm"]

  function apply(pm) {
    document.querySelectorAll("[data-pm-tabs]").forEach(function (group) {
      group.querySelectorAll("[data-pm-tab]").forEach(function (tab) {
        var active = tab.dataset.pmTab === pm
        tab.classList.toggle("is-active", active)
        tab.setAttribute("aria-selected", String(active))
        tab.tabIndex = active ? 0 : -1
      })
      group.querySelectorAll("[data-pm]").forEach(function (panel) {
        panel.hidden = panel.dataset.pm !== pm
      })
    })
  }

  function choose(pm) {
    try {
      localStorage.setItem(KEY, pm)
    } catch {
      // Sin almacenamiento: dura la página.
    }
    apply(pm)
  }

  document.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-pm-tab]")
    if (tab) choose(tab.dataset.pmTab)
  })

  // Flechas, Inicio y Fin: el recorrido que se espera de unas pestañas.
  document.addEventListener("keydown", function (event) {
    var tab = event.target.closest("[data-pm-tab]")
    if (!tab) return

    var index = ORDER.indexOf(tab.dataset.pmTab)
    var next = null

    if (event.key === "ArrowRight") next = (index + 1) % ORDER.length
    else if (event.key === "ArrowLeft")
      next = (index - 1 + ORDER.length) % ORDER.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = ORDER.length - 1
    else return

    event.preventDefault()
    choose(ORDER[next])

    var group = tab.closest("[data-pm-tabs]")
    var target =
      group && group.querySelector('[data-pm-tab="' + ORDER[next] + '"]')
    if (target) target.focus()
  })

  function restore() {
    var stored = null
    try {
      stored = localStorage.getItem(KEY)
    } catch {
      stored = null
    }
    if (stored) apply(stored)
  }

  document.addEventListener("DOMContentLoaded", restore)
  document.addEventListener("astro:page-load", restore)
})()
