---
title: "Skeuomorphism"
description: "Interfaces que imitan objetos reales: texturas, relieve y sombras proyectadas para que un control se entienda sin explicación."
type: guides
order: 2
tags: [ui, diseño, estilos, skeuomorphism, css]
related:
  - ui-ux/ui-ux-estilos/ui-ux-estilos-visuales
updatedAt: 2026-08-30
---

El **skeuomorfismo** copia la apariencia de un objeto físico para que el usuario sepa qué hacer con él sin instrucciones: un botón que parece un botón real, una libreta con textura de papel, un interruptor con brillo metálico.

Fue el lenguaje dominante de iOS hasta iOS 6, y volvió parcialmente porque las interfaces completamente planas dejaron dudas sobre qué era interactivo.

## Cómo se ve

<div style="border:1px solid rgba(255,255,255,.1); border-radius:8px; padding:2rem; background:linear-gradient(180deg,#2a2622,#1c1916); display:flex; gap:1.25rem; align-items:center; justify-content:center; flex-wrap:wrap; margin:1.5rem 0;">
  <span style="display:inline-block; padding:.85rem 1.75rem; font-family:ui-sans-serif,system-ui,sans-serif; font-size:.9rem; font-weight:600; color:#3a2f22; background:linear-gradient(180deg,#f6d992,#d8ad5c); border:1px solid #8a6b33; border-radius:10px; box-shadow:inset 0 1px 0 rgba(255,255,255,.75), inset 0 -2px 4px rgba(0,0,0,.25), 0 4px 8px rgba(0,0,0,.45); text-shadow:0 1px 0 rgba(255,255,255,.4);">Guardar</span>
  <span style="display:inline-block; padding:.85rem 1.75rem; font-family:ui-sans-serif,system-ui,sans-serif; font-size:.9rem; font-weight:600; color:#1f2937; background:linear-gradient(180deg,#e8eaed,#b9bec7); border:1px solid #8b919b; border-radius:10px; box-shadow:inset 0 1px 0 rgba(255,255,255,.9), inset 0 -2px 4px rgba(0,0,0,.18), 0 4px 8px rgba(0,0,0,.4); text-shadow:0 1px 0 rgba(255,255,255,.6);">Cancelar</span>
</div>

## El CSS

Tres capas hacen todo el trabajo: un degradado que simula la luz cayendo desde arriba, un brillo interior en el borde superior y una sombra proyectada debajo.

```css title="src/styles/skeuomorphism.css"
.boton-skeuo {
  padding: 0.85rem 1.75rem;
  color: #1f2937;
  background: linear-gradient(180deg, #e8eaed, #b9bec7);
  border: 1px solid #8b919b;
  border-radius: 10px;
  text-shadow: 0 1px 0 rgb(255 255 255 / 0.6);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.9),
    inset 0 -2px 4px rgb(0 0 0 / 0.18),
    0 4px 8px rgb(0 0 0 / 0.4);
}

.boton-skeuo:active {
  /* Al presionar, la luz se invierte: el objeto se hunde. */
  background: linear-gradient(180deg, #b9bec7, #e8eaed);
  box-shadow:
    inset 0 2px 6px rgb(0 0 0 / 0.3),
    0 1px 2px rgb(0 0 0 / 0.3);
  transform: translateY(1px);
}
```

La clave está en el `:active`. Un botón skeuomórfico que no se hunde al presionarlo pierde justo la propiedad que justificaba el estilo.

## Cuándo usarlo

- **Sí** en interfaces que imitan una herramienta física real: mesas de mezclas, editores de audio, simuladores, calculadoras.
- **Sí** cuando el público no es experto en tecnología y necesita pistas fuertes de qué se puede tocar.
- **No** en productos con mucha densidad de datos: cada botón texturizado compite por atención.
- **No** si el equipo no puede mantenerlo. Es el estilo más caro: cada componente nuevo necesita trabajo gráfico específico.

## Accesibilidad

- Verifica el contraste del **texto sobre el degradado**, no sobre un color plano. La zona más clara del degradado suele ser la que falla.
- El `text-shadow` claro sobre fondo claro reduce la nitidez real de la letra; a tamaños pequeños conviene quitarlo.
- El relieve no sustituye al estado de foco: `:focus-visible` necesita su propio anillo visible.

```css title="src/styles/skeuomorphism.css"
.boton-skeuo:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```
