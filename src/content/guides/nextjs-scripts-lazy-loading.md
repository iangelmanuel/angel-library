---
title: Scripts de terceros y carga diferida
description: Usa next/script y next/dynamic para controlar cuándo se descargan scripts, widgets y componentes pesados.
category: frontend
stack: nextjs
order: 27
tags: [nextjs, scripts, lazy-loading, performance]
scope: next.js app router
related:
  - guides/nextjs-server-client-components
  - guides/nextjs-streaming-suspense
updatedAt: 2026-08-25
---

Un script de analítica y un componente React pesado no se cargan con la misma herramienta. `next/script` controla scripts externos; `next/dynamic` divide código de componentes. En ambos casos la pregunta es la misma: ¿qué necesita el usuario antes de poder usar la pantalla?

## Mapa rápido

| Caso | Herramienta |
| --- | --- |
| script externo necesario para toda la aplicación | `<Script>` en el layout |
| analítica después de hidratar | `strategy="afterInteractive"` |
| chat o widget de baja prioridad | `strategy="lazyOnload"` |
| componente React pesado | `dynamic(() => import(...))` |
| componente que depende totalmente del navegador | `dynamic(..., { ssr: false })` dentro de un Client Component |

## `next/script`

```tsx title="app/layout.tsx"
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Script
          src="https://example.com/analytics.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

`Script` evita insertar el mismo recurso varias veces durante la navegación y ofrece estrategias explícitas de carga.

| Estrategia | Momento | Uso típico |
| --- | --- | --- |
| `beforeInteractive` | antes de la hidratación | scripts críticos y excepcionales, como detección temprana de bots |
| `afterInteractive` | después de iniciar la hidratación | analítica y gestores de etiquetas |
| `lazyOnload` | durante tiempo ocioso del navegador | chat, soporte o widgets secundarios |
| `worker` | en un worker, cuando la configuración lo admite | experimentos con scripts costosos; valida compatibilidad |

No conviertas `beforeInteractive` en la opción predeterminada. Un tercero que ocupa red y CPU antes de la interacción puede empeorar LCP e INP aunque tu propio código esté optimizado.

## Eventos del script

Callbacks como `onLoad`, `onReady` y `onError` requieren un Client Component porque son funciones ejecutadas en el navegador.

```tsx title="app/map-script.tsx"
'use client';

import Script from 'next/script';

export function MapScript() {
  return (
    <Script
      src="https://example.com/maps.js"
      onReady={() => console.info('Mapa disponible')}
    />
  );
}
```

## Dividir un componente con `next/dynamic`

```tsx title="app/dashboard/chart-panel.tsx"
'use client';

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./chart'), {
  loading: () => <p>Preparando gráfica…</p>,
});

export function ChartPanel() {
  return <Chart />;
}
```

La importación debe aparecer de forma explícita dentro de `dynamic()` para que Next.js pueda relacionarla con el módulo generado y precargarlo. La carga diferida reduce el JavaScript inicial, pero agrega una espera posterior; úsala para código grande o secundario, no para cada componente pequeño.

## Desactivar SSR

```tsx
const BrowserEditor = dynamic(() => import('./browser-editor'), {
  ssr: false,
  loading: () => <p>Cargando editor…</p>,
});
```

`ssr: false` es una salida para módulos que necesitan `window`, `document`, Canvas u otra API exclusivamente del navegador. Debe declararse desde un Client Component. Antes de usarlo, revisa si la biblioteca permite importar una parte segura en servidor o inicializar la API dentro de un efecto.

## Scripts inline

Si un script inline es inevitable, proporciona un `id` estable para que Next.js pueda identificarlo. Evita interpolar datos del usuario: insertar texto no confiable dentro de JavaScript puede producir Cross-Site Scripting (XSS).

```tsx
<Script id="theme-init" strategy="beforeInteractive">
  {`document.documentElement.dataset.theme = localStorage.getItem('theme') ?? 'dark'`}
</Script>
```

Una Content Security Policy (CSP) estricta puede requerir `nonce` o hashes. Los scripts externos también deben limitarse a proveedores necesarios y revisarse periódicamente: cada tercero tiene acceso al contexto del navegador donde se ejecuta.

## Criterio de decisión

1. Elimina el script si no aporta valor medible.
2. Cárgalo solo en el layout o página que lo necesita.
3. Elige la estrategia más tardía que mantenga su función.
4. Reserva un fallback accesible para widgets diferidos.
5. Mide red, CPU, LCP e INP antes y después.

Referencia oficial: [Scripts](https://nextjs.org/docs/app/guides/scripts) y [Lazy loading](https://nextjs.org/docs/app/guides/lazy-loading).
