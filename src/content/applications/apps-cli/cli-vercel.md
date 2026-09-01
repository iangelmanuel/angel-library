---
title: "Vercel CLI: comandos esenciales"
description: Herramienta de terminal para vincular un proyecto con Vercel, probar su entorno y crear despliegues de prueba o de producción sin depender del panel web.
type: guides
order: 7
tags: [cli, vercel, deploy]
scope: vercel
website: https://vercel.com/docs/cli
related: [terminal/cli/cli-astro]
updatedAt: 2026-08-28
---

**Vercel CLI** conecta una carpeta local con la plataforma de Vercel. Permite crear despliegues, descargar configuración, administrar variables, consultar logs y reproducir parte del entorno de ejecución sin depender del panel web.

## Instalación

La CLI se distribuye como un paquete global. Elige el mismo gestor que ya utilizas para administrar herramientas de Node.js:

```bash
pnpm add -g vercel
```

Verifica que la terminal resuelve el ejecutable:

```bash
vercel --version
```

Una instalación local también es válida si el equipo quiere fijar la versión en `package.json`, pero deberá invocarse con el ejecutor del gestor (`pnpm exec vercel`, `bunx vercel` o `npx vercel`). No mezcles una orden local y otra global sin comprobar cuál se está ejecutando.

## Autenticación

```bash
vercel login
vercel whoami
```

`login` inicia un flujo interactivo y permite continuar con correo o proveedores compatibles. `whoami` confirma qué usuario quedó activo antes de vincular o desplegar un proyecto.

En una terminal personal, la sesión interactiva es la opción más sencilla. En integración y entrega continuas (CI/CD), donde nadie puede confirmar un navegador, crea un token con el alcance mínimo necesario y pásalo mediante una variable secreta:

```bash
vercel pull --yes --environment=production --token="$VERCEL_TOKEN"
vercel build --prod --token="$VERCEL_TOKEN"
vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"
```

No escribas el valor real del token en el workflow, el historial de la shell ni el repositorio. `VERCEL_TOKEN` representa aquí un secreto configurado por la plataforma de CI.

## Deploy

```bash
vercel          # deploy a preview (URL única, no toca producción)
vercel --prod   # deploy a producción
```

Corrido dentro de la carpeta del proyecto, `vercel` detecta el framework automáticamente, construye y sube el resultado. Sin `--prod`, cada deploy genera una URL de preview aislada — ideal para revisar cambios antes de promoverlos.

Una revisión más segura antes de producción es construir primero y desplegar exactamente ese resultado:

```bash
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

`pull` descarga la configuración del proyecto, `build` crea el artefacto en `.vercel/output` y `deploy --prebuilt` evita volver a construirlo con condiciones diferentes.

## Correr local con el entorno de Vercel

```bash
vercel dev
```

Levanta un servidor local que interpreta configuración de Vercel, funciones y reglas de enrutamiento. Es útil cuando el servidor nativo del framework no reproduce una frontera propia de la plataforma; no garantiza que red, latencia, región y límites de producción sean idénticos.

## Vincular una carpeta a un proyecto

```bash
vercel link
```

Asocia el directorio actual con un proyecto existente en Vercel (crea `.vercel/project.json`). Es un paso previo habitual antes de `vercel env` o `vercel pull`.

La carpeta `.vercel` contiene metadatos locales y normalmente debe permanecer en `.gitignore`. Revisa el equipo o **scope** elegido si perteneces a varias organizaciones.

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
| `vercel whoami` | Confirma la cuenta activa |
| `vercel` | Deploy a preview |
| `vercel --prod` | Deploy a producción |
| `vercel dev` | Corre el proyecto local con el entorno de Vercel |
| `vercel link` | Vincula la carpeta local a un proyecto de Vercel |
| `vercel pull` | Descarga configuración y variables para un entorno |
| `vercel build` | Construye el proyecto con Vercel Build Output API |
| `vercel deploy --prebuilt` | Publica un artefacto construido previamente |
| `vercel env pull` | Trae las variables de entorno del proyecto a un archivo local |
| `vercel logs` | Muestra logs de runtime de un deployment |

## Consideraciones

- En CI/CD no es viable `vercel login` porque necesita interacción; usa un token almacenado como secreto y pásalo con `--token`.
- `vercel` sin flags NUNCA toca producción — hace falta `--prod` explícito, lo que hace difícil pisar el sitio en vivo por accidente.
- `vercel env pull` puede escribir secretos en un archivo local. Confirma que el destino esté ignorado por Git antes de ejecutarlo.
- Si una carpeta quedó enlazada al proyecto o equipo equivocado, revisa `.vercel/project.json`, ejecuta `vercel unlink` y vuelve a usar `vercel link`.
