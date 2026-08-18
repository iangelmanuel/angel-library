---
title: Optimización de imágenes para la web
description: Elegir dimensiones, formato, compresión, imágenes responsive, prioridad y herramientas sin degradar la experiencia.
category: performance
order: 2
tags: [performance, images, webp, avif, responsive]
scope: imágenes web
related:
  - guides/core-web-vitals
  - guides/astro-image-picture
  - guides/nextjs-image
  - resources/developer-tools/squoosh
  - resources/developer-tools/img-xyz
updatedAt: 2026-08-18
---

## Orden de optimización

1. **Recortar y redimensionar:** no enviar 4000 px para mostrar 600 px.
2. **Elegir formato:** SVG para vectores; AVIF/WebP para fotos e ilustraciones raster; PNG cuando la transparencia o fidelidad lo justifique.
3. **Comprimir:** comparar visualmente, no perseguir el menor peso a cualquier costo.
4. **Generar variantes:** el navegador debe poder elegir según viewport y densidad.
5. **Definir dimensiones:** `width` y `height` reservan espacio y reducen CLS.

```html
<picture>
  <source type="image/avif" srcset="hero-640.avif 640w, hero-1280.avif 1280w" />
  <source type="image/webp" srcset="hero-640.webp 640w, hero-1280.webp 1280w" />
  <img
    src="hero-1280.jpg"
    srcset="hero-640.jpg 640w, hero-1280.jpg 1280w"
    sizes="(max-width: 48rem) 100vw, 60rem"
    width="1280"
    height="720"
    alt="Descripción útil de la imagen"
  />
</picture>
```

`srcset` describe archivos; `sizes` le dice al navegador cuánto espacio ocupará la imagen. Sin un `sizes` realista puede descargar una variante innecesariamente grande.

## Prioridad y lazy loading

- La imagen LCP visible al cargar no debe usar `loading="lazy"`.
- Imágenes bajo el fold sí pueden usar lazy loading.
- No marques todo como alta prioridad: si todo es prioritario, nada lo es.
- Evita fondos CSS para contenido importante; son menos expresivos y difíciles de adaptar.

## Herramientas

Squoosh permite comparar codecs y calidad localmente. Para producción repetible, automatizá con el componente de imágenes del framework, Sharp o un image CDN. `img.xyz` se conserva como referencia solicitada, pero a agosto de 2026 el dominio aparece estacionado y sin HTTPS operativo: no subas archivos ni datos sensibles hasta verificar propietario, conexión y política de privacidad.

## Checklist

- Peso y dimensiones acordes al lugar de uso.
- `alt` funcional; `alt=""` si es decorativa.
- Variantes responsive y caché larga para archivos versionados.
- Hero precargado solo si realmente es LCP.
- Validación en red móvil y con datos de campo, no solo en desktop local.

## Flujo práctico con Squoosh

1. Exporta una imagen con el recorte y el tamaño máximo real del componente.
2. Compara AVIF, WebP y JPEG/PNG en Squoosh con varias calidades.
3. Amplía la imagen al tamaño de uso y revisa texto pequeño, gradientes, pieles y bordes.
4. Mide peso, dimensiones y tiempo de descarga en una red móvil.
5. Guarda el formato elegido y automatiza la misma conversión en CI o en el CDN.

La calidad no es un número universal. Una ilustración con texto puede necesitar más fidelidad que una fotografía de fondo; una miniatura puede tolerar más compresión que la imagen principal de un producto. El objetivo es el menor archivo que conserva la información necesaria.

## Responsive sin sorpresas

Elige breakpoints por el ancho del componente, no por una lista fija de dispositivos. Si una card ocupa la mitad de la pantalla en desktop y todo el ancho en móvil, `sizes` debe reflejar esas dos situaciones. Para densidad 2x, genera una variante mayor solo si el componente realmente puede mostrarla; enviar siempre la versión más grande desperdicia datos.

En Astro, Next.js o un CDN, verifica que la transformación no elimine `alt`, dimensiones, caché o encabezados de seguridad. También revisa el fallback: si AVIF no está disponible, el navegador debe recibir WebP o un formato compatible sin romper el layout.

## Casos especiales

- SVG externo: sanitiza archivos que provengan de usuarios; un SVG puede incluir contenido activo.
- Imágenes de usuario: valida tipo real, tamaño, dimensiones y nombre; no confíes solo en la extensión.
- Fotos de privacidad: elimina metadatos EXIF si revelan ubicación o información innecesaria.
- Fondos decorativos: usa CSS cuando no transmiten significado y respeta `prefers-reduced-motion` si cambian.
