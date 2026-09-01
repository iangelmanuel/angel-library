---
title: Auditoría SEO, Search Console y migraciones
description: Revisar cobertura técnica, contenido y rendimiento, y mover dominios o rutas sin perder señales ni dejar errores invisibles.
type: guides
order: 4
tags: [seo, audit, search-console, migrations, redirects]
related:
  - seo/seo-tecnico/seo-rastreo-indexacion
  - seo/seo-tecnico/seo-metadata-datos-estructurados
  - performance/performance-fundamentos/core-web-vitals
updatedAt: 2026-08-25
---

Una auditoría útil conecta un síntoma con impacto y una acción. La cantidad de avisos de una herramienta no equivale a prioridad.

## Revisión por capas

1. **Acceso:** DNS, HTTPS, status, robots y autenticación accidental.
2. **Indexación:** canonical, `noindex`, sitemaps, duplicados y soft 404.
3. **Renderizado:** HTML principal, enlaces y contenido disponibles.
4. **Arquitectura:** profundidad, páginas huérfanas y enlaces internos.
5. **Contenido:** intención, duplicación, vigencia y utilidad.
6. **Experiencia:** Core Web Vitals, móvil y accesibilidad.

Prioriza por cantidad de URLs afectadas, valor del contenido, severidad y esfuerzo. Un canonical erróneo en toda la plantilla suele importar más que diez descripciones ausentes en páginas menores.

## Search Console

Search Console muestra información del buscador: consultas, páginas, cobertura e inspección de URLs. Combínala con logs y analítica; una caída puede provenir de demanda, ranking, tracking o un problema técnico.

Al investigar compara fecha de despliegues, segmentos de página, dispositivo, país y tipo de búsqueda. No concluyas por una variación diaria aislada.

## Evidencia por URL

Para una muestra representativa registra URL, status, canonical declarado/seleccionado, indexabilidad, enlaces entrantes, HTML renderizado y última modificación. Segmenta por plantilla: un fallo en producto puede no afectar documentación.

```text
síntoma → segmento → cambio temporal → causa probable → prueba → acción
```

No corrijas todos los avisos con igual prioridad. Estima páginas e intención afectadas y verifica si el buscador realmente interpreta la señal como esperas.

## Migración de rutas o dominio

Antes de publicar:

- inventaría URLs antiguas con tráfico, enlaces y conversiones;
- crea un mapa uno a uno hacia el destino equivalente;
- conserva contenido y señales importantes durante la transición;
- prepara sitemap nuevo, canonical y propiedades de medición;
- prueba redirecciones y evita enviar todo a la portada.

Después:

- rastrea el sitio y revisa `404`, loops y cadenas;
- observa logs del servidor y páginas indexadas;
- actualiza enlaces internos y campañas;
- conserva redirecciones por un periodo prolongado.

## Matriz de redirecciones

Cada URL valiosa debe apuntar al equivalente más cercano con una redirección permanente. Evita cadenas `antigua → intermedia → nueva`, loops y reglas que transformen parámetros importantes incorrectamente.

Prueba status y destino automáticamente antes del corte. Mantén propiedad de ambos dominios, certificados y monitoreo durante la transición.

## Criterio de cierre

La migración no termina el día del deploy. Continúa hasta que rastreo, indexación, tráfico y conversiones se estabilicen, los errores inesperados tengan explicación y las URLs antiguas sigan resolviendo correctamente.

## Referencias

- [Google Search Console](https://search.google.com/search-console/about)
- [Google Search: migraciones con cambios de URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

