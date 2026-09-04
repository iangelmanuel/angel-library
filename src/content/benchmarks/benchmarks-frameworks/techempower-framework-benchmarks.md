---
title: "TechEmpower Framework Benchmarks"
description: "Proyecto comunitario que compara el rendimiento de frameworks backend con implementaciones equivalentes y varias cargas HTTP y de base de datos."
type: resources
order: 1
tags: [benchmarks, backend, frameworks, http, bases-de-datos, open-source]
url: https://www.techempower.com/benchmarks/
resourceCategory: developer-tools
official: true
personalNote: Compara la prueba y el código de cada implementación, no solo la tabla general; el mayor throughput rara vez decide por sí solo una arquitectura.
updatedAt: 2026-09-04
---

> **Resultados:** [TechEmpower Framework Benchmarks](https://www.techempower.com/benchmarks/) · **Código fuente:** [TechEmpower/FrameworkBenchmarks](https://github.com/TechEmpower/FrameworkBenchmarks) · **Pruebas:** [Framework Tests Overview](https://github.com/TechEmpower/FrameworkBenchmarks/wiki/Project-Information-Framework-Tests-Overview)

TechEmpower Framework Benchmarks —TFB— compara cuántas solicitudes pueden atender **frameworks y plataformas backend** bajo varias cargas delimitadas. Incluye cientos de implementaciones mantenidas por autores de frameworks, colaboradores y el equipo del proyecto.

## Quién lo respalda

Lo inició y mantiene **TechEmpower**, consultora de software. La empresa proporciona coordinación e infraestructura; la comunidad aporta, corrige y revisa implementaciones. El repositorio, el arnés, las configuraciones y los resultados están disponibles públicamente desde 2013.

Se publican resultados por rondas. Cada ronda congela código, hardware y configuración: solo las implementaciones ejecutadas en la misma ronda y entorno son comparables directamente.

## Cómo hace el benchmark

El sistema despliega cada implementación en una infraestructura controlada y genera tráfico HTTP desde máquinas separadas. La topología y el hardware de cada ronda se documentan. El objetivo principal es medir solicitudes por segundo, aunque los resultados también permiten inspeccionar latencia y errores.

Las siete familias clásicas aumentan gradualmente el trabajo:

| Prueba             | Trabajo principal                                           |
| ------------------ | ----------------------------------------------------------- |
| JSON Serialization | Serializar una respuesta JSON pequeña                       |
| Single Query       | Leer una fila aleatoria de la base de datos                 |
| Multiple Queries   | Ejecutar varias consultas por solicitud                     |
| Cached Queries     | Resolver lecturas con caché de aplicación                   |
| Fortunes           | Consultar, ordenar, escapar HTML y renderizar una plantilla |
| Data Updates       | Leer y actualizar varias filas                              |
| Plaintext          | Entregar una respuesta de texto mínima                      |

El índice compuesto normaliza resultados de varias pruebas y aplica pesos. Es cómodo para explorar, pero esos pesos son una decisión editorial: para una selección técnica conviene estudiar cada carga por separado.

## Qué estudia

- Coste base del framework y del servidor HTTP.
- Serialización, plantillas y acceso a datos.
- Concurrencia y escalado vertical bajo carga elevada.
- Diferencias entre modo convencional y configuraciones muy optimizadas.
- Efecto del lenguaje, runtime, framework, servidor y controlador de base de datos como conjunto.

## Credibilidad

**Alta como comparación abierta de throughput máximo**: el código y la infraestructura se documentan, las pruebas se repiten por rondas y los mantenedores pueden revisar o corregir la implementación de su framework.

Pero no responde cuál framework es «mejor» en general:

- Una implementación puede estar mucho más optimizada que otra sin representar el código habitual de producción.
- Plaintext y JSON son microbenchmarks; reducen el ruido, pero se parecen poco a una aplicación completa.
- El throughput máximo no mide productividad, mantenibilidad, seguridad, ecosistema ni coste operativo.
- La clasificación compuesta depende de pesos subjetivos.
- Hardware, versiones y reglas cambian entre rondas.

## Cómo usarlo bien

Elige la carga más cercana a tu servicio, abre su implementación y revisa conexiones, consultas, caché y concurrencia. Usa TFB para formular una hipótesis y ejecuta después una prueba sobre tu endpoint, tu base de datos y tu patrón real de tráfico.
