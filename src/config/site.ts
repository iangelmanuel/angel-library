/**
 * Configuración central del sitio.
 *
 * Este archivo es la única fuente de verdad para:
 * - identidad del sitio
 * - tipos de contenido (colecciones)
 * - categorías (áreas de conocimiento)
 * - categorías de recursos
 *
 * Las rutas, la sidebar, el command palette y los schemas de contenido
 * se generan a partir de aquí. Para añadir un nuevo tipo o categoría,
 * basta con extender estas listas.
 */

export const SITE = {
  name: "angel.library",
  description:
    "Biblioteca personal de conocimiento técnico: snippets, recetas, comandos y referencias rápidas para desarrollo web.",
  locale: "es"
} as const

/* ------------------------------------------------------------------ */
/* Tipos de contenido                                                  */
/* ------------------------------------------------------------------ */

export const CONTENT_TYPE_IDS = [
  "technologies",
  "libraries",
  "integrations",
  "recipes",
  "snippets",
  "hooks",
  "utilities",
  "resources",
  "skills",
  "commands",
  "patterns",
  "practices",
  "guides",
  "tricks"
] as const

export type ContentTypeId = (typeof CONTENT_TYPE_IDS)[number]

export interface ContentTypeMeta {
  id: ContentTypeId
  /** Etiqueta en plural (listados, navegación) */
  label: string
  /** Etiqueta en singular (badges) */
  singular: string
  /** Nombre de icono (lucide) */
  icon: string
  description: string
}

export const CONTENT_TYPES: Record<ContentTypeId, ContentTypeMeta> = {
  technologies: {
    id: "technologies",
    label: "Tecnologías",
    singular: "Tecnología",
    icon: "cpu",
    description:
      "Tecnologías y lenguajes base: qué son, cuándo los uso y referencia rápida de lo esencial."
  },
  libraries: {
    id: "libraries",
    label: "Librerías",
    singular: "Librería",
    icon: "package",
    description:
      "Librerías que uso: instalación, API esencial, casos comunes, tips y errores típicos."
  },
  integrations: {
    id: "integrations",
    label: "Integraciones",
    singular: "Integración",
    icon: "blocks",
    description:
      "Cómo usar una tecnología dentro de otra. Solo las particularidades de la combinación, sin duplicar documentación."
  },
  recipes: {
    id: "recipes",
    label: "Recetas",
    singular: "Receta",
    icon: "list-checks",
    description:
      "Soluciones paso a paso a problemas concretos, con código listo para reutilizar."
  },
  snippets: {
    id: "snippets",
    label: "Snippets",
    singular: "Snippet",
    icon: "code",
    description:
      "Trozos de código reutilizables: hooks, utilidades, helpers y funciones."
  },
  hooks: {
    id: "hooks",
    label: "Hooks",
    singular: "Hook",
    icon: "repeat-2",
    description:
      "Hooks reutilizables con propósito, parámetros, retorno y ejemplos."
  },
  utilities: {
    id: "utilities",
    label: "Utilities",
    singular: "Utility",
    icon: "wrench",
    description:
      "Funciones pequeñas y reutilizables para browser, TypeScript y backend."
  },
  resources: {
    id: "resources",
    label: "Recursos",
    singular: "Recurso",
    icon: "link",
    description: "Herramientas y sitios externos que vale la pena recordar."
  },
  skills: {
    id: "skills",
    label: "Skills",
    singular: "Skill",
    icon: "sparkles",
    description:
      "Herramientas de desarrollo asistido por IA: configuración, agentes, comandos y workflows."
  },
  commands: {
    id: "commands",
    label: "Comandos",
    singular: "Comando",
    icon: "terminal",
    description:
      "Comandos que necesito con frecuencia: qué hacen, cuándo usarlos y sus riesgos."
  },
  patterns: {
    id: "patterns",
    label: "Patrones",
    singular: "Patrón",
    icon: "layout-template",
    description:
      "Patrones y estructuras de arquitectura que repito entre proyectos."
  },
  practices: {
    id: "practices",
    label: "Buenas prácticas",
    singular: "Buena práctica",
    icon: "badge-check",
    description:
      "Reglas prácticas para mejorar calidad, seguridad, accesibilidad y mantenimiento."
  },
  guides: {
    id: "guides",
    label: "Guías prácticas",
    singular: "Guía",
    icon: "book-open",
    description:
      "Referencias prácticas con varios pasos, sin convertirse en cursos extensos."
  },
  tricks: {
    id: "tricks",
    label: "Trucos",
    singular: "Truco",
    icon: "zap",
    description:
      "Soluciones específicas y atajos que resuelven problemas puntuales."
  }
}

