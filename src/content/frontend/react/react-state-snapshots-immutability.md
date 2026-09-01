---
title: Estado como snapshot, batching e inmutabilidad
description: Entender por qué el estado no cambia dentro del render actual, cómo React agrupa actualizaciones y cuándo conserva o reinicia una instancia.
type: guides
order: 4
tags: [react, state, snapshots, batching, immutability, keys]
scope: modelo de estado
website: https://react.dev/learn/state-as-a-snapshot
related:
  - frontend/react/react-usestate
  - frontend/react/react-usereducer
  - frontend/react/frontend-rendering-state-data-flow
updatedAt: 2026-08-25
---

## Para recordar

- Cada render recibe un snapshot fijo de props y estado.
- Un setter solicita otro render; no modifica la variable que ya está ejecutándose.
- React agrupa actualizaciones del mismo turno para evitar commits innecesarios.
- Objetos y arrays del estado se reemplazan; no se mutan.
- La posición y la `key` determinan qué estado se conserva.

## El estado pertenece a un render

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // 0: este handler pertenece al render actual
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`count` no es una caja mutable. El handler conserva el valor del render que lo creó. `setCount` coloca una actualización en la cola y React ejecutará el componente con otro snapshot.

Este modelo explica los **closures antiguos**: un callback asíncrono sigue viendo las variables de su render, aunque la interfaz ya haya avanzado.

```tsx
function notifyLater() {
  const snapshot = count;

  window.setTimeout(() => {
    alert(`El valor al programar fue ${snapshot}`);
  }, 1_000);
}
```

## Batching y funciones actualizadoras

```tsx
function addThree() {
  setCount((current) => current + 1);
  setCount((current) => current + 1);
  setCount((current) => current + 1);
}
```

React procesa la cola y entrega a cada función el resultado de la anterior. Las tres actualizaciones pueden producir un único commit con `count + 3`.

```tsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

Las tres expresiones usan el mismo snapshot, por lo que solicitan el mismo valor. Usa la forma funcional cuando el valor siguiente depende del anterior; usa un valor directo cuando lo reemplazas por información ya conocida.

## Objetos: copiar el camino modificado

```tsx
type Profile = {
  name: string;
  address: {
    city: string;
    country: string;
  };
};

setProfile((current) => ({
  ...current,
  address: {
    ...current.address,
    city: 'Bogotá',
  },
}));
```

Spread realiza una copia superficial. Copiar solo el objeto exterior y modificar `address.city` seguiría mutando la referencia anidada. Cuando las actualizaciones anidadas son constantes, revisa el modelo de datos, un reducer o una herramienta de actualización inmutable.

## Arrays: intención y método

| Intención | Evita mutar con | Alternativa |
| --- | --- | --- |
| agregar | `push`, `unshift` | `[...items, item]`, `[item, ...items]` |
| eliminar | `splice`, `pop` | `filter` |
| reemplazar | asignar por índice | `map` o `with` |
| ordenar | `sort`, `reverse` | `toSorted`, `toReversed` |

```tsx
setTasks((current) =>
  current.map((task) =>
    task.id === id ? { ...task, completed: true } : task,
  ),
);
```

React no exige inmutabilidad por estética. Las nuevas referencias permiten comparar, conservar snapshots anteriores y evitar que un render modifique datos que otro render todavía usa.

## Una sola fuente de verdad

```tsx
const [items, setItems] = useState<Item[]>([]);
const [selectedId, setSelectedId] = useState<string | null>(null);

const selected = items.find((item) => item.id === selectedId) ?? null;
```

Guardar también `selected` como objeto duplica información. Si `items` cambia, ambas copias pueden contradecirse. Conserva la identidad mínima y deriva el resto durante el render.

## Preservar y reiniciar estado

React relaciona componentes por tipo, posición y `key`:

```tsx
{mode === 'company' ? (
  <TaxForm key="company" mode="company" />
) : (
  <TaxForm key="person" mode="person" />
)}
```

Cambiar la `key` indica que es otra identidad y reinicia su estado. Sin keys distintas, React puede conservar la misma instancia en esa posición.

No declares un componente dentro de otro componente:

```tsx
function Parent() {
  function Child() {
    return <input />;
  }

  return <Child />;
}
```

Cada render crea otro tipo `Child`, por lo que su estado puede reiniciarse. Declara los tipos de componente en el nivel del módulo.

## Elegir dónde vive el estado

| Pregunta | Consecuencia |
| --- | --- |
| ¿solo un componente lo usa? | estado local |
| ¿dos hermanos deben coordinarse? | subir al ancestro común |
| ¿debe sobrevivir recarga o compartirse por enlace? | URL, storage o servidor |
| ¿proviene del servidor? | caché de datos, no copia global arbitraria |
| ¿se calcula desde otras entradas? | derivarlo, no almacenarlo |

## Caso de uso: formulario editable

Conserva un borrador local mientras se edita, pero reinícialo cuando cambia la entidad:

```tsx
function EditorRoute({ product }: { product: Product }) {
  return <ProductForm key={product.id} initialProduct={product} />;
}
```

La `key` expresa que editar otro producto inicia otra sesión de formulario. Es más claro que un efecto dedicado a copiar cada prop nueva al estado.

## Señales de un modelo incorrecto

- Efectos que sincronizan dos estados locales.
- muchos booleanos capaces de formar combinaciones imposibles.
- copiar una prop a estado en cada cambio.
- objetos profundamente anidados que requieren spreads repetidos.
- keys aleatorias para “forzar” renders.
- una store global usada para valores temporales de un componente.

