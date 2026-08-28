---
title: Modelado relacional, claves y restricciones
description: Convertir reglas de negocio en entidades, relaciones, claves y restricciones; normalizar el esquema y diseñar historial sin perder los casos de uso.
category: database
stack: database-modelado
order: 1
tags: [database, modelado, relaciones, constraints, normalizacion]
related:
  - guides/database-fundamentals-terminology
  - guides/database-sql-consultas
  - guides/postgresql-transacciones-concurrencia
updatedAt: 2026-08-28
---

Modelar es decidir **qué hechos guarda el sistema, cómo se relacionan y qué reglas nunca debe romper**. La interfaz puede validar primero, pero la base de datos es la última frontera: varios procesos, scripts o servicios pueden escribir al mismo tiempo.

## Para aprender y para recordar

Si estás aprendiendo, comienza con las reglas escritas en lenguaje natural y dibuja entidades y cardinalidades antes de crear tablas. Si vienes a recordar, usa esta secuencia:

```text
reglas → entidades → relaciones → cardinalidad → claves
       → tipos y constraints → consultas → índices → historial
```

Un buen modelo no intenta adivinar todas las necesidades futuras. Representa correctamente los hechos conocidos y permite evolucionar mediante migraciones.

## Entidad, atributo y relación

- Una **entidad** tiene identidad propia: usuario, producto o pedido.
- Un **atributo** describe una entidad: correo, nombre o fecha.
- Una **relación** conecta entidades: un usuario realiza pedidos.
- La **cardinalidad** indica cuántas instancias pueden participar.

| Cardinalidad | Ejemplo | Implementación habitual |
| --- | --- | --- |
| uno a uno (`1:1`) | usuario y perfil privado | FK con `UNIQUE` en una de las tablas |
| uno a muchos (`1:N`) | usuario y pedidos | FK en el lado “muchos” |
| muchos a muchos (`N:M`) | pedidos y productos | tabla intermedia con dos FK |

La **opcionalidad** también importa. “Un pedido debe pertenecer a un usuario” produce una FK `NOT NULL`; “un usuario puede tener perfil” permite que todavía no exista la fila relacionada.

## De una regla a un esquema

Supongamos que una persona puede realizar muchos pedidos y que cada pedido contiene productos:

```sql
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id bigint NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(12, 2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, product_id)
);
```

La tabla intermedia `order_items` resuelve una relación muchos a muchos y además conserva datos propios de esa relación. `unit_price` se guarda porque el precio histórico del pedido no debe cambiar si después cambia el catálogo.

### Visualizar la cardinalidad

```text
users 1 ───── N orders 1 ───── N order_items N ───── 1 products
```

`order_items` no es un arreglo escondido: es una entidad asociativa. Puede tener cantidad, precio, descuento y trazabilidad. Su clave compuesta impide repetir el mismo producto dentro del pedido; si el dominio permite varias líneas del mismo producto, usa un `id` propio o un número de línea y cambia la unicidad.

## Restricciones que expresan intención

| Restricción | Qué garantiza | Caso habitual |
| --- | --- | --- |
| `PRIMARY KEY` | Identidad única y no nula | Identificar un pedido |
| `FOREIGN KEY` | La referencia existe | El pedido pertenece a un usuario real |
| `UNIQUE` | No hay duplicados en una clave candidata | Correo o slug |
| `NOT NULL` | El dato es obligatorio | Estado del pedido |
| `CHECK` | El valor cumple una condición | Cantidad positiva |
| `DEFAULT` | Proporciona un valor inicial | Fecha de creación |

Una clave foránea no crea automáticamente todos los índices que necesita una consulta. Si se buscan pedidos por `user_id`, normalmente se agrega `CREATE INDEX ON orders(user_id)`.

## Acciones de una clave foránea

La acción `ON DELETE` debe representar la regla, no una comodidad:

| Acción | Qué ocurre | Caso apropiado |
| --- | --- | --- |
| `RESTRICT` / `NO ACTION` | impide eliminar mientras existan referencias | catálogo con pedidos históricos |
| `CASCADE` | elimina filas dependientes | líneas que no tienen sentido sin su pedido |
| `SET NULL` | conserva la fila y elimina la referencia | autor opcional de un comentario |

Evita cascadas largas entre muchas tablas: una eliminación pequeña puede convertirse en una operación masiva difícil de observar. Para información legal o auditable suele conservarse el registro y controlar su estado.

## Claves simples, compuestas y candidatas

Una **clave candidata** identifica de manera única una entidad. La PK es la elegida como identidad principal; las demás se protegen con `UNIQUE`.

```sql
CREATE TABLE subscriptions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id),
  plan_id bigint NOT NULL REFERENCES plans(id),
  starts_on date NOT NULL,
  ends_on date,
  UNIQUE (user_id, plan_id, starts_on),
  CHECK (ends_on IS NULL OR ends_on >= starts_on)
);
```

La PK sustituta simplifica referencias externas. La restricción compuesta conserva la regla del negocio. Agregar un `id` y olvidar la unicidad real solo permite duplicados con identificadores diferentes.

## Normalizar sin perder el caso de uso

