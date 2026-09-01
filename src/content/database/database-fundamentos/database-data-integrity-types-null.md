---
title: Tipos de datos, NULL e integridad
description: Elegir tipos que representen el dominio, comprender la lógica de NULL y proteger datos con restricciones, precisión y validación en varias capas.
type: guides
order: 2
tags: [bases-de-datos, tipos, "null", integridad, constraints]
related:
  - database/database-fundamentos/database-fundamentals-terminology
  - database/database-modelado/database-modelado-relacional
  - database/database-postgresql/postgresql-practico
updatedAt: 2026-08-28
---

Un tipo no es solo almacenamiento: expresa qué valores tienen sentido y qué operaciones son válidas. `date` comunica mejor que una cadena que el dato es una fecha; `numeric` conserva precisión decimal; una clave foránea comunica que el identificador debe existir. Cuanto más pueda verificar la base, menos estados inválidos deben perseguirse después en el código.

## Referencia rápida

| Necesidad                      | Elección habitual                         | Evita                               |
| ------------------------------ | ----------------------------------------- | ----------------------------------- |
| contador o cantidad            | `integer` o `bigint`                      | texto numérico                      |
| importe exacto                 | entero en unidad mínima o `numeric(p, s)` | `float`                             |
| instante universal             | `timestamptz`                             | fecha sin zona guardada como texto  |
| fecha sin hora                 | `date`                                    | medianoche artificial               |
| valor sí/no obligatorio        | `boolean NOT NULL`                        | `0`, `1`, `sí`, `no` mezclados      |
| estado con conjunto pequeño    | `CHECK`, tabla catálogo o enum            | texto sin restricción               |
| estructura variable secundaria | `jsonb`                                   | ocultar entidades centrales en JSON |
| identificador                  | `bigint identity` o `uuid`                | dato mutable como PK                |

La elección exacta cambia según el gestor. Revisa rango, precisión, zona horaria, ordenación y compatibilidad del driver antes de publicar un contrato.

## Precisión, escala y rango

