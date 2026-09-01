---
title: Zod
description: Validación de schemas con inferencia de tipos TypeScript — crear schemas, tipos de datos, refinamientos, parseo y manejo de errores.
type: libraries
order: 1
tags: [typescript, validation, schema, forms]
website: https://zod.dev
github: https://github.com/colinhacks/zod
install: npm install zod
related: [general/utils/form]
updatedAt: 2026-08-16
---

Zod valida datos en runtime y deriva el tipo TypeScript del schema — una sola fuente de verdad en vez de escribir el `interface` a mano y esperar que no se desincronice con la validación real.

## Crear un schema

`z.object()` describe la forma de un objeto. Cada propiedad es a su vez un schema — así se anidan.

```ts title="schemas/user.ts"
import { z } from "zod"

export const userSchema = z.object({
  email: z.email("Email no válido"),
  age: z.number().int().min(18, "Debes ser mayor de edad"),
  role: z.enum(["admin", "user"]).default("user"),
  website: z.url().optional()
})
```

Los objetos anidan sin nada especial: una propiedad que es otro `z.object()` valida su propia forma completa.

```ts
const addressSchema = z.object({
  street: z.string(),
  city: z.string()
})

const userWithAddressSchema = z.object({
  name: z.string(),
  address: addressSchema
})
```

## Inferir el tipo

`z.infer<typeof schema>` deriva el tipo TypeScript directamente del schema. Nunca escribas el `interface`/`type` a mano al lado de un schema — se desincronizan con el tiempo y dejas de confiar en cuál es la verdad.

```ts
export type User = z.infer<typeof userSchema>
// { email: string; age: number; role: "admin" | "user"; website?: string }
```

## Tipos de datos

Los que se usan todo el tiempo:

```ts
z.string()
z.number()
z.boolean()
z.date()
z.array(z.string()) // string[]
z.object({ id: z.string() }) // { id: string }
z.enum(["admin", "user"]) // "admin" | "user"
z.literal("production") // el valor exacto "production"
z.union([z.string(), z.number()]) // string | number
z.record(z.string()) // Record<string, string>
z.tuple([z.string(), z.number()]) // [string, number]
```

`optional()`, `nullable()` y `nullish()` cambian qué "ausencia" acepta el schema — no son lo mismo:

```ts
z.string().optional() // string | undefined
z.string().nullable() // string | null
z.string().nullish() // string | null | undefined
```

Uniones discriminadas — cuando un campo indica qué forma tiene el resto del objeto (eventos, estados directamente máquina de estado, respuestas de API con `status`):

```ts
const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("keypress"), key: z.string() })
])
```

Zod infiere cuál de las dos formas corresponde según el valor de `type`, con autocompletado incluido.

## Validar strings

Los formatos comunes (email, URL, UUID...) son funciones de nivel superior, no métodos encadenados sobre `z.string()` — así son desde Zod 4.

```ts
z.email()
z.url()
z.uuid()
z.iso.date() // "2026-08-16"
z.iso.datetime() // "2026-08-16T14:32:00Z"
```

Los constraints genéricos (largo, patrón) sí van encadenados sobre `z.string()`, porque no son un formato sino una regla sobre cualquier string:

```ts
z.string().min(3).max(50)
z.string().length(6) // exactamente 6 caracteres
z.string().regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones")
z.string().startsWith("https://")
z.string().trim() // recorta espacios antes de validar
```

## Validar números

```ts
z.number().int()
z.number().positive()
z.number().nonnegative() // >= 0
z.number().min(0).max(100)
z.number().multipleOf(0.5) // solo múltiplos de 0.5
```

## Refinamientos custom

`.refine()` agrega una validación que no está cubierta por los métodos nativos. El segundo argumento es el mensaje de error.

```ts
const passwordSchema = z
  .string()
  .refine(
    (value) => /[A-Z]/.test(value) && /[0-9]/.test(value),
    "La contraseña necesita al menos una mayúscula y un número"
  )
```

Para validar comparando dos campos entre sí (confirmar contraseña, fecha de fin después de fecha de inicio), `.refine()` va sobre el objeto completo, no sobre un campo individual — y `path` indica en qué campo mostrar el error.

```ts
const signupSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  })
```

## Transformar datos

`.transform()` cambia el valor después de validarlo — el tipo de salida (`z.infer`) refleja el resultado transformado, no el de entrada.

```ts
const trimmedLowercase = z
  .string()
  .transform((value) => value.trim().toLowerCase())

const csvToArray = z
  .string()
  .transform((value) => value.split(",").map((item) => item.trim()))
```

Para convertir el tipo de entrada antes de validar (típico con `FormData`, donde todo llega como string), usa `z.coerce` en vez de `.transform()`:

```ts
z.coerce.number() // "42" → 42
z.coerce.boolean() // "true" → true (cualquier string no vacío es true)
z.coerce.date() // "2026-08-16" → Date
```

## Parsear datos

Tres formas de validar un valor contra un schema, según qué necesites hacer con el resultado.

```ts
userSchema.parse(data)
// devuelve los datos tipados o lanza ZodError

const result = userSchema.safeParse(data)
// { success: true, data } | { success: false, error }

await userSchema.parseAsync(data)
// igual que parse(), pero espera refinamientos/transforms async
```

