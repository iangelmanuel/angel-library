/** Fuente de verdad del sitio. */

export const SITE = {
  name: "angel.library",
  description:
    "Biblioteca personal de conocimiento técnico: snippets, recetas, comandos y referencias rápidas para desarrollo web.",
  locale: "es"
} as const

/** Claves en orden. */
function keysOf<const Values extends Record<string, unknown>>(values: Values) {
  return Object.keys(values) as unknown as readonly [
    keyof Values & string,
    ...(keyof Values & string)[]
  ]
}

/** Añade `id` a cada valor. */
function withIds<Id extends string, Value>(values: Record<Id, Value>) {
  const entries = Object.entries(values) as [Id, Value][]
  return Object.fromEntries(
    entries.map(([id, value]) => [id, { ...value, id }])
  ) as Record<Id, Value & { id: Id }>
}

// ── Tipos de contenido ──

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
  /** Var CSS del color. */
  color: string
}

export const CONTENT_TYPES = withIds(CONTENT_TYPE_DEFINITIONS) as Record<
  ContentTypeId,
  ContentTypeMeta
>
export const CONTENT_TYPE_IDS = keysOf(CONTENT_TYPE_DEFINITIONS)

export const CONTENT_TYPE_LIST = CONTENT_TYPE_IDS.map((id) => CONTENT_TYPES[id])

