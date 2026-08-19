---
title: HeroUI (antes NextUI)
description: Componentes React sobre Tailwind CSS y React Aria, con animaciones de Framer Motion y foco en accesibilidad.
category: ui-ux
stack: ui-react
order: 2
tags: [react, tailwindcss, components, accessibility]
website: https://www.heroui.com
github: https://github.com/heroui-inc/heroui
install: npm install @heroui/react framer-motion
technologies: [technologies/react]
updatedAt: 2026-08-17
related: [libraries/shadcn-ui]
---

Se renombró de NextUI a HeroUI en 2024 (mismo equipo, mismo proyecto). A diferencia de shadcn/ui, sí es un paquete npm normal: se instala y se importa, no se copia código.

## Configuración inicial

1. Agregar el plugin de Tailwind en `tailwind.config`:

```ts title="tailwind.config.ts"
import { heroui } from '@heroui/react';

export default {
  content: ['./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'],
  plugins: [heroui()],
};
```

2. Envolver la app en el provider:

```tsx title="main.tsx"
import { HeroUIProvider } from '@heroui/react';

<HeroUIProvider>
  <App />
</HeroUIProvider>;
```

## Tips

- `disableAnimation` en el provider si `framer-motion` no hace falta (bundle más chico).
- El theming (colores, radios) se define en el plugin de Tailwind, no con CSS variables sueltas.
