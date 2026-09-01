import { useEffect, useRef, useState } from "react"
import type { MessageTone, TerminalMessage } from "../types"

/** Cuántas respuestas anteriores se conservan a la vista. */
const VISIBLE_MESSAGES = 5

/** La salida de la terminal: los mensajes y su scroll propio. */
export function useOutput() {
  const [messages, setMessages] = useState<TerminalMessage[]>([])
  const outputRef = useRef<HTMLDivElement>(null)
  const lastId = useRef(0)

  useEffect(() => {
    if (messages.length === 0) return
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [messages])

  function print(
    command: string,
    lines: string[],
    tone: MessageTone = "default"
  ) {
    lastId.current += 1
    setMessages((current) => [
      ...current.slice(-VISIBLE_MESSAGES),
      { id: lastId.current, command, lines, tone }
    ])
  }

  return {
    messages,
    outputRef,
    print,
    clear: () => setMessages([])
  }
}
