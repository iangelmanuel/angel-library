---
title: Magic UI
description: Componentes React animados con Framer Motion, construidos sobre shadcn/ui y Tailwind CSS, pensados para landing pages.
category: ui-ux
stack: react
order: 3
tags: [react, tailwindcss, animations, components]
website: https://magicui.design
github: https://github.com/magicuidesign/magicui
install: npx shadcn@latest add "https://magicui.design/r/[component].json"
technologies: [technologies/react]
updatedAt: 2026-08-17
related: [libraries/shadcn-ui]
---

Se instala igual que shadcn/ui (registro compatible con el mismo CLI): copia el código del componente al proyecto en vez de agregar una dependencia npm. Requiere shadcn/ui ya inicializado (`components.json`, Tailwind configurado).

## Configuración inicial

No hay setup propio más allá de tener shadcn/ui listo. Cada componente trae su propia URL de registro, visible en la página de docs del componente (ej. `marquee`, `animated-beam`, `bento-grid`).

```bash
npx shadcn@latest add "https://magicui.design/r/marquee.json"
```

## Tips

- Pensado para secciones de marketing (hero, pricing, testimonios), no para UI de aplicación — mezclarlo con shadcn/ui puro para el resto.
- Varios componentes dependen de `framer-motion`; el CLI lo agrega solo si falta.
