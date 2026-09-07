---
title: useMediaQuery
description: Consultar media queries desde React con suscripciones y un valor inicial coherente durante la hidratación.
type: hooks
order: 2
tags: [react, hooks, responsive, typescript]
framework: React
language: typescript
updatedAt: 2026-09-07
---

## Cuándo usarlo

- Renderizar un componente distinto en mobile vs desktop (no solo ocultar con CSS: evitar montar algo pesado que no hace falta).
- Reaccionar a `prefers-color-scheme` o `prefers-reduced-motion` desde JS, no solo desde CSS.
- Cualquier lógica condicional que hoy depende de `window.innerWidth` leído a mano en un `resize` listener.

Si el cambio es puramente visual (ocultar/mostrar, reordenar), prefiere CSS (`@media`) — este hook es para cuando el breakpoint decide **qué se renderiza**, no solo cómo se ve.

## Código

```ts title="hooks/useMediaQuery.ts"
import { useCallback, useSyncExternalStore } from "react"

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((notify: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", notify)
    return () => media.removeEventListener("change", notify)
  }, [query])
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
```

## Uso

```tsx
const isDesktop = useMediaQuery('(min-width: 768px)');
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

return isDesktop ? <SidebarCompleto /> : <MenuHamburguesa />;
```

Breakpoints comunes que conviene mantener consistentes con los de Tailwind (`sm`, `md`, `lg`) si el proyecto ya los usa, para no tener dos fuentes de verdad sobre dónde "empieza" desktop.

## SSR, accesibilidad y fuente de verdad

- **Snapshot del servidor**: `false` se usa tanto en SSR como durante la hidratación inicial; después React lee el valor del navegador. Evita el desacuerdo de HTML que produciría leer un valor distinto directamente en el primer render cliente. Puede haber un cambio visual posterior: reserva espacio o usa CSS si solo cambia la presentación.
- **`addEventListener('change', ...)`** es la API moderna de `MediaQueryList`; el método viejo (`addListener`/`removeListener`) está deprecado — no hace falta soportarlo salvo que el proyecto todavía deba correr en Safari muy viejo.
- El hook re-suscribe si `query` cambia (por ejemplo, un breakpoint calculado dinámicamente) — si el string es literal y fijo, no hay overhead extra en re-renders.
- No reemplaza CSS para la mayoría de los casos responsive — úsalo solo cuando la decisión afecta qué componente se monta, no cómo se ve uno que ya está montado.

## Requisitos y comprobación

Requiere React 18+ y `matchMedia` en el navegador. Pruébalo en una página prerenderizada con un viewport que cumpla la consulta: no debe aparecer una advertencia de hidratación. Cambia el ancho, cambia `query` y desmonta el componente; el valor debe actualizarse y la suscripción anterior debe retirarse.

## Fuentes

- [React: useSyncExternalStore y renderizado de servidor](https://react.dev/reference/react/useSyncExternalStore)
