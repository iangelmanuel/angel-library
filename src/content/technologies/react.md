---
title: React
description: Biblioteca de UI por componentes. Referencia rápida de los conceptos y APIs que uso a diario.
category: frontend
stack: react
tags: [react, ui, javascript]
website: https://react.dev
github: https://github.com/facebook/react
related: [libraries/react-hook-form]
updatedAt: 2026-08-10
---

## Modelo mental

- La UI es una función del estado: `ui = f(state)`.
- Un re-render no es malo; un re-render innecesario de un árbol grande, sí.
- Los efectos sirven para sincronizar con sistemas externos, no para derivar estado.

## APIs que uso a diario

| API | Para qué |
|-----|----------|
| `useState` | Estado local del componente |
| `useEffect` | Sincronizar con algo externo (fetch, DOM, suscripciones) |
| `useRef` | Valor mutable que no dispara render / referencias DOM |
| `useMemo` / `useCallback` | Memoización cuando hay medición que lo justifica |
| `useId` | Ids accesibles estables |

## Mis reglas

- El estado derivado se calcula en el render, no en un `useEffect`.
- Keys estables y únicas; nunca el índice si la lista se reordena.
- Componentes pequeños; extraer cuando un bloque crece o se repite.

## Recursos oficiales

- Documentación: <https://react.dev>
