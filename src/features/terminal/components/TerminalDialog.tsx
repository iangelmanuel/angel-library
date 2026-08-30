import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog"
import { Terminal } from "./Terminal"

/** La terminal global que abren Ctrl/Cmd + K, "/" y el botón del header. */
export default function TerminalDialog() {
  const [open, setOpen] = useState(false)
  const [initialInput, setInitialInput] = useState("")

  useEffect(() => {
    const openTerminal = (event: Event) => {
      const detail = (event as CustomEvent<{ initialInput?: string }>).detail
      setInitialInput(detail?.initialInput ?? "")
      setOpen(true)
    }
    const toggleTerminal = () => {
      setInitialInput("")
      setOpen((value) => !value)
    }

    window.addEventListener("angel:open-search", openTerminal)
    window.addEventListener("angel:toggle-search", toggleTerminal)
    return () => {
      window.removeEventListener("angel:open-search", openTerminal)
      window.removeEventListener("angel:toggle-search", toggleTerminal)
    }
  }, [])

  function handleOpenChange(value: boolean) {
    setOpen(value)
    if (!value) setInitialInput("")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideClose
        className="search-terminal-dialog w-[calc(100vw-1rem)] max-w-none sm:w-[min(92vw,56rem)] sm:max-w-none"
      >
        <DialogTitle className="sr-only">Terminal de angel.library</DialogTitle>
        <DialogDescription className="sr-only">
          Busca documentación, explora tags o ejecuta comandos de navegación.
        </DialogDescription>
        <Terminal
          variant="dialog"
          initialInput={initialInput}
          onRequestClose={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
