---
title: "Estilos visuales de interfaz: panorama y cómo elegir"
description: "Skeuomorphism, neumorphism, glassmorphism, claymorphism, minimalism, maximalism, brutalism, Liquid Glass y Spatial UI comparados, con criterios para decidir."
type: guides
order: 1
tags: [ui, diseño, estilos, tendencias, accesibilidad]
updatedAt: 2026-08-30
---

Un **estilo visual** no es un sistema de diseño. El sistema define tokens, componentes y reglas; el estilo decide cómo se ven: cuánta profundidad hay, si los bordes existen, si el fondo se transparenta, cuánto contraste hay entre una superficie y la siguiente.

Elegir estilo es una decisión de producto, no de gusto: condiciona legibilidad, accesibilidad y cuánto cuesta mantener la interfaz.

## Los nueve, en una tabla

| Estilo | Idea central | Fuerte en | Riesgo principal |
| --- | --- | --- | --- |
| [Skeuomorphism](/ui-ux/ui-ux-estilos/ui-ux-estilo-skeuomorphism) | Imitar objetos reales | Enseñar una interfaz nueva | Envejece rápido, pesa mucho |
| [Neumorphism](/ui-ux/ui-ux-estilos/ui-ux-estilo-neumorphism) | Elementos extruidos del fondo | Paneles suaves, sensación táctil | Contraste casi siempre insuficiente |
| [Glassmorphism](/ui-ux/ui-ux-estilos/ui-ux-estilo-glassmorphism) | Vidrio esmerilado sobre el fondo | Jerarquía de capas | Texto ilegible según el fondo |
| [Claymorphism](/ui-ux/ui-ux-estilos/ui-ux-estilo-claymorphism) | Formas infladas tipo plastilina | Productos amables, ilustrados | Se percibe como poco serio |
| [Minimalism](/ui-ux/ui-ux-estilos/ui-ux-estilo-minimalism) | Quitar hasta lo esencial | Lectura, foco, rendimiento | Ambigüedad: se pierde el qué es cliqueable |
| [Maximalism](/ui-ux/ui-ux-estilos/ui-ux-estilo-maximalism) | Abundancia deliberada | Marca, memorabilidad | Ruido y carga cognitiva |
| [Brutalism](/ui-ux/ui-ux-estilos/ui-ux-estilo-brutalism) | Mostrar el material crudo | Portafolios, identidad fuerte | Se confunde descuido con estilo |
| [Liquid Glass](/ui-ux/ui-ux-estilos/ui-ux-estilo-liquid-glass) | Vidrio con refracción y movimiento | Apps del ecosistema Apple | Costo de GPU, dependencia de plataforma |
| [Spatial UI](/ui-ux/ui-ux-estilos/ui-ux-estilo-spatial-ui) | Interfaz en un espacio 3D | Visores y realidad mixta | Fatiga, ergonomía, público reducido |

## Cómo se relacionan

No son nueve ideas independientes. Hay dos ejes que explican casi todo:

**Cuánta profundidad simula la interfaz.** De más a menos: skeuomorphism → claymorphism → neumorphism → glassmorphism → minimalism → brutalism. Spatial UI rompe el eje porque la profundidad deja de ser simulada y pasa a ser real.

**Cuánto ruido acepta.** Minimalism y maximalism son los extremos declarados; brutalism es maximalista en actitud pero minimalista en recursos.

Glassmorphism y Liquid Glass son parientes: los dos difuminan el fondo. La diferencia es que el segundo añade refracción, respuesta al movimiento y adaptación al contenido de debajo, y viene definido por un fabricante en vez de ser una técnica suelta de CSS.

## Cómo elegir

Cuatro preguntas resuelven casi siempre la decisión:

1. **¿Qué hace el usuario aquí?** Si la tarea es leer o comparar datos durante mucho rato, cualquier estilo con textura o transparencia estorba. Minimalism gana en tableros, formularios largos y documentación.
2. **¿Qué tan predecible tiene que ser?** Un banco no puede permitirse que la gente dude de qué es un botón. Eso descarta neumorphism casi por definición.
3. **¿Compites por atención o por confianza?** Marca personal, portafolio o producto de nicho pueden pagar el precio de maximalism o brutalism. Una herramienta de trabajo, no.
4. **¿Dónde corre?** Los desenfoques cuestan GPU. En móviles de gama baja o en listas largas, glassmorphism y Liquid Glass se notan en el desplazamiento.

## Lo que aplica a todos

Sea cual sea el estilo, tres reglas no se negocian:

- **Contraste de texto.** WCAG pide 4.5:1 para texto normal y 3:1 para texto grande. Un estilo que no lo cumpla no es una decisión estética, es un defecto.
- **El estado no puede depender solo del color ni de la sombra.** Foco, error y selección necesitan una señal adicional: borde, icono, texto.
- **`prefers-reduced-motion` se respeta.** Todo lo que se mueva —Liquid Glass y Spatial UI sobre todo— necesita una versión quieta.

```css title="src/styles/movimiento.css"
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Mezclarlos

Lo habitual en producción no es adoptar un estilo entero, sino **una base sobria con acentos**. Un producto minimalista con una tarjeta de vidrio en el encabezado, o una interfaz limpia con un bloque brutalista en la página de precios.

La regla práctica: el estilo llamativo va donde no hay tarea que completar. En el flujo de trabajo, aburrido y predecible.
