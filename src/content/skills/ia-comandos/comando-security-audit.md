---
title: /security-audit — auditoría rápida de seguridad
description: Busca los problemas de seguridad más comunes — secretos hardcodeados, inputs sin validar, dependencias vulnerables.
type: skills
order: 10
tags: [ai, comando, seguridad]
tool: Cross-tool
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/security-audit.md"
---
description: Quick security audit of the current code
allowed-tools: Grep, Read, Bash(npm audit:*), Bash(pnpm audit:*)
---

Review the project looking for:

1. **Hardcoded secrets** — API keys, tokens, passwords in code instead of environment variables (search for patterns like `api_key = "..."`, `sk-...`, `Bearer ...`)
2. **Unvalidated input** — request/form data used directly without going through a validation schema
3. **Injection** — SQL queries built with string concatenation instead of parameters, `exec()`/`eval()` with external input
4. **Vulnerable dependencies** — run `npm audit` (or `pnpm audit`) and summarize high/critical severity findings
5. **CORS/headers** — overly permissive CORS config (`origin: '*'` combined with `credentials: true`)

Report each finding with file, line, and a concrete fix suggestion. Don't apply changes, just report.
```

## Resumen

| Dónde | Archivo |
| --- | --- |
| Claude Code | `.claude/commands/security-audit.md` |
| Cursor | `.cursor/commands/security-audit.md` |

## Consideraciones

- No reemplaza un audit de seguridad profesional ni un scanner dedicado (Snyk, Semgrep) — es un primer paso rápido, bueno para atrapar lo obvio antes de un PR.
- `npm audit`/`pnpm audit` solo cubre dependencias con CVE conocido — no detecta lógica de negocio insegura, que es lo que cubren los puntos 1-3.
