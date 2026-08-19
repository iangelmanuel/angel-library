---
title: Fundamentos y terminología de bases de datos
description: Modelo mental para entender persistencia, SQL, esquemas, índices, transacciones y las decisiones más comunes al almacenar información.
category: database
stack: database-fundamentos
tags: [bases-de-datos, sql, persistencia, fundamentos, glosario]
order: 1
updatedAt: 2026-08-19
---

Una **base de datos** es un sistema organizado para conservar información y consultarla después. Guardar datos no consiste únicamente en escribir un archivo: una aplicación suele necesitar búsquedas, relaciones, validación, acceso simultáneo, copias de seguridad y reglas que eviten estados imposibles.

El **DBMS** (*Database Management System* o sistema gestor de bases de datos) es el software que administra esos datos. PostgreSQL, MySQL, SQLite y MongoDB son ejemplos de gestores; la base de datos es la información organizada que vive dentro de ellos.

## El modelo mental mínimo

Una aplicación envía una operación al gestor, el gestor comprueba permisos y reglas, localiza los datos y devuelve un resultado. No conviene pensar en la base de datos como una variable global remota: tiene su propio modelo de concurrencia, costos de entrada y salida y mecanismos de integridad.

| Término | Significado | Ejemplo |
| --- | --- | --- |
| Persistencia | Conservar datos más allá de la ejecución actual | Una cuenta sigue existiendo después de reiniciar el servidor |
| Esquema | Estructura y reglas de los datos | `email` es texto, único y obligatorio |
| Consulta o *query* | Petición para leer o modificar datos | Buscar pedidos pendientes de una persona |
| Restricción o *constraint* | Regla aplicada por el gestor | Impedir dos usuarios con el mismo correo |
| Integridad | Garantía de que los datos mantienen reglas válidas | Un pedido no referencia un cliente inexistente |

## Bases relacionales y no relacionales

Una base **relacional** organiza información en tablas. Cada fila representa una entidad y cada columna una propiedad. Las relaciones se expresan mediante claves y las consultas suelen escribirse con **SQL** (*Structured Query Language* o lenguaje de consulta estructurado).

Una base **no relacional**, a menudo llamada NoSQL, puede almacenar documentos, pares clave-valor, grafos o columnas anchas. No significa “sin relaciones” ni “sin estructura”; significa que no usa necesariamente el modelo tabular relacional ni SQL como interfaz principal.

| Necesidad | Punto de partida habitual |
| --- | --- |
| Reglas estrictas, relaciones y transacciones | Base relacional |
| Documentos con forma variable | Base documental |
| Caché o búsquedas por clave extremadamente rápidas | Almacén clave-valor |
| Relaciones complejas que son el centro del problema | Base de grafos |

La elección no se hace por moda. Primero se estudian las consultas, la consistencia necesaria, el volumen, la operación del sistema y la experiencia del equipo.

## Tabla, fila, columna y claves

Una **clave primaria** o **PK** (*Primary Key*) identifica una fila de forma única. Una **clave foránea** o **FK** (*Foreign Key*) referencia la clave primaria de otra tabla y permite que el gestor proteja la relación.

```sql
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0)
);
```

`NOT NULL` hace obligatorio el valor, `UNIQUE` evita duplicados y `CHECK` valida una condición. Estas reglas deben vivir en la base aunque la interfaz también valide: otro servicio o un error de programación podría saltarse la interfaz.

Guardar dinero como enteros en la unidad mínima —centavos, por ejemplo— evita varios problemas de precisión de los números de punto flotante.

## CRUD y SQL

**CRUD** resume cuatro operaciones: *Create*, *Read*, *Update* y *Delete*; en español, crear, leer, actualizar y eliminar. No es un protocolo, sino una forma de clasificar operaciones.

```sql
-- Create: crea una fila y devuelve sus datos.
INSERT INTO users (email)
VALUES ('ana@example.com')
RETURNING id, email, created_at;

-- Read: filtra y ordena antes de limitar el resultado.
SELECT id, email
FROM users
WHERE email LIKE '%@example.com'
ORDER BY created_at DESC
LIMIT 20;

-- Update: modifica solo las filas que cumplen la condición.
UPDATE users
SET email = 'ana.nueva@example.com'
WHERE id = 42;

-- Delete: elimina una fila concreta.
DELETE FROM users
WHERE id = 42;
```

El `WHERE` es crítico en `UPDATE` y `DELETE`: sin él, la operación puede afectar todas las filas. Antes de una modificación amplia conviene ejecutar un `SELECT` con la misma condición y revisar cuántas filas coinciden.

## Relaciones y `JOIN`

Un `JOIN` combina filas relacionadas. En este ejemplo, `orders.user_id` apunta a `users.id`:

```sql
SELECT
  orders.id AS order_id,
  users.email,
  orders.total_cents
FROM orders
INNER JOIN users ON users.id = orders.user_id
WHERE orders.total_cents > 10_000;
```

