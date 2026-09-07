/** Tipos editoriales disponibles en la colección `docs`. */
export const CONTENT_TYPES = {
  technologies: {
    learningOrder: 0,
    label: "Tecnologías",
    singular: "Tecnología",
    icon: "cpu",
    description:
      "Tecnologías y lenguajes base: qué son, cuándo los uso y referencia rápida de lo esencial.",
    color: "--accent-blue"
  },
  libraries: {
    learningOrder: 4,
    label: "Librerías",
    singular: "Librería",
    icon: "package",
    description:
      "Librerías que uso: instalación, API esencial, casos comunes, tips y errores típicos.",
    color: "--accent-blue"
  },
  integrations: {
    learningOrder: 5,
    label: "Integraciones",
    singular: "Integración",
    icon: "blocks",
    description:
      "Cómo usar una tecnología dentro de otra. Solo las particularidades de la combinación, sin duplicar documentación.",
    color: "--accent-indigo"
  },
  recipes: {
    learningOrder: 11,
    label: "Recetas",
    singular: "Receta",
    icon: "list-checks",
    description:
      "Soluciones paso a paso a problemas concretos, con código listo para reutilizar.",
    color: "--accent-red"
  },
  snippets: {
    learningOrder: 8,
    label: "Snippets",
    singular: "Snippet",
    icon: "code",
    description:
      "Trozos de código reutilizables: hooks, utilidades, helpers y funciones.",
    color: "--accent-cyan"
  },
  hooks: {
    learningOrder: 6,
    label: "Hooks",
    singular: "Hook",
    icon: "repeat-2",
    description:
      "Hooks reutilizables con propósito, parámetros, retorno y ejemplos.",
    color: "--accent-pink"
  },
  utilities: {
    learningOrder: 7,
    label: "Utilities",
    singular: "Utility",
    icon: "wrench",
    description:
      "Funciones pequeñas y reutilizables para browser, TypeScript y backend.",
    color: "--accent-blue"
  },
  resources: {
    learningOrder: 12,
    label: "Recursos",
    singular: "Recurso",
    icon: "link",
    description: "Herramientas y sitios externos que vale la pena recordar.",
    color: "--accent-pink"
  },
  skills: {
    learningOrder: 13,
    label: "Skills",
    singular: "Skill",
    icon: "sparkles",
    description:
      "Herramientas de desarrollo asistido por IA: configuración, agentes, comandos y workflows.",
    color: "--accent-pink"
  },
  commands: {
    learningOrder: 9,
    label: "Comandos",
    singular: "Comando",
    icon: "terminal",
    description:
      "Comandos que necesito con frecuencia: qué hacen, cuándo usarlos y sus riesgos.",
    color: "--accent-lime"
  },
  patterns: {
    learningOrder: 3,
    label: "Patrones",
    singular: "Patrón",
    icon: "layout-template",
    description:
      "Patrones y estructuras de arquitectura que repito entre proyectos.",
    color: "--accent-blue"
  },
  practices: {
    learningOrder: 2,
    label: "Buenas prácticas",
    singular: "Buena práctica",
    icon: "badge-check",
    description:
      "Reglas prácticas para mejorar calidad, seguridad, accesibilidad y mantenimiento.",
    color: "--accent-red"
  },
  guides: {
    learningOrder: 1,
    label: "Guías prácticas",
    singular: "Guía",
    icon: "book-open",
    description:
      "Referencias prácticas con varios pasos, sin convertirse en cursos extensos.",
    color: "--accent-lime"
  },
  tricks: {
    learningOrder: 10,
    label: "Trucos",
    singular: "Truco",
    icon: "zap",
    description:
      "Soluciones específicas y atajos que resuelven problemas puntuales.",
    color: "--accent-indigo"
  }
} as const

export type ContentTypeId = keyof typeof CONTENT_TYPES
export const CONTENT_TYPE_IDS = Object.keys(CONTENT_TYPES) as ContentTypeId[]
