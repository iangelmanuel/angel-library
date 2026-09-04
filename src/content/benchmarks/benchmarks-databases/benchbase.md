---
title: "BenchBase"
description: "Suite académica y abierta para ejecutar cargas transaccionales y analíticas comparables sobre distintos sistemas de bases de datos mediante JDBC."
type: resources
order: 2
tags: [benchmarks, bases-de-datos, oltp, sql, java, academia, open-source]
url: https://github.com/cmu-db/benchbase
resourceCategory: developer-tools
official: true
personalNote: BenchBase entrega el arnés, no una respuesta universal; conserva juntos el archivo de carga, hardware, versión y configuración para que un resultado sea auditable.
updatedAt: 2026-09-04
---

> **Código y documentación:** [cmu-db/benchbase](https://github.com/cmu-db/benchbase) · **Wiki:** [BenchBase Wiki](https://github.com/cmu-db/benchbase/wiki) · **Origen académico:** [OLTP-Bench, PVLDB](https://www.vldb.org/pvldb/vol7/p277-difallah.pdf)

BenchBase es un arnés para ejecutar la misma carga contra distintos **sistemas de bases de datos**. Es la evolución de OLTP-Bench y reúne workloads transaccionales, sociales, de comercio, viajes y soporte a decisiones en una herramienta configurable.

## Quién lo respalda

El proyecto vive bajo **Carnegie Mellon Database Group —CMU DB—**. OLTP-Bench fue presentado por Djellel Difallah, Andrew Pavlo, Carlo Curino y Philippe Cudré-Mauroux en Proceedings of the VLDB Endowment. BenchBase moderniza aquel trabajo con mantenimiento académico y contribuciones de la industria y la comunidad, entre ellas aportes importantes de Cockroach Labs.

El grupo aporta dirección técnica, repositorio y revisión; no ejecuta ni certifica automáticamente cada resultado que un tercero publique.

## Cómo hace el benchmark

BenchBase es una aplicación Java multihilo. Se conecta mediante JDBC, crea o carga los datos, ejecuta una mezcla configurable de transacciones y registra throughput y latencia por tipo de operación.

El archivo de configuración define:

- Escala y cantidad de terminales o clientes concurrentes.
- Duración, calentamiento y tasa de solicitudes.
- Peso de cada transacción dentro de la mezcla.
- Conexión, aislamiento y parámetros del motor.
- Formato de métricas y resultados.

Incluye perfiles para PostgreSQL, MySQL, MariaDB, SQLite, CockroachDB, Phoenix y Spanner, entre otros. Que exista un perfil no significa que todas las bases tengan exactamente las mismas capacidades o ajustes óptimos.

## Qué estudia

La suite incluye workloads como **TPC-C**, YCSB, Wikipedia, Twitter, SmallBank, SEATS y AuctionMark, además de cargas analíticas. Esto permite estudiar contención, lecturas y escrituras, distribución de claves, transacciones, latencias percentiles y capacidad sostenida.

Los nombres TPC describen implementaciones inspiradas en esos estándares: un resultado de BenchBase **no es un resultado TPC auditado oficialmente** y no debe presentarse como tal.

## Credibilidad

**Alta como arnés de investigación y experimentación** por su linaje académico, publicación revisada, código abierto, workloads conocidos y configuración explícita. Resulta mejor para repetir un experimento que para consumir un ranking prefabricado.

Sus límites dependen del operador:

- Hardware, esquema, índices, aislamiento, escala y ajustes pueden cambiar por completo la conclusión.
- JDBC y el generador de carga forman parte del sistema medido y pueden convertirse en cuello de botella.
- No existe una tabla pública única con todos los motores bajo condiciones siempre idénticas.
- Una carga estándar no reproduce el modelo de datos, consultas y distribución de usuarios de cada producto.

## Cómo usarlo bien

Elige el workload por semejanza con tu aplicación, fija todos los parámetros en control de versiones y verifica que el generador no se sature antes que la base. Reporta throughput junto con percentiles de latencia, errores, hardware y configuración completa.
