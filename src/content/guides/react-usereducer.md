---
title: useReducer
description: Estado complejo con lógica centralizada — patrón básico y acciones tipadas con payload usando discriminated unions.
category: frontend
stack: react
order: 3
tags: [react, hooks, state, typescript]
scope: react (useReducer)
updatedAt: 2026-08-16
---

Cuando el estado de un componente tiene varios campos que cambian juntos, o la lógica de "cómo cambia" es más compleja que un `setState`, tener 5 `useState` sueltos empieza a sentirse desordenado — es fácil actualizar uno y olvidarse de otro relacionado. `useReducer` centraliza esa lógica en una sola función pura: dado el estado actual y una acción, devuelve el estado siguiente. El componente ya no decide *cómo* cambia el estado, solo *qué pasó* (`dispatch({ type: '...' })`).

## Integración básica

```tsx
import { useReducer } from 'react';

interface State {
  nombre: string;
  edad: number;
}

type Action =
  | { type: 'incrementar_edad' }
  | { type: 'cambiar_nombre'; nombre: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'incrementar_edad':
      return { ...state, edad: state.edad + 1 };
    case 'cambiar_nombre':
      return { ...state, nombre: action.nombre };
  }
}

function Perfil() {
  const [state, dispatch] = useReducer(reducer, { nombre: 'Ana', edad: 30 });

  return (
    <>
      <p>{state.nombre}, {state.edad} años</p>
      <button onClick={() => dispatch({ type: 'incrementar_edad' })}>Cumplir años</button>
    </>
  );
}
```

## Acciones con payload — discriminated union

El truco está en el tipo `Action`: cada variante tiene su propio `type` como valor literal, más los campos que esa acción específica necesita. TypeScript usa el `type` como discriminante — dentro de cada `case`, `action` ya está tipado con solo los campos de esa variante, sin castear nada a mano.

```ts
type Action =
  | { type: 'agregar_item'; item: string }
  | { type: 'quitar_item'; id: string }
  | { type: 'actualizar_cantidad'; id: string; cantidad: number }
  | { type: 'vaciar_carrito' };

function reducer(state: CarritoState, action: Action): CarritoState {
  switch (action.type) {
    case 'agregar_item':
      // acá action.item existe y está tipado — action.id no existiría
      return { ...state, items: [...state.items, action.item] };
    case 'quitar_item':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'actualizar_cantidad':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, cantidad: action.cantidad } : i)),
      };
    case 'vaciar_carrito':
      return { ...state, items: [] };
  }
}
```

TypeScript también avisa si te olvidaste de manejar una variante del tipo `Action` en el `switch` — con `strict` activado y sin `default`, un `case` faltante rompe la verificación de que la función devuelve `State` en todos los caminos.

## Inicialización perezosa (tercer argumento)

Si el estado inicial es costoso de calcular, un tercer argumento (`init`) evita recalcularlo en cada render — a diferencia de pasar el resultado directo, que sí se ejecutaría de nuevo cada vez que el componente renderiza.

```ts
function crearEstadoInicial(nombreUsuario: string): State {
  return { nombre: nombreUsuario, edad: 0 /* ... cálculo costoso ... */ };
}

const [state, dispatch] = useReducer(reducer, nombreUsuario, crearEstadoInicial);
```

## Resumen

| Pieza | Qué es |
| --- | --- |
| `reducer(state, action)` | Función pura: recibe estado + acción, devuelve el estado siguiente |
| `dispatch({ type, ...payload })` | Como se "pide" un cambio, nunca se muta el estado directo |
| `type Action = {...} \| {...}` | Discriminated union: cada acción con su propio `type` y payload tipado |
| Tercer argumento de `useReducer` | Función de inicialización perezosa, para estado inicial costoso |

## Consideraciones

- El reducer tiene que ser una función pura: nada de `fetch`, `Math.random()` ni mutar `state` directo — siempre devolver un objeto nuevo.
- Sin un `case` para alguna acción y sin `default`, TypeScript avisa si el switch no cubre todos los casos — dejalo así, es la red de seguridad que justifica escribir la discriminated union.
- `useReducer` no es "mejor" que `useState` por definición — para 1-2 campos independientes, `useState` sigue siendo más simple. Vale la pena cuando varios campos cambian juntos con lógica compartida.
