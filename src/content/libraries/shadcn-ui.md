---
title: shadcn/ui
description: Componentes React sobre Radix UI y Tailwind CSS que se copian al proyecto en vez de instalarse como dependencia.
category: ui-ux
stack: ui-react
order: 1
tags: [react, tailwindcss, radix, components]
website: https://ui.shadcn.com
github: https://github.com/shadcn-ui/ui
install: npx shadcn@latest init
technologies: [technologies/react]
updatedAt: 2026-08-17
---

No es una librería npm tradicional: el CLI copia el código fuente de cada componente dentro de `src/components/ui`, así que queda editable como propio en vez de vivir en `node_modules`. Por debajo usa primitivas de Radix UI (accesibilidad, foco, teclado) y clases de Tailwind.

## Configuración inicial

`init` crea `components.json` (rutas, alias, estilo elegido) y ajusta el `tailwind.config` / `globals.css` con las variables de color del tema. Requiere Tailwind CSS ya configurado en el proyecto.

Después, cada componente se agrega uno a uno:

```bash
npx shadcn@latest add button dialog dropdown-menu
```

## Tips

- El alias `@/components/ui` viene de `components.json`, no de magia — si se mueve la carpeta hay que actualizarlo ahí.
- `npx shadcn@latest diff button` muestra si un componente quedó desactualizado respecto al registro oficial.
- Magic UI y otras librerías de "registro" (bloques copiables) se instalan con este mismo CLI apuntando a su URL.
