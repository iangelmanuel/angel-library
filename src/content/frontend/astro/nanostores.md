---
title: Nanostores
description: Estado compartido entre islas de Astro (o entre componentes de cualquier framework) sin Context ni prop drilling.
type: libraries
order: 1
tags: [astro, react, state]
website: https://github.com/nanostores/nanostores
github: https://github.com/nanostores/nanostores
install: npm install nanostores
related:
  - frontend/astro/astro-islas
updatedAt: 2026-08-25
---

Las islas de Astro hidratan de forma aislada: dos componentes de React en la misma página no comparten estado por defecto, ni aunque estén uno al lado del otro. Nanostores resuelve justo eso — un store minúsculo (bajo 1kb) que cualquier framework puede leer, fuera del árbol de componentes de ninguno.

## `atom()` — Un valor simple

```ts title="stores/tema.ts"
import { atom } from 'nanostores';

export const $tema = atom<'claro' | 'oscuro'>('oscuro');
```

```ts
$tema.get();          // "oscuro"
$tema.set('claro');
```

## `map()` — Un objeto con updates por clave

`setKey` actualiza una sola propiedad sin reemplazar el objeto entero — evita re-renders innecesarios en las claves que no cambiaron.

```ts
import { map } from 'nanostores';

export const $perfil = map({ nombre: 'anónimo', avatar: null });

$perfil.setKey('nombre', 'Ada Lovelace');
```

## `computed()` — Derivar un valor de otro store

```ts
import { computed } from 'nanostores';

export const $temaOscuro = computed($tema, (tema) => tema === 'oscuro');
```

## Usarlo en React — `useStore()`

El hook de `@nanostores/react` suscribe el componente al store: se re-renderiza solo cuando cambia el valor que lee.

```tsx
import { useStore } from '@nanostores/react';
import { $tema } from '../stores/tema';

export function ToggleTema() {
  const tema = useStore($tema);
  return (
    <button onClick={() => $tema.set(tema === 'oscuro' ? 'claro' : 'oscuro')}>
      {tema}
    </button>
  );
}
```

## Por qué encaja con Astro

Dos islas React separadas (`client:load` en distintos componentes `.astro`) que importan el mismo `$tema` leen y escriben el mismo store — sin Context API, sin que ninguna sea "padre" de la otra. El store vive fuera del árbol de React, así que también lo puede leer/escribir un componente Vue o Svelte en la misma página.

## Stores y helpers en una mirada

| API | Uso |
| --- | --- |
| `atom(valorInicial)` | Store de un valor simple |
| `map(objetoInicial)` | Store de objeto, con `setKey()` por propiedad |
| `computed(store, fn)` | Derivar un valor de otro store |
| `store.get()` / `store.set()` | Leer/escribir fuera de React |
| `useStore(store)` (`@nanostores/react`) | Suscribir un componente React al store |
| `store.listen(cb)` / `store.subscribe(cb)` | Suscribirse manualmente (fuera de un framework) |

## Estado compartido e hidratación

- `useStore` es lo que conecta el store al ciclo de render de React — sin él, cambiar `$tema.set(...)` no re-renderiza nada, aunque el valor sí cambió.
- Nanostores no reemplaza `useState` para estado que es puramente local a un componente — es para lo que necesita cruzar entre islas o entre frameworks.
- No persiste solo: si necesitas que sobreviva a un refresh, se combina con `@nanostores/persistent` (localStorage) por separado.
