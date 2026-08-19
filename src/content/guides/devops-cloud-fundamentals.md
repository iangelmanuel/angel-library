---
title: Fundamentos de nube — regiones, servicios y responsabilidad
description: Entender regiones, zonas, cómputo, red, almacenamiento, servicios administrados y el modelo de responsabilidad compartida.
category: devops
stack: cloud-fundamentos
order: 1
tags: [devops, cloud, regions, networking, managed-services]
related:
  - guides/devops-fundamentals-terminology
  - guides/security-secrets-supply-chain
  - guides/observability-fundamentals
updatedAt: 2026-08-19
---

La nube entrega infraestructura y servicios mediante APIs. No elimina servidores ni operación: cambia qué administra el proveedor y qué sigue siendo responsabilidad del equipo.

## Bloques principales

| Bloque | Ejemplos | Pregunta clave |
| --- | --- | --- |
| Cómputo | VM, contenedor, función | ¿Cómo escala y cuánto dura? |
| Red | VPC, balanceador, DNS, CDN | ¿Quién puede comunicarse con quién? |
| Datos | objeto, bloque, base administrada | ¿Qué consistencia, backup y región requiere? |
| Identidad | usuarios, roles, políticas | ¿Cuál es el privilegio mínimo? |
| Observabilidad | logs, métricas, trazas | ¿Cómo se detecta y explica un fallo? |

## Región y zona

Una **región** es un área geográfica; una **zona de disponibilidad** es un dominio de fallos separado dentro de ella. Varias zonas reducen impacto de un fallo local, pero varias regiones agregan latencia, replicación y complejidad de datos.

Elige región por usuarios, regulación, servicios disponibles, costo y ubicación de los datos. La aplicación y su base principal muy separadas pagan latencia en cada consulta.

## Responsabilidad compartida

En un servicio administrado, el proveedor puede parchear el sistema operativo y replicar discos, mientras el equipo sigue responsable de:

- permisos e identidades;
- configuración de red y exposición pública;
- cifrado y manejo de claves;
- clasificación, retención y backup de datos;
- vulnerabilidades de aplicación y dependencias;
- monitoreo y respuesta a incidentes.

“Administrado” no significa “configurado de forma segura para nuestro caso”.

## Costos y límites

Mide cómputo, almacenamiento, operaciones y transferencia de salida. Configura presupuestos y alertas, pero también límites de concurrencia y cuotas: un bug o ataque puede convertir consumo en una factura inesperada.

## Diseño inicial razonable

Empieza con una región cercana, dos zonas cuando el servicio lo permita, infraestructura reproducible, backups probados, identidad por servicio y observabilidad básica. Agrega distribución global solo cuando requisitos y mediciones lo justifiquen.