En `numeric(12, 2)`, la **precisión** es el total máximo de dígitos y la **escala** es cuántos quedan a la derecha del separador decimal. El valor máximo positivo es `9_999_999_999.99`.

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  price numeric(12, 2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0)
);
```

Para dinero también puede guardarse `price_cents bigint`. Esto simplifica operaciones en lenguajes con punto flotante, pero exige conocer la moneda y su unidad mínima. En sistemas multimoneda guarda además un código ISO 4217 como `COP`, `USD` o `EUR`; nunca sumes importes de monedas distintas sin conversión explícita.

## Tiempo: instante, fecha y zona horaria

Tres conceptos suelen confundirse:

- un **instante** es un punto exacto en la línea temporal, como el momento de creación;
- una **fecha civil** es un día del calendario, como un cumpleaños;
- una **hora local** depende de una zona y sus reglas, como “abre a las 09:00 en Bogotá”.

```sql
CREATE TABLE appointments (
  starts_at timestamptz NOT NULL,
  customer_timezone text NOT NULL,
  billing_date date NOT NULL
);
```

Guarda instantes en `timestamptz` y convierte para presentación. Conserva la zona IANA —por ejemplo, `America/Bogota`— si necesitas reconstruir una regla local futura. Un desplazamiento como `-05:00` no contiene reglas históricas o cambios de horario de verano.

## La lógica de tres valores de `NULL`

Una expresión SQL puede resultar `TRUE`, `FALSE` o `UNKNOWN`. `WHERE` conserva únicamente las filas cuyo resultado es `TRUE`.

| Expresión      | Resultado conceptual |
| -------------- | -------------------- |
| `10 > 5`       | `TRUE`               |
| `10 < 5`       | `FALSE`              |
| `10 = NULL`    | `UNKNOWN`            |
| `NULL IS NULL` | `TRUE`               |

```sql
SELECT id, COALESCE(nickname, full_name, 'Sin nombre') AS display_name
FROM users
WHERE deleted_at IS NULL;
```

`COALESCE(a, b, c)` devuelve el primer valor que no sea `NULL`. Es útil para presentación o prioridades, pero no debe esconder un dato obligatorio ausente. `NULLIF(a, b)` devuelve `NULL` cuando ambos valores son iguales y puede evitar una división entre cero:

```sql
SELECT completed::numeric / NULLIF(total, 0) AS completion_rate
FROM project_stats;
```

## Restricciones como reglas ejecutables

```sql
CREATE TABLE memberships (
  user_id bigint NOT NULL REFERENCES users(id),
  team_id bigint NOT NULL REFERENCES teams(id),
  role text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  left_at timestamptz,
  CONSTRAINT memberships_role_check
    CHECK (role IN ('owner', 'admin', 'member')),
  CONSTRAINT memberships_dates_check
    CHECK (left_at IS NULL OR left_at >= joined_at),
  CONSTRAINT memberships_unique UNIQUE (user_id, team_id)
);
```

Nombrar constraints mejora los errores y las migraciones. Una restricción protege cualquier vía de escritura: API, job, consola u otro servicio.

| Capa          | Responsabilidad                              |
| ------------- | -------------------------------------------- |
| Interfaz      | respuesta inmediata y mensajes comprensibles |
| API o dominio | permisos, flujo y reglas entre casos de uso  |
| Base de datos | integridad estructural y concurrencia        |

No son validaciones duplicadas: cada capa cubre un riesgo distinto.

## Unicidad y valores nulos

En PostgreSQL, un `UNIQUE` tradicional considera distintos varios valores `NULL`. Si el dominio exige como máximo una fila incluso cuando la columna sea nula, analiza `NULLS NOT DISTINCT` o un índice parcial.

```sql
CREATE UNIQUE INDEX users_active_email_unique
ON users (lower(email))
WHERE deleted_at IS NULL;
```

Este índice impide correos activos duplicados ignorando mayúsculas y permite conservar historial de registros eliminados lógicamente. La aplicación debe consultar con una expresión compatible para aprovecharlo.

## Identidad natural o sustituta

Una clave natural —número fiscal, correo o código externo— puede cambiar o contener significado sensible. Una clave sustituta —`bigint` o `uuid`— desacopla las relaciones de ese dato. Aun así, conserva una restricción única sobre la identidad de negocio.

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  CONSTRAINT users_email_unique UNIQUE (email)
);
```

Un `uuid` facilita generar identificadores en sistemas distribuidos y evita exponer una secuencia predecible. Un `bigint` es compacto, ordenable y eficiente. No existe uno universalmente mejor: decide por distribución, tamaño, exposición y soporte del ecosistema.

## Datos sensibles y ciclo de vida

Clasifica los datos antes de almacenarlos:

- públicos, internos, confidenciales o regulados;
- personales, financieros, credenciales o telemetría;
- periodo de retención y motivo de conservación;
- quién puede leer, modificar y borrar;
- qué debe anonimizarse en logs, backups y entornos de prueba.

Una contraseña nunca se cifra de forma reversible para autenticación: se guarda mediante un algoritmo de hash de contraseñas adecuado. Las claves API y secretos no pertenecen a una tabla sin controles específicos ni al repositorio. Minimizar datos reduce impacto, costo y responsabilidad.

## Lista de comprobación

- ¿El tipo representa el dominio y tiene rango suficiente?
- ¿La ausencia es válida y está documentada antes de aceptar `NULL`?
- ¿Dinero y decimales conservan precisión?
- ¿Las fechas distinguen instante, zona y fecha civil?
- ¿Las reglas críticas tienen `NOT NULL`, `UNIQUE`, `CHECK` o `FOREIGN KEY`?
- ¿Los identificadores mutables están separados de la PK?
- ¿Existe una política para datos personales, retención y eliminación?

## Referencias

- [PostgreSQL: tipos de datos](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL: restricciones](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL: funciones condicionales](https://www.postgresql.org/docs/current/functions-conditional.html)
