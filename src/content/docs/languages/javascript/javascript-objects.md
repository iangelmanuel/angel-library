---
title: Objetos, propiedades y copias
description: Crear, consultar, transformar, copiar y proteger objetos con métodos, resultados visibles y casos de uso.
type: guides
order: 11
tags: [javascript, objects, properties, immutability, prototype]
scope: tipos y métodos
related:
  - languages/javascript/javascript-arrays-objects
  - languages/javascript/javascript-built-ins
  - languages/javascript/javascript-prototypes-classes
  - languages/javascript/javascript-advanced-language
updatedAt: 2026-08-25
---

## Para recordar

Un objeto agrupa propiedades y se comparte por referencia. Usa punto para una clave conocida y corchetes para una clave calculada. `Object.keys`, `values` y `entries` solo incluyen propiedades propias enumerables con clave string; `Reflect.ownKeys` también incluye symbols y propiedades no enumerables.

## Modelo mental

Un objeto agrupa propiedades formadas por una clave y un valor. Las claves son strings o symbols; los valores pueden ser de cualquier tipo. Los objetos son mutables y se asignan por referencia.

```js
const user = {
  id: 7,
  name: "Sofía",
  active: true
}

const sameUser = user
sameUser.active = false

user.active // false
sameUser === user // true
```

## Leer, crear y eliminar propiedades

La notación de punto se usa con claves conocidas. Los corchetes aceptan una expresión y son necesarios para claves dinámicas, con espacios o guardadas en otra variable.

```js
const field = "name"
const user = { name: "Sofía", "account-id": 42 }

user.name // 'Sofía'
user[field] // 'Sofía'
user["account-id"] // 42

user.role = "editor"
user["lastLogin"] = "2026-08-18"
delete user.role

user.role // undefined
```

`object[variable]` busca la propiedad cuyo nombre contiene la variable. `object.variable` busca literalmente una propiedad llamada `variable`.

## Comprobar propiedades

| Operación                    | Devuelve | Revisa heredadas                           | Caso de uso                                             |
| ---------------------------- | -------- | ------------------------------------------ | ------------------------------------------------------- |
| `Object.hasOwn(object, key)` | booleano | no                                         | validar un campo propio                                 |
| `key in object`              | booleano | sí                                         | comprobar una capacidad en toda la cadena de prototipos |
| `object[key] !== undefined`  | booleano | no distingue ausencia de valor `undefined` | solo si esa ambigüedad es aceptable                     |

```js
const settings = { theme: undefined }

Object.hasOwn(settings, "theme") // true
Object.hasOwn(settings, "lang") // false
"toString" in settings // true: viene del prototipo
settings.theme !== undefined // false: no detecta que la clave existe
```

## Inspeccionar y transformar

| Método                              | Devuelve                             | Muta              | Caso de uso                          |
| ----------------------------------- | ------------------------------------ | ----------------- | ------------------------------------ |
| `Object.keys(object)`               | array de claves propias enumerables  | no                | recorrer nombres de campos           |
| `Object.values(object)`             | array de valores propios enumerables | no                | sumar o comprobar valores            |
| `Object.entries(object)`            | array de pares `[key, value]`        | no                | filtrar o mapear un objeto           |
| `Object.fromEntries(entries)`       | objeto nuevo                         | no                | reconstruir desde pares o Map        |
| `Object.assign(target, ...sources)` | el objeto `target`                   | **sí, el target** | mezclar propiedades superficialmente |

```js
const product = { name: "Mouse", price: 30, stock: 4 }

Object.keys(product)
// ['name', 'price', 'stock']

Object.values(product)
// ['Mouse', 30, 4]

Object.entries(product)
// [['name', 'Mouse'], ['price', 30], ['stock', 4]]

const publicData = Object.fromEntries(
  Object.entries(product).filter(([key]) => key !== "stock")
)

publicData // { name: 'Mouse', price: 30 }
product // { name: 'Mouse', price: 30, stock: 4 }
```

### Qué propiedades devuelve cada operación

| API                                  | String | Symbol | No enumerable | Heredada |
| ------------------------------------ | ------ | ------ | ------------- | -------- |
| `Object.keys` / `values` / `entries` | sí     | no     | no            | no       |
| `Object.getOwnPropertyNames`         | sí     | no     | sí            | no       |
| `Object.getOwnPropertySymbols`       | no     | sí     | sí            | no       |
| `Reflect.ownKeys`                    | sí     | sí     | sí            | no       |
| `for...in`                           | sí     | no     | no            | **sí**   |

```js
const internal = Symbol("internal")
const model = { visible: true, [internal]: 42 }
Object.defineProperty(model, "id", { value: 7, enumerable: false })

Object.keys(model) // ['visible']
Object.getOwnPropertyNames(model) // ['visible', 'id']
Object.getOwnPropertySymbols(model) // [Symbol(internal)]
Reflect.ownKeys(model) // ['visible', 'id', Symbol(internal)]
```

### Invertir o transformar pares

