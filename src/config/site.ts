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
  name: 'angel.library',
  description:
    'Biblioteca personal de conocimiento técnico: snippets, recetas, comandos y referencias rápidas para desarrollo web.',
  locale: 'es',
} as const;

/* ------------------------------------------------------------------ */
/* Tipos de contenido                                                  */
/* ------------------------------------------------------------------ */

export const CONTENT_TYPE_IDS = [
  'technologies',
  'libraries',
  'integrations',
  'recipes',
  'snippets',
  'hooks',
  'components',
  'utilities',
  'resources',
  'skills',
  'commands',
  'patterns',
  'practices',
  'guides',
  'tricks',
] as const;

export type ContentTypeId = (typeof CONTENT_TYPE_IDS)[number];

export interface ContentTypeMeta {
  id: ContentTypeId;
  /** Etiqueta en plural (listados, navegación) */
  label: string;
  /** Etiqueta en singular (badges) */
  singular: string;
  /** Nombre de icono (lucide) */
  icon: string;
  description: string;
}

export const CONTENT_TYPES: Record<ContentTypeId, ContentTypeMeta> = {
  technologies: {
    id: 'technologies',
    label: 'Tecnologías',
    singular: 'Tecnología',
    icon: 'cpu',
    description:
      'Tecnologías y lenguajes base: qué son, cuándo los uso y referencia rápida de lo esencial.',
  },
  libraries: {
    id: 'libraries',
    label: 'Librerías',
    singular: 'Librería',
    icon: 'package',
    description:
      'Librerías que uso: instalación, API esencial, casos comunes, tips y errores típicos.',
  },
  integrations: {
    id: 'integrations',
    label: 'Integraciones',
    singular: 'Integración',
    icon: 'blocks',
    description:
      'Cómo usar una tecnología dentro de otra. Solo las particularidades de la combinación, sin duplicar documentación.',
  },
  recipes: {
    id: 'recipes',
    label: 'Recetas',
    singular: 'Receta',
    icon: 'list-checks',
    description:
      'Soluciones paso a paso a problemas concretos, con código listo para reutilizar.',
  },
  snippets: {
    id: 'snippets',
    label: 'Snippets',
    singular: 'Snippet',
    icon: 'code',
    description: 'Trozos de código reutilizables: hooks, utilidades, helpers y funciones.',
  },
  hooks: {
    id: 'hooks',
    label: 'Hooks',
    singular: 'Hook',
    icon: 'repeat-2',
    description: 'Hooks reutilizables con propósito, parámetros, retorno y ejemplos.',
  },
  components: {
    id: 'components',
    label: 'Componentes',
    singular: 'Componente',
    icon: 'component',
    description: 'Componentes de UI propios y de librerías que vale la pena reutilizar.',
  },
  utilities: {
    id: 'utilities',
    label: 'Utilities',
    singular: 'Utility',
    icon: 'wrench',
    description: 'Funciones pequeñas y reutilizables para browser, TypeScript y backend.',
  },
  resources: {
    id: 'resources',
    label: 'Recursos',
    singular: 'Recurso',
    icon: 'link',
    description: 'Herramientas y sitios externos que vale la pena recordar.',
  },
  skills: {
    id: 'skills',
    label: 'Skills',
    singular: 'Skill',
    icon: 'sparkles',
    description:
      'Herramientas de desarrollo asistido por IA: configuración, agentes, comandos y workflows.',
  },
  commands: {
    id: 'commands',
    label: 'Comandos',
    singular: 'Comando',
    icon: 'terminal',
    description:
      'Comandos que necesito con frecuencia: qué hacen, cuándo usarlos y sus riesgos.',
  },
  patterns: {
    id: 'patterns',
    label: 'Patrones',
    singular: 'Patrón',
    icon: 'layout-template',
    description: 'Patrones y estructuras de arquitectura que repito entre proyectos.',
  },
  practices: {
    id: 'practices',
    label: 'Buenas prácticas',
    singular: 'Buena práctica',
    icon: 'badge-check',
    description: 'Reglas prácticas para mejorar calidad, seguridad, accesibilidad y mantenimiento.',
  },
  guides: {
    id: 'guides',
    label: 'Guías prácticas',
    singular: 'Guía',
    icon: 'book-open',
    description: 'Referencias prácticas con varios pasos, sin convertirse en cursos extensos.',
  },
  tricks: {
    id: 'tricks',
    label: 'Trucos',
    singular: 'Truco',
    icon: 'zap',
    description: 'Soluciones específicas y atajos que resuelven problemas puntuales.',
  },
};

export const CONTENT_TYPE_LIST = CONTENT_TYPE_IDS.map((id) => CONTENT_TYPES[id]);

/* ------------------------------------------------------------------ */
/* Categorías (áreas de conocimiento)                                  */
/* ------------------------------------------------------------------ */

