---
title: Cómo buscar más skills por tecnología
description: Para stacks específicos no cubiertos aquí (Astro, Express, Zod, tu librería puntual) — dónde buscar en vivo, el catálogo cambia rápido.
category: skills
stack: ia-skills
order: 10
tags: [ai, skill, general]
tool: Cross-tool
updatedAt: 2026-08-17
---

Los 9 skills listados en esta subcategoría son los que tenían suficiente tracción (instalaciones, mantenedor identificable) para confiar al momento de escribir esto — pero el catálogo de [skills.sh](https://www.skills.sh) crece rápido y cubre más tecnologías de las que se pueden listar aquí sin quedar desactualizado.

## Navegar por tema

```text
skills.sh/topic/react              → React
skills.sh/topic/nextjs              → Next.js
skills.sh/topic/testing              → Testing
skills.sh/topic/databases             → Bases de datos
skills.sh/topic/design                 → Diseño y UI
skills.sh/topic/mobile                  → Mobile
skills.sh/topic/agent-workflows          → Workflows de agentes
skills.sh/topic/marketing                 → Marketing
```

Para stacks de este proyecto sin un topic dedicado (Astro, Express, Git, Zod), buscar directo en [skills.sh](https://www.skills.sh) o usar el skill [find-skills](/skills/skill-find-skills), que busca por descripción de la tarea en vez de por categoría fija.

## Instalar cualquier skill que encuentres

```bash
npx skills add https://github.com/<owner>/<repo> --skill <nombre-del-skill>
```

Mismo comando para cualquier skill del catálogo — cambiar `<owner>/<repo>` y `<nombre-del-skill>` por los del que corresponda.

## Consideraciones

- Antes de instalar un skill de un mantenedor desconocido, revisar el repo — es código/prompts de terceros ejecutándose con el mismo nivel de confianza que el resto de tu sesión.
- Instalaciones altas (100K+) son una señal razonable de confiabilidad, pero no una garantía — mattpocock, vercel-labs, anthropics y prisma (los 9 listados aquí) son mantenedores identificables con historial público, lo que pesa más que solo el número.
