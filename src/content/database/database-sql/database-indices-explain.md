---
title: Índices y EXPLAIN — optimizar con evidencia
description: Entender índices compuestos, selectividad, planes de ejecución y costos de escritura para acelerar consultas reales.
type: guides
order: 4
tags: [database, sql, indexes, explain, performance]
related:
  - database/database-sql/database-sql-consultas
  - performance/performance-operacion/performance-budgets-monitoring
updatedAt: 2026-08-28
---

Un **índice** es una estructura auxiliar que permite localizar filas sin recorrer toda la tabla. No es gratuito: ocupa espacio, debe actualizarse en cada escritura y puede no ayudar si la consulta devuelve gran parte de la tabla.

## Referencia rápida

| Pregunta | Señal útil |
| --- | --- |
| ¿qué consulta optimizo? | una lenta y frecuente con parámetros reales |
| ¿qué columnas van primero? | igualdades frecuentes, luego rango u orden |
| ¿el índice se usa? | `EXPLAIN (ANALYZE, BUFFERS)` en entorno seguro |
| ¿faltan estadísticas? | gran diferencia entre filas estimadas y reales |
| ¿sobran índices? | costo de escritura, espacio y uso observado |

La **cardinalidad** es la cantidad de valores diferentes. La **selectividad** describe qué proporción de filas conserva un filtro. Buscar un correo único es muy selectivo; filtrar una columna booleana que coincide con el 90 % de la tabla normalmente no lo es.

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

Un índice no tiene que copiar cada columna del `WHERE` sin criterio. Diseña desde la forma completa de la consulta y comprueba otras consultas que ya dependen de la tabla.

## Índices compuestos y cobertura

```sql
CREATE INDEX orders_user_created_cover_idx
ON orders (user_id, created_at DESC)
INCLUDE (status, total_cents);
```

Las columnas clave ayudan a localizar y ordenar. `INCLUDE` puede permitir que PostgreSQL responda desde el índice cuando la visibilidad lo permite, sin convertir esas columnas en parte del orden. Esto aumenta tamaño y costo de escritura: se usa para consultas importantes y medidas, no como sustituto de `SELECT` explícito.

La regla del prefijo explica por qué `(tenant_id, email)` sirve bien para buscar por ambos o solo por `tenant_id`, pero normalmente no para buscar únicamente por `email`.

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

Observa también:

- `actual time`: tiempo del nodo, interpretado junto con `loops`;
- `rows removed by filter`: filas leídas que luego fueron descartadas;
- `Sort Method` y memoria: si el ordenamiento terminó en disco;
- `Planning Time` y `Execution Time`: planificar y ejecutar son costos distintos;
- nodos repetidos muchas veces: una operación barata puede volverse cara por sus `loops`.

El tiempo de una sola ejecución puede estar afectado por caché, carga y parámetros. Repite con casos representativos y usa observabilidad de producción para priorizar.

Un `Seq Scan` no es automáticamente malo. En una tabla pequeña o una consulta poco selectiva, recorrerla puede ser más barato que saltar entre índice y tabla.

## Índices útiles

| Tipo | Uso |
| --- | --- |
| B-tree | Igualdad, rangos y orden; opción predeterminada |
| Único | Rendimiento y garantía de no duplicación |
| Parcial | Indexar solo filas que cumplen una condición estable |
| GIN | Arrays, búsqueda de texto y operadores sobre `jsonb` |
| GiST | rangos, geometría y operadores especializados |
| BRIN | tablas enormes físicamente correlacionadas, como eventos por tiempo |
| Hash | igualdad; rara vez sustituye la versatilidad de B-tree |

```sql
CREATE INDEX orders_pending_idx
ON orders (created_at)
WHERE status = 'pending';
```

El índice parcial es pequeño y útil si la aplicación consulta pendientes con frecuencia. La condición de la consulta debe ser compatible con su predicado.

### Índices de expresión

```sql
CREATE UNIQUE INDEX users_email_lower_unique
ON users (lower(email));
```

Este índice protege y acelera búsquedas con `lower(email)`. La consulta debe usar una expresión compatible. Antes de normalizar en cada lectura, considera guardar el dato ya normalizado y conservar por separado su forma de presentación.

## Consultas sargables

Una condición es **sargable** cuando el gestor puede usarla como argumento de búsqueda del índice. Envolver la columna en una función o transformar su tipo puede impedirlo.

```sql
-- Menos favorable: transforma cada fila.
WHERE date(created_at) = DATE '2026-08-28'

-- Favorable: rango sobre la columna indexada.
WHERE created_at >= TIMESTAMPTZ '2026-08-28 00:00:00+00'
  AND created_at <  TIMESTAMPTZ '2026-08-29 00:00:00+00'
```

También revisa conversiones implícitas, comodines iniciales como `LIKE '%texto'`, `OR` amplios y operaciones sobre JSON sin un índice adecuado.

## Cuándo un índice no ayuda

- la tabla es pequeña;
- el filtro devuelve gran parte de las filas;
- las estadísticas no representan la distribución;
- el índice no coincide con la expresión, orden o tipo;
- el costo de saltar entre índice y tabla supera un recorrido secuencial;
- la consulta necesita tantas columnas que leer la tabla es más barato.

Un `Seq Scan` puede ser la decisión correcta. Optimizar significa reducir el costo del caso real, no eliminar un nombre del plan.

## Estadísticas y mantenimiento

`ANALYZE` recoge estadísticas para que el optimizador estime filas. `VACUUM` recupera espacio reutilizable y mantiene visibilidad en PostgreSQL. El autovacuum suele encargarse, pero tablas de alta escritura o distribuciones atípicas necesitan observación y ajustes medidos.

Los índices también se inflan, se duplican o dejan de usarse. Antes de eliminarlos, confirma un periodo representativo, dependencias de constraints, consultas poco frecuentes críticas y reinicios de estadísticas.

## Flujo de optimización

1. Captura la consulta lenta y sus parámetros representativos.
2. Comprueba volumen, cardinalidad y frecuencia.
3. Revisa `EXPLAIN (ANALYZE, BUFFERS)` en un entorno seguro.
4. Corrige la consulta o agrega el índice mínimo necesario.
5. Mide lecturas y escrituras después del cambio.
6. Documenta qué consulta justifica el índice y revisa si sigue siendo necesario.

## Caso de diagnóstico

Si `WHERE tenant_id = $1 AND created_at >= $2 ORDER BY created_at DESC LIMIT 50` es lento:

1. comprueba que `$1` y `$2` tengan los tipos correctos;
2. mide filas por tenant y distribución temporal;
3. prueba un índice `(tenant_id, created_at DESC)`;
4. compara plan, buffers y latencia;
5. mide el impacto en inserciones;
6. evita añadir `status` al índice si la consulta no lo usa o si otro índice ya cubre el patrón.

## Referencias

- [PostgreSQL: uso de índices](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL: EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL: tipos de índices](https://www.postgresql.org/docs/current/indexes-types.html)