export const CONTENT_TYPE_LIST = CONTENT_TYPE_IDS.map((id) => CONTENT_TYPES[id])

/* ------------------------------------------------------------------ */
/* Categorías (áreas de conocimiento)                                  */
/* ------------------------------------------------------------------ */

export const CATEGORY_IDS = [
  "general",
  "languages",
  "frontend",
  "backend",
  "database",
  "architecture",
  "testing",
  "security",
  "performance",
  "accessibility",
  "ui-ux",
  "seo",
  "ai",
  "devops",
  "git",
  "terminal",
  "applications",
  "skills",
  "resources"
] as const

export type CategoryId = (typeof CATEGORY_IDS)[number]

export interface CategoryMeta {
  id: CategoryId
  label: string
  icon: string
  description: string
  /** Nombre de variable CSS (definida en global.css) usada para colorear
   *  esta categoría en la sidebar y en el título de su página de listado. */
  color: string
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  general: {
    id: "general",
    label: "General",
    icon: "globe",
    description:
      "Librerías, TypeScript, utilidades, snippets y patrones reutilizables para el desarrollo diario.",
    color: "--accent-blue"
  },
  languages: {
    id: "languages",
    label: "Lenguajes",
    icon: "code",
    description:
      "HTML, CSS y JavaScript: fundamentos, APIs del navegador y prácticas del lenguaje.",
    color: "--accent-yellow"
  },
  frontend: {
    id: "frontend",
    label: "Frontend",
    icon: "monitor",
    description:
      "Frontend, interfaz de usuario (UI), renderizado en el navegador y frameworks de componentes.",
    color: "--accent-indigo"
  },
  backend: {
    id: "backend",
    label: "Backend",
    icon: "server",
    description:
      "Servidores, interfaces de programación de aplicaciones (APIs) y arquitectura de backend.",
    color: "--accent-green"
  },
  database: {
    id: "database",
    label: "Bases de datos",
    icon: "database",
    description:
      "Bases de datos, mapeadores objeto-relacionales (ORM), consultas y persistencia.",
    color: "--accent-purple"
  },
  ai: {
    id: "ai",
    label: "IA SDK",
    icon: "brain",
    description:
      "Programar contra modelos de IA desde el código: SDKs, prompts, contexto, RAG, agentes y evaluaciones.",
    color: "--accent-pink"
  },
  devops: {
    id: "devops",
    label: "DevOps",
    icon: "container",
    description:
      "Desarrollo y operaciones (DevOps): entrega continua, despliegue, infraestructura y observabilidad.",
    color: "--accent-orange"
  },
  git: {
    id: "git",
    label: "Git & GitHub",
    icon: "git-branch",
    description:
      "Git, GitHub y su ecosistema: comandos, repositorios, colaboración, perfil y automatización con Actions.",
    color: "--accent-yellow"
  },
  terminal: {
    id: "terminal",
    label: "Terminal & CLI",
    icon: "terminal",
    description:
      "Terminales e interfaces de línea de comandos (CLI) para Windows, macOS y Linux.",
    color: "--accent-teal"
  },
  applications: {
    id: "applications",
    label: "Aplicaciones",
    icon: "app-window",
    description:
      "Aplicaciones de escritorio para editar código, trabajar en la terminal y desarrollar o probar APIs.",
    color: "--accent-indigo"
  },
  seo: {
    id: "seo",
    label: "SEO",
    icon: "search-check",
    description:
      "Optimización para motores de búsqueda (SEO): metadatos, rastreo, indexación y datos estructurados.",
    color: "--accent-lime"
  },
  accessibility: {
    id: "accessibility",
    label: "Accesibilidad",
    icon: "accessibility",
    description: "Interfaces y contenido que pueden utilizar más personas.",
    color: "--accent-indigo"
  },
  performance: {
    id: "performance",
    label: "Performance",
    icon: "gauge",
    description:
      "Rendimiento de carga, renderizado, tiempo de ejecución y optimización de recursos.",
    color: "--accent-amber"
  },
  security: {
    id: "security",
    label: "Seguridad",
    icon: "shield-check",
    description: "Prácticas de seguridad para frontend, backend y APIs.",
    color: "--accent-red"
  },
  testing: {
    id: "testing",
    label: "Testing",
    icon: "test-tube-2",
    description:
      "Pruebas unitarias, de integración y de extremo a extremo (E2E), además de estrategias de validación.",
    color: "--accent-green"
  },
  "ui-ux": {
    id: "ui-ux",
    label: "UI / UX",
    icon: "palette",
    description:
      "Interfaz de usuario (UI), experiencia de usuario (UX), interacción y sistemas visuales.",
    color: "--accent-purple"
  },
  architecture: {
    id: "architecture",
    label: "Arquitectura",
    icon: "network",
    description:
      "Decisiones estructurales y patrones para proyectos mantenibles.",
    color: "--accent-blue"
  },
  resources: {
    id: "resources",
    label: "Recursos",
    icon: "bookmark",
    description: "Colección de recursos externos categorizados.",
    color: "--accent-yellow"
  },
  skills: {
    id: "skills",
    label: "IA Tools & Skills",
    icon: "bot",
    description:
      "Herramientas de inteligencia artificial (IA) para programar: agentes, skills, plugins y protocolos.",
    color: "--accent-pink"
  }
}

