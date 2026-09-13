# Arquitectura — cómo está armado este proyecto

Esta es la explicación larga. Si solo querés el resumen rápido, `CLAUDE.md`
(en la raíz) tiene la versión corta. Si lo que buscás es cómo crear
contenido, andá a [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

## 1 · Qué es esto, en una frase

Un sitio **estático** (Astro + Starlight) que publica Markdown como HTML.
No hay servidor de aplicación, no hay base de datos, no hay API propia. Todo
lo que ves en el sitio publicado ya estaba decidido en el momento del
`pnpm build` — no hay nada calculándose "en vivo" cuando alguien visita la
página, salvo la búsqueda (que corre en el navegador de quien visita).

Tres piezas hacen el 95% del trabajo:

- **Astro**: el framework. Genera HTML a partir de archivos `.astro`
  (como componentes de React, pero sin necesitar JavaScript en el navegador
  a menos que vos lo pidas explícitamente).
- **Starlight**: un plugin de Astro hecho específicamente para sitios de
  documentación. Te da gratis: la barra lateral, el buscador, la
  paginación entre páginas, el modo oscuro/claro, breadcrumbs, botón de
  editar en GitHub, etc. Nosotros **personalizamos partes puntuales**, no
  reescribimos Starlight.
- **Content Collections**: el sistema de Astro para tratar una carpeta de
  Markdown como si fuera una base de datos tipada. Es lo que te permite
  escribir `import { getCollection } from "astro:content"` y recibir un
  array de objetos con `.data.title`, `.data.tags`, etc., ya validados.

## 2 · El recorrido completo: de un archivo `.md` a una página publicada

Para entender el proyecto, ayuda seguir un solo archivo de punta a punta.
Digamos que existe `src/content/docs/frontend/astro/astro-islands.md`.

1. **Astro arranca** (`pnpm dev` o `pnpm build`) y lee `astro.config.mjs`.
   Ese archivo le dice "usá el plugin Starlight, con este menú
   (`sidebar.ts`), este logo, estos plugins de markdown, etc."
2. **Starlight registra la colección `docs`.** El archivo que define esto
   es `src/content.config.ts`. Ahí se declara: "todo archivo dentro de
   `src/content/docs/` pertenece a la colección `docs`, y tiene que cumplir
   este esquema (schema)". El esquema es una lista de campos permitidos:
   `title`, `description`, `tags`, `command`, `url`, etc. Astro usa
   [Zod](https://zod.dev) para esto — es solo una librería para decir "este
   campo es un string opcional", "este campo es obligatorio", etc.
3. **Astro lee el archivo `astro-islands.md`.** Separa el frontmatter (lo
   que va entre `---`) del cuerpo (el Markdown de abajo). Valida el
   frontmatter contra el esquema del paso 2. Si falta un campo obligatorio
   o hay un tipo equivocado, **el build falla ahí mismo** con un mensaje
   señalando el archivo.
4. **La ruta se calcula sola.** El id de la entrada es su ruta relativa sin
   la extensión: `frontend/astro/astro-islands`. Astro convierte eso
   directamente en la URL pública: `/frontend/astro/astro-islands`. No hay
   ningún archivo de rutas que mantener a mano para las entradas de
   contenido — por eso agregar un `.md` nuevo no requiere tocar código.
5. **Starlight decide dónde aparece en el menú.** Lee `src/config/sidebar.ts`
   (explicado en la sección 5) para saber en qué categoría/subcategoría cae
   esta entrada según su carpeta, y usa el `title` del frontmatter como
   etiqueta visible (a menos que la entrada tenga su propio
   `sidebar: { label: "..." }`).
6. **Se renderiza la página.** Starlight envuelve el contenido con su
   layout: cabecera, sidebar, el contenido en el medio, el índice de la
   página a la derecha, el pie. Nuestros overrides (sección 6) reemplazan
   piezas puntuales de ese layout — por ejemplo, `PageTitle.astro` agrega la
   fila de chips (categoría, tags, fecha) justo debajo del título.
7. **Queda un archivo HTML** en `dist/frontend/astro/astro-islands/index.html`
   listo para subir a un hosting estático (Vercel, en este caso).

Ese mismo recorrido pasa **737 veces** en cada build — una vez por cada
entrada de contenido.

## 3 · Mapa completo de `src/`

```text
src/
├─ content/
│  └─ docs/<categoría>/<subcategoría>/*.md   ← 737 artículos reales
├─ content.config.ts                          ← el esquema (paso 2 de arriba)
├─ env.d.ts                                   ← tipos globales de Astro
│
├─ config/                     datos y configuración, sin lógica pesada
│  ├─ categories.ts             las 24 categorías + sus subcategorías
│  ├─ sidebar.ts                 el árbol del menú de Starlight
│  ├─ navigation.ts              links de cabecera/pie (Inicio, Categorías, Tags)
│  ├─ site.ts                     identidad del sitio, SEO, redes sociales
│  └─ icons.ts                    tabla de iconos Lucide que llevan color fijo
│
├─ lib/                        funciones que leen y transforman contenido
│  ├─ content.ts                 cargar, filtrar, ordenar, agrupar, contar
│  └─ seo.ts                      arma el JSON-LD (datos estructurados) del sitio
│
├─ pages/                      rutas propias, fuera de Starlight
│  ├─ index.astro                 la portada (usa features/landing/)
│  ├─ categories/index.astro      /categories — grilla de las 24 categorías
│  ├─ categories/[category].astro /categories/frontend — artículos de una categoría
│  ├─ tags/index.astro            /tags — nube de todos los tags
│  ├─ tags/[tag].astro            /tags/astro — artículos con ese tag
│  ├─ manifest.webmanifest.ts     el manifest de PWA (icono, nombre, colores)
│  └─ robots.txt.ts               robots.txt generado desde site.ts
│
├─ components/
│  ├─ starlight/                  reemplazos de piezas del layout de Starlight
│  │  ├─ Header.astro               cabecera (logo, nav, buscador, redes)
│  │  ├─ PageTitle.astro            título + chips (categoría, tags, links, avisos)
│  │  ├─ Sidebar.astro              solo el primer nivel del menú (ver sección 5.5)
│  │  └─ ThemeSelect.astro          vacío a propósito: sin selector de tema
│  ├─ content/EntryList.astro      lista de tarjetas (título + descripción)
│  ├─ seo/BaseHead.astro           metaetiquetas (Open Graph, Twitter, canonical…)
│  ├─ seo/JsonLd.astro             inyecta el JSON-LD en `<script type="application/ld+json">`
│  └─ shared/                      Button, Icon, Logo — usados en todo el sitio
│
├─ features/landing/            la portada, como una mini-app aparte
│  (ver sección 7)
│
├─ styles/                      ver sección 8
├─ markdown/package-manager.mjs  plugin remark: convierte bloques `bash` en
│                                  pestañas pnpm/bun/npm
├─ icons/*.svg                  logos propios (los que Lucide no tiene)
├─ assets/logo/                 el logo del sitio
└─ layouts/BaseLayout.astro     layout HTML mínimo que usa la portada
```

## 4 · Categorías: `src/config/categories.ts`

Este archivo es un objeto de JavaScript/TypeScript escrito **a mano**, sin
ninguna magia. Así se ve una entrada real (recortada):

```ts
export const CATEGORIES = {
  frontend: {
    label: "Frontend",
    icon: "monitor",
    description: "Frontend, interfaz de usuario (UI)...",
    color: "--cat-frontend",
    group: "construir",
    order: 2,
    subcategories: {
      astro: { label: "Astro", description: "Framework orientado a..." },
      react: { label: "React", description: "Construir interfaces..." }
      // ...
    }
  }
  // ...23 categorías más
} as const
```

Notá que **la clave del objeto** (`frontend`, `astro`) tiene que coincidir
exactamente con el nombre de la carpeta real en
`src/content/docs/frontend/astro/`. Eso es lo único "mágico": el nombre de
carpeta y la clave en este archivo tienen que ser el mismo string.

¿Qué usa cada campo?

| Campo           | Para qué sirve                                                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`         | El nombre que ves en `/categories` y en los chips de cada entrada                                                                                                                          |
| `icon`          | Nombre de un icono [Lucide](https://lucide.dev/icons/) — hoy es un dato que se guarda pero ningún componente lo renderiza (quedó del diseño anterior del sidebar, con icono por categoría) |
| `description`   | La frase debajo del nombre en `/categories`                                                                                                                                                |
| `color`         | Variable CSS (definida en `src/styles/tokens.css`) para el acento visual                                                                                                                   |
| `group`         | Uno de: `construir`, `producto`, `flujo`, `calidad`, `referencia` — en qué bloque del menú aparece                                                                                         |
| `order`         | Número; menor aparece antes dentro de su `group`                                                                                                                                           |
| `subcategories` | Objeto con una entrada por subcarpeta real                                                                                                                                                 |

**Este archivo no se "regenera" solo.** Si creás una carpeta nueva en
`src/content/docs/` sin agregarla acá, el contenido va a existir (Astro lo
va a leer igual) pero **no va a aparecer** en `/categories` ni en el pie de
categoría de cada entrada, porque `getCategoryCounts()`
(`src/lib/content.ts`) recorre este objeto, no el disco.

## 5 · El menú: `src/config/sidebar.ts`

Este es el archivo que más preguntas genera, así que va con más detalle.

### 5.1 · Qué es `autogenerate`

Starlight sabe leer una carpeta sola y convertir cada `.md` de adentro en un
link del menú, usando el `title` de cada archivo. Eso es lo que hace
`autogenerate`:

```ts
{ label: "Astro", collapsed: true, items: [
  { autogenerate: { directory: "frontend/astro" } }
] }
```

Esto le dice a Starlight: "creá un grupo que se llame Astro, y adentro
metele un link por cada `.md` que encuentres en
`src/content/docs/frontend/astro/`". **No hace falta listar los archivos a
mano** — por eso agregar una entrada nueva a una subcategoría que ya existe
no toca este archivo para nada.

### 5.2 · Los cuatro niveles

```ts
export const SIDEBAR = [
  {
    label: "Construir", // nivel 1: bloque de navegación
    items: [
      {
        label: "Frontend", // nivel 2: categoría
        collapsed: true,
        items: [
          {
            label: "Astro", // nivel 3: subcategoría
            collapsed: true,
            items: [
              { autogenerate: { directory: "frontend/astro" } } // nivel 4: entradas
            ]
          }
        ]
      }
    ]
  }
  // ... Producto, Flujo, Calidad, Referencia
]
```

- **Nivel 1 — bloque de navegación** (`Construir`, `Producto`, `Flujo`,
  `Calidad`, `Referencia`): agrupa categorías por tipo de contenido. No es
  un `<details>` — es un rótulo fijo, no se puede cerrar (ver sección 6,
  override de `Sidebar.astro`). Por eso en este array no lleva `collapsed`:
  ese campo solo aplica a categoría y subcategoría, que sí son grupos
  colapsables de Starlight.
- **Nivel 2 — categoría** (`Frontend`, `Backend`...): `collapsed: true`.
  Arranca cerrada.
- **Nivel 3 — subcategoría** (`Astro`, `React`...): también
  `collapsed: true`. Arranca cerrada.
- **Nivel 4 — entradas**: no es un nivel manual, es el resultado de
  `autogenerate`.

### 5.3 · `collapsed` y el "abrir solo lo necesario"

`collapsed: true` le dice a Starlight "por defecto, esto arranca cerrado".
Pero Starlight tiene una regla más, automática y que no se configura: **si
la página que estás mirando vive adentro de un grupo, ese grupo se abre
solo**, sin importar el valor de `collapsed`. Por eso, cuando entrás a una
entrada de Frontend → Astro, ves justo esos dos niveles abiertos y todo lo
demás cerrado — no es magia nuestra, es el comportamiento de fábrica de
Starlight combinado con que le dijimos "por defecto, cerrado".

### 5.4 · Por qué este archivo no se genera solo

A diferencia de `autogenerate` (que sí lee el disco en build), la
**estructura de grupos** (qué categorías van en qué bloque, en qué orden,
con qué label) está escrita a mano acá. Es una decisión: sería posible
generar este archivo automáticamente a partir de `categories.ts`, pero eso
agregaría una función más que mantener y entender. Al ser dos archivos
separados y ambos estáticos, agregar una categoría implica tocar los dos
(ver [CONTENT_GUIDE.md](CONTENT_GUIDE.md)), pero cada uno se lee de un
vistazo.

### 5.5 · `src/components/starlight/Sidebar.astro`

Starlight no tiene forma nativa de mostrar un grupo de nivel 1 que **no**
se pueda cerrar — cualquier grupo con `items` se renderiza como un
`<details>` colapsable. Como queríamos que "Construir", "Producto", etc.
fueran rótulos fijos (no algo para tocar), hay un override chico de
`Sidebar.astro` que solo cambia **ese primer nivel**:

```astro
{
  entry.type === "group" && (
    <>
      <p class="nav-group-label">{entry.label}</p>
      <SidebarSublist
        sublist={entry.entries}
        nested
      />
    </>
  )
}
```

Para cada bloque de navegación, en vez de un `<details>` pinta un `<p>`
fijo y le delega el resto (categorías, subcategorías, entradas) al
`<SidebarSublist>` **de Starlight, sin tocar** — por eso todo lo de ahí
para abajo (colapsar, abrir la rama actual, accesibilidad) sigue siendo
100% comportamiento de fábrica. Es la única parte de todo el sidebar que
tiene código propio; el resto es Starlight puro.

El aspecto visual (tamaños, colores por nivel) es
`src/styles/starlight.css`, sección `/* ----- menú */`. El bloque de
navegación se pinta por su clase propia (`.nav-group-label`); categoría y
subcategoría se distinguen contando cuántos `ul > li > details` hay
anidados dentro de `ul.top-level` — no tienen clase propia, se apoyan en la
forma real que arma `SidebarSublist`.

## 6 · Componentes: qué reemplaza qué

Starlight arma la página combinando piezas (Header, Sidebar, PageTitle,
Footer, etc.). Se puede reemplazar cualquiera de esas piezas por la propia,
declarándolo en `astro.config.mjs`:

```ts
components: {
  Header: "./src/components/starlight/Header.astro",
  PageTitle: "./src/components/starlight/PageTitle.astro",
  Sidebar: "./src/components/starlight/Sidebar.astro",
  ThemeSelect: "./src/components/starlight/ThemeSelect.astro"
}
```

Solo reemplazamos estos cuatro. **Todo lo demás — el Footer, la tabla de
contenidos, la paginación, el buscador — es el componente de Starlight sin
ninguna modificación.**

- **`Header.astro`**: logo + nav (Inicio/Categorías/Tags) + buscador +
  iconos de redes. Usa `<Search />` y `<SocialIcons />`, que son
  componentes de Starlight — solo cambiamos el layout alrededor.
- **`Sidebar.astro`**: el único override con lógica propia (ver 5.5). Solo
  cambia el primer nivel del menú (rótulo fijo en vez de colapsable);
  categoría, subcategoría y entradas siguen siendo el `SidebarSublist` de
  Starlight sin tocar.
- **`PageTitle.astro`**: el más largo de los tres. Debajo del título
  agrega:
  - un chip con la categoría (con su color de `categories.ts`) y, si
    corresponde, uno con la subcategoría;
  - la fecha de actualización, si la entrada tiene `updatedAt`;
  - los tags, como links a `/tags/<tag>`;
  - el bloque de `command`, si la entrada lo declara;
  - los links a `technologies` (otras entradas relacionadas), resolviendo
    cada id a su título real;
  - una fila de "facts" (problema, cuándo usarlo, herramienta, lenguaje,
    etc.) — cada uno solo aparece si el campo tiene valor;
  - botones a `url`/`website`/`github`, decidiendo cuál es "el recurso" y
    cuál "el repositorio" con una regexp que detecta URLs de GitHub;
  - la lista de `warnings`, si las hay.
- **`ThemeSelect.astro`**: literalmente vacío. Es la forma correcta de
  **apagar** una pieza de Starlight sin dejar un botón que no hace nada —
  el sitio es de tema oscuro único, no hace falta el selector.

Aparte de estos tres, hay componentes de uso general (no overrides de
Starlight):

- `content/EntryList.astro`: la grilla de tarjetas (título + descripción)
  que se usa en `/categories/[category]`, `/tags/[tag]` y la portada.
- `seo/BaseHead.astro` y `seo/JsonLd.astro`: metadatos para buscadores y
  redes sociales — no tienen relación con Starlight, son etiquetas
  `<head>` estándar de SEO.
- `shared/Button.astro`, `shared/Icon.astro`, `shared/Logo.astro`: piezas
  visuales chicas, reutilizadas en toda la interfaz (docs y portada).

## 7 · La portada: `src/features/landing/`

La portada (`/`) es la única página del sitio **sin sidebar** — no muestra
documentación, es una landing page propia con su propio diseño. Por eso
vive aparte, en su propia carpeta, en vez de mezclarse con
`src/components/`:

```text
features/landing/
├─ index.ts                 re-exporta todo, para importar en un solo lugar
├─ layouts/LandingLayout.astro   layout propio (no usa el Sidebar de Starlight)
├─ components/
│  ├─ HeroWall.astro           el titular + buscador + cifras del catálogo
│  ├─ CatalogSection.astro     el índice de las 24 categorías
│  ├─ RouteSection.astro       ejemplo real de cómo una carpeta se vuelve URL
│  ├─ FlowSection.astro        los 3 pasos (buscar → leer → reutilizar)
│  ├─ CtaSection.astro         el cierre, con el botón grande
│  ├─ LandingHeader.astro      cabecera propia de la portada
│  ├─ LandingFooter.astro      pie propio de la portada
│  └─ SectionHeading.astro     título + copete, reutilizado por varias secciones
├─ data/content.ts          todos los textos fijos de la portada, en un solo lugar
├─ lib/stats.ts             calcula las cifras reales (cuántas entradas, cuántas
│                            categorías, cuál es la "ruta de ejemplo", etc.)
└─ styles/landing.css       CSS exclusivo de la portada
```

`src/pages/index.astro` es apenas 10 líneas: pide las estadísticas con
`loadStats()` y ordena las secciones una debajo de otra. Toda la
composición real vive en `features/landing/`.

## 8 · Estilos: el sistema "El Esmalte"

Hay dos hojas de estilos "de entrada", según quién esté pintando la
página:

- **`src/styles/starlight.css`** — la cargan las páginas de documentación
  (se declara en `astro.config.mjs` como `customCss`). Redefine las
  variables `--sl-color-*` que Starlight usa internamente, para que el
  sitio se vea con nuestra paleta en vez de la de fábrica. También tiene
  reglas puntuales (el menú, los bloques de código, la paginación).
- **`src/styles/global.css`** — la usa **solo la portada**. Es Tailwind v4
  más las clases propias del "muro" visual de la portada.

Ambas hojas importan **`src/styles/tokens.css`**, que es donde viven los
valores reales: colores (`--blue-400`, `--cat-frontend`...), radios
(`--radius-thin`, `--radius`, `--radius-field`), duraciones de animación,
sombras. Cambiar un color del sitio entero es cambiar una línea acá.

`DESIGN.md` (en la raíz del repo) documenta el sistema visual completo con
mucho más detalle — nombres de todos los tokens, reglas de cuándo usar
cada uno, ejemplos de componentes.

## 9 · `src/lib/content.ts`, función por función

Es el único archivo con lógica real de "consultar contenido". Todas sus
funciones reciben el array de entradas ya cargado (nunca leen el disco
ellas mismas):

| Función                                                 | Qué hace                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `getAllEntries(includePrivate?)`                        | Carga la colección completa; filtra `private` (salvo que se pida lo contrario) y `draft` (solo se ven en dev) |
| `categoryOf(entry)` / `subcategoryOf(entry)`            | Extraen categoría/subcategoría del id (la primera y segunda carpeta)                                          |
| `getEntryUrl(entry)`                                    | La URL pública: `/` + el id                                                                                   |
| `sortEntries(entries)`                                  | Orden único de todo el sitio: por `order` si existe, si no alfabético                                         |
| `getCategoryEntries(all, category)`                     | Agrupa las entradas de una categoría por subcategoría, usando `categories.ts` como fuente de los grupos       |
| `getCategoryCounts(entries)`                            | Cuenta cuántas entradas tiene cada categoría (para `/categories` y la portada)                                |
| `getAllTags(entries)` / `getEntriesByTag(entries, tag)` | Para `/tags` y `/tags/[tag]`                                                                                  |
| `formatDate(date)`                                      | Fecha en formato español (`es`)                                                                               |

## 10 · Decisiones deliberadas: qué NO tiene este sitio

Estas ausencias son **a propósito**, no descuidos — el proyecto tuvo antes
un sistema más grande y se simplificó activamente:

- **Sin validación de contenido en build.** Antes había un archivo que
  revisaba que ningún enlace interno estuviera roto y que las referencias
  entre entradas existieran. Se quitó: menos código, pero también menos
  red de seguridad — revisá los links a mano antes de publicar.
- **Sin "relacionadas" al pie de cada entrada.** Antes cada página mostraba
  entradas relacionadas y "quién te menciona". Se quitó junto con la
  validación de arriba; el pie de página ahora es el de Starlight sin
  agregados (editar en GitHub, última actualización, paginación).
- **Sin tipos editoriales.** Antes cada entrada declaraba `type: "guides"`,
  `type: "commands"`, etc., y eso decidía qué campos exigir. Se quitó: la
  categoría/subcategoría (la carpeta) es la única clasificación.
- **Sin descubrimiento de categorías por filesystem.** Antes `categories.ts`
  no existía — un archivo (`catalog.ts`) leía el disco con Node `fs`,
  buscaba `_meta.json` en cada carpeta y armaba el catálogo en cada build.
  Ahora es un objeto estático escrito a mano.
- **Sin icono ni color por categoría en el sidebar.** El `Sidebar.astro`
  anterior pintaba un icono de color junto a cada categoría y tenía un
  script que cerraba las demás secciones al abrir una. El override actual
  (sección 5.5) es mucho más chico: solo decide que el bloque de
  navegación no se cierra — categoría, subcategoría y entradas son el
  `SidebarSublist` de Starlight, sin icono ni color propio.

## 11 · Comandos

```bash
pnpm dev              # servidor de desarrollo
pnpm build            # genera el sitio en dist/, valida el esquema contra
                       # las 737 entradas reales
pnpm preview          # sirve dist/ para probarlo como en producción
pnpm check            # diagnósticos de Astro/TypeScript
pnpm eslint           # linter
pnpm prettier:check   # formato (pnpm prettier --write . lo corrige)
pnpm sync             # regenera los tipos de astro:content — correr si
                       # tocaste src/content.config.ts
```

No hay test runner. La comprobación real es `pnpm build`: si algo rompe el
esquema de una entrada real, el build falla ahí mismo con el archivo
señalado.

## 12 · Glosario rápido

- **Frontmatter**: el bloque `---` al principio de un `.md` con los
  metadatos (`title`, `tags`, etc.). Lo que va debajo es el cuerpo.
- **Content Collection**: la forma en que Astro trata una carpeta de
  Markdown como datos tipados y consultables desde código.
- **Schema**: la lista de campos permitidos/obligatorios de una colección
  (`src/content.config.ts`). Está escrito con Zod.
  Si el frontmatter de un `.md` no cumple el schema, el build falla.
- **`astro:content`**: el módulo interno de Astro para leer colecciones
  (`getCollection("docs")`).
  Sus tipos (`CollectionEntry<"docs">`) se generan en `.astro/` — por eso a
  veces hace falta `pnpm sync`.
- **`autogenerate`**: la opción del sidebar de Starlight que arma links
  automáticamente leyendo una carpeta, en vez de listarlos a mano.
- **Override**: reemplazar un componente de Starlight por uno propio,
  declarándolo en `astro.config.mjs` bajo `components`.
