---
title: Índices y EXPLAIN — optimizar con evidencia
description: Entender índices compuestos, selectividad, planes de ejecución y costos de escritura para acelerar consultas reales.
category: database
stack: database-sql
order: 2
tags: [database, sql, indexes, explain, performance]
related:
  - guides/database-sql-consultas
  - guides/performance-budgets-monitoring
updatedAt: 2026-08-19
---

Un **índice** es una estructura auxiliar que permite localizar filas sin recorrer toda la tabla. No es gratuito: ocupa espacio, debe actualizarse en cada escritura y puede no ayudar si la consulta devuelve gran parte de la tabla.

## Diseñar desde la consulta

```sql
SELECT id, total, created_at
FROM orders
WHERE user_id = $1 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;
```

Un índice candidato es:

```sql
CREATE INDEX orders_user_status_created_idx
ON orders (user_id, status, created_at DESC);
```

El orden importa. Las columnas de igualdad suelen ir primero; después aparecen rangos u ordenamiento. Un índice `(user_id, created_at)` puede ayudar a buscar por `user_id`, pero no necesariamente a buscar solo por `created_at`.

## Leer un plan

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id FROM orders
WHERE user_id = 42 AND status = 'paid';
```

- `EXPLAIN` muestra el plan estimado.
- `ANALYZE` ejecuta la consulta y muestra tiempos y filas reales; no lo uses sin cuidado sobre escrituras.
- `BUFFERS` ayuda a distinguir lectura desde memoria y disco.
- Una diferencia grande entre `rows` estimadas y reales puede indicar estadísticas desactualizadas o datos muy sesgados.

Un `Seq Scan` no es automáticamente malo. En una tabla pequeña o una consulta poco selectiva, recorrerla puede ser más barato que saltar entre índice y tabla.

## Índices útiles

| Tipo | Uso |
| --- | --- |
| B-tree | Igualdad, rangos y orden; opción predeterminada |
| Único | Rendimiento y garantía de no duplicación |
| Parcial | Indexar solo filas que cumplen una condición estable |
| GIN | Arrays, búsqueda de texto y operadores sobre `jsonb` |

```sql
CREATE INDEX orders_pending_idx
ON orders (created_at)
WHERE status = 'pending';
```

El índice parcial es pequeño y útil si la aplicación consulta pendientes con frecuencia. La condición de la consulta debe ser compatible con su predicado.

## Flujo de optimización

1. Captura la consulta lenta y sus parámetros representativos.
2. Comprueba volumen, cardinalidad y frecuencia.
3. Revisa `EXPLAIN (ANALYZE, BUFFERS)` en un entorno seguro.
4. Corrige la consulta o agrega el índice mínimo necesario.
5. Mide lecturas y escrituras después del cambio.

## Referencias

- [PostgreSQL: uso de índices](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL: EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

