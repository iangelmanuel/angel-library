---
title: SOLID
description: Cinco principios de diseño orientado a objetos para escribir código más mantenible, cada uno con su propia trampa cuando se aplica sin criterio.
category: architecture
stack: principios
order: 1
practice: Diseñar clases y módulos con una sola responsabilidad, abiertos a extensión, con contratos consistentes, interfaces chicas y dependencias sobre abstracciones.
why: Sin estos límites, cualquier cambio pequeño obliga a tocar código que no debería verse afectado.
related:
  - practices/composicion-sobre-herencia
  - practices/cohesion-acoplamiento
updatedAt: 2026-08-17
---

SOLID es un acrónimo de cinco principios de diseño orientado a objetos, popularizados por Robert C. Martin. Nacieron pensando en Java y C#, en sistemas con jerarquías de clases grandes. En JS/TS, donde funciones, módulos y objetos literales son ciudadanos de primera clase, algunos aplican casi igual y otros hay que traducirlos. Vamos uno por uno.

## S — Single Responsibility (responsabilidad única)

Una clase o función debería tener una sola razón para cambiar. No es "una función, una línea" — es "una función, un motivo de negocio".

```ts
// ANTES: mezcla validación, persistencia y notificación
class UserService {
  async createUser(data: { email: string; password: string }) {
    if (!data.email.includes('@')) throw new Error('Email inválido');
    if (data.password.length < 8) throw new Error('Password muy corta');

    const user = await db.users.insert(data);

    await smtpClient.send({
      to: data.email,
      subject: 'Bienvenido',
      body: `Hola, tu cuenta fue creada`,
    });

    return user;
  }
}
```

Si cambia la regla de validación, si cambia el proveedor de email, o si cambia la forma de persistir, esta clase cambia por tres razones distintas.

```ts
// DESPUÉS: cada responsabilidad en su propio módulo
function validateNewUser(data: { email: string; password: string }) {
  if (!data.email.includes('@')) throw new Error('Email inválido');
  if (data.password.length < 8) throw new Error('Password muy corta');
}

class UserRepository {
  create(data: { email: string; password: string }) {
    return db.users.insert(data);
  }
}

class WelcomeEmailer {
  send(email: string) {
    return smtpClient.send({ to: email, subject: 'Bienvenido', body: 'Hola, tu cuenta fue creada' });
  }
}

class UserService {
  constructor(
    private repo: UserRepository,
    private emailer: WelcomeEmailer,
  ) {}

  async createUser(data: { email: string; password: string }) {
    validateNewUser(data);
    const user = await this.repo.create(data);
    await this.emailer.send(data.email);
    return user;
  }
}
```

## O — Open/Closed (abierto/cerrado)

Un módulo debería estar abierto a extensión pero cerrado a modificación: agregar comportamiento nuevo no debería requerir editar código que ya funciona y ya está probado.

```ts
// ANTES: cada método de pago nuevo obliga a tocar este switch
function calculateFee(method: 'card' | 'paypal' | 'crypto', amount: number): number {
  switch (method) {
    case 'card':
      return amount * 0.029 + 0.3;
    case 'paypal':
      return amount * 0.034 + 0.49;
    case 'crypto':
      return amount * 0.01;
    default:
      throw new Error(`Método desconocido: ${method}`);
  }
}
```

```ts
// DESPUÉS: agregar un método nuevo es agregar una entrada, no tocar la función
type FeeStrategy = (amount: number) => number;

const feeStrategies: Record<string, FeeStrategy> = {
  card: (amount) => amount * 0.029 + 0.3,
  paypal: (amount) => amount * 0.034 + 0.49,
  crypto: (amount) => amount * 0.01,
};

function calculateFee(method: string, amount: number): number {
  const strategy = feeStrategies[method];
  if (!strategy) throw new Error(`Método desconocido: ${method}`);
  return strategy(amount);
}

// agregar Apple Pay no toca calculateFee:
feeStrategies.applepay = (amount) => amount * 0.025;
```

## L — Liskov Substitution (sustitución de Liskov)

Cualquier código que use un tipo base debería poder usar una subclase sin darse cuenta ni romperse. El ejemplo clásico es el cuadrado que "hereda" de rectángulo:

```ts
// ANTES: Square rompe el contrato de Rectangle
class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(w: number) {
    this.width = w;
    this.height = w; // efecto secundario inesperado
  }
  setHeight(h: number) {
    this.width = h;
    this.height = h;
  }
}

function resizeAndCheck(rect: Rectangle) {
  rect.setWidth(4);
  rect.setHeight(5);
  console.log(rect.area()); // se espera 20, Square da 25
}
```

