---
title: Validar en las fronteras del sistema
description: Valida datos cuando entran o salen de una frontera, en lugar de confiar en tipos internos o datos externos.
category: architecture
stack: principios
order: 7
practice: Validar requests, formularios, variables de entorno y respuestas de terceros antes de usarlas.
why: Los tipos de TypeScript desaparecen en runtime y las fronteras reciben datos que no controlamos.
related:
  - libraries/zod
updatedAt: 2026-08-15
---

## Fronteras típicas

```text
request HTTP → schema → lógica de negocio
FormData     → schema → valores tipados
env vars     → schema → configuración
API externa  → schema → UI o persistencia
```

El objetivo no es validar cada variable interna, sino establecer límites claros y confiables.
