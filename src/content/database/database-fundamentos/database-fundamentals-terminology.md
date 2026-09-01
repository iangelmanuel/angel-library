---
title: Fundamentos y terminología de bases de datos
description: Modelo mental para entender persistencia, SQL, esquemas, índices, transacciones y las decisiones más comunes al almacenar información.
type: guides
tags: [bases-de-datos, sql, persistencia, fundamentos, glosario]
order: 1
updatedAt: 2026-08-28
---

Una **base de datos** es un sistema organizado para conservar información y consultarla después. Guardar datos no consiste únicamente en escribir un archivo: una aplicación suele necesitar búsquedas, relaciones, validación, acceso simultáneo, copias de seguridad y reglas que eviten estados imposibles.

El **DBMS** (*Database Management System* o sistema gestor de bases de datos) es el software que administra esos datos. PostgreSQL, MySQL, SQLite y MongoDB son ejemplos de gestores; la base de datos es la información organizada que vive dentro de ellos.

## Aprende o consulta

La ruta recomendada es: datos y restricciones → modelado relacional → SQL → joins y agregaciones → índices/EXPLAIN → transacciones → pool y operación → migraciones y recuperación. No empieces optimizando índices sin conocer las consultas ni adoptes NoSQL solo para evitar diseñar relaciones.

| Necesito recordar | Documento |
| --- | --- |
| claves, cardinalidad y constraints | [Modelado relacional](/database/database-modelado/database-modelado-relacional) |
| tipos, `NULL` e integridad | [Tipos de datos e integridad](/database/database-fundamentos/database-data-integrity-types-null) |
| SELECT, JOIN, GROUP BY y CTE | [SQL práctico](/database/database-sql/database-sql-consultas) |
| INSERT, UPDATE, DELETE y transacciones | [Escritura segura con SQL](/database/database-sql/database-sql-escritura-datos) |
| ventanas, subconsultas y operaciones de conjuntos | [SQL avanzado](/database/database-sql/database-sql-avanzado) |
| índices y planes | [Índices y EXPLAIN](/database/database-sql/database-indices-explain) |
| atomicidad, aislamiento y bloqueos | [Transacciones en PostgreSQL](/database/database-postgresql/postgresql-transacciones-concurrencia) |
| tipos, JSONB y consultas seguras | [PostgreSQL práctico](/database/database-postgresql/postgresql-practico) |
| VACUUM, roles y seguridad | [Mantenimiento y seguridad en PostgreSQL](/database/database-postgresql/postgresql-mantenimiento-seguridad) |
| documentos y agregaciones | [MongoDB práctico](/database/database-nosql/database-mongodb-practico) |
| caché, TTL y estructuras | [Redis práctico](/database/database-nosql/database-redis-practico) |
| conexiones, pool y fallos | [Operación confiable](/database/database-operacion/database-pooling-reliability) |
| cambios y recuperación | [Migraciones y backups](/database/database-operacion/database-migraciones-backups) |

Aprender exige ejecutar consultas y observar resultados. Recordar exige conocer la forma correcta y comprobar el plan, las restricciones y la concurrencia del caso real.

## El modelo mental mínimo

Una aplicación envía una operación al gestor, el gestor comprueba permisos y reglas, localiza los datos y devuelve un resultado. No conviene pensar en la base de datos como una variable global remota: tiene su propio modelo de concurrencia, costos de entrada y salida y mecanismos de integridad.

| Término | Significado | Ejemplo |
| --- | --- | --- |
| Persistencia | Conservar datos más allá de la ejecución actual | Una cuenta sigue existiendo después de reiniciar el servidor |
| Esquema | Estructura y reglas de los datos | `email` es texto, único y obligatorio |
| Consulta o *query* | Petición para leer o modificar datos | Buscar pedidos pendientes de una persona |
| Restricción o *constraint* | Regla aplicada por el gestor | Impedir dos usuarios con el mismo correo |
| Integridad | Garantía de que los datos mantienen reglas válidas | Un pedido no referencia un cliente inexistente |