/**
 * Bloques de categorías para la navegación. Cada grupo se dibuja separado
 * por una línea en la sidebar, de modo que el listado no sea una lista
 * plana de 19 elementos sino cinco bloques con una lógica reconocible:
 * construir → producto e IA → flujo de trabajo → calidad → referencia.
 *
 * Este arreglo es además el **orden real de las categorías en todo el
 * sitio**: `CATEGORY_LIST` se deriva de aquí, así que la home, la sidebar
 * y las páginas de tags comparten la misma secuencia.
 */
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
  { id: "producto", categories: ["ui-ux", "ai", "skills"] },
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
  { id: "referencia", categories: ["applications", "resources"] }
] as const satisfies readonly {
  id: string
  categories: readonly CategoryId[]
}[]

const GROUPED_CATEGORY_IDS = CATEGORY_GROUPS.flatMap(
  (group) => group.categories as readonly CategoryId[]
)

// Red de seguridad: una categoría nueva en CATEGORY_IDS que nadie asignó a
// un grupo desaparecería de la navegación sin avisar. Preferimos que falle
// el build, igual que con una referencia de contenido rota.
const UNGROUPED = CATEGORY_IDS.filter((id) => !GROUPED_CATEGORY_IDS.includes(id))
if (UNGROUPED.length > 0) {
  throw new Error(
    `[site] Categorías sin grupo en CATEGORY_GROUPS: ${UNGROUPED.join(", ")}`
  )
}

export const CATEGORY_LIST = GROUPED_CATEGORY_IDS.map((id) => CATEGORIES[id])

/* ------------------------------------------------------------------ */
/* Categorías de recursos externos                                     */
/* ------------------------------------------------------------------ */

export const RESOURCE_CATEGORY_IDS = [
  "ui-inspiration",
  "css",
  "colors",
  "gradients",
  "glassmorphism",
  "icons",
  "animations",
  "loaders",
  "fonts",
  "illustrations",
  "apis",
  "generators",
  "accessibility",
  "developer-tools",
  "learning",
  "ia"
] as const

export type ResourceCategoryId = (typeof RESOURCE_CATEGORY_IDS)[number]

export const RESOURCE_CATEGORIES: Record<ResourceCategoryId, string> = {
  "ui-inspiration": "UI Inspiration",
  css: "CSS",
  colors: "Colores",
  gradients: "Gradientes",
  glassmorphism: "Glassmorphism",
  icons: "Iconos",
  animations: "Animaciones",
  loaders: "Loaders",
  fonts: "Fuentes",
  illustrations: "Ilustraciones",
  apis: "APIs",
  generators: "Generadores",
  accessibility: "Accesibilidad",
  "developer-tools": "Developer Tools",
  learning: "Aprendizaje",
  ia: "IA"
}

export const RESOURCE_CATEGORY_LIST = RESOURCE_CATEGORY_IDS.map((id) => ({
  id,
  label: RESOURCE_CATEGORIES[id]
}))

/* ------------------------------------------------------------------ */
/* Stacks (subcategorías y rutas de aprendizaje por categoría)         */
/* ------------------------------------------------------------------ */

