---
title: Control de flujo, funciones y alcance
description: Condiciones, bucles, funciones, parámetros, scope, closures y recursión con resultados visibles y casos de uso.
type: guides
order: 5
tags: [javascript, control-flow, functions, scope, closures]
scope: fundamentos del lenguaje
related:
  - languages/javascript/javascript-fundamentals
  - languages/javascript/javascript-loops-iteration
  - languages/javascript/javascript-arrays-objects
  - languages/javascript/javascript-advanced-language
updatedAt: 2026-08-25
---

## Para recordar

- `if` y `switch` controlan sentencias; el ternario elige un valor.
- Una función recibe argumentos, puede producir efectos y devuelve un valor; sin `return` explícito devuelve `undefined`.
- `let` y `const` tienen scope de bloque; una closure conserva acceso al scope donde fue creada.
- Una declaración `function` puede invocarse antes de su línea; una variable con función no puede usarse antes de inicializarse.
- Prefiere retornos tempranos para separar validaciones del camino principal.

## Tomar decisiones

El control de flujo decide qué instrucciones se ejecutan y cuántas veces. La condición se convierte a booleano: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined` y `NaN` son valores *falsy*; el resto es *truthy*, incluidos `[]` y `{}`.

| Estructura | Devuelve | Muta datos | Úsala cuando |
| --- | --- | --- | --- |
| `if / else` | no devuelve un valor | no por sí sola | hay bloques o varias decisiones |
| operador ternario | el valor de una rama | no por sí solo | necesitas elegir un valor breve |
| `switch` | no devuelve un valor | no por sí solo | comparas un mismo valor con casos discretos |
| `&&` | primer falsy o último operando | no | ejecutas o eliges algo bajo una condición |
| `||` | primer truthy o último operando | no | necesitas un valor alternativo por falsedad |
| `??` | primer valor que no sea `null` ni `undefined` | no | `0`, `false` y `''` son valores válidos |

```js
const role = 'editor'

if (role === 'admin') {
  console.log('Control total')
} else if (role === 'editor') {
  console.log('Puede editar') // se muestra
} else {
  console.log('Solo lectura')
}

const label = role === 'admin' ? 'Administrador' : 'Usuario'
label // 'Usuario'
```

### `||` no reemplaza siempre a `??`

```js
const attempts = 0

attempts || 3 // 3: considera 0 como falsy
attempts ?? 3 // 0: solo reemplaza null o undefined

const nickname = ''
nickname || 'Anónimo' // 'Anónimo'
nickname ?? 'Anónimo' // ''
```

Usa `??` para configuraciones, cantidades y respuestas en las que cero, una cadena vacía o `false` tienen significado.

### `switch`, coincidencia estricta y fallthrough

`switch` compara cada `case` con `===`. Sin `break`, `return` o `throw`, la ejecución continúa en el siguiente caso; este comportamiento se llama **fallthrough**.

```js
function permissionFor(role) {
  switch (role) {
    case 'admin':
      return 'write:any'
    case 'editor':
      return 'write:own'
    case 'reader':
      return 'read'
    default:
      return 'none'
  }
}

permissionFor('editor') // 'write:own'
permissionFor('guest')  // 'none'
```

Agrupa casos deliberadamente cuando comparten el mismo resultado:

```js
switch (status) {
  case 200:
  case 201:
    message = 'Operación correcta'
    break
  default:
    message = 'Revisar respuesta'
}
```

Para una relación simple clave → valor, un objeto o `Map` puede evitar control de flujo innecesario.

### Guard clauses o retornos tempranos

Una **guard clause** termina pronto ante una condición inválida o excepcional.

```js
function getCheckoutLabel(cart) {
  if (!cart) return 'Carrito no disponible'
  if (cart.items.length === 0) return 'Carrito vacío'
  if (!cart.canCheckout) return 'Completa los datos pendientes'

  return `Pagar ${cart.total}`
}
```

Esto mantiene el camino exitoso sin varios niveles de `else`. No conviertas cada línea en un retorno si las condiciones forman una sola decisión fácil de leer.

## Repetir trabajo

| Estructura | Recorre | Cuándo conviene |
| --- | --- | --- |
| `for` | contador o rango controlado | conoces índice, inicio y fin |
| `while` | mientras la condición sea verdadera | no conoces la cantidad de iteraciones |
| `do...while` | igual que `while`, pero ejecuta una vez | la primera ejecución es obligatoria |
| `for...of` | valores de un iterable | arrays, strings, Map, Set o NodeList |
| `for...in` | claves enumerables de un objeto | objetos simples; no arrays |

```js
const values = [10, 20, 30]
let total = 0

for (const value of values) {
  total += value
}

total // 60
```

```js
const user = { name: 'Ana', active: true }
const rows = []

for (const key in user) {
  if (Object.hasOwn(user, key)) {
    rows.push(`${key}: ${user[key]}`)
  }
}