```js
const scores = { ana: 8, leo: 6 }
const doubled = Object.fromEntries(
  Object.entries(scores).map(([name, score]) => [name, score * 2])
)

doubled // { ana: 16, leo: 12 }
scores // { ana: 8, leo: 6 }
```

### Agrupar con `Object.groupBy` y `Map.groupBy`

Ambos recorren un iterable y llaman un callback. `Object.groupBy` crea un objeto sin prototype con claves string o symbol; `Map.groupBy` conserva claves de cualquier tipo.

```js
const products = [
  { name: "Mouse", category: "hardware" },
  { name: "Editor", category: "software" },
  { name: "Monitor", category: "hardware" }
]

const byCategory = Object.groupBy(products, (product) => product.category)

byCategory.hardware
// [
//   { name: 'Mouse', category: 'hardware' },
//   { name: 'Monitor', category: 'hardware' }
// ]
```

Los arrays dentro del resultado contienen las mismas referencias que la entrada; agrupar no clona los elementos. Verifica compatibilidad en runtimes antiguos.

Como el resultado de `Object.groupBy` tiene prototype `null`, no llames `byCategory.hasOwnProperty(...)`; usa `Object.hasOwn(byCategory, key)`.

## Desestructuración y nombres dinámicos

```js
const response = {
  id: 15,
  profile: { displayName: "Noa" },
  role: "admin"
}

const {
  id,
  profile: { displayName: name },
  role = "user"
} = response

id // 15
name // 'Noa'
role // 'admin'

const property = "status"
const record = {
  [property]: "ready",
  [`${property}At`]: "2026-08-18"
}

record // { status: 'ready', statusAt: '2026-08-18' }
```

## Copias superficiales y profundas

El spread y `Object.assign` copian solo el primer nivel. Los objetos anidados continúan compartiendo referencia.

```js
const original = {
  name: "Panel",
  preferences: { compact: false }
}

const shallowCopy = { ...original }
shallowCopy.name = "Dashboard"
shallowCopy.preferences.compact = true

original.name // 'Panel'
original.preferences.compact // true: el objeto interno se comparte
```

Para datos compatibles con el algoritmo de clonación estructurada, usa `structuredClone`. Conserva ciclos, Map, Set, Date, typed arrays y otros tipos; no clona funciones ni nodos del DOM.

```js
const deepCopy = structuredClone(original)
deepCopy.preferences.compact = false

deepCopy.preferences.compact // false
original.preferences.compact // true
```

`JSON.parse(JSON.stringify(value))` no es un clonador general: pierde `undefined`, symbols y métodos; convierte Date en texto y falla con ciclos.

## Controlar cambios

| Método                       | Añadir | Eliminar | Cambiar valores | Profundidad |
| ---------------------------- | ------ | -------- | --------------- | ----------- |
| `Object.preventExtensions()` | no     | sí       | sí              | superficial |
| `Object.seal()`              | no     | no       | sí              | superficial |
| `Object.freeze()`            | no     | no       | no              | superficial |

Todos mutan el estado interno del objeto recibido y devuelven ese mismo objeto.

```js
const config = Object.freeze({
  api: "/v1",
  options: { retries: 2 }
})

Object.isFrozen(config) // true
config.options.retries = 3
config.options.retries // 3: freeze no es profundo
```

En módulos ES y modo estricto, intentar cambiar una propiedad congelada puede lanzar `TypeError`. Para inmutabilidad profunda necesitas congelar recursivamente o adoptar estructuras y patrones que no expongan mutación.

## Comparación

`===` compara referencias entre objetos. `Object.is` se parece a `===`, pero distingue `0` de `-0` y considera que `NaN` es igual a sí mismo.

```js
;({}) === {} // false
const item = {}
item === item // true

Object.is(NaN, NaN) // true
NaN === NaN // false
Object.is(0, -0) // false
0 === -0 // true
```

Para igualdad estructural, define qué campos importan o usa una solución especializada. Serializar con JSON para comparar es frágil por el orden de claves y los tipos no representables.

## Descriptores de propiedades

Cada propiedad tiene indicadores como `writable`, `enumerable` y `configurable`. `Object.defineProperty` permite controlarlos.

```js
const account = {}

Object.defineProperty(account, "id", {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
})

Object.getOwnPropertyDescriptor(account, "id")
// {
//   value: 42,
//   writable: false,
//   enumerable: true,
//   configurable: false
// }
```

Los getters calculan un valor al leer y los setters interceptan una asignación. Evita ocultar trabajo costoso o efectos inesperados detrás de una lectura aparentemente simple.

```js
const rectangle = {
  width: 4,
  height: 3,
  get area() {
    return this.width * this.height
  }
}

rectangle.area // 12
```

## Caso de uso: actualizar sin mutar

```js
function updateProfile(user, changes) {
  return {
    ...user,
    profile: {
      ...user.profile,
      ...changes
    }
  }
}

const user = {
  id: 1,
  profile: { name: "Eva", city: "Cali" }
}

const updated = updateProfile(user, { city: "Bogotá" })

updated
// { id: 1, profile: { name: 'Eva', city: 'Bogotá' } }

user.profile.city // 'Cali'
updated !== user // true
```
