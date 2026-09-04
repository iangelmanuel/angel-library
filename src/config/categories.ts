import { keysOf, withIds } from "./helpers"

/** Categorías principales; cada una corresponde a la primera carpeta de contenido. */
const CATEGORY_DEFINITIONS = {
  general: {
    label: "General",
    icon: "globe",
    description:
      "Librerías, TypeScript, utilidades, snippets y patrones reutilizables para el desarrollo diario.",
    color: "--accent-blue"
  },
  languages: {
    label: "Lenguajes",
    icon: "code",
    description:
      "HTML, CSS y JavaScript: fundamentos, APIs del navegador y prácticas del lenguaje.",
    color: "--accent-lime"
  },
  frontend: {
    label: "Frontend",
    icon: "monitor",
    description:
      "Frontend, interfaz de usuario (UI), renderizado en el navegador y frameworks de componentes.",
    color: "--accent-yellow"
  },
  backend: {
    label: "Backend",
    icon: "server",
    description:
      "Servidores, interfaces de programación de aplicaciones (APIs) y arquitectura de backend.",
    color: "--accent-green"
  },
  database: {
    label: "Bases de datos",
    icon: "database",
    description:
      "Bases de datos, mapeadores objeto-relacionales (ORM), consultas y persistencia.",
    color: "--accent-red"
  },
  ai: {
    label: "IA SDK",
    icon: "brain",
    description:
      "Programar contra modelos de IA desde el código: SDKs, prompts, contexto, RAG, agentes y evaluaciones.",
    color: "--accent-pink"
  },
  devops: {
    label: "DevOps",
    icon: "container",
    description:
      "Desarrollo y operaciones (DevOps): entrega continua, despliegue, infraestructura y observabilidad.",
    color: "--accent-pink"
  },
  git: {
    label: "Git & GitHub",
    icon: "git-branch",
    description:
      "Git, GitHub y su ecosistema: comandos, repositorios, colaboración, perfil y automatización con Actions.",
    color: "--accent-blue"
  },
  terminal: {
    label: "Terminal & CLI",
    icon: "terminal",
    description:
      "Terminales e interfaces de línea de comandos (CLI) para Windows, macOS y Linux.",
    color: "--accent-lime"
  },
  applications: {
    label: "Aplicaciones",
    icon: "app-window",
    description:
      "Programas que acompañan el trabajo de desarrollo: escribir y ejecutar código, probar APIs, administrar despliegues, diseñar interfaces y colaborar. Cada módulo explica qué resuelve la herramienta y cuándo conviene usarla.",
    color: "--accent-yellow"
  },
  findings: {
    label: "Hallazgos",
    icon: "telescope",
    description:
      "Repositorios y proyectos de la comunidad que presentan soluciones, herramientas, material educativo, espacios de interacción o experimentos interesantes.",
    color: "--accent-red"
  },
  courses: {
    label: "Cursos",
    icon: "book-open",
    description:
      "Cursos, programas, plataformas y certificaciones cuyo propósito principal es enseñar o validar el aprendizaje sobre una tecnología o herramienta.",
    color: "--accent-green"
  },
  benchmarks: {
    label: "Benchmarks",
    icon: "gauge",
    description:
      "Pruebas comparativas de IA, web, frameworks, bases de datos y hardware. Cada ficha explica qué se mide, cómo se obtiene el resultado, quién lo respalda y qué límites tiene la comparación.",
    color: "--accent-cyan"
  },
  seo: {
    label: "SEO",
    icon: "search-check",
    description:
      "Optimización para motores de búsqueda (SEO): metadatos, rastreo, indexación y datos estructurados.",
    color: "--accent-lime"
  },
  accessibility: {
    label: "Accesibilidad",
    icon: "accessibility",
    description: "Interfaces y contenido que pueden utilizar más personas.",
    color: "--accent-cyan"
  },
  performance: {
    label: "Performance",
    icon: "gauge",
    description:
      "Rendimiento de carga, renderizado, tiempo de ejecución y optimización de recursos.",
    color: "--accent-pink"
  },
  security: {
    label: "Seguridad",
    icon: "shield-check",
    description: "Prácticas de seguridad para frontend, backend y APIs.",
    color: "--accent-red"
  },
  testing: {
    label: "Testing",
    icon: "test-tube-2",
    description:
      "Pruebas unitarias, de integración y de extremo a extremo (E2E), además de estrategias de validación.",
    color: "--accent-green"
  },
  "ui-ux": {
    label: "UI / UX",
    icon: "palette",
    description:
      "Interfaz de usuario (UI), experiencia de usuario (UX), interacción y sistemas visuales.",
    color: "--accent-orange"
  },
  architecture: {
    label: "Arquitectura",
    icon: "network",
    description:
      "Decisiones estructurales y patrones para proyectos mantenibles.",
    color: "--accent-blue"
  },
  resources: {
    label: "Recursos",
    icon: "bookmark",
    description:
      "Herramientas y referencias externas para resolver tareas concretas de diseño, desarrollo e inteligencia artificial. Cada ficha explica para qué sirve el recurso y qué conviene revisar antes de incorporarlo a un proyecto.",
    color: "--accent-orange"
  },
  agents: {
    label: "Agentes",
    icon: "bot",
    description:
      "Asistentes de programación con IA: configuración, memoria, comandos, extensiones y flujos de trabajo.",
    color: "--accent-pink"
  },
  skills: {
    label: "IA Tools",
    icon: "sparkles",
    description:
      "Recursos reutilizables para asistentes de IA: fundamentos, comandos, skills, plugins y protocolos.",
    color: "--accent-pink"
  }
} as const

export type CategoryId = keyof typeof CATEGORY_DEFINITIONS
export const CATEGORY_IDS = keysOf(CATEGORY_DEFINITIONS)

export interface CategoryMeta {
  id: CategoryId
  label: string
  icon: string
  description: string
  /** Variable CSS del color. */
  color: string
}

export const CATEGORIES = withIds(CATEGORY_DEFINITIONS) as Record<
  CategoryId,
  CategoryMeta
>

/** Bloques de la sidebar; fija el orden global de categorías. */
export const CATEGORY_GROUPS = [
  {
    id: "construir",
    categories: [
      "general",
      "languages",
      "frontend",
      "backend",
      "database",
      "testing",
      "devops"
    ]
  },
  { id: "producto", categories: ["ui-ux", "agents", "skills", "ai"] },
  { id: "flujo", categories: ["git", "terminal"] },
  {
    id: "calidad",
    categories: [
      "architecture",
      "security",
      "performance",
      "accessibility",
      "seo"
    ]
  },
  {
    id: "referencia",
    categories: [
      "applications",
      "courses",
      "findings",
      "benchmarks",
      "resources"
    ]
  }
] as const satisfies readonly {
  id: string
  categories: readonly CategoryId[]
}[]

const GROUPED_CATEGORY_IDS = CATEGORY_GROUPS.flatMap(
  (group) => group.categories as readonly CategoryId[]
)

// Una categoría sin grupo desaparecería de la navegación: mejor romper el build.
const UNGROUPED = CATEGORY_IDS.filter(
  (id) => !GROUPED_CATEGORY_IDS.includes(id)
)
if (UNGROUPED.length > 0) {
  throw new Error(
    `[categories] Categorías sin grupo en CATEGORY_GROUPS: ${UNGROUPED.join(", ")}`
  )
}

export const CATEGORY_LIST = GROUPED_CATEGORY_IDS.map((id) => CATEGORIES[id])
