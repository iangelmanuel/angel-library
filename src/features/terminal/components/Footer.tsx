/** Atajos de teclado y el estado del índice. */
export function Footer({
  status,
  statusId
}: {
  status: string
  statusId: string
}) {
  return (
    <div className="search-terminal__footer">
      <span>
        <kbd className="kbd">↑↓</kbd> seleccionar
      </span>
      <span>
        <kbd className="kbd">↑</kbd> historial
      </span>
      <span>
        <kbd className="kbd">Enter</kbd> abrir / ejecutar
      </span>
      <span>
        <kbd className="kbd">Tab</kbd> completar
      </span>
      <span>
        <kbd className="kbd">Esc</kbd> limpiar / cerrar
      </span>
      <span>
        <kbd className="kbd">/help</kbd> comandos
      </span>
      <span
        id={statusId}
        className="search-terminal__status"
        aria-live="polite"
      >
        {status}
      </span>
    </div>
  )
}
