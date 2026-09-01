---
title: React
description: Ruta completa de React organizada para aprender componentes y estado desde cero o consultar Hooks, Suspense, Actions y rendimiento rápidamente.
type: technologies
tags: [react, ui, javascript]
website: https://react.dev
github: https://github.com/facebook/react
related:
  - frontend/react/react-getting-started
  - frontend/react/react-fundamentos-componentes
  - frontend/react/frontend-rendering-state-data-flow
  - frontend/react/react-state-snapshots-immutability
  - frontend/react/react-hooks-reference
  - frontend/react/react-custom-hooks
  - frontend/react/react-suspense-lazy-use
  - frontend/react/react-performance-compiler
updatedAt: 2026-08-25
---

## Qué estás estudiando

React es una biblioteca para describir interfaces mediante componentes. Un componente recibe entradas y devuelve una descripción de UI. Cuando cambian props, estado o contexto, React puede volver a ejecutarlo, reconciliar el árbol anterior con el siguiente y aplicar al DOM únicamente el commit necesario.

```text
props + state + context
  → render puro
  → árbol de React
  → reconciliación
  → commit en el DOM
  → efectos que sincronizan sistemas externos
```

**JSX** es sintaxis transformada durante el build. Un **Hook** compone capacidades de React respetando un orden estable de llamadas. Ninguno reemplaza el conocimiento de JavaScript, eventos o APIs del navegador.

## Elige tu modo de entrada

### Quiero aprender desde cero

Empieza en [Primeros pasos](/frontend/react/react-getting-started). Después avanza por componentes, flujo de datos y estado antes de estudiar efectos o rendimiento.

Para cada ejemplo:

1. identifica props, estado y valores derivados;
2. predice qué evento solicita la actualización;
3. explica qué snapshot ve el handler;
4. separa render, commit y efecto;
5. verifica el comportamiento con React DevTools y una prueba visible.

No memorices Hooks como recetas aisladas. Cada uno responde a una necesidad del modelo: recordar estado, distribuir contexto, sincronizar un sistema, conservar una referencia o priorizar una actualización.

### Ya programo y quiero recordar

| Necesito | Documento |
| --- | --- |
| JSX, componentes, props, listas y formularios | [Fundamentos](/frontend/react/react-fundamentos-componentes) |
| render, commit, fuente de verdad y flujo de datos | [Renderizado y flujo](/frontend/react/frontend-rendering-state-data-flow) |
| snapshot, batching, inmutabilidad y reset con keys | [Modelo de estado](/frontend/react/react-state-snapshots-immutability) |
| estado local | [`useState`](/frontend/react/react-usestate) |
| transiciones complejas | [`useReducer`](/frontend/react/react-usereducer) |
| compartir un valor lejano | [Context](/frontend/react/react-context-api) |
| DOM o valores mutables no visuales | [`useRef`](/frontend/react/react-useref) |
| suscripciones, timers y sistemas externos | [`useEffect`](/frontend/react/react-useeffect) |
| firma y propósito de cualquier Hook | [Mapa de Hooks](/frontend/react/react-hooks-reference) |
| extraer comportamiento reutilizable | [Hooks personalizados](/frontend/react/react-custom-hooks) |
| código diferido y límites de espera | [Suspense, lazy y use](/frontend/react/react-suspense-lazy-use) |
| prioridad de actualizaciones | [`useTransition`](/frontend/react/react-usetransition) |
| UI optimista | [`useOptimistic`](/frontend/react/react-useoptimistic) |
| estado de formularios y Actions | [`useActionState`](/frontend/react/react-useactionstate) |
| memoización, Profiler y compiler | [Rendimiento](/frontend/react/react-performance-compiler) |

## Curva de aprendizaje

### Etapa 1: describir la interfaz

1. Crear un proyecto y reconocer `createRoot`, `StrictMode` y JSX.
2. Componentes, props, composición, condicionales, listas y keys.
3. Eventos y formularios controlados o no controlados.
4. Render, reconciliación y commit.

Al terminar debes construir una interfaz desde props sin mutar entradas ni iniciar efectos durante el render.

### Etapa 2: modelar estado

5. Estado como snapshot, batching e inmutabilidad.
6. `useState` y funciones actualizadoras.
7. Subir estado y conservar una sola fuente de verdad.
8. `useReducer` para transiciones relacionadas.
9. Context para distribuir valores realmente transversales.
10. Preservar o reiniciar estado mediante posición y keys.

### Etapa 3: escape hatches

11. `useRef` y referencias DOM.
12. `useEffect` como sincronización externa y su cleanup.
13. `useLayoutEffect`, `useEffectEvent` y fuentes externas cuando corresponda.
14. Hooks personalizados con contratos claros.

Un **escape hatch** permite salir del flujo declarativo para integrarse con algo externo. Debe ser una frontera visible, no el centro de la arquitectura.

### Etapa 4: asincronía y prioridad

15. Suspense, `lazy` y recursos compatibles con `use`.
16. Transitions y valores diferidos.
17. Actions, estado pendiente y actualizaciones optimistas.
18. Error Boundaries y estrategias de recuperación ofrecidas por el framework.

### Etapa 5: rendimiento y ecosistema

19. Medición con Profiler antes de memoizar.
20. `memo`, `useMemo`, `useCallback` y React Compiler.
21. Routing, datos de servidor, formularios y store global según la necesidad.
22. Componentes y hooks reutilizables después de dominar las APIs nativas.

## Glosario mínimo

| Término | Significado |
| --- | --- |
| render | ejecución que calcula la descripción siguiente de la UI |
| commit | fase que aplica cambios necesarios al DOM |
| reconciliación | relación entre elementos anteriores y siguientes por tipo, posición y key |
| snapshot | props y estado fijos disponibles para un render |
| Hook | función que compone capacidades de React |
| efecto | sincronización posterior con un sistema externo |
| hidratación | conexión de React a HTML producido por servidor |
| transición | actualización no urgente e interrumpible |

## Reglas que conectan toda la ruta

- Renderiza de forma pura; efectos y handlers contienen trabajo externo.
- El estado mínimo vive cerca de quien lo usa y se trata como inmutable.
- Un valor derivado se calcula; no se sincroniza con otro estado.
- Context distribuye datos, pero no reemplaza automáticamente una arquitectura de estado.
- Los refs no participan del render.
- La lista de dependencias describe el código; no es un interruptor elegido a conveniencia.
- Memoiza después de medir y optimizar la estructura.
- Las librerías se eligen por un problema concreto, no para evitar aprender las capacidades nativas.
