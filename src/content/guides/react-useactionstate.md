---
title: useActionState
description: Coordinar el resultado, la función y el estado pendiente de una acción sin construir esa máquina manualmente.
category: frontend
stack: react
order: 15
tags: [react, hooks, forms]
scope: react (useActionState)
related:
  - guides/react-useoptimistic
updatedAt: 2026-08-25
---

`useActionState` es la API actual de React para conservar el resultado de una Action. Si encuentras `useFormState` de `react-dom` en un tutorial anterior, revisa la versión del proyecto y migra el ejemplo conscientemente: el nombre, el módulo y el valor devuelto cambiaron.

## El problema que resuelve

Manejar manualmente el resultado y el estado pendiente de una acción suele requerir varios estados y coordinación adicional. `useActionState` reúne el estado actual, una función que puede pasarse al formulario y el indicador de trabajo pendiente.

## La forma básica

Recibe una función de acción y un estado inicial; devuelve el estado actual, una función lista para usar como `action` de un `<form>`, y si hay una acción en curso.

```tsx
import { useActionState } from 'react';

async function crearComentario(estadoPrevio: string | null, formData: FormData) {
  const texto = formData.get('texto') as string;
  if (!texto.trim()) return 'El comentario no puede estar vacío';

  await guardarComentario(texto);
  return null; // sin error
}

function FormularioComentario() {
  const [error, formAction, isPending] = useActionState(crearComentario, null);

  return (
    <form action={formAction}>
      <textarea name="texto" disabled={isPending} />
      {error && <p>{error}</p>}
      <button disabled={isPending}>{isPending ? 'Enviando…' : 'Comentar'}</button>
    </form>
  );
}
```

La función de acción recibe el **estado anterior** como primer argumento (no solo `formData`) — así cada envío puede construir su resultado a partir del anterior, igual que un reducer.

## Con Server Actions

`useActionState` no depende de dónde vive la función — funciona igual con una función async cliente o con una Server Action (de Next.js, o de [Astro](/guides/astro-server-actions)). Es el hook del lado del cliente que coordina el estado alrededor de cualquiera de las dos.

```tsx
'use client';
import { useActionState } from 'react';
import { crearComentarioAction } from './actions'; // Server Action

function FormularioComentario() {
  const [error, formAction, isPending] = useActionState(crearComentarioAction, null);
  // igual que el ejemplo anterior, solo cambia de dónde viene la función
}
```

## Diferencia frente a ejemplos antiguos

Los ejemplos con `useFormState` devolvían `[state, formAction]` y solían combinarse con `useFormStatus()` desde un descendiente del formulario. `useActionState` devuelve `[state, dispatchAction, isPending]`. `useFormStatus` sigue siendo útil cuando un botón hijo necesita leer el estado del formulario que lo contiene sin recibir props.

## Referencia rápida

| API | Uso |
| --- | --- |
| `useActionState(accion, estadoInicial)` | Hook principal: `[estado, formAction, isPending]` |
| `formAction` | Se pasa directo al `action` de un `<form>` |
| `accion(estadoPrevio, formData)` | La función recibe el resultado anterior + los datos del form |
| `isPending` | `true` mientras la acción está en curso — sin necesitar `useFormStatus` aparte |

## Límites y decisiones

- La función de acción recibe `(estadoPrevio, formData)`, en ese orden — es fácil escribir `(formData)` solo, copiando de memoria un ejemplo de `useState`, y romper el tipado.
- Para mostrar un resultado *optimista* mientras la acción corre (antes de que `useActionState` actualice el estado real), se combina con [`useOptimistic`](/guides/react-useoptimistic) — son complementarios, no alternativas.
- El estado devuelto debe representar resultados serializables y útiles para la UI, por ejemplo errores por campo o un mensaje de éxito.
- Deshabilitar todo el formulario durante la solicitud no siempre es la mejor experiencia; impide solo las acciones que producirían duplicados y comunica `aria-busy` cuando corresponda.
