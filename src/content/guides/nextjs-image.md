---
title: "<Image /> — optimización"
description: Extiende <img> con optimización automática — width/height o fill, sizes para responsive, priority y remotePatterns.
category: frontend
stack: nextjs
order: 18
tags: [nextjs, images, performance]
scope: next.js (next/image)
related:
  - guides/astro-image-picture
updatedAt: 2026-08-16
---

Mismo problema que resuelve [`<Image />` en Astro](/guides/astro-image-picture): formato óptimo, tamaño correcto por dispositivo, sin layout shift — acá con la sintaxis de Next.

## Uso básico

`src` y `alt` obligatorios. `width`/`height` obligatorios salvo que uses `fill` — son los que le dicen al navegador el aspect ratio antes de que la imagen cargue, para reservar el espacio y evitar el salto de layout.

```tsx
import Image from 'next/image';

export default function Perfil() {
  return <Image src="/avatar.png" width={500} height={500} alt="Foto de perfil" />;
}
```

## `fill` — Llenar el contenedor padre

Cuando no conocés las dimensiones exactas de antemano (una imagen que debe ocupar 100% de una card de tamaño variable), `fill` hace que la imagen ocupe todo el elemento padre — que necesita `position: relative` (o similar) para que funcione.

```tsx
<div style={{ position: 'relative', width: '100%', height: '300px' }}>
  <Image src="/banner.jpg" alt="Banner" fill style={{ objectFit: 'cover' }} />
</div>
```

## `sizes` — Cuánto espacio real ocupa

Sin `sizes`, Next asume que la imagen podría mostrarse a ancho completo en cualquier dispositivo y descarga una versión más pesada de la necesaria. Declarar cuánto ocupa realmente en cada breakpoint deja que sirva el tamaño justo.

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## `priority` — Imágenes above the fold

Por defecto, las imágenes cargan con lazy loading (no bloquean el render inicial). La imagen más importante de la pantalla inicial (el hero, el LCP) debería cargar antes — `priority` la excluye del lazy loading y la precarga.

```tsx
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
```

## `placeholder="blur"` — Difuminado mientras carga

Para imágenes locales importadas (no de una URL string), Next puede generar automáticamente un placeholder borroso a partir de la imagen real, sin que vos generes ese blur a mano.

```tsx
import Image from 'next/image';
import heroImg from '../public/hero.jpg';

<Image src={heroImg} alt="Hero" placeholder="blur" />;
```

## Imágenes remotas — autorizar el dominio

Igual que en Astro, una URL externa no se optimiza sin autorizar el dominio primero.

```ts title="next.config.ts"
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'ejemplo.com' }],
  },
};
```

## Resumen

| Prop | Uso |
| --- | --- |
| `src` / `alt` | Obligatorios |
| `width` / `height` | Obligatorios salvo `fill` |
| `fill` | Ocupar el contenedor padre (que necesita `position: relative`) |
| `sizes` | Cuánto espacio real ocupa por breakpoint, para no sobre-descargar |
| `priority` | Saltar el lazy loading para la imagen más importante de la pantalla inicial |
| `placeholder="blur"` | Difuminado automático mientras carga (solo imágenes locales importadas) |
| `images.remotePatterns` (next.config) | Autorizar dominios externos para optimización |

## Consideraciones

- `fill` sin `position: relative` (o `absolute`/`fixed`) en el contenedor padre no funciona — la imagen colapsa a tamaño 0 porque no tiene de qué "llenar".
- `priority` solo debería usarse en la imagen más importante de la pantalla — abusar de ella en varias imágenes anula el propósito (todas compitiendo por prioridad no es prioridad).
- Sin `sizes` en una imagen con `fill`, Next asume 100vw por defecto — casi siempre termina sirviendo más resolución de la que hace falta en pantallas chicas.