// ── Categorías ──

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
      "Proyectos reales que vale la pena estudiar por la idea o la solución que exploran. No son tutoriales: sirven para descubrir enfoques poco comunes y entender cómo otras personas los llevaron a código.",
    color: "--accent-red"
  },
  courses: {
    label: "Cursos",
    icon: "book-open",
    description:
      "Cursos, ejercicios y materiales de estudio organizados por proveedor y objetivo. Cada módulo aclara qué enseña, qué conocimientos conviene tener y cómo aprovecharlo.",
    color: "--accent-green"
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
  /** Var CSS del color. */
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

// Sin grupo desaparecería de la navegación: mejor romper el build.
const UNGROUPED = CATEGORY_IDS.filter((id) => !GROUPED_CATEGORY_IDS.includes(id))
if (UNGROUPED.length > 0) {
  throw new Error(
    `[site] Categorías sin grupo en CATEGORY_GROUPS: ${UNGROUPED.join(", ")}`
  )
}

export const CATEGORY_LIST = GROUPED_CATEGORY_IDS.map((id) => CATEGORIES[id])

// ── Categorías de recurso ──

const RESOURCE_CATEGORY_DEFINITIONS = {
  "ui-inspiration": {
    label: "Inspiración de interfaces",
    description:
      "Galerías y componentes de ejemplo para estudiar cómo otras interfaces resuelven su estructura, jerarquía visual y estilo."
  },
  css: {
    label: "CSS",
    description:
      "Herramientas que generan estilos CSS para sombras, degradados y otros efectos; el resultado se puede copiar y adaptar al diseño del proyecto."
  },
  colors: {
    label: "Colores",
    description:
      "Generadores de paletas y comprobadores de contraste para elegir colores coherentes, legibles y accesibles."
  },
  icons: {
    label: "Iconos",
    description:
      "Colecciones de símbolos visuales para representar acciones, estados y conceptos dentro de una interfaz."
  },
  animations: {
    label: "Animaciones",
    description:
      "Recursos para comunicar cambios de estado o guiar la atención mediante movimiento y transiciones."
  },
  loaders: {
    label: "Indicadores de carga",
    description:
      "Animaciones que informan que una tarea sigue en proceso, como indicadores giratorios, barras o esqueletos de contenido."
  },
  fonts: {
    label: "Fuentes",
    description:
      "Tipografías y herramientas para elegir combinaciones legibles y coherentes con la identidad visual."
  },
  illustrations: {
    label: "Ilustraciones",
    description:
      "Dibujos y gráficos para explicar ideas, dar contexto visual o completar un prototipo sin crearlos desde cero."
  },
  images: {
    label: "Imágenes y mockups",
    description:
      "Herramientas para optimizar imágenes y presentar capturas dentro de marcos o composiciones de producto."
  },
  apis: {
    label: "APIs",
    description:
      "Catálogos de servicios que permiten a una aplicación solicitar datos o ejecutar funciones de otro sistema."
  },
  generators: {
    label: "Generadores",
    description:
      "Herramientas que convierten unas opciones visuales en código o archivos que después se pueden adaptar al proyecto."
  },
  accessibility: {
    label: "Accesibilidad",
    description:
      "Comprobadores para detectar barreras y verificar que más personas puedan percibir y utilizar la interfaz."
  },
  "developer-tools": {
    label: "Herramientas de desarrollo",
    description:
      "Utilidades web para resolver tareas frecuentes sin instalar una aplicación o escribir una herramienta propia."
  },
  learning: {
    label: "Aprendizaje",
    description:
      "Cursos, ejercicios y referencias para aprender un tema o practicarlo con una ruta definida."
  },
  ia: {
    label: "IA",
    description:
      "Herramientas y directorios para trabajar con modelos, agentes e integraciones de inteligencia artificial."
  }
} as const

export type ResourceCategoryId = keyof typeof RESOURCE_CATEGORY_DEFINITIONS

interface ResourceCategoryMeta {
  id: ResourceCategoryId
  label: string
  /** Descripción del grupo. */
  description: string
}

export const RESOURCE_CATEGORY_IDS = keysOf(RESOURCE_CATEGORY_DEFINITIONS)

const RESOURCE_CATEGORY_LIST: ResourceCategoryMeta[] =
  RESOURCE_CATEGORY_IDS.map((id) => ({
    id,
    ...RESOURCE_CATEGORY_DEFINITIONS[id]
  }))

/** Etiqueta para insignias. */
export const RESOURCE_CATEGORIES: Record<ResourceCategoryId, string> =
  Object.fromEntries(
    RESOURCE_CATEGORY_IDS.map((id) => [id, RESOURCE_CATEGORY_DEFINITIONS[id].label])
  ) as Record<ResourceCategoryId, string>

// ── Subcategorías ──

/** Segunda carpeta de src/content; su orden lo fija CATEGORY_SUBCATEGORY_ORDER. */
const SUBCATEGORY_LABELS = {
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
  "apps-cli": "Herramientas de terminal (CLI)",
  "apps-api": "Pruebas de APIs",
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

export type SubcategoryId = keyof typeof SUBCATEGORY_LABELS

/** Iconos prestados; el resto usa `brand-<id>`. */
const SUBCATEGORY_ICONS: Partial<Record<SubcategoryId, string>> = {
  "github-platform": "brand-github",
  "github-actions": "workflow",
  utils: "brand-typescript",
  "apps-cli": "brand-cli"
}

const SUBCATEGORY_DESCRIPTIONS: Partial<Record<SubcategoryId, string>> = {
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
    "Programas para escribir, navegar, ejecutar y depurar código desde un mismo espacio de trabajo.",
  "apps-terminal":
    "Aplicaciones para ejecutar comandos con búsqueda, historial y sesiones más fáciles de organizar.",
  "apps-cli":
    "Programas sin interfaz gráfica que se controlan escribiendo comandos; aquí se explica qué administran y cómo empezar.",
  "apps-api":
    "Aplicaciones para enviar solicitudes a una API, inspeccionar sus respuestas y detectar errores sin construir primero una interfaz.",
  "apps-devops":
    "Herramientas para ejecutar servicios en contenedores y administrar el entorno donde se desarrolla o publica una aplicación.",
  "apps-design":
    "Aplicaciones para definir el aspecto de una interfaz, preparar prototipos y comunicar ideas mediante diagramas.",
  "apps-video":
    "Herramientas para grabar la pantalla y convertir el material en demostraciones, tutoriales o presentaciones.",
  "apps-productivity":
    "Espacios para organizar notas, documentación, decisiones y datos que debe consultar un equipo.",
  "apps-comms":
    "Canales para conversar, dar soporte y conectar notificaciones o automatizaciones con un equipo o comunidad.",
  "cursos-midudev":
    "Cursos y materiales gratuitos en español de Miguel Ángel Durán, con rutas desde fundamentos hasta proyectos completos.",
  "cursos-microsoft":
    "Sesiones, currículos y certificados de Microsoft sobre desarrollo, nube e inteligencia artificial.",
  "cursos-google":
    "Programas guiados de Google sobre inteligencia artificial y computación en la nube, algunos con requisitos o convocatorias.",
  "cursos-repos":
    "Código, explicaciones y apuntes abiertos que se estudian leyendo, ejecutando ejemplos y resolviendo ejercicios.",
  "cursos-plataformas":
    "Sitios con cursos o ejercicios guiados para aprender programación, testing, herramientas e inglés técnico.",
  "cursos-empleo":
    "Material para presentar la experiencia profesional y prepararse para las etapas de una entrevista técnica.",
  "hallazgos-ia":
    "Proyectos para estudiar cómo varios agentes colaboran, conservan contexto o actúan dentro de un producto real.",
  "hallazgos-web":
    "Implementaciones web que convierten ideas poco habituales en experiencias, herramientas o arquitecturas concretas."
}

interface SubcategoryMeta {
  id: SubcategoryId
  label: string
  /** Icono de marca. */
  icon: string
  /** Descripción del grupo. */
  description?: string
}

const SUBCATEGORY_IDS = keysOf(SUBCATEGORY_LABELS)

export const SUBCATEGORIES = Object.fromEntries(
  SUBCATEGORY_IDS.map((id) => [
    id,
    {
      id,
      label: SUBCATEGORY_LABELS[id],
      icon: SUBCATEGORY_ICONS[id] ?? `brand-${id}`,
      description: SUBCATEGORY_DESCRIPTIONS[id]
    }
  ])
) as Record<SubcategoryId, SubcategoryMeta>

/** Orden de lectura por categoría; las no declaradas van al final. */
const CATEGORY_SUBCATEGORY_ORDER: Partial<
  Record<CategoryId, readonly SubcategoryId[]>
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

/** Grupo dibujable. */
interface SubcategoryGroup {
  id: string
  label: string
  description?: string
}

/** Subcategorías válidas y su orden. */
export function getSubcategoriesForCategory(
  category: CategoryId
): readonly SubcategoryGroup[] {
  if (category === "resources") return RESOURCE_CATEGORY_LIST

  const preferred = CATEGORY_SUBCATEGORY_ORDER[category] ?? []
  const remaining = SUBCATEGORY_IDS.filter((id) => !preferred.includes(id))
  return [...preferred, ...remaining].map((id) => SUBCATEGORIES[id])
}
