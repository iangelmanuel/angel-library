---
title: PostgreSQL práctico — tipos, JSONB, pool y consultas seguras
description: Decisiones cotidianas de PostgreSQL para fechas, dinero, identificadores, JSONB, conexiones y límites de una aplicación web.
category: database
stack: database-postgresql
order: 2
tags: [postgresql, jsonb, pooling, types, sql]
related:
  - guides/postgresql-transacciones-concurrencia
  - guides/database-indices-explain
updatedAt: 2026-08-19
---

PostgreSQL es una base de datos relacional con tipos ricos, transacciones y extensiones. Aprovechar esas capacidades evita convertir la base en un almacén de cadenas sin reglas.

## Elegir tipos con intención

| Dato | Tipo habitual | Nota |
| --- | --- | --- |
| Identidad interna | `bigint identity` o `uuid` | Decide según distribución y exposición |
| Instante global | `timestamptz` | Guarda un instante; presenta en la zona del usuario |
| Fecha civil | `date` | Cumpleaños o día de facturación, sin hora |
| Dinero | `numeric(12,2)` o enteros de unidad mínima | Evita `float` para cálculos exactos |
| Estado cerrado | `CHECK` o enum | `CHECK` suele ser más sencillo de evolucionar |
| Documento flexible | `jsonb` | Útil cuando la forma varía, no para ocultar relaciones centrales |

```sql
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind text NOT NULL,
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX events_payload_gin ON events USING gin (payload);
```

Antes de indexar todo `jsonb`, revisa los operadores y rutas consultadas. Una columna normal con una restricción suele ser mejor para información obligatoria y muy consultada.

## Pool de conexiones

Abrir una conexión por solicitud es costoso. Un **pool** mantiene un conjunto limitado y reutilizable:

```ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
```

El tamaño no se elige solo por tráfico. Debe respetar el máximo del servidor y la cantidad de instancias de la aplicación: `10 conexiones × 20 instancias` ya son 200. En funciones serverless suele ser necesario un proxy o pool administrado.

## Límites y observabilidad

- Configura timeout de conexión y de consultas.
- Registra consultas lentas sin imprimir secretos ni parámetros sensibles.
- Usa parámetros para valores externos.
- Evita sesiones `idle in transaction`.
- Mide saturación del pool, locks, conexiones, CPU y almacenamiento.

## Referencias

- [PostgreSQL: tipos de datos](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL: JSON](https://www.postgresql.org/docs/current/datatype-json.html)

