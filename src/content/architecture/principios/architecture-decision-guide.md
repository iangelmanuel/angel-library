---
title: Cómo elegir una arquitectura sin sobrediseñar
description: Partir de restricciones y riesgos para decidir módulos, límites, datos y despliegue antes de aplicar un patrón.
type: guides
order: 3
tags: [architecture, tradeoffs, adr, design]
scope: toma de decisiones arquitectónicas
related:
  - architecture/principios/adr
  - architecture/principios/dry-kiss-yagni
  - architecture/patrones-arquitectonicos/layered-architecture
  - architecture/patrones-arquitectonicos/hexagonal-architecture
updatedAt: 2026-08-25
---

## Empezar por fuerzas, no por diagramas

Documenta usuarios, volumen, consistencia, disponibilidad, seguridad, equipo, presupuesto y velocidad de cambio. Una arquitectura es buena para unas restricciones y costosa para otras.

## Secuencia

1. Definir casos críticos y atributos de calidad medibles.
2. Identificar dominios, ownership de datos y límites de confianza.
3. Elegir la opción más simple que permita evolucionar.
4. Probar la incertidumbre mayor con un spike o carga representativa.
5. Registrar decisión, alternativas y condiciones para revisarla.

## Preguntas de consulta rápida

```text
¿qué cambio o fallo preocupa?
¿qué atributo de calidad tiene una medida?
¿qué límite posee los datos y la decisión?
¿qué opción más simple satisface hoy?
¿qué evidencia haría revisar la decisión?
```

Ejemplo: “usar una cola” no es el objetivo. El objetivo puede ser responder en menos de 300 ms aunque el proveedor de correo tarde diez segundos. La cola introduce reintentos, duplicados y monitoreo; esas consecuencias también entran en la decisión.

## Modularidad antes que distribución

Un monolito modular suele ofrecer límites, tests y despliegue simple. Separa servicios cuando exista una razón operativa o de dominio clara: escalado independiente, aislamiento, ownership o ciclo de entrega. Microservicios añaden red, consistencia eventual, observabilidad, seguridad y coordinación.

## Señales de sobrediseño

- interfaces con una única implementación sin límite real;
- eventos para llamadas locales simples;
- repositorios genéricos que ocultan capacidades de la base;
- capas que solo renombran métodos;
- infraestructura elegida por moda sin carga que la necesite.

Revisa decisiones con evidencia. Cambiar de arquitectura no es fracaso: lo es mantener un costo cuando las premisas dejaron de existir.

## Spike y ADR

Un **spike** es un experimento limitado para reducir una incertidumbre: medir una query con volumen realista, comprobar compatibilidad edge o simular una caída. Define de antemano pregunta, tiempo máximo y criterio.

El ADR conserva contexto, alternativas, decisión y consecuencias. Incluye una señal de revisión: “revisar si el p95 supera 500 ms durante cuatro semanas” es más útil que “revisar en el futuro”.
