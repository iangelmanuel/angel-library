---
title: useOptimistic
description: Mostrar el resultado esperado de una acción antes de que el servidor confirme y reconciliarlo con el estado real.
type: guides
sidebar:
  order: 14
tags: [react, hooks, forms]
scope: react (useOptimistic)
updatedAt: 2026-09-07
---

Marcar una publicación y esperar la respuesta del servidor antes de actualizar el icono se siente lento, aunque la petición tarde pocos milisegundos. `useOptimistic` muestra inmediatamente el estado que se espera obtener y luego lo reconcilia con el valor real cuando termina la acción.

La actualización optimista es una predicción visual, no una confirmación. Acciones irreversibles o con alta probabilidad de rechazo —un pago, eliminar datos o cambiar permisos— necesitan mensajes y estados más conservadores.

## La forma básica

Recibe el valor real (`name`) y devuelve un valor optimista que, cuando no hay una acción en curso, coincide con ese valor real. `setOptimisticName` se usa dentro de una Action, como una función pasada a `startTransition` o al prop `action` de un `<form>`.

```tsx
import { startTransition, useActionState, useOptimistic } from "react"
import { actualizarNombre } from "./api"

function EditarNombre({
  nombre,
  onActualizado
}: {
  nombre: string
  onActualizado: (n: string) => void
}) {
  const [nombreOptimista, setNombreOptimista] = useOptimistic(nombre)

  const [error, enviar, pendiente] = useActionState(async (
    _anterior: string | null, formData: FormData
  ): Promise<string | null> => {
    const entrada = formData.get("nombre")
    if (typeof entrada !== "string" || !entrada.trim()) return "Escribe un nombre."
    const nuevoNombre = entrada.trim()
    setNombreOptimista(nuevoNombre) // se muestra ya, antes de la respuesta

    try {
      const confirmado = await actualizarNombre(nuevoNombre)
      startTransition(() => onActualizado(confirmado))
      return null
    } catch {
      return "No se pudo guardar. Inténtalo de nuevo."
    }
  }, null)

  return (
    <form action={enviar}>
      <p>Nombre: {nombreOptimista}</p>
      <label htmlFor="nombre">Nuevo nombre</label>
      <input
        id="nombre"
        name="nombre"
        required
        disabled={pendiente}
      />
      <button disabled={pendiente}>{pendiente ? "Guardando…" : "Guardar"}</button>
      <p role="status">{error}</p>
    </form>
  )
}
```

Requiere React 19. El módulo `./api` es propio: `actualizarNombre(nombre)` debe devolver una promesa con el nombre confirmado y rechazarla si falla la petición. `onActualizado` actualiza el estado del componente padre. En Next.js este componente necesita una frontera `"use client"`.

Si la petición falla, el `catch` comunica el error y la proyección vuelve al nombre real al terminar la Action. El estado pendiente procede de `useActionState`: comparar los nombres no detectaría una petición que guarda el mismo nombre.

## Con reducer — actualizaciones más complejas

El segundo argumento opcional es un reducer, para cuando el valor optimista no es simplemente "reemplazar", sino derivarse del estado actual (agregar un item a una lista, por ejemplo).

```tsx
const [mensajesOptimistas, agregarMensajeOptimista] = useOptimistic(
  mensajes,
  (estado, nuevoMensaje: string) => [
    ...estado,
    { texto: nuevoMensaje, enviando: true }
  ]
)
```

## Referencia rápida

| API                                 | Uso                                                             |
| ----------------------------------- | --------------------------------------------------------------- |
| `useOptimistic(valorReal)`          | Valor optimista simple: igual al real, salvo durante una Action |
| `useOptimistic(valorReal, reducer)` | Valor optimista derivado (agregar a una lista, etc.)            |
| `setOptimista(nuevoValor)`          | actualiza la proyección optimista dentro de una Action          |

## Límites y decisiones

- Llamar al setter fuera de una Action provoca una advertencia y no representa el flujo previsto por React.
- El valor optimista se descarta solo cuando la Action termina — si nunca resuelve (una promesa que cuelga), la UI se queda mostrando el estado optimista indefinidamente.
- Está diseñado para respuestas visuales inmediatas sobre una acción asíncrona; no reemplaza `useState` para estado independiente de una operación de servidor.
- Conserva una forma de comunicar el error. Revertir sin explicación puede hacer que la interfaz parezca ignorar el clic.
- Para listas, asigna una identidad temporal estable a cada elemento optimista y reemplázala por la identidad canónica del servidor al confirmar.

## Comprobación

Simula una respuesta lenta: el nombre cambia antes de confirmar y el formulario queda deshabilitado. Haz rechazar la promesa: reaparece el nombre anterior y se explica el error. Envía el mismo nombre: también debe mostrarse el estado pendiente.

## Recursos

- [React: useOptimistic](https://react.dev/reference/react/useOptimistic)
- [Estado de una Action](/frontend/react/react-useactionstate)
