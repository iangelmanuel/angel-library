---
title: TanStack Query
description: Cache, refetch automático y estado de carga/error para datos async — sin armar ese estado a mano con useState/useEffect.
category: frontend
stack: react
order: 3
tags: [react, state, api]
website: https://tanstack.com/query
github: https://github.com/TanStack/query
install: npm install @tanstack/react-query
related:
  - libraries/axios
  - guides/react-useeffect
updatedAt: 2026-08-25
---

El patrón "`useState` para los datos + `useState` para loading + `useState` para error + `useEffect` que hace el fetch" se repite en cada componente que pide datos, y no cachea nada: navegar a otra pantalla y volver vuelve a pedir todo de cero. TanStack Query reemplaza ese patrón entero: cachea por `queryKey`, refetchea solo cuando hace falta, y da `isLoading`/`isError`/`data` ya resueltos.

## Setup

Un `QueryClient` una vez, en la raíz de la app.

```tsx title="main.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Rutas />
    </QueryClientProvider>
  );
}
```

## `useQuery` — Leer datos

`queryKey` identifica ese dato en la cache (si dos componentes usan la misma key, comparten el resultado sin pedirlo dos veces). `queryFn` es cualquier función que devuelva una promesa — con [Axios](/libraries/axios), con `fetch`, con lo que sea.

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

function ListaUsuarios() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => api.get('/usuarios').then((res) => res.data),
  });

  if (isLoading) return <p>Cargando…</p>;
  if (isError) return <p>Error al cargar</p>;

  return <ul>{data.map((u: Usuario) => <li key={u.id}>{u.nombre}</li>)}</ul>;
}
```

## `useMutation` — Escribir datos

Para crear/actualizar/borrar. `onSuccess` es el lugar típico para invalidar la query relacionada, así la lista se refresca sola después de la mutación, sin recargar la página ni actualizar el estado local a mano.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function FormularioUsuario() {
  const queryClient = useQueryClient();

  const mutacion = useMutation({
    mutationFn: (nuevoUsuario: { nombre: string }) => api.post('/usuarios', nuevoUsuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] }); // dispara un refetch de esa key
    },
  });

  return (
    <button onClick={() => mutacion.mutate({ nombre: 'Nuevo' })} disabled={mutacion.isPending}>
      {mutacion.isPending ? 'Guardando…' : 'Crear usuario'}
    </button>
  );
}
```

## API de consultas en una mirada

| API | Uso |
| --- | --- |
| `<QueryClientProvider client={...}>` | Envuelve la app, una vez |
| `useQuery({ queryKey, queryFn })` | Leer datos: cachea, da `data`/`isLoading`/`isError` |
| `useMutation({ mutationFn, onSuccess })` | Escribir datos: crear/actualizar/borrar |
| `queryClient.invalidateQueries({ queryKey })` | Forzar otra consulta de esa clave, normalmente después de una mutación |

## Claves, frescura e invalidación

- `queryKey` es un array, no un string — `['usuarios', usuarioId]` cachea cada usuario por separado; cambiar `usuarioId` automáticamente pide (o reusa de cache) los datos de ese usuario específico.
- Por defecto, Query refetchea al volver a enfocar la ventana y al reconectar — comportamiento pensado para mantener los datos frescos, configurable por query con `staleTime` si no lo quieres para un dato que casi no cambia.
- No reemplaza a [Zustand](/libraries/zustand) ni a Context: Query es específicamente para estado que **viene de un servidor** (con cache, refetch, invalidación). Estado que es puramente del cliente (un modal abierto, un tema) no necesita nada de esto.
