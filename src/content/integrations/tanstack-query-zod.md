---
title: TanStack Query + Zod
description: Validar la respuesta directamente API dentro de queryFn — datos tipados sin genéricos manuales, y un error de forma se ve igual que un error de red.
category: frontend
stack: react
order: 2
tags: [react, api, validation, zod, typescript]
technologies: [libraries/tanstack-query, libraries/zod]
updatedAt: 2026-08-25
---

## Por qué combinarlos

`useQuery` cachea y maneja loading/error, pero no valida nada: si la API cambia de forma sin avisar (un campo que pasa de `string` a `number`, uno que desaparece), `data` sigue "andando" hasta que algo revienta más abajo, lejos de donde realmente falló. Parsear la respuesta con Zod dentro de `queryFn` cierra ese hueco — y de paso tipa `data` sin escribir un genérico a mano en cada `useQuery`.

## Validar dentro de `queryFn`

```tsx title="hooks/useUsuarios.ts"
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const usuarioSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  email: z.email(),
});

const usuariosSchema = z.array(usuarioSchema);

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const res = await fetch('/api/usuarios');
      const raw = await res.json();
      return usuariosSchema.parse(raw); // lanza si la forma no coincide
    },
  });
}
```

`data` termina tipado como `{ id: string; nombre: string; email: string }[]` sin poner `useQuery<Usuario[]>(...)` — el tipo sale solo de lo que devuelve `queryFn`, que a su vez sale de `usuariosSchema.parse()`.

## Por qué `parse()` y no `safeParse()` aquí

Fuera de `queryFn`, `safeParse()` es casi siempre mejor porque no lanza. Dentro de `queryFn` es al revés: Query ya tiene un mecanismo entero para manejar fallos (`isError`, `error`, reintentos) que se dispara cuando la función **lanza** — usar `safeParse()` y manejar `{ success: false }` a mano duplicaría esa lógica. Deja que Zod lance con `.parse()` y que Query lo capture como cualquier otro error de la petición.

```tsx
function ListaUsuarios() {
  const { data, isLoading, isError, error } = useUsuarios();

  if (isLoading) return <p>Cargando…</p>;
  if (isError) return <p>Error: {error.message}</p>; // network Y forma inválida caen aquí

  return <ul>{data.map((u) => <li key={u.id}>{u.nombre}</li>)}</ul>;
}
```

Para el componente, un 500 del servidor y una respuesta con forma inesperada se ven exactamente igual: ambos son `isError`. Eso es a propósito — los dos son "no puedo confiar en este dato", y el componente no necesita distinguirlos.

## Validar antes de una mutación

El mismo patrón, del otro lado: parsear el payload antes de mandarlo evita una petición condenada a fallar en el servidor por datos con forma incorrecta armados en el cliente (un bug local, no input de usuario ya validado por un formulario).

```tsx
const crearUsuarioSchema = z.object({ nombre: z.string().min(1), email: z.email() });

const mutacion = useMutation({
  mutationFn: async (input: unknown) => {
    const payload = crearUsuarioSchema.parse(input);
    return fetch('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
});
```

## Particularidades

- **La cache guarda el dato ya validado**: como el `parse()` corre dentro de `queryFn`, lo que queda en la cache de Query es el resultado tipado y correcto, no el JSON crudo — cualquier componente que lea esa `queryKey` después recibe datos de confianza, sin volver a parsear.
- **`staleTime`/reintentos no cubren esto**: reintentar una petición no arregla una respuesta con forma inválida — si la API realmente cambió, todos los reintentos van a fallar igual. Es un error real, no algo transitorio de red.
- **Con [React Hook Form](/libraries/react-hook-form)**: si el formulario que dispara la mutación ya valida con `zodResolver` (ver [React Hook Form + Zod](/integrations/react-hook-form-zod)), el `.parse()` del lado de la mutación es una segunda capa, no trabajo repetido — protege contra bugs en el código que arma el payload, no contra input de usuario mal escrito (eso ya lo filtró el formulario).

## Flujo validado en una mirada

| Patrón | Dónde |
| --- | --- |
| `schema.parse(raw)` | Dentro de `queryFn`, para que un error de forma se propague como `isError` |
| `z.infer<typeof schema>` | Tipa `data` sin poner un genérico manual en `useQuery` |
| `schema.parse(input)` en `mutationFn` | Valida el payload antes de mandarlo, no la respuesta |
| `safeParse()` | Se queda para código de UI (formularios) — no para dentro de `queryFn`/`mutationFn` |
