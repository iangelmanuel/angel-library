---
title: Rendimiento, memoización y React Compiler
description: Medir renders, usar memo, useMemo y useCallback con criterio, diferir trabajo y entender qué automatiza React Compiler.
category: frontend
stack: react
order: 16
tags: [react, performance, memoization, compiler, profiler]
scope: rendimiento de React
website: https://react.dev/learn/react-compiler
related:
  - guides/react-hooks-reference
  - guides/react-usetransition
  - guides/react-suspense-lazy-use
updatedAt: 2026-08-25
---

## En 30 segundos

- Un render adicional no es automáticamente un problema; el trabajo lento medido sí.
- Corrige primero estado mal ubicado, efectos en cascada y árboles demasiado amplios.
- `memo`, `useMemo` y `useCallback` reutilizan resultados bajo condiciones concretas.
- `useTransition` y `useDeferredValue` priorizan la respuesta visual; no reducen necesariamente el trabajo total.
- React Compiler puede insertar memoización durante el build, pero exige código compatible con las Rules of React.

## Qué provoca un render

Un componente puede renderizar porque cambió su estado, porque renderizó su padre, porque cambió un contexto que consume o porque una fuente externa notificó un snapshot diferente. React puede ejecutar el render y decidir que el DOM no necesita cambios.

Antes de optimizar pregunta:

1. ¿la interacción realmente se siente lenta?
2. ¿qué componente ocupa tiempo en React Profiler?
3. ¿el costo está en render, commit, layout, red o JavaScript externo?
4. ¿el estado vive más arriba de lo necesario?

## Optimización estructural antes de memoizar

- Mantén estado transitorio cerca de quien lo usa.
- Prefiere composición y `children` para que un wrapper con estado no reconstruya contenido independiente.
- Elimina efectos que actualizan estado derivado y provocan renders en cadena.
- Divide contextos que cambian con frecuencias distintas.
- Virtualiza listas realmente grandes.
- Carga código pesado cuando la funcionalidad se abre.

## `memo`

```tsx
import { memo } from 'react';

const ResultRow = memo(function ResultRow({ result }: { result: Result }) {
  return <li>{result.title}</li>;
});
```

`memo` permite omitir el render cuando las props son iguales según comparación superficial. No impide renders causados por estado o contexto propios. Si cada render recibe un objeto o callback nuevo, la comparación no puede reutilizar la prop anterior.

## `useMemo`

```tsx
const visibleResults = useMemo(
  () => expensiveFilter(results, query),
  [results, query],
);
```

Úsalo cuando el cálculo es costoso y sus dependencias permanecen estables, o cuando una identidad estable participa en otra optimización. No lo uses para ejecutar efectos ni como garantía de persistencia semántica.

## `useCallback`

```tsx
const selectResult = useCallback((id: string) => {
  setSelectedId(id);
}, []);

return <MemoizedList results={results} onSelect={selectResult} />;
```

`useCallback(fn, deps)` conserva la identidad de `fn`; no evita crear todo el código alrededor ni vuelve más rápida la función al ejecutarse. Es útil cuando el callback cruza hacia un hijo memoizado o es una dependencia cuya estabilidad importa.

## Prioridad: transition y valor diferido

```tsx
const [isPending, startTransition] = useTransition();

function changeTab(nextTab: Tab) {
  startTransition(() => setTab(nextTab));
}
```

```tsx
const deferredQuery = useDeferredValue(query);
```

La transición marca una actualización que controlas. El valor diferido recibe un valor que ya cambió y permite que una parte costosa se actualice en segundo plano. Ninguna API agrega debounce ni cancela una consulta por sí sola.

## React Compiler

React Compiler analiza componentes y Hooks durante el build y puede aplicar automáticamente optimizaciones equivalentes a memoización. No cambia el modelo de estado ni vuelve puro un componente impuro.

```text
código que respeta las Rules of React
  → análisis del compiler
  → memoización insertada durante build
  → menos mantenimiento manual de identidades
```

Para adoptarlo:

1. actualiza el linter y corrige violaciones de las Rules of React;
2. habilítalo según el framework o build tool;
3. empieza de forma incremental si el proyecto es grande;
4. compara perfiles y pruebas antes/después;
5. no elimines toda memoización existente sin medir el cambio.

`"use memo"` y `"use no memo"` controlan casos puntuales del compiler. No deben sustituir una configuración y una arquitectura comprensibles.

## Caso de diagnóstico

Una búsqueda lenta puede tener varios cuellos distintos:

| Síntoma | Primera opción |
| --- | --- |
| cada tecla hace request | debounce o caché de datos |
| lista filtra 50 000 elementos | estructura de datos, worker o memo medido |
| input se congela mientras pinta | `useDeferredValue` o transición |
| miles de nodos DOM | virtualización o paginación |
| todos los consumidores de contexto renderizan | dividir contexto o store con selector |
| bundle inicial incluye editor pesado | `lazy` o import dinámico |

## Qué no hacer

- Añadir `useMemo` a cada expresión.
- Comparar props profundamente dentro de `memo` sin medir el costo.
- usar keys aleatorias para “refrescar”.
- guardar datos derivados en estado para evitar un cálculo trivial.
- ignorar red, imágenes, layout y JavaScript de terceros porque React Profiler no los muestra.
- asumir que React Compiler elimina la necesidad de comprender renders y efectos.

