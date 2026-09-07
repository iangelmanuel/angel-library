---
title: Estructura y configuración de Astro
description: Organizar src y public, configurar site, base, output, integrations, aliases y Vite sin convertir astro.config en lógica de aplicación.
type: guides
order: 2
tags: [astro, configuration, project-structure, vite, typescript]
scope: astro.config y organización
website: https://docs.astro.build/en/guides/configuring-astro/
related:
  - frontend/astro/astro-getting-started
  - frontend/astro/astro-rendering-modes
  - frontend/astro/astro-integrations
  - frontend/astro/astro-env-vars
updatedAt: 2026-08-25
---

## Para recordar

`astro.config.mjs` define cómo se construye y sirve el proyecto; no es el lugar para consultar datos de una página. `src/` participa en el grafo de módulos. `public/` se copia sin procesamiento. `site` representa el origen canónico y `base` un prefijo de ruta. `output` decide el comportamiento de renderizado predeterminado.

## Configuración mínima tipada

```ts title="astro.config.ts"
import { defineConfig } from "astro/config"

export default defineConfig({
  site: "https://docs.example.com",
  trailingSlash: "never",
  output: "static"
})
```

`defineConfig()` ofrece autocompletado y validación. La configuración se evalúa en Node.js al iniciar Astro; no forma parte del código enviado al navegador.

| Opción         | Decide                           | Pregunta útil                                        |
| -------------- | -------------------------------- | ---------------------------------------------------- |
| `site`         | URL absoluta del sitio           | ¿sitemap y URLs canónicas conocen el dominio?        |
| `base`         | prefijo donde vive la aplicación | ¿se publica en `/` o en `/docs/`?                    |
| `output`       | estático o servidor por defecto  | ¿la mayoría de rutas depende de la request?          |
| `adapter`      | runtime de render bajo demanda   | ¿dónde se ejecutará el servidor?                     |
| `integrations` | extensiones de Astro             | ¿necesito MDX, React, sitemap u otra capacidad?      |
| `image`        | servicio y dominios de imágenes  | ¿qué orígenes remotos puedo optimizar?               |
| `i18n`         | locales y routing internacional  | ¿cómo se representa el idioma en la URL?             |
| `vite`         | configuración de bajo nivel      | ¿una necesidad real no tiene opción propia en Astro? |

## `site` no es lo mismo que `base`

```ts
export default defineConfig({
  site: "https://example.com",
  base: "/library"
})
```

En este caso, el origen es `https://example.com` y el proyecto se publica bajo `/library`. Para construir enlaces respetando el prefijo puedes usar `import.meta.env.BASE_URL` o helpers basados en `Astro.site`, según necesites una ruta o una URL absoluta.

No escribas el dominio manualmente en veinte componentes. Centralizarlo evita enlaces rotos entre desarrollo, preview y producción.

## Organización por responsabilidad

```text
src/
├── assets/        # recursos procesados
├── components/    # UI reutilizable
├── content/       # contenido administrado por colecciones
├── layouts/       # shells de documentos
├── libs/           # lógica y adaptadores sin UI
├── pages/         # rutas y endpoints
├── styles/        # estilos globales y tokens
└── env.d.ts       # tipos globales de Astro
```

Astro no exige esta estructura completa. Créala cuando aparezca una responsabilidad, no como ceremonia inicial. Colocar una utilidad dentro de `pages/` no la vuelve pública por sí sola si no sigue una convención de ruta, pero separar código de routing reduce confusión.

## `src/assets` frente a `public`

| Ubicación    | Tratamiento                           | Úsala para                                                                              |
| ------------ | ------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/assets` | import, hash, optimización y análisis | imágenes que usa un componente, SVG importado, assets versionados                       |
| `public`     | copia directa con nombre estable      | `robots.txt`, favicon especial, archivo descargable o recurso que no debe transformarse |

```astro
---
import cover from "../assets/cover.png"
import { Image } from "astro:assets"
---

<Image
  src={cover}
  alt="Portada del manual"
/>
<a
  href="/manual.pdf"
  download
  >Descargar PDF sin procesar</a
>
```

## Aliases de TypeScript

```json title="tsconfig.json"
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".", // deprecado en TypeScript 7.0
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```ts
import { getPosts } from "@/libs/posts"
```

El alias debe ser entendido por TypeScript y por el bundler. Astro integra Vite y suele resolver `paths`, pero una herramienta externa de pruebas o scripts puede necesitar su propia configuración.

## Integraciones y Vite

```ts title="astro.config.ts"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

export default defineConfig({
  integrations: [react()],
  vite: {
    server: {
      strictPort: true
    }
  }
})
```

Una **integración de Astro** participa en el ciclo del framework. Un **plugin de Vite** transforma módulos o modifica el bundler. No los coloques en el mismo array ni copies configuración sin saber qué sistema la consume.

## Configuración frente a datos de aplicación

Usa configuración para decisiones de build y plataforma. Usa módulos de aplicación para navegación, datos de negocio o contenido:

```ts title="src/config/site.ts"
export const site = {
  name: "Angel Library",
  navigation: [
    { label: "Inicio", href: "/" },
    { label: "Guías", href: "/guides" }
  ]
} as const
```

Así puedes probar y reutilizar estos datos sin acoplarlos al proceso que carga `astro.config`.

## Checklist de configuración

- ¿`site` y `base` coinciden con el despliegue real?
- ¿`output` refleja la mayoría de rutas y no una excepción aislada?
- ¿el adapter corresponde al proveedor y soporta las capacidades usadas?
- ¿los dominios remotos de imágenes son específicos?
- ¿las variables secretas permanecen fuera del cliente y del repositorio?
- ¿cada integración tiene una razón y aparece una sola vez?
- ¿`astro check` y `astro build` pasan con la configuración de producción?
