---
title: Primer proyecto con Next.js
description: Instala Next.js, reconoce el App Router y construye una primera ruta entendiendo qué ejecuta el servidor y qué recibe el navegador.
type: guides
order: 1
tags: [nextjs, react, fundamentos, app-router]
scope: next.js app router
related:
  - frontend/nextjs/nextjs
  - frontend/nextjs/nextjs-project-structure-configuration
  - frontend/nextjs/nextjs-routing-fundamentals
  - frontend/nextjs/nextjs-server-client-components
updatedAt: 2026-08-25
---

Next.js es un framework de React. React se ocupa de describir la interfaz mediante componentes; Next.js agrega una estructura de proyecto, enrutamiento por archivos, renderizado en servidor, optimización de recursos y APIs para construir el backend que necesita la aplicación.

## En 30 segundos

```bash
pnpm create next-app@latest mi-app
cd mi-app
pnpm dev
```

La URL `/` nace de `app/page.tsx`, el layout raíz está en `app/layout.tsx` y los componentes del App Router se ejecutan en el servidor por defecto. Agrega `'use client'` solo en la frontera que necesite eventos, estado, efectos o APIs del navegador.

## Antes de comenzar

Necesitas una versión de Node.js compatible con la versión de Next.js que vas a instalar y un gestor de paquetes como `pnpm`, `npm`, `yarn` o `bun`. El asistente `create-next-app` puede preparar TypeScript, ESLint, Tailwind CSS, el directorio `src/` y alias de importación.

Para aprender la estructura con menos ruido, conviene comenzar con:

- TypeScript para detectar errores de props y datos durante el desarrollo.
- App Router, porque es el modelo actual de rutas y renderizado.
- ESLint para mantener reglas consistentes.
- Un alias como `@/*` para evitar importaciones relativas largas.

## La primera ruta

```tsx title="app/page.tsx"
export default function HomePage() {
  return (
    <main>
      <h1>Mi biblioteca</h1>
      <p>Notas para aprender y recordar.</p>
    </main>
  );
}
```

El archivo exporta un componente de React, pero no necesitas importar React para usar JSX. Next.js transforma el archivo, genera HTML y envía al navegador solo el JavaScript que realmente forme parte de una frontera cliente.

## El layout raíz

Todo proyecto con App Router necesita un layout raíz. Este documento envuelve las rutas, conserva UI compartida entre navegaciones y define las etiquetas `<html>` y `<body>`.

```tsx title="app/layout.tsx"
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mi biblioteca',
  description: 'Notas de desarrollo web',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

`children` representa la página o el layout anidado que corresponde a la URL actual. No escribas manualmente `<head>` para metadatos comunes: usa la API `metadata` para que Next.js pueda administrarlos de forma consistente.

## Agregar una ruta

```text
app/
├── layout.tsx       → layout compartido
├── page.tsx         → /
└── notas/
    └── page.tsx     → /notas
```

Una carpeta representa un **segmento** de URL, pero la ruta solo es pública cuando contiene un archivo `page.tsx` o `route.ts`. Esto permite colocar componentes, pruebas y utilidades cerca de una ruta sin publicarlos accidentalmente.

```tsx title="app/notas/page.tsx"
import Link from 'next/link';

export default function NotesPage() {
  return (
    <main>
      <h1>Notas</h1>
      <Link href="/">Volver al inicio</Link>
    </main>
  );
}
```

`<Link>` realiza navegación cliente, puede precargar destinos visibles y mantiene las optimizaciones del router. Para enlaces internos, es preferible a un `<a>` escrito manualmente.

## Comandos cotidianos

| Comando | Para qué sirve |
| --- | --- |
| `pnpm dev` | inicia el servidor de desarrollo con recarga y diagnósticos |
| `pnpm build` | crea la compilación de producción y descubre errores de renderizado |
| `pnpm start` | sirve localmente una compilación ya generada |
| `pnpm exec next info` | muestra versiones y datos del entorno para depurar |
| `pnpm lint` o `pnpm exec eslint .` | ejecuta el script de lint definido por el proyecto |

No uses solamente el servidor de desarrollo como validación. La compilación de producción puede detectar rutas incompatibles, variables ausentes y código que depende accidentalmente del navegador.

## Primer componente interactivo

```tsx title="app/contador.tsx"
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((current) => current + 1)}>
      Conteo: {count}
    </button>
  );
}
```

La directiva no convierte toda la aplicación en una SPA. Marca un punto de entrada al grafo cliente: ese componente y los módulos que importe podrán hidratarse y responder a eventos. Mantener esta frontera pequeña reduce el JavaScript descargado.

## Ejercicio de aprendizaje

1. Crea `/notas` y `/notas/[slug]`.
2. Comparte una navegación mediante un layout de `notas`.
3. Lee una nota en un Server Component.
4. Agrega un botón cliente para marcarla como favorita.
5. Ejecuta `build` y revisa qué rutas son estáticas o dinámicas.

Este recorrido obliga a distinguir las cuatro ideas que sostienen el framework: segmentos, layouts, servidor y fronteras cliente.

## Si algo falla

| Síntoma | Causa probable | Qué revisar |
| --- | --- | --- |
| `useState` o `onClick` produce un error | falta una frontera cliente | agrega `'use client'` al archivo interactivo más pequeño |
| una ruta devuelve 404 | no existe `page.tsx` o el segmento no coincide | compara carpetas y URL |
| `window is not defined` | una API del navegador se ejecutó en servidor | muévela a un Client Component y, si aplica, a un efecto |
| una variable es `undefined` en el navegador | no es pública | solo `NEXT_PUBLIC_*` se incluye en el bundle cliente |
| desarrollo funciona y producción no | la ruta cambia durante build | ejecuta `pnpm build` y corrige el primer error real |

Referencia oficial: [Installation](https://nextjs.org/docs/app/getting-started/installation).
