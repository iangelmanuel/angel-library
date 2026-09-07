---
title: MongoDB práctico — documentos, índices y agregaciones
description: Modelar documentos de MongoDB, validar esquemas, consultar, actualizar, crear índices y utilizar pipelines de agregación con criterios de consistencia.
type: guides
order: 2
tags: [mongodb, nosql, documentos, aggregation, indexes]
related:
  - database/database-nosql/database-nosql-modelado
  - database/database-modelado/database-modelado-relacional
  - database/database-sql/database-indices-explain
updatedAt: 2026-08-28
---

MongoDB almacena documentos BSON en colecciones. **BSON** (_Binary JSON_) es un formato binario con tipos adicionales como fechas, `ObjectId` y decimales. Un documento flexible sigue necesitando una forma entendida por productores y consumidores.

## Traducción mental desde SQL

| Relacional | MongoDB                       | Matiz                                                |
| ---------- | ----------------------------- | ---------------------------------------------------- |
| tabla      | colección                     | los documentos pueden variar de forma                |
| fila       | documento                     | contiene campos y estructuras anidadas               |
| columna    | campo                         | puede no existir en todos los documentos             |
| PK         | `_id`                         | es único e indexado                                  |
| join       | `$lookup` o modelado embebido | se usa con intención, no como base de todo el modelo |
| `GROUP BY` | `$group` en aggregation       | forma parte de un pipeline                           |

## Diseñar un documento

```javascript
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  status: "paid",
  shippingAddress: {
    city: "Bogotá",
    country: "CO"
  },
  items: [
    {
      productId: ObjectId("..."),
      name: "Teclado",
      unitPriceCents: 120000,
      quantity: 1
    }
  ],
  createdAt: ISODate("2026-08-28T15:00:00Z")
}
```

El pedido es un **agregado**: dirección e ítems se leen juntos y representan la compra histórica. `customerId` referencia una entidad compartida. Evita que `items` crezca sin límite; para conversaciones, logs o historiales extensos suele convenir otra colección o un patrón de segmentos.

## Embeber o referenciar

Embeber cuando:

- los datos se consultan y actualizan como una unidad;
- la cantidad está acotada;
- necesitas atomicidad de un solo documento;
- la copia representa una fotografía histórica.

Referenciar cuando:

- la entidad se comparte en muchos lugares;
- cambia independientemente;
- puede crecer sin límite;
- necesitas consultarla por sí misma.

No intentes eliminar toda duplicación. Documenta qué copia es histórica, cuál debe sincronizarse y cuál es la fuente de verdad.

## Validación de esquema

MongoDB puede validar documentos con JSON Schema:

```javascript
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "status", "items", "createdAt"],
      properties: {
        status: {
          enum: ["pending", "paid", "cancelled"]
        },
        items: {
          bsonType: "array",
          minItems: 1
        },
        createdAt: {
          bsonType: "date"
        }
      }
    }
  }
})
```

La validación de la aplicación ofrece mensajes de dominio; la colección evita que otros procesos inserten formas imposibles. Evoluciona el validador junto con migraciones y versiones antiguas.

## CRUD esencial

```javascript
const order = await db.collection("orders").insertOne({
  customerId,
  status: "pending",
  items,
  createdAt: new Date()
})

const recent = await db
  .collection("orders")
  .find({ customerId, status: "paid" })
  .project({ status: 1, createdAt: 1, totalCents: 1 })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
  .toArray()
```

`find` define el filtro; `project` limita campos; `sort` necesita un desempate estable; `limit` acota el resultado. Nunca construyas operadores desde objetos externos sin validar: propiedades como `$where`, `$gt` o claves inesperadas pueden cambiar la consulta.

## Actualizaciones y operadores

```javascript
const result = await db.collection("products").findOneAndUpdate(
  { _id: productId, stock: { $gte: quantity } },
  {
    $inc: { stock: -quantity },
    $set: { updatedAt: new Date() }
  },
  { returnDocument: "after" }
)
```

`$inc` modifica atómicamente el número en el documento. `$set` cambia campos concretos; `$unset` los elimina; `$push` añade a un arreglo y `$addToSet` evita repetir un valor exacto. Aun con operaciones atómicas, limita arreglos y comprueba si el filtro encontró documento.

## Índices desde consultas

```javascript
db.orders.createIndex(
  { customerId: 1, createdAt: -1, _id: -1 },
  { name: "orders_customer_recent" }
)

db.users.createIndex({ email: 1 }, { unique: true, name: "users_email_unique" })
```

Los índices compuestos respetan orden y prefijos. Un índice **multikey** indexa campos de arrays; tiene restricciones al combinar varios arrays. Un índice único protege integridad, pero revisa cómo trata documentos sin el campo y valores nulos. Usa `explain("executionStats")` para comparar claves y documentos examinados.

Demasiados índices aumentan RAM, almacenamiento y costo de cada escritura. Conserva únicamente los que protegen reglas o respaldan consultas relevantes.

## Pipeline de agregación

```javascript
db.orders.aggregate([
  {
    $match: {
      status: "paid",
      createdAt: { $gte: ISODate("2026-08-01T00:00:00Z") }
    }
  },
  {
    $group: {
      _id: "$customerId",
      orders: { $sum: 1 },
      revenueCents: { $sum: "$totalCents" }
    }
  },
  { $sort: { revenueCents: -1 } },
  { $limit: 20 }
])
```

Un **pipeline** transforma documentos etapa por etapa. Coloca filtros selectivos temprano para reducir trabajo. `$project` cambia la forma, `$unwind` genera una salida por elemento de array, `$lookup` combina colecciones y `$facet` ejecuta varias ramas. Observa uso de memoria, disco e índices en pipelines grandes.

## Atomicidad y transacciones

Una modificación de un solo documento es atómica. Esto favorece embeber datos que forman una unidad. MongoDB también permite transacciones multidocumento en configuraciones compatibles, pero agregan costo y no compensan un modelo que fragmenta cada agregado sin necesidad.

Usa transacción cuando varios cambios deben confirmarse juntos. Manténla corta, usa la misma sesión y trata errores/reintentos recomendados por el driver.

## Consistencia y réplicas

- **write concern** define qué confirmación exige una escritura;
- **read concern** define garantías de la lectura;
- **read preference** elige qué miembros pueden atenderla.

No aumentes o reduzcas estas garantías sin describir el caso. Leer de una secundaria puede devolver datos atrasados; una confirmación más fuerte aumenta durabilidad y posiblemente latencia.

## Errores frecuentes

- una colección “sin esquema” con campos y tipos incompatibles;
- documento o array que crece indefinidamente;
- un índice por cada campo sin medir escrituras;
- duplicar datos sin reconciliación;
- pasar filtros JSON del cliente directamente al driver;
- usar `$lookup` para reconstruir en cada consulta un modelo completamente relacional;
- asumir que réplica equivale a backup.

## Referencias

- [MongoDB: proceso de diseño de esquema](https://www.mongodb.com/docs/manual/data-modeling/schema-design-process/)
- [MongoDB: validación de esquema](https://www.mongodb.com/docs/manual/core/schema-validation/)
- [MongoDB: índices](https://www.mongodb.com/docs/manual/indexes/)
- [MongoDB: aggregation](https://www.mongodb.com/docs/manual/aggregation/)
- [MongoDB: transacciones](https://www.mongodb.com/docs/manual/core/transactions/)
