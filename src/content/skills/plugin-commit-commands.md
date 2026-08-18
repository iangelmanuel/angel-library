---
title: Commit Commands — plugin oficial de Claude Code
description: Comandos de commit ya armados, sin copiar el archivo de comando a mano.
category: skills
stack: ia-plugins
order: 3
tags: [ai, plugin, git]
tool: Claude Code
updatedAt: 2026-08-17
---

Plugin oficial que trae comandos de commit listos — mismo objetivo que el [comando /commit](/skills/comando-commit) de esta biblioteca, empaquetado como plugin instalable en vez de copiar el archivo a mano.

## Instalar

Ver `claude.com/plugins/commit-commands` para el nombre exacto del marketplace vigente, o instalar directo desde el marketplace oficial:

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin install commit-commands@claude-plugins-official
```

## Cuándo preferirlo sobre copiar el comando a mano

- Si el equipo ya usa varios plugins del marketplace oficial y prefieres mantener todo instalado de forma consistente, en vez de mezclar comandos copiados a mano con plugins instalados.
- Actualizaciones: un plugin se actualiza con el marketplace; un archivo copiado a mano no.

## Consideraciones

- Funcionalmente equivalente al comando de esta biblioteca — la diferencia es de distribución/mantenimiento, no de resultado.
