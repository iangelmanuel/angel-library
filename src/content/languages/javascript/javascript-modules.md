---
title: Módulos de JavaScript
description: Import y export, módulos por defecto y nombrados, dependencias circulares, carga dinámica y límites entre cliente y servidor.
type: guides
order: 21
tags: [javascript, modules, esm, imports, architecture]
scope: organización del código
related:
  - languages/javascript/javascript
  - general/typescript/typescript-path-aliases
  - languages/javascript/javascript-runtime-event-loop
updatedAt: 2026-08-25
---

## Para recordar

Un módulo tiene scope propio, se ejecuta en strict mode y se evalúa una vez por identidad resuelta. Los imports estáticos se analizan antes de ejecutar, son bindings vivos y no pueden reasignarse desde el consumidor. `import()` carga bajo demanda y devuelve una Promise.

## ESM: exportar e importar

Un módulo tiene su propio scope y se evalúa una vez por URL. Usa exports nombrados para APIs explícitas y default solo cuando el módulo tiene una responsabilidad principal.

| Sintaxis | Qué expone o carga | Caso de uso |
| --- | --- | --- |
| `export const name = ...` | export nombrado | varias piezas públicas |
| `export { name as alias }` | export nombrado con otro nombre | adaptar la API pública |
| `export default value` | un valor principal | componente o responsabilidad central |
| `import { name } from '...'` | binding nombrado vivo | dependencia estática |
| `import value from '...'` | export default | dependencia estática principal |
| `import * as namespace from '...'` | objeto namespace | agrupar una API |
| `import('...')` | `Promise` con el namespace | carga bajo demanda |

```js
// format.js
export function formatName(name) {
  return name.trim()
}

export const separator = ' '

// profile.js
import { formatName, separator } from './format.js'

formatName('  Ana  ') // 'Ana'
separator             // ' '
```

`export default` se importa con cualquier nombre, mientras que un export nombrado debe coincidir con su nombre o usar alias:

```js
import { formatName as format } from './format.js'
import formatDefault from './format-default.js'

typeof format        // 'function'
typeof formatDefault // depende del valor exportado por defecto
```

Mantén dependencias unidireccionales. Un módulo que importa de muchos lugares puede estar mezclando responsabilidades.

### Bindings vivos, no copias

El import observa el valor actual exportado por el módulo, aunque el consumidor no pueda reasignarlo.

```js
// counter.js
export let count = 0
export function increment() {
  count += 1
}

// app.js
import { count, increment } from './counter.js'

count       // 0
increment()
count       // 1
// count = 8 // TypeError: el import es de solo lectura
```

Los módulos se cargan por su specifier resuelto. En navegador, las rutas relativas necesitan normalmente extensión o un import map; un bundler puede aplicar reglas distintas.

## Re-exportar y encapsular

Un `index.js` puede exponer una API pública estable:

```js
export { createClient } from './client.js'
export { ClientError } from './client-error.js'
```

`export type` pertenece a TypeScript, no a JavaScript. Si el archivo es `.ts`, el compilador puede eliminar ese export porque solo existe durante el chequeo de tipos.

No reexportes cada detalle interno por comodidad. Un barrel demasiado amplio puede aumentar ciclos, hacer más difícil el tree-shaking y convertir rutas internas en API pública accidental.

## Carga dinámica

`import()` devuelve una Promise y permite dividir código por ruta o interacción:

```js
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js')
  openEditor()
})
```

El resultado completo de `import()` es un objeto namespace:

```js
const module = await import('./format.js')

Object.keys(module)       // ['formatName', 'separator']
module.formatName(' Eva ') // 'Eva'
```

Úsala cuando el módulo no sea necesario para el primer render. Maneja el fallo de red y el estado de carga; la división de bundle no elimina la necesidad de una UX clara.

## Módulos en HTML y top-level await

```html
<script type="module" src="/app.js"></script>
```

Los scripts de módulo se difieren automáticamente, pueden importar otros módulos y siguen CORS. Cada `<script type="module">` y cada dependencia se ejecuta una sola vez por identidad, aunque se solicite desde varios lugares.

Un módulo puede usar `await` en el nivel superior:

```js
// config.js
const response = await fetch('/config.json')
if (!response.ok) throw new Error(`HTTP ${response.status}`)

export const config = await response.json()
```

Los módulos dependientes esperan esa evaluación. Evita bloquear un grafo amplio con trabajo lento si la configuración puede cargarse de forma explícita después del arranque.

## Import attributes y módulos JSON

Los atributos declaran cómo debe interpretar el host un recurso. ECMAScript 2025 estandariza la sintaxis `with` y los JSON modules; la disponibilidad práctica depende del runtime y del bundler.

```js
import config from './config.json' with { type: 'json' }

config.theme // valor exportado por defecto desde el JSON
```

También pueden combinarse con import dinámico:

```js
const module = await import('./translations/es.json', {
  with: { type: 'json' },
})

module.default // objeto parseado
```

El atributo evita tratar JSON como JavaScript y hace explícito el tipo esperado. No reemplaza la validación de su estructura.

## CommonJS y ESM

CommonJS usa `require` y `module.exports`; ESM usa `import` y `export`. Node puede convivir con ambos según `package.json`, extensión y configuración. Evita mezclar sintaxis sin entender qué formato genera el build. En librerías, documenta el formato de entrada y salida para no obligar al consumidor a adivinar.

## Ciclos y efectos secundarios

Un ciclo A → B → A puede exponer un binding antes de que esté inicializado. Si dos módulos necesitan datos de ambos, extrae el contrato común o invierte la dependencia. Mantén inicialización global —listeners, conexión a DB, lectura de env— en un punto de composición, no como efecto lateral inesperado de cualquier import.

```text
Antes: feature-a.js → feature-b.js → feature-a.js
Después: feature-a.js → shared-contract.js ← feature-b.js
```

## `import.meta`

`import.meta` contiene metadatos definidos por el host. En el navegador y varios runtimes, `import.meta.url` identifica el módulo actual y permite resolver recursos relativos sin depender de la URL de la página.

```js
const workerURL = new URL('./search.worker.js', import.meta.url)
const worker = new Worker(workerURL, { type: 'module' })

workerURL // URL absoluta resuelta junto al módulo actual
```

Propiedades como `import.meta.env`, `import.meta.glob` o `import.meta.dirname` no son universales: dependen del bundler o runtime. Documenta esa frontera antes de mover el módulo a otra herramienta.

## Cliente, servidor y secretos

Un import puede hacer que todo su grafo viaje al navegador en herramientas con bundling. No importes un módulo con secretos desde código cliente aunque solo uses una función aparentemente inocente; separa módulos server-only y APIs públicas. La frontera de módulos es también una frontera de seguridad y de tamaño de bundle.

## Caso de uso: API pública pequeña

```js
// payments/index.js: contrato público
export { createCheckout } from './create-checkout.js'
export { PaymentError } from './payment-error.js'

// app.js: no conoce archivos internos
import { createCheckout, PaymentError } from './payments/index.js'
```

El consumidor depende de una frontera estable. Los helpers internos pueden cambiar de ubicación sin obligar a modificar cada import de la aplicación.
