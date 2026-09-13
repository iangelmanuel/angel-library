export interface LandingLeg {
  id: string
  title: string
  line: string
  detail: string
}

export const HERO = {
  titleTop: "Un segundo cerebro",
  titleBottom: "técnico, en disco.",
  claim:
    "Todo lo que aprendo sobre desarrollo web, clasificado por carpetas y listo para copiar. Sin base de datos y sin panel: la ruta del archivo es el sistema.",
  searchCommand: "Buscar en toda la biblioteca…",
  primaryCta: "Leer la documentación",
  secondaryCta: "Ver cómo se organiza",
  recentTitle: "Lo último"
} as const

export const FIGURE_LABELS = {
  docs: "documentos",
  categories: "categorías",
  subcategories: "subcarpetas",
  tags: "tags"
} as const

export const CATALOG = {
  title: "El índice",
  all: "Todas las categorías"
} as const

export const ROUTE = {
  title: "La ruta es el sistema",
  lead: "La carpeta decide la categoría y la subcategoría. Mover un archivo lo recategoriza: no hay base de datos, ni panel, ni nada que editar aparte del archivo.",
  outputsTitle: "y de esa misma ruta salen",
  note: "El build valida la estructura, las relaciones entre entradas y los enlaces internos. Una carpeta mal nombrada o una referencia rota no llegan a publicarse: rompen la compilación con un mensaje en español."
} as const

export const FLOW = {
  title: "Cómo se recorre",
  lead: "Tres gestos, siempre los mismos y desde cualquier página: abrir la terminal, leer la entrada y llevarte el fragmento que necesitas. No hay menús que aprender.",
  legs: [
    {
      id: "buscar",
      title: "Buscar",
      line: "Ctrl+K abre la terminal sobre toda la biblioteca.",
      detail: "índice generado en build · una descarga por sesión"
    },
    {
      id: "leer",
      title: "Leer",
      line: "Concepto, código y entradas relacionadas en la misma página.",
      detail: "relaciones explícitas + retroenlaces + afinidad por tags"
    },
    {
      id: "reutilizar",
      title: "Reutilizar",
      line: "Cada bloque de código y cada comando trae su botón de copia.",
      detail: "instalación traducida a pnpm · bun · npm"
    }
  ] as LandingLeg[]
} as const

export const CTA = {
  title: "Entra y busca.",
  description:
    "Sin registro, sin cuentas y sin backend: el sitio es estático y la búsqueda corre en tu navegador.",
  action: "Abrir la biblioteca"
} as const
