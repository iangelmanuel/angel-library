---
title: Alta cohesión, bajo acoplamiento
description: Qué tan relacionadas están las responsabilidades dentro de un módulo, y qué tan dependiente es un módulo de los detalles internos de otro.
type: practices
order: 5
practice: Agrupar lo que cambia junto, y comunicar módulos distintos a través de contratos chicos en vez de conocimiento compartido.
why: Predice mejor qué tan doloroso va a ser cambiar el código después que cualquier métrica de líneas o complejidad ciclomática.
related:
  - architecture/principios/dry-kiss-yagni
  - architecture/principios/composicion-sobre-herencia
updatedAt: 2026-08-17
---

Cohesión y acoplamiento son dos caras de la misma pregunta: ¿qué tan fácil es cambiar una parte del sistema sin romper otra? Son más viejos que SOLID (vienen de Larry Constantine, años 70) y en la práctica predicen mejor el dolor de mantenimiento que casi cualquier métrica automatizada.

## Cohesión: qué tan relacionado está lo que vive junto

Alta cohesión significa que todo lo que está en un mismo módulo o archivo pertenece junto — todas sus partes colaboran para una misma responsabilidad. Baja cohesión significa que un módulo mezcla cosas que no tienen razón de estar en el mismo lugar.

```ts
// BAJA COHESIÓN: users.ts mezcla persistencia de usuarios con envío de emails
// src/users.ts
export async function createUser(data: NewUser) {
  const user = await db.users.insert(data);

  await smtpClient.send({
    to: user.email,
    subject: 'Bienvenido',
    body: 'Gracias por registrarte',
  });

  await analytics.track('user_created', { userId: user.id });

  return user;
}

export function getUserById(id: string) {
  return db.users.findById(id);
}

export function updateUserEmail(id: string, email: string) {
  return db.users.update(id, { email });
}
```

`users.ts` ahora tiene tres razones para cambiar: la lógica de persistencia, el proveedor de email, y el sistema de analytics. Un cambio en la plantilla del email de bienvenida obliga a tocar el mismo archivo que maneja el modelo de usuario.

```ts
// ALTA COHESIÓN: cada módulo tiene una sola responsabilidad
// src/users/repository.ts
export function createUser(data: NewUser) {
  return db.users.insert(data);
}
export function getUserById(id: string) {
  return db.users.findById(id);
}
export function updateUserEmail(id: string, email: string) {
  return db.users.update(id, { email });
}

// src/users/onboarding.ts
import { createUser } from './repository';
import { sendWelcomeEmail } from '../email/welcome';
import { trackEvent } from '../analytics';

export async function registerUser(data: NewUser) {
  const user = await createUser(data);
  await sendWelcomeEmail(user.email);
  await trackEvent('user_created', { userId: user.id });
  return user;
}
```

`repository.ts` solo cambia si cambia cómo se persisten usuarios. `onboarding.ts` solo cambia si cambia el flujo de alta. Cada archivo tiene una sola razón para cambiar — cohesión alta.

## Acoplamiento: qué tan dependiente es un módulo de los detalles de otro

Bajo acoplamiento significa que un módulo puede cambiar su implementación interna sin que otros módulos se enteren, siempre que el contrato (su interfaz pública) se mantenga. Alto acoplamiento significa que un módulo conoce y depende de los detalles internos de otro.

```ts
// ALTO ACOPLAMIENTO: onboarding conoce la estructura interna de la tabla de email logs
export async function registerUser(data: NewUser) {
  const user = await createUser(data);

  await db.emailLogs.insert({
    to: user.email,
    template: 'welcome',
    status: 'pending',
    provider: 'sendgrid',
  });
  await sendgridClient.send({ to: user.email, templateId: 'd-abc123' });

  return user;
}
```

Si mañana se cambia de SendGrid a otro proveedor, o cambia el esquema de `emailLogs`, hay que tocar `onboarding.ts` — un módulo que conceptualmente no debería saber nada de proveedores de email ni de esquemas de logging.

```ts
// BAJO ACOPLAMIENTO: onboarding solo conoce una función, no los detalles de cómo se envía
import { sendWelcomeEmail } from '../email/welcome';

export async function registerUser(data: NewUser) {
  const user = await createUser(data);
  await sendWelcomeEmail(user.email); // no le importa si es SendGrid, Postmark o SMTP
  return user;
}
```

Cambiar de proveedor de email ahora es un cambio contenido dentro de `email/welcome.ts` — `onboarding.ts` no se entera.

## Por qué esto predice el dolor mejor que las métricas de código

Un archivo de 400 líneas con alta cohesión (todo relacionado a una sola responsabilidad) es más fácil de mantener que uno de 100 líneas con baja cohesión (tres responsabilidades sin relación mezcladas). La complejidad ciclomática mide ramas de un algoritmo, no si esas ramas *pertenecen* juntas. Las líneas de código no distinguen entre "código denso pero enfocado" y "código disperso y mezclado".

Lo que sí predice el dolor es cuántos módulos hay que tocar para hacer un cambio de negocio y cuántos módulos *no relacionados* se rompen cuando cambia uno. Eso revela la cohesión (¿lo relacionado vive junto?) y el acoplamiento (¿lo no relacionado depende entre sí?).

## Cuándo el bajo acoplamiento se lleva al extremo

Desacoplar todo a través de eventos, interfaces e inyección de dependencias tiene un costo: más indirección, más archivos para seguir el flujo de un caso simple. Un proyecto chico con dos desarrolladores no necesita un bus de eventos para desacoplar `onboarding` de `email` — una función importada directamente ya es suficientemente bajo acoplamiento. El desacoplamiento extremo (todo a través de interfaces, todo a través de eventos) tiene sentido cuando hay múltiples equipos o múltiples implementaciones reales, no como default.

## Consideraciones

- Cohesión y acoplamiento están relacionados pero no son lo mismo: se puede tener alta cohesión y alto acoplamiento a la vez (un módulo bien enfocado que depende de los detalles internos de otro).
- La señal más simple de baja cohesión: si para explicar qué hace un archivo necesitas usar la palabra "y" varias veces ("maneja usuarios y también manda emails y también trackea eventos"), probablemente son varios módulos.
- La señal más simple de alto acoplamiento: cambiar un detalle interno de un módulo (una tabla, un formato de respuesta) obliga a tocar archivos que no deberían saber que ese detalle existe.
