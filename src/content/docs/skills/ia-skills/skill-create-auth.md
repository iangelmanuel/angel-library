---
title: create-auth — scaffolding de autenticación
description: Detecta tu framework (Astro, Express, Next.js...) y tu base de datos (Prisma, Drizzle, Mongo) y genera la config de auth correspondiente — de better-auth.
type: skills
order: 14
tags: [ai, skill, auth, better-auth]
tool: Cross-tool
related: [backend/express/express-better-auth]
updatedAt: 2026-08-17
---

Skill del equipo de better-auth que automatiza el scaffolding de autenticación — detecta el framework (Next.js, SvelteKit, Nuxt, Astro, Express, Hono) y la base de datos (Prisma, Drizzle, MongoDB) del proyecto, y genera configs de servidor/cliente, route handlers y migraciones ya adaptados. Soporta email/password, OAuth, magic links, passkeys, 2FA y SSO enterprise.

## Instalar

```bash
npx skills add https://github.com/better-auth/skills --skill create-auth
```

## Fuente

[skills.sh/better-auth/skills/create-auth](https://www.skills.sh/better-auth/skills/create-auth) — oficial de better-auth, 29.8K instalaciones.

## Cuándo usarlo

- Arrancando auth desde cero en cualquiera de los 4 frameworks documentados en esta biblioteca (Express, Astro, Next.js) con better-auth — este skill automatiza buena parte del setup que las guías de [better-auth en Express](/backend/express/express-better-auth)/[Astro](/backend/astro/astro-better-auth)/[Next.js](/backend/nextjs/nextjs-better-auth) explican paso a paso.
- Proyectos con requerimientos de auth más avanzados (SSO, 2FA, teams) donde escribir todo a mano sería mucho más lento.

## Consideraciones

- Genera código real (migraciones incluidas) — revisar lo que produce antes de aplicarlo a una base de datos con datos reales, igual que con cualquier scaffolding automático.
