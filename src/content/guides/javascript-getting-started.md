---
title: Primeros pasos con JavaScript
description: Qué son JavaScript, ECMAScript y el runtime; cómo ejecutar código, leer su sintaxis y entender errores antes de estudiar el lenguaje.
category: general
stack: javascript
order: 2
tags: [javascript, ecmascript, basics, runtime, syntax]
scope: inicio desde cero
website: https://developer.mozilla.org/es/docs/Learn_web_development/Core/Scripting/What_is_JavaScript
related:
  - technologies/javascript
  - guides/javascript-fundamentals
  - guides/javascript-expressions-operators
updatedAt: 2026-08-25
---

## En 30 segundos

- **JavaScript** es el lenguaje que escribes.
- **ECMAScript** es el estándar que define su sintaxis y comportamiento.
- Un **motor** como V8 o SpiderMonkey interpreta y ejecuta ese lenguaje.
- Un **runtime** combina el motor con APIs del entorno. El navegador agrega DOM, eventos y `fetch`; Node.js agrega archivos, procesos y red de servidor.
- La consola del navegador sirve para experimentar; un módulo `.js` sirve para organizar código real.

Este documento es el punto de entrada para quien nunca ha programado en JavaScript. Si ya trabajas con el lenguaje, úsalo para recordar dónde termina ECMAScript y dónde comienza el runtime.

## JavaScript no es todo el navegador

La suma de varias capas produce una aplicación web:

```text
ECMAScript → valores, funciones, objetos, clases, Promise, Map…
Navegador  → document, HTMLElement, fetch, localStorage, Notification…
Proyecto   → React, Astro, librerías y tu código
```

`Array`, `Object`, `Map`, `Set`, `Promise` y `RegExp` pertenecen al lenguaje. `document`, `localStorage`, `fetch` y `Notification` son APIs proporcionadas por el navegador o por otro runtime compatible.

```js
typeof Array       // 'function': objeto incorporado del lenguaje
typeof document    // 'object' en una página; 'undefined' en Node.js
typeof process     // 'object' en Node.js; normalmente 'undefined' en navegador
```

Esta separación explica por qué un fragmento puede funcionar en DevTools pero fallar durante renderizado en servidor: ambos ejecutan JavaScript, pero no ofrecen las mismas APIs.

## Dónde ejecutar el primer código

### Consola del navegador

Abre DevTools, entra a **Console** y escribe una expresión:

```js
2 + 3
// 5

const language = 'JavaScript'
language.toUpperCase()
// 'JAVASCRIPT'
```

La consola conserva variables durante esa sesión. Es adecuada para comprobar un método, inspeccionar un elemento o reproducir un caso pequeño; no reemplaza un archivo versionado.

### Script dentro de HTML

Para código moderno usa módulos:

```html
<button id="greet">Saludar</button>

<script type="module" src="./main.js"></script>
```

```js
// main.js
const button = document.querySelector('#greet')

button?.addEventListener('click', () => {
  console.log('Hola desde un módulo')
})
```

`type="module"` habilita `import` y `export`, usa modo estricto y difiere la ejecución hasta que el HTML fue analizado. El archivo externo se resuelve respecto a la URL del documento.

### Runtime fuera del navegador

Node.js, Deno y Bun pueden ejecutar archivos JavaScript. Sus comandos, permisos y APIs cambian, pero el núcleo del lenguaje es el mismo:

```js
// hello.js
const names = ['Ana', 'Leo']
console.log(names.map(name => `Hola, ${name}`))
```

```bash
node hello.js
# [ 'Hola, Ana', 'Hola, Leo' ]
```

## Cómo leer una línea

```js
const total = prices.reduce((sum, price) => sum + price, 0)
```

| Parte | Nombre | Qué hace |
| --- | --- | --- |
| `const` | declaración | crea un binding que no se puede reasignar |
| `total` | identificador | nombre elegido para acceder al resultado |
| `=` | asignación | guarda el valor derecho en el nombre izquierdo |
| `prices` | expresión | obtiene el valor de una variable |
| `.reduce(...)` | llamada a método | ejecuta una función asociada al array |
| `(sum, price) => ...` | arrow function | describe el cálculo de cada iteración |
| `0` | valor inicial | estado con el que comienza la reducción |

