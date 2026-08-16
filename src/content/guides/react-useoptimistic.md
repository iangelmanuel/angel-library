---
title: useOptimistic
description: Mostrar el resultado esperado de una acción antes de que el servidor confirme, y revertir solo si falla.
category: frontend
stack: react
order: 7
tags: [react, hooks, forms]
scope: react (useOptimistic)
updatedAt: 2026-08-16
---

Dar "like" a un post y esperar la respuesta del servidor para recién ahí pintar el corazón lleno se siente lento, aunque la petición tarde 200ms. `useOptimistic` muestra el estado que *se espera* que resulte de la acción inmediatamente, y lo reconcilia con el valor real apenas la acción termina — revirtiendo solo si falló.

## La forma básica

Recibe el valor real (`name`) y devuelve un valor optimista que, mientras no hay ninguna acción en curso, es igual a ese valor real. `setOptimisticName` solo tiene efecto **dentro** de una Action (una función pasada a `startTransition`, o al prop `action` de un `<form>`).

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

## Resumen

| API | Uso |
| --- | --- |
| `useOptimistic(valorReal)` | Valor optimista simple: igual al real, salvo durante una Action |
| `useOptimistic(valorReal, reducer)` | Valor optimista derivado (agregar a una lista, etc.) |
| `setOptimista(nuevoValor)` | Actualiza el valor optimista — solo funciona dentro de una Action |

## Consideraciones

- Llamar al setter fuera de una Action (afuera de `startTransition` o de un `action` de formulario) no hace nada útil — React avisa y el valor no se actualiza de forma persistente.
- El valor optimista se descarta solo cuando la Action termina — si nunca resuelve (una promesa que cuelga), la UI se queda mostrando el estado optimista indefinidamente.
- Es específicamente para UI que se siente instantánea sobre una acción async — no es un reemplazo general de `useState` para estado que no depende de una operación de servidor.
