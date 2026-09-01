---
title: Expresiones, operadores y coerción
description: Referencia completa de operadores de JavaScript, acceso dinámico, igualdad, spread, rest, precedencia y conversiones implícitas.
type: guides
order: 4
tags: [javascript, expressions, operators, coercion, equality]
scope: fundamentos del lenguaje
website: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Expressions_and_operators
related:
  - languages/javascript/javascript-fundamentals
  - languages/javascript/javascript-control-functions
  - languages/javascript/javascript-objects
updatedAt: 2026-08-25
---

## En 30 segundos

Un **operador** combina, transforma o inspecciona valores. Una **expresión** es cualquier fragmento que produce un valor. Para código predecible:

- usa `===` y `!==` como comparación habitual;
- convierte datos externos de forma explícita;
- usa `??` para ausencia y `||` para cualquier valor falsy;
- usa `object[key]` cuando la clave está en una variable;
- usa paréntesis o variables intermedias cuando la precedencia no sea evidente.

## Asignación y actualización

Una asignación guarda un valor y también devuelve el valor asignado. Los operadores compuestos leen, calculan y escriben.

| Operador | Equivalencia conceptual | Resultado visible |
| --- | --- | --- |
| `x = 5` | asignar `5` | `5` |
| `x += 2` | `x = x + 2` | nuevo valor de `x` |
| `x -= 2` | `x = x - 2` | nuevo valor de `x` |
| `x *= 2` | `x = x * 2` | nuevo valor de `x` |
| `x /= 2` | `x = x / 2` | nuevo valor de `x` |
| `x %= 2` | `x = x % 2` | nuevo valor de `x` |
| `x **= 2` | `x = x ** 2` | nuevo valor de `x` |

```js
let count = 5

count += 2 // 7
count *= 3 // 21
count %= 4 // 1
```

`++count` incrementa y luego devuelve el nuevo valor; `count++` devuelve primero el valor anterior. En lógica de aplicación suele ser más claro separar la actualización.

```js
let index = 0

const before = index++ // before = 0, index = 1
const after = ++index  // after = 2, index = 2
```

## Operadores aritméticos

| Operador | Significado | Ejemplo | Resultado |
| --- | --- | --- | --- |
| `+` | suma o concatenación | `2 + 3` | `5` |
| `-` | resta | `7 - 2` | `5` |
| `*` | multiplicación | `4 * 3` | `12` |
| `/` | división | `5 / 2` | `2.5` |
| `%` | residuo | `7 % 3` | `1` |
| `**` | potencia | `2 ** 3` | `8` |
| `+value` | conversión numérica | `+'42'` | `42` |
| `-value` | negación numérica | `-'4'` | `-4` |

`+` es especial porque concatena si uno de sus operandos se convierte a string:

```js
1 + 2       // 3
'1' + 2     // '12'
1 + '2'     // '12'
1 + 2 + '3' // '33'
'1' + 2 + 3 // '123'
```

Cuando una entrada debe ser numérica, conviértela y valídala antes de operar.

```js
const rawQuantity = '4'
const quantity = Number(rawQuantity)

if (!Number.isFinite(quantity)) {
  throw new TypeError('La cantidad debe ser numérica')
}
```

## Igualdad y comparación

| Operación | Coerción | Diferencia importante |
| --- | --- | --- |
| `a === b` | no | comparación habitual |
| `a !== b` | no | desigualdad habitual |
| `a == b` | sí | aplica reglas de conversión difíciles de recordar |
| `Object.is(a, b)` | no | `NaN` igual a sí mismo y distingue `0` de `-0` |
| `a < b`, `a > b` | depende de tipos | compara números o texto por unidades UTF-16 |

```js
5 === '5'            // false
5 == '5'             // true
Object.is(NaN, NaN)  // true
NaN === NaN          // false
Object.is(0, -0)     // false
0 === -0             // true
```

Los objetos se comparan por identidad, no por contenido:

```js
({ id: 1 }) === ({ id: 1 }) // false

const user = { id: 1 }
user === user             // true
```

Para texto de usuario usa `Intl.Collator` o `localeCompare`; `<` no entiende reglas lingüísticas.

## Operadores lógicos y ternario

`&&`, `||` y `??` devuelven operandos, no booleanos obligatoriamente. También aplican cortocircuito.

```js
true && 'visible'       // 'visible'
0 && runTask()          // 0; runTask no se ejecuta
'' || 'Sin nombre'      // 'Sin nombre'
0 ?? 10                 // 0
null ?? 10              // 10
```

El operador ternario elige un valor:

```js
const access = isAdmin ? 'total' : 'limitado'
```

Úsalo para una decisión breve. Varias condiciones ternarias anidadas suelen ser más claras como `if`, un mapa o una función con retornos tempranos.

## Acceso a propiedades y claves dinámicas