Matemáticamente un cuadrado "es un" rectángulo, pero el *comportamiento* de `Rectangle` (ancho y alto independientes) no se sostiene en `Square`. La jerarquía está mal elegida.

```ts
// DESPUÉS: no forzar una relación "es un" que no se cumple en comportamiento
interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  area() { return this.width * this.height; }
}

class Square implements Shape {
  constructor(private side: number) {}
  area() { return this.side ** 2; }
}
```

## I — Interface Segregation (segregación de interfaces)

Es mejor tener varias interfaces chicas y específicas que una gigante que obliga a implementar métodos que no se usan.

```ts
// ANTES: interfaz gorda, casi ningún worker necesita todo
interface Worker {
  code(): void;
  writeDocs(): void;
  attendStandup(): void;
  deployToProd(): void;
}

class JuniorDev implements Worker {
  code() { /* ... */ }
  writeDocs() { throw new Error('No aplica'); }
  attendStandup() { /* ... */ }
  deployToProd() { throw new Error('No tiene permisos'); }
}
```

```ts
// DESPUÉS: interfaces chicas, cada clase implementa solo lo que le corresponde
interface Coder { code(): void; }
interface DocWriter { writeDocs(): void; }
interface StandupAttendee { attendStandup(): void; }
interface Deployer { deployToProd(): void; }

class JuniorDev implements Coder, StandupAttendee {
  code() { /* ... */ }
  attendStandup() { /* ... */ }
}

class TechLead implements Coder, DocWriter, StandupAttendee, Deployer {
  code() { /* ... */ }
  writeDocs() { /* ... */ }
  attendStandup() { /* ... */ }
  deployToProd() { /* ... */ }
}
```

En la práctica JS/TS, esto se traduce casi siempre a "no le pases a una función más dependencias de las que necesita" — un `type Props` gigante para un componente que solo usa tres campos es el mismo problema.

## D — Dependency Inversion (inversión de dependencias)

Los módulos de alto nivel no deberían depender de módulos de bajo nivel concretos; ambos deberían depender de abstracciones.

```ts
// ANTES: OrderService depende directamente de console y de un logger concreto
class OrderService {
  createOrder(id: string) {
    console.log(`[orders] creando orden ${id}`);
    // ...
  }
}
```

Si mañana el logging pasa a un servicio externo (Datadog, Sentry), hay que tocar cada clase que llama a `console.log` directamente.

```ts
// DESPUÉS: OrderService depende de una abstracción, no de una implementación
interface Logger {
  info(message: string): void;
  error(message: string, err?: unknown): void;
}

class ConsoleLogger implements Logger {
  info(message: string) { console.log(message); }
  error(message: string, err?: unknown) { console.error(message, err); }
}

class OrderService {
  constructor(private logger: Logger) {}

  createOrder(id: string) {
    this.logger.info(`[orders] creando orden ${id}`);
    // ...
  }
}

// en producción se puede inyectar un DatadogLogger sin tocar OrderService
const service = new OrderService(new ConsoleLogger());
```

## Cuándo NO aplica (o aplica distinto)

SOLID nació para OOP clásico con jerarquías de clases profundas — el mundo de Java y C# de los 2000s. JS/TS es un lenguaje multiparadigma donde funciones puras, closures y objetos literales resuelven la mayoría de estos problemas sin necesidad de clases:

- **S y D se aplican naturalmente con funciones y módulos** — no hace falta una clase para tener "una responsabilidad" o "depender de una abstracción" (un parámetro `logger: Logger` funciona igual en una función suelta).
- **L pierde relevancia** cuando no hay herencia — si preferís composición (ver `composicion-sobre-herencia`), el problema de sustituir subclases directamente no aparece.
- **I es fácil de sobre-aplicar**: crear una interfaz por cada método en un proyecto chico es ceremonia sin beneficio. Tiene sentido cuando varios consumidores realmente necesitan subconjuntos distintos.
- Aplicar los cinco letra por letra en un script de 40 líneas es sobre-ingeniería. SOLID ayuda cuando el sistema va a crecer y va a tener múltiples implementaciones o consumidores — no es una checklist obligatoria para cada archivo.

## Consideraciones

- SOLID es una guía para reducir el costo de cambio, no un objetivo en sí mismo. Si aplicarlo agrega indirección sin que nadie vaya a aprovecharla, es sobre-ingeniería (ver `deuda-tecnica` y `dry-kiss-yagni`).
- En proyectos frontend, O/C y D se ven más en hooks y factories que en clases: un objeto de estrategias o una función que recibe una dependencia inyectada cumplen el mismo rol que una interfaz en Java.
- Empezar simple y refactorizar hacia SOLID cuando aparece la segunda o tercera variante de un comportamiento suele ser mejor que diseñarlo todo por adelantado.
