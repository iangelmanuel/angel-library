---
title: Metadata, Open Graph y datos estructurados
description: Describir cada página para buscadores y redes mediante títulos, descripciones, imágenes sociales y JSON-LD verificable.
type: guides
order: 2
tags: [seo, metadata, open-graph, json-ld, schema-org]
related:
  - seo/nextjs/nextjs-metadata-seo
  - seo/astro/astro-seo-completo
  - seo/nextjs/nextjs-seo-completo
updatedAt: 2026-08-19
---

La metadata resume una página para sistemas que no dependen de su diseño visual. Debe generarse desde la misma fuente de datos del contenido para no publicar títulos, canonical o imágenes contradictorias.

```html
<title>Índices SQL y EXPLAIN | angel.library</title>
<meta name="description" content="Guía práctica para analizar planes e índices." />
<link rel="canonical" href="https://example.com/guides/database-indices-explain" />

<meta property="og:type" content="article" />
<meta property="og:title" content="Índices SQL y EXPLAIN" />
<meta property="og:image" content="https://example.com/og/sql-indices.png" />
<meta name="twitter:card" content="summary_large_image" />
```

## Título y descripción

El título debe distinguir la página y expresar su tema principal. Evita plantillas donde lo importante queda truncado detrás de una marca larga. La descripción puede influir en el fragmento mostrado, pero el buscador puede seleccionar otro texto si responde mejor a la consulta.

No establezcas longitudes como garantías universales: la presentación depende de dispositivo y consulta. Prioriza claridad, intención y ausencia de duplicados.

## Imágenes sociales

- URL absoluta y accesible sin autenticación.
- Dimensiones y proporción adecuadas para tarjeta grande.
- Texto principal legible al reducir.
- `alt` cuando el protocolo lo admita.
- Imagen propia por contenido importante, con fallback de sitio.

Los scrapers pueden conservar caché. Cuando cambie una imagen urgente, usa la herramienta de depuración de la plataforma o una URL versionada.

## JSON-LD

**JSON-LD** representa datos enlazados en JSON. Describe entidades visibles; no agregues reseñas, precios o autores que la página no muestra.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Índices SQL y EXPLAIN",
  "dateModified": "2026-08-19",
  "author": { "@type": "Person", "name": "Ángel" },
  "mainEntityOfPage": "https://example.com/guides/database-indices-explain"
}
</script>
```

El marcado elegible no garantiza un resultado enriquecido. Valida sintaxis y propiedades, y revisa los reportes del buscador después de desplegar.

## Referencias

- [Google Search: datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org](https://schema.org/)

