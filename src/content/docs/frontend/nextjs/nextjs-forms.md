---
title: Formularios con Server Actions
description: Validación, errores por campo, estados pending, actualizaciones optimistas y progressive enhancement en formularios del App Router.
type: guides
order: 20
tags: [nextjs, forms, server-actions, validation, react]
scope: next.js app router (forms)
related:
  - frontend/nextjs/nextjs-server-actions
  - frontend/react/react-useactionstate
  - frontend/react/react-useoptimistic
  - general/packages/zod
updatedAt: 2026-08-25
---

Un `<form action={serverAction}>` envía `FormData` a una Server Action. Funciona antes de que cargue JavaScript cuando el formulario se renderiza desde un Server Component; con JavaScript agrega estados pendientes y navegación sin recarga completa.

## Action con validación

```ts title="app/usuarios/actions.ts"
"use server"

import { z } from "zod"

const schema = z.object({ email: z.email(), nombre: z.string().trim().min(2) })

export async function crearUsuario(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success)
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  await db.user.create({ data: parsed.data })
  return { ok: true, errors: {} }
}
```

## Mostrar errores y estado pendiente

```tsx title="app/usuarios/Formulario.tsx"
"use client"

import { useActionState } from "react"
import { crearUsuario } from "./actions"

export function Formulario() {
  const [state, action, pending] = useActionState(crearUsuario, {
    ok: false,
    errors: {}
  })
  return (
    <form action={action}>
      <input
        name="nombre"
        required
      />
      <p>{state.errors.nombre?.[0]}</p>
      <input
        name="email"
        type="email"
        required
      />
      <p>{state.errors.email?.[0]}</p>
      <button disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button>
    </form>
  )
}
```

`useFormStatus()` sirve para un botón descendiente que necesita leer el estado del formulario sin recibirlo por props. `useOptimistic()` actualiza la UI antes de que la mutación termine y debe contemplar cómo revertir o comunicar un fallo.

## Pasar datos adicionales

Prefiere un `<input type="hidden">` cuando el valor también deba existir en HTML sin JavaScript. Usa `action.bind(null, id)` para argumentos de contexto que no deben exponerse como campo editable, pero recuerda que el cliente también puede invocar la acción: valida autorización y pertenencia dentro de ella.

## Checklist

- Validación HTML para feedback inmediato y validación server-side como autoridad.
- Mensajes accesibles cerca del campo y una región `aria-live` para el resultado global.
- Botón deshabilitado mientras se procesa para evitar doble submit.
- `revalidatePath`, `revalidateTag` o `updateTag` después de mutar datos cacheados.
- Redirect al finalizar solo cuando el flujo realmente cambia de página.

Referencia oficial: [Forms](https://nextjs.org/docs/app/guides/forms).
