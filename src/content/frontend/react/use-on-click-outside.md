---
title: useOnClickOutside
description: Detectar un click o tap fuera de un elemento — la base de dropdowns, modales y menús que se cierran solos.
type: hooks
order: 4
tags: [react, hooks, dom, typescript]
framework: React
language: typescript
updatedAt: 2026-08-25
---

## Cuándo usarlo

- Cerrar un dropdown, menú o popover al hacer click fuera de él.
- Cerrar un modal sin backdrop propio (o como complemento del backdrop, para clicks en otra ventana/elemento fuera de flujo).
- Cualquier "click afuera cierra esto" que hoy se resuelve con un listener a mano en cada componente.

Si el elemento ya tiene un overlay/backdrop que captura el click (como un `<dialog>` nativo o el `Dialog` de shadcn/ui), ese backdrop suele alcanzar solo — este hook es para elementos sin overlay propio.

## Código

```ts title="hooks/useOnClickOutside.ts"
import { useEffect, type RefObject } from 'react';

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;

      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

## Uso

```tsx
function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpen((v) => !v)}>Menú</button>
      {open && <ul>{/* opciones */}</ul>}
    </div>
  );
}
```

## Portales, teclado y propagación

- **`mousedown`/`touchstart`, no `click`**: escuchar en la fase de "presionar" (no de "soltar") evita el caso raro donde un click empieza dentro del elemento (por ejemplo, seleccionando texto) y termina afuera — con `click` eso dispararía el cierre de forma inesperada.
- **`el.contains(event.target)`** es la comprobación real de "adentro o afuera" — compara contra el nodo del DOM, no contra coordenadas, así que funciona igual con scroll o con el elemento en cualquier posición.
- **`handler` en las dependencias del efecto**: si el componente pasa una función en línea (`() => setOpen(false)`), esa función es nueva en cada render, así que el efecto vuelve a suscribirse. No es un error grave —el costo de `addEventListener` y `removeEventListener` es bajo—, pero si se necesita evitarlo, se envuelve el manejador en `useCallback` en el componente que lo usa.
- El listener va en `document`, no en el elemento — por eso funciona para "afuera de X" sin importar dónde esté X en el árbol.
