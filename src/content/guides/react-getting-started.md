---
title: Primeros pasos con React
description: Preparar un proyecto, entender JSX, createRoot, StrictMode y el ciclo render-commit antes de estudiar estado y efectos.
category: frontend
stack: react
order: 1
tags: [react, getting-started, jsx, rendering, strict-mode]
scope: fundamentos de React
website: https://react.dev/learn/creating-a-react-app
related:
  - technologies/react
  - guides/react-fundamentos-componentes
  - guides/frontend-rendering-state-data-flow
updatedAt: 2026-08-25
---

## En 30 segundos

- React describe una interfaz mediante componentes y vuelve a ejecutarlos cuando cambian sus entradas.
- JSX es sintaxis de JavaScript transformada durante el build; no es una plantilla HTML en texto.
- Renderizar calcula qué debería aparecer. El **commit** aplica cambios necesarios al DOM.
- Props y estado se tratan como snapshots de solo lectura durante un render.
- Los efectos conectan React con sistemas externos; no son el mecanismo general para calcular datos.

## Requisitos previos

Antes de React conviene manejar funciones, módulos, arrays, objetos, desestructuración, callbacks, Promises y eventos del navegador. React no sustituye JavaScript: organiza cómo una aplicación describe y actualiza su interfaz.

Para un producto nuevo, la documentación de React recomienda evaluar un framework que resuelva routing, datos y renderizado. Para aprender React aislado o construir una aplicación cliente con decisiones propias, un proyecto Vite ofrece un entorno pequeño.

```bash
pnpm create vite mi-react --template react-ts
cd mi-react
pnpm install
pnpm dev
```

## Punto de entrada

```tsx title="src/main.tsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No existe #root');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`createRoot` conecta React con un nodo DOM. En frameworks como Next.js esta entrada ya está administrada por el framework y no se escribe manualmente.

`StrictMode` habilita comprobaciones de desarrollo. Puede ejecutar renders, efectos y callbacks de ref una vez adicional para revelar impurezas o limpiezas incompletas. No duplica ese trabajo en producción y no debe “corregirse” eliminándolo sin investigar la causa.

## Primer componente

```tsx title="src/App.tsx"
type WelcomeProps = {
  name: string;
  topics: string[];
};

function Welcome({ name, topics }: WelcomeProps) {
  return (
    <section>
      <h1>Hola, {name}</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
    </section>
  );
}

export function App() {
  return <Welcome name="Angel" topics={['componentes', 'estado', 'efectos']} />;
}
```

Un componente es una función que recibe props y devuelve nodos de React. Debe comenzar con mayúscula para diferenciarse de un elemento nativo como `section` o `button`.

## JSX que debes reconocer

| Necesidad | Sintaxis |
| --- | --- |
| insertar expresión | `{value}` |
| atributo dinámico | `<img src={url} alt={description} />` |
| clase CSS | `className="card"` |
| fragmento sin wrapper | `<>...</>` |
| condicional corto | `{ready ? <Result /> : <Loading />}` |
| render opcional | `{error && <Alert />}` |
| lista | `{items.map(item => <Row key={item.id} />)}` |
| evento | `<button onClick={handleClick}>` |

Los nombres de eventos usan camelCase y reciben funciones. `onClick={save()}` ejecuta `save` durante el render; normalmente necesitas `onClick={save}` o `onClick={() => save(id)}`.

## Render y commit

```text
evento o nueva prop
  → React programa una actualización
  → render: ejecuta componentes y calcula el árbol siguiente
  → reconciliación: compara identidades y posiciones
  → commit: actualiza el DOM necesario
  → el navegador pinta
  → se ejecutan efectos cuando corresponda
```

Un render no equivale a reemplazar todo el DOM. Tampoco significa que “la función ocurrió una sola vez”: React puede ejecutarla de nuevo, interrumpir trabajo o descartar un resultado antes del commit. Por eso el cuerpo del componente debe ser puro.

## Pureza del render

```tsx
function Price({ cents }: { cents: number }) {
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(cents / 100);

  return <output>{formatted}</output>;
}
```

Calcular `formatted` es seguro: depende de una entrada y no modifica el exterior. En cambio, hacer `fetch`, escribir `localStorage`, iniciar un timer o cambiar un nodo DOM durante el render produce efectos difíciles de coordinar.

## Herramientas mínimas

- React Developer Tools permite inspeccionar componentes, props, estado y perfiles.
- El linter de Hooks detecta llamadas condicionales y dependencias incorrectas.
- TypeScript describe contratos de props, pero no valida datos recibidos de una API durante runtime.
- Las pruebas deben observar comportamiento visible, no detalles internos del componente.

## Primer ejercicio

Construye una lista filtrable con tres componentes:

1. `App` conserva la consulta.
2. `SearchInput` recibe `value` y `onChange`.
3. `ProductList` recibe la lista ya filtrada.
4. El filtro se calcula durante el render.
5. No uses `useEffect`.

Este ejercicio practica props, estado local, flujo descendente y datos derivados: la base para comprender el resto de React.

## Errores frecuentes

- Llamar un componente como función (`Card()`) en lugar de renderizar `<Card />`.
- Mutar props o variables externas durante el render.
- Usar el índice como `key` en una lista que puede cambiar de orden.
- Guardar en estado un valor que se puede calcular desde otras entradas.
- Confundir una comprobación extra de Strict Mode con un error de producción.
- comenzar por memoización o una librería global antes de comprender el flujo local.

