---
title: SQL práctico — consultas, joins, agregaciones y CTE
description: Leer y transformar datos con SELECT, filtros, joins, grupos, subconsultas, CTE y funciones de ventana sin perder claridad.
category: database
stack: database-sql
order: 1
tags: [sql, consultas, joins, cte, window-functions]
related:
  - guides/database-modelado-relacional
  - guides/database-indices-explain
updatedAt: 2026-08-19
---

**SQL** (*Structured Query Language* o lenguaje de consulta estructurada) es declarativo: se expresa el resultado deseado y el gestor decide el plan físico para obtenerlo. Una consulta clara facilita tanto el mantenimiento como la optimización.

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

| Join | Resultado |
| --- | --- |
| `INNER JOIN` | Solo filas con coincidencia en ambos lados |
| `LEFT JOIN` | Todas las filas de la izquierda y coincidencias de la derecha |
| `CROSS JOIN` | Todas las combinaciones; úsalo de forma deliberada |

Evita `SELECT *` en contratos y reportes estables: transfiere columnas innecesarias, puede ocultar colisiones de nombres y cambia cuando evoluciona el esquema.

## CTE para nombrar pasos

Una **CTE** (*Common Table Expression* o expresión de tabla común) da nombre a un resultado intermedio:

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

## Parámetros, nunca concatenación

```ts
const result = await db.query(
  'SELECT id, email FROM users WHERE email = $1',
  [email],
);
```

Los parámetros separan código y datos, reducen inyección SQL y permiten reutilizar planes. Los identificadores dinámicos —como nombres de columnas— no suelen aceptar parámetros; se eligen desde una lista permitida.

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

## Referencias

- [PostgreSQL: consultas](https://www.postgresql.org/docs/current/queries.html)
- [PostgreSQL: funciones de ventana](https://www.postgresql.org/docs/current/tutorial-window.html)

