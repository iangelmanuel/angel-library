---
title: Referencias entre contenidos
description: Convención para enlazar entradas sin depender de ids globales ambiguos.
category: tools
stack: tools-documentacion
order: 3
technologies: []
libraries: []
related:
  - technologies/react
  - libraries/zod
updatedAt: 2026-08-15
---

## Convención

Usa siempre `colección/id`:

```yaml
related:
  - technologies/react
  - libraries/zod
  - recipes/react-hook-form-zod
```

Esto evita ambigüedades si en el futuro existen entradas con el mismo slug en colecciones diferentes.

## Regla

Una integración debe enlazar a sus miembros y explicar solamente lo específico de la combinación. La documentación común permanece en la entrada principal de cada tecnología o librería.
