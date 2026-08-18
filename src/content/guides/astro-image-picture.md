---
title: "<Image /> y <Picture />"
description: Componentes de imagen optimizada de Astro — locales, remotas, responsive y con múltiples formatos.
category: frontend
stack: astro
order: 8
tags: [astro, images, performance]
scope: astro:assets
updatedAt: 2026-08-16
---

`astro:assets` optimiza imágenes en build: convierte formato, genera tamaños y evita layout shift infiriendo `width`/`height`. Son dos **componentes de Astro** (`<Image />`, `<Picture />` — con mayúscula, hay que importarlos), no etiquetas HTML nativas. El compilador los reemplaza en build por HTML real optimizado: `<Image />` se convierte en un `<img>`, y `<Picture />` en un `<picture>` con sus `<source>` adentro — esas sí son las etiquetas nativas, en minúscula, y nunca se escriben a mano.

## `<Image />`

`src` y `alt` son obligatorios. Con imágenes locales (importadas desde `src/`), Astro infiere `width`/`height` automáticamente — no hace falta declararlos.

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.png';
---
<Image src={heroImg} alt="Descripción de la imagen" />
```

Con imágenes remotas o de `public/`, sí hay que declarar `width`/`height` a mano (Astro no puede inspeccionar el archivo en build):

```astro
<Image
  src="https://ejemplo.com/foto.jpg"
  alt="Descripción"
  width={800}
  height={600}
/>
```

## `<Picture />`

Es el componente a usar cuando un solo `<img>` no alcanza: por ejemplo, si quieres servir AVIF/WebP a los navegadores que los soportan y caer a PNG/JPG en los que no. Genera un `<picture>` con un `<source>` por formato declarado en `formats`, más un `<img>` de fallback al final. El navegador —no Astro— es quien elige en runtime el primer `<source>` cuyo formato soporte; si ninguno calza, usa el `<img>`.

```astro
---
import { Picture } from 'astro:assets';
import heroImg from '../assets/hero.png';
---
<Picture src={heroImg} formats={['avif', 'webp']} alt="Descripción" />
```

```html
<!-- output -->
<picture>
  <source srcset="/_astro/hero.hash.avif" type="image/avif" />
  <source srcset="/_astro/hero.hash.webp" type="image/webp" />
  <img src="/_astro/hero.hash.png" width="1600" height="900" alt="Descripción" />
</picture>
```

## Responsive (`layout`)

Desde Astro 5.10, la prop `layout` genera `srcset`/`sizes` automáticamente sin tener que armarlos a mano.

```astro
<Image src={heroImg} alt="Descripción" layout="constrained" width={800} height={600} />
```

Hace falta habilitar los estilos responsive una vez en `astro.config.mjs`:

```ts title="astro.config.mjs"
export default defineConfig({
  image: {
    responsiveStyles: true,
  },
});
```

## Imágenes remotas: autorizar el dominio

Astro no optimiza imágenes remotas de cualquier dominio por seguridad — hay que autorizarlo explícitamente.

```ts title="astro.config.mjs"
export default defineConfig({
  image: {
    domains: ['ejemplo.com'],
    // o por patrón:
    remotePatterns: [{ protocol: 'https' }],
  },
});
```

## Resumen

| Prop / config | Qué hace |
| --- | --- |
| `src` / `alt` | Obligatorios en ambos componentes |
| `width` / `height` | Obligatorios en remotas y `public/`; automáticos en locales importadas |
| `formats` (solo `<Picture />`) | Lista de formatos a generar, en orden de preferencia |
| `layout="constrained"` | `srcset`/`sizes` automáticos (Astro ≥ 5.10) |
| `image.domains` / `image.remotePatterns` | Autorizar optimización de imágenes remotas |

## Consideraciones

- Sin autorizar el dominio, `<Image />` con una URL remota no lanza error, pero no optimiza el archivo (solo evita el layout shift).
- Las imágenes de `public/` nunca se procesan en build — se sirven tal cual. Si necesitas optimización real, movela a `src/assets/` e importala.
- `alt` es obligatorio a propósito: Astro tira error de build si falta, no solo un warning.
