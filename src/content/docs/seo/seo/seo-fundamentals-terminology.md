---
title: "SEO técnico: fundamentos y terminología"
description: Guía para entender rastreo, indexación, metadatos, canonical, robots, datos estructurados y renderizado orientado a buscadores.
type: guides
tags: [seo, metadata, indexacion, rastreo, datos-estructurados, fundamentos]
order: 1
updatedAt: 2026-08-25
---

**SEO** significa _Search Engine Optimization_ u optimización para motores de búsqueda. Su objetivo es facilitar que un buscador descubra, comprenda e indexe contenido útil. No consiste en repetir palabras clave ni garantiza una posición concreta: combina contenido, arquitectura, accesibilidad técnica, rendimiento y reputación.

## Aprende o consulta

Si aprendes desde cero, sigue el recorrido del buscador: intención y arquitectura → descubrimiento/rastreo → render → canonical/indexación → metadata/datos estructurados → medición → migraciones. Después aplica la receta del framework.

| Necesito recordar                           | Documento                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| intención, páginas y enlaces internos       | [Contenido y arquitectura](/seo/seo-contenido/seo-contenido-arquitectura)           |
| robots, sitemap, canonical e indexación     | [Rastreo e indexación](/seo/seo-tecnico/seo-rastreo-indexacion)                     |
| title, description, Open Graph y JSON-LD    | [Metadata y datos estructurados](/seo/seo-tecnico/seo-metadata-datos-estructurados) |
| JavaScript, idiomas y duplicados regionales | [Render e internacionalización](/seo/seo-tecnico/seo-rendering-international)       |
| cambios de URL o caída de tráfico           | [Auditoría y migraciones](/seo/seo-tecnico/seo-auditoria-migraciones)               |
| implementación completa                     | [Astro](/seo/astro/astro-seo-completo) o [Next.js](/seo/nextjs/nextjs-seo-completo) |

Quien consulta necesita etiquetas exactas; quien aprende debe comprender qué señal resuelve cada etiqueta. Añadir metadata no compensa contenido duplicado, enlaces rotos o una respuesta que el crawler no puede obtener.

## Descubrimiento, rastreo, renderizado e indexación

Estas etapas no son sinónimos:

1. **Descubrimiento:** el buscador encuentra una URL mediante enlaces, un sitemap u otras señales.
2. **Rastreo:** un bot solicita la URL y recibe una respuesta HTTP.
3. **Renderizado:** procesa HTML, CSS y, cuando corresponde, JavaScript para comprender la página.
4. **Indexación:** decide si incorpora la versión comprendida a su índice.
5. **Ranking:** ordena resultados para una consulta según múltiples señales.

Un **crawler**, _spider_ o bot de rastreo es el programa que recorre enlaces. **SERP** significa _Search Engine Results Page_, es decir, página de resultados del buscador.

Que una URL sea rastreable no obliga a indexarla. También puede estar indexada y no aparecer para la búsqueda que se está probando.

## HTML que comunica el propósito

El título y la descripción ayudan a interpretar y presentar una página:

```html
<head>
  <title>Guía de accesibilidad web | angel.library</title>
  <meta
    name="description"
    content="Conceptos, ejemplos y lista de comprobación para crear interfaces accesibles."
  />
  <link
    rel="canonical"
    href="https://example.com/accesibilidad/guia"
  />
</head>
```

`<title>` debe describir la página concreta. La meta descripción es un resumen; el buscador puede usar otro fragmento si lo considera más pertinente. `canonical` indica la URL preferida cuando contenido igual o muy similar está disponible en varias direcciones.

La URL canónica debe ser absoluta, accesible y coherente con redirecciones, enlaces internos y sitemap. No es una orden para ocultar contenido duplicado, sino una señal de consolidación.

## Encabezados, semántica y enlaces

Una jerarquía de encabezados clara permite comprender la estructura del documento. El `h1` expresa el tema principal y los `h2` o `h3` dividen subsecciones según su relación, no según el tamaño visual deseado.

```html
<main>
  <h1>Optimización de imágenes</h1>
  <p>Cómo elegir formato, dimensiones y estrategia de carga.</p>

  <section>
    <h2>Elegir el formato</h2>
    <p>AVIF y WebP suelen reducir el peso frente a formatos anteriores.</p>
  </section>
</main>
```

Un enlace interno transmite navegación y contexto. El texto “documentación de caché HTTP” explica mejor el destino que “haz clic aquí”. Una página sin enlaces internos puede ser difícil de descubrir aunque exista en el servidor.

## `robots.txt` y meta robots

`robots.txt` comunica qué rutas puede rastrear un bot que respete el estándar:

```text
User-agent: *
Disallow: /panel-interno/
Sitemap: https://example.com/sitemap.xml
```

Bloquear rastreo no equivale a proteger datos ni garantiza que una URL desaparezca del índice. Los datos privados necesitan autenticación y autorización reales.

