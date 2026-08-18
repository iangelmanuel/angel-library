---
title: Internacionalización y routing i18n
description: Locales, idioma por defecto, prefijos, fallbacks y helpers de astro:i18n para sitios multilingües.
category: frontend
stack: astro
order: 19
tags: [astro, i18n, routing, accessibility, seo]
scope: astro i18n routing
related:
  - guides/astro-routing
  - recipes/astro-seo-completo
updatedAt: 2026-08-18
---

Astro incluye routing i18n para describir locales soportados y validar URLs localizadas. La traducción del contenido sigue siendo responsabilidad de tu estructura o librería elegida.

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    locales: ['es', 'en', 'pt-br'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
});
```

```text
src/pages/
├── index.astro
├── about.astro
├── en/about.astro
└── pt-br/about.astro
```

## Helpers

`astro:i18n` expone helpers para construir URLs, obtener el path relativo al locale, comprobar locales válidos y redirigir según configuración. Usalos en vez de concatenar `/${locale}` por todo el proyecto.

## Fallbacks

Puedes declarar que un locale use contenido de otro cuando falte una ruta. Un fallback evita 404, pero no traduce el contenido; comunica el idioma real con `<html lang>` y no presentes una página en español como si fuera portuguesa.

## Routing manual

`routing: 'manual'` desactiva el middleware i18n automático y deja la decisión en tu middleware. Tiene sentido para reglas de negocio específicas, dominios por país o detección avanzada; para prefijos normales, la configuración integrada es más fácil de mantener.

## Checklist

- Locale en URL para que cada idioma sea enlazable.
- `<html lang>` y metadatos localizados.
- `hreflang`/alternates y canonical coherentes.
- `Intl` para fechas, números y pluralización.
- Selector de idioma que conserva la ruta equivalente cuando existe.

Referencia oficial: [Internationalization routing](https://docs.astro.build/en/guides/internationalization/).
