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

/** Conserva el orden de declaración y el tipo literal de las claves. */
function keysOf<const Values extends Record<string, unknown>>(values: Values) {
  return Object.keys(values) as unknown as readonly [
    keyof Values & string,
    ...(keyof Values & string)[]
  ]
}

/** Copia cada entrada añadiéndole su clave como campo `id`. */
function withIds<Id extends string, Value>(values: Record<Id, Value>) {
  const entries = Object.entries(values) as [Id, Value][]
  return Object.fromEntries(
    entries.map(([id, value]) => [id, { ...value, id }])
  ) as Record<Id, Value & { id: Id }>
}

/* ------------------------------------------------------------------ */
/* Tipos de contenido                                                  */
/* ------------------------------------------------------------------ */

const CONTENT_TYPE_DEFINITIONS = {
  technologies: {
    label: "Tecnologías",
    singular: "Tecnología",
    icon: "cpu",
    description:
      "Tecnologías y lenguajes base: qué son, cuándo los uso y referencia rápida de lo esencial."
  },
  libraries: {
    label: "Librerías",
    singular: "Librería",
    icon: "package",
    description:
      "Librerías que uso: instalación, API esencial, casos comunes, tips y errores típicos."
  },
  integrations: {
    label: "Integraciones",
    singular: "Integración",
    icon: "blocks",
    description:
      "Cómo usar una tecnología dentro de otra. Solo las particularidades de la combinación, sin duplicar documentación."
  },
  recipes: {
    label: "Recetas",
    singular: "Receta",
    icon: "list-checks",
    description:
      "Soluciones paso a paso a problemas concretos, con código listo para reutilizar."
  },
  snippets: {
    label: "Snippets",
    singular: "Snippet",
    icon: "code",
    description:
      "Trozos de código reutilizables: hooks, utilidades, helpers y funciones."
  },
  hooks: {
    label: "Hooks",
    singular: "Hook",
    icon: "repeat-2",
    description:
      "Hooks reutilizables con propósito, parámetros, retorno y ejemplos."
  },
  utilities: {
    label: "Utilities",
    singular: "Utility",
    icon: "wrench",
    description:
      "Funciones pequeñas y reutilizables para browser, TypeScript y backend."
  },
  resources: {
    label: "Recursos",
    singular: "Recurso",
    icon: "link",
    description: "Herramientas y sitios externos que vale la pena recordar."
  },
  skills: {
    label: "Skills",
    singular: "Skill",
    icon: "sparkles",
    description:
      "Herramientas de desarrollo asistido por IA: configuración, agentes, comandos y workflows."
  },
  commands: {
    label: "Comandos",
    singular: "Comando",
    icon: "terminal",
    description:
      "Comandos que necesito con frecuencia: qué hacen, cuándo usarlos y sus riesgos."
  },
  patterns: {
    label: "Patrones",
    singular: "Patrón",
    icon: "layout-template",
    description:
      "Patrones y estructuras de arquitectura que repito entre proyectos."
  },
  practices: {
    label: "Buenas prácticas",
    singular: "Buena práctica",
    icon: "badge-check",
    description:
      "Reglas prácticas para mejorar calidad, seguridad, accesibilidad y mantenimiento."
  },
  guides: {
    label: "Guías prácticas",
    singular: "Guía",
    icon: "book-open",
    description:
      "Referencias prácticas con varios pasos, sin convertirse en cursos extensos."
  },
  tricks: {
    label: "Trucos",
    singular: "Truco",
    icon: "zap",
    description:
      "Soluciones específicas y atajos que resuelven problemas puntuales."
  }
} as const

export type ContentTypeId = keyof typeof CONTENT_TYPE_DEFINITIONS

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

export const CONTENT_TYPES = withIds(CONTENT_TYPE_DEFINITIONS) as Record<
  ContentTypeId,
  ContentTypeMeta
>
export const CONTENT_TYPE_IDS = keysOf(CONTENT_TYPE_DEFINITIONS)

export const CONTENT_TYPE_LIST = CONTENT_TYPE_IDS.map((id) => CONTENT_TYPES[id])

