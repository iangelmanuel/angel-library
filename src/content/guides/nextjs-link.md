---
title: "<Link />"
description: La forma primaria de navegar entre rutas — extiende <a> con prefetch automático y navegación de cliente.
category: frontend
stack: nextjs
order: 10
tags: [nextjs, routing]
scope: next.js (next/link)
related:
  - guides/nextjs-usepathname
  - guides/nextjs-userouter
updatedAt: 2026-08-25
---

Un `<a href>` normal recarga la página entera. `<Link>` extiende ese mismo elemento (compila a un `<a>` real, no a otra cosa) con dos ventajas: navega del lado del cliente sin recargar, y precarga la ruta de destino en segundo plano antes de que el usuario haga click.

## Uso básico

```tsx
import Link from 'next/link';

export default function Nav() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

## Prefetch — automático, solo en producción

Apenas un `<Link>` entra en el viewport (al cargar la página, o al hacer scroll hasta él), Next empieza a precargar esa ruta y sus datos en segundo plano — para cuando el usuario haga click, ya está lista. Esto **solo pasa en producción** (`next build && next start`), no en `next dev`.

```tsx
<Link href="/dashboard" prefetch={false}>Sin precargar</Link>
```

## Link a una ruta dinámica

```tsx
{posts.map((post) => (
  <Link key={post.id} href={`/blog/${post.slug}`}>{post.title}</Link>
))}
```

## Marcar el link activo

`<Link>` no sabe por sí solo si es "la página actual" — se combina con [`usePathname`](/guides/nextjs-usepathname) en un Client Component.

```tsx title="app/ui/nav-links.tsx"
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/" className={pathname === '/' ? 'activo' : ''}>Inicio</Link>
      <Link href="/blog" className={pathname === '/blog' ? 'activo' : ''}>Blog</Link>
    </nav>
  );
}
```

## `replace` y `scroll`

```tsx
<Link href="/login" replace>Entrar</Link>          {/* no agrega entrada al historial */}
<Link href="/seccion#id" scroll={false}>Ir</Link>   {/* no hace scroll automático */}
```

## Props de navegación en una mirada

| Prop | Uso |
| --- | --- |
| `href` | Obligatorio — ruta o URL de destino |
| `prefetch` | `true`/`false`/`null` (auto) — precargar la ruta antes del click |
| `replace` | No agrega entrada al historial del navegador |
| `scroll` | Por defecto hace scroll al top si la página destino no está visible; `false` lo desactiva |
| `onNavigate` | Handler que corre solo en navegación de cliente (no en clicks con Ctrl/Cmd, ni en links externos) |

## Semántica, prefetch e historial

- `<Link>` **siempre** es la opción por defecto para navegar — [`useRouter`](/guides/nextjs-userouter) queda para navegación programática real (después de un submit, un timeout), no como reemplazo de un link normal.
- El prefetch no ocurre en desarrollo — si estás probando performance de navegación, hazlo contra un build de producción, no `next dev`.
- Con [Proxy](/guides/nextjs-proxy) haciendo un rewrite, el prefetch necesita que le digas tanto la URL a mostrar como la URL real a precargar (prop `as`) — si no, Next no sabe qué precargar de antemano.
