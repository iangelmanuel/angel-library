---
title: supabase-postgres-best-practices
description: Patrones de Postgres específicos de Supabase — diseño de schema, RLS, indexing, performance de queries.
category: skills
stack: ia-skills
order: 13
tags: [ai, skill, supabase, database]
tool: Cross-tool
updatedAt: 2026-08-17
---

Se enfoca específicamente en la capa de base de datos de Supabase — cómo diseñar el schema, escribir políticas de Row Level Security correctas, indexar bien, y evitar queries lentas. Más profundo en esta parte puntual que el skill general de [supabase](/skills/skill-supabase).

## Instalar

```bash
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
```

## Fuente

[skills.sh](https://www.skills.sh) — supabase/agent-skills, oficial de Supabase.

## Cuándo usarlo

- Diseñando el schema de una tabla nueva y las políticas RLS que le corresponden — el punto donde más fácil es dejar un agujero de seguridad (ver la advertencia sobre RLS en las guías de esta biblioteca).
- Cuando una query específica anda lenta y hace falta indexar bien, no solo "agregar un índice a todo".

## Consideraciones

- Instalar junto al skill general [supabase](/skills/skill-supabase) — este es un complemento específico de la capa de datos, no un reemplazo.
