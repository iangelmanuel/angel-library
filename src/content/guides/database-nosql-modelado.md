---
title: NoSQL y modelado por patrones de acceso
description: Elegir documentos, clave-valor o relaciones según consistencia, consultas y crecimiento, con criterios para embeber o referenciar datos.
category: database
stack: database-nosql
order: 1
tags: [nosql, mongodb, documents, key-value, modeling]
related:
  - guides/database-fundamentals-terminology
  - guides/database-modelado-relacional
updatedAt: 2026-08-19
---

**NoSQL** agrupa modelos que no se presentan principalmente como tablas relacionales. No significa “sin esquema”: la forma de los datos sigue existiendo y debe validarse, versionarse y migrarse.

## Elegir por necesidad

| Modelo | Fortalezas | Caso frecuente |
| --- | --- | --- |
| Clave-valor | Lectura por clave, expiración, baja latencia | Caché, sesión, rate limiting |
| Documentos | Agregados JSON y forma flexible | Catálogos o perfiles con campos variables |
| Grafos | Recorridos de relaciones | Redes, permisos o recomendaciones |
| Series temporales | Escrituras ordenadas por tiempo | Métricas y telemetría |

Una base documental no reemplaza automáticamente a una relacional. Si predominan transacciones entre varias entidades, restricciones complejas y reportes con joins, el modelo relacional puede ser más directo.

## Embeber o referenciar

```json
{
  "_id": "order_123",
  "customerId": "user_9",
  "shippingAddress": {
    "city": "Bogotá",
    "country": "CO"
  },
  "items": [
    { "productId": "p_1", "name": "Teclado", "unitPrice": 120, "quantity": 1 }
  ]
}
```

Embeber favorece lecturas atómicas de un agregado que se consulta junto y conserva una fotografía histórica. Referenciar favorece entidades grandes, compartidas o que cambian por separado. Evita arrays sin límite dentro de un documento: pueden crecer indefinidamente y encarecer cada actualización.

## Consistencia y caché

Una caché es una copia derivada, no la fuente de verdad. Define:

- clave y alcance del dato;
- **TTL** (*Time To Live* o tiempo de vida);
- estrategia de invalidación;
- comportamiento ante ausencia o caída;
- protección contra avalanchas de solicitudes simultáneas.

Para datos críticos, escribe primero en la fuente de verdad y actualiza o invalida la caché. Una lectura obsoleta puede ser aceptable en un catálogo, pero no necesariamente en permisos o saldos.

## Referencias

- [MongoDB: modelado de datos](https://www.mongodb.com/docs/manual/data-modeling/)
- [MongoDB: embeber o referenciar](https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/)

