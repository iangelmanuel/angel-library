---
title: Conexiones, pooling y operación confiable
description: Administrar conexiones, transacciones, timeouts, réplicas y fallos para que la base no se convierta en el cuello de botella del servicio.
category: database
stack: database-operacion
order: 2
tags: [database, pooling, reliability, timeout, operations]
related:
  - guides/database-migraciones-backups
  - guides/postgresql-transacciones-concurrencia
  - guides/performance-backend-database
updatedAt: 2026-08-25
---

Una conexión de base de datos consume memoria y estado tanto en la aplicación como en el gestor. Abrir una por consulta es costoso; abrir demasiadas al mismo tiempo puede derribar una base saludable. Un **pool** conserva un conjunto limitado y presta conexiones durante una operación.

## Modelo mental

```text
requests de aplicación
  → cola corta del pool
  → conexiones disponibles
  → base de datos
```

El pool no crea capacidad. Si cien operaciones esperan diez conexiones lentas, crecerlo puede aumentar competencia y empeorar todo. Mide tiempo de adquisición, duración de query y saturación del servidor.

## Ciclo correcto

```ts
const client = await pool.connect();

try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, from]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, to]);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

La misma conexión debe ejecutar toda la transacción. `finally` la devuelve incluso al fallar. Los placeholders parametrizados evitan interpolar valores como SQL.

## Timeouts y cancelación

Define límites distintos:

- adquirir conexión del pool;
- ejecutar statement;
- permanecer inactivo dentro de una transacción;
- tiempo total del caso de uso.

Una query cancelada puede dejar una transacción abierta si la aplicación no hace rollback. Nunca mantengas una transacción mientras esperas interacción humana o una API lenta.

## Serverless y proxies

Muchas instancias efímeras pueden multiplicar pools. Un proxy de conexiones o driver diseñado para la plataforma ayuda a multiplexar, pero no elimina transacciones largas ni consultas deficientes. Calcula conexiones máximas considerando todas las instancias, jobs, migraciones y herramientas administrativas.

## Réplicas y consistencia

Una réplica de lectura distribuye consultas, pero puede tener retraso. Después de escribir, leer inmediatamente desde réplica podría devolver el estado anterior. Define qué operaciones toleran **eventual consistency** y cuáles deben leer del primario.

## Señales operativas

Observa conexiones activas/en espera, lock waits, queries lentas, cache hit, tamaño, replicación y errores. Un health check no debería ejecutar una consulta pesada ni declarar saludable una instancia incapaz de adquirir conexión.

## Lista de comprobación

- pool único y reutilizado por instancia;
- límite total acorde a la base;
- release en `finally`;
- statements parametrizados;
- transacciones cortas;
- timeout y logs sin datos sensibles;
- backup restaurado en prueba, no solo “configurado”.

