import { keysOf } from "./helpers"

/** Subcarpetas especiales de `src/content/resources`. */
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
      "Libros, catálogos, ejercicios y referencias externas para aprender o profundizar en un tema."
  },
  ia: {
    label: "IA",
    description:
      "Herramientas y directorios para trabajar con modelos, agentes e integraciones de inteligencia artificial."
  }
} as const

export type ResourceCategoryId = keyof typeof RESOURCE_CATEGORY_DEFINITIONS

export interface ResourceCategoryMeta {
  id: ResourceCategoryId
  label: string
  /** Descripción del grupo. */
  description: string
}

export const RESOURCE_CATEGORY_IDS = keysOf(RESOURCE_CATEGORY_DEFINITIONS)

export const RESOURCE_CATEGORY_LIST: ResourceCategoryMeta[] =
  RESOURCE_CATEGORY_IDS.map((id) => ({
    id,
    ...RESOURCE_CATEGORY_DEFINITIONS[id]
  }))

/** Etiquetas que aparecen en las insignias de recursos. */
export const RESOURCE_CATEGORIES: Record<ResourceCategoryId, string> =
  Object.fromEntries(
    RESOURCE_CATEGORY_IDS.map((id) => [
      id,
      RESOURCE_CATEGORY_DEFINITIONS[id].label
    ])
  ) as Record<ResourceCategoryId, string>
