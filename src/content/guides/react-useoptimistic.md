---
title: useOptimistic
description: Mostrar el resultado esperado de una acción antes de que el servidor confirme y reconciliarlo con el estado real.
category: frontend
stack: react
order: 14
tags: [react, hooks, forms]
scope: react (useOptimistic)
updatedAt: 2026-08-25
---

Marcar una publicación y esperar la respuesta del servidor antes de actualizar el icono se siente lento, aunque la petición tarde pocos milisegundos. `useOptimistic` muestra inmediatamente el estado que se espera obtener y luego lo reconcilia con el valor real cuando termina la acción.

La actualización optimista es una predicción visual, no una confirmación. Acciones irreversibles o con alta probabilidad de rechazo —un pago, eliminar datos o cambiar permisos— necesitan mensajes y estados más conservadores.

## La forma básica

Recibe el valor real (`name`) y devuelve un valor optimista que, cuando no hay una acción en curso, coincide con ese valor real. `setOptimisticName` se usa dentro de una Action, como una función pasada a `startTransition` o al prop `action` de un `<form>`.

```tsx
import { useOptimistic, startTransition } from 'react';
import { actualizarNombre } from './api';

function EditarNombre({ nombre, onActualizado }: { nombre: string; onActualizado: (n: string) => void }) {
  const [nombreOptimista, setNombreOptimista] = useOptimistic(nombre);

  async function enviar(formData: FormData) {
    const nuevoNombre = formData.get('nombre') as string;
    setNombreOptimista(nuevoNombre); // se muestra ya, antes de la respuesta

    const confirmado = await actualizarNombre(nuevoNombre);

    startTransition(() => {
      onActualizado(confirmado); // el estado real se actualiza; si falló, nombreOptimista vuelve a "nombre"
    });
  }

  return (
    <form action={enviar}>
      <p>Nombre: {nombreOptimista}</p>
      <input name="nombre" disabled={nombre !== nombreOptimista} />
      <button>Guardar</button>
    </form>
  );
}
```

Si `actualizarNombre` lanza un error y `onActualizado` nunca llega a llamarse con el valor nuevo, `nombreOptimista` vuelve solo al valor real (`nombre`) — no hace falta un `catch` que revierta el estado a mano.

## Con reducer — actualizaciones más complejas

El segundo argumento opcional es un reducer, para cuando el valor optimista no es simplemente "reemplazar", sino derivarse del estado actual (agregar un item a una lista, por ejemplo).

```tsx
const [mensajesOptimistas, agregarMensajeOptimista] = useOptimistic(
  mensajes,
  (estado, nuevoMensaje: string) => [...estado, { texto: nuevoMensaje, enviando: true }],
);
```

## Referencia rápida

| API | Uso |
| --- | --- |
| `useOptimistic(valorReal)` | Valor optimista simple: igual al real, salvo durante una Action |
| `useOptimistic(valorReal, reducer)` | Valor optimista derivado (agregar a una lista, etc.) |
| `setOptimista(nuevoValor)` | actualiza la proyección optimista dentro de una Action |

## Límites y decisiones

- Llamar al setter fuera de una Action provoca una advertencia y no representa el flujo previsto por React.
- El valor optimista se descarta solo cuando la Action termina — si nunca resuelve (una promesa que cuelga), la UI se queda mostrando el estado optimista indefinidamente.
- Está diseñado para respuestas visuales inmediatas sobre una acción asíncrona; no reemplaza `useState` para estado independiente de una operación de servidor.
- Conserva una forma de comunicar el error. Revertir sin explicación puede hacer que la interfaz parezca ignorar el clic.
- Para listas, asigna una identidad temporal estable a cada elemento optimista y reemplázala por la identidad canónica del servidor al confirmar.
