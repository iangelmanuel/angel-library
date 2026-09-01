---
title: config.toml — referencia rápida
description: Un archivo único con más de 85 propiedades documentadas — sandbox, approval, modelo, telemetría, todo junto.
type: skills
order: 7
tags: [ai, codex, config]
tool: Codex CLI
updatedAt: 2026-08-17
---

A diferencia de Cursor (varios archivos chicos) o Claude Code (`settings.json` por scope), Codex concentra casi toda su configuración en **un solo archivo TOML** — grande, pero todo en un lugar.

## Dónde va

```text
~/.codex/config.toml              → global
.codex/config.toml                 → proyecto (solo si es "trusted")
$CODEX_HOME/<perfil>.config.toml    → perfiles alternativos, con --profile <nombre>
```

## Las secciones que más se usan

```toml title="~/.codex/config.toml"
model = "gpt-5.1-codex"
model_reasoning_effort = "medium"    # minimal | low | medium | high | xhigh

sandbox_mode = "workspace-write"      # read-only | workspace-write | danger-full-access
approval_policy = "on-request"         # untrusted | on-request | never

[features]
multi_agent = true
hooks = true
web_search = true

[shell_environment_policy]
inherit = "core"                        # all | core | none

notify = "scripts/notificar.sh"          # comando que recibe eventos como JSON
```

## Sandbox y aprobación — la parte más importante para seguridad

| Opción | Valores | Qué controla |
| --- | --- | --- |
| `sandbox_mode` | `read-only` / `workspace-write` / `danger-full-access` | Qué puede tocar el sistema de archivos |
| `approval_policy` | `untrusted` / `on-request` / `never` | Cuándo pide confirmación antes de actuar |
| `default_permissions` | `:read-only` / `:workspace` / `:danger-full-access` / custom | Perfil de permisos nombrado |

## Otras secciones documentadas

```text
[model_providers.<id>]        → providers custom (base_url, env_key, headers)
[otel]                          → exportador de OpenTelemetry
[tui]                            → keymap, theme, vim_mode, status_line
history.persistence              → save-all | none
```

## Resumen

| Sección | Para qué |
| --- | --- |
| `model` / `model_reasoning_effort` | Qué modelo y cuánto razona |
| `sandbox_mode` / `approval_policy` | Seguridad — qué puede hacer sin preguntar |
| `[features]` | Prender/apagar funcionalidades (multi_agent, hooks, web_search...) |
| `[mcp_servers.*]` | Ver [MCP](/skills/codex/codex-mcp) |
| `notify` | Comando externo que recibe eventos de la sesión |

## Consideraciones

- Es la superficie de config más grande de las 4 herramientas (85+ propiedades documentadas) — no memorizar todo, esta página cubre lo que realmente se toca seguido.
- Varios campos (`features.memories`, `multi_agent`, `hooks`) son adiciones de 2026 — confirmar contra la doc oficial (`developers.openai.com/codex/config-reference`) antes de depender de algo que no esté en esta lista.
- `sandbox_mode: "danger-full-access"` hace exactamente lo que dice — usar solo en un entorno descartable, nunca como default en una máquina con datos reales.
