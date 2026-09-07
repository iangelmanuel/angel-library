---
title: useTransition
description: Marcar una actualización de estado como "no urgente" para que la UI no se congele — isPending y startTransition.
type: guides
order: 13
tags: [react, hooks, performance]
scope: react (useTransition)
updatedAt: 2026-08-25
---

No todas las actualizaciones de estado son igual de urgentes. Escribir en un input debe sentirse instantáneo; actualizar una visualización grande puede esperar si React sabe que puede interrumpir ese render. `useTransition` marca una actualización como no urgente para que la interacción inmediata conserve prioridad.

Una transición no agrega un retraso fijo ni vuelve más rápido un algoritmo lento. Permite que React interrumpa y reemplace trabajo de renderizado. Un bucle JavaScript costoso que ocurre antes de actualizar el estado seguirá bloqueando el hilo principal.

## La forma básica

Devuelve un booleano (`isPending`, si la transición todavía está resolviendo) y una función (`startTransition`) que envuelve la actualización que puede esperar.

```tsx
import { useState, useTransition } from "react"

function BuscadorLista({ items }: { items: string[] }) {
  const [texto, setTexto] = useState("")
  const [consulta, setConsulta] = useState("")
  const [isPending, startTransition] = useTransition()

  const filtrados = items.filter((item) => item.includes(consulta))

  function manejarCambio(nuevoTexto: string) {
    setTexto(nuevoTexto) // urgente: el input responde ya

    startTransition(() => {
      setConsulta(nuevoTexto) // el render de la lista puede esperar
    })
  }

  return (
    <>
      <input
        value={texto}
        onChange={(e) => manejarCambio(e.target.value)}
      />
      {isPending && <span>Filtrando…</span>}
      <ul>
        {filtrados.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </>
  )
}
```

El input (`setTexto`) se actualiza al instante en cada tecla. El cambio que vuelve a renderizar la lista se marca como transición; si la persona escribe de nuevo antes de que termine, React puede abandonar el render anterior y comenzar con el valor más reciente.

## Hook vs función standalone

`useTransition` es un hook: solo se puede usar dentro de un componente o de otro hook, y da acceso a `isPending`. Si no necesitas mostrar un indicador y solo quieres marcar una actualización desde una función externa, `startTransition` también se puede importar directamente desde `react`.

```ts
import { startTransition } from "react"

startTransition(() => {
  setFiltrados(/* ... */)
})
```

## Referencia rápida

| API                                                    | Uso                                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `const [isPending, startTransition] = useTransition()` | Hook: da acceso al estado de carga de la transición                         |
| `startTransition(fn)` (standalone, de `react`)         | Igual, pero sin `isPending`, usable fuera de componentes                    |
| `isPending`                                            | `true` mientras la actualización marcada como transición todavía no terminó |

## Límites y decisiones

- Solo actualizaciones de **estado** van dentro de `startTransition` — no un `fetch`, ni nada con efectos secundarios. Es para decirle a React cómo priorizar un re-render, no para retrasar código arbitrario.
- Si la actualización "no urgente" tarda mucho y no hay ningún indicador (`isPending`), la UI puede sentirse rota (el usuario no sabe si su acción tuvo efecto) — casi siempre conviene mostrar algo con `isPending`.
- No reemplaza a `useDeferredValue` en todos los casos: `useTransition` marca una actualización que **tú** disparas dentro de un handler; `useDeferredValue` posterga un valor que ya cambió, normalmente una prop, sin que exista un handler para envolver.
- Una transición no controla inputs de texto: conserva el valor del campo en una actualización urgente y posterga el trabajo derivado.
- Después de un `await`, algunas actualizaciones pueden necesitar otro `startTransition` para conservar la prioridad de transición. Revisa este límite al coordinar acciones asíncronas.
