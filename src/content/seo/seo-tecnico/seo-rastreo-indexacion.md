---
title: Rastreo, indexación, robots, sitemap y canonical
description: Controlar cómo los buscadores descubren URLs, rastrean recursos, consolidan duplicados e interpretan qué páginas pueden indexar.
type: guides
order: 1
tags: [seo, crawling, indexing, robots, sitemap, canonical]
related:
  - seo/seo/seo-fundamentals-terminology
  - seo/seo-tecnico/seo-auditoria-migraciones
  - languages/javascript/http-browser-fundamentals
updatedAt: 2026-08-19
---

Publicar una URL no garantiza que un buscador la conozca, la rastree o la indexe. Cada etapa tiene controles diferentes y diagnosticarla por separado evita aplicar soluciones equivocadas.

```text
enlace o sitemap → descubrimiento → rastreo HTTP → renderizado → indexación
```

## robots.txt no es noindex

```txt title="public/robots.txt"
User-agent: *
Disallow: /admin/
Disallow: /search?

Sitemap: https://example.com/sitemap.xml
```

`robots.txt` orienta el rastreo, pero una URL bloqueada todavía puede aparecer si otros sitios la enlazan, porque el buscador no necesita leer su contenido para conocerla. Para impedir indexación utiliza `noindex` en una respuesta que el bot pueda rastrear:

```html
<meta name="robots" content="noindex, follow" />
```

Contenido privado se protege con autenticación y autorización. Ni `robots.txt` ni `noindex` son controles de seguridad.

## Sitemap

Un sitemap enumera URLs canónicas que se desea descubrir. Usa URLs absolutas y actualiza `lastmod` solo cuando cambie contenido significativo.

```xml
<url>
  <loc>https://example.com/docs/http</loc>
  <lastmod>2026-08-19</lastmod>
</url>
```

Un sitemap facilita descubrimiento, pero no obliga a indexar. En sitios grandes se divide en varios archivos mediante un índice de sitemaps.

## Canonical y duplicados

```html
<link rel="canonical" href="https://example.com/products/keyboard" />
```

La canonical es una señal para consolidar variantes con contenido equivalente. Debe ser absoluta, indexable y coherente con enlaces internos, redirecciones y sitemap. No uses todas las canonicals hacia la portada ni apuntes una página única hacia otra distinta.

Las redirecciones permanentes y `rel="canonical"` son señales fuertes; incluir una URL en sitemap es una señal más débil. La coherencia entre ellas reduce ambigüedad.

## Status HTTP y contenido

- `200`: existe y puede evaluarse para indexación.
- `301`/`308`: cambio permanente de URL.
- `404`/`410`: contenido inexistente o retirado.
- `5xx`: fallo temporal; monitorea para no sostenerlo.

Una **soft 404** devuelve `200` pero muestra una página vacía o “no encontrado”. Devuelve el status real. Asegura también que el HTML inicial y los recursos críticos sean accesibles para renderizar.

## Referencias

- [Google Search: rastreo e indexación](https://developers.google.com/search/docs/crawling-indexing)
- [Google Search: crear un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search: canonicalización](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