Aprender a nombrar cada pieza permite buscar documentación con precisión. “No funciona el reduce” es menos útil que “el callback de `reduce` no retorna el acumulador”.

## Valores, expresiones y sentencias

Una **expresión** produce un valor. Una **sentencia** dirige la ejecución o declara algo.

```js
2 * 4                    // expresión → 8
user.name                // expresión → valor de la propiedad
isReady ? 'sí' : 'no'    // expresión → una de dos cadenas

const result = 2 * 4     // sentencia de declaración
if (result > 5) {        // sentencia de control
  console.log(result)    // sentencia con una llamada
}
```

Una llamada puede ser una expresión y también producir un efecto. `console.log()` devuelve `undefined`, pero escribe en la consola.

## Bloques, mayúsculas y comentarios

Las llaves forman un **bloque**. JavaScript distingue mayúsculas de minúsculas: `userName` y `username` son identificadores diferentes.

```js
const maxAttempts = 3

if (maxAttempts > 0) {
  // Comentario de una línea: explica una decisión no evidente.
  console.log('Se permiten intentos')
}

/*
  Comentario de varias líneas.
  No lo uses para conservar código obsoleto: Git ya guarda el historial.
*/
```

Los nombres pueden contener letras, dígitos, `_` y `$`, pero no comenzar con un dígito ni usar una palabra reservada. En código de aplicación suele preferirse `camelCase` para variables y funciones, y `PascalCase` para clases.

## Punto y coma y ASI

JavaScript posee **Automatic Semicolon Insertion** (ASI), inserción automática de punto y coma. Muchos proyectos omiten `;` mediante una configuración consistente, pero ASI no significa que cada salto de línea termine siempre una sentencia.

```js
const value = 3

// Un formateador evita combinaciones ambiguas al comenzar con (, [, `, + o -.
;(function start() {
  console.log(value)
})()
```

Elige una convención con ESLint y un formateador. No mezcles estilos manualmente. Una precaución especialmente importante es `return`: su expresión debe comenzar en la misma línea.

```js
function createUser() {
  return {
    active: true,
  }
}

createUser() // { active: true }
```

## Modo estricto

El modo estricto convierte comportamientos ambiguos en errores y modifica algunas reglas históricas. Los módulos ES ya son estrictos. En un script clásico puede activarse con `'use strict'`.

```js
'use strict'

// accidentalGlobal = 1
// ReferenceError: accidentalGlobal is not defined
```

No añadas `'use strict'` a cada módulo moderno por costumbre: ya está implícito. Sí necesitas reconocerlo al leer scripts antiguos.

## Leer un error sin adivinar

Una excepción suele incluir tipo, mensaje y stack trace o traza de llamadas:

```text
TypeError: Cannot read properties of undefined (reading 'name')
    at formatUser (profile.js:12:18)
    at render (app.js:30:5)
```

1. Lee el tipo: `TypeError` señala una operación incompatible con el valor recibido.
2. Lee el mensaje: se intentó acceder a `.name` desde `undefined`.
3. Abre la primera línea de tu código en la traza.
4. Inspecciona el valor real antes de cambiar código.
5. Corrige el origen o valida la frontera; no agregues `?.` en todas partes para esconder el contrato roto.

## Primer programa completo

```js
const prices = [20, 35, 15]

function calculateTotal(values, taxRate = 0.19) {
  const subtotal = values.reduce((sum, value) => sum + value, 0)
  const tax = subtotal * taxRate

  return {
    subtotal,
    tax,
    total: subtotal + tax,
  }
}

const invoice = calculateTotal(prices)

invoice
// { subtotal: 70, tax: 13.3, total: 83.3 }
```

Este ejemplo contiene valores, un array, una función, parámetros, variables locales, una función callback, un objeto y un retorno. No necesitas memorizarlo todavía: úsalo como mapa de lo que aprenderás en las siguientes páginas.

## Antes de continuar

Debes poder explicar estas ideas con tus propias palabras:

- diferencia entre lenguaje y runtime;
- diferencia entre valor, expresión y sentencia;
- dónde ejecutar un módulo;
- qué parte de un error indica el archivo y la línea;
- por qué probar en consola no demuestra que una API exista en todos los runtimes.

La siguiente etapa es **Fundamentos de JavaScript**: tipos, variables, referencias, conversiones, truthy, falsy y nullish.
