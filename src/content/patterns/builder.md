---
title: Builder
description: Construir un objeto complejo paso a paso, encadenando llamadas, en vez directamente función con diez parámetros.
category: architecture
stack: patrones-diseno
order: 3
tags: [arquitectura, patrones-diseno, builder]
problem: Construir un objeto con muchos parámetros opcionales termina en una función con una lista interminable de argumentos posicionales.
updatedAt: 2026-08-17
---

## Problema

Cuando construir algo requiere combinar varias partes opcionales — columnas, condiciones, headers, filtros — pasarlas todas como argumentos directamente función se vuelve ilegible rápido. Builder las va acumulando paso a paso y arma el resultado final al llamar `.build()`.

## Ejemplo: query builder encadenable

```ts title="lib/query-builder.ts"
interface QueryBuilder {
  select(...cols: string[]): QueryBuilder;
  from(table: string): QueryBuilder;
  where(col: string, value: unknown): QueryBuilder;
  build(): { sql: string; params: unknown[] };
}

function createQueryBuilder(): QueryBuilder {
  const state = { cols: [] as string[], table: '', conditions: [] as [string, unknown][] };

  const builder: QueryBuilder = {
    select(...cols) {
      state.cols.push(...cols);
      return builder;
    },
    from(table) {
      state.table = table;
      return builder;
    },
    where(col, value) {
      state.conditions.push([col, value]);
      return builder;
    },
    build() {
      const where = state.conditions.map(([col]) => `${col} = ?`).join(' AND ');
      const sql = `SELECT ${state.cols.join(', ')} FROM ${state.table}` + (where ? ` WHERE ${where}` : '');
      return { sql, params: state.conditions.map(([, value]) => value) };
    },
  };

  return builder;
}

const { sql, params } = createQueryBuilder()
  .select('id', 'name')
  .from('users')
  .where('active', true)
  .build();
```

Cada método devuelve el propio builder, lo que permite encadenar. El objeto solo toma forma final en `.build()` — mientras tanto, el estado intermedio queda oculto en el closure.

El mismo patrón se ve en librerías reales: `Drizzle`, `Kysely` y `Knex` construyen queries así; un builder de request HTTP (`.setHeader().setBody().send()`) sigue la misma idea.

## Cuándo un objeto de opciones alcanza

Si los "parámetros" son independientes entre sí — no hay pasos condicionales ni orden que importe — un objeto de opciones tipado resuelve lo mismo sin necesitar el patrón completo:

```ts
interface CrearUsuarioOpciones {
  nombre: string;
  email: string;
  rol?: 'admin' | 'user';
  enviarBienvenida?: boolean;
}

function crearUsuario(opciones: CrearUsuarioOpciones) {
  const { rol = 'user', enviarBienvenida = true, ...datos } = opciones;
  // ...
}

crearUsuario({ nombre: 'Ana', email: 'ana@mail.com', rol: 'admin' });
```

## Cuándo Builder vale la pena

Cuando hay pasos de construcción condicionales o secuenciales — agregar una condición `WHERE` solo si el filtro está activo, encadenar `.paginate()` después de `.where()` — no solo "muchos parámetros". Si un objeto de opciones cubre el caso, usalo: es más simple y más fácil de tipar.
