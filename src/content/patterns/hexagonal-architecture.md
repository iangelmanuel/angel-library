---
title: Arquitectura hexagonal (Ports & Adapters)
description: Aislar el dominio de la infraestructura para que la base de datos, el framework HTTP o el proveedor de email sean detalles intercambiables.
category: architecture
stack: patrones-arquitectonicos
order: 3
tags: [arquitectura, patrones-arquitectonicos, hexagonal, ports-and-adapters, ddd]
problem: La lógica de negocio termina acoplada a detalles de infraestructura (el ORM, el framework HTTP) que deberían poder cambiarse sin tocarla.
related: [patterns/layered-architecture, patterns/repository-pattern, patterns/dependency-injection]
updatedAt: 2026-08-17
---

## Idea central

El dominio (las reglas de negocio) no debería depender de qué base de datos usas, qué framework HTTP expone la API, o qué proveedor manda los emails. Esos son detalles de infraestructura, intercambiables. El dominio no es intercambiable — es la razón de ser de la app.

```text
              ┌── Adapter HTTP (Express, Fastify) ──┐
              │                                      │
Adapter DB ───┤          ┌──────────────┐            ├─── Adapter cola (SQS, BullMQ)
(Prisma, SQL) │          │   DOMINIO    │            │
              └─────────►│  (use cases, │◄───────────┘
                         │   entidades)  │
                         └──────┬───────┘
                                │
                          puertos (interfaces)
                     que el dominio define y controla
```

El dominio vive en el centro y **define** los puertos que necesita. La infraestructura vive afuera e **implementa** esos puertos. La dependencia siempre apunta hacia adentro: infraestructura depende de dominio, nunca al revés.

## Puertos y adaptadores

- **Puerto** — una interfaz que el dominio define, en sus propios términos. Ej: `interface UserRepository { findById(id: string): Promise<User | null> }`.
- **Adaptador** — una implementación concreta de un puerto. Ej: `PrismaUserRepository implements UserRepository`, o `InMemoryUserRepository implements UserRepository` para tests.

El dominio nunca importa `PrismaUserRepository`. Solo conoce `UserRepository`.

## Ejemplo: un caso de uso que no sabe qué ORM existe

```ts title="domain/ports/user-repository.ts"
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

```ts title="domain/use-cases/deactivate-user.ts"
import type { UserRepository } from '../ports/user-repository';

export async function deactivateUser(repo: UserRepository, userId: string) {
  const user = await repo.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  user.deactivate(); // regla de negocio, vive en la entidad
  await repo.save(user);
}
```

El caso de uso recibe el repositorio por parámetro, tipado por la interfaz — no importa `@prisma/client` en ningún lado. Eso permite testearlo así:

```ts title="domain/use-cases/deactivate-user.test.ts"
const repo = new InMemoryUserRepository([existingUser]);

await deactivateUser(repo, existingUser.id);

expect(repo.findById(existingUser.id)).resolves.toMatchObject({ active: false });
```

Sin base de datos real, sin mocks de framework, sin levantar nada — solo el dominio y una implementación en memoria del puerto.

## Cuándo NO usar esto

Es over-engineering para un CRUD chico. Definir puertos, adaptadores y una carpeta `domain/` separada para una app que solo lee y escribe filas sin reglas de negocio reales es puro ceremonial — más archivos, misma funcionalidad.

Vale la pena cuando el dominio tiene reglas que **sobreviven** cambios de infraestructura: lógica que seguiría siendo cierta aunque mañana cambies de Postgres a Mongo, o de REST a gRPC. Si esa lógica no existe o es trivial, layered architecture (ver [Arquitectura en capas](/patterns/layered-architecture)) alcanza y sobra.
