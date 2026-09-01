---
title: Subagentes (multi-agente)
description: Definidos en TOML, no markdown — orquestación experimental con fan-out configurable.
type: skills
order: 3
tags: [ai, codex, agente]
tool: Codex CLI
updatedAt: 2026-08-17
---

A diferencia de Claude Code/Cursor/OpenCode (markdown + frontmatter), un subagente de Codex se define en **TOML**. La orquestación multi-agente todavía está marcada como experimental.

## Habilitar multi-agente

```toml title="config.toml"
[features]
multi_agent = true
```

O `/experimental` dentro de la sesión.

## Dónde va cada agente

```text
.codex/agents/code-reviewer.toml      → proyecto
~/.codex/agents/code-reviewer.toml     → personal
```

## Plantilla base

```toml title=".codex/agents/code-reviewer.toml"
name = "code-reviewer"
description = "Revisa cambios buscando bugs y riesgos de seguridad"
developer_instructions = """
Eres un revisor de código senior. Busca bugs, riesgos de seguridad
y problemas de legibilidad. No edites nada, solo reporta.
"""
model = "gpt-5.1-codex"
sandbox_mode = "read-only"
```

## Campos requeridos vs opcionales

| Campo | Requerido |
| --- | --- |
| `name` | Sí |
| `description` | Sí |
| `developer_instructions` | Sí |
| `model` | No — hereda el default si no se especifica |
| `reasoning_effort` | No |
| `sandbox_mode` | No |

## Controlar el fan-out

```toml title="config.toml"
[agents]
max_threads = 6                    # hilos concurrentes por sesión
max_depth = 1                       # un hijo puede spawnear, pero no recursivo
default_subagent_model = "gpt-5.1-codex"
```

## Resumen

| Ubicación | Formato |
| --- | --- |
| `.codex/agents/*.toml` | Proyecto |
| `~/.codex/agents/*.toml` | Personal |

## Consideraciones

- Cursor **también lee** `.codex/agents/` para su propio sistema de subagentes — pero el formato TOML no es markdown, así que esa compatibilidad cruzada no aplica aquí sin convertir el archivo.
- Al ser experimental, la superficie de config (`[agents]` en `config.toml`) es la más propensa a cambiar de las 4 herramientas documentadas en este sitio — confirmar contra la doc oficial antes de depender de algo avanzado aquí.
