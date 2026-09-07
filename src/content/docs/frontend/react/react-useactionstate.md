---
title: useActionState
description: Coordinar el resultado, la función y el estado pendiente de una acción sin construir esa máquina manualmente.
type: guides
order: 15
tags: [react, hooks, forms]
scope: react (useActionState)
related:
  - frontend/react/react-useoptimistic
updatedAt: 2026-09-07
---

`useActionState` es la API actual de React para conservar el resultado de una Action. Si encuentras `useFormState` de `react-dom` en un tutorial anterior, revisa la versión del proyecto y migra el ejemplo conscientemente: el nombre, el módulo y el valor devuelto cambiaron.

## El problema que resuelve

Manejar manualmente el resultado y el estado pendiente de una acción suele requerir varios estados y coordinación adicional. `useActionState` reúne el estado actual, una función que puede pasarse al formulario y el indicador de trabajo pendiente.

## La forma básica

Recibe una función de acción y un estado inicial; devuelve el estado actual, una función lista para usar como `action` de un `<form>`, y si hay una acción en curso.

```tsx
import { useActionState } from "react"

async function crearComentario(
  estadoPrevio: string | null,
  formData: FormData
) {
  const texto = formData.get("texto")
  if (typeof texto !== "string" || !texto.trim()) return "El comentario no puede estar vacío"

  try {
    await guardarComentario(texto.trim())
  } catch {
    return "No se pudo guardar. Inténtalo de nuevo."
  }
  return null // sin error
}

function FormularioComentario() {
  const [error, formAction, isPending] = useActionState(crearComentario, null)

  return (
    <form action={formAction}>
      <label htmlFor="texto">Comentario</label>
      <textarea
        id="texto"
        name="texto"
        disabled={isPending}
      />
      <p role="status">{error}</p>
      <button disabled={isPending}>
        {isPending ? "Enviando…" : "Comentar"}
      </button>
    </form>
  )
}
```

La función de acción recibe el **estado anterior** como primer argumento (no solo `formData`) — así cada envío puede construir su resultado a partir del anterior, igual que un reducer.

## Con Server Actions

En React 19 puedes usar una acción cliente o una Server Function de un framework compatible, como Next.js. Las [Actions de Astro](/frontend/astro/astro-server-actions) tienen un contrato propio: no se pasan indistintamente como una Server Action de Next.js. La integración oficial de React para Astro ofrece `withState`/`getActionState` para conectar ambos mecanismos.

```tsx
"use client"

import { useActionState } from "react"
import { crearComentarioAction } from "./actions"

// Server Action

function FormularioComentario() {
  const [error, formAction, isPending] = useActionState(
    crearComentarioAction,
    null
  )
  // igual que el ejemplo anterior, solo cambia de dónde viene la función
}
```

## Diferencia frente a ejemplos antiguos

Los ejemplos con `useFormState` devolvían `[state, formAction]` y solían combinarse con `useFormStatus()` desde un descendiente del formulario. `useActionState` devuelve `[state, dispatchAction, isPending]`. `useFormStatus` sigue siendo útil cuando un botón hijo necesita leer el estado del formulario que lo contiene sin recibir props.

## Referencia rápida

| API                                     | Uso                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| `useActionState(accion, estadoInicial)` | Hook principal: `[estado, formAction, isPending]`                              |
| `formAction`                            | Se pasa directo al `action` de un `<form>`                                     |
| `accion(estadoPrevio, formData)`        | La función recibe el resultado anterior + los datos del form                   |
| `isPending`                             | `true` mientras la acción está en curso — sin necesitar `useFormStatus` aparte |

## Límites y decisiones

- La función de acción recibe `(estadoPrevio, formData)`, en ese orden — es fácil escribir `(formData)` solo, copiando de memoria un ejemplo de `useState`, y romper el tipado.
- Para mostrar un resultado _optimista_ mientras la acción corre (antes de que `useActionState` actualice el estado real), se combina con [`useOptimistic`](/frontend/react/react-useoptimistic) — son complementarios, no alternativas.
- El estado devuelto debe representar resultados serializables y útiles para la UI, por ejemplo errores por campo o un mensaje de éxito.
- Deshabilitar todo el formulario durante la solicitud no siempre es la mejor experiencia; impide solo las acciones que producirían duplicados y comunica `aria-busy` cuando corresponda.

## Requisitos y comprobación

El primer bloque presupone un helper `guardarComentario(texto): Promise<void>` importado desde tu capa de API; debe rechazar si no se guarda. En una demo puedes reemplazarlo por una función asíncrona controlada, pero eso no comprueba persistencia. En Next.js, el componente que llama al Hook debe ser cliente.

Prueba comentario vacío, guardado correcto y rechazo del helper. Durante la espera el botón debe indicar progreso; ante un error debe mostrarse feedback y habilitar el reintento. La Server Action sigue necesitando autenticación, autorización y validación aunque la UI haya comprobado el formulario.

## Fuentes

- [React: useActionState](https://react.dev/reference/react/useActionState)
- [Astro: React y Actions](https://docs.astro.build/en/guides/integrations-guide/react/)