Una aplicación normalmente no accede al archivo físico de la base. Utiliza un **driver** —la biblioteca que implementa el protocolo del gestor— para abrir una conexión, autenticar una identidad y enviar sentencias. El servidor analiza la consulta, decide un plan, lee o modifica páginas de datos y responde. Por eso una consulta tiene costos de red, CPU, memoria, disco y bloqueo, incluso si desde JavaScript parece una simple función.

```text
interfaz → API → driver/pool → gestor → memoria y almacenamiento
                         └── permisos, transacciones e índices
```

El **esquema lógico** describe tablas, campos y reglas. El **almacenamiento físico** describe páginas, archivos, índices y registros de transacciones. La aplicación suele diseñar el primero; el gestor decide gran parte del segundo.

## OLTP y OLAP: dos tipos de carga

**OLTP** (*Online Transaction Processing* o procesamiento de transacciones en línea) describe muchas operaciones pequeñas y concurrentes: crear un pedido, cambiar una contraseña o descontar inventario. Busca baja latencia, integridad y transacciones cortas.

**OLAP** (*Online Analytical Processing* o procesamiento analítico en línea) describe consultas que recorren y agregan grandes volúmenes para informes, tendencias o inteligencia de negocio. Puede usar almacenes columnares, réplicas analíticas o un *data warehouse* para no competir con el tráfico operativo.

| Pregunta | OLTP | OLAP |
| --- | --- | --- |
| Unidad típica | Una entidad o transacción | Miles o millones de filas |
| Patrón | Muchas lecturas/escrituras breves | Pocas consultas pesadas |
| Modelo frecuente | Normalizado | Estrella o datos preparados para análisis |
| Ejemplo | Confirmar una compra | Ventas mensuales por región |

No es una elección absoluta: un producto puede necesitar ambos flujos, pero conviene separarlos cuando los reportes afectan la operación principal.

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

También es válido combinar motores: PostgreSQL como fuente de verdad, Redis como caché y un buscador para texto completo. Esto se llama **persistencia políglota**. Aporta capacidades especializadas, pero aumenta migraciones, observabilidad y recuperación; cada copia necesita una fuente de verdad y una estrategia de sincronización.

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

Una **clave candidata** es cualquier conjunto mínimo de columnas que podría identificar una fila, como un correo único. Entre ellas se elige una clave primaria. Una clave **natural** usa un dato del dominio; una clave **sustituta** usa un identificador técnico como `id`. La clave sustituta suele ser estable, pero no reemplaza la restricción `UNIQUE` de los datos que tampoco deben duplicarse.

## `NULL` no significa vacío

`NULL` representa un valor desconocido o ausente. No equivale a `0`, `false` ni una cadena vacía. SQL utiliza lógica de tres valores: una comparación con `NULL` suele producir “desconocido”, no `true` o `false`.

```sql
-- Incorrecto: nunca encuentra NULL.
SELECT * FROM users WHERE deleted_at = NULL;

-- Correcto.
SELECT * FROM users WHERE deleted_at IS NULL;
```

Usa `NOT NULL` cuando la ausencia no tenga significado válido. Si una columna acepta `NULL`, documenta qué representa. Evita valores centinela como `-1`, `N/A` o fechas ficticias: mezclan datos reales con códigos ocultos.

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

## Errores frecuentes al comenzar

- Confiar toda la validación a la interfaz y dejar la base sin restricciones.
- Guardar listas separadas por comas en una columna que después necesita relaciones o filtros.
- usar `SELECT *` como contrato permanente entre servicios;
- crear un índice para cada columna sin observar las consultas reales;
- mantener transacciones abiertas durante llamadas a otras APIs;
- considerar una réplica como backup;
- almacenar secretos, contraseñas sin hash o datos personales sin política de retención.

La pregunta útil no es solamente “¿dónde guardo este dato?”, sino “¿qué significa, quién puede cambiarlo, qué regla lo protege, cómo se consulta y cómo se recupera?”.

## Referencias

- [Tutorial oficial de PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html)
- [MongoDB: proceso de modelado de datos](https://www.mongodb.com/docs/manual/data-modeling/schema-design-process/)
- [Redis: tipos de datos](https://redis.io/docs/latest/develop/data-types/)
