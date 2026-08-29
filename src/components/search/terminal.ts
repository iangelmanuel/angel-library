import type { SearchDoc } from "@/lib/search"

export interface TagIndexItem {
  tag: string
  count: number
}

export interface TerminalMessage {
  id: number
  command: string
  lines: string[]
  tone?: "default" | "error" | "success"
}

export interface QuizQuestion {
  topic: string
  question: string
  choices: readonly string[]
  answer: number
  explanation: string
}

export interface TerminalSearchProps {
  variant?: "page" | "dialog"
  onRequestClose?: () => void
  initialInput?: string
}

export type MenuItem =
  | { kind: "document"; doc: SearchDoc }
  | { kind: "tag"; tag: TagIndexItem }

type InputMode =
  | { kind: "documents"; needle: string }
  | { kind: "tags"; needle: string }
  | { kind: "command"; name: string; args: string }

export const TERMINAL_THEMES = [
  "default",
  "matrix",
  "midnight",
  "violet",
  "amber",
  "crimson",
  "ocean",
  "forest",
  "synthwave",
  "ice",
  "mono",
  "retro",
  "angel"
] as const
export type TerminalTheme = (typeof TERMINAL_THEMES)[number]
export type TerminalEffect = "none" | "rainbow"

export const MAX_RESULTS = 12
export const PUBLIC_COMMANDS = [
  "help",
  "clear",
  "pwd",
  "ls",
  "stats",
  "tree",
  "history",
  "search",
  "diccionario",
  "google",
  "mdn",
  "npm",
  "caniuse",
  "quiz",
  "respuesta",
  "tip",
  "tags",
  "open",
  "cd",
  "random",
  "theme",
  "scanlines",
  "reset",
  "motd",
  "whoami",
  "date",
  "echo",
  "back",
  "reload",
  "home",
  "exit"
] as const
const SECRET_COMMANDS = [
  "myjson",
  "myastro",
  "mynext",
  "cat",
  "coffee",
  "fortune",
  "ping",
  "matrix",
  "party",
  "sudo",
  "42",
  "bug",
  "duck",
  "rm",
  "hello",
  "rainbow",
  "banner",
  "joke"
] as const
const ALL_COMMANDS = [
  ...PUBLIC_COMMANDS,
  ...SECRET_COMMANDS,
  "cls",
  "bg",
  "categories",
  "url",
  "define",
  "dict",
  "answer"
]
export const COMMAND_SET = new Set<string>(ALL_COMMANDS)
export const COMMANDS_WITH_ARGS = new Set([
  "search",
  "tags",
  "open",
  "cd",
  "theme",
  "scanlines",
  "echo",
  "history",
  "diccionario",
  "google",
  "mdn",
  "npm",
  "caniuse",
  "quiz",
  "respuesta",
  "tip"
])

export const COMMAND_DESCRIPTIONS: Record<
  (typeof PUBLIC_COMMANDS)[number],
  string
> = {
  help: "mostrar comandos y ejemplos de uso",
  clear: "limpiar la salida sin borrar el historial",
  pwd: "mostrar el directorio virtual actual",
  ls: "listar categorías como directorios",
  stats: "resumen del índice y de la sesión",
  tree: "dibujar el árbol de categorías",
  history: "ver o limpiar comandos anteriores",
  search: "buscar documentación indexada",
  diccionario: "buscar la definición de un término en Google",
  google: "abrir una consulta en Google",
  mdn: "buscar una tecnología web en MDN",
  npm: "buscar un paquete en npm",
  caniuse: "consultar compatibilidad entre navegadores",
  quiz: "iniciar una pregunta técnica interactiva",
  respuesta: "responder la pregunta activa",
  tip: "mostrar un consejo técnico por tema",
  tags: "entrar al modo de búsqueda por tags",
  open: "abrir un resultado anterior o una ruta",
  cd: "navegar a una categoría o sección",
  random: "abrir un documento al azar",
  theme: "consultar o cambiar el tema visual",
  scanlines: "activar o desactivar las líneas CRT",
  reset: "restaurar la apariencia de la terminal",
  motd: "mostrar el mensaje de la sesión",
  whoami: "mostrar la identidad de la sesión",
  date: "mostrar fecha y hora local",
  echo: "imprimir texto en la salida",
  back: "volver a la página anterior",
  reload: "recargar la página actual",
  home: "ir al inicio de la biblioteca",
  exit: "cerrar la terminal global"
}

