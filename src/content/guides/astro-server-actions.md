---
title: Server Actions
description: Funciones backend con validación Zod integrada — defineAction, llamarlas desde el cliente, formularios con progressive enhancement y manejo de errores.
category: frontend
stack: astro
order: 19
tags: [astro, forms, backend]
scope: astro:actions
related:
  - libraries/zod
  - utilities/form
updatedAt: 2026-08-25
---

Para un formulario, un [endpoint](/guides/astro-endpoints) a mano implica repetir siempre lo mismo: parsear el body, validarlo, tipar la respuesta, manejar el error de red en el cliente. Las Actions empaquetan las tres cosas en una sola función: defines el schema de entrada una vez con Zod, y tanto el cliente como el servidor comparten ese tipo automáticamente — sin escribir el `fetch` a mano ni duplicar la validación en el frontend.

## Definir una action

Viven en `src/actions/index.ts`, exportadas dentro de un objeto `server`.

```ts title="src/actions/index.ts"
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  crearComentario: defineAction({
    input: z.object({
      texto: z.string().min(1),
      postId: z.string(),
    }),
    handler: async (input) => {
      // input ya está validado y tipado aquí
      return { id: crypto.randomUUID(), ...input };
    },
  }),
};
```

## Llamar la action desde el cliente

```ts
import { actions } from 'astro:actions';

const { data, error } = await actions.crearComentario({
  texto: 'Buen artículo',
  postId: 'post-1',
});

if (!error) console.log(data.id);
```

## Formulario con progressive enhancement

Con `accept: 'form'` en la action, un `<form>` normal (sin JS) apuntando a `actions.nombre` funciona server-side. Con JS activo, Astro intercepta el submit y lo maneja sin recargar la página.

```ts
crearComentario: defineAction({
  accept: 'form',
  input: z.object({ texto: z.string().min(1), postId: z.string() }),
  handler: async (input) => { /* ... */ },
});
```

```astro
---
import { actions } from 'astro:actions';
---
<form method="POST" action={actions.crearComentario}>
  <textarea name="texto" required></textarea>
  <input type="hidden" name="postId" value={post.id} />
  <button>Comentar</button>
</form>
```

## Leer el resultado server-side

Para el caso sin JS (o SSR directo), `Astro.getActionResult()` lee el resultado del submit en el render siguiente.

```astro
---
import { actions } from 'astro:actions';

const result = Astro.getActionResult(actions.crearComentario);
if (result && !result.error) {
  return Astro.redirect(`/post/${result.data.postId}`);
}
---
```

## Manejo de errores

`ActionError` para errores controlados (permisos, no encontrado); `isInputError` para distinguir errores de validación de Zod y leer qué campo falló.

```ts
import { ActionError, isInputError } from 'astro:actions';

crearComentario: defineAction({
  input: z.object({ texto: z.string().min(1), postId: z.string() }),
  handler: async (input, context) => {
    if (!context.locals.user) {
      throw new ActionError({ code: 'UNAUTHORIZED', message: 'Inicia sesión' });
    }
    return { id: crypto.randomUUID() };
  },
});
```

```ts
const { data, error } = await actions.crearComentario(input);

if (isInputError(error)) {
  console.log(error.fields.texto); // ["String must contain at least 1 character(s)"]
} else if (error?.code === 'UNAUTHORIZED') {
  mostrarLogin();
}
```

## API de Actions en una mirada

| API | Uso |
| --- | --- |
| `defineAction({ input, handler })` | Definir una action con validación Zod |
| `accept: 'form'` | Aceptar submits de `<form>` además de JSON |
| `actions.nombre(input)` | Llamar la action desde un componente cliente |
| `Astro.getActionResult(actions.nombre)` | Leer el resultado server-side después del submit |
| `ActionError` | Lanzar un error controlado con `code` y `message` |
| `isInputError(error)` | Detectar errores de validación y leer `error.fields` |

## Validación, autorización e idempotencia

- La autorización va **dentro** del handler (`context.locals`), no antes — las actions no pasan por las rutas de página, así que un middleware de auth genérico no las cubre automáticamente a menos que uses `getActionContext()` ahí.
- `input` con Zod valida antes de que el handler corra: un input inválido nunca llega al handler, sale como `isInputError`.
- Con `accept: 'form'` y JS desactivado, el navegador hace un submit normal y Astro re-renderiza la página — `Astro.getActionResult()` es la única forma de leer ese resultado en ese caso.
