---
title: useMediaQuery
description: Suscribirse a un media query de CSS desde JS — breakpoints reactivos sin re-renderizar de más ni perder el valor inicial correcto.
type: hooks
order: 2
tags: [react, hooks, responsive, typescript]
framework: React
language: typescript
updatedAt: 2026-08-25
---

## Cuándo usarlo

- Renderizar un componente distinto en mobile vs desktop (no solo ocultar con CSS: evitar montar algo pesado que no hace falta).
- Reaccionar a `prefers-color-scheme` o `prefers-reduced-motion` desde JS, no solo desde CSS.
- Cualquier lógica condicional que hoy depende de `window.innerWidth` leído a mano en un `resize` listener.

Si el cambio es puramente visual (ocultar/mostrar, reordenar), prefiere CSS (`@media`) — este hook es para cuando el breakpoint decide **qué se renderiza**, no solo cómo se ve.

## Código

```ts title="hooks/useMediaQuery.ts"
import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)

    // Re-sincroniza al montar: el query pudo cambiar entre el render inicial y el efecto
    setMatches(mediaQueryList.matches)

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener("change", handleChange)
    return () => mediaQueryList.removeEventListener("change", handleChange)
  }, [query])

  return matches
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

- **`typeof window === 'undefined'`** en el estado inicial: en SSR, el primer render del servidor no puede saber el tamaño real del viewport del cliente — el valor por defecto es una suposición (`false`), y el efecto corrige apenas monta en el navegador. Esto puede causar un flash de un layout al otro en el primer render; si eso importa, combinalo con `useEffect` + un estado `mounted` para no renderizar nada dependiente del breakpoint hasta estar montado.
- **`addEventListener('change', ...)`** es la API moderna de `MediaQueryList`; el método viejo (`addListener`/`removeListener`) está deprecado — no hace falta soportarlo salvo que el proyecto todavía deba correr en Safari muy viejo.
- El hook re-suscribe si `query` cambia (por ejemplo, un breakpoint calculado dinámicamente) — si el string es literal y fijo, no hay overhead extra en re-renders.
- No reemplaza CSS para la mayoría de los casos responsive — úsalo solo cuando la decisión afecta qué componente se monta, no cómo se ve uno que ya está montado.
