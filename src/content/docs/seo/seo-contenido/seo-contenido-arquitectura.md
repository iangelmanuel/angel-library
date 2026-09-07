---
title: Intención de búsqueda, arquitectura y enlaces internos
description: Diseñar contenido encontrable y útil mediante intención, jerarquía, URLs estables, encabezados y relaciones entre páginas.
type: guides
order: 1
tags: [seo, content, search-intent, information-architecture, internal-links]
related:
  - seo/seo-tecnico/seo-rastreo-indexacion
  - ui-ux/ui-ux-fundamentos/ui-ux-fundamentals-terminology
  - accessibility/a11y-contenido/accessibility-contenido-multimedia
updatedAt: 2026-08-19
---

El SEO de contenido comienza por resolver una necesidad, no por repetir una frase. La **intención de búsqueda** describe lo que la persona intenta lograr: aprender, comparar, navegar hacia un sitio o completar una acción.

## Una página, una promesa clara

Antes de escribir, define:

- quién tiene la pregunta y qué conoce;
- qué resultado espera al terminar;
- qué conceptos previos necesita;
- qué ejemplos y evidencia vuelven accionable la explicación;
- qué páginas profundizan sin duplicar.

El título principal y la introducción deben confirmar rápido que la página responde esa intención. Los encabezados crean una jerarquía comprensible; no son decoración ni una lista de palabras clave.

## Arquitectura de información

```text
/database/
  /modelado-relacional/
  /sql-consultas/
  /indices-explain/
  /postgresql-transacciones/
```

Una arquitectura temática permite llegar desde la categoría hacia detalles y regresar. Evita páginas huérfanas que solo aparecen en el sitemap. Los breadcrumbs pueden expresar esa jerarquía para personas y buscadores.

## Enlaces internos

Usa texto de enlace que describa el destino:

```md
Antes de optimizar, revisa [cómo leer un plan con EXPLAIN](/database/database-sql/database-indices-explain).
```

“Haz clic aquí” pierde contexto. Enlaza cuando el destino completa un prerrequisito, amplía una decisión o muestra la implementación. No agregues decenas de enlaces irrelevantes solo para distribuir autoridad.

## URLs y mantenimiento

Las URLs deben ser legibles, estables y consistentes. Evita incorporar detalles que cambiarán con facilidad, como fecha o jerarquías internas accidentales. Si cambias una URL:

1. redirige de la antigua a la nueva;
2. actualiza enlaces, canonical y sitemap;
3. evita cadenas de redirecciones;
4. monitorea errores y tráfico.

## Actualizar contenido

No cambies una fecha sin revisar el cuerpo. Comprueba ejemplos, versiones, enlaces, capturas y términos. Si una página ya no responde la intención, fusiónala o retírala con una redirección adecuada.

## Referencias

- [Google Search: estructura de URLs](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Google Search: contenido útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
