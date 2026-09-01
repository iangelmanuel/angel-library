---
title: MCP — conectar servidores externos
description: config.toml, con más control fino por tool (approval_mode individual) que las otras 3 herramientas.
type: skills
order: 6
tags: [ai, codex, mcp]
tool: Codex CLI
updatedAt: 2026-08-17
---

## Configurar en `config.toml`

```toml title="~/.codex/config.toml"
[mcp_servers.github]
command = "npx"
args = ["@modelcontextprotocol/server-github"]
env = { GITHUB_TOKEN = "${GITHUB_TOKEN}" }

[mcp_servers.linear]
url = "https://mcp.linear.app/mcp"
auth = "oauth"
```

`.codex/config.toml` a nivel de proyecto solo se carga si el proyecto es "trusted".

## Servidor local (stdio) vs remoto

| Tipo   | Campos                                                                     |
| ------ | -------------------------------------------------------------------------- |
| Local  | `command`, `args`, `cwd`, `env`, `startup_timeout_sec`, `tool_timeout_sec` |
| Remoto | `url`, `bearer_token_env_var`, `http_headers`, `auth = "oauth"`, `scopes`  |

## Control fino por tool

```toml
[mcp_servers.github]
enabled_tools = ["create_issue", "list_repos"]
disabled_tools = ["delete_repo"]

[mcp_servers.github.tools.delete_repo]
approval_mode = "always"
```

Nivel de detalle que ninguna de las otras 3 herramientas documentadas aquí ofrece — permite, por ejemplo, que un servidor esté disponible pero una tool puntual (`delete_repo`) siempre pida aprobación explícita.

## Resumen

| Campo                              | Para qué                                         |
| ---------------------------------- | ------------------------------------------------ |
| `[mcp_servers.<id>]`               | Un servidor, local o remoto según los campos     |
| `enabled_tools` / `disabled_tools` | Filtrar qué tools del servidor están disponibles |
| `[mcp_servers.<id>.tools.<tool>]`  | Override de aprobación por tool individual       |

## Consideraciones

- `.codex/config.toml` de proyecto necesita que el proyecto esté marcado como trusted para cargarse — un repo recién clonado no confía en su propio MCP config hasta que el usuario lo aprueba.
