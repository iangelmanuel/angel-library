---
title: Singleton
description: Garantizar una única instancia compartida de algo (una conexión, un cliente) accesible desde cualquier parte del código.
category: architecture
stack: patrones-diseno
order: 2
tags: [arquitectura, patrones-diseno, singleton]
related: [patterns/factory]
problem: Crear una conexión a base de datos o un cliente de Redis nuevo cada vez que se importa el módulo, en vez de reutilizar siempre el mismo.
updatedAt: 2026-08-17
---

## Problema

Algunos recursos (una conexión a base de datos, un cliente de Redis, un pool de workers) deben existir una sola vez por proceso. Crear una instancia nueva en cada import desperdicia conexiones y puede agotar el límite del proveedor.

## El módulo de JS/TS ya es un singleton

Node y los módulos ECMAScript (ESM) almacenan el módulo en caché la primera vez que se importa: se ejecuta una sola vez y todos los `import` posteriores reciben el mismo objeto exportado. No hace falta la ceremonia de una clase con `getInstance()` estático que se ve en lenguajes sin este comportamiento.

```ts title="lib/db.ts"
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();
```

```ts title="lib/redis.ts"
import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });
await client.connect();

export const redis = client;
```

Cualquier archivo que haga `import { db } from '@/lib/db'` recibe la misma instancia, ya conectada. Eso es Singleton, gratis, por cómo funciona el sistema de módulos.

## Cómo se ve en lenguajes sin este cacheo

```ts
// Así se emula el patrón cuando el lenguaje no almacena módulos en caché.
// En JS/TS casi nunca hace falta escribir esto:
class Database {
  private static instance: Database;
  private constructor() {}
  static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }
}
```

Si ves este patrón en un proyecto JS/TS, casi siempre se puede reemplazar por un módulo que exporta la instancia directamente.

## Cuándo NO usarlo (o usarlo con cuidado)

- Estado global compartido dificulta el testing: un mock de `db` en un test puede contaminar otros tests si no se resetea entre corridas.
- Si necesitas instancias configuradas distinto según contexto (una DB en memoria para tests, la real en producción), inyección de dependencias — pasar la instancia como parámetro — es más flexible que un singleton hardcodeado en el módulo.
- En serverless (Lambda, edge functions) el singleton solo "vive" mientras el proceso está caliente: no asumas que sobrevive entre invocaciones frías.
