---
title: Renderizado, estado y flujo de datos en frontend
description: Elegir dónde renderizar, dónde vivir el estado y cómo mantener un flujo de datos predecible entre UI, servidor y caché.
category: frontend
stack: react
order: 1
tags: [frontend, react, state, rendering, data]
scope: fundamentos de frontend
related:
  - technologies/react
  - guides/nextjs-server-client-components
  - guides/react-usestate
updatedAt: 2026-08-18
---

## Primero: ¿quién necesita el dato?

Mantén el estado lo más cerca posible de los componentes que lo usan. Un estado local sirve para un input, un acordeón o una pestaña. Sube el estado al ancestro común cuando dos partes de la interfaz deban coordinarse. Usa un store global solo cuando el dato sea transversal y tenga un ciclo de vida claro, como una sesión, tema o carrito.

No copies una prop a estado sin una razón: aparecen dos fuentes de verdad. Para valores derivados, calcula desde las props y el estado actual. La caché de servidor, el estado de UI y los datos persistidos son problemas distintos y no deben mezclarse en un único objeto global.

## Server, client y navegador

Renderiza en servidor o build el contenido que no necesita interacción. Lleva al cliente solo eventos, estado local y APIs del navegador. Esta frontera reduce JavaScript, facilita SEO y evita enviar secretos. En frameworks con Server Components, no conviertas toda la página en cliente por un botón pequeño: separa el control interactivo.

## Flujo directamente mutación

1. El usuario inicia una acción y la interfaz muestra estado pendiente.
2. El cliente valida para feedback rápido, sin confiar en esa validación.
3. El servidor autentica, autoriza, valida y persiste de forma idempotente.
4. La respuesta actualiza la caché o devuelve el dato canónico.
5. La UI muestra éxito o error y conserva los valores que todavía pueden corregirse.

## Evitar estados imposibles

Modela estados explícitos en lugar de combinar booleanos incompatibles:

```ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
```

Así puedes exigir que cada estado tenga una representación visual y evitar una pantalla que muestre “cargando” y “error” al mismo tiempo. Cancela solicitudes obsoletas y no dejes que una respuesta lenta sobrescriba una búsqueda más reciente.

## Revisión de arquitectura

Para cada dato pregunta quién es su fuente de verdad, quién puede cambiarlo, cuánto dura, si debe sobrevivir un refresh y qué pasa cuando falla la red. Esas respuestas suelen revelar si necesitas estado local, URL, cookie, caché de servidor, base de datos o ninguna persistencia.
