---
title: Modelado relacional, claves y restricciones
description: Convertir reglas de negocio en tablas, relaciones y restricciones que impiden estados inválidos desde la base de datos.
category: database
stack: database-modelado
order: 1
tags: [database, modelado, relaciones, constraints, normalizacion]
related:
  - guides/database-fundamentals-terminology
  - guides/database-sql-consultas
  - guides/postgresql-transacciones-concurrencia
updatedAt: 2026-08-19
---

Modelar es decidir **qué hechos guarda el sistema y qué reglas nunca debe romper**. La interfaz puede validar primero, pero la base de datos es la última frontera: varios procesos, scripts o servicios pueden escribir al mismo tiempo.

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

## Normalizar sin perder el caso de uso

La **normalización** reduce duplicación y dependencias inconsistentes. Como regla práctica:

1. Cada columna representa un valor atómico útil para consultar.
2. Cada fila representa una entidad o relación identificable.
3. Un dato derivable no se duplica sin una razón de rendimiento o historial.

La **desnormalización** puede ser válida para lectura intensiva, pero debe definir quién actualiza la copia y cómo se repara una divergencia. Primero diseña una fuente de verdad clara; optimiza después de medir.

## Preguntas antes de crear una tabla

- ¿Cuál es su identidad estable?
- ¿Qué campos son obligatorios y cuáles distinguen duplicados?
- ¿Qué debe ocurrir al eliminar una entidad relacionada: restringir, conservar o eliminar en cascada?
- ¿Qué valores cambian con el tiempo y cuáles deben conservar historial?
- ¿Qué consultas frecuentes condicionan índices o particiones?

## Referencias

- [PostgreSQL: constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

