---
title: "ClickBench"
description: "Benchmark abierto de bases de datos analíticas que compara carga, almacenamiento y 43 consultas sobre casi cien millones de eventos."
type: resources
order: 1
tags: [benchmarks, bases-de-datos, olap, sql, analytics, clickhouse]
url: https://benchmark.clickhouse.com/
resourceCategory: developer-tools
official: true
personalNote: Es una referencia útil para cargas OLAP similares a eventos o logs; su propietario es ClickHouse y el ranking necesita una lectura crítica de cada configuración.
updatedAt: 2026-09-04
---

> **Resultados:** [ClickBench](https://benchmark.clickhouse.com/) · **Datos, consultas y scripts:** [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)

ClickBench compara sistemas de datos destinados a **analítica en línea —OLAP—**. Usa casi cien millones de eventos derivados y anonimizados de tráfico web, y plantea 43 consultas que representan filtros, agregaciones, ordenamientos y análisis temporal.

## Quién lo respalda

Lo diseña y mantiene **ClickHouse**, la empresa detrás de la base de datos del mismo nombre. Proporciona el conjunto de datos, las reglas, los scripts, el tablero y resultados de referencia; colaboradores pueden añadir otros motores.

El patrocinio hace posible una comparación extensa y reproducible, pero crea un conflicto de interés evidente: ClickHouse también compite en la tabla. El proyecto lo compensa parcialmente haciendo públicos los artefactos y describiendo cómo deben enviarse los resultados.

## Cómo hace el benchmark

Cada sistema se instala en una máquina virtual Ubuntu nueva mediante un script documentado. El envío debe incluir esquema, comando de carga, consultas, configuración, ejecución y resultados.

- Registra el tiempo de carga y el tamaño ocupado por los datos.
- Ejecuta 43 consultas, en su mayoría SQL estándar adaptado cuando el motor lo necesita.
- Cada consulta se corre tres veces: la primera aproxima un estado frío y el mejor tiempo de la segunda o tercera representa el estado caliente.
- El tiempo incluye enviar la consulta, procesarla y transferir el resultado; no se permite ocultar la salida ni usar una caché de resultados.
- El resumen usa medias geométricas relativas al resultado más rápido y penaliza consultas fallidas.

Las consultas fueron construidas para la prueba sobre un conjunto de datos realista; **no son consultas copiadas de una carga de producción**.

## Qué estudia

- Ingestión y preparación inicial de un conjunto grande.
- Compresión o espacio en disco.
- Latencia fría y caliente de consultas analíticas.
- Agregaciones, agrupaciones, filtros y series temporales.
- Compatibilidad de SQL y capacidad de completar toda la batería.

## Credibilidad

**Alta para reproducir una carga OLAP bien delimitada**: datos, consultas y scripts son públicos, el procedimiento incluye el ciclo completo y la tabla cubre motores con arquitecturas distintas.

No debe leerse como tabla universal de bases de datos:

- El propietario del benchmark desarrolla uno de los participantes.
- La carga favorece sistemas analíticos; no evalúa transacciones OLTP, consistencia operativa ni escritura concurrente.
- Tres ejecuciones ofrecen una visión limitada de la variabilidad.
- Configuración, versión, hardware y experiencia de quien prepara cada motor pueden diferir.
- Una media relativa oculta consultas individuales lentas o incompatibles.

## Cómo usarlo bien

Confirma que tus datos se parecen a eventos append-only y que tus consultas son analíticas. Compara el esquema y la configuración, no solo el color de la tabla, y vuelve a ejecutar los candidatos con el volumen, concurrencia y políticas de actualización de tu sistema.