/* ------------------------------------------------------------------ */
/* Categorías (áreas de conocimiento)                                  */
/* ------------------------------------------------------------------ */

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
    color: "--accent-yellow"
  },
  frontend: {
    label: "Frontend",
    icon: "monitor",
    description:
      "Frontend, interfaz de usuario (UI), renderizado en el navegador y frameworks de componentes.",
    color: "--accent-indigo"
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
    color: "--accent-purple"
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
    color: "--accent-orange"
  },
  git: {
    label: "Git & GitHub",
    icon: "git-branch",
    description:
      "Git, GitHub y su ecosistema: comandos, repositorios, colaboración, perfil y automatización con Actions.",
    color: "--accent-yellow"
  },
  terminal: {
    label: "Terminal & CLI",
    icon: "terminal",
    description:
      "Terminales e interfaces de línea de comandos (CLI) para Windows, macOS y Linux.",
    color: "--accent-teal"
  },
  applications: {
    label: "Aplicaciones",
    icon: "app-window",
    description:
      "Aplicaciones de escritorio y herramientas CLI para editar código, preparar el entorno, colaborar, desplegar y probar APIs.",
    color: "--accent-indigo"
  },
  findings: {
    label: "Hallazgos",
    icon: "telescope",
    description:
      "Repositorios y proyectos que vale la pena conocer: ideas nuevas, funcionalidades poco comunes y trabajo de gente que lo comparte abierto.",
    color: "--accent-teal"
  },
  courses: {
    label: "Cursos",
    icon: "book-open",
    description:
      "Cursos y rutas de estudio organizadas para aprender tecnologías y conceptos paso a paso.",
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
    color: "--accent-indigo"
  },
  performance: {
    label: "Performance",
    icon: "gauge",
    description:
      "Rendimiento de carga, renderizado, tiempo de ejecución y optimización de recursos.",
    color: "--accent-amber"
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
    color: "--accent-purple"
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
    description: "Colección de recursos externos categorizados.",
    color: "--accent-yellow"
  },
  skills: {
    label: "IA Tools & Skills",
    icon: "bot",
    description:
      "Herramientas de inteligencia artificial (IA) para programar: agentes, skills, plugins y protocolos.",
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
  /** Nombre de variable CSS (definida en global.css) usada para colorear
   *  esta categoría en la sidebar y en el título de su página de listado. */
  color: string
}

export const CATEGORIES = withIds(CATEGORY_DEFINITIONS) as Record<
  CategoryId,
  CategoryMeta
>

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
  {
    id: "referencia",
    categories: ["applications", "courses", "findings", "resources"]
  }
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

const RESOURCE_CATEGORY_DEFINITIONS = {
  "ui-inspiration": {
    label: "UI Inspiration",
    description:
      "Galerías de interfaces reales para inspirarte antes de diseñar una pantalla."
  },
  css: {
    label: "CSS",
    description:
      "Generadores de CSS listo para copiar: sombras, degradados, vidrio y otros efectos."
  },
  colors: {
    label: "Colores",
    description:
      "Paletas y comprobadores de contraste para elegir colores que se lean bien."
  },
  icons: {
    label: "Iconos",
    description:
      "Colecciones de iconos libres para usar en una interfaz."
  },
  animations: {
    label: "Animaciones",
    description:
      "Movimiento y transiciones listos para copiar en un proyecto."
  },
  loaders: {
    label: "Loaders",
    description:
      "Indicadores de carga: spinners, barras y esqueletos."
  },
  fonts: {
    label: "Fuentes",
    description:
      "Tipografías libres y herramientas para combinarlas."
  },
  illustrations: {
    label: "Ilustraciones",
    description:
      "Dibujos y gráficos libres para acompañar una página."
  },
  images: {
    label: "Imágenes y mockups",
    description:
      "Editar, comprimir y presentar capturas de pantalla."
  },
  apis: {
    label: "APIs",
    description:
      "Directorios de APIs públicas para alimentar un proyecto con datos reales."
  },
  generators: {
    label: "Generadores",
    description:
      "Herramientas que producen código o recursos a partir de unas opciones."
  },
  accessibility: {
    label: "Accesibilidad",
    description:
      "Comprobadores para verificar que la interfaz se pueda usar."
  },
  "developer-tools": {
    label: "Developer Tools",
    description:
      "Utilidades sueltas que resuelven tareas del día a día."
  },
  learning: {
    label: "Aprendizaje",
    description:
      "Cursos y material de estudio."
  },
  ia: {
    label: "IA",
    description:
      "Herramientas y directorios de inteligencia artificial."
  }
} as const

