---
title: Internacionalización y rutas por locale
description: Detectar idioma, organizar app/[lang], cargar diccionarios server-side y generar rutas localizadas sin inflar el cliente.
category: frontend
stack: nextjs
order: 25
tags: [nextjs, i18n, routing, accessibility, seo]
scope: next.js app router (internationalization)
related:
  - guides/nextjs-route-groups
  - guides/nextjs-generate-static-params
  - guides/nextjs-metadata-seo
updatedAt: 2026-08-18
---

Next.js no impone una librería de traducciones. El patrón base es detectar un locale soportado, incluirlo en la URL y cargar el diccionario correspondiente desde un Server Component.

```text
app/
└── [lang]/
    ├── layout.tsx
    ├── page.tsx
    └── productos/page.tsx
```

## Generar locales conocidos

```tsx title="app/[lang]/layout.tsx"
const locales = ['es', 'en'] as const;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Layout({ children, params }) {
  const { lang } = await params;
  return <html lang={lang}><body>{children}</body></html>;
}
```

## Diccionarios en el servidor

```ts title="app/[lang]/dictionaries.ts"
const dictionaries = {
  es: () => import('./dictionaries/es.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
};

export const getDictionary = (locale: keyof typeof dictionaries) => dictionaries[locale]();
```

Al cargar el diccionario en un Server Component, el JSON completo no entra automáticamente al bundle cliente. Pasa a cada isla solo los textos que necesita.

## Detección y redirect

`proxy.ts` puede leer `Accept-Language` y redirigir `/` a `/es` o `/en`. También debe evitar assets y rutas internas con `matcher`. Conserva una preferencia explícita del usuario en cookie por encima del header del navegador.

## SEO y formato

- `<html lang>` correcto en cada locale.
- Canonical y `alternates.languages` para cada variante.
- `Intl.DateTimeFormat`, `Intl.NumberFormat` y `Intl.PluralRules` para formato, no concatenaciones manuales.
- No mezclar idioma con país: `es` y `es-CO` resuelven necesidades distintas.

Referencia oficial: [Internationalization](https://nextjs.org/docs/app/guides/internationalization).
