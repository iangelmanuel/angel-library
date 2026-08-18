---
title: Ant Design
description: Sistema de diseño y componentes React orientado a aplicaciones empresariales, con tablas, formularios y layouts complejos listos.
category: ui-ux
stack: react
order: 7
tags: [react, components, enterprise]
website: https://ant.design
github: https://github.com/ant-design/ant-design
install: npm install antd
technologies: [technologies/react]
updatedAt: 2026-08-17
---

Fuerte en dashboards internos y back-offices: `Table` con paginación/orden/filtrado server-side, `Form` con validación integrada, y layouts de admin listos (`ProComponents`, paquete aparte).

## Configuración inicial

Desde la v5 no requiere importar CSS aparte (usa CSS-in-JS): alcanza con instalar e importar componentes.

```tsx
import { ConfigProvider, theme } from 'antd';

<ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
  <App />
</ConfigProvider>;
```

## Tips

- El idioma de los textos internos (paginación, date picker) se configura con `locale` en `ConfigProvider` — por defecto viene en inglés.
- Para dashboards completos, `@ant-design/pro-components` da layouts de admin ya armados sobre Ant Design.
