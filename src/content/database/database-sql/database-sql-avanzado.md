---
title: SQL avanzado — subconsultas, ventanas y conjuntos
description: Resolver análisis y consultas complejas con EXISTS, CTE recursivas, operaciones de conjuntos, funciones de ventana y agregaciones condicionales.
type: guides
order: 3
tags: [sql, window-functions, cte, subqueries, analytics]
related:
  - database/database-sql/database-sql-consultas
  - database/database-sql/database-indices-explain
updatedAt: 2026-08-28
---

SQL avanzado no significa escribir una sola consulta enorme. Significa reconocer la herramienta que expresa mejor cada pregunta y mantener visible la unidad de cada fila.

## `EXISTS` para comprobar existencia

```sql
SELECT u.id, u.email
FROM users AS u
WHERE EXISTS (
  SELECT 1
  FROM orders AS o
  WHERE o.user_id = u.id
    AND o.status = 'paid'
);
```

`EXISTS` responde si hay al menos una coincidencia y puede detener la búsqueda al encontrarla. Evita un join cuando no necesitas columnas del lado relacionado ni quieres multiplicar filas. `NOT EXISTS` es una forma segura de buscar ausencia, incluso con valores nulos.

## Subconsulta correlacionada o join

Una subconsulta **correlacionada** usa una columna de la consulta exterior:

```sql
SELECT p.id,
       p.title,
       (
         SELECT count(*)
         FROM comments AS c
         WHERE c.post_id = p.id
       ) AS comments_count
FROM posts AS p;
```

Es legible, pero revisa el plan: el optimizador puede transformarla o ejecutarla repetidamente. Un join con agregación previa suele ser más claro para grandes conjuntos. Elige con evidencia, no por una regla absoluta.

## Operaciones de conjuntos

| Operador | Resultado |
| --- | --- |
| `UNION` | combina y elimina duplicados |
| `UNION ALL` | combina y conserva duplicados |
| `INTERSECT` | filas presentes en ambos resultados |
| `EXCEPT` | filas del primero ausentes en el segundo |

```sql
SELECT email FROM newsletter_subscribers
UNION
SELECT email FROM customers;
```

Cada lado debe devolver el mismo número de columnas con tipos compatibles. Usa `UNION ALL` cuando los duplicados sean válidos o ya estén controlados: evitar la deduplicación puede reducir trabajo.

## Funciones de ventana

Una ventana calcula sobre filas relacionadas sin colapsarlas.

```sql
SELECT
  user_id,
  created_at,
  total_cents,
  sum(total_cents) OVER (
    PARTITION BY user_id
    ORDER BY created_at, id
  ) AS running_total,
  row_number() OVER (
    PARTITION BY user_id
    ORDER BY created_at DESC, id DESC
  ) AS recent_position
FROM orders
WHERE status = 'paid';
```

- `PARTITION BY` reinicia el cálculo por grupo;
- `ORDER BY` define secuencia dentro de la ventana;
- el **frame** define qué filas alrededor de la actual participan.

| Función | Uso |
| --- | --- |
| `row_number()` | posición única, incluso en empates |
| `rank()` | misma posición para empates y deja saltos |
| `dense_rank()` | misma posición sin dejar saltos |
| `lag()` / `lead()` | valor anterior o siguiente |
| `first_value()` | primer valor del frame |
| `sum() OVER` | acumulado o total por partición |

## Top N por grupo

```sql
WITH ranked AS (
  SELECT p.*,
         row_number() OVER (
           PARTITION BY category_id
           ORDER BY score DESC, id
         ) AS position
  FROM posts AS p
)
SELECT *
FROM ranked
WHERE position <= 3;
```

Este patrón obtiene los tres mejores elementos por categoría. El desempate por `id` hace el resultado reproducible.

## Agregación condicional

PostgreSQL permite `FILTER`, una forma legible de obtener varios indicadores:

```sql
SELECT
  date_trunc('month', created_at) AS month,
  count(*) AS total,
  count(*) FILTER (WHERE status = 'paid') AS paid,
  sum(total_cents) FILTER (WHERE status = 'paid') AS revenue
FROM orders
GROUP BY 1
ORDER BY 1;
```

En motores sin `FILTER`, puede usarse `SUM(CASE WHEN ... THEN 1 ELSE 0 END)`.

## CTE recursiva para jerarquías

```sql
WITH RECURSIVE category_tree AS (
  SELECT id, parent_id, name, 0 AS depth
  FROM categories
  WHERE id = $1

  UNION ALL

  SELECT child.id, child.parent_id, child.name, tree.depth + 1
  FROM categories AS child
  JOIN category_tree AS tree ON child.parent_id = tree.id
  WHERE tree.depth < 20
)
SELECT * FROM category_tree;
```

Define límites o protección contra ciclos cuando los datos podrían ser inválidos. Para árboles muy consultados, compara este modelo con rutas materializadas o tablas de cierre.

## Fechas y periodos

```sql
SELECT date_trunc('day', created_at) AS day,
       count(*) AS signups
FROM users
WHERE created_at >= $1
  AND created_at < $2
GROUP BY 1
ORDER BY 1;
```

Los intervalos semiabiertos `[inicio, fin)` evitan duplicar eventos en el límite entre periodos. Mantén el filtro sobre la columna sin envolverla cuando sea posible; aplicar una función puede impedir el uso eficiente de un índice.

## Vistas y vistas materializadas

Una **vista** guarda una consulta, no necesariamente sus resultados. Centraliza una proyección o interfaz estable. Una **vista materializada** almacena el resultado y debe refrescarse; sirve para cálculos costosos que toleran retraso.

Antes de crear una vista, define propietario, permisos y cómo evolucionará su contrato. Una vista compleja puede esconder consultas costosas detrás de un nombre sencillo.

## Cómo mantener una consulta compleja

1. Nombra cada CTE por su significado, no por `temp1`.
2. Mantén claro qué representa una fila en cada etapa.
3. Selecciona solo columnas necesarias.
4. Define desempates en todos los rankings y paginaciones.
5. Prueba valores nulos, grupos vacíos y empates.
6. Revisa `EXPLAIN (ANALYZE, BUFFERS)` con datos representativos.

## Referencias

- [PostgreSQL: subconsultas](https://www.postgresql.org/docs/current/functions-subquery.html)
- [PostgreSQL: consultas WITH](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL: funciones de ventana](https://www.postgresql.org/docs/current/functions-window.html)
