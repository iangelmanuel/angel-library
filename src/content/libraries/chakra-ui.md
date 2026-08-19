---
title: Chakra UI
description: Componentes React accesibles con sistema de estilos por props y theming, sin depender de Tailwind.
category: ui-ux
stack: ui-react
order: 4
tags: [react, components, accessibility]
website: https://www.chakra-ui.com
github: https://github.com/chakra-ui/chakra-ui
install: npm install @chakra-ui/react @emotion/react
technologies: [technologies/react]
updatedAt: 2026-08-17
---

Estilos vía props (`<Box p={4} bg="gray.100">`) en vez de clases utilitarias — no necesita Tailwind ni convive mal con él si ya está en el proyecto.

## Configuración inicial

```tsx title="main.tsx"
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

<ChakraProvider value={defaultSystem}>
  <App />
</ChakraProvider>;
```

Snippets de componentes compuestos (ej. `toaster`, `color-mode`) se agregan con su propio CLI:

```bash
npx @chakra-ui/cli snippet add
```

## Tips

- El sistema de theming (v3) usa tokens semánticos (`colorPalette`) en vez de sobrescribir CSS.
- Buena opción cuando el equipo prefiere props tipadas a memorizar clases de utilidad.
