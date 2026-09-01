---
title: Design systems y tokens
description: Convertir decisiones visuales en tokens, componentes, estados y reglas que escalan sin perder coherencia.
type: guides
order: 1
tags: [design-system, tokens, components, ui]
scope: fundamentos de sistemas visuales
related:
  - ui-ux/ui-ux-interaccion/ui-ux-responsive-layout
  - ui-ux/ui-ux-interaccion/ui-ux-forms-feedback
updatedAt: 2026-08-25
---

## Capas

1. **Principios:** claridad, densidad, tono y accesibilidad.
2. **Tokens:** color, tipografía, espacio, radio, sombra y motion.
3. **Primitivas:** stack, grid, text, icon, surface.
4. **Componentes:** button, field, dialog, table.
5. **Patrones:** búsqueda, onboarding, checkout.

Tokens semánticos (`color-text-danger`) sobreviven mejor que nombres visuales (`red-500`) en el API del componente. El token base todavía puede mapear a una escala interna.

```css
:root {
  --color-purple-600: #7c3aed;
  --color-action-primary: var(--color-purple-600);
  --space-control-inline: 0.875rem;
}

[data-theme='dark'] {
  --color-action-primary: #facc15;
}
```

El componente consume intención; el tema decide el valor. No conviertas cada número en token: crea tokens cuando existe una decisión compartida que debe mantenerse coherente.

## API de componentes

Documenta propósito, contenido, variantes, estados, accesibilidad y cuándo no usarlo. Un componente no está completo sin hover, focus, disabled, loading, empty, error y contenido largo.

Evita un boolean por decisión visual (`compact`, `blue`, `rounded`, `shadow`). Diseña variantes con significado y composición para casos especiales.

## Gobierno

Define quién aprueba cambios, cómo se vuelve obsoleta una variante y cómo se mide la adopción. Versiona los cambios incompatibles y ofrece una migración. Un catálogo sin reglas termina duplicando componentes con nombres distintos.

## Documentar un componente

Incluye anatomía, contenido, variantes, estados, comportamiento responsive, teclado, nombre accesible y ejemplos de cuándo no usar. Prueba texto largo, traducción, error y loading junto al estado ideal.

## Adopción

Un sistema de diseño es producto interno. Mide componentes duplicados, uso de tokens, tiempo de entrega y problemas de accesibilidad. Una regla que nadie puede aplicar quizá necesita mejor API, codemod o documentación, no más control manual.
