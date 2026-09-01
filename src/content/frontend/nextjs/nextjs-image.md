---
title: "<Image /> — optimización"
description: Extiende <img> con dimensiones, srcset, carga diferida, preload, placeholders y orígenes remotos controlados.
type: guides
order: 25
tags: [nextjs, images, performance]
scope: next.js (next/image)
related:
  - frontend/astro/astro-image-picture
updatedAt: 2026-08-25
---

Mismo problema que resuelve [`<Image />` en Astro](/frontend/astro/astro-image-picture): servir una imagen adecuada para el dispositivo, reservar espacio y evitar trabajo innecesario. Next genera `srcset`, puede transformar formatos y aplica carga diferida de forma predeterminada.

## Uso básico

`src` y `alt` obligatorios. `width`/`height` obligatorios salvo que uses `fill` — son los que le dicen al navegador el aspect ratio antes de que la imagen cargue, para reservar el espacio y evitar el salto de layout.

```tsx
import Image from 'next/image';

export default function Perfil() {
  return <Image src="/avatar.png" width={500} height={500} alt="Foto de perfil" />;
}
```

## `fill` — Llenar el contenedor padre

Cuando no se conocen las dimensiones exactas de antemano —por ejemplo, una imagen que debe ocupar el 100 % de una tarjeta de tamaño variable—, `fill` hace que la imagen ocupe todo el elemento padre, que necesita `position: relative` o una posición equivalente.

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

## `preload` — imagen LCP excepcional

Por defecto, las imágenes usan lazy loading. Si una imagen es claramente el **Largest Contentful Paint (LCP)** de la página, `preload` puede indicarle al navegador que la descubra antes. En Next.js 16, `priority` quedó deprecado a favor de este nombre más explícito.

```tsx
<Image src="/hero.jpg" alt="Equipo trabajando" width={1200} height={600} preload />
```

No combines `preload` con `loading` o `fetchPriority`. Si la imagen se descubre temprano en el HTML y solo necesita prioridad de red, `loading="eager"` o `fetchPriority="high"` puede expresar mejor el caso. Mide el LCP real antes de elegir.

## `placeholder="blur"` — Difuminado mientras carga

Para imágenes locales importadas (no directamente URL string), Next puede generar automáticamente un placeholder borroso a partir de la imagen real, sin que tú generes ese blur a mano.

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

## API en una mirada

| Prop | Uso |
| --- | --- |
| `src` / `alt` | Obligatorios |
| `width` / `height` | Obligatorios salvo `fill` |
| `fill` | Ocupar el contenedor padre (que necesita `position: relative`) |
| `sizes` | Cuánto espacio real ocupa por breakpoint, para no sobre-descargar |
| `preload` | precargar la imagen LCP cuando existe un caso claro |
| `placeholder="blur"` | Difuminado automático mientras carga (solo imágenes locales importadas) |
| `images.remotePatterns` (next.config) | Autorizar dominios externos para optimización |

## Carga, seguridad y errores

- `fill` sin `position: relative` (o `absolute`/`fixed`) en el contenedor padre no funciona — la imagen colapsa a tamaño 0 porque no tiene de qué "llenar".
- `preload` debe reservarse para una imagen crítica claramente identificada; precargar varias hace que compitan por ancho de banda.
- Sin `sizes` en una imagen con `fill`, Next asume 100vw por defecto — casi siempre termina sirviendo más resolución de la que hace falta en pantallas chicas.
- El optimizador no reenvía headers al origen remoto. Si una imagen necesita autenticación, usa una estrategia controlada y revisa si debe marcarse `unoptimized`.
- Prefiere `remotePatterns` con protocolo, host y path específicos; abrir comodines amplios permite usar tu optimizador como proxy para recursos no previstos.