export type ResourceCategoryId = keyof typeof RESOURCE_CATEGORY_DEFINITIONS

export interface ResourceCategoryMeta {
  id: ResourceCategoryId
  label: string
  /** Una línea que explica qué se va a encontrar en el grupo. */
  description: string
}

export const RESOURCE_CATEGORY_IDS = keysOf(RESOURCE_CATEGORY_DEFINITIONS)

export const RESOURCE_CATEGORY_LIST: ResourceCategoryMeta[] =
  RESOURCE_CATEGORY_IDS.map((id) => ({
    id,
    ...RESOURCE_CATEGORY_DEFINITIONS[id]
  }))

/** Solo la etiqueta, para las insignias de las entradas. */
export const RESOURCE_CATEGORIES: Record<ResourceCategoryId, string> =
  Object.fromEntries(
    RESOURCE_CATEGORY_IDS.map((id) => [id, RESOURCE_CATEGORY_DEFINITIONS[id].label])
  ) as Record<ResourceCategoryId, string>

/* ------------------------------------------------------------------ */
/* Stacks (subcategorías y rutas de aprendizaje por categoría)         */
/* ------------------------------------------------------------------ */

/**
 * Subcategorías dentro de una categoría. Un mismo stack puede aparecer en
 * varias categorías; CATEGORY_STACK_ORDER decide el orden en cada una.
 */
const STACK_LABELS = {
  "frontend-fundamentos": "Fundamentos de frontend",
  config: "Config",
  monorepo: "Monorepo",
  packages: "Paquetes",
  "backend-fundamentos": "Fundamentos de backend",
  "devops-fundamentos": "Fundamentos de DevOps",
  "ui-ux-fundamentos": "Fundamentos de UI / UX",
  "ui-ux-estilos": "Estilos visuales",
  "skills-fundamentos": "Fundamentos de IA Tools",
  node: "Node.js",
  express: "Express",
  astro: "Astro",
  html: "HTML",
  react: "React",
  nextjs: "Next.js",
  git: "Git",
  github: "GitHub CLI",
  "github-platform": "GitHub",
  "github-actions": "GitHub Actions",
  "github-profile": "Perfil y cuenta",
  "repository-management": "Gestión de repositorios",
  "claude-code": "Claude Code",
  opencode: "OpenCode",
  cursor: "Cursor",
  codex: "Codex CLI",
  "ia-comandos": "Comandos",
  "ia-skills": "Skills",
  "ia-plugins": "Plugins",
  "ia-mcp": "MCP",
  "docker-conceptos": "Conceptos básicos",
  "docker-imagenes": "Imágenes",
  "docker-contenedores": "Contenedores",
  "docker-redes-volumenes": "Redes y volúmenes",
  "docker-compose": "Docker Compose",
  "docker-bases-datos": "Bases de datos",
  "ci-cd": "CI/CD y despliegue",
  observabilidad: "Observabilidad y operación",
  javascript: "JavaScript y Web APIs",
  css: "CSS",
  typescript: "TypeScript",
  utils: "Utils",
  whatsapp: "WhatsApp API",
  terminal: "Terminal",
  cli: "CLI",
  seo: "Fundamentos de SEO",
  "seo-tecnico": "SEO técnico",
  "seo-contenido": "Contenido y autoridad",
  "database-fundamentos": "Fundamentos",
  "database-modelado": "Modelado y relaciones",
  "database-sql": "SQL y consultas",
  "database-postgresql": "PostgreSQL",
  "database-nosql": "NoSQL",
  "database-operacion": "Operación y recuperación",
  "ai-fundamentos": "Fundamentos de IA",
  "ai-prompts": "Prompts y contexto",
  "ai-rag": "Embeddings y RAG",
  "ai-agentes": "Agentes, herramientas y evaluación",
  "ai-sdk": "SDK para IA",
  "a11y-fundamentos": "Fundamentos de accesibilidad",
  "a11y-contenido": "Contenido perceptible",
  "a11y-interaccion": "Semántica e interacción",
  "a11y-testing": "Pruebas de accesibilidad",
  "performance-fundamentos": "Fundamentos y métricas",
  "performance-carga": "Carga y recursos",
  "performance-runtime": "JavaScript y renderizado",
  "performance-operacion": "Red y operación",
  "security-fundamentos": "Fundamentos y amenazas",
  "security-aplicacion": "Aplicación y API",
  "security-infra": "Infraestructura y disponibilidad",
  "security-testing": "Verificación de seguridad",
  "testing-fundamentos": "Fundamentos y estrategia",
  "testing-unitario": "Pruebas unitarias",
  "testing-integracion": "Integración y contratos",
  "testing-e2e": "Pruebas E2E",
  "testing-ai": "Testing asistido por IA",
  "apps-editors": "Editores de código",
  "apps-terminal": "Terminales",
  "apps-cli": "CLI",
  "apps-api": "Clientes de API",
  "apps-devops": "DevOps y contenedores",
  "apps-design": "Diseño y diagramación",
  "apps-video": "Video y grabación",
  "cursos-midudev": "Midudev",
  "cursos-microsoft": "Microsoft",
  "cursos-google": "Google",
  "cursos-repos": "Repositorios y apuntes",
  "cursos-plataformas": "Plataformas y comunidad",
  "cursos-empleo": "Empleo y entrevistas",
  "hallazgos-ia": "IA y agentes",
  "hallazgos-web": "Web y producto",
  "apps-productivity": "Notas y documentación",
  "apps-comms": "Comunicación",
  "ui-ux-design-systems": "Sistemas de diseño",
  "ui-ux-interaccion": "Diseño de interacción",
  "ui-css": "UI con CSS",
  "ui-react": "UI con React",
  "cloud-fundamentos": "Fundamentos de nube",
  "infraestructura-codigo": "Infraestructura como código",
  principios: "Principios",
  "patrones-diseno": "Patrones de diseño",
  "patrones-arquitectonicos": "Patrones arquitectónicos"
} as const

