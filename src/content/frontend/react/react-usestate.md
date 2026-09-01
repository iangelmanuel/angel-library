---
title: useState
description: El hook más básico de estado — cuándo pasar un valor directo vs una función, y el error más común con objetos/arrays.
type: guides
order: 5
tags: [react, hooks, state]
scope: react (useState)
updatedAt: 2026-08-25
---

Cada vez que un componente necesita "recordar" algo entre renders y que la UI reaccione cuando cambia, es `useState`. Es la base sobre la que se explican todos los demás hooks de estado (`useReducer`, `useContext` para compartirlo, `useRef` para lo que *no* necesita re-renderizar).

## Lo básico

`useState` devuelve un par: el valor actual y una función para actualizarlo. Llamar a esa función programa un re-render con el nuevo valor — nunca muta la variable directamente.

```tsx
import { useState } from 'react';

function Contador() {
  const [cuenta, setCuenta] = useState(0);

  return <button onClick={() => setCuenta(cuenta + 1)}>{cuenta}</button>;
}
```

## Valor directo vs función actualizadora

`setCuenta(cuenta + 1)` usa el valor de `cuenta` capturado en ese render. Si el nuevo valor depende del anterior y puedes llamar al setter varias veces seguidas (o desde un callback async), la forma funcional evita leer un valor desactualizado.

```tsx
setCuenta(cuenta + 1); // usa el "cuenta" de este render

setCuenta((prev) => prev + 1); // usa siempre el valor más reciente, aunque se llame varias veces seguidas
```

```tsx
function incrementarDosVeces() {
  setCuenta((prev) => prev + 1);
  setCuenta((prev) => prev + 1); // con la forma directa, esto NO sumaría 2
}
```

## El error más común: mutar objetos o arrays

React compara el estado anterior con el nuevo por referencia, no por contenido profundo. Mutar el objeto/array existente y volver a pasarlo no dispara re-render — la referencia es la misma, React asume que no cambió nada.

```tsx
const [usuario, setUsuario] = useState({ nombre: 'Ana', edad: 30 });

// 🔴 Muta el objeto existente — React no detecta el cambio
usuario.edad = 31;
setUsuario(usuario);

// ✅ Objeto nuevo, con el resto de propiedades copiadas
setUsuario({ ...usuario, edad: 31 });
```

Mismo caso con arrays: `push`/`splice`/`sort` mutan en el lugar — `[...array, nuevoItem]`, `array.filter(...)`, `array.map(...)` devuelven uno nuevo.

## Inicialización perezosa

Si el valor inicial requiere un cálculo costoso, pasarlo como función evita que se ejecute en cada render — `useState` solo la llama una vez, en el primer render.

```tsx
const [datos, setDatos] = useState(() => calcularAlgoCostoso());
```

## API de estado en una mirada

| Uso | Ejemplo |
| --- | --- |
| Declarar estado | `const [valor, setValor] = useState(inicial)` |
| Actualizar con el valor de este render | `setValor(nuevoValor)` |
| Actualizar basado en el valor más reciente | `setValor(prev => prev + 1)` |
| Inicialización perezosa | `useState(() => calculoInicialCostoso())` |
| Objeto/array nuevo, no mutado | `{ ...obj, campo: nuevo }`, `[...arr, item]` |

## Identidad, closures y estado derivado

- `setValor(mismoValor)` con el mismo valor primitivo no dispara re-render — React lo compara con `Object.is` antes de programar la actualización.
- Varias llamadas a `setValor` en el mismo handler se agrupan (batching): React re-renderiza una sola vez al final, no una vez por cada `setValor`.
- Cuando la lógica de "cómo cambia" el estado se vuelve compleja (varios campos relacionados, varias formas de actualizar), es momento de mirar [`useReducer`](/frontend/react/react-usereducer) en vez de seguir sumando `useState` sueltos.
