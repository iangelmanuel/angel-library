/** Lo que se ve al abrir el índice, antes de escribir nada. */
export function Welcome() {
  return (
    <div className="search-terminal__welcome">
      <p>Escribe cualquier término para buscar en la biblioteca.</p>
      <p>
        Empieza con <strong>#</strong> para filtrar por tag, o con{" "}
        <strong>/</strong> para ejecutar un comando.
      </p>
      <p>
        Prueba <strong>react</strong>, <strong>#accesibilidad</strong> o{" "}
        <strong>/help</strong>.
      </p>
      <p>
        <kbd className="kbd">↑↓</kbd> para moverte,{" "}
        <kbd className="kbd">Enter</kbd> para abrir.
      </p>
    </div>
  )
}
