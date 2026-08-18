---
title: Arquitectura orientada a eventos
description: Desacoplar servicios que no deberían conocerse directamente, publicando eventos en vez de llamarse entre sí.
category: architecture
stack: patrones-arquitectonicos
order: 6
tags: [arquitectura, patrones-arquitectonicos, event-driven, pub-sub]
problem: Que el servicio A llame directo al servicio B (y C, y D) lo acopla a todos ellos y obliga a tocarlo cada vez que aparece un nuevo interesado.
related: [patterns/layered-architecture]
updatedAt: 2026-08-17
---

## Idea

En vez de que un servicio llame directo a otro, publica un evento describiendo lo que pasó ("orden creada") y quien esté interesado reacciona — sin que el que publica sepa quién ni cuántos son.

```text
Sin eventos:                       Con eventos:

OrderService                       OrderService
  ├─► BillingService                  │
  ├─► NotificationService             ▼
  └─► AnalyticsService            publica "orden.creada"
  (conoce a los tres,                 │
   crece con cada nuevo         ┌─────┼─────┐
   interesado)                  ▼     ▼     ▼
                             Billing Notif Analytics
                             (cada uno se suscribió
                              por su cuenta)
```

`OrderService` no importa `BillingService` ni sabe que existe. Solo publica el evento. Agregar un cuarto interesado (por ejemplo, un servicio de fraude) no requiere tocar `OrderService` en absoluto — solo suscribirse al evento que ya se publica.

## No es lo mismo que el patrón Observer

El patrón Observer (Subject/Observer clásico) vive **dentro de un mismo proceso o módulo**: un objeto notifica a sus observers, todos en el mismo runtime, típicamente síncrono. Event-driven a nivel de arquitectura es lo mismo en espíritu pero a otra escala: **entre servicios distintos**, potencialmente en procesos o máquinas distintas, casi siempre asíncrono.

La implementación varía con la escala:

- **Dentro de un monolito**, un `EventEmitter` compartido (el de Node, o una versión propia) alcanza — todo vive en el mismo proceso.
- **Entre servicios separados**, hace falta algo que cruce esa frontera: una cola de mensajes o un sistema de pub/sub (broker de mensajería, cola gestionada, lo que esté disponible en la infraestructura) que entregue el evento a cada suscriptor de forma confiable, incluso si en ese momento no está disponible.

## El trade-off honesto

Gana desacoplamiento: los servicios no se conocen entre sí, agregar un nuevo consumidor no toca al que publica. Pierde trazabilidad fácil: cuando algo falla o un dato llega mal, "¿qué disparó esto, en qué orden, y qué más reaccionó?" se vuelve mucho más difícil de seguir que una llamada de función directa donde el stack trace te dice exactamente quién llamó a quién. Depurar un flujo de eventos distribuido casi siempre necesita herramientas extra (logs correlacionados, tracing) que una llamada directa no necesita.

No es gratis. Vale la pena cuando el acoplamiento directo es el problema real, no como default para todo.
