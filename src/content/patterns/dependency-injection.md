---
title: Inyección de dependencias
description: Recibir las dependencias de un módulo desde afuera en vez de construirlas adentro, para poder reemplazarlas sin tocar el código que las usa.
category: architecture
stack: patrones-arquitectonicos
order: 5
tags: [arquitectura, patrones-arquitectonicos, dependency-injection, testing]
problem: Un módulo que construye sus propias dependencias (`new PrismaClient()` dentro de una función) no se puede reemplazar por un doble en las pruebas ni por otra implementación en otro contexto.
related: [patterns/hexagonal-architecture, patterns/repository-pattern]
updatedAt: 2026-08-17
---

## El problema

```ts title="antes: dependencia construida adentro"
export async function getActiveUsers() {
  const prisma = new PrismaClient(); // construida aquí adentro
  return prisma.user.findMany({ where: { active: true } });
}
```

Esta función no se puede testear sin una base de datos real conectada. No hay forma de "meterle" otra implementación — la dependencia está hardcodeada.

## La solución: recibirla de afuera

```ts title="después: constructor injection"
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  getActiveUsers() {
    return this.repo.findActiveUsers();
  }
}

// en producción
const service = new UserService(new PrismaUserRepository(prisma));

// en un test
const service = new UserService(new InMemoryUserRepository([user1, user2]));
```

O más simple todavía, inyección por parámetro de función, sin siquiera una clase:

```ts title="alternativa: inyección por parámetro"
export function getActiveUsers(repo: UserRepository) {
  return repo.findActiveUsers();
}

// test
getActiveUsers(new InMemoryUserRepository([user1, user2]));
```

En ambos casos, `UserService` (o `getActiveUsers`) ya no decide qué implementación de `UserRepository` usar — solo declara que necesita una. Quien lo llama decide cuál.

## No hace falta un framework de DI

En Java o .NET, la inyección de dependencias casi siempre viene acompañada de un contenedor de DI pesado (Spring, .NET DI container) que resuelve el grafo de dependencias automáticamente. En JS/TS, para la mayoría de proyectos web, **con pasar la dependencia como argumento alcanza**. No hace falta ningún framework para tener los beneficios del patrón: testeable, reemplazable, desacoplado.

Existen contenedores de DI para TypeScript (`tsyringe`, `InversifyJS`) que automatizan la construcción del grafo de dependencias con decoradores. Son útiles en backends grandes con muchas capas y dependencias cruzadas, donde armar el grafo a mano se vuelve tedioso. Para empezar, o para la mayoría de proyectos, no son necesarios — constructor injection simple cubre el caso de uso real.