export const HELP_LINES = [
  "/search <texto>   pasar a una búsqueda de documentación",
  "/diccionario <término>  buscar una definición en Google",
  "/google <consulta> · /mdn <tema> · /npm <paquete>",
  "/caniuse <función>      revisar soporte entre navegadores",
  "/quiz [tema] · /respuesta <n|ver> · /tip [tema]",
  "/tags [texto]     listar o filtrar tags; #texto es el atajo directo",
  "/open <n|ruta>    abrir un resultado anterior o una ruta interna",
  "/ls               listar las categorías disponibles",
  "/cd <directorio>  entrar a una categoría, /search, /tags o /",
  "/stats            mostrar estadísticas del índice local",
  "/random           abrir un documento al azar",
  "/theme [nombre]   cambiar el fondo; usa /theme list para ver todos",
  "/scanlines [on|off] · /reset · /motd · /tree",
  "/pwd · /whoami · /date · /url · /echo <texto>",
  "/history          mostrar los últimos comandos ejecutados",
  "/clear | /cls     limpiar la salida de la terminal",
  "/back · /reload · /home · /exit",
  "tip: /cat, /coffee y /fortune son solo el comienzo…"
]

export const BANNER_LINES = [
  "  __ _ _ __   __ _  ___| |",
  " / _` | '_ \\ / _` |/ _ \\ |",
  "| (_| | | | | (_| |  __/ |",
  " \\__,_|_| |_|\\__, |\\___|_|",
  "             |___/  library"
]

export const CAT_LINES = [" /\\_/\\", "( o.o )", " > ^ <"]

export const COFFEE_LINES = [
  "    ( (",
  "     ) )",
  "  ........",
  "  |      |]",
  "  \\      /",
  "   `----´",
  "compilando motivación… 100%"
]

export const BUG_LINES = [
  "   /\\  /\\",
  "  ((ovo))",
  "  ():::()",
  "   VVVVV",
  "no es un bug; ahora es una interacción oculta."
]

export const DUCK_LINES = [
  "   __",
  " <(o )___",
  "  ( ._> /",
  "   `---´",
  "cuéntame el problema desde el principio."
]

export const FORTUNES = [
  "Primero hazlo funcionar, luego hazlo claro y finalmente hazlo rápido.",
  "El comentario más útil explica por qué, no repite qué hace el código.",
  "Si una función necesita demasiada explicación, quizá necesita ser más pequeña.",
  "La caché convierte problemas difíciles en problemas difíciles de reproducir.",
  "Un buen nombre elimina una reunión futura.",
  "No hay código más rápido que el código que no necesita ejecutarse."
]

