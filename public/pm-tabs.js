// Pestañas pnpm · bun · npm de los bloques de instalación.
;(function () {
  var KEY = "angel:pm"

  function apply(pm) {
    document.querySelectorAll("[data-pm-tabs]").forEach(function (group) {
      group.querySelectorAll("[data-pm-tab]").forEach(function (tab) {
        tab.classList.toggle("is-active", tab.dataset.pmTab === pm)
      })
      group.querySelectorAll("[data-pm]").forEach(function (panel) {
        panel.hidden = panel.dataset.pm !== pm
      })
    })
  }

  document.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-pm-tab]")
    if (!tab) return

    var pm = tab.dataset.pmTab
    try {
      localStorage.setItem(KEY, pm)
    } catch {
      // Sin almacenamiento: dura la página.
    }
    apply(pm)
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
