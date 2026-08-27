---
title: Data fetching en Astro
description: Cuándo corre fetch en estático y SSR, consultas paralelas, endpoints internos y cómo decidir si hace falta una isla cliente.
category: frontend
stack: astro
order: 12
tags: [astro, fetch, data, performance]
scope: data fetching
related:
  - guides/astro-ssr-adapters
  - guides/astro-islas
  - utilities/fetch
updatedAt: 2026-08-25
---

Un `await fetch()` en el frontmatter corre donde se renderiza la página: durante `astro build` si está prerenderizada, o en cada request si es on-demand.

## Consulta rápida

| El dato cambia... | Lugar habitual |
| --- | --- |
| solo al publicar | build estático |
| por solicitud, usuario o cookie | ruta bajo demanda |
| después de una interacción frecuente | navegador o isla |
| dentro del mismo servidor | función de la capa de datos, sin HTTP interno |

```astro
---
const response = await fetch('https://api.example.com/posts');
if (!response.ok) throw new Error(`Posts: ${response.status}`);
const posts: Array<{ id: string; title: string }> = await response.json();
---
{posts.map((post) => <article><h2>{post.title}</h2></article>)}
```

`fetch()` solo rechaza la promesa por errores de red. Un HTTP 404 o 500 sigue siendo una respuesta válida, por eso hay que comprobar `response.ok`. El tipo escrito después de `response.json()` ayuda al editor, pero no demuestra que el servidor haya enviado esa forma.

## Estático vs on-demand

- Estático: la API se consulta una vez al construir. Resultado rápido y cacheable, pero requiere rebuild para actualizar.
- On-demand: la API se consulta durante la request. Puede personalizarse con cookies, pero necesita adapter y una estrategia de caché.
- Cliente: se consulta después de cargar la página. Resérvalo para actualizaciones frecuentes, datos que dependen del navegador o UI muy interactiva.

Un mismo sitio puede combinar los tres modelos. Por ejemplo, una página de producto puede ser estática, el precio personalizado puede renderizarse bajo demanda y el estado de disponibilidad puede refrescarse desde una isla.

## Evitar waterfalls

```ts
const [posts, authors] = await Promise.all([
  fetch(postsUrl).then((r) => r.json()),
  fetch(authorsUrl).then((r) => r.json()),
]);
```

Una **waterfall** o cascada ocurre cuando una solicitud independiente espera a que termine otra. Si `authors` no necesita el resultado de `posts`, inicia ambas juntas. Si sí lo necesita, la secuencia es correcta y conviene hacer explícita esa dependencia.

## Endpoints propios

Desde una ruta bajo demanda puedes construir una URL absoluta con `new URL('/api/data', Astro.url)`. En un build estático, llamar a tu propio endpoint suele ser innecesario: importa la función que obtiene los datos y reutilízala directamente.

```ts title="src/libs/posts.ts"
export async function getPosts() {
  const response = await fetch('https://api.example.com/posts');
  if (!response.ok) throw new Error(`No se pudieron cargar posts: ${response.status}`);
  return response.json();
}
```

Tanto una página como un endpoint pueden importar `getPosts()`. Esto evita una vuelta HTTP interna y concentra autenticación, errores y transformación en una sola capa.

## Errores y tipos

`response.json()` no valida en tiempo de ejecución. Comprueba `response.ok` y valida datos externos con Zod cuando una forma incorrecta pueda romper el renderizado. Define una alternativa explícita para APIs opcionales; no ocultes silenciosamente un fallo de datos esenciales.

También distingue tres respuestas:

- **fallo esencial:** detén el render y permite que la plataforma registre el error;
- **contenido opcional:** muestra una alternativa que conserve la página útil;
- **recurso inexistente:** responde con el estado HTTP correspondiente en una ruta bajo demanda.

## Caché y frescura

Astro decide cuándo se ejecuta el render, pero la caché puede pertenecer a la API remota, al CDN, al adapter o a tu capa de datos. Documenta cuánto puede envejecer el dato y quién lo invalida. “SSR” no significa automáticamente “sin caché”, y “estático” no obliga a que el contenido permanezca así para siempre: puedes reconstruir o revalidar mediante la plataforma de despliegue.

## Errores frecuentes

- Hacer un `fetch` cliente para contenido que el servidor podía incluir en el HTML inicial.
- Consultar el propio endpoint desde el servidor en lugar de compartir la función de dominio.
- Ejecutar operaciones independientes de forma secuencial.
- Confiar en una aserción de TypeScript como validación de una API externa.
- No definir timeout, fallback ni observabilidad para un proveedor remoto crítico.

Referencia oficial: [Data fetching](https://docs.astro.build/en/guides/data-fetching/).
