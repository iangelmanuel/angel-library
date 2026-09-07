---
title: SQL práctico — consultas, joins, agregaciones y CTE
description: Leer y transformar datos con SELECT, filtros, joins, grupos, subconsultas, CTE y funciones de ventana sin perder claridad.
type: guides
order: 1
tags: [sql, consultas, joins, cte, window-functions]
related:
  - database/database-modelado/database-modelado-relacional
  - database/database-sql/database-indices-explain
updatedAt: 2026-08-28
---

**SQL** (_Structured Query Language_ o lenguaje de consulta estructurada) es declarativo: se expresa el resultado deseado y el gestor decide el plan físico para obtenerlo. Una consulta clara facilita tanto el mantenimiento como la optimización.

## Mapa del lenguaje

| Grupo                                | Propósito               | Ejemplos                               |
| ------------------------------------ | ----------------------- | -------------------------------------- |
| DDL (_Data Definition Language_)     | definir estructura      | `CREATE`, `ALTER`, `DROP`              |
| DML (_Data Manipulation Language_)   | leer y modificar filas  | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| TCL (_Transaction Control Language_) | controlar transacciones | `BEGIN`, `COMMIT`, `ROLLBACK`          |
| DCL (_Data Control Language_)        | administrar privilegios | `GRANT`, `REVOKE`                      |

Los nombres ayudan a clasificar, pero no todos los gestores implementan exactamente las mismas sentencias o semántica. Aquí se utiliza sintaxis de PostgreSQL cuando SQL estándar no es suficiente.

## Anatomía mínima de `SELECT`

```sql
SELECT id, email, created_at
FROM users
WHERE active = true
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

- `SELECT` elige expresiones o columnas;
- `FROM` define la fuente;
- `WHERE` descarta filas;
- `ORDER BY` determina un orden reproducible;
- `LIMIT` reduce cuántas se devuelven.

Sin `ORDER BY`, el orden no está garantizado aunque parezca estable durante varias pruebas.

## Orden lógico de una consulta

Aunque se escribe `SELECT` primero, el modelo mental útil es:

```text
FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

```sql
SELECT u.id, u.email, count(o.id) AS paid_orders
FROM users AS u
LEFT JOIN orders AS o
  ON o.user_id = u.id AND o.status = 'paid'
WHERE u.created_at >= DATE '2026-01-01'
GROUP BY u.id, u.email
HAVING count(o.id) >= 2
ORDER BY paid_orders DESC
LIMIT 20;
```

El filtro de estado está en el `ON` para conservar usuarios sin pedidos pagados. Si se coloca en `WHERE`, el `LEFT JOIN` termina comportándose como un `INNER JOIN` para esas filas.

## Elegir el join

| Join         | Resultado                                                     |
| ------------ | ------------------------------------------------------------- |
| `INNER JOIN` | Solo filas con coincidencia en ambos lados                    |
| `LEFT JOIN`  | Todas las filas de la izquierda y coincidencias de la derecha |
| `CROSS JOIN` | Todas las combinaciones; úsalo de forma deliberada            |

Un `FULL OUTER JOIN` conserva filas de ambos lados y completa con `NULL` donde no existe coincidencia. Es útil al reconciliar dos fuentes. Un `SELF JOIN` no es un tipo diferente: une una tabla consigo misma usando alias, por ejemplo para relacionar empleados y supervisores.

```sql
SELECT employee.name, manager.name AS manager_name
FROM employees AS employee
LEFT JOIN employees AS manager ON manager.id = employee.manager_id;
```

Evita `SELECT *` en contratos y reportes estables: transfiere columnas innecesarias, puede ocultar colisiones de nombres y cambia cuando evoluciona el esquema.

## Filtros y `NULL`

```sql
SELECT id, title
FROM posts
WHERE published_at IS NOT NULL
  AND status IN ('published', 'archived')
  AND title ILIKE '%postgres%';
```

`IN` compara contra un conjunto; `BETWEEN` incluye ambos extremos; `LIKE` busca patrones y `ILIKE` es la variante de PostgreSQL que ignora mayúsculas. Una comparación con `NULL` usa `IS NULL` o `IS NOT NULL`, nunca `= NULL`.

Agrupa condiciones explícitamente porque `AND` tiene mayor precedencia que `OR`:

