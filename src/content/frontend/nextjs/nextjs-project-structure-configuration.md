---
title: Estructura y configuración del proyecto
description: Mapa de carpetas, convenciones especiales, next.config.ts, TypeScript y reglas para separar rutas, dominio y código compartido.
type: guides
order: 2
tags: [nextjs, arquitectura, configuración, typescript]
scope: next.js app router
related:
  - frontend/nextjs/nextjs-getting-started
  - frontend/nextjs/nextjs-routing-fundamentals
  - frontend/nextjs/nextjs-env-vars
updatedAt: 2026-08-25
---

La estructura de Next.js comunica dos cosas distintas: qué URL existe y cómo está organizado el código. Conviene no mezclarlas. El directorio `app/` describe principalmente el árbol de rutas; las carpetas de dominio, componentes y servicios describen la arquitectura interna.

## Consulta rápida

| Necesidad | Convención |
| --- | --- |
| crear una página | `app/segmento/page.tsx` |
| compartir UI persistente | `layout.tsx` |
| mostrar espera progresiva | `loading.tsx` |
| capturar un error de un segmento | `error.tsx` |
| responder HTTP | `route.ts` |
| ocultar una carpeta al router | prefijo `_`, por ejemplo `_components/` |
| organizar sin alterar la URL | grupo `(nombre)` |
| configurar el framework | `next.config.ts` |
| servir un archivo sin transformación | `public/` |

## Una estructura que puede crecer

```text
mi-app/
├── public/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── dashboard/
│   │   │   ├── _components/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   ├── features/
│   ├── libs/
│   └── types/
├── next.config.ts
├── tsconfig.json
└── package.json
```

`src/` es opcional y no modifica las URLs. Sirve para separar el código fuente de archivos de configuración. Dentro de `app/`, coloca cerca de una ruta lo que solo esa ruta utiliza; coloca en `components/`, `features/` o `libs/` lo que comparten distintas áreas.

## Archivos con significado para el router

| Archivo | Responsabilidad |
| --- | --- |
| `page.tsx` | hace público un segmento y renderiza su página |
| `layout.tsx` | comparte UI y estado visual entre descendientes |
| `template.tsx` | se vuelve a montar en cada navegación del segmento |
| `loading.tsx` | fallback de Suspense automático durante la carga |
| `error.tsx` | límite de error cliente para el segmento |
| `global-error.tsx` | captura errores del layout raíz |
| `not-found.tsx` | interfaz para recursos o rutas no encontradas |
| `route.ts` | Route Handler para métodos HTTP |
| `default.tsx` | fallback de una ranura en rutas paralelas |
| `proxy.ts` | intercepta solicitudes antes de resolver la ruta |

Los nombres anteriores son una API del framework, no una preferencia estética. Un archivo como `products.tsx` no crea `/products`; debe vivir dentro de `products/page.tsx`.

## Colocación segura

Una carpeta normal dentro de `app/` no es accesible por sí sola. Solo la presencia de `page` o `route` expone una ruta. Aun así, el prefijo `_` deja explícito que una carpeta es privada para el router:

```text
app/products/
├── _components/ProductCard.tsx
├── _libs/queries.ts
└── page.tsx
```

Los grupos entre paréntesis permiten crear layouts diferentes o separar equipos sin agregar ese nombre a la URL. Por ejemplo, `app/(shop)/products/page.tsx` sigue produciendo `/products`.

## `next.config.ts`

Este archivo configura comportamiento global que no pertenece a una página concreta.

```ts title="next.config.ts"
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.example.com' },
    ],
  },
};

export default nextConfig;
```

- `typedRoutes` valida destinos literales de `<Link>` y otras APIs de navegación.
- `images.remotePatterns` limita los orígenes que el optimizador de imágenes puede solicitar.
- `redirects`, `rewrites` y `headers` expresan reglas HTTP globales.
- `cacheComponents` activa el modelo explícito basado en `'use cache'`.

No agregues opciones por anticipado. Cada bandera global aumenta el modelo mental del proyecto y algunas cambian el comportamiento del renderizado.

## TypeScript y alias

```json title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".", // deprecado en TypeScript 7.0
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

El alias evita rutas como `../../../../lib/db`, pero no define arquitectura. Usa nombres que indiquen responsabilidad: `@/features/cart`, `@/libs/auth` o `@/components/ui` comunican mejor que una carpeta genérica llena de utilidades.

## Separar código por entorno

Los módulos del servidor pueden acceder a base de datos, sistema de archivos y secretos. Para evitar que una importación accidental los lleve al grafo cliente, márcalos:

```ts title="src/libs/db.ts"
import 'server-only';
import { db } from './client';

export async function getProducts() {
  return db.product.findMany();
}
```

De forma equivalente, `client-only` ayuda a identificar módulos que dependen del navegador. Estas marcas convierten un error arquitectónico silencioso en un error de compilación más cercano a su causa.

## Criterio para decidir ubicación

1. Si solo lo usa una ruta, colócalo junto a esa ruta.
2. Si representa una capacidad de negocio, agrúpalo por dominio en `features/`.
3. Si es UI reutilizable y no conoce el negocio, usa `components/`.
4. Si conecta infraestructura o servicios, usa `libs/` con nombres específicos.
5. Si contiene secretos, agrega `server-only` y evita reexportarlo desde índices cliente.

La mejor estructura no es la que tiene más carpetas: es aquella en la que una persona puede predecir dónde vive cada responsabilidad.

Referencia oficial: [Project structure](https://nextjs.org/docs/app/getting-started/project-structure) y [next.config.js](https://nextjs.org/docs/app/api-reference/config/next-config-js).