La **normalización** reduce duplicación y dependencias inconsistentes. Como regla práctica:

1. Cada columna representa un valor atómico útil para consultar.
2. Cada fila representa una entidad o relación identificable.
3. Un dato derivable no se duplica sin una razón de rendimiento o historial.

| Forma | Pregunta práctica | Problema que evita |
| --- | --- | --- |
| 1NF | ¿Cada celda contiene un valor y no una lista reutilizable? | columnas `phone_1`, `phone_2` o CSV difícil de consultar |
| 2NF | ¿Cada atributo depende de toda la clave compuesta? | repetir datos del producto en una línea identificada por pedido y producto |
| 3NF | ¿Los atributos no clave dependen solo de la identidad? | guardar `city_name` que depende de `city_id` en cada usuario |

Las formas normales son herramientas para detectar dependencias, no un concurso académico. Una dirección de envío copiada dentro de un pedido puede ser desnormalización correcta porque representa una fotografía histórica, no el perfil actual del cliente.

La **desnormalización** puede ser válida para lectura intensiva, pero debe definir quién actualiza la copia y cómo se repara una divergencia. Primero diseña una fuente de verdad clara; optimiza después de medir.

## Modelar estados e historial

Un booleano deja de ser suficiente cuando el proceso tiene varios estados. `is_done` no explica si algo fue cancelado, rechazado o expiró.

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  status text NOT NULL CHECK (
    status IN ('draft', 'pending', 'paid', 'cancelled', 'refunded')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_status_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES orders(id),
  from_status text,
  to_status text NOT NULL,
  changed_by bigint REFERENCES users(id),
  changed_at timestamptz NOT NULL DEFAULT now()
);
```

La tabla principal guarda el estado actual para consultar rápido; el historial responde quién cambió qué y cuándo. Si la auditoría es crítica, define quién puede insertar y evita que usuarios ordinarios modifiquen eventos anteriores.

## Eliminación lógica y datos temporales

La **eliminación lógica** añade `deleted_at` en vez de borrar. Ayuda con recuperación e historial, pero complica todas las consultas, unicidad, privacidad y almacenamiento. No debe ser el valor predeterminado para cada tabla.

```sql
CREATE UNIQUE INDEX users_email_active_unique
ON users (lower(email))
WHERE deleted_at IS NULL;
```

Para historial completo también existen modelos temporales —filas con `valid_from` y `valid_to`— o eventos inmutables. Elige según las preguntas que debas responder; no agregues auditoría sin política de retención y acceso.

## Multi-tenancy

En una aplicación **multi-tenant**, varias organizaciones comparten el sistema. Un modelo común añade `tenant_id` a cada entidad propiedad de una organización y lo incluye en restricciones e índices.

```sql
CREATE TABLE projects (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id bigint NOT NULL REFERENCES tenants(id),
  slug text NOT NULL,
  name text NOT NULL,
  UNIQUE (tenant_id, slug)
);
```

Filtrar `tenant_id` solo en el frontend es una vulnerabilidad. Debe aplicarse en la capa de acceso y, cuando corresponde, reforzarse con permisos o **RLS** (*Row-Level Security* o seguridad por fila) en PostgreSQL.

## Del esquema a las consultas

Antes de cerrar el modelo, escribe los casos de lectura y escritura más importantes:

```text
- listar pedidos pagados de un usuario por fecha;
- obtener un pedido con sus líneas;
- descontar stock sin dejarlo negativo;
- encontrar productos sin ventas en 90 días;
- eliminar o anonimizar datos personales de una cuenta.
```

Estas preguntas revelan relaciones, historial, restricciones e índices. Diseñar solamente desde una pantalla suele omitir procesos de administración, reportes y recuperación.

## Preguntas antes de crear una tabla

- ¿Cuál es su identidad estable?
- ¿Qué campos son obligatorios y cuáles distinguen duplicados?
- ¿Qué debe ocurrir al eliminar una entidad relacionada: restringir, conservar o eliminar en cascada?
- ¿Qué valores cambian con el tiempo y cuáles deben conservar historial?
- ¿Qué consultas frecuentes condicionan índices o particiones?
- ¿Qué significado tiene `NULL` en cada columna opcional?
- ¿Qué información es una fotografía histórica y cuál debe reflejar el valor actual?
- ¿Quién es propietario del dato y cómo se aísla entre organizaciones?
- ¿Cómo se corrige, elimina o anonimiza el dato?

## Ejercicio guiado

Para modelar una biblioteca:

1. `books` representa la obra o edición que se presta.
2. `members` identifica a quien puede solicitarla.
3. `loans` relaciona ambos y guarda `borrowed_at`, `due_at` y `returned_at`.
4. `returned_at IS NULL` significa préstamo activo.
5. Una restricción comprueba `due_at >= borrowed_at`.
6. Un índice parcial puede evitar dos préstamos activos de la misma copia.

```sql
CREATE UNIQUE INDEX one_active_loan_per_book
ON loans (book_id)
WHERE returned_at IS NULL;
```

El ejemplo muestra la idea principal: modelar no es dibujar tablas, sino convertir una regla en una garantía verificable.

## Referencias

- [PostgreSQL: constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