export const JOKES = [
  "¿Por qué el programador confundió Halloween y Navidad? Porque OCT 31 = DEC 25.",
  "Hay 10 tipos de personas: las que entienden binario y las que todavía lo están depurando.",
  "Funciona en mi máquina. Excelente, entonces enviemos tu máquina a producción.",
  "Un SQL entra a un bar, se acerca a dos mesas y pregunta: ¿puedo hacer un JOIN?"
]

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    topic: "javascript",
    question:
      "¿Qué operador conserva valores válidos como 0, false y una cadena vacía?",
    choices: ["||", "??", "&&", "!="],
    answer: 1,
    explanation:
      "?? solo usa el valor derecho cuando el izquierdo es null o undefined; || también reemplaza otros valores falsy."
  },
  {
    topic: "javascript",
    question:
      "¿En qué cola se procesan las reacciones de una Promise resuelta?",
    choices: [
      "render queue",
      "task queue",
      "microtask queue",
      "call stack persistente"
    ],
    answer: 2,
    explanation:
      "Los callbacks de Promise se programan como microtareas y se atienden antes de la siguiente tarea del event loop."
  },
  {
    topic: "html",
    question: "¿Qué elemento nativo crea un bloque desplegable accesible?",
    choices: ["<dialog>", "<details>", "<template>", "<fieldset>"],
    answer: 1,
    explanation:
      "<details> administra el estado abierto y se combina con <summary> para ofrecer una etiqueta interactiva."
  },
  {
    topic: "css",
    question:
      "¿Qué consulta permite adaptar un componente al ancho de su contenedor?",
    choices: ["@media", "@supports", "@container", "@layer"],
    answer: 2,
    explanation:
      "@container responde al espacio disponible del contenedor y no únicamente al tamaño del viewport."
  },
  {
    topic: "accesibilidad",
    question: "¿Cuándo suele ser apropiado usar aria-label en un botón?",
    choices: [
      "Siempre",
      "Cuando solo tiene un icono sin nombre visible",
      "Para reemplazar cualquier texto",
      "Solo en formularios"
    ],
    answer: 1,
    explanation:
      "aria-label aporta un nombre accesible cuando no existe texto visible; si ya hay una etiqueta clara, normalmente no hace falta."
  },
  {
    topic: "http",
    question: "¿Qué estado HTTP representa la creación exitosa de un recurso?",
    choices: ["200", "201", "204", "304"],
    answer: 1,
    explanation:
      "201 Created indica que el servidor creó el recurso; normalmente se acompaña con una cabecera Location."
  },
  {
    topic: "seguridad",
    question:
      "¿Qué defensa evita que una entrada SQL se interprete como parte de la consulta?",
    choices: [
      "CORS",
      "Consultas parametrizadas",
      "Minificación",
      "localStorage"
    ],
    answer: 1,
    explanation:
      "Las consultas parametrizadas separan los datos de la instrucción SQL y reducen el riesgo de inyección."
  },
  {
    topic: "performance",
    question:
      "¿Qué atributo permite diferir una imagen que está fuera del viewport?",
    choices: [
      'decoding="sync"',
      'fetchpriority="high"',
      'loading="lazy"',
      'rel="preload"'
    ],
    answer: 2,
    explanation:
      'loading="lazy" pospone la descarga de imágenes lejanas; no conviene aplicarlo a la imagen principal que participa en el LCP.'
  }
]

export const LEARNING_TIPS = [
  {
    topic: "javascript",
    text: 'Prefiere comparar explícitamente con null cuando 0, false o "" sean valores válidos del dominio.'
  },
  {
    topic: "css",
    text: "Usa @supports para aplicar mejoras progresivas sin romper navegadores que todavía no entienden una propiedad."
  },
  {
    topic: "html",
    text: "Antes de crear un componente interactivo desde cero, comprueba si <dialog>, <details> o popover ya resuelven la semántica."
  },
  {
    topic: "accesibilidad",
    text: "Prueba cada flujo solo con Tab, Shift+Tab, Enter, Espacio y Escape; el foco debe ser visible y predecible."
  },
  {
    topic: "seguridad",
    text: "Valida en el servidor incluso cuando el frontend ya validó: el cliente nunca constituye una frontera de confianza."
  },
  {
    topic: "performance",
    text: "Mide antes y después. Una optimización sin una métrica y un escenario reproducible es solo una suposición."
  },
  {
    topic: "git",
    text: "Haz commits pequeños que expresen una sola intención; serán más fáciles de revisar, revertir y reutilizar."
  },
  {
    topic: "backend",
    text: "Diseña timeouts, reintentos e idempotencia juntos para evitar duplicar operaciones cuando una red falla."
  }
] as const

export function documentPath(doc: SearchDoc): string {
  const name = doc.url.split("/").filter(Boolean).at(-1) ?? "document"
  return `${doc.categoryId}/${name}`
}

export function itemUrl(item: MenuItem): string {
  return item.kind === "document"
    ? item.doc.url
    : `/tags/${encodeURIComponent(item.tag.tag)}`
}

export function parseInput(value: string): InputMode {
  const trimmed = value.trim()

  if (trimmed.startsWith("#")) {
    return { kind: "tags", needle: trimmed.slice(1).trim() }
  }
  if (trimmed.startsWith("/")) {
    const command = trimmed.slice(1).trimStart()
    const [rawName = "", ...parts] = command.split(/\s+/)
    return {
      kind: "command",
      name: rawName.toLocaleLowerCase("es"),
      args: parts.join(" ").trim()
    }
  }
  return { kind: "documents", needle: trimmed }
}

export function isTerminalTheme(value: string | null): value is TerminalTheme {
  return TERMINAL_THEMES.includes(value as TerminalTheme)
}

export function normalizeKeyword(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es")
}
