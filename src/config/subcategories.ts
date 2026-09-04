import type { CategoryId } from "./categories"
import { keysOf } from "./helpers"
import { RESOURCE_CATEGORY_LIST } from "./resources"

/** Metadatos de la segunda carpeta de `src/content`. */
const SUBCATEGORY_LABELS = {
  "frontend-fundamentos": "Fundamentos de frontend",
  config: "Config",
  monorepo: "Monorepo",
  packages: "Paquetes",
  "backend-fundamentos": "Fundamentos de backend",
  "devops-fundamentos": "Fundamentos de DevOps",
  "ui-ux-fundamentos": "Fundamentos de UI / UX",
  "ui-ux-estilos": "Estilos visuales",
  "agents-fundamentos": "Fundamentos de agentes",
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
  "apps-browsers": "Navegadores",
  "apps-terminal": "Terminales",
  "apps-cli": "Herramientas de terminal (CLI)",
  "apps-api": "Pruebas de APIs",
  "apps-devops": "DevOps y contenedores",
  "apps-design": "Diseño y diagramación",
  "apps-video": "Video y grabación",
  "apps-media": "Música y multimedia",
  "cursos-midudev": "Midudev",
  "cursos-microsoft": "Microsoft",
  "cursos-google": "Google",
  "cursos-mongodb": "MongoDB",
  "cursos-amazon": "Amazon",
  "cursos-plataformas": "Plataformas educativas",
  "hallazgos-recursos": "Recursos de la comunidad",
  "hallazgos-ia": "IA y agentes",
  "hallazgos-web": "Web y producto",
  "hallazgos-codigo": "Código y desarrollo",
  "benchmarks-ia": "IA",
  "benchmarks-web": "Web y navegadores",
  "benchmarks-frameworks": "Frameworks",
  "benchmarks-databases": "Bases de datos",
  "benchmarks-hardware": "Hardware y sistemas",
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

/** Excepciones para subcategorías cuyo icono no sigue `brand-<id>`. */
const SUBCATEGORY_ICONS: Partial<Record<SubcategoryId, string>> = {
  "github-platform": "brand-github",
  "github-actions": "workflow",
  utils: "brand-typescript",
  "apps-cli": "brand-cli"
}

/** Explicaciones que aparecen bajo cada grupo en los listados. */
const SUBCATEGORY_DESCRIPTIONS: Partial<Record<SubcategoryId, string>> = {
  config:
    "Archivos y herramientas que configuran un proyecto antes de escribir código.",
  monorepo:
    "Varios paquetes conviviendo en un mismo repositorio y cómo se coordinan.",
  packages: "Paquetes de npm que se instalan como dependencia del proyecto.",
  typescript: "Tipado sobre JavaScript: qué añade y cómo se configura.",
  utils: "Funciones pequeñas y reutilizables para tareas del día a día.",
  whatsapp: "Conectar una aplicación con WhatsApp mediante un gateway propio.",
  html: "La estructura de una página: etiquetas, semántica y formularios.",
  css: "Dar estilo y disposición a una página: color, espacio y responsive.",
  javascript: "El lenguaje del navegador y las APIs que trae incorporadas.",
  "frontend-fundamentos":
    "Cómo funciona una interfaz en el navegador, antes de elegir framework.",
  astro:
    "Framework orientado a sitios de contenido, con muy poco JavaScript en el cliente.",
  react: "Construir interfaces con componentes y estado.",
  nextjs:
    "Framework sobre React con renderizado en servidor y enrutado por archivos.",
  "backend-fundamentos":
    "Qué hace un servidor: peticiones, respuestas y arquitectura de una API.",
  node: "Ejecutar JavaScript fuera del navegador.",
  express: "Framework mínimo para montar una API en Node.js.",
  "database-fundamentos":
    "Qué es una base de datos y cómo se decide entre los tipos que existen.",
  "database-modelado":
    "Diseñar tablas y relaciones para que los datos se mantengan coherentes.",
  "database-sql": "Escribir consultas para leer y modificar datos.",
  "database-postgresql":
    "El motor relacional más usado: configuración, mantenimiento y seguridad.",
  "database-nosql": "Bases de datos sin tablas: documentos y clave-valor.",
  "database-operacion":
    "Mantener una base de datos viva: copias, migraciones y diagnóstico.",
  "testing-fundamentos":
    "Qué probar y por qué, antes de elegir una herramienta.",
  "testing-unitario": "Probar funciones y componentes de forma aislada.",
  "testing-integracion":
    "Probar que varias piezas funcionan juntas y respetan su contrato.",
  "testing-e2e":
    "Probar la aplicación completa simulando a una persona usándola.",
  "testing-ai": "Usar IA para escribir y mantener pruebas, con sus límites.",
  "devops-fundamentos": "Llevar código a producción y mantenerlo funcionando.",
  "cloud-fundamentos": "Conceptos de la nube: qué se alquila y qué se paga.",
  "infraestructura-codigo":
    "Declarar servidores y servicios en archivos versionables.",
  "docker-conceptos": "Qué es un contenedor y qué problema resuelve.",
  "docker-imagenes":
    "Construir la plantilla desde la que arranca un contenedor.",
  "docker-contenedores": "Ejecutar, inspeccionar y depurar contenedores.",
  "docker-redes-volumenes":
    "Comunicar contenedores entre sí y guardar datos que sobrevivan.",
  "docker-compose":
    "Levantar varios contenedores a la vez con un solo archivo.",
  "docker-bases-datos":
    "Correr bases de datos en contenedores para desarrollo local.",
  "ci-cd": "Automatizar pruebas y despliegues en cada cambio.",
  observabilidad:
    "Ver qué hace un sistema en producción: registros, métricas y alertas.",
  "ui-ux-fundamentos":
    "Vocabulario y principios básicos de interfaz y experiencia.",
  "ui-ux-estilos": "Lenguajes visuales completos y cuándo conviene cada uno.",
  "ui-ux-design-systems":
    "Convertir decisiones de diseño en tokens y componentes reutilizables.",
  "ui-ux-interaccion":
    "Cómo responde la interfaz: estados, feedback y formularios.",
  "ui-css": "Catálogos de componentes que se usan con CSS y HTML.",
  "ui-react": "Librerías de componentes para proyectos React.",
  "ai-fundamentos":
    "Cómo funciona un modelo de lenguaje y qué puede o no puede hacer.",
  "ai-prompts":
    "Escribir instrucciones y dar contexto para obtener buenas respuestas.",
  "ai-rag":
    "Buscar en tus propios datos para que el modelo responda con ellos.",
  "ai-agentes":
    "Modelos que usan herramientas y toman pasos, y cómo evaluarlos.",
  "ai-sdk": "Programar contra modelos desde tu código.",
  "agents-fundamentos":
    "Cómo trabaja un agente de programación: contexto, herramientas, permisos, autonomía, subagentes y verificación.",
  "skills-fundamentos":
    "Cómo elegir y combinar comandos, skills, plugins, hooks y conexiones MCP sin ampliar permisos innecesariamente.",
  "claude-code":
    "El asistente de Anthropic en la terminal: configuración y flujos.",
  codex: "El asistente de OpenAI en la terminal.",
  cursor: "Editor de código con IA integrada.",
  opencode: "Asistente de código abierto para la terminal.",
  "ia-comandos":
    "Comandos propios que automatizan tareas repetidas con el asistente.",
  "ia-skills":
    "Instrucciones empaquetadas que enseñan al asistente a hacer algo concreto.",
  "ia-plugins": "Extensiones que añaden capacidades al asistente.",
  "ia-mcp":
    "El protocolo que conecta un modelo con herramientas y datos externos.",
  git: "Control de versiones: guardar historia y trabajar en paralelo.",
  "github-platform": "La plataforma: repositorios, issues y pull requests.",
  "repository-management":
    "Dejar un repositorio listo para que otros colaboren.",
  "github-profile": "Tu perfil público, claves SSH y commits verificados.",
  github: "Manejar GitHub desde la terminal.",
  "github-actions": "Automatizar tareas que se disparan con cada cambio.",
  terminal: "Moverse y trabajar desde la línea de comandos.",
  cli: "Herramientas de línea de comandos y cómo se combinan.",
  principios: "Reglas generales para que el código siga siendo mantenible.",
  "patrones-diseno":
    "Soluciones conocidas a problemas que se repiten en el código.",
  "patrones-arquitectonicos":
    "Cómo se organiza un sistema completo por dentro.",
  "security-fundamentos": "Qué se ataca y por qué, antes de defender nada.",
  "security-aplicacion":
    "Proteger la aplicación y su API: entrada, sesión y permisos.",
  "security-infra": "Proteger el servidor y mantener el servicio disponible.",
  "security-testing": "Comprobar que las defensas realmente funcionan.",
  "performance-fundamentos": "Qué se mide y con qué métricas.",
  "performance-carga":
    "Que la página aparezca antes: recursos, imágenes y fuentes.",
  "performance-runtime": "Que la página responda rápido una vez cargada.",
  "performance-operacion": "Red, caché y entrega desde el servidor.",
  "a11y-fundamentos":
    "Por qué importa y a quién deja fuera una interfaz descuidada.",
  "a11y-contenido":
    "Que el contenido se pueda percibir: contraste, texto e imágenes.",
  "a11y-interaccion": "Que se pueda usar con teclado y lector de pantalla.",
  "a11y-testing": "Comprobar accesibilidad a mano y de forma automática.",
  seo: "Cómo encuentra Google una página y qué necesita para entenderla.",
  "seo-tecnico": "Rastreo, indexación, sitemap y datos estructurados.",
  "seo-contenido": "Contenido y enlaces que hacen que una página posicione.",
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
    "Herramientas para grabar, transcribir, doblar y convertir audio o video en demostraciones, tutoriales y otras piezas publicables.",
  "apps-media":
    "Reproductores y clientes de escritorio para consumir música, audio y video sin depender del navegador.",
  "apps-browsers":
    "Navegadores alternativos, su modelo de privacidad, compatibilidad, instalación y límites reales.",
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
  "cursos-mongodb":
    "Rutas, sesiones y credenciales oficiales para aprender MongoDB y validar conocimientos prácticos.",
  "cursos-amazon":
    "Certificaciones y evaluaciones prácticas de AWS para validar conocimientos dentro de entornos reales de la nube de Amazon.",
  "cursos-plataformas":
    "Sitios con cursos y ejercicios guiados para alcanzar un objetivo de aprendizaje concreto.",
  "hallazgos-recursos":
    "Repositorios, guías, plantillas y colecciones de la comunidad que facilitan tareas o reúnen información útil.",
  "hallazgos-ia":
    "Proyectos para estudiar cómo varios agentes colaboran, conservan contexto o actúan dentro de un producto real.",
  "hallazgos-web":
    "Implementaciones web que convierten ideas poco habituales en experiencias, herramientas o arquitecturas concretas.",
  "hallazgos-codigo":
    "Repositorios con código, explicaciones y prácticas que permiten estudiar una tecnología o mejorar la forma de desarrollar.",
  "benchmarks-ia":
    "Evaluaciones de modelos y agentes de IA: capacidad, velocidad, coste y calidad en tareas reales o controladas.",
  "benchmarks-web":
    "Pruebas para comparar la respuesta de navegadores y diagnosticar cómo carga y se comporta una página.",
  "benchmarks-frameworks":
    "Comparativas reproducibles de frameworks frontend y backend bajo cargas y operaciones delimitadas.",
  "benchmarks-databases":
    "Cargas de trabajo para medir consultas, transacciones, ingestión y almacenamiento en motores de datos.",
  "benchmarks-hardware":
    "Suites para comparar procesadores, gráficos, memoria, almacenamiento y sistemas completos bajo condiciones documentadas."
}

export interface SubcategoryMeta {
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
  general: [
    "config",
    "monorepo",
    "packages",
    "typescript",
    "utils",
    "whatsapp"
  ],
  findings: [
    "hallazgos-ia",
    "hallazgos-web",
    "hallazgos-codigo",
    "hallazgos-recursos"
  ],
  courses: [
    "cursos-midudev",
    "cursos-microsoft",
    "cursos-google",
    "cursos-mongodb",
    "cursos-amazon",
    "cursos-plataformas"
  ],
  benchmarks: [
    "benchmarks-ia",
    "benchmarks-web",
    "benchmarks-frameworks",
    "benchmarks-databases",
    "benchmarks-hardware"
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
    "apps-browsers",
    "apps-terminal",
    "apps-cli",
    "apps-api",
    "apps-devops",
    "apps-design",
    "apps-video",
    "apps-media",
    "apps-productivity",
    "apps-comms"
  ],
  agents: ["agents-fundamentos", "claude-code", "codex", "cursor", "opencode"],
  skills: [
    "skills-fundamentos",
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

/** Grupo de subcategorías que puede dibujar un listado. */
export interface SubcategoryGroup {
  id: string
  label: string
  description?: string
}

/** Subcategorías válidas y su orden para una categoría. */
export function getSubcategoriesForCategory(
  category: CategoryId
): readonly SubcategoryGroup[] {
  if (category === "resources") return RESOURCE_CATEGORY_LIST

  const preferred = CATEGORY_SUBCATEGORY_ORDER[category] ?? []
  const remaining = SUBCATEGORY_IDS.filter((id) => !preferred.includes(id))
  return [...preferred, ...remaining].map((id) => SUBCATEGORIES[id])
}
