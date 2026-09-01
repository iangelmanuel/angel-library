---
title: Repository pattern
description: Esconder las consultas a la base de datos detrás de una interfaz orientada al dominio, para que el resto de la aplicación no sepa cómo se guardan los datos.
type: patterns
order: 4
tags: [arquitectura, patrones-arquitectonicos, repository, orm]
problem: La lógica de negocio termina llena de queries SQL o llamadas a un ORM específico, en vez de hablar en términos del dominio.
related:
  [
    architecture/patrones-arquitectonicos/hexagonal-architecture,
    architecture/patrones-arquitectonicos/layered-architecture
  ]
updatedAt: 2026-08-17
---

## Idea

El resto de la aplicación no debería saber ni necesitar saber si los datos vienen de Prisma, de SQL directo o de una API externa. Solo debería conocer una interfaz en términos del dominio:

```ts title="repositories/user-repository.ts (interfaz)"
export interface UserRepository {
  findActiveUsers(): Promise<User[]>
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}
```

`findActiveUsers()`, no `SELECT * FROM users WHERE active = true`. La interfaz habla el lenguaje del negocio, no el lenguaje de la base de datos.

## Una implementación concreta

```ts title="repositories/prisma-user-repository.ts"
import type { PrismaClient } from "@prisma/client"
import type { UserRepository } from "./user-repository"

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findActiveUsers() {
    return this.prisma.user.findMany({ where: { active: true } })
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async save(user: User) {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user
    })
  }
}
```

El service que usa este repositorio solo conoce `UserRepository`, no `PrismaUserRepository`:

```ts title="services/user-service.ts"
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  listActive() {
    return this.repo.findActiveUsers()
  }
}
```

## Qué compra esto

- **Cambiar de ORM** (Prisma → Drizzle, por ejemplo) significa escribir una nueva clase que implemente `UserRepository` — cero cambios en services.
- **Testear sin base de datos real** — un `InMemoryUserRepository` que implemente la misma interfaz sirve para tests rápidos y deterministas.

Este patrón es, en términos de arquitectura hexagonal, un puerto (`UserRepository`) con sus adaptadores (`PrismaUserRepository`, `InMemoryUserRepository`) — ver [Arquitectura hexagonal](/architecture/patrones-arquitectonicos/hexagonal-architecture) para el concepto general de puertos y adaptadores.

## Cuándo NO vale la pena

En un proyecto chico donde nunca vas a cambiar de ORM ni necesitas testear sin DB, el repository es una capa de indirección que solo agrega archivos: una interfaz, una implementación, y el mismo código que hubieras escrito llamando a Prisma directo desde el service. Si esa flexibilidad nunca se va a usar, no está agregando valor real — solo ceremonial.
