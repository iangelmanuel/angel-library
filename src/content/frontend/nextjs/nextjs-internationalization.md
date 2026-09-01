---
title: Internacionalización y rutas por locale
description: Detectar idioma, organizar app/[lang], cargar diccionarios server-side y generar rutas localizadas sin inflar el cliente.
type: guides
order: 29
tags: [nextjs, i18n, routing, accessibility, seo]
scope: next.js app router (internationalization)
related:
  - frontend/nextjs/nextjs-route-groups
  - frontend/nextjs/nextjs-generate-static-params
  - seo/nextjs/nextjs-metadata-seo
updatedAt: 2026-08-25
---

Next.js no impone una librería de traducciones. El patrón base es detectar un locale soportado, incluirlo en la URL y cargar el diccionario correspondiente desde un Server Component.

**i18n** abrevia *internationalization*. El problema incluye routing, traducción, formato regional, metadatos y preferencia de idioma. Next.js aporta las piezas de routing y servidor; tú defines los locales válidos y la estrategia de contenido.

## Arquitectura rápida

| Responsabilidad | Lugar habitual |
| --- | --- |
| locale visible | segmento `app/[lang]/` |
| detección inicial | `proxy.ts` |
| validación | layout o helper servidor |
| textos | diccionarios o CMS |
| fechas, moneda y plural | APIs `Intl` |
| SEO por idioma | Metadata API y alternates |

```text
app/
└── [lang]/
    ├── layout.tsx
    ├── page.tsx
    └── productos/page.tsx
```

## Generar locales conocidos

```tsx title="app/[lang]/layout.tsx"
import { notFound } from 'next/navigation';

const locales = ['es', 'en'] as const;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as (typeof locales)[number])) notFound();
  return <html lang={lang}><body>{children}</body></html>;
}
```

`generateStaticParams()` permite prerenderizar los locales conocidos, pero no reemplaza la validación. Un segmento dinámico acepta cualquier texto que llegue en la URL; rechaza `/xx/...` antes de usarlo como clave de importación.

## Diccionarios en el servidor

```ts title="app/[lang]/dictionaries.ts"
const dictionaries = {
  es: () => import('./dictionaries/es.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
};

export const getDictionary = (locale: keyof typeof dictionaries) => dictionaries[locale]();
```

Al cargar el diccionario en un Server Component, el JSON completo no entra automáticamente al bundle cliente. Pasa a cada isla solo los textos que necesita.

Mantén la lista de loaders cerrada en código. Construir un import directamente desde texto del usuario complica el análisis del bundle y puede intentar cargar módulos inexistentes.

## Detección y redirect

`proxy.ts` puede leer `Accept-Language` y redirigir `/` a `/es` o `/en`. También debe evitar assets y rutas internas con `matcher`. Conserva una preferencia explícita del usuario en cookie por encima del header del navegador.

`Accept-Language` expresa preferencias del navegador, no una identidad permanente. Úsalo para la primera sugerencia y permite cambiarla. El destino debe incluir el locale para que la URL sea compartible, indexable y estable al recargar.

## SEO y formato

- `<html lang>` correcto en cada locale.
- Canonical y `alternates.languages` para cada variante.
- `Intl.DateTimeFormat`, `Intl.NumberFormat` y `Intl.PluralRules` para formato, no concatenaciones manuales.
- No mezclar idioma con país: `es` y `es-CO` resuelven necesidades distintas.
- Dirección `dir="rtl"` para idiomas de derecha a izquierda.
- Sitemap y contenido canónico coherentes con las variantes publicadas.

## Errores frecuentes

- Enviar todos los diccionarios al Client Component raíz.
- Usar la bandera de un país como único nombre accesible del idioma.
- Traducir texto y olvidar errores, emails, metadatos o datos estructurados.
- Redirigir en cada solicitud aunque la URL ya contiene un locale válido.
- Suponer que un fallback está traducido; comunica el idioma real del contenido.

Referencia oficial: [Internationalization](https://nextjs.org/docs/app/guides/internationalization).