`INNER JOIN` devuelve solo coincidencias en ambas tablas. `LEFT JOIN` conserva todas las filas del lado izquierdo aunque no exista una coincidencia; en ese caso, las columnas del lado derecho llegan como `NULL`.

## Normalización y desnormalización

**Normalizar** es separar conceptos para reducir duplicación y proteger la consistencia. En lugar de repetir el correo del cliente en cada pedido, se guarda `user_id` y el correo permanece en `users`.

**Desnormalizar** es duplicar información de manera intencional para simplificar o acelerar ciertas lecturas. Puede ser válido, pero exige una estrategia para mantener las copias sincronizadas. Primero se diseña un modelo claro; después se desnormaliza con una medición que lo justifique.

## Índices: velocidad con un costo

Un **índice** es una estructura auxiliar que ayuda a encontrar filas sin recorrer toda la tabla. Es parecido al índice de un libro: ocupa espacio y debe actualizarse cuando cambia el contenido.

```sql
CREATE INDEX orders_user_created_idx
ON orders (user_id, created_at DESC);
```

Este índice puede ayudar a consultar los pedidos recientes de un usuario porque su orden coincide con el filtro y el ordenamiento esperados. No acelera automáticamente cualquier consulta. Demasiados índices consumen almacenamiento y vuelven más costosas las escrituras.

El **plan de ejecución** explica cómo el gestor resolvió una consulta. En PostgreSQL se inspecciona con `EXPLAIN` y, para medir la ejecución real, con `EXPLAIN ANALYZE`. Este último sí ejecuta la consulta y debe usarse con cuidado sobre operaciones que modifican datos.

## Transacciones y ACID

Una **transacción** agrupa operaciones que deben confirmarse o descartarse como una unidad. Una transferencia no puede restar dinero de una cuenta y fallar antes de sumarlo a la otra.

```sql
BEGIN;

UPDATE accounts
SET balance_cents = balance_cents - 5_000
WHERE id = 10 AND balance_cents >= 5_000;

UPDATE accounts
SET balance_cents = balance_cents + 5_000
WHERE id = 11;

COMMIT;
```

**ACID** resume propiedades deseables de una transacción:

- **Atomicidad:** todo se aplica o nada se aplica.
- **Consistencia:** las reglas de integridad siguen cumpliéndose.
- **Aislamiento:** las transacciones concurrentes no se interfieren de formas no permitidas.
- **Durabilidad:** una confirmación exitosa sobrevive a fallos posteriores.

El ejemplo todavía necesita comprobar que el primer `UPDATE` afectó una fila; una transacción no reemplaza la validación de negocio.

## Concurrencia y aislamiento

Dos peticiones pueden leer o modificar el mismo dato al mismo tiempo. El **nivel de aislamiento** determina qué efectos de otras transacciones son visibles. Aumentar el aislamiento puede evitar anomalías, pero también producir más esperas o reintentos.

Los problemas clásicos incluyen lecturas no repetibles, filas fantasma y actualizaciones perdidas. Para resolverlos se combinan transacciones, bloqueos, versiones optimistas y restricciones. La solución depende del conflicto real; bloquear todo reduce concurrencia y rara vez es una buena política general.

## ORM, migraciones y *pool* de conexiones

Un **ORM** (*Object-Relational Mapper* o mapeador objeto-relacional) traduce entre objetos del lenguaje y tablas. Reduce código repetitivo, pero no elimina la necesidad de entender SQL, índices o transacciones: una consulta ineficiente sigue siendo ineficiente aunque se genere automáticamente.

Una **migración** es un cambio versionado del esquema, como crear una tabla o añadir una columna. Debe poder revisarse, aplicarse en orden y desplegarse sin dejar versiones incompatibles de la aplicación.

Un **pool de conexiones** mantiene un conjunto limitado de conexiones reutilizables. Abrir una conexión por petición es costoso; abrir demasiadas puede agotar la base de datos. El tamaño se decide con límites reales del gestor y el número de instancias de la aplicación.

## Copias de seguridad, réplica y recuperación

Una **réplica** mantiene otra copia activa de los datos para distribuir lecturas o mejorar disponibilidad. No sustituye una copia de seguridad: un borrado accidental también puede replicarse.

Una estrategia de respaldo debe definir:

- qué se copia y con qué frecuencia;
- cuánto dato se acepta perder, conocido como **RPO** (*Recovery Point Objective*);
- cuánto tiempo puede tardar la recuperación, conocido como **RTO** (*Recovery Time Objective*);
- cómo se cifra, retiene y restaura la copia.

Un respaldo no comprobado es solo una esperanza. La restauración debe ensayarse periódicamente.

## Flujo recomendado al diseñar persistencia

1. Enumera las entidades y las reglas que nunca deben romperse.
2. Escribe las consultas principales antes de optimizar el esquema.
3. Protege reglas con tipos, restricciones y claves en la base.
4. Usa transacciones para cambios que forman una sola operación de negocio.
5. Mide consultas reales y crea índices según sus planes de ejecución.
6. Diseña migraciones compatibles con despliegues graduales.
7. Automatiza copias y demuestra que pueden restaurarse.
