---
title: "API de fonts (next/font)"
description: Fuentes de Google o locales, self-hosted automáticamente en build — sin requests externos ni layout shift.
category: frontend
stack: nextjs
order: 26
tags: [nextjs, fonts, performance]
scope: next.js (next/font)
related:
  - snippets/css-fonts
updatedAt: 2026-08-25
---

Igual espíritu que [Fontsource en Astro](/snippets/css-fonts): nada de un `<link>` a Google Fonts que dispara una request externa. `next/font` descarga el archivo en build y lo self-hostea junto al resto de los assets estáticos — cero requests a Google desde el navegador del usuario, y sin el parpadeo de layout shift que causa cargar una fuente de forma tardía.

## Google Fonts

```tsx title="app/layout.tsx"
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

Con una fuente variable (la mayoría de las modernas), no hace falta especificar `weight`. Si no es variable, `weight` es obligatorio: `weight: '400'` o `weight: ['400', '700']` para varios.

## Fuente local

```tsx title="app/layout.tsx"
import localFont from 'next/font/local';

const miFuente = localFont({
  src: './fonts/mi-fuente.woff2',
  display: 'swap',
});
```

## Varias fuentes con CSS variables

Para usar más directamente fuente (una para texto, otra para código, por ejemplo), la forma más prolija es declarar cada una con `variable` y aplicarla selectivamente por CSS — en vez de un `className` global que mezcla ambas.

```tsx title="app/layout.tsx"
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

```css
html { font-family: var(--font-inter); }
code, pre { font-family: var(--font-mono); }
```

## API de fuentes en una mirada

| API | Uso |
| --- | --- |
| `next/font/google` | Cualquier fuente de Google Fonts, self-hosted en build |
| `next/font/local` | Un archivo de fuente propio |
| `subsets` | Qué subconjunto de caracteres precargar (requerido si `preload` está activo, que es el default) |
| `weight` | Obligatorio si la fuente no es variable |
| `.className` | Aplicar directo a un elemento |
| `variable` + CSS | Para usar varias fuentes selectivamente, en vez directamente global |

## Métricas, subsets y carga

- Un nombre de fuente con espacios se importa con guion bajo: `Roboto Mono` → `import { Roboto_Mono } from 'next/font/google'`.
- El scope de precarga depende de dónde se llama la función: en `page.tsx` precarga solo esa ruta; en un `layout.tsx`, todas las rutas que envuelve; en el layout raíz, todo el sitio.
- Si la misma fuente se usa en varios archivos, definirla una vez en un archivo de "definiciones de fuentes" (`fonts.ts`) e importarla desde ahí evita que cada llamada a la función cuente como una instancia separada.
