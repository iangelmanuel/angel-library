---
title: SQL para escribir datos de forma segura
description: Crear, actualizar y eliminar filas con parámetros, RETURNING, upsert, transacciones, lotes e idempotencia sin afectar datos inesperados.
type: guides
order: 2
tags: [sql, insert, update, delete, upsert, transacciones]
related:
  - database/database-sql/database-sql-consultas
  - database/database-postgresql/postgresql-transacciones-concurrencia
  - database/database-operacion/database-migraciones-backups
updatedAt: 2026-08-28
---

Escribir datos exige más cuidado que leerlos: una condición ausente puede modificar toda una tabla y dos solicitudes concurrentes pueden romper una regla que parecía correcta en pruebas locales.

## Referencia rápida

| Necesidad | Forma habitual |
| --- | --- |
| crear una fila | `INSERT ... VALUES ... RETURNING` |
| crear varias | `INSERT ... VALUES (...), (...)` o carga por lotes |
| modificar filas conocidas | `UPDATE ... SET ... WHERE ... RETURNING` |
| eliminar | `DELETE ... WHERE ... RETURNING` |
| crear o actualizar por conflicto | `INSERT ... ON CONFLICT ...` |
| agrupar cambios | `BEGIN ... COMMIT`, con `ROLLBACK` al fallar |

Ejecuta escrituras con una identidad de base que tenga solamente los permisos necesarios. Una cuenta de aplicación no debería poder eliminar esquemas ni administrar roles.

## `INSERT` y valores predeterminados

```sql
INSERT INTO users (email, display_name)
VALUES ($1, $2)
RETURNING id, email, display_name, created_at;
```

Los parámetros `$1` y `$2` separan datos y SQL. `RETURNING` evita una segunda consulta para recuperar valores generados, como el `id` o `created_at`.

```sql
INSERT INTO tags (name)
VALUES ('postgresql'), ('sql'), ('database')
RETURNING id, name;
```

Para importaciones grandes, procesa lotes y usa la herramienta de carga del motor —por ejemplo `COPY` en PostgreSQL—. Una sentencia gigantesca consume memoria, aumenta duración de locks y es difícil de reintentar.

## `UPDATE` con protección

```sql
UPDATE products
SET stock = stock - $1,
    updated_at = now()
WHERE id = $2
  AND stock >= $1
RETURNING id, stock;
```

La operación descuenta y valida en una sola sentencia. Si no retorna filas, el producto no existe o no tiene stock suficiente. Es más segura ante concurrencia que leer stock, restar en JavaScript y escribir el resultado.

Antes de una modificación manual amplia:

```sql
BEGIN;

SELECT id, status
FROM orders
WHERE status = 'expired';

UPDATE orders
SET status = 'cancelled'
WHERE status = 'expired'
RETURNING id;

-- COMMIT después de revisar; ROLLBACK si no coincide.
```

En producción, una transacción abierta mientras una persona revisa puede bloquear otras operaciones. Previsualiza primero y ejecuta luego una sentencia acotada con métricas, límites y plan de reversión.

## `DELETE`, cascadas y eliminación lógica

```sql
DELETE FROM sessions
WHERE expires_at < now()
RETURNING id;
```

`ON DELETE CASCADE` puede eliminar dependencias automáticamente; revisa cuántas filas alcanzará. La eliminación lógica con `deleted_at` conserva datos, pero añade complejidad y no satisface por sí sola una solicitud de borrado de datos personales.

```sql
UPDATE users
SET deleted_at = now(), email = concat('deleted-', id, '@invalid.local')
WHERE id = $1 AND deleted_at IS NULL
RETURNING id;
```

Anonimizar, desactivar y borrar tienen efectos distintos. Define la política del producto y las obligaciones aplicables.

## Upsert con `ON CONFLICT`

Un **upsert** inserta o actualiza cuando existe un conflicto de unicidad.

```sql
INSERT INTO user_preferences (user_id, theme, updated_at)
VALUES ($1, $2, now())
ON CONFLICT (user_id)
DO UPDATE SET
  theme = EXCLUDED.theme,
  updated_at = now()
RETURNING user_id, theme;
```

`EXCLUDED` representa la fila que se intentó insertar. El conflicto debe apoyarse en una restricción o índice único. No uses upsert para ocultar duplicados cuyo significado todavía no está definido.

## Transacciones en código

```ts
const client = await pool.connect();

try {
  await client.query('BEGIN');
  const order = await client.query(
    'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
    [userId],
  );
  await client.query(
    'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
    [order.rows[0].id, productId, quantity],
  );
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

Toda la transacción debe usar la misma conexión. Mantén el bloque corto y no realices llamadas HTTP ni esperes eventos externos dentro de él.

## Idempotencia

Una operación **idempotente** puede repetirse sin duplicar el efecto. Es esencial cuando el cliente reintenta después de perder una respuesta.

```sql
CREATE TABLE payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idempotency_key text NOT NULL UNIQUE,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  status text NOT NULL
);
```

La API guarda la clave en la misma transacción que el resultado. Si llega otra solicitud con la misma clave, devuelve el resultado anterior o detecta que los parámetros no coinciden. Una clave en memoria no protege entre instancias ni después de reiniciar.

## Actualización optimista

Una columna de versión detecta si otra solicitud modificó la fila desde que fue leída:

```sql
UPDATE documents
SET content = $1,
    version = version + 1
WHERE id = $2 AND version = $3
RETURNING id, version;
```

Si no retorna filas, la versión cambió. La aplicación puede pedir al usuario reconciliar, volver a leer o reintentar según el caso. Esto evita sobrescribir silenciosamente cambios ajenos sin bloquear mientras una persona edita.

## Errores que deben tratarse explícitamente

- violación de unicidad: puede ser conflicto de negocio, no error 500;
- violación de FK: referencia inexistente o eliminación restringida;
- timeout o deadlock: la transacción fue cancelada y puede requerir reintento;
- conexión perdida: el resultado de la escritura puede ser incierto;
- cero filas afectadas: condición de negocio no cumplida;
- datos demasiado grandes o tipo inválido: error de validación o contrato.

No reintentes indiscriminadamente cualquier error. Reintenta únicamente operaciones idempotentes y fallos transitorios reconocidos, con límite y espera incremental.

## Lista de comprobación

- parámetros para todos los valores externos;
- `WHERE` revisado en `UPDATE` y `DELETE`;
- `RETURNING` o conteo de filas comprobado;
- transacción para una unidad de negocio indivisible;
- idempotencia en endpoints reintentables;
- lotes acotados para cambios masivos;
- permisos mínimos y logs sin datos sensibles.

## Referencias

- [PostgreSQL: INSERT](https://www.postgresql.org/docs/current/sql-insert.html)
- [PostgreSQL: UPDATE](https://www.postgresql.org/docs/current/sql-update.html)
- [PostgreSQL: transacciones](https://www.postgresql.org/docs/current/tutorial-transactions.html)
