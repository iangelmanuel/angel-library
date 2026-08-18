---
title: useEventListener
description: addEventListener declarativo y tipado — sobre window, document o un ref, con cleanup automático y sin handlers obsoletos.
category: frontend
stack: react
order: 25
tags: [react, hooks, dom, typescript]
framework: React
language: typescript
related: [guides/react-useeffect]
updatedAt: 2026-08-16
---

## Cuándo usarlo

- Escuchar eventos de `window`/`document` (scroll, resize, keydown) desde un componente, con cleanup garantizado.
- Suscribirse a un evento de un elemento del DOM vía `ref` sin escribir `useEffect` + `addEventListener` + `removeEventListener` cada vez.
- Reemplazar los `useEffect` repetidos que solo existen para un listener — este hook es ese `useEffect`, escrito una vez y reutilizado.

## Código

```ts title="hooks/useEventListener.ts"
import { useEffect, useRef, type RefObject } from 'react';

type Target = Window | Document | HTMLElement;

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: RefObject<HTMLElement | null>,
): void;
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  target?: RefObject<HTMLElement | null>,
) {
  // El handler vive en un ref: el efecto no necesita re-suscribirse
  // solo porque el componente pasó una función nueva en este render.
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const el: Target = target?.current ?? window;
    if (!el || !el.addEventListener) return;

    function eventListener(event: Event) {
      savedHandler.current(event);
    }

    el.addEventListener(eventName, eventListener);
    return () => el.removeEventListener(eventName, eventListener);
  }, [eventName, target]);
}
```

## Uso

```tsx
// Sobre window (sin target)
useEventListener('keydown', (event) => {
  if (event.key === 'Escape') cerrarModal();
});

// Sobre un elemento puntual (con ref)
const buttonRef = useRef<HTMLButtonElement>(null);
useEventListener('mouseenter', () => setHovered(true), buttonRef);
```

El overload tipado (`K extends keyof WindowEventMap`) hace que `event` en el callback tenga el tipo correcto según el nombre del evento — `'keydown'` te da `KeyboardEvent`, `'mouseenter'` te da `MouseEvent`, sin castear nada a mano.

## Consideraciones

- **El `handler` en un `ref`** (en vez de directo en las dependencias del segundo `useEffect`) es lo que evita quitar y volver a poner el listener en cada render cuando el componente pasa una función inline — el listener real (`eventListener`) se registra una sola vez por `eventName`/`target`, y siempre llama a la versión más reciente del handler a través del ref.
- **`target` es opcional**: sin él, escucha en `window` — el caso más común (scroll, resize, teclas globales). Con un `ref`, escucha en ese elemento puntual.
- **Ojo con un `ref` que todavía no existe**: si `target.current` es `null` cuando corre el efecto (el elemento se monta condicionalmente, o el ref se asigna después), el hook no engancha nada — y como la identidad del objeto `ref` no cambia cuando `.current` sí, el efecto no se vuelve a ejecutar solo. Si el elemento puede aparecer después del montaje inicial, necesitas otra señal en las dependencias (un `useState` que marque "ya montado", por ejemplo) para forzar la re-suscripción.
- No lo uses para eventos de React ya cubiertos por props (`onClick`, `onChange`) — sirve para eventos que no tienen equivalente como prop de JSX, o para escuchar fuera del elemento que renderiza el componente.
