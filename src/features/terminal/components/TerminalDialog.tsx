import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
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
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="search-terminal-dialog fixed z-50 grid gap-0 border-0 bg-transparent p-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-6">
          <Dialog.Title className="sr-only text-lg leading-none font-medium">
            Terminal de angel.library
          </Dialog.Title>
          <Dialog.Description className="sr-only text-sm text-muted-foreground">
            Busca documentación, explora tags o ejecuta comandos de navegación.
          </Dialog.Description>
          <Terminal
            variant="dialog"
            initialInput={initialInput}
            onRequestClose={() => handleOpenChange(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
