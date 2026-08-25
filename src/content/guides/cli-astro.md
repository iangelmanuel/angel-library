---
title: "Astro CLI: comandos esenciales"
description: Crear un proyecto con npm create astro, y los comandos del día a día — dev, build, preview, check, add y sync. Los mismos que usa este sitio.
category: terminal
stack: cli
order: 4
tags: [cli, astro, deploy]
scope: astro
related: [guides/cli-vercel, guides/cli-prisma]
updatedAt: 2026-08-17
---

## Crear un proyecto nuevo

```bash
npm create astro@latest
```

Un asistente interactivo pregunta el nombre de la carpeta, si quieres empezar desde una plantilla y si debe instalar las dependencias. No requiere instalar nada global de antemano.

## Comandos dentro de un proyecto existente

Una vez creado el proyecto, los comandos se corren con `npx astro <comando>` o, más habitual, a través de los scripts que `npm create astro` ya deja en `package.json` (`npm run dev`, `npm run build`, etc.). Esta misma biblioteca (angel.library) usa exactamente estos comandos, definidos en su propio `package.json`.

```bash
astro dev
```

Levanta el servidor de desarrollo con recarga en vivo.

```bash
astro build
```

Genera el sitio final en `dist/` (o el output configurado).

```bash
astro preview
```

Sirve localmente el resultado de `astro build` — para verificar el build de producción antes de deployar.

```bash
astro check
```

Corre diagnóstico de tipos sobre archivos `.astro` (y TypeScript en general). Pensado para correr en CI: si encuentra errores, termina con código de salida distinto de cero.

## Agregar una integración

```bash
astro add react
astro add tailwind
```

Instala la dependencia de la integración y la configura automáticamente en `astro.config.mjs` — evita el paso manual de editar la config a mano.

## Regenerar tipos de content collections

```bash
astro sync
```

Regenera los tipos TypeScript de `astro:content` (en `.astro/types.d.ts`) a partir de `src/content.config.ts`. Ejecútalo después de cambiar el esquema de una colección para evitar tipos desactualizados.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `npm create astro@latest` | Crea un proyecto Astro nuevo |
| `astro dev` | Servidor de desarrollo con recarga en vivo |
| `astro build` | Build de producción |
| `astro preview` | Sirve localmente el build ya generado |
| `astro check` | Diagnóstico de tipos (TypeScript + Astro) |
| `astro add <integración>` | Instala y configura una integración |
| `astro sync` | Regenera tipos de content collections |

## Consideraciones

- `astro check` es el paso de validación real en CI para detectar errores de tipos antes de deployar — separado de `astro build`, que no siempre falla ante un error de tipos.
- Después de tocar `src/content.config.ts` (agregar un campo, una colección) y que los imports de `astro:content` empiecen a marcar error, correr `astro sync` antes de asumir que algo está roto.
- `astro add` modifica `astro.config.mjs` automáticamente — conviene revisar el diff después, sobre todo en proyectos con configuración ya personalizada.
