---
title: Islas dinámicas (Server Islands)
description: Renderizar un fragmento personalizado o dinámico bajo demanda con server:defer, sin sacrificar el prerender del resto de la página.
type: guides
order: 16
tags: [astro, performance, ssr]
scope: astro (directiva server:defer)
related:
  - frontend/astro/astro-islas
updatedAt: 2026-08-25
---

Las [islas de UI](/frontend/astro/astro-islas) (`client:*`) resuelven interactividad: JS que corre en el navegador. Las **server islands** resuelven el problema espejado — un fragmento que necesita correr en el _servidor_ (leer una sesión, pegarle a una base de datos) en una página que por lo demás es puramente estática. Sin esto, ese único fragmento dinámico forzaría a que toda la página sea on-demand, perdiendo el cacheo y la velocidad de servir HTML pregenerado.

## `server:defer`

```astro title="components/Avatar.astro"
---
const usuario = await db.getUsuarioActual(Astro.cookies)
---

<img
  src={usuario.avatarUrl}
  alt={usuario.nombre}
/>
```

```astro title="pages/index.astro"
---
import Avatar from "../components/Avatar.astro"
---

<Avatar server:defer />
```

En build, Astro reemplaza ese fragmento por un pequeño script que lo pide como su propio endpoint apenas la página carga en el navegador — el resto de la página no espera esa respuesta.

## Contenido de respaldo (`slot="fallback"`)

Mientras la isla resuelve, se puede mostrar algo inmediato en su lugar.

```astro
<Avatar server:defer>
  <GenericAvatarIcon slot="fallback" />
</Avatar>
```

## Directivas y props en una mirada

| Concepto                  | Qué es                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `server:defer`            | Convierte un componente `.astro` en isla de servidor: se renderiza aparte, bajo demanda                            |
| `slot="fallback"`         | Contenido que se muestra mientras la isla resuelve                                                                 |
| Diferencia con `client:*` | `client:*` hidrata JS en el navegador; `server:defer` renderiza HTML en el servidor, después del prerender inicial |

## Personalización, caché y fallos

- Los props que le pasas al componente deferido se serializan (van encriptados en la URL de su endpoint) — no le pases funciones ni referencias circulares.
- Si los props superan ~2048 bytes cifrados, Astro cambia automáticamente a `POST` en vez de `GET` para pedir la isla — eso la saca de cualquier cache de CDN basada en URL.
- Funciona en cualquier hosting (serverless, Docker, tradicional): cada isla deferida se vuelve su propia mini-ruta en build.
