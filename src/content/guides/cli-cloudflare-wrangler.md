---
title: "Wrangler CLI: comandos esenciales"
description: La CLI de Cloudflare para Workers, Pages y D1 — instalación local recomendada, login, correr local, deploy, logs en vivo y las bases de D1.
category: terminal
stack: cli
order: 5
tags: [cli, cloudflare, wrangler, deploy]
scope: wrangler
updatedAt: 2026-08-17
---

## Instalación

Cloudflare recomienda instalar Wrangler **como dependencia del proyecto**, no global — así todo el equipo usa la misma versión fijada en `package.json`. Igual en Windows, macOS y Linux:

```bash
npm i -D wrangler@latest
```

Se corre con `npx wrangler <comando>`:

```bash
npx wrangler --version
```

## Login

```bash
wrangler login
```

Abre el navegador para autorizar Wrangler contra tu cuenta de Cloudflare.

## Correr local

```bash
wrangler dev
```

Levanta un servidor de desarrollo local con recarga en vivo y devtools, simulando el runtime de Workers.

## Deploy

```bash
wrangler deploy
```

Publica el Worker al edge global de Cloudflare.

## Logs en vivo

```bash
wrangler tail
```

Muestra en tiempo real los logs de un Worker ya desplegado — útil para depurar producción sin agregar `console.log` y volver a deployar.

## D1 (base de datos)

```bash
wrangler d1 create <nombre>
wrangler d1 list
wrangler d1 execute <base> --command "SELECT 1"
wrangler d1 migrations create <base> <mensaje>
wrangler d1 migrations apply <base>
```

- `d1 create` provisiona una base D1 nueva y devuelve el binding/UUID a copiar en la config.
- `d1 execute` corre SQL directo (una sentencia o un archivo `.sql`) contra la base.
- `d1 migrations create` / `d1 migrations apply` manejan el historial de migraciones de la base, igual que `migrate dev` en otros ORMs pero nativo de Wrangler.

## Cloudflare Pages

```bash
wrangler pages deploy <carpeta-de-build>
```

Sube el contenido de una carpeta ya compilada —por ejemplo, `dist/`— como un despliegue de Pages.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `wrangler login` | Autentica la CLI con tu cuenta de Cloudflare |
| `wrangler dev` | Corre el Worker local con recarga en vivo |
| `wrangler deploy` | Publica el Worker al edge |
| `wrangler tail` | Logs en vivo de un Worker desplegado |
| `wrangler d1 <subcomando>` | Crear, consultar y migrar bases D1 |
| `wrangler pages deploy` | Desplegar una carpeta compilada en Pages |

## Consideraciones

- Instalarla local (`-D`) en vez de global es la recomendación oficial actual — evita el clásico "funciona en mi máquina" por versiones distintas de Wrangler entre desarrolladores.
- `wrangler tail` consume los logs en tiempo real desde que se ejecuta el comando — no muestra el historial previo, hay que tenerlo corriendo mientras se reproduce el problema.
- El paquete correcto hoy es `wrangler` a secas; `@cloudflare/wrangler` es el nombre de la v1, ya deprecada.
