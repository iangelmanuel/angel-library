---
title: tdd — desarrollo guiado por tests
description: Fuerza el ciclo red-green-refactor — escribir el test que falla antes que el código que lo hace pasar.
type: skills
order: 4
tags: [ai, skill, testing, tdd]
tool: Cross-tool
updatedAt: 2026-08-17
---

Guía al agente por el ciclo clásico de TDD: escribir un test que falla, escribir el código mínimo para que pase, refactorizar — en ese orden, en vez de escribir la implementación primero y los tests después (o no escribirlos).

## Instalar

```bash
npx skills add https://github.com/mattpocock/skills --skill tdd
```

## Fuente

[skills.sh/mattpocock/skills/tdd](https://www.skills.sh/mattpocock/skills/tdd) — mattpocock, 694K+ instalaciones.

## Cuándo usarlo

- Lógica de negocio con reglas claras (validaciones, cálculos, transformaciones de datos) — donde escribir el test primero ayuda a pensar los casos borde antes de programar.
- Bugfixes: escribir primero el test que reproduce el bug, después arreglarlo — confirma que el fix realmente resuelve el problema.

## Consideraciones

- No es el approach correcto para todo — para UI muy exploratoria donde el diseño cambia rápido, TDD estricto puede frenar más de lo que ayuda. Usarlo donde el comportamiento esperado ya está claro.