```js
const field = 'email'
const user = { email: 'ana@example.com' }

user.email       // 'ana@example.com'
user[field]      // 'ana@example.com'
user['email']    // 'ana@example.com'
user.field       // undefined: busca literalmente "field"
```

La expresión dentro de `[]` se evalúa. Esto permite construir una clave o usar otra variable:

```js
const section = 'profile'
const property = 'name'
const data = { profile: { name: 'Ana' } }

data[section][property] // 'Ana'
```

Usa optional chaining si una parte es realmente opcional:

```js
data.settings?.[property] ?? 'Sin configurar'
// 'Sin configurar'
```

## Operadores de inspección

| Operador | Devuelve | Uso |
| --- | --- | --- |
| `typeof value` | string con categoría de tipo | primitivos y funciones |
| `key in object` | booleano | propiedad propia o heredada |
| `value instanceof Constructor` | booleano | cadena de prototypes |
| `delete object.key` | booleano | eliminar una propiedad configurable |
| `void expression` | `undefined` | ignorar deliberadamente un resultado |

```js
typeof (() => {})              // 'function'
'toString' in {}               // true: propiedad heredada
new Date() instanceof Date     // true

const draft = { temporary: true }
delete draft.temporary         // true
draft                           // {}
```

`instanceof` puede fallar entre realms distintos, como iframes, y puede personalizarse. Para arrays usa `Array.isArray`; para datos externos valida estructura.

`void` aparece a veces al marcar una Promise como intencionalmente no esperada:

```js
void sendAnalytics().catch(reportError)
```

La Promise sigue ejecutándose. `void` no captura el rechazo; por eso el ejemplo conserva `.catch()`.

## Spread y rest usan los mismos puntos, pero hacen lo contrario

**Spread** expande valores. **Rest** reúne valores restantes. El significado depende del lugar donde aparece `...`.

```js
const base = [1, 2]
const copy = [...base, 3] // spread → [1, 2, 3]

function sum(...numbers) { // rest → reúne argumentos
  return numbers.reduce((total, number) => total + number, 0)
}

sum(...copy) // spread en la llamada → 6
```

En objetos, spread copia propiedades propias enumerables de forma superficial:

```js
const defaults = { theme: 'dark', compact: false }
const settings = { ...defaults, compact: true }

settings // { theme: 'dark', compact: true }
```

El orden importa: la última propiedad con la misma clave gana.

## Operadores bit a bit

Los operadores bitwise convierten a enteros de 32 bits, salvo los operadores de `BigInt`. Son útiles para flags, protocolos y gráficos; no son una alternativa general a la lógica booleana.

| Operador | Nombre | Ejemplo | Resultado |
| --- | --- | --- | --- |
| `&` | AND | `6 & 3` | `2` |
| `|` | OR | `6 | 3` | `7` |
| `^` | XOR | `6 ^ 3` | `5` |
| `~` | NOT | `~5` | `-6` |
| `<<` | desplazamiento izquierdo | `3 << 1` | `6` |
| `>>` | derecho con signo | `-8 >> 1` | `-4` |
| `>>>` | derecho sin signo | `-1 >>> 0` | `4294967295` |

```js
const READ = 0b001
const WRITE = 0b010
const permissions = READ | WRITE

(permissions & WRITE) === WRITE // true
```

## Precedencia: no memorices una tabla completa

La multiplicación ocurre antes que la suma, y `&&` antes que `||`, pero una expresión larga obliga a recordar demasiadas reglas.

```js
2 + 3 * 4       // 14
(2 + 3) * 4     // 20

const canEdit = isOwner || (isEditor && !isLocked)
```

Usa paréntesis para expresar intención y extrae nombres cuando haya más de una idea:

```js
const hasEditorAccess = isEditor && !isLocked
const canEdit = isOwner || hasEditorAccess
```

JavaScript prohíbe mezclar `??` con `||` o `&&` sin paréntesis. Esa restricción obliga a aclarar qué fallback ocurre primero.

## Errores frecuentes

- Confiar en coerción porque un ejemplo produjo el resultado esperado.
- Usar `||` y reemplazar accidentalmente `0`, `false` o `''`.
- Comparar objetos distintos con `===` esperando igualdad estructural.
- Confundir `object[key]` con `object.key`.
- Usar spread pensando que realiza una copia profunda.
- usar operadores bitwise para truncar números sin recordar el límite de 32 bits.

## Caso de uso: leer una configuración sin perder valores válidos

```js
function normalizePreferences(input = {}) {
  const volume = Number(input.volume ?? 50)

  return {
    theme: input.theme ?? 'system',
    volume: Number.isFinite(volume) ? volume : 50,
    autoplay: input.autoplay ?? false,
    label: input.label || 'Sin nombre',
  }
}

normalizePreferences({ volume: 0, autoplay: false, label: '' })
// { theme: 'system', volume: 0, autoplay: false, label: 'Sin nombre' }
```

El ejemplo usa `??` donde cero y `false` son decisiones válidas, y `||` donde una etiqueta vacía debe reemplazarse.
