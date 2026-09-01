---
title: Monolito vs. microservicios
description: Una decisión de trade-offs, no de moda — cuándo un monolito bien organizado es suficiente y cuándo el dolor real justifica separar servicios.
type: patterns
order: 7
tags: [arquitectura, patrones-arquitectonicos, monolito, microservicios]
problem: Elegir microservicios por default, asumiendo que es "lo moderno", suma complejidad real antes de que exista un problema que la justifique.
related:
  [
    architecture/patrones-arquitectonicos/layered-architecture,
    architecture/patrones-arquitectonicos/event-driven
  ]
updatedAt: 2026-08-17
---

## No es "moderno vs. anticuado"

Microservicios no es una evolución superior del monolito — es un trade-off distinto, con costos reales a cambio de beneficios reales. Ninguno de los dos es "la respuesta correcta" en abstracto.

## Monolito

Un solo deploy, un solo proceso (o pocos), transacciones simples (una sola base de datos, `BEGIN`/`COMMIT` normal). Más fácil de razonar: todo el código está en un solo lugar, un debugger llega a todas partes, un stack trace cruza toda la request sin saltar de proceso.

El dolor aparece con la escala equivocada:

- **Escala de equipo** — muchas personas tocando el mismo repo, mismos archivos, más conflictos y coordinación.
- **Escala de infraestructura** — si una sola parte del sistema necesita más recursos (por ejemplo, el procesamiento de imágenes), escalar el monolito significa escalar todo junto, aunque el resto no lo necesite.

## Microservicios

Cada servicio se despliega y escala de forma independiente. El equipo que lo dueño puede elegir su propio stack, su propio ritmo de deploy, escalar solo lo que necesita escalar.

A cambio, suma complejidad real:

- **Red entre servicios** — lo que antes era una llamada de función ahora es una llamada de red, con latencia, timeouts y fallos parciales que antes no existían.
- **Consistencia eventual** — ya no hay una transacción que cubra todo; coordinar un cambio que toca dos servicios requiere patrones explícitos (sagas, eventos) en vez de un simple `COMMIT`.
- **Debugging distribuido** — un stack trace ya no alcanza; seguir una request a través de varios servicios necesita tracing y logs correlacionados.
- **Infraestructura** — más piezas para desplegar, monitorear y mantener (cada servicio con su propio pipeline, sus propias métricas, su propio ciclo de vida).

## Regla práctica

Empezar con un monolito bien organizado — en capas (ver [Arquitectura en capas](/architecture/patrones-arquitectonicos/layered-architecture)), con módulos de límites claros — casi siempre es la decisión correcta al principio. Separar en microservicios cuando aparece el dolor **real** de un monolito (equipo grande pisándose todo el tiempo, necesidad real de escalar partes distintas de forma independiente), no antes, y no porque "así se hace ahora".

Un paso intermedio realista es el **monolito modular**: un único deploy, pero organizado internamente en módulos con fronteras claras y bien definidas (comunicándose por interfaces explícitas, no acoplados entre sí). Da buena parte de la claridad organizativa de los microservicios sin la complejidad de red y de infraestructura distribuida — y si algún día hace falta separar un módulo en su propio servicio, ya está aislado para hacerlo.
