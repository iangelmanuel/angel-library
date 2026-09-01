---
title: SEO con JavaScript e internacionalización
description: Diseñar HTML rastreable, URLs por idioma, hreflang, canonical y contenido dinámico sin crear versiones duplicadas o invisibles.
type: guides
order: 3
tags: [seo, javascript, rendering, i18n, hreflang]
related:
  - seo/seo-tecnico/seo-rastreo-indexacion
  - seo/seo-tecnico/seo-metadata-datos-estructurados
  - seo/seo-tecnico/seo-auditoria-migraciones
updatedAt: 2026-08-25
---

Los buscadores modernos pueden procesar JavaScript, pero el contenido crítico sigue siendo más confiable cuando llega en HTML inicial. Renderizar en cliente añade otra etapa, dependencias y posibilidades de error.

## Qué debe existir sin interacción

Al solicitar una URL pública, comprueba en la respuesta:

- título, encabezado y contenido principal;
- enlaces con `href` reales;
- canonical y metadata necesaria;
- status HTTP correcto;
- datos estructurados coherentes con lo visible.

Un skeleton vacío que depende de `useEffect` puede tardar en comprenderse o fallar si el script no ejecuta. SSR y prerender resuelven la entrega inicial; la hidratación puede añadir interacción después.

## URLs para idiomas

Cada versión indexable necesita una URL estable:

```text
/es/guias/accesibilidad
/en/guides/accessibility
```

Evita cambiar únicamente por cookie o header bajo la misma URL si quieres que ambas versiones se descubran e indexen. El selector de idioma debe enlazar con `<a href>`.

## `hreflang`

```html
<link rel="alternate" hreflang="es" href="https://example.com/es/guia" />
<link rel="alternate" hreflang="en" href="https://example.com/en/guide" />
<link rel="alternate" hreflang="x-default" href="https://example.com/guide" />
```

Las relaciones son recíprocas: cada versión referencia las demás, incluida ella misma. Usa códigos de idioma y, cuando haga falta, región (`es-CO`). `x-default` representa una página neutral o selector.

## Canonical e idioma

Cada traducción completa suele ser canonical de sí misma; no canonicalices todas hacia un idioma porque pedirías consolidar páginas cuyo contenido y audiencia son distintos. Canonical trata duplicación; `hreflang` trata equivalentes regionales.

## Contenido generado y filtros

No conviertas cada combinación de filtro en página indexable. Decide qué facetas responden una intención real, enlázalas internamente y controla el resto mediante navegación, canonical o exclusión apropiada. El parámetro no define por sí solo si una URL aporta valor.

## Prueba rápida

1. solicita la URL con `curl` y revisa HTML/status;
2. navega sin JavaScript y confirma contenido/enlaces esenciales;
3. valida reciprocidad de `hreflang`;
4. comprueba canonical absoluto y sitemap;
5. inspecciona en Search Console la URL concreta.

## Decisión

Internacionalizar no es traducir metadata únicamente. Incluye URLs, navegación, contenido, moneda/fecha, sitemap, redirects y medición por mercado.

## Fuentes y comprobación

- [Fundamentos de SEO para JavaScript — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Sitios multirregionales y multilingües](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Consolidación de URLs duplicadas y canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

Las recomendaciones de indexación pueden cambiar. Contrasta siempre la guía con Search Console y con el HTML que realmente recibe el robot, no solo con el estado visual del navegador.