export type StackId = keyof typeof STACK_LABELS

/** Stacks que reutilizan el icono de otro; el resto usa "brand-<id>". */
const STACK_ICONS: Partial<Record<StackId, string>> = {
  "github-platform": "brand-github",
  "github-actions": "workflow",
  utils: "brand-typescript",
  "apps-cli": "brand-cli"
}

const STACK_DESCRIPTIONS: Partial<Record<StackId, string>> = {
  config:
    "Archivos y herramientas que configuran un proyecto antes de escribir código.",
  monorepo:
    "Varios paquetes conviviendo en un mismo repositorio y cómo se coordinan.",
  packages:
    "Paquetes de npm que se instalan como dependencia del proyecto.",
  typescript:
    "Tipado sobre JavaScript: qué añade y cómo se configura.",
  utils:
    "Funciones pequeñas y reutilizables para tareas del día a día.",
  whatsapp:
    "Conectar una aplicación con WhatsApp mediante un gateway propio.",
  html:
    "La estructura de una página: etiquetas, semántica y formularios.",
  css:
    "Dar estilo y disposición a una página: color, espacio y responsive.",
  javascript:
    "El lenguaje del navegador y las APIs que trae incorporadas.",
  "frontend-fundamentos":
    "Cómo funciona una interfaz en el navegador, antes de elegir framework.",
  astro:
    "Framework orientado a sitios de contenido, con muy poco JavaScript en el cliente.",
  react:
    "Construir interfaces con componentes y estado.",
  nextjs:
    "Framework sobre React con renderizado en servidor y enrutado por archivos.",
  "backend-fundamentos":
    "Qué hace un servidor: peticiones, respuestas y arquitectura de una API.",
  node:
    "Ejecutar JavaScript fuera del navegador.",
  express:
    "Framework mínimo para montar una API en Node.js.",
  "database-fundamentos":
    "Qué es una base de datos y cómo se decide entre los tipos que existen.",
  "database-modelado":
    "Diseñar tablas y relaciones para que los datos se mantengan coherentes.",
  "database-sql":
    "Escribir consultas para leer y modificar datos.",
  "database-postgresql":
    "El motor relacional más usado: configuración, mantenimiento y seguridad.",
  "database-nosql":
    "Bases de datos sin tablas: documentos y clave-valor.",
  "database-operacion":
    "Mantener una base de datos viva: copias, migraciones y diagnóstico.",
  "testing-fundamentos":
    "Qué probar y por qué, antes de elegir una herramienta.",
  "testing-unitario":
    "Probar funciones y componentes de forma aislada.",
  "testing-integracion":
    "Probar que varias piezas funcionan juntas y respetan su contrato.",
  "testing-e2e":
    "Probar la aplicación completa simulando a una persona usándola.",
  "testing-ai":
    "Usar IA para escribir y mantener pruebas, con sus límites.",
  "devops-fundamentos":
    "Llevar código a producción y mantenerlo funcionando.",
  "cloud-fundamentos":
    "Conceptos de la nube: qué se alquila y qué se paga.",
  "infraestructura-codigo":
    "Declarar servidores y servicios en archivos versionables.",
  "docker-conceptos":
    "Qué es un contenedor y qué problema resuelve.",
  "docker-imagenes":
    "Construir la plantilla desde la que arranca un contenedor.",
  "docker-contenedores":
    "Ejecutar, inspeccionar y depurar contenedores.",
  "docker-redes-volumenes":
    "Comunicar contenedores entre sí y guardar datos que sobrevivan.",
  "docker-compose":
    "Levantar varios contenedores a la vez con un solo archivo.",
  "docker-bases-datos":
    "Correr bases de datos en contenedores para desarrollo local.",
  "ci-cd":
    "Automatizar pruebas y despliegues en cada cambio.",
  observabilidad:
    "Ver qué hace un sistema en producción: registros, métricas y alertas.",
  "ui-ux-fundamentos":
    "Vocabulario y principios básicos de interfaz y experiencia.",
  "ui-ux-estilos":
    "Lenguajes visuales completos y cuándo conviene cada uno.",
  "ui-ux-design-systems":
    "Convertir decisiones de diseño en tokens y componentes reutilizables.",
  "ui-ux-interaccion":
    "Cómo responde la interfaz: estados, feedback y formularios.",
  "ui-css":
    "Catálogos de componentes que se usan con CSS y HTML.",
  "ui-react":
    "Librerías de componentes para proyectos React.",
  "ai-fundamentos":
    "Cómo funciona un modelo de lenguaje y qué puede o no puede hacer.",
  "ai-prompts":
    "Escribir instrucciones y dar contexto para obtener buenas respuestas.",
  "ai-rag":
    "Buscar en tus propios datos para que el modelo responda con ellos.",
  "ai-agentes":
    "Modelos que usan herramientas y toman pasos, y cómo evaluarlos.",
  "ai-sdk":
    "Programar contra modelos desde tu código.",
  "skills-fundamentos":
    "Cómo trabajar con un asistente de código sin perder el control.",
  "claude-code":
    "El asistente de Anthropic en la terminal: configuración y flujos.",
  codex:
    "El asistente de OpenAI en la terminal.",
  cursor:
    "Editor de código con IA integrada.",
  opencode:
    "Asistente de código abierto para la terminal.",
  "ia-comandos":
    "Comandos propios que automatizan tareas repetidas con el asistente.",
  "ia-skills":
    "Instrucciones empaquetadas que enseñan al asistente a hacer algo concreto.",
  "ia-plugins":
    "Extensiones que añaden capacidades al asistente.",
  "ia-mcp":
    "El protocolo que conecta un modelo con herramientas y datos externos.",
  git:
    "Control de versiones: guardar historia y trabajar en paralelo.",
  "github-platform":
    "La plataforma: repositorios, issues y pull requests.",
  "repository-management":
    "Dejar un repositorio listo para que otros colaboren.",
  "github-profile":
    "Tu perfil público, claves SSH y commits verificados.",
  github:
    "Manejar GitHub desde la terminal.",
  "github-actions":
    "Automatizar tareas que se disparan con cada cambio.",
  terminal:
    "Moverse y trabajar desde la línea de comandos.",
  cli:
    "Herramientas de línea de comandos y cómo se combinan.",
  principios:
    "Reglas generales para que el código siga siendo mantenible.",
  "patrones-diseno":
    "Soluciones conocidas a problemas que se repiten en el código.",
  "patrones-arquitectonicos":
    "Cómo se organiza un sistema completo por dentro.",
  "security-fundamentos":
    "Qué se ataca y por qué, antes de defender nada.",
  "security-aplicacion":
    "Proteger la aplicación y su API: entrada, sesión y permisos.",
  "security-infra":
    "Proteger el servidor y mantener el servicio disponible.",
  "security-testing":
    "Comprobar que las defensas realmente funcionan.",
  "performance-fundamentos":
    "Qué se mide y con qué métricas.",
  "performance-carga":
    "Que la página aparezca antes: recursos, imágenes y fuentes.",
  "performance-runtime":
    "Que la página responda rápido una vez cargada.",
  "performance-operacion":
    "Red, caché y entrega desde el servidor.",
  "a11y-fundamentos":
    "Por qué importa y a quién deja fuera una interfaz descuidada.",
  "a11y-contenido":
    "Que el contenido se pueda percibir: contraste, texto e imágenes.",
  "a11y-interaccion":
    "Que se pueda usar con teclado y lector de pantalla.",
  "a11y-testing":
    "Comprobar accesibilidad a mano y de forma automática.",
  seo:
    "Cómo encuentra Google una página y qué necesita para entenderla.",
  "seo-tecnico":
    "Rastreo, indexación, sitemap y datos estructurados.",
  "seo-contenido":
    "Contenido y enlaces que hacen que una página posicione.",
  "apps-editors":
    "Editores de código de escritorio.",
  "apps-terminal":
    "Terminales con mejor experiencia que la del sistema.",
  "apps-cli":
    "Herramientas que se instalan y se usan desde la terminal.",
  "apps-api":
    "Clientes para probar y depurar APIs.",
  "apps-devops":
    "Aplicaciones para contenedores y despliegue.",
  "apps-design":
    "Diseñar interfaces y dibujar diagramas.",
  "apps-video":
    "Grabar la pantalla y montar video.",
  "apps-productivity":
    "Tomar notas y escribir documentación.",
  "apps-comms":
    "Comunicarse con el equipo o la comunidad.",
  "cursos-midudev":
    "Cursos en español de Miguel Ángel Durán, gratuitos y en video.",
  "cursos-microsoft":
    "Formación de Microsoft: sesiones en vivo, currículos abiertos y certificados.",
  "cursos-google":
    "Programas y certificaciones de Google, de IA y de nube.",
  "cursos-repos":
    "Repositorios y apuntes de otras personas para estudiar y practicar.",
  "cursos-plataformas":
    "Plataformas de cursos, ejercicios e idiomas, casi todas gratuitas.",
  "cursos-empleo":
    "Preparar el currículum y las entrevistas técnicas.",
  "hallazgos-ia":
    "Proyectos que exploran ideas nuevas con modelos y agentes.",
  "hallazgos-web":
    "Proyectos de web y producto con enfoques poco comunes."
}

