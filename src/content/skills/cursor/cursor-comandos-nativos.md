---
title: Comandos nativos (Cursor CLI) — cheat-sheet
description: Los 30+ comandos slash built-in de la terminal de Cursor, sin configurar nada.
type: skills
order: 9
tags: [ai, cursor, comando]
tool: Cursor
updatedAt: 2026-08-17
---

## Sesión y navegación

```text
/clear            → limpia el contexto
/resume            → retoma una sesión anterior
/fork               → bifurca la sesión actual
/rename             → renombra la sesión
/rewind              → vuelve a un punto anterior
/summarize            → resume la conversación
```

## Modelo y modo

```text
/model              → cambiar el modelo activo
/plan                → modo plan (solo lectura, para diseñar)
/ask                  → modo pregunta, sin ejecutar cambios
/debug                → modo debug
```

## Ejecución

```text
/shell (/sh, /run)     → correr un comando de shell
/run-everything (/auto-run) → ejecuta sin pedir confirmación en cada paso
```

## Inspección

```text
/logs                 → ver logs de la sesión
/about                 → info de la instalación
```

## Resumen

| Comando | Para qué |
| --- | --- |
| `/model` | Cambiar modelo |
| `/plan` | Modo solo-lectura para diseñar |
| `/shell` / `/sh` / `/run` | Correr shell |
| `/resume` / `/fork` | Gestión de sesiones |
| `/clear` | Contexto limpio |

## Consideraciones

- Esta lista es del **Cursor CLI** (terminal) — el IDE tiene su propio menú `/` con overlaps parciales pero no es exactamente el mismo set.
- Referencia completa y siempre actualizada: `cursor.com/docs/cli/reference/slash-commands`.
