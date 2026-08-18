---
title: Módulos de JavaScript
description: Import y export, módulos por defecto y nombrados, dependencias circulares, carga dinámica y límites entre cliente y servidor.
category: general
stack: javascript
order: 24
tags: [javascript, modules, esm, imports, architecture]
scope: organización del código
related:
  - technologies/javascript
  - guides/typescript-path-aliases
  - guides/javascript-runtime-event-loop
updatedAt: 2026-08-18
---

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

## Re-exportar y encapsular

Un `index.js` puede exponer una API pública estable:

```js
export { createClient } from './client.js'
export type { ClientConfig } from './types.js'
```

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
