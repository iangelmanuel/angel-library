---
title: React — JSX, componentes, props, estado y formularios
description: Modelo mental inicial de React para construir componentes predecibles antes de entrar en hooks, efectos y optimizaciones.
category: frontend
stack: react
order: 1
tags: [react, jsx, components, props, state, events]
related:
  - technologies/react
  - guides/react-usestate
  - guides/react-useref
  - guides/react-useeffect
updatedAt: 2026-08-19
---

React describe una interfaz como una función del estado. Un **componente** recibe propiedades —**props**— y devuelve JSX. JSX es sintaxis que representa elementos; no es HTML pegado como texto.

```tsx
type ProductCardProps = {
  name: string;
  price: number;
  onAdd: () => void;
};

function ProductCard({ name, price, onAdd }: ProductCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{price.toLocaleString('es-CO')}</p>
      <button type="button" onClick={onAdd}>Agregar</button>
    </article>
  );
}
```

Las props son entradas de solo lectura. Para solicitar un cambio, el componente emite una intención mediante un callback; el propietario del estado decide cómo actualizarlo.

## Estado y render

```tsx
const [quantity, setQuantity] = useState(1);

function increment() {
  setQuantity((current) => current + 1);
}
```

Actualizar estado solicita otro render. La forma funcional usa el valor más reciente y es necesaria cuando el nuevo estado depende del anterior. No mutar el valor existente permite que React y el código razonen por identidad.

## Listas y keys

```tsx
{products.map((product) => (
  <ProductCard key={product.id} {...product} />
))}
```

La `key` identifica al elemento entre renders. Debe ser estable y única entre hermanos; el índice no es una buena clave cuando la lista se reordena, inserta o elimina.

## Eventos y formularios

```tsx
function SearchForm() {
  const [query, setQuery] = useState('');

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search(query.trim());
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="query">Buscar</label>
      <input id="query" value={query} onChange={(event) => setQuery(event.target.value)} />
      <button>Buscar</button>
    </form>
  );
}
```

Este es un campo **controlado**: React conserva su valor. Para formularios grandes también se puede usar `FormData` y validación del navegador sin almacenar cada pulsación, según el caso.

## Antes de agregar un efecto

Deriva valores durante el render cuando dependen solo de props o estado. Usa eventos para acciones iniciadas por la persona. Reserva efectos para sincronizar con sistemas externos —red, DOM imperativo, suscripciones— y define su limpieza.

## Referencias

- [React: describir la UI](https://react.dev/learn/describing-the-ui)
- [React: interactividad](https://react.dev/learn/adding-interactivity)
