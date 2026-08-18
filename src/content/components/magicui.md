---
title: Magic UI — Componentes disponibles
description: Animaciones y efectos vistosos (text, backgrounds, buttons) sobre el mismo esquema de instalación que shadcn/ui.
category: frontend
stack: react
order: 19
tags: [react, components, animation, ui]
framework: React
install: pnpm dlx shadcn@latest init
source: https://magicui.design/docs/components
related:
  - components/shadcn-ui
updatedAt: 2026-08-16
---

Magic UI es a los efectos vistosos lo que shadcn/ui es a los componentes base: mismo modelo (CLI que copia código fuente a tu proyecto, no una dependencia instalada), pero enfocado en animaciones — texto que se escribe solo, fondos animados, botones con efectos, no inputs/selects/tablas. Se instala literalmente con el mismo CLI de shadcn, apuntando al registro de Magic UI.

## Agregar un componente

```bash
pnpm dlx shadcn@latest add @magicui/globe
pnpm dlx shadcn@latest add @magicui/border-beam
```

El prefijo `@magicui/` en el nombre es lo que le dice al CLI de shadcn de qué registro traer el componente — el resto funciona exactamente igual que agregar un componente de shadcn normal.

## Componentes disponibles (por categoría)

- **Texto animado**: Typing Animation, Aurora Text, Number Ticker, Morphing Text, Spinning Text
- **Efectos especiales**: Animated Beam, Border Beam, Magic Card, Meteors, Confetti, Particles
- **Fondos**: Flickering Grid, Animated Grid Pattern, Dot Pattern, Light Rays
- **Botones**: Rainbow Button, Shimmer Button, Ripple Button
- **Mockups de dispositivo**: Safari, iPhone, Android (para mostrar capturas dentro de un marco)
- **Comunidad**: Shiny Button, File Tree, Cool Mode, Neon Gradient Card

Lista completa, siempre actualizada, en la [documentación oficial](https://magicui.design/docs/components).

## Resumen

| Comando | Qué hace |
| --- | --- |
| `pnpm dlx shadcn@latest init` | Configura el proyecto, si todavía no tiene shadcn (una sola vez) |
| `pnpm dlx shadcn@latest add @magicui/<componente>` | Copia ese componente a `src/components/` |

## Consideraciones

- No hace falta instalar nada de Magic UI aparte — si el proyecto ya corrió `shadcn init` (por ejemplo, para los componentes base), agregar uno de Magic UI es directamente el comando `add @magicui/...`.
- Son efectos pensados para landing pages y secciones puntuales de marketing — la mayoría no tiene sentido usarlos en una UI de aplicación/dashboard, son decorativos.
- Igual que shadcn, el código queda copiado en el proyecto: personalizarlo es editar el archivo directo, no hay props ocultas directamente librería externa.
