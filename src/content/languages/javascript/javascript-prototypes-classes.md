---
title: Prototypes, clases y construcción de objetos
description: Cadena de prototypes, new, funciones constructoras, class, campos privados, herencia, composición y métodos estáticos.
type: guides
order: 15
tags: [javascript, prototypes, classes, inheritance, new]
scope: modelo de objetos
website: https://developer.mozilla.org/es/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
related:
  - languages/javascript/javascript-objects
  - languages/javascript/javascript-browser-constructors
  - languages/javascript/javascript-advanced-language
updatedAt: 2026-08-25
---

## En 30 segundos

- Cada objeto puede delegar búsquedas de propiedades a otro objeto: su **prototype**.
- `class` ofrece sintaxis clara, pero utiliza el mismo modelo de prototypes.
- Los métodos se comparten mediante el prototype; los campos de instancia pertenecen a cada objeto.
- `extends` expresa herencia. Prefiere composición cuando solo necesitas combinar capacidades.
- `#campo` crea privacidad comprobada por el lenguaje; `_campo` es solo una convención.

## Cadena de prototypes

Cuando una propiedad no existe en el objeto, JavaScript la busca en su prototype y continúa hasta llegar a `null`.

```js
const baseUser = {
  describe() {
    return `${this.name} (${this.role})`
  },
}

const editor = Object.create(baseUser)
editor.name = 'Ana'
editor.role = 'editor'

editor.describe() // 'Ana (editor)'
Object.hasOwn(editor, 'describe') // false
'describe' in editor              // true
Object.getPrototypeOf(editor) === baseUser // true
```

| Operación | Qué comprueba |
| --- | --- |
| `Object.hasOwn(object, key)` | solo propiedades propias |
| `key in object` | propiedades propias y heredadas |
| `Object.getPrototypeOf(object)` | prototype inmediato |
| `Object.setPrototypeOf(object, value)` | cambia delegación; evitar en rutas críticas |
| `object instanceof Constructor` | si `Constructor.prototype` aparece en la cadena |

Cambiar el prototype de un objeto existente puede impedir optimizaciones del motor. Define la relación al crearlo mediante `class`, `new` u `Object.create`.

## Qué hace `new`

Una llamada `new Constructor(args)` realiza conceptualmente estos pasos:

1. crea un objeto enlazado a `Constructor.prototype`;
2. ejecuta la función con `this` apuntando al objeto;
3. devuelve ese objeto, salvo que el constructor retorne explícitamente otro objeto.

```js
function User(name) {
  this.name = name
}

User.prototype.greet = function () {
  return `Hola, ${this.name}`
}

const ana = new User('Ana')

ana.greet()                  // 'Hola, Ana'
ana instanceof User          // true
Object.hasOwn(ana, 'greet')  // false
```

No todas las funciones deben llamarse con `new`, y no todo lo que empieza en mayúscula es universal. `Array`, `Map`, `Set`, `Date` y clases propias son construibles; `Math`, `JSON`, `Symbol` y `BigInt` no lo son.

## Sintaxis `class`

```js
class Money {
  constructor(cents, currency = 'COP') {
    if (!Number.isSafeInteger(cents)) {
      throw new TypeError('cents debe ser un entero seguro')
    }

    this.cents = cents
    this.currency = currency
  }

  add(other) {
    if (other.currency !== this.currency) {
      throw new RangeError('Las monedas deben coincidir')
    }
    return new Money(this.cents + other.cents, this.currency)
  }

  get amount() {
    return this.cents / 100
  }

  static fromAmount(amount, currency) {
    return new Money(Math.round(amount * 100), currency)
  }
}

const price = Money.fromAmount(25.5, 'USD')
price.amount // 25.5
```

| Elemento | Pertenece a | Uso |
| --- | --- | --- |
| `constructor` | inicialización de instancia | validar y guardar estado |
| campo `name = value` | cada instancia | estado público inicial |
| método `run()` | prototype | comportamiento compartido |
| getter/setter | prototype | propiedad calculada o validada |
| `static create()` | clase | fábrica o utilidad relacionada |
| `static {}` | clase | inicialización estática compleja |

Los métodos de clase no son enumerables y se ejecutan en strict mode. Las declaraciones de clase existen en una temporal dead zone: no pueden usarse antes de inicializarse.

## Campos privados

```js
class Counter {
  #value = 0

  increment() {
    this.#value += 1
    return this.#value
  }

  static isCounter(value) {
    return typeof value === 'object' && value !== null && #value in value
  }
}

const counter = new Counter()
counter.increment()          // 1
Counter.isCounter(counter)   // true
// counter.#value            // SyntaxError
```

La marca privada pertenece a la clase, no a un nombre string. No puede leerse con corchetes, reflexión ni desde una subclase. Si otras capas necesitan el dato, expón un método o getter deliberado.

## Herencia con `extends` y `super`

```js
class AppError extends Error {
  constructor(code, message, options) {
    super(message, options)
    this.name = 'AppError'
    this.code = code
  }
}

class ValidationError extends AppError {
  constructor(field, message, options) {
    super('VALIDATION_ERROR', message, options)
    this.field = field
  }
}

const error = new ValidationError('email', 'Correo inválido')

error instanceof ValidationError // true
error instanceof AppError        // true
error instanceof Error           // true
```

En un constructor derivado debes llamar `super()` antes de usar `this`. `super.method()` invoca un comportamiento del prototype padre.

La herencia es adecuada para una relación estable de sustitución: una `ValidationError` sigue siendo un `Error`. No la uses solo para reutilizar dos métodos.

## Composición antes que una jerarquía profunda

```js
function createLogger(write) {
  return {
    info(message) {
      write({ level: 'info', message })
    },
  }
}

function createProjectService({ repository, logger }) {
  return {
    async create(input) {
      const project = await repository.insert(input)
      logger.info(`Proyecto creado: ${project.id}`)
      return project
    },
  }
}
```

El servicio recibe capacidades. Puedes reemplazar repositorio y logger sin una cadena de subclases, y las pruebas pueden pasar implementaciones pequeñas.

## `this` en métodos

El valor de `this` depende de la forma de llamada:

```js
const account = {
  name: 'Ana',
  greet() {
    return `Hola, ${this.name}`
  },
}

account.greet() // 'Hola, Ana'

const detached = account.greet
// detached() // TypeError en strict mode: this es undefined

const bound = account.greet.bind(account)
bound() // 'Hola, Ana'
```

Una arrow function no tiene `this` propio. Es útil como callback que debe conservar el contexto exterior, pero no como método cuando esperas que el receptor determine `this`.

## Errores frecuentes

- Crear cada método dentro del constructor y duplicar funciones por instancia sin necesidad.
- Extraer un método y perder su receptor.
- Usar herencia para compartir utilidades no relacionadas.
- Exponer estado interno mutable y romper invariantes.
- Confundir una propiedad `static` con una propiedad de la instancia.
- modificar prototypes nativos como `Array.prototype`; puede crear colisiones globales.

## Caso de uso: entidad con invariantes

```js
class Cart {
  #items = []

  add(product, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new RangeError('quantity debe ser un entero positivo')
    }
    this.#items.push({ product, quantity })
  }

  get total() {
    return this.#items.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    )
  }

  toJSON() {
    return { items: this.#items.map(item => ({ ...item })), total: this.total }
  }
}

const cart = new Cart()
cart.add({ id: 1, price: 20 }, 2)
cart.total   // 40
cart.toJSON() // { items: [...], total: 40 }
```

La clase aporta valor porque protege reglas y estado. Un objeto literal sería suficiente para una estructura sin comportamiento ni invariantes.
