---
title: Design systems y tokens
description: Convertir decisiones visuales en tokens, componentes, estados y reglas que escalan sin perder coherencia.
category: ui-ux
stack: ui-ux-design-systems
order: 1
tags: [design-system, tokens, components, ui]
scope: fundamentos de sistemas visuales
related:
  - guides/ui-ux-responsive-layout
  - guides/ui-ux-forms-feedback
updatedAt: 2026-08-18
---

## Capas

1. **Principios:** claridad, densidad, tono y accesibilidad.
2. **Tokens:** color, tipografía, espacio, radio, sombra y motion.
3. **Primitivas:** stack, grid, text, icon, surface.
4. **Componentes:** button, field, dialog, table.
5. **Patrones:** búsqueda, onboarding, checkout.

Tokens semánticos (`color-text-danger`) sobreviven mejor que nombres visuales (`red-500`) en el API del componente. El token base todavía puede mapear a una escala interna.

## API de componentes

Documenta propósito, contenido, variantes, estados, accesibilidad y cuándo no usarlo. Un componente no está completo sin hover, focus, disabled, loading, empty, error y contenido largo.

Evita un boolean por decisión visual (`compact`, `blue`, `rounded`, `shadow`). Diseña variantes con significado y composición para casos especiales.

## Gobierno

Define quién aprueba cambios, cómo se vuelve obsoleta una variante y cómo se mide la adopción. Versiona los cambios incompatibles y ofrece una migración. Un catálogo sin reglas termina duplicando componentes con nombres distintos.