`safeParse()` es la que casi siempre quieres en código de aplicación: no lanza, así que no hace falta `try/catch` para el camino esperado de "datos inválidos".

```ts
const result = userSchema.safeParse(formData);

if (!result.success) {
  console.log(result.error.flatten());
  return;
}

// result.data ya está tipado como User
```

## Manejo de errores

`error.flatten()` convierte un `ZodError` en algo fácil de mostrar en un formulario: errores generales del schema y errores por campo, separados.

```ts
const result = userSchema.safeParse(data)

if (!result.success) {
  const { fieldErrors, formErrors } = result.error.flatten()
  // fieldErrors: { email: ["Email no válido"], age: [...] }
  // formErrors: errores que no pertenecen a un campo específico (los de .refine() sobre el objeto)
}
```

Para casos donde necesitas la estructura completa (objetos anidados, arrays), `.format()` da un árbol de errores que respeta la forma del schema en vez de aplanarlo.

## Componer schemas

```ts
const baseUserSchema = z.object({ email: z.email(), name: z.string() })

baseUserSchema.extend({ role: z.enum(["admin", "user"]) }) // agrega campos
baseUserSchema.pick({ email: true }) // solo email
baseUserSchema.omit({ name: true }) // todo menos name
baseUserSchema.partial() // todos los campos opcionales (útil para un PATCH)
baseUserSchema.partial().required({ email: true }) // parcial, pero email sigue obligatorio
```

## Valores por defecto y de respaldo

`.default()` rellena el valor cuando el campo no vino. `.catch()` rellena el valor cuando vino pero no pasó la validación, en vez de fallar todo el `parse()`.

```ts
z.enum(["light", "dark"]).default("dark")
// undefined → "dark"

z.number().catch(0)
// "no-es-un-número" → 0, en vez de lanzar
```

## Casos de uso

**Validar variables de entorno**, en el arranque de la app — si falta algo, falla rápido con un mensaje claro en vez de un `undefined` silencioso más adelante:

```ts title="env.ts"
const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3000)
})

export const env = envSchema.parse(process.env)
```

**Validar un formulario** con [FormData Utils](/general/utils/form) — todo llega como string, por eso `z.coerce`:

```ts
const schema = z.object({
  email: z.email(),
  age: z.coerce.number().min(18)
})

const result = schema.safeParse(formToObject(form))
```

**Validar la respuesta directamente API** antes de confiar en su forma — [`fetchJson()`](/general/utils/fetch) tipa con un genérico, pero no valida nada en runtime; Zod sí:

```ts
const apiUserSchema = z.object({ id: z.string(), email: z.string() })

const raw = await fetchJson("/api/user")
const user = apiUserSchema.parse(raw) // lanza si la API cambió su forma sin avisar
```

## Resumen

| API                                                | Uso                                                                                    |
| -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `z.object({...})`                                  | Definir la forma de un objeto                                                          |
| `z.infer<typeof schema>`                           | Derivar el tipo TS del schema                                                          |
| `z.email()` / `z.url()` / `z.uuid()`               | Formatos de string comunes (nivel superior, no `.string().email()`)                    |
| `schema.parse(data)`                               | Validar y devolver tipado, lanza `ZodError` si falla                                   |
| `schema.safeParse(data)`                           | Validar sin lanzar: `{ success, data \| error }`                                       |
| `z.coerce.*`                                       | Convertir el tipo de entrada antes de validar (strings de FormData, env, query params) |
| `.refine(fn, msg)`                                 | Validación custom, incluso cruzando varios campos                                      |
| `.transform(fn)`                                   | Transformar el valor después de validar                                                |
| `.default(valor)`                                  | Rellenar cuando el campo no vino                                                       |
| `.catch(valor)`                                    | Rellenar cuando vino pero no pasó la validación                                        |
| `.extend()` / `.pick()` / `.omit()` / `.partial()` | Derivar variantes de un schema existente                                               |
| `error.flatten()`                                  | Errores por campo, listos para mostrar en un formulario                                |

## Errores comunes

- Si ves `.string().email()` en código o tutoriales viejos: es la sintaxis de Zod 3. Desde Zod 4 los formatos son funciones de nivel superior (`z.email()`, `z.url()`, `z.uuid()`). La forma encadenada sigue funcionando en la mayoría de los casos, pero `z.email()` es la que documenta Zod hoy.
- Con `FormData` todo llega como string → usa `z.coerce.*`, no `z.number()` a secas.
- `.optional()` no es lo mismo que `.nullable()`: `undefined` (campo ausente) vs `null` (campo presente con valor nulo). Si la fuente de datos puede mandar cualquiera de los dos, usa `.nullish()`.
- `safeParse()` no lanza — si usas `.parse()` en un boundary que no controlas (input de usuario, API externa), necesitas `try/catch` alrededor.
- `.refine()` a nivel de objeto (para comparar dos campos) necesita `path` en el segundo argumento, si no el error no queda asociado a ningún campo del formulario.
- El schema es la única fuente de verdad: si escribes un `interface` a mano al lado de un schema "porque es más rápido", con el tiempo se desincronizan y pierdes la garantía que Zod proporciona.
