---
title: useIntersectionObserver
description: Saber si un elemento está visible en el viewport — lazy loading, infinite scroll y animaciones al hacer scroll, sin listeners de scroll a mano.
category: frontend
stack: react
order: 26
tags: [react, hooks, dom, performance, typescript]
framework: React
language: typescript
updatedAt: 2026-08-16
---

## Cuándo usarlo

- Infinite scroll: un elemento "centinela" al final de la lista dispara cargar más cuando entra en el viewport.
- Lazy loading de imágenes o componentes pesados: montar/cargar solo cuando el elemento está por aparecer.
- Animar algo cuando entra en pantalla (fade-in, contador que arranca), sin un listener de `scroll` calculando posiciones a mano.

`IntersectionObserver` es la API del navegador pensada exactamente para esto — es más eficiente que un listener de `scroll` con `getBoundingClientRect()` en cada evento, porque el navegador calcula la intersección de forma nativa y asíncrona, sin bloquear el hilo principal.

## Código

```ts title="hooks/useIntersectionObserver.ts"
import { useEffect, useRef, useState, type RefObject } from 'react';

interface Options extends IntersectionObserverInit {
  /** Si es true, deja de observar apenas se vuelve visible una vez (útil para lazy load) */
  once?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement>(
  options: Options = {},
): [RefObject<T | null>, boolean] {
  const { once = false, ...observerOptions } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);

      if (entry.isIntersecting && once) {
        observer.disconnect();
      }
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, observerOptions.threshold, observerOptions.root, observerOptions.rootMargin]);

  return [ref, isVisible];
}
```

## Uso

```tsx
// Lazy load: cargar la imagen real solo cuando está por entrar en pantalla
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '200px', // empieza a cargar 200px antes de que sea visible
    once: true,
  });

  return <div ref={ref}>{isVisible && <img src={src} alt={alt} />}</div>;
}

// Infinite scroll: centinela al final de la lista
function ListaConScroll({ onLoadMore }: { onLoadMore: () => void }) {
  const [sentinelRef, isVisible] = useIntersectionObserver<HTMLDivElement>();

  useEffect(() => {
    if (isVisible) onLoadMore();
  }, [isVisible, onLoadMore]);

  return <div ref={sentinelRef} />;
}
```

## Consideraciones

- **`rootMargin` es el ajuste más útil para lazy loading**: un valor positivo (`'200px'`) hace que `isIntersecting` se vuelva `true` *antes* de que el elemento sea literalmente visible, dando tiempo a que la imagen o los datos carguen mientras el usuario todavía está scrolleando hacia ahí.
- **`once: true`** desconecta el observer apenas se cumple la condición una vez — para lazy loading no tiene sentido seguir observando algo que ya cargó; para animaciones "on scroll" que deben repetirse cada vez que el elemento entra y sale, dejalo en `false` (el default).
- **Las dependencias del efecto son deliberadamente explícitas** (`threshold`, `root`, `rootMargin`, no el objeto `observerOptions` completo): un objeto literal pasado inline (`{ threshold: 0.5 }`) es una referencia nueva en cada render, así que depender del objeto entero re-crearía el observer todo el tiempo. Comparar sus campos primitivos evita ese loop.
- Si necesitás varios thresholds o lógica más fina (por ejemplo, un porcentaje exacto de visibilidad), `entry.intersectionRatio` da ese dato — el hook solo expone el booleano porque cubre el caso de uso más común, pero es fácil de extender devolviendo `entry` completo en vez de solo `isVisible`.
