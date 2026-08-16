---
title: shadcn/ui — Componentes disponibles
description: No es una librería instalable, es CLI + código propio — qué componentes tiene y cómo agregarlos.
category: frontend
stack: react
order: 18
tags: [react, components, ui]
framework: React
install: pnpm dlx shadcn@latest init
source: https://ui.shadcn.com/docs/components
related:
  - components/shadcn-dialog
updatedAt: 2026-08-16
---

shadcn/ui **no se instala como dependencia** (`npm install shadcn` no existe para usar los componentes en sí) — es una CLI que copia el código fuente de cada componente directo a tu proyecto (`src/components/ui/`). Una vez copiado, es código tuyo: lo editás, le sacás lo que no usás, no depende de actualizar un paquete externo. Por debajo usa Radix UI (accesibilidad) + Tailwind (estilos). El paquete se llama `shadcn` — `shadcn-ui` es el nombre viejo, ya no se usa.

## Inicializar en un proyecto

```bash
pnpm dlx shadcn@latest init
```

Pregunta por el estilo (`new-york` o `default`), el color base y dónde vive tu config de Tailwind — genera `components.json` con esas respuestas (este mismo sitio tiene uno, ver la raíz del repo).

## Agregar un componente

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog card dropdown-menu
```

Cada comando copia el componente (y sus dependencias de Radix si hacen falta) a `src/components/ui/`.

## Componentes disponibles (por categoría)

- **Formulario**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Form
- **Layout**: Card, Sheet, Drawer, Tabs, Accordion, Separator, Sidebar, Resizable
- **Feedback**: Alert, Toast (Sonner), Dialog, Popover, Tooltip, Progress, Skeleton
- **Datos**: Table, Data Table, Pagination, Badge, Avatar, Calendar, Date Picker, Combobox
- **Navegación**: Breadcrumb, Menubar, Navigation Menu, Dropdown Menu, Command (usado en este sitio para el buscador)

Lista completa, siempre actualizada, en la [documentación oficial](https://ui.shadcn.com/docs/components).

## Resumen

| Comando | Qué hace |
| --- | --- |
| `pnpm dlx shadcn@latest init` | Configura el proyecto (una sola vez) |
| `pnpm dlx shadcn@latest add <componente>` | Copia ese componente a `src/components/ui/` |
| `pnpm dlx shadcn@latest add <c1> <c2>` | Varios de una |

## Consideraciones

- Al ser código copiado y no una dependencia, actualizar un componente a una versión nueva de shadcn es manual: volver a correr `add` sobre ese componente pisa tus cambios, así que si lo personalizaste, hay que mergear a mano.
- Requiere Tailwind ya configurado en el proyecto — el `init` lo detecta pero no lo instala si falta.
- Este mismo sitio usa varios (`Dialog`, `Command`) — ver `src/components/ui/` en el repo, y [Dialog reutilizable con shadcn/ui](/components/shadcn-dialog) para un ejemplo puntual ya documentado acá.
