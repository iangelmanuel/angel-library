---
title: Next.js
description: "Ruta de aprendizaje y referencia rápida de Next.js: App Router, renderizado, datos, caché, mutaciones, APIs y optimización."
category: frontend
stack: nextjs
tags: [nextjs, react, framework, fullstack]
website: https://nextjs.org
github: https://github.com/vercel/next.js
related:
  - technologies/react
  - guides/nextjs-getting-started
  - guides/nextjs-routing-fundamentals
  - guides/nextjs-server-client-components
  - guides/nextjs-cache-components
updatedAt: 2026-08-25
---

Next.js extiende React con routing, renderizado en servidor, optimización de recursos y capacidades de backend. Esta sección está organizada para dos formas de lectura: puedes seguirla desde el principio para construir un modelo mental o entrar directamente a una API cuando solo necesitas recordarla.

## Si vienes a recordar

| Necesitas | Ve a |
| --- | --- |
| iniciar o reconocer la estructura | [Primer proyecto](/guides/nextjs-getting-started) y [Estructura y configuración](/guides/nextjs-project-structure-configuration) |
| crear una URL o leer parámetros | [Fundamentos de routing](/guides/nextjs-routing-fundamentals) y [params / searchParams](/guides/nextjs-params-searchparams) |
| decidir servidor o navegador | [Server y Client Components](/guides/nextjs-server-client-components) |
| compartir UI entre rutas | [Layouts](/guides/nextjs-layouts) y [loading, error y not-found](/guides/nextjs-page-error-loading) |
| consultar datos y controlar frescura | [Fetching y revalidate](/guides/nextjs-fetching-revalidate) o [Cache Components](/guides/nextjs-cache-components) |
| modificar datos desde un formulario | [Forms](/guides/nextjs-forms) y [Server Actions](/guides/nextjs-server-actions) |
| crear una API HTTP | [Route Handlers](/guides/nextjs-endpoints) |
| navegar por código | [Link](/guides/nextjs-link), [useRouter](/guides/nextjs-userouter) y [redirect / notFound](/guides/nextjs-redirect-notfound) |
| optimizar recursos | [Image](/guides/nextjs-image), [Font](/guides/nextjs-font) y [scripts/carga diferida](/guides/nextjs-scripts-lazy-loading) |
| resolver una composición avanzada | [Rutas paralelas e interceptadas](/guides/nextjs-parallel-intercepting-routes) |

## Si vienes a aprender

### Etapa 1 — Construir el mapa

Comienza por [Primer proyecto](/guides/nextjs-getting-started), [Estructura y configuración](/guides/nextjs-project-structure-configuration) y [Fundamentos de routing](/guides/nextjs-routing-fundamentals). Aquí debes poder responder qué URL genera un archivo, qué conserva un layout y cuándo un componente se ejecuta en servidor.

### Etapa 2 — Comprender el renderizado

Continúa con [Server y Client Components](/guides/nextjs-server-client-components), [Directivas](/guides/nextjs-directivas) y [loading/error/not-found](/guides/nextjs-page-error-loading). Después estudia [streaming y Suspense](/guides/nextjs-streaming-suspense). El objetivo no es memorizar directivas: es dibujar la frontera entre trabajo del servidor, JavaScript del navegador y contenido que puede llegar progresivamente.

### Etapa 3 — Modelar rutas y navegación

Profundiza en layouts, grupos, parámetros, `<Link>`, hooks de navegación, redirecciones y generación estática. Cuando lo anterior sea predecible, las [rutas paralelas e interceptadas](/guides/nextjs-parallel-intercepting-routes) tendrán un caso de uso claro en lugar de parecer reglas aisladas.

### Etapa 4 — Datos y caché

Aprende primero dónde consultar datos y qué significa estático, dinámico y cacheado. Luego estudia el modelo clásico de `fetch` y el modelo explícito de [Cache Components](/guides/nextjs-cache-components). Termina con invalidación por ruta o etiqueta. Una aplicación puede usar datos correctos y aun así mostrar información obsoleta si no define cuándo deja de ser válida.

### Etapa 5 — Mutaciones y backend

Sigue con formularios, Server Actions y Route Handlers. Las Actions son apropiadas para mutaciones iniciadas desde la UI de la aplicación; un Route Handler expone un contrato HTTP para webhooks, clientes externos o endpoints públicos. En ambos casos valida entrada, autentica y autoriza dentro de la operación del servidor.

### Etapa 6 — Producción y optimización

Revisa estilos, imágenes, fuentes, scripts, variables de entorno, internacionalización y Proxy. Mide antes de optimizar y ejecuta una compilación de producción: el servidor de desarrollo prioriza retroalimentación, no reproduce todas las decisiones de caché y rendimiento.

## Modelo mental

- El App Router es un árbol de segmentos con layouts persistentes.
- Los componentes son de servidor por defecto; `'use client'` crea fronteras interactivas.
- El render puede combinar shell estática, datos cacheados y contenido dinámico transmitido.
- Las mutaciones viven en Server Actions o Route Handlers, con autorización en el servidor.

```text
URL
└── segmentos de app/
    └── layouts + page
        ├── Server Components → datos, secretos, HTML
        ├── Client Components → eventos, estado, navegador
        └── Suspense → trabajo que llega progresivamente
```

## Vocabulario esencial

| Término | Significado |
| --- | --- |
| App Router | router basado en el directorio `app/` y React Server Components |
| segmento | parte de la URL representada por una carpeta |
| RSC | React Server Component; componente que se renderiza en el entorno servidor |
| hidratación | conexión del HTML inicial con el JavaScript interactivo |
| renderizado estático | salida calculada antes de una solicitud concreta |
| renderizado dinámico | salida calculada con información de la solicitud |
| streaming | envío progresivo de partes de la respuesta |
| revalidación | actualización de una entrada o página almacenada en caché |
| Route Handler | función que responde a métodos HTTP mediante `route.ts` |
| Server Action | función servidor invocable desde componentes y formularios React |

## Cuándo lo elijo

- Aplicaciones React con frontend y backend en el mismo repositorio.
- Productos con autenticación, dashboards, formularios y datos personalizados.
- Equipos que necesitan convenciones fuertes de routing, rendering y despliegue.
- Sitios que se benefician de streaming y Server Components.

## Costos

El modelo de render y caché tiene más conceptos que una SPA tradicional. Una directiva o API de request puede cambiar cuándo se renderiza una ruta. Para mantener claridad, cada página debería declarar mentalmente qué parte es estática, cacheada, por request y cliente.

## Piezas esenciales

| Pieza | Propósito |
| --- | --- |
| `app/` | rutas, layouts y convenciones |
| Server Components | datos y HTML sin bundle cliente |
| Client Components | estado, efectos y browser APIs |
| Server Actions | mutaciones desde UI |
| Route Handlers | API HTTP pública/integrable |
| Cache Components | caché y partial prerendering |

## Regla práctica

Mantén los límites de cliente pequeños y los accesos a datos cerca del servidor. No dupliques una API interna solo para que un Server Component haga `fetch` contra su propio backend: llama directamente a la capa de datos.

También evita aprender cada API de forma aislada. Ante una decisión, sigue este orden: **URL → entorno de ejecución → origen del dato → política de frescura → interacción**. Esa secuencia explica la mayoría de las decisiones del App Router.
