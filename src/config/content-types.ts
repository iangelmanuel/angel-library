import { keysOf, withIds } from "./helpers"

/** Tipos editoriales disponibles en la colección `library`. */
const CONTENT_TYPE_DEFINITIONS = {
  technologies: {
    label: "Tecnologías",
    singular: "Tecnología",
    icon: "cpu",
    description:
      "Tecnologías y lenguajes base: qué son, cuándo los uso y referencia rápida de lo esencial.",
    color: "--accent-blue"
  },
  libraries: {
    label: "Librerías",
    singular: "Librería",
    icon: "package",
    description:
      "Librerías que uso: instalación, API esencial, casos comunes, tips y errores típicos.",
    color: "--accent-blue"
  },
  integrations: {
    label: "Integraciones",
    singular: "Integración",
    icon: "blocks",
    description:
      "Cómo usar una tecnología dentro de otra. Solo las particularidades de la combinación, sin duplicar documentación.",
    color: "--accent-indigo"
  },
  recipes: {
    label: "Recetas",
    singular: "Receta",
    icon: "list-checks",
    description:
      "Soluciones paso a paso a problemas concretos, con código listo para reutilizar.",
    color: "--accent-red"
  },
  snippets: {
    label: "Snippets",
    singular: "Snippet",
    icon: "code",
    description:
      "Trozos de código reutilizables: hooks, utilidades, helpers y funciones.",
    color: "--accent-cyan"
  },
  hooks: {
    label: "Hooks",
    singular: "Hook",
    icon: "repeat-2",
    description:
      "Hooks reutilizables con propósito, parámetros, retorno y ejemplos.",
    color: "--accent-pink"
  },
  utilities: {
    label: "Utilities",
    singular: "Utility",
    icon: "wrench",
    description:
      "Funciones pequeñas y reutilizables para browser, TypeScript y backend.",
    color: "--accent-blue"
  },
  resources: {
    label: "Recursos",
    singular: "Recurso",
    icon: "link",
    description: "Herramientas y sitios externos que vale la pena recordar.",
    color: "--accent-pink"
  },
  skills: {
    label: "Skills",
    singular: "Skill",
    icon: "sparkles",
    description:
      "Herramientas de desarrollo asistido por IA: configuración, agentes, comandos y workflows.",
    color: "--accent-pink"
  },
  commands: {
    label: "Comandos",
    singular: "Comando",
    icon: "terminal",
    description:
      "Comandos que necesito con frecuencia: qué hacen, cuándo usarlos y sus riesgos.",
    color: "--accent-lime"
  },
  patterns: {
    label: "Patrones",
    singular: "Patrón",
    icon: "layout-template",
    description:
      "Patrones y estructuras de arquitectura que repito entre proyectos.",
    color: "--accent-blue"
  },
  practices: {
    label: "Buenas prácticas",
    singular: "Buena práctica",
    icon: "badge-check",
    description:
      "Reglas prácticas para mejorar calidad, seguridad, accesibilidad y mantenimiento.",
    color: "--accent-red"
  },
  guides: {
    label: "Guías prácticas",
    singular: "Guía",
    icon: "book-open",
    description:
      "Referencias prácticas con varios pasos, sin convertirse en cursos extensos.",
    color: "--accent-lime"
  },
  tricks: {
    label: "Trucos",
    singular: "Truco",
    icon: "zap",
    description:
      "Soluciones específicas y atajos que resuelven problemas puntuales.",
    color: "--accent-indigo"
  }
} as const

export type ContentTypeId = keyof typeof CONTENT_TYPE_DEFINITIONS

export interface ContentTypeMeta {
  id: ContentTypeId
  /** Plural. */
  label: string
  /** Singular. */
  singular: string
  /** Icono lucide. */
  icon: string
  description: string
  /** Variable CSS del color. */
  color: string
}

export const CONTENT_TYPES = withIds(CONTENT_TYPE_DEFINITIONS) as Record<
  ContentTypeId,
  ContentTypeMeta
>
export const CONTENT_TYPE_IDS = keysOf(CONTENT_TYPE_DEFINITIONS)
export const CONTENT_TYPE_LIST = CONTENT_TYPE_IDS.map((id) => CONTENT_TYPES[id])