export const CATEGORY_IDS = [
  'general',
  'frontend',
  'backend',
  'database',
  'ai',
  'devops',
  'git',
  'tools',
  'seo',
  'accessibility',
  'performance',
  'security',
  'testing',
  'ui-ux',
  'architecture',
  'resources',
  'skills',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  general: {
    id: 'general',
    label: 'General',
    icon: 'globe',
    description: 'Desarrollo web transversal: HTML, CSS, JavaScript, navegador y más.',
  },
  frontend: {
    id: 'frontend',
    label: 'Frontend',
    icon: 'monitor',
    description: 'Interfaces, frameworks de UI y experiencia de usuario.',
  },
  backend: {
    id: 'backend',
    label: 'Backend',
    icon: 'server',
    description: 'Servidores, APIs y arquitectura de backend.',
  },
  database: {
    id: 'database',
    label: 'Bases de datos',
    icon: 'database',
    description: 'Bases de datos, ORMs y persistencia.',
  },
  ai: {
    id: 'ai',
    label: 'IA',
    icon: 'brain',
    description: 'Integración de modelos de IA: providers, streaming y respuestas.',
  },
  devops: {
    id: 'devops',
    label: 'DevOps',
    icon: 'container',
    description: 'Docker, despliegue e infraestructura.',
  },
  git: {
    id: 'git',
    label: 'Git & GitHub',
    icon: 'git-branch',
    description: 'Control de versiones: comandos y situaciones prácticas.',
  },
  tools: {
    id: 'tools',
    label: 'Herramientas',
    icon: 'wrench',
    description: 'Herramientas de desarrollo y utilidades.',
  },
  seo: {
    id: 'seo',
    label: 'SEO',
    icon: 'search-check',
    description: 'SEO técnico, metadata, structured data y discoverability.',
  },
  accessibility: {
    id: 'accessibility',
    label: 'Accesibilidad',
    icon: 'accessibility',
    description: 'Interfaces y contenido que pueden utilizar más personas.',
  },
  performance: {
    id: 'performance',
    label: 'Performance',
    icon: 'gauge',
    description: 'Carga, rendering, runtime y optimización de recursos.',
  },
  security: {
    id: 'security',
    label: 'Seguridad',
    icon: 'shield-check',
    description: 'Prácticas de seguridad para frontend, backend y APIs.',
  },
  testing: {
    id: 'testing',
    label: 'Testing',
    icon: 'test-tube-2',
    description: 'Tests unitarios, integración, E2E y estrategias de validación.',
  },
  'ui-ux': {
    id: 'ui-ux',
    label: 'UI / UX',
    icon: 'palette',
    description: 'Diseño de interfaces, interacción y sistemas visuales.',
  },
  architecture: {
    id: 'architecture',
    label: 'Arquitectura',
    icon: 'network',
    description: 'Decisiones estructurales y patrones para proyectos mantenibles.',
  },
  resources: {
    id: 'resources',
    label: 'Recursos',
    icon: 'bookmark',
    description: 'Colección de recursos externos categorizados.',
  },
  skills: {
    id: 'skills',
    label: 'IA Tools & Skills',
    icon: 'bot',
    description: 'Herramientas de IA para programar: Claude Code, Cursor, OpenCode, Codex…',
  },
};

export const CATEGORY_LIST = CATEGORY_IDS.map((id) => CATEGORIES[id]);

/* ------------------------------------------------------------------ */
/* Categorías de recursos externos                                     */
/* ------------------------------------------------------------------ */

export const RESOURCE_CATEGORY_IDS = [
  'ui-inspiration',
  'css',
  'colors',
  'gradients',
  'glassmorphism',
  'icons',
  'animations',
  'loaders',
  'fonts',
  'illustrations',
  'apis',
  'generators',
  'accessibility',
  'developer-tools',
  'learning',
] as const;

export type ResourceCategoryId = (typeof RESOURCE_CATEGORY_IDS)[number];

export const RESOURCE_CATEGORIES: Record<ResourceCategoryId, string> = {
  'ui-inspiration': 'UI Inspiration',
  css: 'CSS',
  colors: 'Colores',
  gradients: 'Gradientes',
  glassmorphism: 'Glassmorphism',
  icons: 'Iconos',
  animations: 'Animaciones',
  loaders: 'Loaders',
  fonts: 'Fuentes',
  illustrations: 'Ilustraciones',
  apis: 'APIs',
  generators: 'Generadores',
  accessibility: 'Accesibilidad',
  'developer-tools': 'Developer Tools',
  learning: 'Aprendizaje',
};

export const RESOURCE_CATEGORY_LIST = RESOURCE_CATEGORY_IDS.map((id) => ({
  id,
  label: RESOURCE_CATEGORIES[id],
}));

/* ------------------------------------------------------------------ */
/* Stacks de frontend (subcategorías dentro de "Frontend")             */
/* ------------------------------------------------------------------ */

export const STACK_IDS = ['astro', 'react', 'nextjs'] as const;

export type StackId = (typeof STACK_IDS)[number];

export interface StackMeta {
  id: StackId;
  label: string;
  /** Icono de marca (ver src/lib/icons.ts) */
  icon: string;
}

export const STACKS: Record<StackId, StackMeta> = {
  astro: { id: 'astro', label: 'Astro', icon: 'brand-astro' },
  react: { id: 'react', label: 'React', icon: 'brand-react' },
  nextjs: { id: 'nextjs', label: 'Next.js', icon: 'brand-nextjs' },
};

export const STACK_LIST = STACK_IDS.map((id) => STACKS[id]);