/**
 * Cada stack puede reutilizarse en varias categorías (por ejemplo, Astro o
 * Next.js), pero CATEGORY_STACK_ORDER define una curva de aprendizaje propia.
 * Los grupos vacíos se filtran en la navegación y en la página de categoría.
 */
export const STACK_IDS = [
  "frontend-fundamentos",
  "config",
  "monorepo",
  "packages",
  "backend-fundamentos",
  "devops-fundamentos",
  "ui-ux-fundamentos",
  "skills-fundamentos",
  "node",
  "express",
  "astro",
  "html",
  "react",
  "nextjs",
  "git",
  "github",
  "github-platform",
  "github-actions",
  "github-profile",
  "repository-management",
  "claude-code",
  "opencode",
  "cursor",
  "codex",
  "ia-comandos",
  "ia-skills",
  "ia-plugins",
  "ia-mcp",
  "docker-conceptos",
  "docker-imagenes",
  "docker-contenedores",
  "docker-redes-volumenes",
  "docker-compose",
  "docker-bases-datos",
  "ci-cd",
  "observabilidad",
  "javascript",
  "css",
  "typescript",
  "utils",
  "terminal",
  "cli",
  "seo",
  "seo-tecnico",
  "seo-contenido",
  "database-fundamentos",
  "database-modelado",
  "database-sql",
  "database-postgresql",
  "database-nosql",
  "database-operacion",
  "ai-fundamentos",
  "ai-prompts",
  "ai-rag",
  "ai-agentes",
  "ai-sdk",
  "a11y-fundamentos",
  "a11y-contenido",
  "a11y-interaccion",
  "a11y-testing",
  "performance-fundamentos",
  "performance-carga",
  "performance-runtime",
  "performance-operacion",
  "security-fundamentos",
  "security-aplicacion",
  "security-infra",
  "security-testing",
  "testing-fundamentos",
  "testing-unitario",
  "testing-integracion",
  "testing-e2e",
  "testing-ai",
  "apps-editors",
  "apps-terminal",
  "apps-api",
  "apps-devops",
  "apps-design",
  "apps-productivity",
  "apps-comms",
  "ui-ux-design-systems",
  "ui-ux-interaccion",
  "ui-css",
  "ui-react",
  "cloud-fundamentos",
  "infraestructura-codigo",
  "principios",
  "patrones-diseno",
  "patrones-arquitectonicos"
] as const

export type StackId = (typeof STACK_IDS)[number]

export interface StackMeta {
  id: StackId
  label: string
  /** Icono de marca (ver src/lib/icons.ts) */
  icon: string
}

