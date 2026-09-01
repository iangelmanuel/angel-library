---
title: NoSQL y modelado por patrones de acceso
description: Elegir documentos, clave-valor o relaciones según consistencia, consultas y crecimiento, con criterios para embeber o referenciar datos.
type: guides
order: 1
tags: [nosql, mongodb, documents, key-value, modeling]
related:
  - database/database-fundamentos/database-fundamentals-terminology
  - database/database-modelado/database-modelado-relacional
updatedAt: 2026-08-28
---

**NoSQL** agrupa modelos que no se presentan principalmente como tablas relacionales. No significa “sin esquema”: la forma de los datos sigue existiendo y debe validarse, versionarse y migrarse.

## Cómo leer esta subcategoría

Esta página explica decisiones comunes a los modelos NoSQL. Después continúa con [MongoDB práctico](/database/database-nosql/database-mongodb-practico) para documentos y [Redis práctico](/database/database-nosql/database-redis-practico) para estructuras en memoria, expiración y caché.

Si solo quieres recordar: modela desde patrones de acceso, elige una clave que distribuya carga, define consistencia y crecimiento, y diseña migraciones aunque el motor sea flexible.

## Elegir por necesidad

| Modelo            | Fortalezas                                   | Caso frecuente                              |
| ----------------- | -------------------------------------------- | ------------------------------------------- |
| Clave-valor       | Lectura por clave, expiración, baja latencia | Caché, sesión, rate limiting                |
| Documentos        | Agregados JSON y forma flexible              | Catálogos o perfiles con campos variables   |
| Columnas anchas   | Escritura distribuida por clave de partición | grandes volúmenes con consultas predecibles |
| Grafos            | Recorridos de relaciones                     | Redes, permisos o recomendaciones           |
| Series temporales | Escrituras ordenadas por tiempo              | Métricas y telemetría                       |
| Búsqueda          | texto, relevancia y filtros especializados   | buscadores de productos o contenido         |

Una base documental no reemplaza automáticamente a una relacional. Si predominan transacciones entre varias entidades, restricciones complejas y reportes con joins, el modelo relacional puede ser más directo.

## Modelar desde patrones de acceso

En varios motores distribuidos, el esquema se diseña para preguntas conocidas:

```text
consulta → clave de acceso → distribución → forma del documento
         → índices → consistencia → tamaño máximo → migración
```

Escribe primero operaciones concretas: “obtener carrito por usuario”, “listar últimos eventos del dispositivo” o “recorrer amigos a dos saltos”. Una consulta nueva puede exigir un índice, una copia derivada o incluso otro modelo.

La **clave de partición** decide dónde vive un dato. Una clave con poca variedad —por ejemplo `country`— puede crear una partición caliente. Una clave demasiado aleatoria distribuye bien, pero puede dificultar consultas por rango. Evalúa distribución, cardinalidad y crecimiento por cliente.

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

## Consistencia, disponibilidad y particiones

En un sistema distribuido, una **partición de red** ocurre cuando nodos no pueden comunicarse aunque sigan activos. El modelo **CAP** ayuda a pensar qué sucede durante esa situación: preservar consistencia o disponibilidad para una operación concreta. No significa elegir para siempre “dos de tres”; las decisiones pueden variar por operación y configuración.

La **consistencia eventual** permite que réplicas converjan después. Es aceptable para contadores sociales o catálogos en algunos productos, pero peligrosa para autorización, inventario escaso o saldos. Define explícitamente:

- qué lectura puede estar obsoleta y durante cuánto;
- qué nodo confirma una escritura;
- cómo resuelve conflictos;
- si existe lectura “después de mi escritura”;
- qué ocurre al reintentar una operación incierta.

## Duplicación e integridad

NoSQL suele duplicar para leer sin joins. Cada copia necesita:

1. una fuente de verdad;
2. un evento o proceso de actualización;
3. idempotencia para mensajes repetidos;
4. una métrica de retraso o divergencia;
5. un proceso de reconciliación.

Una transacción distribuida no siempre es la mejor solución. A veces el dominio acepta estados intermedios y una **saga** con acciones compensatorias; otras veces la regla exige mantener todo en una base transaccional.

## Consistencia y caché

Una caché es una copia derivada, no la fuente de verdad. Define:

- clave y alcance del dato;
- **TTL** (_Time To Live_ o tiempo de vida);
- estrategia de invalidación;
- comportamiento ante ausencia o caída;
- protección contra avalanchas de solicitudes simultáneas.

Para datos críticos, escribe primero en la fuente de verdad y actualiza o invalida la caché. Una lectura obsoleta puede ser aceptable en un catálogo, pero no necesariamente en permisos o saldos.

## CAP no reemplaza otras decisiones

También importan latencia normal, costo, consultas, durabilidad, límites por documento, índices, backups, experiencia del equipo y dependencia del proveedor. **PACELC** amplía el razonamiento: incluso sin partición, un sistema distribuido suele intercambiar latencia por consistencia.

No memorices siglas como respuesta arquitectónica. Describe un escenario: “si dos regiones pierden comunicación, esta operación rechaza escrituras” o “acepta escrituras y reconcilia por versión”. Esa frase es verificable.

## Migraciones en esquemas flexibles

Los documentos antiguos no cambian porque despliegues código nuevo. Incluye una versión y tolera una ventana de convivencia:

```json
{
  "schemaVersion": 2,
  "name": { "first": "Ana", "last": "Pérez" }
}
```

Puedes migrar al leer, ejecutar un backfill o soportar ambas formas temporalmente. Elige según volumen, latencia y riesgo. Mide cuántos documentos quedan por convertir y evita un proceso que no pueda reanudarse.

## Lista de comprobación

- modelo elegido por consultas y garantías, no por evitar SQL;
- clave de partición con distribución comprobada;
- límites de crecimiento por documento o clave;
- validación y versión de esquema;
- consistencia definida por operación;
- duplicados con dueño y reconciliación;
- índices derivados de patrones de acceso;
- backups y restauración probados para ese motor.

## Referencias

- [MongoDB: modelado de datos](https://www.mongodb.com/docs/manual/data-modeling/)
- [MongoDB: embeber o referenciar](https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/)
- [Redis: tipos de datos](https://redis.io/docs/latest/develop/data-types/)
