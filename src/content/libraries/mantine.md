---
title: Mantine
description: Más de 100 componentes y hooks React, con theming y modo oscuro incorporados de fábrica.
category: ui-ux
stack: react
order: 5
tags: [react, components, hooks]
website: https://mantine.dev
github: https://github.com/mantinedev/mantine
install: npm install @mantine/core @mantine/hooks
technologies: [technologies/react]
updatedAt: 2026-08-17
---

Cubre casos que otras librerías dejan para paquetes aparte: fechas, notificaciones, dropzone, rich text editor, todos bajo el mismo sistema de theming.

## Configuración inicial

```tsx title="main.tsx"
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

<MantineProvider>
  <App />
</MantineProvider>;
```

Cada paquete extra (`@mantine/dates`, `@mantine/notifications`, etc.) trae su propio CSS que hay que importar aparte.

## Tips

- `@mantine/hooks` se puede usar solo, sin `@mantine/core`, como colección de hooks utilitarios (`useDisclosure`, `useDebouncedValue`).
- El modo oscuro es una prop del provider (`defaultColorScheme`), no requiere Tailwind ni clases `dark:`.
