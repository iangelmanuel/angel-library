---
title: CLAUDE.md — instrucciones de proyecto
description: Memoria persistente que Claude Code lee al arrancar — convenciones, comandos, arquitectura del proyecto.
category: skills
stack: claude-code
order: 1
tags: [ai, claude-code, memoria, config]
tool: Claude Code
updatedAt: 2026-08-17
---

## Dónde va

```text
CLAUDE.md              → raíz del proyecto, se commitea, todo el equipo lo comparte
CLAUDE.local.md         → raíz, gitignored, overrides personales
~/.claude/CLAUDE.md      → global, aplica a todos tus proyectos
```

Claude Code lo carga automáticamente al arrancar una sesión en ese directorio — no hace falta referenciarlo en ningún prompt.

## Plantilla base

```md title="CLAUDE.md"
# Mi Proyecto

## Comandos

\`\`\`bash
pnpm dev      # servidor de desarrollo
pnpm build    # build de producción
pnpm test     # tests
\`\`\`

## Arquitectura

- `src/api/` — endpoints REST
- `src/libs/` — lógica compartida
- Auth con JWT, ver `src/libs/auth.ts`

## Convenciones

- Componentes en PascalCase, un archivo por componente
- Nunca hardcodear secretos, siempre `.env`
- Tests obligatorios para lógica de negocio en `src/libs/`
```

## Importar otros archivos

```md title="CLAUDE.md"
Ver también @docs/api-conventions.md para las convenciones de la API.
```

`@ruta` importa el contenido de otro archivo dentro del contexto — útil para no repetir documentación que ya existe en otro lado del repo.

## Consideraciones

- Cuanto más corto y accionable, mejor — no es documentación para humanos, es contexto que se manda en cada mensaje. Evitar prosa larga.
- `CLAUDE.local.md` es el lugar para preferencias personales que no deben imponerse al resto del equipo, por ejemplo: “ejecutar siempre las pruebas con `--watch`”.
