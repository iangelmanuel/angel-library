---
title: useRef
description: Acceder a un elemento del DOM y guardar un valor mutable que no dispara re-render.
category: frontend
stack: react
order: 4
tags: [react, hooks, dom]
scope: react (useRef)
updatedAt: 2026-08-16
---

`useRef` sirve para dos cosas que no tienen nada que ver entre sí, y por eso confunde: acceder a un nodo del DOM real, y guardar un valor que persiste entre renders **sin** causar un re-render al cambiar (a diferencia de `useState`). Lo que comparten es la forma: un objeto `{ current: valor }` estable a lo largo de la vida del componente.

## Referenciar un elemento del DOM

Pasarle el ref a la prop `ref` de un elemento hace que React ponga el nodo real en `.current` después de montarlo. Útil para enfocar un input, medir un tamaño o integrar una librería que necesita el DOM directo (un canvas, un mapa).

```tsx
import { useRef } from 'react';

function BuscadorConFoco() {
  const inputRef = useRef<HTMLInputElement>(null);

  function enfocar() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={enfocar}>Buscar</button>
    </>
  );
}
```

## Guardar un valor mutable sin re-render

A diferencia de `setState`, escribir en `ref.current` **no** vuelve a renderizar el componente. Sirve para cosas que el componente necesita recordar entre renders pero que no forman parte de lo que se muestra: el id de un `setInterval`, si un efecto ya corrió, el valor anterior de una prop.

```tsx
function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function iniciar() {
    if (intervaloRef.current) return; // ya está corriendo
    intervaloRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
  }

  function detener() {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }

  return (
    <>
      <p>{segundos}s</p>
      <button onClick={iniciar}>Iniciar</button>
      <button onClick={detener}>Detener</button>
    </>
  );
}
```

## Resumen

| Uso | Ejemplo |
| --- | --- |
| Referenciar un nodo del DOM | `<input ref={inputRef} />`, después `inputRef.current.focus()` |
| Guardar un valor mutable sin re-render | Id de un timer, un flag "ya corrió", el valor anterior de algo |
| `useRef(valorInicial)` | Devuelve `{ current: valorInicial }`, estable entre renders |

## Consideraciones

- Leer o escribir `ref.current` durante el render (no en un handler o efecto) rompe el modelo de React — los refs son para código que corre *después* del render, en respuesta a un evento o efecto.
- Cambiar `ref.current` no dispara re-render — si el componente necesita mostrar ese valor en pantalla, es `useState`, no `useRef`.
- El ref del DOM es `null` en el primer render (antes de montar) — por eso siempre hay que chequear `inputRef.current?.algo`, nunca asumir que existe.
