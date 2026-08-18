---
title: "Railway CLI: comandos esenciales"
description: Instalación, login y el flujo del día a día — init, link, deploy, correr comandos locales con las variables del proyecto inyectadas, y logs.
category: terminal
stack: cli
order: 7
tags: [cli, railway, deploy]
scope: railway
related: [guides/cli-prisma]
updatedAt: 2026-08-17
---

## Instalación

```bash
npm i -g @railway/cli
```

En macOS también está disponible vía Homebrew. Windows y Linux además pueden usar Scoop o los binarios pre-compilados que Railway publica en sus releases — el paquete de npm es el método más directo y multiplataforma.

## Login

```bash
railway login
```

Abre el navegador para autenticar la CLI contra tu cuenta de Railway.

## Inicializar un proyecto

```bash
railway init
```

Crea un proyecto nuevo en Railway y lo asocia con la carpeta actual, siguiendo un flujo interactivo.

## Vincular con un proyecto existente

```bash
railway link
```

Asocia la carpeta local con un proyecto de Railway ya creado (en vez de crear uno nuevo) — el equivalente a `vercel link` o `supabase link`.

## Deploy

```bash
railway up
```

Sube el directorio actual y dispara un deploy en Railway.

## Correr un comando con las variables del proyecto

```bash
railway run npm start
railway run npx prisma migrate deploy
```

Ejecuta el comando indicado localmente, pero con las variables de entorno del proyecto de Railway (las mismas que usa el servicio desplegado) inyectadas en el proceso — sin tener que copiarlas a un `.env` local a mano.

## Logs

```bash
railway logs
```

Muestra (y sigue) los logs del deployment activo.

## Variables de entorno

```bash
railway variables
```

Lista las variables de entorno configuradas para el servicio vinculado.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `railway login` | Autentica la CLI con tu cuenta |
| `railway init` | Crea un proyecto nuevo en Railway |
| `railway link` | Vincula la carpeta local a un proyecto existente |
| `railway up` | Deploy del directorio actual |
| `railway run <comando>` | Corre un comando local con las variables del proyecto inyectadas |
| `railway logs` | Logs del deployment activo |
| `railway variables` | Lista las variables de entorno del servicio |

## Consideraciones

- `railway run` es el comando más útil para desarrollo local contra una base de datos hosteada en Railway (ej. `railway run npx prisma studio`) — evita mantener un `.env` duplicado sincronizado a mano.
- `railway link` vincula la carpeta a un servicio específico dentro de un proyecto, no solo al proyecto en general — con varios servicios en el mismo proyecto (API + base de datos, por ejemplo) hay que confirmar cuál quedó seleccionado.
- El paquete de npm (`@railway/cli`) es el método de instalación más simple entre plataformas; el mismo resultado (comando `railway` global) se logra también por Homebrew en macOS.
