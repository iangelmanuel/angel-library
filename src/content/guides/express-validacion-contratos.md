---
title: Validación y contratos de entrada
description: Validar params, query y body antes del negocio, diferenciar parsing de validación y devolver errores útiles sin confiar en TypeScript.
category: backend
stack: express
order: 4
tags: [express, validation, api, typescript]
scope: validación HTTP
related:
  - practices/validate-at-boundaries
  - libraries/express-validator
  - libraries/zod
updatedAt: 2026-08-25
---

`express.json()` convierte bytes JSON en un valor JavaScript. Eso es **parsing**, no validación. El body puede seguir siendo `null`, un arreglo, incluir campos inesperados o contener strings fuera de los límites del negocio.

## Validar en la frontera

```ts
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  age: z.coerce.number().int().min(13).max(120).optional(),
}).strict();

type CreateUserInput = z.infer<typeof createUserSchema>;

declare global {
  namespace Express {
    interface Request {
      validatedBody?: CreateUserInput;
    }
  }
}

app.post('/users', (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Revisa los datos enviados',
        fields: result.error.flatten().fieldErrors,
      },
    });
  }

  req.validatedBody = result.data;
  next();
});
```

Después de `safeParse`, `result.data` es el dato transformado y validado. Usa ese valor; no vuelvas a leer `req.body`, porque conservaría la entrada original.

El ejemplo amplía el tipo `Express.Request` mediante **declaration merging** o fusión de declaraciones. En una aplicación real, esa ampliación suele vivir en un archivo `.d.ts`. Otra opción es ejecutar el caso de uso en el mismo handler y pasar `result.data` directamente, evitando estado adicional en `req`.

## Las cuatro entradas

- **params:** valida formato de identificadores antes de consultar.
- **query:** transforma strings de paginación y aplica máximos.
- **body:** limita bytes en el parser y luego valida estructura.
- **headers:** valida versiones, firmas o claves requeridas.

La validación estructural no reemplaza reglas de negocio. “El email tiene formato válido” es estructura; “el email no está registrado” requiere consultar el dominio o la base.

## Coerción con cuidado

Query params llegan como texto. La coerción es útil, pero algunos valores sorprendentes pueden convertirse de manera válida. Define explícitamente qué formatos aceptas y comprueba `Number.isInteger`, rangos y valores enumerados.

```ts
const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'name']).default('createdAt'),
});
```

## TypeScript no protege la red

```ts
const input = req.body as CreateUserInput;
```

Una aserción `as` solo silencia al compilador. No cambia ni inspecciona el dato. Genera tipos desde el schema o mantenlos alineados con pruebas de contrato.

## Errores útiles y seguros

Devuelve un código estable para el programa cliente, un mensaje entendible y errores por campo cuando corresponda. No expongas detalles del ORM, stack trace, SQL ni reglas internas de autorización.

## Límites antes del schema

```ts
app.use(express.json({ limit: '100kb', type: 'application/json' }));
```

El límite del parser evita acumular bodies enormes. Para archivos usa streaming o carga directa a object storage; no amplíes el límite JSON para recibir base64 sin evaluar costo de memoria.