export const STACKS: Record<StackId, StackMeta> = {
  "frontend-fundamentos": {
    id: "frontend-fundamentos",
    label: "Fundamentos de frontend",
    icon: "brand-frontend-fundamentos"
  },
  config: { id: "config", label: "Config", icon: "brand-config" },
  monorepo: { id: "monorepo", label: "Monorepo", icon: "brand-monorepo" },
  packages: { id: "packages", label: "Paquetes", icon: "brand-packages" },
  "backend-fundamentos": {
    id: "backend-fundamentos",
    label: "Fundamentos de backend",
    icon: "brand-backend-fundamentos"
  },
  "devops-fundamentos": {
    id: "devops-fundamentos",
    label: "Fundamentos de DevOps",
    icon: "brand-devops-fundamentos"
  },
  "ui-ux-fundamentos": {
    id: "ui-ux-fundamentos",
    label: "Fundamentos de UI / UX",
    icon: "brand-ui-ux-fundamentos"
  },
  "skills-fundamentos": {
    id: "skills-fundamentos",
    label: "Fundamentos de IA Tools",
    icon: "brand-skills-fundamentos"
  },
  node: { id: "node", label: "Node.js", icon: "brand-node" },
  express: { id: "express", label: "Express", icon: "brand-express" },
  astro: { id: "astro", label: "Astro", icon: "brand-astro" },
  html: { id: "html", label: "HTML", icon: "brand-html" },
  react: { id: "react", label: "React", icon: "brand-react" },
  nextjs: { id: "nextjs", label: "Next.js", icon: "brand-nextjs" },
  git: { id: "git", label: "Git", icon: "brand-git" },
  github: { id: "github", label: "GitHub CLI", icon: "brand-github" },
  "github-platform": {
    id: "github-platform",
    label: "GitHub",
    icon: "brand-github"
  },
  "github-actions": {
    id: "github-actions",
    label: "GitHub Actions",
    icon: "workflow"
  },
  "github-profile": {
    id: "github-profile",
    label: "Perfil y cuenta",
    icon: "brand-github-profile"
  },
  "repository-management": {
    id: "repository-management",
    label: "Gestión de repositorios",
    icon: "brand-repository-management"
  },
  "claude-code": {
    id: "claude-code",
    label: "Claude Code",
    icon: "brand-claude-code"
  },
  opencode: { id: "opencode", label: "OpenCode", icon: "brand-opencode" },
  cursor: { id: "cursor", label: "Cursor", icon: "brand-cursor" },
  codex: { id: "codex", label: "Codex CLI", icon: "brand-codex" },
  "ia-comandos": {
    id: "ia-comandos",
    label: "Comandos",
    icon: "brand-ia-comandos"
  },
  "ia-skills": { id: "ia-skills", label: "Skills", icon: "brand-ia-skills" },
  "ia-plugins": {
    id: "ia-plugins",
    label: "Plugins",
    icon: "brand-ia-plugins"
  },
  "ia-mcp": { id: "ia-mcp", label: "MCP", icon: "brand-ia-mcp" },
  "docker-conceptos": {
    id: "docker-conceptos",
    label: "Conceptos básicos",
    icon: "brand-docker-conceptos"
  },
  "docker-imagenes": {
    id: "docker-imagenes",
    label: "Imágenes",
    icon: "brand-docker-imagenes"
  },
  "docker-contenedores": {
    id: "docker-contenedores",
    label: "Contenedores",
    icon: "brand-docker-contenedores"
  },
  "docker-redes-volumenes": {
    id: "docker-redes-volumenes",
    label: "Redes y volúmenes",
    icon: "brand-docker-redes-volumenes"
  },
  "docker-compose": {
    id: "docker-compose",
    label: "Docker Compose",
    icon: "brand-docker-compose"
  },
  "docker-bases-datos": {
    id: "docker-bases-datos",
    label: "Bases de datos",
    icon: "brand-docker-bases-datos"
  },
  "ci-cd": { id: "ci-cd", label: "CI/CD y despliegue", icon: "brand-ci-cd" },
  observabilidad: {
    id: "observabilidad",
    label: "Observabilidad y operación",
    icon: "brand-observabilidad"
  },
  javascript: {
    id: "javascript",
    label: "JavaScript y Web APIs",
    icon: "brand-javascript"
  },
  css: { id: "css", label: "CSS", icon: "brand-css" },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    icon: "brand-typescript"
  },
  utils: { id: "utils", label: "Utils", icon: "brand-typescript" },
  terminal: { id: "terminal", label: "Terminal", icon: "brand-terminal" },
  cli: { id: "cli", label: "CLI", icon: "brand-cli" },
  seo: { id: "seo", label: "Fundamentos de SEO", icon: "brand-seo" },
  "seo-tecnico": {
    id: "seo-tecnico",
    label: "SEO técnico",
    icon: "brand-seo-tecnico"
  },
  "seo-contenido": {
    id: "seo-contenido",
    label: "Contenido y autoridad",
    icon: "brand-seo-contenido"
  },
  "database-fundamentos": {
    id: "database-fundamentos",
    label: "Fundamentos",
    icon: "brand-database-fundamentos"
  },
  "database-modelado": {
    id: "database-modelado",
    label: "Modelado y relaciones",
    icon: "brand-database-modelado"
  },
  "database-sql": {
    id: "database-sql",
    label: "SQL y consultas",
    icon: "brand-database-sql"
  },
  "database-postgresql": {
    id: "database-postgresql",
    label: "PostgreSQL",
    icon: "brand-database-postgresql"
  },
  "database-nosql": {
    id: "database-nosql",
    label: "NoSQL",
    icon: "brand-database-nosql"
  },
  "database-operacion": {
    id: "database-operacion",
    label: "Operación y recuperación",
    icon: "brand-database-operacion"
  },
  "ai-fundamentos": {
    id: "ai-fundamentos",
    label: "Fundamentos de IA",
    icon: "brand-ai-fundamentos"
  },
  "ai-prompts": {
    id: "ai-prompts",
    label: "Prompts y contexto",
    icon: "brand-ai-prompts"
  },
  "ai-rag": { id: "ai-rag", label: "Embeddings y RAG", icon: "brand-ai-rag" },
  "ai-agentes": {
    id: "ai-agentes",
    label: "Agentes, herramientas y evaluación",
    icon: "brand-ai-agentes"
  },
  "ai-sdk": { id: "ai-sdk", label: "SDK para IA", icon: "brand-ai-sdk" },
  "a11y-fundamentos": {
    id: "a11y-fundamentos",
    label: "Fundamentos de accesibilidad",
    icon: "brand-a11y-fundamentos"
  },
  "a11y-contenido": {
    id: "a11y-contenido",
    label: "Contenido perceptible",
    icon: "brand-a11y-contenido"
  },
  "a11y-interaccion": {
    id: "a11y-interaccion",
    label: "Semántica e interacción",
    icon: "brand-a11y-interaccion"
  },
  "a11y-testing": {
    id: "a11y-testing",
    label: "Pruebas de accesibilidad",
    icon: "brand-a11y-testing"
  },
  "performance-fundamentos": {
    id: "performance-fundamentos",
    label: "Fundamentos y métricas",
    icon: "brand-performance-fundamentos"
  },
  "performance-carga": {
    id: "performance-carga",
    label: "Carga y recursos",
    icon: "brand-performance-carga"
  },
  "performance-runtime": {
    id: "performance-runtime",
    label: "JavaScript y renderizado",
    icon: "brand-performance-runtime"
  },
  "performance-operacion": {
    id: "performance-operacion",
    label: "Red y operación",
    icon: "brand-performance-operacion"
  },
  "security-fundamentos": {
    id: "security-fundamentos",
    label: "Fundamentos y amenazas",
    icon: "brand-security-fundamentos"
  },
  "security-aplicacion": {
    id: "security-aplicacion",
    label: "Aplicación y API",
    icon: "brand-security-aplicacion"
  },
  "security-infra": {
    id: "security-infra",
    label: "Infraestructura y disponibilidad",
    icon: "brand-security-infra"
  },
  "security-testing": {
    id: "security-testing",
    label: "Verificación de seguridad",
    icon: "brand-security-testing"
  },
  "testing-fundamentos": {
    id: "testing-fundamentos",
    label: "Fundamentos y estrategia",
    icon: "brand-testing-fundamentos"
  },
  "testing-unitario": {
    id: "testing-unitario",
    label: "Pruebas unitarias",
    icon: "brand-testing-unitario"
  },
  "testing-integracion": {
    id: "testing-integracion",
    label: "Integración y contratos",
    icon: "brand-testing-integracion"
  },
  "testing-e2e": {
    id: "testing-e2e",
    label: "Pruebas E2E",
    icon: "brand-testing-e2e"
  },
  "testing-ai": {
    id: "testing-ai",
    label: "Testing asistido por IA",
    icon: "brand-testing-ai"
  },
  "apps-editors": {
    id: "apps-editors",
    label: "Editores de código",
    icon: "brand-apps-editors"
  },
  "apps-terminal": {
    id: "apps-terminal",
    label: "Terminales",
    icon: "brand-apps-terminal"
  },
  "apps-api": {
    id: "apps-api",
    label: "Clientes de API",
    icon: "brand-apps-api"
  },
  "apps-devops": {
    id: "apps-devops",
    label: "DevOps y contenedores",
    icon: "brand-apps-devops"
  },
  "apps-design": {
    id: "apps-design",
    label: "Diseño y diagramación",
    icon: "brand-apps-design"
  },
  "apps-productivity": {
    id: "apps-productivity",
    label: "Notas y documentación",
    icon: "brand-apps-productivity"
  },
  "apps-comms": {
    id: "apps-comms",
    label: "Comunicación",
    icon: "brand-apps-comms"
  },
  "ui-ux-design-systems": {
    id: "ui-ux-design-systems",
    label: "Sistemas de diseño",
    icon: "brand-ui-ux-design-systems"
  },
  "ui-ux-interaccion": {
    id: "ui-ux-interaccion",
    label: "Diseño de interacción",
    icon: "brand-ui-ux-interaccion"
  },
  "ui-css": { id: "ui-css", label: "UI con CSS", icon: "brand-ui-css" },
  "ui-react": { id: "ui-react", label: "UI con React", icon: "brand-ui-react" },
  "cloud-fundamentos": {
    id: "cloud-fundamentos",
    label: "Fundamentos de nube",
    icon: "brand-cloud-fundamentos"
  },
  "infraestructura-codigo": {
    id: "infraestructura-codigo",
    label: "Infraestructura como código",
    icon: "brand-infraestructura-codigo"
  },
  principios: {
    id: "principios",
    label: "Principios",
    icon: "brand-principios"
  },
  "patrones-diseno": {
    id: "patrones-diseno",
    label: "Patrones de diseño",
    icon: "brand-patrones-diseno"
  },
  "patrones-arquitectonicos": {
    id: "patrones-arquitectonicos",
    label: "Patrones arquitectónicos",
    icon: "brand-patrones-arquitectonicos"
  }
}

