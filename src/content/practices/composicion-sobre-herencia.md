---
title: Composición sobre herencia
description: Combinar comportamiento con funciones y objetos pequeños en vez de construir jerarquías de clases profundas.
category: architecture
stack: principios
order: 4
practice: Preferir componer comportamiento a partir de piezas chicas antes que extender clases base en cadenas de herencia.
why: Las jerarquías profundas son rígidas — cambiar la clase base rompe todo lo que hereda de ella, aunque no debería.
related:
  - practices/solid
  - practices/cohesion-acoplamiento
updatedAt: 2026-08-17
---

"Prefiere composición sobre herencia" es una de las frases más repetidas del diseño de software, y con razón: la herencia profunda crea jerarquías rígidas que son difíciles de cambiar sin romper algo, mientras que componer comportamiento a partir de piezas chicas mantiene cada parte independiente y reemplazable.

## El problema de la herencia profunda

```ts
// ANTES: jerarquía de tres niveles
class Person {
  constructor(public name: string) {}
  greet() { return `Hola, soy ${this.name}`; }
}

class User extends Person {
  constructor(name: string, public email: string) { super(name); }
  login() { /* ... */ }
}

class AdminUser extends User {
  constructor(name: string, email: string, public permissions: string[]) {
    super(name, email);
  }
  deleteUser(id: string) { /* ... */ }
}
```

Se ve razonable hasta que aparece el segundo eje de variación. ¿Qué pasa si un `AdminUser` también puede ser un `GuestUser` sin login completo? ¿Qué pasa si se necesita un `User` que tenga permisos de admin en un solo proyecto pero no en otro? Con herencia simple, esas combinaciones no se pueden expresar sin duplicar clases (`AdminGuestUser`, `ProjectAdminUser`...) — es el problema clásico de explosión combinatoria, y en lenguajes con herencia múltiple aparece además el problema del diamante: si dos clases padre definen el mismo método, ¿cuál gana?

Y hay un problema más silencioso: cambiar `Person.greet()` afecta a `User` y a `AdminUser` aunque el cambio no tenga nada que ver con ellos. La clase base se vuelve un punto de fragilidad para todo lo que hereda de ella (esto es, en el fondo, lo mismo que describe el principio de sustitución de Liskov cuando una subclase no respeta el contrato del padre).

## Componer en vez de heredar

```ts
// DESPUÉS: comportamiento como piezas independientes que se combinan
type Person = { name: string };
type Loginable = { email: string; login: () => void };
type Admin = { permissions: string[]; deleteUser: (id: string) => void };

function createUser(name: string, email: string): Person & Loginable {
  return {
    name,
    email,
    login: () => { /* ... */ },
  };
}

function withAdminPowers<T extends object>(base: T, permissions: string[]): T & Admin {
  return {
    ...base,
    permissions,
    deleteUser: (id: string) => { /* ... */ },
  };
}

const user = createUser('Ana', 'ana@mail.com');
const admin = withAdminPowers(user, ['users:delete']);
```

Cada pieza (`Loginable`, `Admin`) es independiente. Combinar un usuario con permisos de admin no requiere una clase nueva en la jerarquía — es aplicar una función más. Agregar un tercer eje (por ejemplo, `Auditable`) no obliga a reescribir nada existente, solo a componer una pieza más donde haga falta.

Esto también se puede resolver con inyección de dependencias en vez de mixins, que suele ser más explícito:

```ts
interface Notifier {
  notify(message: string): void;
}

class EmailNotifier implements Notifier {
  notify(message: string) { /* enviar email */ }
}

class OrderService {
  constructor(private notifier: Notifier) {}

  placeOrder(order: Order) {
    // ...
    this.notifier.notify(`Orden ${order.id} creada`);
  }
}
```

`OrderService` no hereda de `Notifier` — lo recibe como dependencia. Cambiar cómo se notifica no toca `OrderService` en absoluto.

## React ya tomó esta decisión

Esto no es solo teoría de diseño OOP — es una decisión explícita del ecosistema que el lector ya usa. React nunca tuvo herencia de componentes: un componente no puede "extender" a otro para heredar su JSX. La documentación oficial de React siempre recomendó composición (componentes que reciben otros componentes como `children` o props) en vez de herencia, incluso en los tiempos de React con clases. Un `<Card>` que envuelve contenido con `<Card><Header /><Body /></Card>` es composición pura — nunca hubo un `class SpecialCard extends Card`.

## Cuándo SÍ tiene sentido un poco de herencia

Composición sobre herencia no significa "nunca heredar". La herencia tiene sentido cuando la relación "es un" es genuinamente cierta, estable, y la jerarquía es poco profunda (uno o dos niveles). El caso más común en TS es extender `Error`:

```ts
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(public resource: string, public id: string) {
    super(`${resource} con id ${id} no encontrado`);
    this.name = 'NotFoundError';
  }
}
```

`ValidationError` genuinamente *es un* `Error` — no hay ambigüedad, no hay combinaciones múltiples de "tipos de error" que necesiten mezclarse, y la jerarquía tiene un solo nivel. Este es el caso donde la herencia es la herramienta correcta, no un atajo.

## Consideraciones

- La señal de alerta no es "usé `extends`" — es "necesito que esta clase sea dos cosas a la vez" o "cambiar la clase base me obliga a revisar cinco subclases que no debería tocar".
- Composición no es gratis: combinar muchas piezas chicas puede volverse difícil de rastrear si no hay una convención clara de cómo se combinan. Los mixins funcionales bien tipados en TS pueden ser verbosos.
- La pregunta práctica antes de heredar: si esta subclase tuviera que dejar de ser una subclase mañana, ¿cuánto código rompo? Si la respuesta es "mucho", probablemente convenía componer desde el principio.
