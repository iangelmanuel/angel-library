---
title: Observer
description: Que varias partes del código reaccionen a un evento sin que quien lo dispara sepa quién está escuchando.
category: architecture
stack: patrones-diseno
order: 8
tags: [arquitectura, patrones-diseno, observer]
problem: Cuando se crea un usuario hay que mandar un email de bienvenida, registrar el evento en analytics y sincronizar con el CRM — y ninguno de esos pasos debería vivir dentro del servicio que crea usuarios.
updatedAt: 2026-08-17
---

## Problema

Si el código que crea un usuario tiene que llamar directamente a `enviarBienvenida()`, `registrarEnAnalytics()` y `sincronizarConCRM()`, ese servicio termina acoplado a todo lo que "reacciona" a la creación de un usuario. Agregar un quinto listener implica tocar ese archivo otra vez. Observer invierte la relación: el que dispara el evento no conoce a los que escuchan.

## Ejemplo: EventEmitter de Node

```ts title="lib/events.ts"
import { EventEmitter } from 'node:events';

export const eventos = new EventEmitter();
```

```ts title="services/users.service.ts"
import { eventos } from '@/libs/events';

export async function crearUsuario(datos: DatosUsuario) {
  const usuario = await db.usuario.create({ data: datos });
  eventos.emit('user:created', { id: usuario.id, email: usuario.email });
  return usuario;
}
```

```ts title="listeners/on-user-created.ts"
import { eventos } from '@/libs/events';

eventos.on('user:created', ({ email }) => enviarBienvenida(email));
eventos.on('user:created', ({ id }) => registrarEnAnalytics(id));
```

`crearUsuario` no sabe (ni le importa) cuántos listeners hay ni qué hacen. Agregar uno nuevo es agregar un `.on()` en otro archivo.

## El mismo patrón, en todas partes

- `addEventListener('click', handler)` del DOM es Observer: el botón no sabe qué código reacciona al click.
- Una store de Zustand o Redux notifica a cada componente suscrito cuando el estado cambia — los componentes son observers del store.

```ts
const useStore = create<Estado>((set) => ({
  count: 0,
  incrementar: () => set((s) => ({ count: s.count + 1 })),
}));
// Cada componente que llama useStore() se suscribe y re-renderiza cuando el estado cambia.
```

## Cuándo NO usarlo

Si solo hay un emisor y un único receptor que siempre reacciona, una llamada de función directa es más fácil de seguir que un evento. Los eventos dificultan trazar "quién reacciona a esto" cuando se abusan en un codebase grande — reservalos para cuando de verdad hay múltiples receptores desacoplados, o cuando el emisor no debería conocer a sus consumidores.
