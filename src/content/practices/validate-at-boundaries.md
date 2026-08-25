---
title: Validar en las fronteras del sistema
description: Valida datos cuando cruzan una frontera, en lugar de confiar en tipos internos o sistemas externos.
category: architecture
stack: principios
order: 9
practice: Validar requests, formularios, variables de entorno y respuestas de terceros antes de usarlas.
why: Los tipos de TypeScript desaparecen en runtime y las fronteras reciben datos que no controlamos.
related:
  - libraries/zod
updatedAt: 2026-08-25
---

## Fronteras típicas

```text
request HTTP → schema → lógica de negocio
FormData     → schema → valores tipados
env vars     → schema → configuración
API externa  → schema → UI o persistencia
```

El objetivo no es validar cada variable interna, sino establecer límites claros y confiables.

## Parsing, validación y regla de negocio

- **Parsing:** convierte bytes o texto a una estructura.
- **Validación:** comprueba forma, tipo, rango y campos permitidos.
- **Regla de negocio:** decide si la operación es válida en el dominio.

```ts
const result = createOrderSchema.safeParse(await request.json());
if (!result.success) return validationError(result.error);

// A partir de aquí se usa result.data, no el body original.
return createOrder({ actor, input: result.data });
```

TypeScript no inspecciona datos en runtime. Una aserción `as Input` solo cambia lo que cree el compilador.

## También al salir

Valida respuestas de terceros, mensajes de cola y datos antiguos cuando su origen o versión no es confiable. Al serializar una API pública, un schema de salida evita filtrar columnas internas por accidente.

## Límites antes del schema

El schema no evita que el servidor acumule un body de varios gigabytes. Limita bytes, cantidad de archivos, profundidad, tiempo y concurrencia en la capa capaz de hacerlo.

## Regla práctica

Después de la frontera, pasa un valor validado y pequeño. No arrastres objetos de request, ORM o SDK hacia el núcleo del sistema.
