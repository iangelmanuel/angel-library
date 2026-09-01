---
title: React — JSX, componentes, props, estado y formularios
description: Modelo mental inicial de React para construir componentes predecibles antes de entrar en hooks, efectos y optimizaciones.
type: guides
order: 2
tags: [react, jsx, components, props, state, events]
related:
  - frontend/react/react
  - frontend/react/react-usestate
  - frontend/react/react-useref
  - frontend/react/react-useeffect
updatedAt: 2026-08-25
---

React describe una interfaz como una función del estado. Un **componente** recibe propiedades —**props**— y devuelve JSX. JSX es sintaxis que representa elementos; no es HTML pegado como texto.

## En 30 segundos

| Concepto   | Idea para recordar                                          |
| ---------- | ----------------------------------------------------------- |
| componente | función que describe una parte de la interfaz               |
| JSX        | sintaxis que combina estructura y expresiones de JavaScript |
| props      | entradas de solo lectura entregadas por el padre            |
| estado     | memoria local que solicita un nuevo render al cambiar       |
| evento     | intención iniciada desde la interfaz                        |
| `key`      | identidad estable de un elemento entre renders              |
| efecto     | sincronización con un sistema externo                       |

El flujo normal es descendente: el padre entrega datos mediante props y el hijo comunica intenciones mediante callbacks. Si puedes describir una pantalla usando ese flujo, no necesitas comenzar con Context, un store global o un efecto.

## Reglas esenciales de JSX

- Un componente devuelve un solo nodo raíz; un fragmento `<>...</>` agrupa sin agregar HTML.
- Las expresiones JavaScript aparecen entre llaves: `{name}` o `{price * quantity}`.
- Los atributos usan nombres de JavaScript como `className`, `htmlFor` y `onClick`.
- Las etiquetas propias comienzan con mayúscula; `<productCard />` se interpreta como una etiqueta HTML desconocida.
- `null`, `undefined`, `false` y `true` no producen texto visible, por lo que sirven para render condicional.

```tsx
function Greeting({ name, admin }: { name: string; admin: boolean }) {
  return (
    <>
      <h1>Hola, {name}</h1>
      {admin ? <AdminPanel /> : null}
    </>
  )
}
```

JSX no es una plantilla desconectada: las variables y funciones pertenecen al alcance JavaScript del componente. Aun así, el render debe permanecer puro; no escribas en almacenamiento, no modifiques props y no inicies solicitudes como efecto lateral dentro de esa fase.

## Componentes y props

```tsx
type ProductCardProps = {
  name: string
  price: number
  onAdd: () => void
}

function ProductCard({ name, price, onAdd }: ProductCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{price.toLocaleString("es-CO")}</p>
      <button
        type="button"
        onClick={onAdd}
      >
        Agregar
      </button>
    </article>
  )
}
```

Las props son entradas de solo lectura. Para solicitar un cambio, el componente emite una intención mediante un callback; el propietario del estado decide cómo actualizarlo.

El nombre de una prop callback suele describir el evento desde el punto de vista del componente: `onAdd`, `onClose` o `onSelect`. El padre decide si eso cambia estado, navega o registra analítica. Esta separación permite reutilizar la misma tarjeta en distintos contextos.

## Composición con `children`

```tsx
function Panel({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  )
}

;<Panel title="Actividad">
  <ActivityList />
</Panel>
```

`children` representa el contenido colocado entre las etiquetas del componente. La composición suele ser más flexible que agregar props como `body`, `footer`, `icon` y `rightColumn` para cada variante posible.

## Estado y render

```tsx
const [quantity, setQuantity] = useState(1)

function increment() {
  setQuantity((current) => current + 1)
}
```

Actualizar estado solicita otro render. La forma funcional usa el valor más reciente y es necesaria cuando el nuevo estado depende del anterior. No mutar el valor existente permite que React y el código razonen por identidad.

El estado pertenece a una posición del árbol, no a la llamada de la función. React conserva esa memoria mientras el mismo tipo de componente permanezca en la misma posición y con la misma `key`. Cambiar la `key` reinicia deliberadamente su estado.

Guarda solo la información mínima. Si `total` puede calcularse como `price * quantity`, no lo dupliques en otro estado: dos valores que deben sincronizarse pueden contradecirse.

## Render condicional

```tsx
if (status === 'loading') return <Spinner />;
if (status === 'error') return <ErrorMessage />;

return isEmpty ? <EmptyState /> : <ProductList products={products} />;
```

Usa una salida temprana cuando cambia toda la pantalla y un ternario cuando eliges entre dos ramas locales. La expresión `condition && <Component />` es útil para una rama opcional, pero evita usar un número como condición: `0 && <Badge />` imprime `0`.

## Listas y keys

```tsx
{
  products.map((product) => (
    <ProductCard
      key={product.id}
      {...product}
    />
  ))
}
```

La `key` identifica al elemento entre renders. Debe ser estable y única entre hermanos; el índice no es una buena clave cuando la lista se reordena, inserta o elimina.

`key` no llega como prop al componente. Si también necesitas el identificador, pásalo explícitamente: `<ProductCard key={product.id} id={product.id} />`.

## Eventos y formularios

```tsx
function SearchForm() {
  const [query, setQuery] = useState("")

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    search(query.trim())
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="query">Buscar</label>
      <input
        id="query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button>Buscar</button>
    </form>
  )
}
```

Este es un campo **controlado**: React conserva su valor. Para formularios grandes también se puede usar `FormData` y validación del navegador sin almacenar cada pulsación, según el caso.

Un campo **no controlado** conserva su valor en el DOM y se lee al enviar el formulario. Es útil cuando no necesitas reaccionar a cada cambio. Un campo controlado conviene para validación inmediata, máscaras, dependencias entre campos o UI derivada del valor.

```tsx
function NewsletterForm() {
  function subscribe(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim()
    // Validar y enviar.
  }

  return (
    <form action={subscribe}>
      <input
        name="email"
        type="email"
        required
      />
    </form>
  )
}
```

## Antes de agregar un efecto

Deriva valores durante el render cuando dependen solo de props o estado. Usa eventos para acciones iniciadas por la persona. Reserva efectos para sincronizar con sistemas externos —red, DOM imperativo, suscripciones— y define su limpieza.

## Errores frecuentes

- Llamar un handler durante render: `onClick={save()}`; debe pasarse la función, `onClick={save}`.
- Mutar un array u objeto de estado y volver a guardar la misma referencia.
- Crear una `key` con `Math.random()` en cada render y perder el estado de los hijos.
- Copiar una prop a estado sin definir cuál es la fuente de verdad.
- Usar un efecto para calcular un valor que podía derivarse directamente.
- Declarar componentes dentro de otros componentes y reiniciar su identidad en cada render.

## Siguiente paso

Continúa con [estado como snapshot e inmutabilidad](/frontend/react/react-state-snapshots-immutability) y después estudia `useState`. Los hooks son más fáciles de recordar cuando primero se comprende el ciclo render → commit → evento → nuevo render.

## Referencias

- [React: describir la UI](https://react.dev/learn/describing-the-ui)
- [React: interactividad](https://react.dev/learn/adding-interactivity)
