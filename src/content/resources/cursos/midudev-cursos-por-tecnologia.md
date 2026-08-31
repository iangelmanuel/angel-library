---
title: "Cursos de Midudev por tecnología"
description: "Catálogo de los cursos gratuitos de Miguel Ángel Durán en YouTube, con el formato real de cada uno: video o playlist."
category: courses
stack: cursos-midudev
order: 1
tags: [cursos, midudev, youtube, javascript, gratis, espanol]
url: https://www.youtube.com/@midudev
resourceCategory: learning
technologies: [technologies/nextjs]
personalNote: "Conviene mirar el formato antes de empezar: una playlist equivale a un curso de semanas y un video se resuelve en una tarde."
updatedAt: 2026-08-30
---

> Cursos de **Miguel Ángel Durán**, [Midudev](https://www.youtube.com/@midudev), publicados gratis en YouTube.

**Miguel Ángel Durán**, conocido como **Midudev**, es programador y una de las voces más seguidas de la comunidad hispanohablante de desarrollo. Emite en directo casi a diario en Twitch y YouTube, y de esos directos salen buena parte de los cursos que publica gratis en su canal.

Además de los cursos de esta tabla mantiene el bootcamp [JS Camp](/resources/cursos/midudev-jscamp-bootcamp), el curso interactivo [Aprende SQL](/resources/cursos/midudev-aprende-sql) y varios repositorios abiertos. Su comunidad se reúne en [Discord](https://discord.gg/midudev), donde se resuelven dudas y se comparten ofertas de trabajo.

## Fundamentos

| Tema | Formato | Enlace |
| --- | --- | --- |
| HTML | Video | [midu.link/html](https://www.midu.link/html) |
| CSS | **Playlist** | [midu.link/css](https://www.midu.link/css) |
| JavaScript | **Sitio web propio** | [aprendejavascript.dev](https://www.aprendejavascript.dev/) |
| TypeScript | **Playlist** | [midu.link/ts](https://www.midu.link/ts) |
| Git | Video | [midu.link/git](https://www.midu.link/git) |

## Frameworks y librerías

| Tema | Formato | Enlace |
| --- | --- | --- |
| React | **Playlist** | [midu.link/react](https://www.midu.link/react) |
| Next.js con App Router | **Playlist** | [ver playlist](https://www.youtube.com/playlist?list=PLUofhDIg_38poFpsV-xAbWUbW1urNmY_I) |
| Next.js con Pages Router | Video dentro de playlist | [midu.link/nextjs](https://www.midu.link/nextjs) |
| Astro | **Playlist** | [midu.link/astro](https://www.midu.link/astro) |
| Svelte | Video dentro de playlist | [midu.link/svelte](https://www.midu.link/svelte) |
| Angular | Video | [midu.link/angular](https://www.midu.link/angular) |
| Tailwind CSS | Video | [midu.link/tailwind](https://www.midu.link/tailwind) |

## Backend, datos e infraestructura

| Tema | Formato | Enlace |
| --- | --- | --- |
| Node.js | **Playlist** | [midu.link/node](https://www.midu.link/node) |
| SQL | **Curso interactivo** | [aprendesql.dev](https://www.aprendesql.dev/) |
| PHP | Video dentro de playlist | [midu.link/php](https://www.midu.link/php) |
| Docker | Video | [midu.link/docker](https://www.midu.link/docker) |
| AWS | Video | [midu.link/aws](https://www.midu.link/aws) |
| Cloudflare | Video | [midu.link/cloudflare](https://www.midu.link/cloudflare) |

## Inteligencia artificial

| Tema | Formato | Enlace |
| --- | --- | --- |
| MCP (Model Context Protocol) | Video | [midu.link/mcp](https://www.midu.link/mcp) |
| Términos de IA | Video | [midu.link/ai](https://www.midu.link/ai) |

## Cómo elegir

La diferencia entre **video** y **playlist** cambia por completo la planificación:

- Un **video** suele ser una sesión de una a cuatro horas. Varios son directos re-subidos tal cual a YouTube, así que conservan pausas y preguntas del chat; el reproductor a velocidad aumentada ayuda en esos casos.
- Una **playlist** agrupa decenas de clases y equivale a un curso completo de varias semanas.

## Los dos cursos de Next.js

Next.js aparece dos veces en la tabla y no es un error: son **dos cursos para
dos arquitecturas distintas**, no uno actualizado y otro viejo.

| Curso | Arquitectura | Cuándo mirarlo |
| --- | --- | --- |
| App Router | `app/` | Proyectos nuevos: Server Components por defecto, `layout.tsx`, Server Actions y streaming |
| Pages Router | `pages/` | Bases de código existentes: `getServerSideProps`, `getStaticProps`, `_app.tsx` |

Los dos enrutadores no son sintaxis distinta para lo mismo: cambian **dónde se
ejecuta el código**. En App Router un componente es de servidor salvo que lleve
`"use client"`; en Pages Router todo es de cliente y los datos se obtienen en
funciones aparte.

Confundirlos produce el error más común al empezar: usar `useState` en un
componente de servidor, o buscar `getServerSideProps` en un proyecto con `app/`.
Si el repositorio tiene carpeta `app/`, el primero; si tiene `pages/`, el segundo.
