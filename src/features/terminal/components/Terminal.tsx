import { navigate } from "astro:transitions/client"
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react"
import { PUBLIC_COMMANDS, type TerminalContext, findCommand } from "../commands"
import { useAppearance } from "../hooks/useAppearance"
import { useCommandHistory } from "../hooks/useCommandHistory"
import { useOutput } from "../hooks/useOutput"
import { useSearchIndex } from "../hooks/useSearchIndex"
import { itemUrl, parseInput } from "../parse"
import {
  MAX_RESULTS,
  type MenuItem,
  type QuizQuestion,
  type TerminalProps
} from "../types"
import { CommandOptions } from "./CommandOptions"
import { Footer } from "./Footer"
import { Messages } from "./Messages"
import { ResultOptions } from "./ResultOptions"
import { Welcome } from "./Welcome"

function openExternal(url: string) {
  const destination = new URL(url)
  if (destination.protocol !== "https:") return
  window.open(destination.toString(), "_blank", "noopener,noreferrer")
}

/** Consola de /search y del diálogo Ctrl/Cmd + K. */
export function Terminal({
  variant = "page",
  onRequestClose,
  initialInput = ""
}: TerminalProps) {
  const instanceId = useId().replace(/:/g, "")
  const listboxId = `${instanceId}-options`
  const commandListboxId = `${instanceId}-commands`
  const statusId = `${instanceId}-status`

  const index = useSearchIndex()
  const output = useOutput()
  const history = useCommandHistory()
  const appearance = useAppearance()

  const inputRef = useRef<HTMLInputElement>(null)
  /** Últimos resultados, para /open <n>. */
  const lastResults = useRef<MenuItem[]>([])

  const [input, setInput] = useState(initialInput)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeCommandIndex, setActiveCommandIndex] = useState(0)
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null)

  const trimmedInput = input.trim()
  const inputMode = useMemo(() => parseInput(input), [input])

  // En /search la consulta vive en la URL.
  useEffect(() => {
    if (variant !== "page") return
    setInput(new URLSearchParams(window.location.search).get("q") ?? "")
  }, [variant])

  useEffect(() => {
    if (variant !== "page") return
    const url = new URL(window.location.href)
    if (input) url.searchParams.set("q", input)
    else url.searchParams.delete("q")
    window.history.replaceState(null, "", url)
  }, [input, variant])

  const commandSuggestions = useMemo(() => {
    if (!trimmedInput.startsWith("/")) return []
    const typed = trimmedInput.slice(1).toLocaleLowerCase("es")
    if (typed.includes(" ")) return []
    return PUBLIC_COMMANDS.filter(
      (command) => command.startsWith(typed) && command !== typed
    ).slice(0, 12)
  }, [trimmedInput])

  const selectedCommandIndex =
    commandSuggestions.length > 0
      ? Math.min(activeCommandIndex, commandSuggestions.length - 1)
      : 0
  const knownCommand =
    inputMode.kind === "command" && Boolean(findCommand(inputMode.name))

  const menuItems = useMemo<MenuItem[]>(() => {
    if (!index.docs || !trimmedInput || inputMode.kind === "command") return []

    if (inputMode.kind === "tags") {
      const needle = inputMode.needle.toLocaleLowerCase("es")
      return index.tags
        .filter(
          ({ tag }) => !needle || tag.toLocaleLowerCase("es").includes(needle)
        )
        .slice(0, MAX_RESULTS)
        .map((tag) => ({ kind: "tag" as const, tag }))
    }

    if (!index.fuse || !inputMode.needle) return []
    return index.fuse
      .search(inputMode.needle, { limit: MAX_RESULTS })
      .map(({ item: doc }) => ({ kind: "document" as const, doc }))
  }, [index.docs, index.fuse, index.tags, inputMode, trimmedInput])

  useEffect(() => setActiveIndex(0), [input, menuItems.length])
  useEffect(() => setActiveCommandIndex(0), [commandSuggestions])

  useEffect(() => {
    if (menuItems.length > 0) lastResults.current = menuItems
  }, [menuItems])

  const optionId = (index: number) => `${instanceId}-option-${index}`
  const commandOptionId = (index: number) => `${instanceId}-command-${index}`
  const activeOptionId =
    commandSuggestions.length > 0
      ? commandOptionId(selectedCommandIndex)
      : optionId(activeIndex)
  const activeListboxId =
    commandSuggestions.length > 0
      ? commandListboxId
      : menuItems.length > 0
        ? listboxId
        : undefined

  // Mueve solo la salida, no la página.
  useEffect(() => {
    const screen = output.outputRef.current
    const option = document.getElementById(activeOptionId)
    if (!screen || !option || !screen.contains(option)) return

    const screenBox = screen.getBoundingClientRect()
    const optionBox = option.getBoundingClientRect()
    if (optionBox.top < screenBox.top) {
      screen.scrollTop -= screenBox.top - optionBox.top
    } else if (optionBox.bottom > screenBox.bottom) {
      screen.scrollTop += optionBox.bottom - screenBox.bottom
    }
  }, [activeOptionId, output.outputRef])

  function go(url: string) {
    if (!url.startsWith("/") || url.startsWith("//")) return
    onRequestClose?.()
    history.resetCursor()
    setInput("")
    void navigate(url)
  }

  function completeCommand(command: string) {
    setInput(`/${command}${findCommand(command)?.args ? " " : ""}`)
    history.resetCursor()
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  function buildContext(typed: string, args: string): TerminalContext {
    return {
      command: typed,
      args,
      docs: index.docs,
      categories: index.categories,
      tags: index.tags,
      history: history.history,
      results: lastResults.current,
      theme: appearance.theme,
      effect: appearance.effect,
      scanlines: appearance.scanlines,
      quiz,
      print: (lines, tone) => output.print(typed, lines, tone),
      fail: (lines) => output.print(typed, lines, "error"),
      clearOutput: output.clear,
      clearHistory: history.clear,
      setInput,
      go,
      openExternal,
      close: onRequestClose,
      setTheme: appearance.setTheme,
      setScanlines: appearance.setScanlines,
      setEffect: appearance.setEffect,
      setQuiz
    }
  }

  function submit() {
    if (!trimmedInput) return

    if (inputMode.kind !== "command") {
      if (menuItems.length === 0 && index.docs !== null) {
        output.print(
          trimmedInput,
          [`sin coincidencias para “${inputMode.needle}”`],
          "error"
        )
        setInput("")
      }
      return
    }

    const { name, args } = inputMode
    if (!name) {
      output.print(
        trimmedInput,
        ["escribe /help o usa Tab para completar un comando"],
        "error"
      )
      setInput("")
      return
    }

    const command = findCommand(name)
    if (!command?.skipHistory) history.remember(trimmedInput)

    if (!command) {
      output.print(
        trimmedInput,
        [
          `comando no encontrado: /${name}`,
          "ejecuta /help para ver los comandos disponibles"
        ],
        "error"
      )
      setInput("")
      return
    }

    command.run(buildContext(trimmedInput, args))
    if (!command.keepInput) setInput("")
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const { key } = event
    const stop = () => event.preventDefault()

    if (key === "Escape") {
      if (input) {
        stop()
        event.stopPropagation()
        setInput("")
        history.resetCursor()
      } else if (onRequestClose) {
        stop()
        onRequestClose()
      }
      return
    }

    if (key === "Tab" && commandSuggestions.length > 0) {
      stop()
      completeCommand(commandSuggestions[selectedCommandIndex])
      return
    }

    if (key === "ArrowDown" || key === "ArrowUp") {
      const step = key === "ArrowDown" ? 1 : -1
      if (commandSuggestions.length > 0) {
        stop()
        setActiveCommandIndex(
          (current) =>
            (current + step + commandSuggestions.length) %
            commandSuggestions.length
        )
        return
      }
      if (menuItems.length > 0) {
        stop()
        setActiveIndex(
          (current) => (current + step + menuItems.length) % menuItems.length
        )
        return
      }

      const recalled =
        key === "ArrowUp" ? history.previous(input) : history.next()
      if (recalled !== null) {
        stop()
        setInput(recalled)
      }
      return
    }

    if (key === "Enter") {
      stop()
      const suggestion = commandSuggestions[selectedCommandIndex]
      if (suggestion) return completeCommand(suggestion)

      const selected = menuItems[activeIndex]
      if (selected) go(itemUrl(selected))
      else submit()
    }
  }

  const terminalMode = inputMode.kind === "documents" ? "docs" : inputMode.kind

  let status = `${index.docs?.length ?? 0} documentos · ${index.tags.length} tags`
  if (menuItems.length > 0) {
    status = `${menuItems.length} resultado${menuItems.length === 1 ? "" : "s"}`
  }
  if (commandSuggestions.length > 0) {
    status = `${commandSuggestions.length} comando${commandSuggestions.length === 1 ? "" : "s"}`
  }
  if (history.cursor !== null) {
    status = `historial ${history.cursor + 1}/${history.history.length}`
  }
  if (index.docs === null) status = "montando índice…"
  if (index.failed) status = "error al montar el índice"

  return (
    <div
      className={`search-terminal search-terminal--${variant}`}
      data-terminal-theme={appearance.theme}
      data-scanlines={appearance.scanlines ? "on" : "off"}
      data-terminal-effect={appearance.effect}
    >
      <div
        className="search-terminal__bar"
        aria-hidden="true"
      >
        <span className="terminal-window__lights">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span>angel.library/{variant === "dialog" ? "command" : "search"}</span>
        <span className="search-terminal__mode">mode: {terminalMode}</span>
      </div>

      <div className="search-terminal__screen">
        <div
          className="search-terminal__boot"
          aria-hidden="true"
        >
          <p>
            <span>[ok]</span> angel.shell v2.0 · sesión local de solo lectura
          </p>
          <p>
            <span>[ok]</span> índice{" "}
            {index.docs === null ? "montando…" : "montado"} · escribe /help
          </p>
        </div>

        <div
          ref={output.outputRef}
          className="search-terminal__output"
          aria-live="polite"
        >
          <Messages messages={output.messages} />

          {!trimmedInput &&
            output.messages.length === 0 &&
            index.docs !== null && <Welcome />}

          {commandSuggestions.length > 0 && (
            <CommandOptions
              commands={commandSuggestions}
              selectedIndex={selectedCommandIndex}
              listboxId={commandListboxId}
              optionId={commandOptionId}
              onHover={setActiveCommandIndex}
              onSelect={completeCommand}
            />
          )}

          {inputMode.kind === "command" &&
            trimmedInput &&
            commandSuggestions.length === 0 && (
              <div
                className="search-terminal__command-preview"
                data-known={knownCommand}
              >
                <span>{knownCommand ? "command" : "unknown"}</span>
                <strong>/{inputMode.name || "…"}</strong>
                <small>presiona Enter para ejecutar</small>
              </div>
            )}

          {trimmedInput && menuItems.length > 0 && (
            <ResultOptions
              items={menuItems}
              activeIndex={activeIndex}
              listboxId={listboxId}
              label={
                inputMode.kind === "tags"
                  ? "Tags encontrados"
                  : "Documentos encontrados"
              }
              optionId={optionId}
              onHover={setActiveIndex}
              onSelect={() => onRequestClose?.()}
            />
          )}

          {trimmedInput &&
            inputMode.kind !== "command" &&
            index.docs !== null &&
            menuItems.length === 0 && (
              <p className="search-terminal__empty">
                <span>exit 1</span>: sin coincidencias para “{inputMode.needle}”
              </p>
            )}
        </div>

        <div className="search-terminal__prompt-line">
          <span
            className="search-terminal__user"
            aria-hidden="true"
          >
            dev@workspace
          </span>
          <span aria-hidden="true">:</span>
          <span
            className="search-terminal__cwd"
            aria-hidden="true"
          >
            ~/angel.library
          </span>
          <span
            className="search-terminal__prompt"
            aria-hidden="true"
          >
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              history.resetCursor()
            }}
            onKeyDown={handleKeyDown}
            placeholder="buscar, #tags o /comando"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            role="combobox"
            aria-label="Buscar o ejecutar un comando de la biblioteca"
            aria-autocomplete="list"
            aria-expanded={activeListboxId !== undefined}
            aria-controls={activeListboxId}
            aria-activedescendant={activeListboxId ? activeOptionId : undefined}
            aria-describedby={statusId}
          />
        </div>
      </div>

      <Footer
        status={status}
        statusId={statusId}
      />
    </div>
  )
}

export default Terminal
