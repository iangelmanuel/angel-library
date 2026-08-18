---
title: "Vercel CLI: comandos esenciales"
description: Instalar la CLI de Vercel, loguearse y el flujo del día a día — deploy a preview, deploy a producción, correr local y manejar variables de entorno.
category: terminal
stack: cli
order: 1
tags: [cli, vercel, deploy]
scope: vercel
related: [guides/cli-astro]
updatedAt: 2026-08-17
---

## Instalación

Igual en Windows, macOS y Linux — es un paquete de npm:

```bash
npm i vercel
```

También funciona con `pnpm i vercel`, `yarn i vercel` o `bun i vercel`. Sin el flag `-g` queda instalada como dependencia del proyecto (se corre con `npx vercel`); para tener el comando `vercel` disponible en cualquier carpeta de la terminal, instalarla global:

```bash
npm i -g vercel
```

## Login

```bash
vercel login
```

Abre el navegador para confirmar la sesión contra tu cuenta de Vercel.

## Deploy

```bash
vercel          # deploy a preview (URL única, no toca producción)
vercel --prod   # deploy a producción
```

Corrido dentro de la carpeta del proyecto, `vercel` detecta el framework automáticamente, construye y sube el resultado. Sin `--prod`, cada deploy genera una URL de preview aislada — ideal para revisar cambios antes de promoverlos.

## Correr local con el entorno de Vercel

```bash
vercel dev
```

Levanta un servidor local que replica el entorno de producción de Vercel (variables de entorno, funciones serverless, rewrites) en vez de depender del dev server nativo del framework.

## Vincular una carpeta a un proyecto

```bash
vercel link
```

Asocia el directorio actual con un proyecto existente en Vercel (crea `.vercel/project.json`). Es un paso previo habitual antes de `vercel env` o `vercel pull`.

## Variables de entorno

```bash
vercel env ls
vercel env add DATABASE_URL production
vercel env rm DATABASE_URL production
vercel env pull .env.local
```

`vercel env pull` trae las variables configuradas en el dashboard hacia un archivo local — evita copiarlas a mano cada vez que cambian.

## Logs

```bash
vercel logs
vercel logs [deployment-url] --follow
```

Muestra los logs de runtime de un deployment específico.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `vercel login` | Autentica la CLI con tu cuenta |
| `vercel` | Deploy a preview |
| `vercel --prod` | Deploy a producción |
| `vercel dev` | Corre el proyecto local con el entorno de Vercel |
| `vercel link` | Vincula la carpeta local a un proyecto de Vercel |
| `vercel env pull` | Trae las variables de entorno del proyecto a un archivo local |
| `vercel logs` | Muestra logs de runtime de un deployment |

## Consideraciones

- En CI/CD no es viable `vercel login` (pide confirmación manual en navegador) — ahí se usa un token generado en el dashboard, vía la variable de entorno `VERCEL_TOKEN` o el flag `--token`.
- `vercel` sin flags NUNCA toca producción — hace falta `--prod` explícito, lo que hace difícil pisar el sitio en vivo por accidente.
- La documentación oficial actual instala el paquete sin `-g` (`npm i vercel`); si el objetivo es tener `vercel` como comando global en la terminal, agregar `-g` a mano.
