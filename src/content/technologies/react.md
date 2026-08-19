---
title: React
description: Biblioteca de UI por componentes. Referencia rápida de los conceptos y APIs que uso a diario.
category: frontend
stack: react
tags: [react, ui, javascript]
website: https://react.dev
github: https://github.com/facebook/react
related: [libraries/react-hook-form]
updatedAt: 2026-08-19
---

## Modelo mental

- La UI es una función del estado: `ui = f(state)`.
- Un re-render no es malo; un re-render innecesario de un árbol grande, sí.
- Los efectos sirven para sincronizar con sistemas externos, no para derivar estado.

React es una biblioteca para describir interfaces mediante componentes. **JSX** es una extensión de sintaxis que permite escribir una estructura parecida a HTML dentro de JavaScript o TypeScript; durante el build se transforma en llamadas que crean elementos de React.

Un componente debe tratar sus props y estado como entradas inmutables del render. Renderizar tiene que permanecer puro: la misma entrada produce la misma descripción y no inicia efectos externos.

## Props, estado y datos derivados

```tsx
function CartSummary({ items }: { items: Item[] }) {
  const total = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  return <output>Total: {total / 100}</output>;
}
```

`items` llega como propiedad. `total` se calcula durante el render y no necesita `useState` ni `useEffect`. Guardarlo por separado obligaría a mantener dos valores sincronizados.

## APIs que uso a diario

| API | Para qué |
|-----|----------|
| `useState` | Estado local del componente |
| `useEffect` | Sincronizar con algo externo (fetch, DOM, suscripciones) |
| `useRef` | Valor mutable que no dispara render / referencias DOM |
| `useMemo` / `useCallback` | Memoización cuando hay medición que lo justifica |
| `useId` | Ids accesibles estables |

Un **Hook** es una función cuyo nombre empieza por `use` y que permite reutilizar lógica basada en capacidades de React. Los Hooks se llaman en el nivel superior del componente o de otro Hook para que React conserve su orden entre renders.

## Actualizaciones de estado

El estado se considera inmutable. Se crea una nueva referencia en vez de modificar el objeto anterior:

```tsx
setProfile((current) => ({
  ...current,
  displayName: 'Andrea',
}));
```

La forma funcional recibe el estado más reciente y es apropiada cuando la actualización depende del valor anterior. React puede agrupar actualizaciones para reducir trabajo.

## Keys y reconciliación

La **reconciliación** es el proceso con el que React relaciona elementos de un render con los del siguiente. La `key` identifica cada elemento entre hermanos.

```tsx
{tasks.map((task) => (
  <TaskRow key={task.id} task={task} />
))}
```

Una clave estable conserva el estado con la entidad correcta. El índice es problemático cuando se insertan, eliminan o reordenan elementos.

## Efectos y limpieza

```tsx
useEffect(() => {
  const controller = new AbortController();

  loadProfile(userId, { signal: controller.signal });

  return () => controller.abort();
}, [userId]);
```

El efecto sincroniza con una solicitud externa y su limpieza cancela trabajo obsoleto. La lista de dependencias describe valores usados por el efecto; omitirlos puede capturar una versión antigua.

## Componente controlado y no controlado

Un control **controlado** recibe su valor desde el estado de React y notifica cambios. Un control **no controlado** deja el valor actual en el DOM y lo lee cuando se necesita.

Los controlados facilitan reglas dinámicas; los no controlados pueden simplificar formularios que se envían mediante `FormData`. No se cambia entre ambos durante la misma vida del componente.

## Mis reglas

- El estado derivado se calcula en el render, no en un `useEffect`.
- Keys estables y únicas; nunca el índice si la lista se reordena.
- Componentes pequeños; extraer cuando un bloque crece o se repite.

## Recursos oficiales

- Documentación: <https://react.dev>
