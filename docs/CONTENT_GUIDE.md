# Crear una entrada, paso a paso

Guía para añadir contenido a la biblioteca. No hace falta tocar código.

## Paso 1 · Elige dónde va

La carpeta decide la clasificación:

```
src/content/docs/<categoría>/<subcategoría>/<nombre-del-archivo>.md
```

- **Categoría**: la primera carpeta (`frontend`, `backend`, `git`…). Se descubre automáticamente.
- **Subcategoría**: la carpeta de dentro (`astro`, `react`, `node`…). También se descubre automáticamente.
- **Nombre del archivo**: en minúsculas y con guiones. Es la URL.

```
src/content/docs/frontend/astro/astro-view-transitions.md
        → https://angel-library.vercel.app/frontend/astro/astro-view-transitions
```

Si la carpeta no existe en el config, el build falla. Para crear una nueva mira
el [paso 6](#paso-6--si-necesitas-una-carpeta-nueva).

### Fichas de paquetes

Las librerías instalables viven en la categoría `packages`, dentro del bloque
`Construir`. Cada paquete tiene su propia subcategoría para que pueda crecer con
más artículos sin mezclarlo con otras herramientas:

```text
src/content/docs/packages/<ecosistema>-<paquete>/<articulo>.md
```

Usa como prefijo el ecosistema principal (`react`, `node`, `javascript`,
`astro` o `css`) y conserva el nombre del paquete en el id. La etiqueta visible
se define en `src/content/docs/packages/_meta.json` con el formato
`React - Nombre del paquete`, `Node - Nombre del paquete`, etc. Express y otras
tecnologías que son frameworks permanecen en sus categorías tecnológicas; solo
se trasladan aquí sus dependencias instalables.

## Paso 2 · Copia el frontmatter mínimo

```markdown
---
title: View Transitions en Astro
description: Transiciones entre páginas sin volverse una SPA.
type: guides
tags: [astro, navegación]
updatedAt: 2026-09-06
---
```

Cuatro campos forman el mínimo editorial de toda entrada (aunque algunos tengan valores opcionales o predeterminados en el esquema):

| Campo         | Qué es                                              |
| ------------- | --------------------------------------------------- |
| `title`       | El título. Sale en la página, el menú y el buscador |
| `description` | Una frase. Sale en los listados y en el SEO         |
| `type`        | El tipo editorial (paso 3)                          |
| `tags`        | Lista de tags en minúsculas                         |

Opcionales que se usan mucho: `updatedAt` (fecha), `related` (paso 4),
`draft: true` (no se publica) y `private: true` (conserva su URL pero sale de
menús, listados y buscador).

### Orden de aprendizaje

Los módulos didácticos pueden declarar `order` para indicar su posición dentro
de la ruta de su subcategoría:

```yaml
type: guides
order: 3
```

El menú y los listados colocan primero los tipos que forman la ruta de
aprendizaje (tecnología, guía, práctica, patrón, librería, integración, hook y
receta). Dentro de esa ruta se respeta la prioridad del tipo y después `order`.
El número más pequeño aparece primero. Esto permite que una guía de fundamentos
preceda a una integración sin renombrar archivos ni cambiar sus URLs. Si dos
módulos comparten número, se ordenan por título. Los módulos de consulta quedan
después y se ordenan alfabéticamente.

Los módulos de consulta —recursos, skills, comandos, snippets, utilities y
trucos— no forman parte de esta ruta. Los valores `order` que ya tengan se
conservan para no romper el contenido, pero no se usan para convertirlos en una
secuencia de aprendizaje.

## Paso 3 · Elige el tipo y sus campos

El `type` decide qué campos extra pide el esquema:

| `type`         | Para qué                           | Campos que exige              |
| -------------- | ---------------------------------- | ----------------------------- |
| `guides`       | Explicar cómo se hace algo         | —                             |
| `technologies` | Qué es una tecnología              | —                             |
| `libraries`    | Una librería concreta              | —                             |
| `recipes`      | Resolver un problema puntual       | —                             |
| `patterns`     | Un patrón reutilizable             | —                             |
| `practices`    | Una buena práctica                 | —                             |
| `snippets`     | Un fragmento de código             | —                             |
| `hooks`        | Un hook                            | —                             |
| `utilities`    | Una función de utilidad            | —                             |
| `tricks`       | Un truco corto                     | —                             |
| `skills`       | Una skill de una herramienta       | —                             |
| `commands`     | Un comando                         | **`command`**                 |
| `resources`    | Un enlace externo                  | **`url`, `resourceCategory`** |
| `integrations` | Usar una tecnología dentro de otra | **2+ `technologies`**         |

Ejemplo de un comando:

```markdown
---
title: git switch
description: Cambiar de rama sin los efectos secundarios de checkout.
type: commands
command: git switch -c nueva-rama
tags: [git, ramas]
---
```

Ejemplo de un recurso:

```markdown
---
title: Astro Docs
description: La documentación oficial de Astro.
type: resources
url: https://docs.astro.build
resourceCategory: learning
official: true
tags: [astro, documentación]
---
```

## Paso 4 · Conecta la entrada (opcional)

`related` apunta a otras entradas **por su ruta**, sin barra inicial:

```yaml
related:
  - frontend/astro/astro-islands
  - frontend/astro/astro-content-collections
```

No hace falta declarar la relación en las dos direcciones: el sitio calcula solo
los retroenlaces. Tampoco hace falta listar las integraciones ni las recetas que
citan a esta entrada: aparecen al pie automáticamente.

Si la ruta no existe, el build falla.

## Paso 5 · Escribe el cuerpo

Markdown normal. Tres cosas que da el sitio:

**Bloques de código con nombre de archivo.**

````markdown
```ts title="src/content.config.ts"
export const collections = { docs }
```
````

**Pestañas de gestor de paquetes.** Escribe la instalación en un bloque `bash` y
se convierte sola en pnpm · bun · npm:

````markdown
```bash
pnpm add astro
```
````

**Enlaces internos** con la ruta absoluta:

```markdown
Ver [Content Collections](/frontend/astro/astro-content-collections).
```

Si el enlace apunta a una página que no existe, el build falla.

## Paso 6 · Si necesitas una carpeta nueva

**No hay que registrar categorías ni subcategorías en TypeScript.** Crea la carpeta con su primer artículo:

```text
src/content/docs/mi-categoria/primeros-pasos/introduccion.md
```

Con el frontmatter del paso 2 es suficiente para que el build la reconozca. Por defecto:

- La etiqueta sale del nombre de la carpeta: `primeros-pasos` → «Primeros Pasos».
- Una categoría nueva aparece al final del bloque «Referencia», con icono de carpeta y color azul.
- Las subcategorías no personalizadas se colocan al final, por nombre de carpeta.
- Un directorio vacío no aporta enlaces al menú. Git tampoco conserva carpetas vacías.

### Personalizar una categoría, desde un solo archivo

Este archivo es **opcional** y no crea una página:

```json title="src/content/docs/mi-categoria/_meta.json"
{
  "label": "Mi categoría",
  "description": "Lo que aprenderás en esta sección.",
  "icon": "book-open",
  "color": "--accent-blue",
  "group": "construir",
  "order": 8,
  "subcategories": {
    "primeros-pasos": {
      "label": "Empieza aquí",
      "description": "Conceptos y ejemplos iniciales."
    }
  }
}
```

Puedes omitir cualquier campo. Para añadir otra subcategoría basta con su carpeta y un Markdown; edita este archivo únicamente si quieres cambiar su etiqueta, descripción u orden.

| Campo           | Cómo se usa                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `label`         | Nombre visible; conserva el id y la URL de la carpeta                           |
| `description`   | Explicación en el listado                                                       |
| `icon`          | Nombre de Lucide o un icono propio ya registrado en `src/config/icons.ts`       |
| `color`         | Variable CSS existente, incluyendo `--`; no exige crear un color nuevo          |
| `group`         | `construir`, `producto`, `flujo`, `calidad` o `referencia`                      |
| `order`         | Entero desde 0; menor valor aparece antes dentro de su bloque. Por defecto 1000 |
| `subcategories` | Personalización opcional; sus claves son nombres de carpetas reales             |

El orden de las claves dentro de `subcategories` define el orden de esos grupos. Las carpetas nuevas que no estén en ese objeto se añaden al final. Los registros cuyo directorio ya no existe se ignoran; conviene retirarlos para evitar confusión.

`badge: false` dentro de una subcategoría oculta su insignia bajo el título de los artículos. Se conserva en algunas fichas de recursos existentes para mantener su presentación; no hace falta usarlo al crear contenido.

### Recursos y tipos editoriales

Los valores de `resourceCategory` se obtienen de las subcarpetas de `resources/`. Para añadir uno nuevo, crea `resources/<nombre>/<articulo>.md` y usa ese nombre en el campo. El campo se conserva porque también clasifica recursos ubicados en categorías como cursos o hallazgos.

Añadir un **tipo editorial** es distinto de añadir una carpeta: se hace en `src/config/content-types.ts`. Su entrada reúne etiquetas, descripción, icono, color y `learningOrder`. No añadas un tipo nuevo solo para organizar una tecnología.

### Desarrollo

El catálogo y el menú se calculan al iniciar Astro. **Reinicia `pnpm dev` cuando añadas, borres o renombres archivos/carpetas o cambies `_meta.json`**, y cuando quieras actualizar títulos o visibilidad del menú. Los cambios en el cuerpo de un artículo existente conservan la recarga habitual de Astro.

No renombres una carpeta publicada solo para mejorar su etiqueta: cambiarías todas sus URLs. Modifica `label` en `_meta.json`.

## Paso 7 · Comprueba

```bash
pnpm dev
```

Y antes de publicar:

```bash
pnpm check
pnpm build
```

El build valida el esquema, las carpetas, las relaciones y los enlaces internos.
Si algo está mal, se detiene con un mensaje en español que dice qué archivo es.

## Errores frecuentes

| Mensaje                              | Qué pasó                                                        |
| ------------------------------------ | --------------------------------------------------------------- |
| `no declara "type"`                  | Falta el campo `type` en el frontmatter                         |
| `El tipo "commands" exige "command"` | El tipo pide un campo que no pusiste                            |
| Error de catálogo                    | Revisa el nombre de la carpeta o el JSON indicado en el mensaje |
| Referencia rota                      | Un `related` apunta a una ruta inexistente                      |
| Enlace interno muerto                | Un `](/…)` del cuerpo no lleva a ninguna parte                  |

## Contrato editorial: aprender y volver a consultar

Escribe primero una respuesta breve a «qué resuelve y cuándo lo necesito». Después permite reproducir el caso. Una persona experimentada debe encontrar el código y sus límites sin leer toda la introducción; una principiante debe poder identificar los conocimientos previos y el resultado esperado.

Mantén títulos reconocibles, pero adapta la extensión al tipo de entrada. No agregues secciones vacías ni repitas una definición completa que ya tiene su propia guía.

| Tipo                         | Secuencia de lectura                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Guía o tecnología            | En pocas palabras → Antes de empezar → Conceptos → Ejemplo → Comprobación → Errores y límites → Siguiente paso y fuentes |
| Receta o integración         | Objetivo → Requisitos con enlaces → Preparación → Implementación → Comprobación → Límites y variantes → Fuentes          |
| Utilidad, snippet o hook     | Qué resuelve → Contrato de entrada/salida → Código → Uso y resultado → Casos límite                                      |
| Patrón o práctica            | Problema → Decisión → Ejemplo → Consecuencias → Cuándo evitarlo                                                          |
| Comando                      | Qué hace → Shell y directorio → Comando → Salida esperada → Efectos y recuperación                                       |
| Recurso, curso o herramienta | Para qué sirve → A quién le ayuda → Cómo aprovecharlo → Límites, acceso y fuente                                         |

### Plantilla de guía práctica

````markdown
## En pocas palabras

Define el concepto, el problema que resuelve y cuándo conviene.

## Antes de empezar

Enlaza los conceptos previos e indica runtime, versión principal y dependencias.

## Ejemplo paso a paso

Indica la carpeta desde la que se ejecutan los comandos y el archivo que se crea.
Declara si los bloques son consecutivos, alternativos o fragmentos independientes.

```js title="ejemplo.mjs"
const nombres = ["Ana", "Luis"]
console.log(nombres.map((nombre) => nombre.toUpperCase()))
// ["ANA", "LUIS"]
```

## Comprobación

Describe una entrada válida, otra inválida y el resultado observable de ambas.

## Errores y límites

Relaciona síntoma, causa y corrección. Explica qué queda fuera del ejemplo.

## Siguiente paso

Enlaza la continuación y la documentación oficial pertinente.
````

### Reglas para código que se puede copiar

- No presentes `as Usuario`, un genérico o `!` como validación de datos externos.
- Usa un solo directorio de ejemplo (`src/lib`, por ejemplo) y haz coincidir todos los imports. Un alias como `@/lib` requiere configuración y no existe automáticamente en cualquier proyecto.
- Define los helpers importados o enlaza el archivo previo que los implementa. Identifica explícitamente el pseudocódigo.
- En ejemplos de red incluye el estado HTTP de error y el formato esperado; en formularios, etiquetas y feedback; en almacenamiento, persistencia y limpieza.
- Usa datos ficticios. Explica los efectos de comandos que borran, migran, publican o cambian cuentas antes de ejecutarlos.
- Conserva la versión principal de una receta de extremo a extremo. Separa las variantes incompatibles; no combines la instalación actual con configuración de una versión anterior.
- Una receta «completa» debe incluir las piezas que promete. Si reutiliza preparación previa, el título y los requisitos deben dejarlo claro.

### Lenguaje, fuentes y mantenimiento

Usa español latinoamericano. Introduce «solicitud HTTP (request)» o «tiempo de ejecución (runtime)» antes de utilizar el término técnico sin explicación. Conserva los identificadores exactos de las APIs. Prefiere «Preparación», «Recomendaciones» y «Comprobación» a títulos ambiguos como «Setup» o «Tips».

Enlaza páginas oficiales concretas al explicar APIs, compatibilidad o instalación. `updatedAt` registra una revisión real del texto; no cambies todas las fechas por una edición mecánica. Precios, planes y rankings requieren fecha y consulta del proveedor, no afirmaciones permanentes.

`private: true` es una clasificación editorial, **no un control de acceso**: la entrada conserva su ruta. No guardes secretos ni información confidencial en una página servida públicamente.

### Verificar cambios de estructura

```bash
pnpm check:catalog
pnpm check
pnpm build
```

La prueba del catálogo crea carpetas temporales y comprueba descubrimiento automático, orden y errores de metadatos. El build comprueba la integración con el contenido real. Ninguno de estos comandos ejecuta las aplicaciones descritas en los bloques Markdown.

El [informe editorial](CONTENT_AUDIT.md) y su inventario conservan el alcance de la revisión de contenido anterior. Para la estructura interna y los riesgos de quitar funciones, consulta [COMPLEXITY_REVIEW.md](COMPLEXITY_REVIEW.md).
