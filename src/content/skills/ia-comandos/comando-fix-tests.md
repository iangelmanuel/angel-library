---
title: /fix-tests — correr y arreglar tests fallidos
description: Corre el test runner, lee las fallas, y arregla el código o el test según corresponda.
type: skills
order: 7
tags: [ai, comando, testing]
tool: Cross-tool
updatedAt: 2026-08-17
---

## Copiar y pegar

```md title=".claude/commands/fix-tests.md"
---
description: Run the tests, fix the failures
allowed-tools: Bash(npm test:*), Bash(pnpm test:*), Read, Edit
---

1. Run the project's test suite
2. For each failing test, read the error and the related code
3. Decide whether the bug is in the code (fix the code) or in the test (fix the test, only if the test is poorly written, never to make a real bug pass)
4. Apply the minimal fix needed
5. Re-run the tests to confirm

If a test fails for a reason you don't understand (external dependency, flaky), don't touch it — report it instead of guessing.
```

## Resumen

| Dónde       | Archivo                         |
| ----------- | ------------------------------- |
| Claude Code | `.claude/commands/fix-tests.md` |
| Cursor      | `.cursor/commands/fix-tests.md` |

## Consideraciones

- El paso 3 es el que más importa: un test que falla porque encontró un bug real no debería "arreglarse" cambiando el test — eso es ocultar el problema, no resolverlo. El prompt lo deja explícito a propósito.
- Para proyectos con test runner distinto a npm/pnpm (Vitest standalone, pytest, etc.), ajustar `allowed-tools` al comando real.
