---
title: React Hook Form + Zod
description: Cómo se conectan de verdad — zodResolver, tipos end-to-end, arrays dinámicos, errores del servidor y coerción de inputs nativos.
category: frontend
stack: react
order: 20
tags: [react, forms, validation, zod, typescript]
technologies: [libraries/react-hook-form, libraries/zod]
updatedAt: 2026-08-16
---

## Instalación

```bash
npm install react-hook-form zod @hookform/resolvers
```

`@hookform/resolvers` es el puente: traduce el resultado de `safeParse()` de Zod al formato de errores que React Hook Form (RHF) espera internamente. Sin él, RHF no sabe leer un `ZodError`.

## La conexión base

```tsx title="SignupForm.tsx"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z
  .object({
    email: z.email('Email no válido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  async function onSubmit(values: SignupValues) {
    // values ya pasó por signupSchema.safeParse() — está validado y tipado
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input {...register('email')} />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p role="alert">{errors.password.message}</p>}

      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <p role="alert">{errors.confirmPassword.message}</p>}

      <button disabled={isSubmitting}>Crear cuenta</button>
    </form>
  );
}
```

El `.refine()` sobre el objeto completo (comparar `password` con `confirmPassword`) necesita `path` — sin eso, el error queda "suelto" a nivel del formulario y `errors.confirmPassword` nunca se llena, aunque el schema sí lo esté rechazando.

## Tipos end-to-end, sin interface duplicado

`z.infer<typeof signupSchema>` es el único lugar donde se define la forma de los datos. `useForm<SignupValues>` la usa para tipar `register`, `errors` y el argumento de `onSubmit` — si el schema cambia (agregás un campo, sacás otro), el componente deja de compilar hasta que lo actualizás. Escribir un `interface SignupValues` a mano al lado del schema es exactamente el error que este combo evita: los dos se desincronizan con el tiempo y termina habiendo un campo que el formulario valida pero el tipo no conoce (o viceversa).

## Arrays dinámicos con `useFieldArray`

Un schema con `z.array()` se mapea directo a `useFieldArray` — la lista de campos crece o achica, y cada item sigue tipado y validado individualmente.

```tsx title="InvoiceForm.tsx"
const invoiceSchema = z.object({
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Descripción requerida'),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1, 'Agrega al menos un ítem'),
});

type InvoiceValues = z.infer<typeof invoiceSchema>;

function InvoiceForm() {
  const { control, register, handleSubmit, formState: { errors } } = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { items: [{ description: '', quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.description`)} />
          <input type="number" {...register(`items.${index}.quantity`)} />
          {errors.items?.[index]?.description && <p>{errors.items[index]?.description?.message}</p>}
          <button type="button" onClick={() => remove(index)}>Quitar</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ description: '', quantity: 1 })}>
        Agregar ítem
      </button>
      {errors.items?.root && <p>{errors.items.root.message}</p>}
    </form>
  );
}
```

`field.id` (no el índice del array) es la key de React — `useFieldArray` genera un id estable por fila que sobrevive a insertar/quitar/reordenar. El error del `.min(1)` sobre el array completo aparece en `errors.items.root`, no en un item puntual.

## Coerción de inputs nativos

Todo lo que sale del DOM llega como string (o, en checkboxes, como booleano real — pero cualquier `<input>` de texto siempre es string). Sin coerción, `z.number()` rechaza el `"25"` que manda un `<input type="number">`.

```ts
const profileSchema = z.object({
  age: z.coerce.number().int().min(18),       // "25" → 25
  birthDate: z.coerce.date(),                  // "2026-01-15" → Date
  acceptsTerms: z.boolean().refine((v) => v, 'Tenés que aceptar los términos'),
});
```

Los checkboxes son la excepción: `register('acceptsTerms')` en un `<input type="checkbox">` ya le da a RHF un `boolean` real (usa la prop `checked`, no `value`), así que ese campo no necesita `z.coerce`.

## Errores del servidor con `setError`

Zod valida forma y reglas declarativas (formato, longitud, comparación entre campos) — lo que **no** puede validar es algo que depende de una consulta al backend, como "este email ya está registrado". Para eso, `setError` inyecta un error de servidor en un campo puntual después del submit, con el mismo aspecto que un error de Zod:

```tsx
const { setError, handleSubmit } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

async function onSubmit(values: SignupValues) {
  const res = await fetch('/api/signup', { method: 'POST', body: JSON.stringify(values) });

  if (res.status === 409) {
    setError('email', { message: 'Ese email ya está registrado' });
    return;
  }
}
```

## Particularidades de la conexión

- **`defaultValues` debe ser completo**: con un resolver tipado, RHF exige que todos los campos del schema tengan un valor inicial — omitir uno rompe el tipo de `defaultValues`, no solo la UX.
- **`mode`**: `'onBlur'` u `'onTouched'` dan mejor UX que el default (`'onSubmit'`, que solo valida al enviar). `'onChange'` valida en cada tecla — rara vez vale la pena, revalida de más.
- **`errors.campo.message` ya viene en español** (o el idioma que uses) porque el mensaje sale directo del segundo argumento de cada regla de Zod — el resolver no traduce nada, solo reubica el error.
- **Reusa el mismo schema en el servidor** (API route o Server Action): si el cliente valida con `signupSchema` pero el servidor no, cualquiera que le pegue directo a la API se salta la validación por completo.

## Resumen

| Pieza | Rol |
| --- | --- |
| `zodResolver(schema)` | Traduce `safeParse()` de Zod al formato de errores de RHF |
| `z.infer<typeof schema>` | Tipo único, compartido entre schema, `useForm` y `onSubmit` |
| `useFieldArray` + `z.array()` | Listas dinámicas de campos, validadas item por item |
| `z.coerce.*` | Convierte lo que manda el DOM (string) al tipo real antes de validar |
| `setError('campo', { message })` | Inyecta un error del servidor con el mismo aspecto que uno de Zod |

## Errores comunes

- Olvidar `path` en un `.refine()` a nivel de objeto: el error existe pero no se asocia a ningún campo, así que no se muestra donde el usuario lo espera.
- No usar `z.coerce.number()` en inputs numéricos: el schema rechaza el string que manda el DOM aunque "parezca" un número.
- `defaultValues` incompleto con un resolver tipado: TypeScript se queja, no es un bug de RHF.
- Pisar un error de servidor (`setError`) sin limpiarlo: si el usuario corrige el campo, RHF lo limpia solo en el siguiente submit, pero no mientras tipea salvo que cambies el `mode`.
