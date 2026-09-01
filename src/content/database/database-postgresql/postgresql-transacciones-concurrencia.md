---
title: Transacciones, aislamiento y concurrencia en PostgreSQL
description: Mantener invariantes cuando varias solicitudes escriben al mismo tiempo mediante transacciones, locks y niveles de aislamiento.
type: guides
order: 2
tags: [postgresql, transactions, isolation, locks, mvcc]
related:
  - database/database-modelado/database-modelado-relacional
  - backend/backend-fundamentos/backend-idempotencia-cache
updatedAt: 2026-08-28
---

Una **transacción** agrupa operaciones como una sola unidad lógica. Debe completar todas o revertir todas, pero eso no significa que cualquier secuencia sea segura ante concurrencia.

## Referencia rápida

| Problema                             | Herramienta inicial                  |
| ------------------------------------ | ------------------------------------ |
| varios cambios forman una unidad     | transacción                          |
| dos escritores compiten por una fila | actualización atómica o `FOR UPDATE` |
| edición humana prolongada            | versión optimista, no lock abierto   |
| conflicto raro entre rangos o filas  | `SERIALIZABLE` con reintento         |
| efecto externo después del commit    | transactional outbox                 |
| repetir una petición                 | clave de idempotencia                |

```sql
BEGIN;

SELECT stock
FROM products
WHERE id = $1
FOR UPDATE;

UPDATE products
SET stock = stock - $2
WHERE id = $1 AND stock >= $2;

INSERT INTO order_items (order_id, product_id, quantity)
VALUES ($3, $1, $2);

COMMIT;
```

`FOR UPDATE` bloquea la fila seleccionada para escrituras incompatibles hasta terminar la transacción. La condición `stock >= $2` sigue siendo una defensa importante: una actualización atómica suele ser más segura que leer, calcular en JavaScript y escribir después.

## ACID y MVCC

**ACID** resume atomicidad, consistencia, aislamiento y durabilidad. PostgreSQL usa **MVCC** (_Multi-Version Concurrency Control_ o control de concurrencia multiversión): cada transacción observa una versión coherente de las filas, lo que reduce bloqueos entre lecturas y escrituras.

`UPDATE` y `DELETE` no eliminan inmediatamente todas las versiones antiguas. `VACUUM` permite reutilizar espacio y evita problemas de identificadores de transacción. Por eso una transacción que permanece abierta durante mucho tiempo también puede dificultar mantenimiento.

## Niveles de aislamiento

| Nivel             | Idea práctica                                                               |
| ----------------- | --------------------------------------------------------------------------- |
| `READ COMMITTED`  | Cada sentencia ve datos confirmados al comenzar; es el valor predeterminado |
| `REPEATABLE READ` | La transacción conserva una instantánea estable                             |
| `SERIALIZABLE`    | El resultado equivale a una ejecución serial, pero puede exigir reintentos  |

PostgreSQL trata `READ UNCOMMITTED` como `READ COMMITTED`. `REPEATABLE READ` evita cambios de la instantánea durante la transacción, pero no sustituye todas las reglas de negocio. `SERIALIZABLE` detecta dependencias peligrosas y puede abortar una transacción para preservar el resultado serial.

En `SERIALIZABLE`, un fallo por serialización es un resultado esperado de contención, no necesariamente un error del servidor. La aplicación debe reintentar la transacción completa con límite y espera breve.

## Anomalías que debes reconocer

- **actualización perdida:** dos procesos leen el mismo valor y uno sobrescribe al otro;
- **lectura no repetible:** la misma fila cambia entre dos lecturas;
- **phantom:** una condición devuelve un conjunto diferente por inserciones concurrentes;
- **write skew:** dos transacciones modifican filas distintas basándose en una regla conjunta y ambas la rompen.

Una restricción o actualización atómica suele ser más robusta que “consultar y luego confiar”. Para reglas entre varias filas, estudia el nivel de aislamiento, locks o un modelo que permita expresarlas como constraint.

## Locks de fila

| Forma               | Intención aproximada                                           |
| ------------------- | -------------------------------------------------------------- |
| `FOR UPDATE`        | bloquear filas que se modificarán                              |
| `FOR NO KEY UPDATE` | modificar sin cambiar claves referenciables                    |
| `FOR SHARE`         | permitir lecturas compartidas y bloquear cambios incompatibles |
| `FOR KEY SHARE`     | proteger claves ante eliminación o cambio                      |

`NOWAIT` falla inmediatamente si la fila está bloqueada. `SKIP LOCKED` salta filas ocupadas y es útil para colas de trabajo, pero produce una vista deliberadamente inconsistente y no corresponde a cualquier listado.

```sql
SELECT id
FROM jobs
WHERE status = 'pending'
ORDER BY created_at
FOR UPDATE SKIP LOCKED
LIMIT 10;
```

Después, el worker marca esos jobs dentro de la misma transacción para que otro worker no los tome.

## Savepoints

Un **savepoint** permite revertir una parte sin descartar toda la transacción:

```sql
BEGIN;
INSERT INTO imports (source) VALUES ('catalog.csv');
SAVEPOINT before_optional_metadata;

-- Si esta parte falla:
ROLLBACK TO SAVEPOINT before_optional_metadata;

COMMIT;
```

No convierte una transacción enorme en una buena idea. Sirve para unidades parciales controladas, especialmente cuando una biblioteca implementa transacciones anidadas mediante savepoints.

## Mantener transacciones cortas

No hagas llamadas HTTP, envíes correos ni esperes interacción humana dentro de una transacción. Los locks retenidos aumentan contención y pueden formar **deadlocks** —esperas circulares—. Para efectos externos utiliza un patrón como **transactional outbox**: confirma el cambio y un evento pendiente en la misma transacción; un worker procesa el evento después.

PostgreSQL detecta deadlocks y cancela una de las transacciones. Reduce el riesgo adquiriendo recursos en un orden constante, actualizando solo lo necesario y evitando transacciones largas. Registra el contexto sin exponer datos sensibles y reintenta únicamente si la operación completa es segura.

## Caso de uso: transferencia

Una transferencia exige debitar, acreditar y registrar el movimiento en una misma transacción. Además necesita:

- restricciones para impedir saldos inválidos;
- un orden constante al bloquear cuentas, reduciendo deadlocks;
- una clave de idempotencia para no repetir la operación;
- registro auditable y reintentos controlados.

## Patrón outbox resumido

```sql
BEGIN;

UPDATE orders SET status = 'paid' WHERE id = $1;

INSERT INTO outbox_events (event_id, kind, payload)
VALUES ($2, 'order.paid', $3::jsonb);

COMMIT;
```

Un worker publica eventos pendientes y marca su entrega. Como el consumidor también puede recibir duplicados, debe usar `event_id` para ser idempotente. La outbox evita el fallo “base confirmada, mensaje no enviado”, pero exige monitoreo, reintentos y limpieza.

## Lista de comprobación

- la transacción representa una unidad de negocio;
- todas las sentencias usan la misma conexión;
- no hay red ni interacción externa dentro del bloque;
- locks adquiridos en orden consistente;
- timeout y rollback en cualquier error;
- reintento completo y acotado para errores transitorios reconocidos;
- idempotencia para solicitudes y eventos repetibles.

## Referencias

- [PostgreSQL: aislamiento de transacciones](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL: bloqueo explícito](https://www.postgresql.org/docs/current/explicit-locking.html)
