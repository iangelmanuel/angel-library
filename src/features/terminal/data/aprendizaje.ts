import type { QuizQuestion } from "../types"

/** Preguntas y consejos de /quiz y /tip. */

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
