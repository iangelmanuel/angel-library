---
title: Cómo elegir una arquitectura sin sobrediseñar
description: Partir de restricciones y riesgos para decidir módulos, límites, datos y despliegue antes de aplicar un patrón.
category: architecture
stack: principios
order: 1
tags: [architecture, tradeoffs, adr, design]
scope: toma de decisiones arquitectónicas
related:
  - practices/adr
  - practices/dry-kiss-yagni
  - patterns/layered-architecture
  - patterns/hexagonal-architecture
updatedAt: 2026-08-18
---

## Empezar por fuerzas, no por diagramas

Documenta usuarios, volumen, consistencia, disponibilidad, seguridad, equipo, presupuesto y velocidad de cambio. Una arquitectura es buena para unas restricciones y costosa para otras.

## Secuencia

1. Definir casos críticos y atributos de calidad medibles.
2. Identificar dominios, ownership de datos y límites de confianza.
3. Elegir la opción más simple que permita evolucionar.
4. Probar la incertidumbre mayor con un spike o carga representativa.
5. Registrar decisión, alternativas y condiciones para revisarla.

## Modularidad antes que distribución

Un monolito modular suele ofrecer límites, tests y despliegue simple. Separa servicios cuando exista una razón operativa o de dominio clara: escalado independiente, aislamiento, ownership o ciclo de entrega. Microservicios añaden red, consistencia eventual, observabilidad, seguridad y coordinación.

## Señales de sobrediseño

- interfaces con una única implementación sin límite real;
- eventos para llamadas locales simples;
- repositorios genéricos que ocultan capacidades de la base;
- capas que solo renombran métodos;
- infraestructura elegida por moda sin carga que la necesite.

Revisa decisiones con evidencia. Cambiar de arquitectura no es fracaso: lo es mantener un costo cuando las premisas dejaron de existir.
