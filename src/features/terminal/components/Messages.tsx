import type { TerminalMessage } from "../types"

/** El eco de cada comando ejecutado y su respuesta. */
export function Messages({ messages }: { messages: TerminalMessage[] }) {
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className="search-terminal__history"
          data-tone={message.tone ?? "default"}
        >
          <p className="search-terminal__echo">
            <span>dev@workspace:~/angel.library $</span> {message.command}
          </p>
          <div className="search-terminal__response">
            {message.lines.map((line, index) => (
              <p key={`${message.id}-${index}`}>{line}</p>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
