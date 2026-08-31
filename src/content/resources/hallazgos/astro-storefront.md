---
title: "Astro Storefront — comercio electrónico de referencia"
description: "Repositorio de referencia de comercio electrónico con Astro: islas con SolidJS, renderizado bajo demanda con caché de CDN, actions, assets y env tipados."
category: findings
stack: hallazgos-web
order: 2
tags: [astro, ecommerce, solidjs, islas, rendimiento, typescript]
url: https://github.com/withastro/storefront
resourceCategory: developer-tools
technologies: [technologies/astro]
personalNote: "Está marcado como alfa y su último cambio es de finales de 2024; sirve como referencia de patrones, no como plantilla para arrancar hoy sin revisar."
updatedAt: 2026-08-30
---

> Publicado por el equipo de **[Astro](https://github.com/withastro)** con licencia MIT. Unas 828 estrellas. Es el código que impulsa [shop.astro.build](https://shop.astro.build).

**Astro Storefront** es un repositorio de referencia que muestra cómo montar una tienda en línea con Astro. Su premisa: rendimiento alto sin la curva de aprendizaje habitual del comercio electrónico.

Astro lleva años construyendo la base para sitios centrados en contenido, y el comercio electrónico es la siguiente frontera natural.

## Qué demuestra

| Pieza | Para qué |
| --- | --- |
| **Arquitectura de islas con SolidJS** | El menor coste de ejecución posible en el cliente |
| **Renderizado bajo demanda con caché de CDN** | Entregar páginas a velocidad de HTML estático |
| **`astro:actions`** | Endpoints sencillos y con tipado seguro para la sesión del usuario |
| **`astro:assets`** | Optimización de imágenes bajo demanda, con Netlify CDN, Sharp o tu proveedor |
| **`astro:env`** | Variables de entorno gestionadas y tipadas |

La elección de **SolidJS** en vez de React para las islas no es casual: en una tienda, cada kilobyte de JavaScript en el cliente compite con la conversión, y Solid tiene menos coste de ejecución.

## Cómo usarlo

Está pensado para leerse, no para instalarse como plantilla. El valor está en ver **cómo se combinan** las APIs modernas de Astro en un caso real con carrito, sesión y catálogo, en vez de en ejemplos aislados de documentación.

Cada una de esas APIs tiene su guía propia en la categoría [Frontend](/categories/frontend) de esta biblioteca; aquí se ven trabajando juntas.

## Qué tener en cuenta

Dos avisos que conviene tener antes de partir de él:

- **Está marcado como alfa** por sus propios autores.
- **Su último cambio es de octubre de 2024.** Astro ha publicado versiones mayores desde entonces, así que parte del código puede no reflejar las recomendaciones actuales.

Como catálogo de patrones sigue siendo útil; como base para empezar un proyecto hoy, hay que contrastar cada pieza con la documentación vigente de Astro.