```sql
WHERE tenant_id = $1
  AND (status = 'pending' OR status = 'processing')
```

## Agregaciones y grupos

Las funciones `count`, `sum`, `avg`, `min` y `max` resumen filas. `WHERE` filtra antes de agrupar; `HAVING` filtra grupos después.

```sql
SELECT status,
       count(*) AS orders,
       sum(total_cents) AS total_cents
FROM orders
WHERE created_at >= current_date - interval '30 days'
GROUP BY status
HAVING count(*) >= 10
ORDER BY total_cents DESC;
```

`count(*)` cuenta filas. `count(column)` ignora valores `NULL`. Esta diferencia importa en reportes de completitud.

## `CASE`, `COALESCE` y alias

```sql
SELECT id,
       COALESCE(display_name, email) AS label,
       CASE
         WHEN total_cents >= 100000 THEN 'high'
         WHEN total_cents >= 20000 THEN 'medium'
         ELSE 'low'
       END AS value_segment
FROM customers;
```

`CASE` expresa decisiones dentro de una consulta. `COALESCE` elige el primer valor no nulo. Los alias mejoran el contrato de salida, pero algunos no pueden usarse en `WHERE` porque esa etapa se evalúa antes de `SELECT`.

## CTE para nombrar pasos

Una **CTE** (_Common Table Expression_ o expresión de tabla común) da nombre a un resultado intermedio:

```sql
WITH monthly_sales AS (
  SELECT date_trunc('month', created_at) AS month,
         sum(total) AS revenue
  FROM orders
  WHERE status = 'paid'
  GROUP BY 1
)
SELECT month, revenue,
       revenue - lag(revenue) OVER (ORDER BY month) AS growth
FROM monthly_sales
ORDER BY month;
```

`lag()` es una **función de ventana**: consulta otra fila sin colapsar el resultado como lo haría `GROUP BY`. También son frecuentes `row_number()`, `rank()`, sumas acumuladas y promedios móviles.

Una CTE mejora legibilidad y permite recursión, pero no es automáticamente más rápida. Compara el plan y evita dividir una consulta sencilla en pasos innecesarios.

## Parámetros, nunca concatenación

```ts
const result = await db.query("SELECT id, email FROM users WHERE email = $1", [
  email
])
```

Los parámetros separan código y datos, reducen inyección SQL y permiten reutilizar planes. Los identificadores dinámicos —como nombres de columnas— no suelen aceptar parámetros; se eligen desde una lista permitida.

```ts
const allowedSorts = {
  recent: "created_at DESC",
  oldest: "created_at ASC"
} as const

const orderBy = allowedSorts[inputSort] ?? allowedSorts.recent
const result = await db.query(
  `SELECT id, title FROM posts WHERE author_id = $1 ORDER BY ${orderBy}`,
  [authorId]
)
```

La interpolación es segura aquí únicamente porque el fragmento proviene de una lista cerrada controlada por la aplicación, no del texto recibido.

## Caso de uso: paginación estable

Para listas grandes, la paginación por cursor suele ser más estable que un `OFFSET` creciente:

```sql
SELECT id, created_at, title
FROM posts
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

El par `(created_at, id)` crea un orden total: el `id` desempata fechas iguales. El índice debe seguir el mismo orden de búsqueda.

## Depurar una consulta paso a paso

1. Ejecuta el `FROM` y los `JOIN` con pocas columnas.
2. Comprueba si cada unión multiplica filas de forma esperada.
3. Añade `WHERE` y valida valores `NULL`.
4. Agrega grupos y compara conteos antes y después.
5. Define un `ORDER BY` total.
6. Revisa el plan y los parámetros representativos.

Si un pedido tiene cinco líneas, unir pedidos con líneas produce cinco filas para ese pedido. Un `count(orders.id)` después del join contará cinco; `count(DISTINCT orders.id)` contará uno. La solución correcta depende de qué unidad representa cada fila del resultado.

## Referencias

- [PostgreSQL: consultas](https://www.postgresql.org/docs/current/queries.html)
- [PostgreSQL: funciones de ventana](https://www.postgresql.org/docs/current/tutorial-window.html)
- [PostgreSQL: expresiones condicionales](https://www.postgresql.org/docs/current/functions-conditional.html)
