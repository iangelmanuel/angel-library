---
title: useActionState (ex useFormState)
description: Estado + pending directamente acción de formulario sin useState/useTransition a mano — reemplaza a useFormState.
category: frontend
stack: react
order: 8
tags: [react, hooks, forms]
scope: react (useActionState)
related:
  - guides/react-useoptimistic
updatedAt: 2026-08-16
---

Este hook se llamaba `useFormState` (vivía en `react-dom`). En React 19 estable se renombró a **`useActionState`** y pasó a `react` — la doc oficial de `useFormState` ya ni existe, redirige aquí. Si ves `useFormState` en un tutorial, es la versión vieja del mismo hook; la forma cambió un poco (ver abajo), no es un simple find-and-replace del nombre.

## El problema que resuelve

Manejar el resultado y el estado de carga directamente acción de formulario a mano implica un `useState` para el resultado, otro (o un `useTransition`) para el "cargando", y coordinar ambos en la función que dispara la acción. `useActionState` empaqueta las tres cosas.

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

## Diferencia con `useFormState` (la versión vieja)

`useFormState` solo devolvía `[state, formAction]` — sin `isPending`. Para saber si la acción estaba en curso, había que combinarlo a mano con `useFormStatus()` (otro hook, de `react-dom`, que solo funciona en un componente hijo del `<form>`). `useActionState` incluye ese `isPending` directo, en el mismo componente, sin el hook aparte.

## Resumen

| API | Uso |
| --- | --- |
| `useActionState(accion, estadoInicial)` | Hook principal: `[estado, formAction, isPending]` |
| `formAction` | Se pasa directo al `action` de un `<form>` |
| `accion(estadoPrevio, formData)` | La función recibe el resultado anterior + los datos del form |
| `isPending` | `true` mientras la acción está en curso — sin necesitar `useFormStatus` aparte |

## Consideraciones

- `useFormState` (react-dom) todavía existe por compatibilidad hacia atrás en algunas versiones, pero es la API vieja — para código nuevo, `useActionState` (de `react`) es lo que hay que usar.
- La función de acción recibe `(estadoPrevio, formData)`, en ese orden — es fácil escribir `(formData)` solo, copiando de memoria un ejemplo de `useState`, y romper el tipado.
- Para mostrar un resultado *optimista* mientras la acción corre (antes de que `useActionState` actualice el estado real), se combina con [`useOptimistic`](/guides/react-useoptimistic) — son complementarios, no alternativas.
