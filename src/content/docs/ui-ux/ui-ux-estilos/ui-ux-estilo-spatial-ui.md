---
title: "Spatial UI"
description: "Interfaces colocadas en un espacio tridimensional: profundidad real, entrada por mirada y gesto, y los límites ergonómicos que impone el cuerpo."
type: guides
order: 10
tags: [ui, diseño, estilos, spatial, 3d, visionos, accesibilidad]
related:
  - ui-ux/ui-ux-estilos/ui-ux-estilos-visuales
  - ui-ux/ui-ux-estilos/ui-ux-estilo-liquid-glass
updatedAt: 2026-08-30
---

**Spatial UI** es el único de la lista donde la profundidad deja de ser un truco visual. En vez de simular capas con sombras, los paneles ocupan posiciones reales en un espacio tridimensional alrededor de la persona: visores de realidad mixta, gafas de realidad aumentada, entornos 3D.

Cambia la unidad de trabajo. No diseñas una pantalla; diseñas **dónde se coloca cada cosa respecto a un cuerpo que mira y se mueve**.

## Qué cambia respecto a una pantalla

|                   | Interfaz plana                     | Spatial UI                        |
| ----------------- | ---------------------------------- | --------------------------------- |
| Profundidad       | Simulada con sombras               | Real, medida en metros            |
| Lienzo            | Rectángulo fijo                    | Espacio alrededor del usuario     |
| Entrada           | Puntero, toque, teclado            | Mirada, gestos con las manos, voz |
| Foco              | El cursor o el orden de tabulación | Adónde mira la persona            |
| Coste de un error | Un clic mal puesto                 | Fatiga física, mareo              |

## Las reglas nuevas

**1. Todo se mide en ángulos, no en píxeles.** Un botón no tiene 44 px: ocupa un ángulo del campo visual. A dos metros de distancia el mismo elemento necesita ser mucho más grande que a medio metro para seguir siendo cómodo de apuntar.

**2. El contenido va donde la cabeza descansa.** La zona cómoda es un cono estrecho al frente y ligeramente por debajo de la horizontal. Poner elementos importantes arriba obliga a levantar el cuello y cansa en minutos.

**3. El objetivo lo define la mirada, la acción la confirma el gesto.** Como el foco sigue a los ojos, los blancos tienen que ser grandes y estar separados: la mirada tiembla y no se posa con la precisión de un ratón.

**4. Nada se mueve por decoración.** En una pantalla una animación gratuita molesta; en un visor puede provocar malestar físico. El movimiento que no está anclado a una acción del usuario se elimina.

**5. La interfaz no persigue a la persona.** Los paneles anclados a la cabeza, que siguen la mirada a todas partes, resultan agobiantes. Lo habitual es anclar al mundo: el panel se queda donde lo dejaste y puedes alejarte.

## Profundidad con propósito

La tentación al empezar es repartir todo en muchos planos porque se puede. La práctica útil es la contraria: **pocos planos, con significado**.

| Plano   | Qué va ahí                             |
| ------- | -------------------------------------- |
| Cercano | Aquello con lo que se interactúa ahora |
| Medio   | El contenido principal                 |
| Lejano  | Contexto, ambiente, elementos pasivos  |

Tres planos suelen bastar. Más allá, la persona pierde la noción de qué está delante de qué, que era justo lo que la profundidad venía a resolver.

## El vidrio como material dominante

No es casualidad que las interfaces espaciales usen materiales translúcidos. En un entorno donde el fondo es la habitación real, un panel opaco tapa el mundo y desorienta; uno translúcido deja ver qué hay detrás y mantiene la referencia espacial.

Por eso [Liquid Glass](/ui-ux/ui-ux-estilos/ui-ux-estilo-liquid-glass) se extiende también a visionOS: es el mismo problema resuelto con el mismo material.

## Accesibilidad y ergonomía

Es el estilo con más barreras de entrada, y ninguna es de software:

- **Fatiga del brazo.** Los gestos sostenidos al aire cansan rápido. Las interacciones deben ser cortas y permitir apoyar las manos.
- **Movilidad del cuello y del tronco.** No todo el mundo puede girarse. Cualquier cosa importante tiene que ser alcanzable sin moverse.
- **Visión monocular y problemas de profundidad.** Una parte de la población no percibe estereoscopía. La profundidad no puede ser la única forma de distinguir dos elementos: también deben diferenciarse por tamaño, color o posición.
- **Mareo por movimiento.** Movimiento de cámara que la persona no inició es la causa principal.
- **Sesiones cortas.** El diseño debe asumir minutos, no horas.

## Cuándo usarlo

- **Sí** cuando el contenido es intrínsecamente espacial: modelos 3D, arquitectura, medicina, simulación, guías sobre objetos reales.
- **Sí** cuando la ventaja real es tener varias superficies grandes alrededor.
- **No** para trasladar una aplicación plana a un visor. Un formulario no mejora por flotar en el aire; empeora, porque escribir es más difícil.
- **No** si el público objetivo es amplio: la base instalada de visores sigue siendo pequeña frente a la web.

La pregunta de control es sencilla: **¿esto es mejor en el espacio, o solo distinto?** Si la respuesta es "distinto", una pantalla normal lo hará mejor y llegará a más gente.