export const STACK_LIST = STACK_IDS.map((id) => STACKS[id])

/**
 * Cada categoría necesita su propia progresión. Un único orden global hacía,
 * por ejemplo, que Astro apareciera antes de HTML o que herramientas avanzadas
 * se adelantaran a sus fundamentos. Los stacks no declarados se añaden al final
 * como fallback para que una nueva subcategoría nunca desaparezca.
 */
export const CATEGORY_STACK_ORDER: Partial<
  Record<CategoryId, readonly StackId[]>
> = {
  general: ["config", "monorepo", "packages", "typescript", "utils"],
  languages: ["html", "css", "javascript"],
  frontend: ["frontend-fundamentos", "astro", "react", "nextjs"],
  backend: ["backend-fundamentos", "node", "express", "astro", "nextjs"],
  database: [
    "database-fundamentos",
    "database-modelado",
    "database-sql",
    "database-postgresql",
    "database-nosql",
    "database-operacion"
  ],
  ai: ["ai-fundamentos", "ai-prompts", "ai-rag", "ai-agentes", "ai-sdk"],
  devops: [
    "devops-fundamentos",
    "cloud-fundamentos",
    "infraestructura-codigo",
    "docker-conceptos",
    "docker-imagenes",
    "docker-contenedores",
    "docker-redes-volumenes",
    "docker-compose",
    "docker-bases-datos",
    "ci-cd",
    "observabilidad"
  ],
  git: [
    "git",
    "github-platform",
    "repository-management",
    "github-profile",
    "github",
    "github-actions"
  ],
  terminal: ["terminal", "cli"],
  seo: ["seo", "seo-tecnico", "seo-contenido", "astro", "nextjs"],
  accessibility: [
    "a11y-fundamentos",
    "a11y-contenido",
    "a11y-interaccion",
    "a11y-testing"
  ],
  performance: [
    "performance-fundamentos",
    "performance-carga",
    "performance-runtime",
    "performance-operacion"
  ],
  security: [
    "security-fundamentos",
    "security-aplicacion",
    "security-infra",
    "security-testing"
  ],
  testing: [
    "testing-fundamentos",
    "testing-unitario",
    "testing-integracion",
    "react",
    "astro",
    "nextjs",
    "testing-e2e",
    "testing-ai"
  ],
  applications: [
    "apps-editors",
    "apps-terminal",
    "apps-api",
    "apps-devops",
    "apps-design",
    "apps-productivity",
    "apps-comms"
  ],
  skills: [
    "skills-fundamentos",
    "claude-code",
    "codex",
    "cursor",
    "opencode",
    "ia-comandos",
    "ia-skills",
    "ia-plugins",
    "ia-mcp"
  ],
  "ui-ux": [
    "ui-ux-fundamentos",
    "ui-ux-design-systems",
    "ui-ux-interaccion",
    "ui-css",
    "ui-react"
  ],
  architecture: ["principios", "patrones-diseno", "patrones-arquitectonicos"]
}

export function getStacksForCategory(category: CategoryId): StackMeta[] {
  const preferred = CATEGORY_STACK_ORDER[category] ?? []
  const remaining = STACK_IDS.filter((id) => !preferred.includes(id))
  return [...preferred, ...remaining].map((id) => STACKS[id])
}

/** Categorías que agrupan sus entradas por stack en vez de listarlas planas. */
export const STACK_GROUPED_CATEGORIES: CategoryId[] = [
  "general",
  "languages",
  "frontend",
  "backend",
  "database",
  "architecture",
  "testing",
  "security",
  "performance",
  "accessibility",
  "ui-ux",
  "seo",
  "ai",
  "devops",
  "git",
  "terminal",
  "applications",
  "skills"
]
