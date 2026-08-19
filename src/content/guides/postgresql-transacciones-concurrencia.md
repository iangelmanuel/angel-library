---
title: Transacciones, aislamiento y concurrencia en PostgreSQL
description: Mantener invariantes cuando varias solicitudes escriben al mismo tiempo mediante transacciones, locks y niveles de aislamiento.
category: database
stack: database-postgresql
order: 1
tags: [postgresql, transactions, isolation, locks, mvcc]
related:
  - guides/database-modelado-relacional
  - guides/backend-idempotencia-cache
updatedAt: 2026-08-19
---

Una **transacción** agrupa operaciones como una sola unidad lógica. Debe completar todas o revertir todas, pero eso no significa que cualquier secuencia sea segura ante concurrencia.

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

**ACID** resume atomicidad, consistencia, aislamiento y durabilidad. PostgreSQL usa **MVCC** (*Multi-Version Concurrency Control* o control de concurrencia multiversión): cada transacción observa una versión coherente de las filas, lo que reduce bloqueos entre lecturas y escrituras.

## Niveles de aislamiento

| Nivel | Idea práctica |
| --- | --- |
| `READ COMMITTED` | Cada sentencia ve datos confirmados al comenzar; es el valor predeterminado |
| `REPEATABLE READ` | La transacción conserva una instantánea estable |
| `SERIALIZABLE` | El resultado equivale a una ejecución serial, pero puede exigir reintentos |

En `SERIALIZABLE`, un fallo por serialización es un resultado esperado de contención, no necesariamente un error del servidor. La aplicación debe reintentar la transacción completa con límite y espera breve.

## Mantener transacciones cortas

No hagas llamadas HTTP, envíes correos ni esperes interacción humana dentro de una transacción. Los locks retenidos aumentan contención y pueden formar **deadlocks** —esperas circulares—. Para efectos externos utiliza un patrón como **transactional outbox**: confirma el cambio y un evento pendiente en la misma transacción; un worker procesa el evento después.

## Caso de uso: transferencia

Una transferencia exige debitar, acreditar y registrar el movimiento en una misma transacción. Además necesita:

- restricciones para impedir saldos inválidos;
- un orden constante al bloquear cuentas, reduciendo deadlocks;
- una clave de idempotencia para no repetir la operación;
- registro auditable y reintentos controlados.

## Referencias

- [PostgreSQL: aislamiento de transacciones](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL: bloqueo explícito](https://www.postgresql.org/docs/current/explicit-locking.html)

