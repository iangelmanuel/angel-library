---
title: Renderizado, estado y flujo de datos en frontend
description: Elegir dónde renderizar, dónde vivir el estado y cómo mantener un flujo de datos predecible entre UI, servidor y caché.
type: guides
order: 3
tags: [frontend, react, state, rendering, data]
scope: fundamentos de frontend
related:
  - frontend/react/react
  - frontend/nextjs/nextjs-server-client-components
  - frontend/react/react-usestate
updatedAt: 2026-08-25
---

Esta guía conecta conceptos que a menudo se estudian por separado. **Renderizar** significa calcular qué interfaz corresponde a los datos actuales; **estado** es información que puede cambiar y afectar esa interfaz; **fuente de verdad** es el lugar autorizado para decidir el valor vigente.

## Mapa de decisiones

| Dato                           | Fuente habitual               | Ejemplo                            |
| ------------------------------ | ----------------------------- | ---------------------------------- |
| estado visual efímero          | componente local              | modal abierto, pestaña activa      |
| estado compartido por hermanos | ancestro común                | filtro que afecta lista y contador |
| estado navegable               | URL                           | búsqueda, página, orden            |
| dato remoto cacheado           | librería de caché o framework | productos, perfil                  |
| sesión o preferencia HTTP      | servidor/cookie               | identidad, locale                  |
| dato persistente de negocio    | base de datos                 | pedidos, permisos                  |

No todo valor que cambia debe ir en `useState`. La URL, un formulario no controlado, una caché remota o un valor derivado pueden ser fuentes más adecuadas.

## Primero: ¿quién necesita el dato?

Mantén el estado lo más cerca posible de los componentes que lo usan. Un estado local sirve para un input, un acordeón o una pestaña. Sube el estado al ancestro común cuando dos partes de la interfaz deban coordinarse. Usa un store global solo cuando el dato sea transversal y tenga un ciclo de vida claro, como una sesión, tema o carrito.

No copies una prop a estado sin una razón: aparecen dos fuentes de verdad. Para valores derivados, calcula desde las props y el estado actual. La caché de servidor, el estado de UI y los datos persistidos son problemas distintos y no deben mezclarse en un único objeto global.

```tsx
function CartSummary({
  items
}: {
  items: Array<{ price: number; quantity: number }>
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return <output>Total: {total}</output>
}
```

`total` no necesita estado porque se puede reproducir desde `items`. Guardarlo por separado obligaría a actualizar dos fuentes cada vez que cambia el carrito.

## Server, client y navegador

Renderiza en servidor o build el contenido que no necesita interacción. Lleva al cliente solo eventos, estado local y APIs del navegador. Esta frontera reduce JavaScript, facilita SEO y evita enviar secretos. En frameworks con Server Components, no conviertas toda la página en cliente por un botón pequeño: separa el control interactivo.

**Servidor** describe el entorno con acceso a secretos y datos internos. **Cliente** describe el código incluido para hidratar y actualizar la UI. **Navegador** es el entorno que además expone DOM, almacenamiento, cámara y otras Web APIs. Un Client Component puede producir HTML inicial en el servidor y luego hidratarse; “cliente” no significa necesariamente que no exista HTML previo.

## Flujo de una mutación

1. El usuario inicia una acción y la interfaz muestra estado pendiente.
2. El cliente valida para feedback rápido, sin confiar en esa validación.
3. El servidor autentica, autoriza, valida y persiste de forma idempotente.
4. La respuesta actualiza la caché o devuelve el dato canónico.
5. La UI muestra éxito o error y conserva los valores que todavía pueden corregirse.

La validación cliente mejora la experiencia, pero se puede omitir o manipular. La autorización servidor responde otra pregunta: incluso si la entrada es válida, ¿esta identidad puede ejecutar la operación sobre este recurso? Ambas deben ocurrir en la capa correcta.

Para acciones que se pueden repetir por un doble clic o reintento de red, diseña **idempotencia**: procesar varias veces la misma intención no debe crear cobros o recursos duplicados.

## Evitar estados imposibles

Modela estados explícitos en lugar de combinar booleanos incompatibles:

```ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
```

Así puedes exigir que cada estado tenga una representación visual y evitar una pantalla que muestre “cargando” y “error” al mismo tiempo. Cancela solicitudes obsoletas y no dejes que una respuesta lenta sobrescriba una búsqueda más reciente.

## Estado local, Context o store

1. Empieza local si una sola rama consume el dato.
2. Sube el estado cuando dos hermanos deben coordinarse.
3. Usa Context para distribuir un valor estable o una capacidad a un subárbol.
4. Usa un store cuando múltiples áreas lejanas escriben y leen estado cliente con reglas propias.
5. Usa una caché de servidor para datos remotos; no reconstruyas invalidación, reintentos y deduplicación en un store genérico.

Context evita pasar props por muchos niveles, pero no elimina renders ni crea persistencia. Un store global reduce cableado, pero también aumenta el alcance de cada cambio. La herramienta se elige por ciclo de vida y propiedad, no por cantidad de líneas.

## URL como estado

Filtros, búsquedas y paginación suelen pertenecer a la URL porque deben sobrevivir una recarga, poder compartirse y respetar atrás/adelante. El estado local todavía puede conservar detalles transitorios como un menú abierto.

## Revisión de arquitectura

Para cada dato pregunta quién es su fuente de verdad, quién puede cambiarlo, cuánto dura, si debe sobrevivir un refresh y qué pasa cuando falla la red. Esas respuestas suelen revelar si necesitas estado local, URL, cookie, caché de servidor, base de datos o ninguna persistencia.

Añade dos preguntas: quién puede observar el dato y cuándo deja de ser válido. Ayudan a detectar secretos enviados al cliente y cachés sin una política de frescura.
