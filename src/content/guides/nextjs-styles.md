---
title: CSS y estilos en Next.js
description: Elige entre estilos globales, CSS Modules, Tailwind CSS, Sass y CSS-in-JS sin romper el límite entre servidor y cliente.
category: frontend
stack: nextjs
order: 24
tags: [nextjs, css, estilos, performance]
scope: next.js app router
related:
  - guides/nextjs-font
  - guides/nextjs-image
updatedAt: 2026-08-25
---

Next.js no obliga a una sola estrategia de CSS. La decisión importante es definir qué estilos son globales, cuáles pertenecen a un componente y si la solución necesita ejecutar JavaScript en el navegador.

## Elección rápida

| Necesidad | Opción recomendada |
| --- | --- |
| reset, variables y estilos base | CSS global |
| estilos aislados de un componente | CSS Modules |
| utilidades y sistema de diseño por clases | Tailwind CSS |
| variables, mixins y sintaxis de Sass | Sass Modules |
| estilos calculados durante ejecución | CSS-in-JS compatible con Server Components |

## CSS global

```css title="app/globals.css"
:root {
  --surface: #0f1117;
  --text: #f5f5f5;
  --accent: #f6c85f;
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--surface); color: var(--text); }
```

```tsx title="app/layout.tsx"
import './globals.css';
```

Importa los estilos globales en el layout raíz para que su alcance sea intencional. También se pueden importar desde layouts, páginas y componentes del directorio `app`, pero repartir reglas globales por muchas rutas hace más difícil predecir la cascada y el orden final.

## CSS Modules

Un archivo `*.module.css` genera nombres de clase locales, por lo que dos componentes pueden usar `.title` sin colisionar.

```css title="app/products/product-card.module.css"
.card {
  display: grid;
  gap: 0.75rem;
  border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}
```

```tsx title="app/products/product-card.tsx"
import styles from './product-card.module.css';

export function ProductCard({ name }: { name: string }) {
  return <article className={styles.card}>{name}</article>;
}
```

CSS Modules funciona en Server y Client Components porque la importación se procesa durante la compilación. No necesita convertir el componente en cliente.

## Componer clases

```tsx
const className = [styles.card, featured && styles.featured]
  .filter(Boolean)
  .join(' ');
```

Para combinaciones frecuentes puedes usar utilidades como `clsx`; si Tailwind genera conflictos entre utilidades, una herramienta como `tailwind-merge` puede resolver la última clase aplicable. Estas utilidades organizan strings: no reemplazan una estrategia de diseño.

## Tailwind CSS

Tailwind es útil cuando el equipo comparte tokens y convenciones y prefiere construir la interfaz con utilidades. Mantén componentes para encapsular patrones repetidos; copiar una lista extensa de clases en diez lugares sigue siendo duplicación.

```tsx
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded border border-violet-400/30 px-2 py-1 text-xs text-violet-200">
      {children}
    </span>
  );
}
```

## Sass

Instala `sass` y usa archivos `.scss` o `.module.scss`:

```bash
pnpm add -D sass
```

Prefiere módulos para componentes. Reserva variables globales y mixins compartidos para casos en los que las capacidades nativas de CSS —custom properties, nesting, `color-mix()` y container queries— no sean suficientes.

## CSS-in-JS

Muchas bibliotecas CSS-in-JS tradicionales dependen de contexto, efectos o un registro de estilos durante ejecución. Verifica explícitamente su soporte para App Router y Server Components. Si obliga a convertir un árbol amplio en Client Components, aumenta el bundle y reduce los beneficios del renderizado de servidor.

## Evitar cambios de layout

Los estilos también afectan Core Web Vitals:

- reserva dimensiones de imágenes y contenido embebido;
- carga fuentes con `next/font` para controlar métricas y evitar saltos;
- no ocultes contenido crítico hasta que un efecto cliente calcule el viewport;
- usa animaciones de `transform` y `opacity` cuando sea posible;
- prueba estados de carga con la misma geometría aproximada del contenido final.

## Errores frecuentes

- Convertir un componente en cliente solo para importar CSS.
- Usar selectores globales demasiado amplios que cambian componentes lejanos.
- Depender del orden accidental de imports para corregir especificidad.
- Mezclar varios sistemas sin definir cuál controla tokens, reset y componentes.
- Generar clases dinámicas que Tailwind no puede descubrir durante la compilación.

Referencia oficial: [CSS](https://nextjs.org/docs/app/getting-started/css).