export interface StackMeta {
  id: StackId
  label: string
  /** Icono de marca (ver src/config/icons.ts) */
  icon: string
  /** Una línea que explica qué se va a encontrar en la subcategoría. */
  description?: string
}

export const STACK_IDS = keysOf(STACK_LABELS)

export const STACKS = Object.fromEntries(
  STACK_IDS.map((id) => [
    id,
    {
      id,
      label: STACK_LABELS[id],
      icon: STACK_ICONS[id] ?? `brand-${id}`,
      description: STACK_DESCRIPTIONS[id]
    }
  ])
) as Record<StackId, StackMeta>

/**
 * Cada categoría necesita su propia progresión. Un único orden global hacía,
 * por ejemplo, que Astro apareciera antes de HTML o que herramientas avanzadas
 * se adelantaran a sus fundamentos. Los stacks no declarados se añaden al final
 * como fallback para que una nueva subcategoría nunca desaparezca.
 */
export const CATEGORY_STACK_ORDER: Partial<
  Record<CategoryId, readonly StackId[]>
> = {
  general: ["config", "monorepo", "packages", "typescript", "utils", "whatsapp"],
  findings: ["hallazgos-ia", "hallazgos-web"],
  courses: [
    "cursos-midudev",
    "cursos-microsoft",
    "cursos-google",
    "cursos-repos",
    "cursos-plataformas",
    "cursos-empleo"
  ],
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
    "apps-cli",
    "apps-api",
    "apps-devops",
    "apps-design",
    "apps-video",
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
    "ui-ux-estilos",
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
export const STACK_GROUPED_CATEGORIES = CATEGORY_IDS.filter(
  (category) => CATEGORY_STACK_ORDER[category] !== undefined
)
