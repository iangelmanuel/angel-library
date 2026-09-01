---
title: Patrones de modelado relacional
description: Resolver jerarquías, etiquetas, direcciones, estados, metadatos y límites entre agregados con patrones que evolucionan sin perder integridad.
type: guides
order: 2
tags: [database, modelado, patrones, jerarquias, historial]
related:
  - database/database-modelado/database-modelado-relacional
  - database/database-fundamentos/database-data-integrity-types-null
  - database/database-sql/database-sql-consultas
updatedAt: 2026-08-28
---

Los patrones de modelado son soluciones recurrentes, no plantillas universales. Antes de aplicarlos, identifica las reglas, el crecimiento esperado y las consultas que deben ser sencillas.

## Referencia rápida

| Necesidad | Patrón inicial |
| --- | --- |
| etiquetas reutilizables | tabla `tags` + tabla intermedia |
| árbol pequeño y mutable | referencia `parent_id` a la misma tabla |
| conservar cambios de estado | tabla actual + historial de transiciones |
| atributos realmente variables | columnas comunes + `jsonb` validado |
| una entidad con varios tipos | tabla base + tablas específicas |
| archivos | metadatos en DB, bytes en object storage |
| contador derivable | calcular primero; materializar solo si medir lo justifica |

## Etiquetas y muchos a muchos

```sql
CREATE TABLE tags (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE post_tags (
  post_id bigint NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES tags(id) ON DELETE RESTRICT,
  PRIMARY KEY (post_id, tag_id)
);
```

Guardar `"css,javascript,web"` en una columna parece sencillo, pero dificulta validar, renombrar, contar y buscar coincidencias exactas. Un arreglo puede ser válido para valores locales que nunca tendrán propiedades ni relaciones; una tabla intermedia es mejor cuando la etiqueta es una entidad compartida.

## Árboles con lista de adyacencia

```sql
CREATE TABLE categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  parent_id bigint REFERENCES categories(id),
  name text NOT NULL,
  CHECK (parent_id IS DISTINCT FROM id)
);
```

Este patrón guarda el padre inmediato y es fácil de modificar. Una CTE recursiva recorre descendientes. Para árboles muy profundos con muchas lecturas pueden evaluarse *materialized path*, *closure table* o tipos específicos del gestor, aceptando mayor complejidad de escritura.

## Direcciones e instantáneas

El perfil de un usuario puede tener una dirección actual, pero un pedido necesita conservar la dirección usada al comprar. Referenciar solamente `user_addresses.id` haría que el pedido histórico cambie al editar el perfil.

Opciones:

- copiar los campos de envío al pedido como fotografía inmutable;
- versionar direcciones y referenciar la versión;
- guardar un agregado JSON validado si sus campos varían por país.

La duplicación es correcta cuando los dos datos expresan hechos distintos: “dirección actual” y “dirección utilizada en este pedido”.

## Subtipos y polimorfismo

Supón que una cuenta puede ser personal o empresarial. Una FK “polimórfica” con `owner_type` y `owner_id` no puede garantizar fácilmente que el destino exista. Un modelo más seguro usa una tabla base:

```sql
CREATE TABLE accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('person', 'company'))
);

CREATE TABLE person_accounts (
  account_id bigint PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  first_name text NOT NULL
);

CREATE TABLE company_accounts (
  account_id bigint PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  legal_name text NOT NULL
);
```

Esto conserva integridad, aunque la aplicación todavía debe asegurar que el subtipo coincida con `kind`. Otra opción es mantener tablas separadas cuando casi no comparten comportamiento.

## Metadatos flexibles sin abandonar el esquema

`jsonb` funciona bien para propiedades opcionales y poco consultadas que cambian por integración. Mantén como columnas normales lo obligatorio, relacionable o usado en filtros frecuentes.

```sql
CREATE TABLE integrations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  provider text NOT NULL,
  external_id text NOT NULL,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (provider, external_id),
  CHECK (jsonb_typeof(settings) = 'object')
);
```

Versiona la forma de `settings`, valida en la aplicación y migra documentos antiguos. “Flexible” no significa que cada fila pueda tener una semántica desconocida.

## Contadores y valores derivados

`comments_count` puede calcularse con `COUNT(*)`, mantenerse con eventos o actualizarse en una transacción. Guardarlo mejora lecturas, pero introduce una segunda representación que puede divergir.

Antes de materializar, pregunta:

1. ¿La consulta medida es realmente lenta?
2. ¿Qué retraso es aceptable?
3. ¿Quién actualiza el contador?
4. ¿Cómo se recalcula si falla?

Una vista materializada o un job periódico puede ser mejor que actualizar cada escritura. Para saldos financieros, un libro de movimientos inmutable y una reconciliación ofrecen más trazabilidad que un contador sin historial.

## Archivos y contenido binario

Para archivos grandes, suele guardarse el objeto en almacenamiento especializado y en la base solo metadatos y una clave:

```sql
CREATE TABLE files (
  id uuid PRIMARY KEY,
  storage_key text NOT NULL UNIQUE,
  content_type text NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes >= 0),
  checksum text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

El flujo debe manejar estados parciales: archivo subido sin fila o fila creada sin archivo. Usa identificadores idempotentes, limpieza de huérfanos y verificación de checksum.

## Antipatrones que conviene reconocer

- **EAV** (*Entity-Attribute-Value*) para cualquier dato: ofrece flexibilidad, pero pierde tipos, constraints y consultas claras.
- tablas como `users_2026_01` creadas manualmente: sustituyen particionamiento por lógica frágil;
- una columna por cada elemento de una lista (`phone_1`, `phone_2`);
- FK polimórficas sin integridad;
- duplicar datos sin dueño ni mecanismo de reparación;
- guardar secretos o archivos enormes en JSON porque “acepta todo”.

## Cómo evaluar un patrón

Comprueba integridad, facilidad de lectura, costo de escritura, crecimiento, migración y recuperación. El patrón correcto permite explicar dónde vive la fuente de verdad y cómo detectar una divergencia.

## Referencias

- [PostgreSQL: consultas recursivas con WITH](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL: JSON](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL: restricciones](https://www.postgresql.org/docs/current/ddl-constraints.html)
