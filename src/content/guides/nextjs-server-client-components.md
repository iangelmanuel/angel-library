---
title: Server Components y Client Components
description: Cómo decidir dónde corre cada componente, qué cruza la frontera servidor-cliente y cómo evitar enviar JavaScript innecesario.
category: frontend
stack: nextjs
order: 4
tags: [nextjs, react, rendering, performance]
scope: next.js app router
related:
  - guides/nextjs-directivas
  - guides/nextjs-streaming-suspense
updatedAt: 2026-08-25
---

En el App Router, `page.tsx`, `layout.tsx` y los componentes que importan son **Server Components por defecto**. Pueden consultar una base de datos, leer secretos y hacer `await` durante el render sin enviar ese código al navegador.

## Regla para decidir

Usa un Server Component cuando necesites datos, secretos o HTML sin interacción. Usa un Client Component únicamente cuando necesites estado, efectos, eventos o APIs del navegador.

```tsx title="app/posts/[id]/page.tsx"
import LikeButton from './LikeButton';
import { db } from '@/libs/db';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUniqueOrThrow({ where: { id } });

  return <article><h1>{post.title}</h1><LikeButton postId={post.id} /></article>;
}
```

```tsx title="app/posts/[id]/LikeButton.tsx"
'use client';

import { useState } from 'react';

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? 'Guardado' : 'Guardar'} {postId}</button>;
}
```

## La frontera de `'use client'`

La directiva marca un **punto de entrada** al bundle del navegador. Todo lo importado por ese módulo pasa a formar parte del grafo cliente. Por eso conviene moverla hasta la hoja interactiva, no colocarla en el layout completo.

Los props que cruzan desde servidor deben ser serializables: strings, números, booleanos, arrays y objetos simples. No pases conexiones de base de datos, instancias de clases ni callbacks normales. Una Server Function sí puede cruzar como referencia.

## Composición correcta

Un Client Component no puede importar directamente un Server Component, pero puede recibirlo como `children` desde un padre servidor. Así el servidor decide el contenido y el cliente solo controla la interacción que lo envuelve.

```tsx
// Server Component
<Modal><CarritoDelServidor /></Modal>
```

## Errores comunes

- Agregar `'use client'` para resolver cualquier error de tipos y terminar enviando consultas y dependencias pesadas al navegador.
- Importar un módulo con secretos desde el grafo cliente. Usa `server-only` en módulos que nunca deben cruzar esa frontera.
- Duplicar la misma consulta en varios componentes. React elimina solicitudes `fetch` compatibles duplicadas durante un render; para consultas de ORM, envuelve el acceso compartido con `cache()` de React cuando corresponda.
- Pensar que Client Component significa “solo navegador”: también se prerenderiza para producir el HTML inicial y luego se hidrata.

Referencia oficial: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
