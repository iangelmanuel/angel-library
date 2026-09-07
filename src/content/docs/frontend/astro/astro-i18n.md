---
title: Internacionalización y routing i18n
description: Locales, idioma por defecto, prefijos, fallbacks y helpers de astro:i18n para sitios multilingües.
type: guides
order: 22
tags: [astro, i18n, routing, accessibility, seo]
scope: astro i18n routing
related:
  - frontend/astro/astro-routing
  - seo/astro/astro-seo-completo
updatedAt: 2026-08-25
---

Astro incluye routing i18n para describir locales soportados y validar URLs localizadas. La traducción del contenido sigue siendo responsabilidad de tu estructura o librería elegida.

**i18n** es la abreviatura de _internationalization_: hay 18 letras entre la `i` y la `n`. Un **locale** combina reglas de idioma y, opcionalmente, región; `es` expresa español general y `es-CO` añade convenciones de Colombia. Traducir texto, localizar formatos y diseñar URLs son tareas relacionadas, pero diferentes.

## Decisiones antes de configurar

| Pregunta                              | Ejemplo de decisión                           |
| ------------------------------------- | --------------------------------------------- |
| ¿el locale aparece en la URL?         | `/en/docs` frente a `/docs`                   |
| ¿el idioma por defecto lleva prefijo? | `/es/docs` o `/docs`                          |
| ¿qué ocurre si falta una traducción?  | 404, fallback o contenido parcial             |
| ¿cómo se elige inicialmente?          | URL, preferencia guardada o `Accept-Language` |
| ¿quién traduce el contenido?          | archivos, CMS o servicio externo              |

```js title="astro.config.mjs"
import { defineConfig } from "astro/config"

export default defineConfig({
  i18n: {
    locales: ["es", "en", "pt-br"],
    defaultLocale: "es",
    routing: { prefixDefaultLocale: false }
  }
})
```

```text
src/pages/
├── index.astro
├── about.astro
├── en/about.astro
└── pt-br/about.astro
```

## Helpers

`astro:i18n` expone helpers para construir URLs, obtener el path relativo al locale, comprobar locales válidos y redirigir según configuración. Úsalos en vez de concatenar `/${locale}` por todo el proyecto.

Centralizar la construcción de URLs evita dobles prefijos, locales inválidos y enlaces que olvidan la política del idioma predeterminado. El selector de idioma debe buscar la ruta equivalente, no enviar siempre al inicio.

## Diccionarios y formato

Un diccionario puede ser un objeto por locale o venir de un CMS. Carga en servidor el idioma de la ruta y pasa a una isla únicamente los textos que necesita. Para fechas, números, moneda y plurales usa las APIs `Intl`; traducir `"1 productos"` mediante concatenación produce errores gramaticales.

```ts
const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP"
})

formatter.format(125000) // "$ 125.000,00" según el entorno
```

## Fallbacks

Puedes declarar que un locale use contenido de otro cuando falte una ruta. Un fallback evita 404, pero no traduce el contenido; comunica el idioma real con `<html lang>` y no presentes una página en español como si fuera portuguesa.

El fallback debe ser una decisión visible. Si una página crítica aparece en otro idioma, puedes mostrar un aviso y ofrecer volver al idioma solicitado cuando exista. Para contenido legal o transaccional, un fallback silencioso puede ser incorrecto.

## Routing manual

`routing: 'manual'` desactiva el middleware i18n automático y deja la decisión en tu middleware. Tiene sentido para reglas de negocio específicas, dominios por país o detección avanzada; para prefijos normales, la configuración integrada es más fácil de mantener.

## Checklist

- Locale en URL para que cada idioma sea enlazable.
- `<html lang>` y metadatos localizados.
- `hreflang`/alternates y canonical coherentes.
- `Intl` para fechas, números y pluralización.
- Selector de idioma que conserva la ruta equivalente cuando existe.
- Dirección `dir="rtl"` cuando el idioma se escribe de derecha a izquierda.
- Pruebas con textos largos, caracteres combinados y formatos regionales.
- Locale validado antes de usarlo para importar un diccionario.

## Errores frecuentes

- Detectar idioma solo por geolocalización y no permitir que la persona lo cambie.
- Guardar la traducción en JavaScript cliente aunque el contenido se renderiza en servidor.
- Usar banderas como sustituto de idiomas; un idioma puede pertenecer a muchos países.
- Traducir texto sin localizar moneda, fecha, pluralización y dirección de lectura.

Referencia oficial: [Internationalization routing](https://docs.astro.build/en/guides/internationalization/).
