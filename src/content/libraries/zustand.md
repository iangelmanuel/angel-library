---
title: Zustand
description: Estado global sin Provider ni boilerplate — create(), selectors para evitar re-renders y el middleware persist.
category: frontend
stack: react
order: 4
tags: [react, state, typescript]
website: https://zustand.docs.pmnd.rs
github: https://github.com/pmndrs/zustand
install: npm install zustand
related:
  - guides/react-context-api
updatedAt: 2026-08-25
---

A diferencia de Context, un store de Zustand vive fuera del árbol de React: no hace falta envolver nada en un `<Provider>`, y un componente que lee una sola propiedad del store solo se re-renderiza cuando esa propiedad cambia — no cuando cambia cualquier otra parte del store, como sí pasa con Context.

## Crear el store

`create<T>()` define el estado y las acciones en el mismo lugar, tipado. `set` actualiza de forma inmutable — igual que en un reducer, siempre se devuelve un objeto nuevo.

```ts title="stores/carrito.ts"
import { create } from 'zustand';

interface CarritoStore {
  items: string[];
  agregar: (item: string) => void;
  vaciar: () => void;
}

export const useCarritoStore = create<CarritoStore>((set) => ({
  items: [],
  agregar: (item) => set((state) => ({ items: [...state.items, item] })),
  vaciar: () => set({ items: [] }),
}));
```

## Usar el store — con selector

Llamar al hook sin selector (`useCarritoStore()`) suscribe el componente a **todo** el store: se re-renderiza ante cualquier cambio, use ese campo o no. Pasarle una función selectora limita la suscripción a lo que ese componente realmente necesita.

```tsx
function ContadorCarrito() {
  const cantidad = useCarritoStore((state) => state.items.length);
  return <span>{cantidad}</span>;
}

function BotonAgregar({ producto }: { producto: string }) {
  const agregar = useCarritoStore((state) => state.agregar);
  return <button onClick={() => agregar(producto)}>Agregar</button>;
}
```

`ContadorCarrito` no se re-renderiza si cambia algo del store que no sea `items.length` — ese es el ahorro real frente a Context.

## Middleware `persist` — Guardar en localStorage

Envuelve el store para sincronizarlo automáticamente con `localStorage` (o cualquier storage compatible), sin escribir el `JSON.parse`/`stringify` a mano.

```ts title="stores/preferencias.ts"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferenciasStore {
  tema: 'claro' | 'oscuro';
  setTema: (tema: 'claro' | 'oscuro') => void;
}

export const usePreferenciasStore = create<PreferenciasStore>()(
  persist(
    (set) => ({
      tema: 'oscuro',
      setTema: (tema) => set({ tema }),
    }),
    { name: 'preferencias' }, // clave en localStorage
  ),
);
```

## API del store en una mirada

| API | Uso |
| --- | --- |
| `create<T>((set) => ({...}))` | Definir el store: estado + acciones, tipado |
| `set((state) => ({...}))` | Actualizar de forma inmutable, con acceso al estado actual |
| `useStore((state) => state.campo)` | Selector: suscribe solo a ese campo, evita re-renders de más |
| `persist(config, { name })` | Middleware para sincronizar el store con `localStorage` |

## Selectores, persistencia y alcance

- Sin selector, `useStore()` suscribe a todo el store — en componentes chicos no importa, pero en uno que renderiza seguido (una lista, un contador) vale la pena acotar la suscripción.
- Las acciones (`agregar`, `vaciar`) también se leen con selector — evita re-crear funciones nuevas innecesariamente y deja claro qué usa cada componente.
- A diferencia de [Context](/guides/react-context-api), Zustand no necesita que el componente esté dentro de ningún Provider — el store es un módulo normal, importable desde cualquier lado, incluso fuera de componentes React.
