/** Lo que se ve al abrir la terminal, antes de escribir nada. */
export function Welcome() {
  return (
    <div className="search-terminal__welcome">
      <p>
        <span>$</span> escribe cualquier término para buscar documentación
      </p>
      <p>
        <span>$</span> comienza con <strong>#</strong> para buscar tags
      </p>
      <p>
        <span>$</span> comienza con <strong>/</strong> para ejecutar comandos
      </p>
      <p>
        <span>$</span> prueba <strong>react</strong>, <strong>#accesibilidad</strong> o{" "}
        <strong>/help</strong>
      </p>
      <p>
        <span>$</span> usa <kbd className="kbd">↑↓</kbd> y <kbd className="kbd">Enter</kbd> para
        abrir
      </p>
    </div>
  )
}
