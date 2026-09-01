---
title: PostgreSQL práctico — esquemas, tipos y consultas
description: Empezar con PostgreSQL, organizar objetos en esquemas y tomar decisiones cotidianas sobre tipos, JSONB, extensiones, consultas y conexiones.
type: guides
order: 1
tags: [postgresql, jsonb, pooling, types, sql]
related:
  - database/database-postgresql/postgresql-transacciones-concurrencia
  - database/database-sql/database-indices-explain
updatedAt: 2026-08-28
---

PostgreSQL es una base de datos relacional con tipos ricos, transacciones y extensiones. Aprovechar esas capacidades evita convertir la base en un almacén de cadenas sin reglas.

## Mapa rápido

```text
servidor PostgreSQL
└── cluster o instancia
    ├── roles
    └── bases de datos
        └── esquemas
            ├── tablas, vistas y secuencias
            ├── funciones y tipos
            └── índices y constraints
```

En PostgreSQL, un **cluster** es una instancia que administra un conjunto de bases. Una conexión entra a una base concreta. Dentro de ella, los **schemas** son espacios de nombres; `public.users` significa la tabla `users` del esquema `public`. No confundas el esquema como estructura conceptual con el objeto `SCHEMA` de PostgreSQL.

## Primeros comandos con `psql`

`psql` es el cliente de terminal oficial. Sus metacomandos comienzan con barra invertida y no son SQL.

| Comando                | Uso                            |
| ---------------------- | ------------------------------ |
| `psql "$DATABASE_URL"` | conectar mediante URL          |
| `\conninfo`            | ver conexión actual            |
| `\l`                   | listar bases                   |
| `\dn`                  | listar esquemas                |
| `\dt`                  | listar tablas visibles         |
| `\d users`             | describir una relación         |
| `\x`                   | alternar salida expandida      |
| `\timing`              | mostrar duración de sentencias |

No pegues una URL con contraseña en historial, capturas o logs. Prefiere variables de entorno o mecanismos de secretos del entorno.

## Esquemas y `search_path`

```sql
CREATE SCHEMA app;

CREATE TABLE app.users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);

SELECT id, email FROM app.users;
```

El `search_path` decide en qué esquemas se buscan nombres sin calificar. En código sensible o funciones, calificar `app.users` reduce ambigüedad y riesgos si un usuario puede crear objetos en un esquema anterior del path.

## Elegir tipos con intención

| Dato               | Tipo habitual                              | Nota                                                             |
| ------------------ | ------------------------------------------ | ---------------------------------------------------------------- |
| Identidad interna  | `bigint identity` o `uuid`                 | Decide según distribución y exposición                           |
| Instante global    | `timestamptz`                              | Guarda un instante; presenta en la zona del usuario              |
| Fecha civil        | `date`                                     | Cumpleaños o día de facturación, sin hora                        |
| Dinero             | `numeric(12,2)` o enteros de unidad mínima | Evita `float` para cálculos exactos                              |
| Estado cerrado     | `CHECK` o enum                             | `CHECK` suele ser más sencillo de evolucionar                    |
| Documento flexible | `jsonb`                                    | Útil cuando la forma varía, no para ocultar relaciones centrales |

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

## Arrays, enums, dominios y rangos

- Los **arrays** sirven para valores locales y acotados; si cada elemento necesita identidad o relación, usa otra tabla.
- Un **enum** limita estados con claridad, pero eliminar o reordenar valores exige más cuidado que un `CHECK`.
- Un **domain** crea un tipo reutilizable con restricciones, útil para reglas estables compartidas.
- Los **range types** representan intervalos y ayudan a detectar solapamientos.

```sql
CREATE TABLE room_bookings (
  room_id bigint NOT NULL REFERENCES rooms(id),
  during tstzrange NOT NULL,
  EXCLUDE USING gist (room_id WITH =, during WITH &&)
);
```

La exclusión impide reservas superpuestas para la misma sala. Es una capacidad específica de PostgreSQL que convierte una regla concurrente difícil en una restricción.

## `jsonb`: cuándo usarlo

```sql
SELECT id, payload->>'provider' AS provider
FROM events
WHERE payload @> '{"status":"completed"}'::jsonb;
```

- `->` devuelve JSON;
- `->>` devuelve texto;
- `@>` comprueba si un documento contiene otro.

Usa columnas para valores obligatorios, claves foráneas, ordenamiento y filtros principales. Usa `jsonb` para metadatos variables o datos externos cuya forma está versionada. Valida tamaño y estructura; un documento enorme se reescribe al actualizarse y no obtiene integridad relacional por sí solo.

## Extensiones

Una extensión instala objetos adicionales dentro de una base:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

`pg_trgm` ayuda con similitud y búsquedas de texto; `citext` ofrece texto sin distinción de mayúsculas en ciertos casos; `pgcrypto` incluye funciones criptográficas. Comprueba disponibilidad en el proveedor, permisos, versión y estrategia de migración antes de depender de una extensión.

## Consultas parametrizadas y límites

```ts
const { rows } = await pool.query(
  `SELECT id, email
   FROM app.users
   WHERE tenant_id = $1
   ORDER BY created_at DESC, id DESC
   LIMIT $2`,
  [tenantId, Math.min(requestedLimit, 100)]
)
```

Parametrizar evita que el dato sea interpretado como sintaxis SQL. También limita resultados en la aplicación: un parámetro válido de un millón todavía puede agotar memoria o ancho de banda.

## Pool de conexiones

Abrir una conexión por solicitud es costoso. Un **pool** mantiene un conjunto limitado y reutilizable:

```ts
import { Pool } from "pg"

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000
})
```

El tamaño no se elige solo por tráfico. Debe respetar el máximo del servidor y la cantidad de instancias de la aplicación: `10 conexiones × 20 instancias` ya son 200. En funciones serverless suele ser necesario un proxy o pool administrado.

Un pool debe crearse una vez por proceso o instancia, no dentro de cada handler. Para una transacción, adquiere un cliente y usa esa misma conexión hasta `COMMIT` o `ROLLBACK`.

## Límites y observabilidad

- Configura timeout de conexión y de consultas.
- Registra consultas lentas sin imprimir secretos ni parámetros sensibles.
- Usa parámetros para valores externos.
- Evita sesiones `idle in transaction`.
- Mide saturación del pool, locks, conexiones, CPU y almacenamiento.

## Flujo recomendado para una funcionalidad

1. Modela la regla con tipos y constraints.
2. Crea la migración revisable.
3. Escribe SQL parametrizado y limita resultados.
4. Prueba valores nulos, duplicados y concurrencia.
5. Observa el plan con datos representativos.
6. Define timeout, logs seguros y comportamiento ante fallo.

## Referencias

- [PostgreSQL: tipos de datos](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL: JSON](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL: esquemas](https://www.postgresql.org/docs/current/ddl-schemas.html)
- [PostgreSQL: extensiones](https://www.postgresql.org/docs/current/external-extensions.html)