rows // ['name: Ana', 'active: true']
```

`break` termina el bucle; `continue` salta a la siguiente iteración. Antes de usar un bucle manual con arrays, revisa si `map`, `filter`, `find`, `some` o `reduce` expresa mejor la intención.

## Formas de declarar funciones

Las funciones son valores: se pueden guardar, enviar como argumento y devolver desde otra función.

| Forma | Tiene `this` propio | Hoisting utilizable | Caso típico |
| --- | --- | --- | --- |
| declaración `function name()` | sí | sí | funciones principales y reutilizables |
| expresión `const name = function ()` | sí | no antes de inicializar | función asignada o intercambiable |
| arrow `const name = () =>` | no; hereda el exterior | no antes de inicializar | callbacks y funciones breves |

```js
function add(a, b) {
  return a + b
}

const multiply = function (a, b) {
  return a * b
}

const double = value => value * 2

add(2, 3)      // 5
multiply(4, 3) // 12
double(6)      // 12
```

Una arrow que devuelve un objeto de forma implícita necesita paréntesis:

```js
const toUser = name => ({ name, active: true })

toUser('Lina') // { name: 'Lina', active: true }
```

## Parámetros y argumentos

Los parámetros por defecto se aplican cuando el argumento es `undefined`, no cuando es `null`. El parámetro rest reúne argumentos restantes en un array real.

```js
function greet(name = 'Visitante') {
  return `Hola, ${name}`
}

greet()          // 'Hola, Visitante'
greet(undefined) // 'Hola, Visitante'
greet(null)      // 'Hola, null'

function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0)
}

sum(2, 4, 6) // 12
```

La desestructuración hace explícita la forma esperada del argumento:

```js
function formatUser({ name, role = 'user' }) {
  return `${name} (${role})`
}

formatUser({ name: 'Leo' }) // 'Leo (user)'
```

## Alcance o scope

`let` y `const` tienen alcance de bloque. `var` tiene alcance de función y puede producir valores accesibles antes de lo esperado por su hoisting; en código moderno se prefiere `const` y luego `let` cuando habrá reasignación.

```js
const environment = 'production'

function buildMessage() {
  const prefix = '[app]'

  if (environment === 'production') {
    const level = 'info'
    return `${prefix} ${level}`
  }
}

buildMessage() // '[app] info'
// prefix // ReferenceError
// level  // ReferenceError
```

### Hoisting y temporal dead zone

Durante la creación de un scope, JavaScript registra declaraciones antes de ejecutar sus líneas. Ese comportamiento se conoce como **hoisting**, pero no significa que todas puedan usarse de la misma forma.

```js
declaredFunction() // 'lista'

function declaredFunction() {
  return 'lista'
}

// readValue() // ReferenceError: aún no se inicializó
const readValue = () => 'valor'
```

`let`, `const` y `class` existen desde el comienzo del bloque, pero permanecen inaccesibles hasta su declaración: esa región es la **temporal dead zone** (TDZ). `var` se inicializa como `undefined`, lo que puede esconder errores.

```js
console.log(legacy) // undefined
var legacy = 'ready'

// console.log(modern) // ReferenceError
const modern = 'ready'
```

Declara cerca del uso y no organices un archivo alrededor de trucos de hoisting.

## Closures

Un closure aparece cuando una función conserva acceso a las variables del lugar donde fue creada, incluso después de terminar la función exterior. Sirve para encapsular estado, crear funciones configuradas y evitar variables globales.

```js
function createCounter(initial = 0) {
  let value = initial

  return {
    increment() {
      value += 1
      return value
    },
    current() {
      return value
    },
  }
}

const counter = createCounter(5)
counter.increment() // 6
counter.increment() // 7
counter.current()   // 7
```

## Funciones de orden superior

Una función de orden superior recibe o devuelve funciones. Es la base de callbacks, middlewares y métodos como `map` o `filter`.

```js
function withTax(rate) {
  return price => price * (1 + rate)
}

const addVAT = withTax(0.19)
addVAT(100) // 119
```

## Recursión

Una función recursiva se llama a sí misma y necesita un caso base. Es útil para estructuras anidadas, aunque para recorridos lineales un bucle suele ser más claro y evita desbordar la pila.

```js
function factorial(number) {
  if (number <= 1) return 1
  return number * factorial(number - 1)
}

factorial(5) // 120
```

## Caso de uso: validar antes de transformar

```js
function normalizeProduct(product) {
  if (!product || typeof product !== 'object') {
    throw new TypeError('El producto debe ser un objeto')
  }

  const price = Number(product.price)
  if (!Number.isFinite(price) || price < 0) {
    throw new RangeError('El precio debe ser un número positivo')
  }

  return {
    id: String(product.id),
    name: String(product.name).trim(),
    price,
  }
}

normalizeProduct({ id: 7, name: ' Teclado ', price: '80' })
// { id: '7', name: 'Teclado', price: 80 }
```

El ejemplo combina decisiones, retornos tempranos, errores y conversión explícita. Los retornos tempranos mantienen el camino principal con menos niveles de indentación.
