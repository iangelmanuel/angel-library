---
title: useToggle
description: Hook mínimo para manejar estados booleanos sin repetir handlers de activar, desactivar y alternar.
category: frontend
framework: React
language: typescript
parameters:
  - "initialValue: boolean"
returns: '[value, toggle, setTrue, setFalse]'
related:
  - technologies/react
  - snippets/use-debounce
updatedAt: 2026-08-15
---

## Código

```tsx title="hooks/useToggle.ts"
import { useCallback, useState } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((current) => !current), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}
```

## Uso

```tsx
const modal = useToggle();

<button onClick={modal.toggle}>Abrir / cerrar</button>
{modal.value && <Modal onClose={modal.setFalse} />}
```

Úsalo para modales, menús, accordions y estados de UI binarios. No lo uses para estados con más de dos estados posibles.
