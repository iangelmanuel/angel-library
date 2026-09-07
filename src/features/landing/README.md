# Landing

Portada del sitio (`/`). Es la única página sin barra lateral: en vez de listar
documentación, **dibuja el mecanismo** de la biblioteca — carpeta → tipo → ruta
→ índice — con nodos, conducciones de 1px y celdas de rejilla fija.

## Flujo

`src/pages/index.astro` solo pide las cifras y compone secciones:

```
LandingLayout          layouts/  BaseLayout + cabecera y pie propios, sin Sidebar
  HeroPlan             identidad + el plano de archivado + el nodo «índice» (ctrl K)
  RouteSection         una ruta real despiezada en lo que el sistema produce
  FlowSection          una línea con tres tomas: buscar → leer → reutilizar
  InventorySection     tablero de tipos editoriales con su conteo real
  CtaSection           cierre en relleno --primary, la misma acción del hero
```

## Dónde se edita cada cosa

- **Textos fijos** → `data/content.ts`. Ningún componente escribe copy propio y
  ninguna cifra vive ahí.
- **Cifras y la ruta de ejemplo** → `lib/stats.ts`. `loadStats()` lee la
  colección `library` y devuelve documentos, categorías, subcarpetas con
  contenido, tags, el conteo por tipo y `route`: una entrada real despiezada en
  raíz / categoría / subcategoría / archivo. Si esa entrada desaparece se elige
  otra automáticamente.
- **Versión y repositorio** → `lib/project.ts`, leídos de `package.json` y de
  `SITE.social.github`.
- **Estilos propios** → `styles/landing.css`, importado por `LandingLayout`.
  Deliberadamente fuera de `src/styles/global.css`: solo esta página lo usa.

## El plano

Todo el lenguaje visual sale de tres piezas, no de tarjetas:

- **Nodo** (`.wall-node`): marcador cuadrado + segmento en mono + qué decide ese
  tramo. La sangría la da `--node-depth`, nunca un margen escrito a mano.
- **Conducción**: `border-left` + `border-bottom` de 1px (`.wall-node__branch`)
  o una línea de 1px (`.wall-output__drop`, `.wall-leg__tap`, `.wall-close__feed`).
- **Celda de rejilla fija** (`.wall-figures`, `.wall-board`, `.wall-footer__cell`):
  las columnas nunca se mueven, solo cambia lo que hay dentro.

El único momento de animación de la página es el trazado del plano al cargar
(`wall-draw` / `wall-mark` / `wall-feed`): se animan las conducciones y los
marcadores, nunca el texto, que está visible desde el primer frame. Todo queda
anulado bajo `prefers-reduced-motion`.

## Detalles que importan

- La cabecera y el nodo «índice» usan `data-open-search`, el mismo gancho global
  del resto del sitio: abre la terminal (`src/scripts/site-interactions.ts`), no
  monta nada.
- El relleno azul sólido aparece dos veces y en ningún sitio más: el prompt `$`
  del nodo índice y la banda de cierre. Es la regla del sistema, no una
  excepción de esta página.
- La landing no lista todas las categorías: enlaza a `/categories` con su
  conteo real.
- Los iconos salen de `<Icon>`; añadir uno nuevo solo requiere que exista en
  lucide o en `src/config/icons.ts`.
