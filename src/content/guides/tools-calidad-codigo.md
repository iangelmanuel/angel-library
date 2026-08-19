---
title: ESLint, Prettier y typecheck — responsabilidades y orden
description: Diseñar una canalización de calidad sin reglas duplicadas entre formato, análisis estático, tipos, pruebas y construcción.
category: tools
stack: tools-calidad
order: 1
tags: [eslint, prettier, typescript, lint, quality]
related:
  - guides/developer-tools-fundamentals
  - guides/tools-vscode-workspace
  - guides/cicd-pipeline-fundamentals
updatedAt: 2026-08-19
---

Estas herramientas detectan problemas distintos. Cuando se mezclan sus responsabilidades aparecen falsos positivos y configuraciones difíciles de mantener.

| Capa | Pregunta | Herramienta típica |
| --- | --- | --- |
| Formato | ¿El código tiene una representación consistente? | Prettier |
| Lint | ¿Hay patrones problemáticos o convenciones incumplidas? | ESLint |
| Tipos | ¿Los contratos estáticos son compatibles? | TypeScript |
| Pruebas | ¿El comportamiento observable es correcto? | Vitest / Playwright |
| Build | ¿Se puede producir el artefacto? | Vite / framework |

Prettier no comprueba reglas de negocio y TypeScript no valida datos externos en runtime. Una herramienta exitosa no reemplaza las demás.

## Scripts como interfaz única

```json title="package.json"
{
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm test"
  }
}
```

El editor, un hook local y CI deben llamar estos scripts. CI es la autoridad porque se ejecuta en un entorno limpio; el hook ofrece retroalimentación rápida, pero se puede omitir y no debe ser el único control.

## Evitar conflictos

- Usa una configuración que desactive reglas estilísticas de ESLint cubiertas por Prettier.
- Mantén pocas reglas propias y documenta la razón.
- Aplica reglas con información de tipos solo donde su costo sea justificable.
- Ignora `dist`, cobertura, archivos generados y dependencias.
- Fija versiones mediante el lockfile y revisa actualizaciones.

## Severidad y deuda existente

No conviertas cientos de avisos heredados en errores de una vez. Establece una línea base, corrige por zonas y evita introducir deuda nueva. Una excepción local debe explicar por qué:

```ts
// La librería externa exige una promesa sin await; el callback se registra.
// eslint-disable-next-line @typescript-eslint/no-misused-promises
button.addEventListener('click', async () => save());
```

## Referencias

- [ESLint: configuración](https://eslint.org/docs/latest/use/configure/)
- [Prettier: integración con linters](https://prettier.io/docs/integrating-with-linters)
- [Prettier: integración con editores](https://prettier.io/docs/editors)

