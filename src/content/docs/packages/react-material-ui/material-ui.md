---
title: Material UI (MUI)
description: Implementación en React de Material Design, con amplio ecosistema (Joy UI, Base UI, X) y theming.
tags: [react, components, material-design]
sidebar:
  order: 6
draft: false
resourceCategory: Documentación del paquete
website: https://mui.com
github: https://github.com/mui/material-ui
technologies: [frontend/react/react]
updatedAt: 2026-08-17
---

La opción más "enterprise" del ecosistema React: componentes maduros, tablas y date pickers avanzados en `@mui/x` (parte de pago), y años de estabilidad.

## Instalación

```bash
pnpm add @mui/material @emotion/react @emotion/styled
```

## Configuración inicial

Fuente Roboto e iconos son paquetes aparte:

```bash
npm install @fontsource/roboto @mui/icons-material
```

Theming opcional con `ThemeProvider`:

```tsx title="main.tsx"
import { ThemeProvider, createTheme } from "@mui/material/styles"

const theme = createTheme({ palette: { mode: "dark" } })

;<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## Tips

- Si el proyecto ya usa Tailwind, hay conflictos de reset CSS (`preflight`) que suele haber que desactivar para uno de los dos.
- `Base UI` (del mismo equipo) es la alternativa sin estilos de Material Design, para theming completamente propio.
