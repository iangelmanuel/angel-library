---
title: Render estático, bajo demanda e hidratación
description: Diferenciar prerender, SSR, código del navegador, server islands y adapters para elegir dónde se ejecuta cada parte de una página Astro.
category: frontend
stack: astro
order: 11
tags: [astro, rendering, static, ssr, hydration, adapters]
scope: modelo de renderizado
website: https://docs.astro.build/en/guides/on-demand-rendering/
related:
  - technologies/astro
  - guides/astro-project-configuration
  - guides/astro-islas
  - guides/astro-server-islands
  - guides/astro-ssr-adapters
updatedAt: 2026-08-25
---

## En 30 segundos

- **Prerender o SSG:** Astro crea el HTML durante `astro build`.
- **On-demand o SSR:** un servidor crea la respuesta cuando llega la request.
- **Hidratación:** JavaScript del navegador vuelve interactiva una isla ya renderizada.
- **Server island:** una parte dinámica se obtiene desde el servidor sin volver dinámica toda la página.
- Un adapter conecta la salida de Astro con Node.js, Cloudflare, Netlify, Vercel u otro runtime.

Estas decisiones son independientes. Una página puede ser estática y contener una isla React hidratada; otra puede renderizarse bajo demanda y no enviar JavaScript cliente.

## Matriz de elección

| Necesidad | Elección inicial |
| --- | --- |
| documentación o contenido igual para todas las personas | prerender estático |
| datos que cambian, pero pueden actualizarse con otro build | estático + nuevo build |
| cookie, sesión o personalización por request | render bajo demanda |
| botón, filtro o widget local | isla cliente o `<script>` |
| bloque personalizado dentro de una página mayormente estática | server island |
| API consumida por sistemas externos | endpoint on-demand |

## El comportamiento predeterminado: estático

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
});
```

Astro ejecuta el frontmatter durante el build y escribe HTML. El hosting solo entrega archivos; no existe un proceso de aplicación esperando requests.

```astro title="src/pages/releases.astro"
---
const releases = await fetch('https://api.example.com/releases').then((response) => response.json());
---

<ul>{releases.map((release) => <li>{release.name}</li>)}</ul>
```

La consulta ocurre durante el build. Si la API cambia después, la página no cambia hasta el siguiente build. Esto no es un fallo: es el contrato del prerender.

## Una ruta bajo demanda dentro de un sitio estático

Después de instalar un adapter, una página puede excluirse del prerender:

```astro title="src/pages/account.astro"
---
export const prerender = false;

const sessionId = Astro.cookies.get('session')?.value;
const user = sessionId ? await getUser(sessionId) : null;

if (!user) return Astro.redirect('/login');
---

<h1>Hola, {user.name}</h1>
```

La página se ejecuta en cada request y puede leer cookies o headers. El resto del proyecto sigue estático.

## Proyecto principalmente dinámico

```ts title="astro.config.ts"
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

Con `output: 'server'`, las rutas son on-demand por defecto. Una página que deba permanecer estática puede declarar:

```astro
---
export const prerender = true;
---

<h1>Política de privacidad</h1>
```

Cambiar `output` no añade capacidades mágicas; cambia el valor predeterminado. Si solo una ruta necesita sesión, volver dinámico todo el sitio incrementa infraestructura y trabajo del servidor sin una ventaja automática.

## SSR no significa JavaScript cliente

**Server-side rendering (SSR)** indica dónde se creó el HTML. **Client-side rendering (CSR)** e hidratación describen trabajo posterior en el navegador.

```text
request
  → Astro ejecuta componente en build o servidor
  → responde HTML
  → el navegador pinta el documento
  → solo las islas client:* descargan y ejecutan runtime de UI
```

Una página SSR puede ser completamente no interactiva. Una página estática puede ejecutar bastante JavaScript si hidrata muchas islas.

## Server islands

```astro
---
import Avatar from '../components/Avatar.astro';
---

<main>
  <h1>Documentación estática</h1>
  <Avatar server:defer>
    <span slot="fallback">Cargando cuenta…</span>
  </Avatar>
</main>
```

La página principal puede conservarse en caché mientras el bloque diferido se resuelve de forma personalizada. Necesita un adapter y no equivale a una isla cliente: el resultado sigue siendo HTML generado por el servidor.

## Streaming y orden de datos

Astro puede transmitir HTML a medida que se renderiza. Sin embargo, un `await` situado al comienzo de una página bloquea todo lo que depende de ese componente. Divide límites cuando el contenido lento no deba retrasar el shell completo y evita waterfalls donde una consulta independiente espera innecesariamente a otra.

## Caso de uso: catálogo con cuenta

```text
catálogo y páginas de producto   → estáticas
precios actualizados por webhook → nuevo build o caché controlada
botón de favoritos               → isla cliente pequeña
resumen de la cuenta             → server island
checkout                         → página on-demand
webhook de pago                  → endpoint on-demand
```

La mejor arquitectura no elige un modo para todo el producto. Asigna cada dato al momento de renderizado y al runtime que realmente necesita.

## Diagnóstico rápido

- Si una cookie siempre aparece vacía, comprueba si la ruta fue prerenderizada.
- Si el HTML queda desactualizado, identifica si el dato solo se consultó durante el build.
- Si una variable secreta aparece en el bundle, revisa la frontera de la isla y las variables públicas.
- Si todo el sitio requiere servidor por un widget pequeño, evalúa una isla cliente o server island.
- Si `prerender = false` falla al compilar, confirma que existe un adapter compatible.

