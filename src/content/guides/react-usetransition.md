---
title: useTransition
description: Marcar una actualización de estado como "no urgente" para que la UI no se congele — isPending y startTransition.
category: frontend
stack: react
order: 6
tags: [react, hooks, performance]
scope: react (useTransition)
updatedAt: 2026-08-16
---

No todas las actualizaciones de estado son igual de urgentes. Tipear en un input tiene que sentirse instantáneo; filtrar una lista de 10.000 items a partir de ese texto puede tardar un poco sin que se note, si React sabe que puede interrumpirla. `useTransition` es esa señal: le dice a React "esta actualización puede esperar, priorizá lo demás".

## La forma básica

Devuelve un booleano (`isPending`, si la transición todavía está resolviendo) y una función (`startTransition`) que envuelve la actualización que puede esperar.

```tsx
import { useState, useTransition } from 'react';

function BuscadorLista({ items }: { items: string[] }) {
  const [texto, setTexto] = useState('');
  const [filtrados, setFiltrados] = useState(items);
  const [isPending, startTransition] = useTransition();

  function manejarCambio(nuevoTexto: string) {
    setTexto(nuevoTexto); // urgente: el input responde ya

    startTransition(() => {
      setFiltrados(items.filter((i) => i.includes(nuevoTexto))); // puede esperar
    });
  }

  return (
    <>
      <input value={texto} onChange={(e) => manejarCambio(e.target.value)} />
      {isPending && <span>Filtrando…</span>}
      <ul>{filtrados.map((i) => <li key={i}>{i}</li>)}</ul>
    </>
  );
}
```

El input (`setTexto`) se actualiza al instante en cada tecla. El filtrado (`setFiltrados`), al estar dentro de `startTransition`, no bloquea esa respuesta — si el usuario tipea de nuevo antes de que termine, React descarta el filtrado viejo y arranca uno nuevo.

## Hook vs función standalone

`useTransition` es un hook: solo se puede usar dentro de un componente o de otro hook, y da acceso a `isPending`. Si no necesitás mostrar un indicador de carga y solo querés marcar algo como transición (por ejemplo, desde una librería o un event handler fuera de un componente), `startTransition` existe también como función suelta, importable directo de `react`.

```ts
import { startTransition } from 'react';

startTransition(() => {
  setFiltrados(/* ... */);
});
```

## Resumen

| API | Uso |
| --- | --- |
| `const [isPending, startTransition] = useTransition()` | Hook: da acceso al estado de carga de la transición |
| `startTransition(fn)` (standalone, de `react`) | Igual, pero sin `isPending`, usable fuera de componentes |
| `isPending` | `true` mientras la actualización marcada como transición todavía no terminó |

## Consideraciones

- Solo actualizaciones de **estado** van dentro de `startTransition` — no un `fetch`, ni nada con efectos secundarios. Es para decirle a React cómo priorizar un re-render, no para retrasar código arbitrario.
- Si la actualización "no urgente" tarda mucho y no hay ningún indicador (`isPending`), la UI puede sentirse rota (el usuario no sabe si su acción tuvo efecto) — casi siempre conviene mostrar algo con `isPending`.
- No reemplaza a `useDeferredValue` en todos los casos: `useTransition` marca una actualización que **vos** disparás (dentro de un handler); `useDeferredValue` posterga un valor que ya cambió (típicamente una prop), sin que haya un handler para envolver.
