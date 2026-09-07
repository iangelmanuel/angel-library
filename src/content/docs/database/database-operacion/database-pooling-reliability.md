---
title: Conexiones, pooling y operación confiable
description: Administrar conexiones, transacciones, timeouts, réplicas y fallos para que la base no se convierta en el cuello de botella del servicio.
type: guides
order: 2
tags: [database, pooling, reliability, timeout, operations]
related:
  - database/database-operacion/database-migraciones-backups
  - database/database-postgresql/postgresql-transacciones-concurrencia
  - performance/performance-operacion/performance-backend-database
updatedAt: 2026-08-28
---

Una conexión de base de datos consume memoria y estado tanto en la aplicación como en el gestor. Abrir una por consulta es costoso; abrir demasiadas al mismo tiempo puede derribar una base saludable. Un **pool** conserva un conjunto limitado y presta conexiones durante una operación.

## Referencia rápida

| Síntoma                   | Primera comprobación                            |
| ------------------------- | ----------------------------------------------- |
| espera antes de consultar | tiempo para adquirir conexión y cola del pool   |
| demasiadas conexiones     | pools × instancias + jobs + administración      |
| `idle in transaction`     | código que no hizo commit/rollback o espera red |
| base con CPU alta         | consultas, planes, N+1 y concurrencia real      |
| timeout intermitente      | separar adquisición, ejecución y tiempo total   |
| lectura antigua           | retraso de réplica y enrutamiento               |

## Modelo mental

```text
requests de aplicación
  → cola corta del pool
  → conexiones disponibles
  → base de datos
```

El pool no crea capacidad. Si cien operaciones esperan diez conexiones lentas, crecerlo puede aumentar competencia y empeorar todo. Mide tiempo de adquisición, duración de query y saturación del servidor.

## Dimensionar sin una fórmula mágica

```text
conexiones potenciales = pool por instancia × instancias máximas
                       + workers + migraciones + administración
```

Reserva margen para failover, consola y tareas operativas. Comienza pequeño, ejecuta pruebas de carga y observa CPU, I/O, locks y tiempo de cola. Más conexiones ayudan solo mientras el servidor puede ejecutar más trabajo útil en paralelo.

## Ciclo correcto

```ts
const client = await pool.connect()

try {
  await client.query("BEGIN")
  await client.query(
    "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
    [amount, from]
  )
  await client.query(
    "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
    [amount, to]
  )
  await client.query("COMMIT")
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  client.release()
}
```

La misma conexión debe ejecutar toda la transacción. `finally` la devuelve incluso al fallar. Los placeholders parametrizados evitan interpolar valores como SQL.

Configura un nombre de aplicación cuando el driver lo permita. Identificar `api`, `worker` o `migration` facilita encontrar quién consume conexiones.

## Timeouts y cancelación

Define límites distintos:

- adquirir conexión del pool;
- ejecutar statement;
- permanecer inactivo dentro de una transacción;
- tiempo total del caso de uso.

Una query cancelada puede dejar una transacción abierta si la aplicación no hace rollback. Nunca mantengas una transacción mientras esperas interacción humana o una API lenta.

La cancelación de la solicitud HTTP no siempre cancela automáticamente la consulta. Propaga una señal cuando el driver lo soporte y limpia el estado de la conexión antes de devolverla al pool.

## Reintentos y backpressure

**Backpressure** significa reducir o rechazar trabajo cuando el sistema no puede procesarlo a tiempo. Una cola infinita convierte saturación en latencia y memoria agotada.

- limita la espera del pool;
- rechaza o degrada solicitudes no esenciales;
- aplica concurrencia máxima en workers;
- reintenta solo fallos transitorios reconocidos;
- usa espera exponencial con jitter y un límite total;
- conserva idempotencia para no duplicar escrituras.

Si todas las instancias reintentan inmediatamente, producen una tormenta que retrasa la recuperación.

## Serverless y proxies

Muchas instancias efímeras pueden multiplicar pools. Un proxy de conexiones o driver diseñado para la plataforma ayuda a multiplexar, pero no elimina transacciones largas ni consultas deficientes. Calcula conexiones máximas considerando todas las instancias, jobs, migraciones y herramientas administrativas.

Algunos proxies usan pooling por transacción y no conservan estado de sesión entre operaciones. Revisa prepared statements, tablas temporales, `SET` de sesión y locks de sesión. Usa el modo recomendado por el proveedor y prueba las funciones que dependen de afinidad.

## Réplicas y consistencia

Una réplica de lectura distribuye consultas, pero puede tener retraso. Después de escribir, leer inmediatamente desde réplica podría devolver el estado anterior. Define qué operaciones toleran **eventual consistency** y cuáles deben leer del primario.

## Señales operativas

Observa conexiones activas/en espera, lock waits, queries lentas, cache hit, tamaño, replicación y errores. Un health check no debería ejecutar una consulta pesada ni declarar saludable una instancia incapaz de adquirir conexión.

## Evitar N+1 y consultas sin límite

N+1 ocurre cuando una consulta inicial produce N consultas adicionales:

```text
1 consulta para 100 posts + 100 consultas para autores = 101 viajes
```

Resuélvelo con join, carga por lotes (`WHERE id = ANY($1)`), un _data loader_ o una consulta adaptada al contrato. No lo “soluciones” aumentando el pool: solo permite que el patrón ineficiente compita con más intensidad.

Toda lista debe tener límite y orden. Las exportaciones grandes usan streaming, cursores o lotes sin mantener una transacción innecesariamente larga.

## Lista de comprobación

- pool único y reutilizado por instancia;
- límite total acorde a la base;
- release en `finally`;
- statements parametrizados;
- transacciones cortas;
- timeout y logs sin datos sensibles;
- backup restaurado en prueba, no solo “configurado”.
- backpressure y reintentos acotados;
- consultas N+1 detectadas y resultados limitados;
- identidad de aplicación visible en conexiones.
