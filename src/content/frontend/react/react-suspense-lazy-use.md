---
title: Suspense, lazy y use
description: Diseñar límites de espera, cargar código bajo demanda y leer recursos compatibles sin confundir Suspense con cualquier operación asíncrona.
type: guides
order: 12
tags: [react, suspense, lazy, use, streaming]
scope: render asíncrono
website: https://react.dev/reference/react/Suspense
related:
  - frontend/react/react-usetransition
  - frontend/nextjs/nextjs-streaming-suspense
  - frontend/react/react-performance-compiler
updatedAt: 2026-08-25
---

## Para recordar

- `<Suspense>` muestra un fallback cuando un descendiente se suspende durante el render.
- `lazy()` difiere la descarga del módulo de un componente hasta que se intenta renderizar.
- `use(Promise)` lee un recurso compatible y se integra con Suspense.
- Un `fetch` iniciado dentro de `useEffect` no activa Suspense automáticamente.
- El tamaño y la posición del límite son decisiones de experiencia de usuario.

## Cargar código con `lazy`

```tsx
import { Suspense, lazy, useState } from "react"

const MarkdownEditor = lazy(() => import("./MarkdownEditor"))

export function ArticleTools() {
  const [editing, setEditing] = useState(false)

  return (
    <section>
      <button onClick={() => setEditing(true)}>Editar</button>

      {editing && (
        <Suspense fallback={<p>Cargando editor…</p>}>
          <MarkdownEditor />
        </Suspense>
      )}
    </section>
  )
}
```

Declara `lazy` en el nivel del módulo. Si lo declaras dentro del componente, cada render crea otro tipo y puede reiniciar su estado. La Promise debe resolver un módulo cuyo `default` sea un componente.

## Qué hace el límite

Cuando un descendiente todavía no puede renderizar, React busca el `<Suspense>` más cercano y muestra `fallback`. Al estar listo, intenta de nuevo el contenido.

```text
Page
├── Header                    visible
├── Suspense "lista"
│   └── Results              puede esperar
└── Footer                    visible
```

Un único límite alrededor de toda la página puede ocultar contenido útil por una dependencia pequeña. Demasiados límites generan cambios visuales fragmentados. Agrupa piezas que deban aparecer juntas.

## Leer una Promise con `use`

```tsx
import { Suspense, use } from "react"

type Comment = { id: string; body: string }

function Comments({
  commentsPromise
}: {
  commentsPromise: Promise<Comment[]>
}) {
  const comments = use(commentsPromise)

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.body}</li>
      ))}
    </ul>
  )
}

export function CommentSection({
  commentsPromise
}: {
  commentsPromise: Promise<Comment[]>
}) {
  return (
    <Suspense fallback={<p>Cargando comentarios…</p>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

La creación y caché de la Promise deben pertenecer a una capa compatible, normalmente un framework. Crear una Promise nueva en cada render puede reiniciar el trabajo o producir advertencias.

`use` también puede leer contexto y, a diferencia de los Hooks tradicionales, puede aparecer dentro de una condición. No puede envolverse en `try/catch`; un error debe llegar a un Error Boundary.

## Suspense no observa cualquier asincronía

Esto no activa el fallback:

```tsx
useEffect(() => {
  fetch("/api/items").then(/* ... */)
}, [])
```

El efecto ocurre después del commit. Debes modelar su loading manualmente o utilizar una capa de datos compatible con Suspense. No lances Promises manualmente desde componentes de aplicación sin un contrato de caché y framework.

## Evitar que contenido visible desaparezca

Una actualización urgente que hace suspender contenido existente puede reemplazarlo por el fallback. `startTransition` o `useDeferredValue` permiten tratar la actualización como no urgente y conservar la interfaz anterior mientras llega la siguiente.

```tsx
const deferredQuery = useDeferredValue(query);
const stale = deferredQuery !== query;

return (
  <div aria-busy={stale} style={{ opacity: stale ? 0.6 : 1 }}>
    <Suspense fallback={<ResultsSkeleton />}>
      <Results query={deferredQuery} />
    </Suspense>
  </div>
);
```

El valor diferido no agrega un retraso fijo ni evita requests; cambia la prioridad del render.

## Error Boundary y Suspense

Suspense maneja espera; un Error Boundary maneja fallos de render. Si el import de `lazy` o el recurso rechaza, el error debe llegar a un límite de error del framework o a una clase Error Boundary.

```text
ErrorBoundary
└── Suspense
    └── contenido asíncrono
```

El fallback debe describir el contenido esperado y reservar espacio cuando sea posible. Un spinner genérico para una página completa suele comunicar menos que un skeleton de la región exacta.

## Casos de uso

- editor pesado que solo se abre bajo demanda;
- panel secundario detrás de una pestaña;
- ruta transmitida por un framework con Server Components;
- vista costosa que conserva resultados anteriores durante una búsqueda;
- recurso compartido que un framework entrega como Promise estable.

## Errores frecuentes

- Declarar `lazy()` dentro del componente.
- Esperar que Suspense detecte un `fetch` de `useEffect`.
- Crear una Promise en cada render.
- envolver toda la aplicación en un único fallback.
- ocultar contenido ya útil durante cada actualización.
- confundir espera con error y no añadir una estrategia de recuperación.