La directiva meta robots actúa sobre una página que el bot puede leer:

```html
<meta
  name="robots"
  content="noindex, follow"
/>
```

`noindex` solicita no indexar la página; `follow` permite seguir sus enlaces. Si `robots.txt` impide solicitar la URL, el buscador puede no llegar a leer el `noindex`. Para retirar contenido sensible, primero se elimina el acceso público.

## Sitemap XML

Un sitemap enumera URLs canónicas que se desea facilitar al buscador. XML significa _Extensible Markup Language_ o lenguaje de marcado extensible.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/guias/seo</loc>
    <lastmod>2026-08-19</lastmod>
  </url>
</urlset>
```

El sitemap ayuda al descubrimiento, pero no reemplaza una navegación enlazada. Debe incluir URLs canónicas que respondan correctamente, no redirecciones, errores ni páginas marcadas con `noindex`.

## Datos estructurados y JSON-LD

Los **datos estructurados** describen entidades con un vocabulario que una máquina puede interpretar. Schema.org ofrece tipos y propiedades compartidos. **JSON-LD** significa _JavaScript Object Notation for Linked Data_ y es un formato común para incluirlos.

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "SEO técnico: fundamentos y terminología",
    "dateModified": "2026-08-19",
    "author": {
      "@type": "Person",
      "name": "Ángel"
    }
  }
</script>
```

El marcado debe representar contenido visible y verdadero. Añadir propiedades inventadas no mejora el posicionamiento y puede invalidar un resultado enriquecido.

## Códigos HTTP y redirecciones

**HTTP** significa _Hypertext Transfer Protocol_ o protocolo de transferencia de hipertexto. El código de estado comunica el resultado de una solicitud:

| Código        | Significado para una URL                      |
| ------------- | --------------------------------------------- |
| `200`         | Contenido disponible                          |
| `301` o `308` | Traslado permanente; se prefiere la nueva URL |
| `302` o `307` | Cambio temporal                               |
| `404`         | Recurso no encontrado                         |
| `410`         | Recurso retirado de forma intencional         |
| `500`         | Fallo del servidor                            |

Una cadena de varias redirecciones aumenta latencia y diluye señales. Cuando cambia una URL, se actualizan enlaces internos, canonical y sitemap además de crear la redirección.

Un **soft 404** ocurre cuando la página parece un error o carece de contenido útil, pero responde `200`. El servidor debe devolver el estado que representa la situación real.

## CSR, SSR y SSG

**CSR** (_Client-Side Rendering_) renderiza principalmente en el cliente. **SSR** (_Server-Side Rendering_) produce HTML por solicitud en el servidor. **SSG** (_Static Site Generation_) genera HTML durante la construcción.

Los buscadores modernos pueden ejecutar JavaScript, pero una respuesta HTML con contenido significativo suele facilitar el rastreo, mejorar la resiliencia y reducir trabajo de renderizado. No es obligatorio usar una sola estrategia en todo el sitio: una página pública puede ser estática y un panel privado puede renderizarse en el cliente.

## Rendimiento y experiencia

**Core Web Vitals** es un conjunto de métricas de experiencia real que incluye carga, capacidad de respuesta y estabilidad visual. Sus siglas principales son:

- **LCP**: _Largest Contentful Paint_, aparición del contenido principal más grande.
- **INP**: _Interaction to Next Paint_, respuesta visual a interacciones.
- **CLS**: _Cumulative Layout Shift_, cambios inesperados de posición.

Mejorar estas métricas no sustituye contenido relevante. Sí ayuda a que la página sea usable y reduce barreras para usuarios y rastreadores.

## Contenido útil y mantenimiento

Una página debe responder una intención concreta, mostrar experiencia verificable y mantenerse actualizada. Crear muchas páginas casi iguales para variaciones de palabras clave produce duplicación y dificulta el mantenimiento.

Antes de publicar, pregunta:

- ¿qué problema resuelve esta URL que otra página no resuelve?;
- ¿la respuesta principal aparece temprano y se amplía con estructura clara?;
- ¿los ejemplos son correctos y las fuentes están identificadas?;
- ¿la fecha, autoría y responsabilidad del contenido son transparentes?;
- ¿los enlaces rotos y contenidos obsoletos tienen un proceso de revisión?

## Lista de comprobación técnica

1. La URL responde con el estado HTTP correcto.
2. El HTML inicial contiene título, contenido principal y enlaces útiles.
3. `title`, descripción y `h1` describen la página sin duplicarse mecánicamente.
4. `canonical`, redirecciones y sitemap señalan la misma URL preferida.
5. Las páginas privadas requieren autenticación; no dependen de `robots.txt`.
6. Imágenes, fuentes y JavaScript no bloquean innecesariamente el contenido.
7. Los datos estructurados coinciden con lo visible y se validan.
8. El sitio funciona con teclado, dispositivos móviles y conexiones lentas.
