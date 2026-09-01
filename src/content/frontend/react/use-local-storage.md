---
title: useLocalStorage
description: Estado de React sincronizado con localStorage — persiste solo, se inicializa en el primer render y se mantiene en sync entre pestañas.
type: hooks
order: 1
tags: [react, hooks, storage, typescript]
framework: React
language: typescript
related: [general/utils/storage]
updatedAt: 2026-08-25
---

## Cuándo usarlo

- Preferencias del usuario (tema, idioma, tamaño de fuente) que deben sobrevivir a un refresh.
- Estado de UI que no vale la pena perder al recargar (un filtro aplicado, un draft de formulario).
- Cualquier `useState` que hoy escribes a mano seguido de un `useEffect` que lo guarda en `localStorage`.

No lo uses para datos sensibles (tokens, contraseñas) ni para estado que debe ser el mismo en el servidor durante el SSR — `localStorage` no existe ahí.

## Código

```ts title="hooks/useLocalStorage.ts"
import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved = next instanceof Function ? next(current) : next;

        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // cuota excedida o storage no disponible: el estado en memoria sigue funcionando
        }

        return resolved;
      });
    },
    [key],
  );

  // Sincroniza si otra pestaña cambia la misma key
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key !== key || event.newValue === null) return;

      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch {
        // valor corrupto en la otra pestaña: ignorarlo, no pisar el estado local
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, setStoredValue] as const;
}
```

## Uso

```tsx
const [tema, setTema] = useLocalStorage<'claro' | 'oscuro'>('tema', 'oscuro');

<button onClick={() => setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro'))}>
  Cambiar tema
</button>
```

La API es igual a `useState`: acepta un valor directo o una función que recibe el valor actual, y el segundo elemento del tuple actualiza tanto el estado en memoria como `localStorage` en el mismo paso.

## Hidratación, sincronización y privacidad

- **El `useState` con función inicializadora** (`() => ...`) evita leer `localStorage` en cada render — solo corre una vez, al montar.
- **`typeof window === 'undefined'`** cubre el caso de un framework con SSR (Next.js, Astro con islas): en el servidor no existe `window`, y sin este chequeo el componente rompe el build o el render inicial.
- **El listener de `storage`** solo dispara en pestañas *distintas* a la que hizo el cambio — el navegador no emite ese evento en la misma pestaña que escribió, por eso `setStoredValue` actualiza el estado local directamente en vez de depender del evento.
- Para objetos grandes o que cambian muy seguido, `localStorage` no es el lugar — es sincrónico y bloquea el hilo principal en escrituras grandes.
