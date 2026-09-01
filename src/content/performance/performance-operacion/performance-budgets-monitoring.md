---
title: Presupuestos y monitoreo de rendimiento
description: Convertir performance en un requisito verificable con budgets, CI, RUM, alertas y comparación por versiones.
type: guides
order: 5
tags: [performance, monitoring, ci, web-vitals]
scope: gobierno de rendimiento
related:
  - performance/performance-fundamentos/core-web-vitals
  - performance/performance-carga/performance-resource-loading
  - devops/observabilidad/observability-fundamentals
updatedAt: 2026-08-18
---

## Un presupuesto útil

Define límites por tipo de ruta y dispositivo: JavaScript inicial, CSS, peso total de imágenes, número de terceros y objetivos de LCP/INP/CLS. Un ecommerce y una landing no necesitan el mismo presupuesto.

Los presupuestos deben bloquear regresiones relevantes, no fallar por ruido. Compara contra una línea base y registra excepciones con responsable y fecha de revisión.

## Laboratorio, campo y backend

- **Laboratorio:** Lighthouse/WebPageTest para reproducir y depurar.
- **RUM:** métricas de usuarios reales segmentadas por ruta, país, dispositivo y versión.
- **Backend:** p50/p95/p99 de latencia, error rate, caché y consultas lentas.

Una mejora local que no aparece en campo puede estar atacando el cuello equivocado. Un promedio estable también puede ocultar una cola p95 que empeoró.

## Ciclo operativo

1. Guardar versión y ruta junto a cada métrica.
2. Alertar por tendencia sostenida, no por una muestra aislada.
3. Correlacionar regresión con deploys y feature flags.
4. Crear una hipótesis y medir antes/después.
5. Documentar la decisión si se acepta un costo por negocio.

## Señales mínimas por release

- Diferencia de bundles por ruta.
- Core Web Vitals de campo cuando haya volumen.
- Requests y bytes de terceros.
- TTFB y tasa de errores del origen.
- Una prueba sintética del flujo principal.

## Ejemplo de presupuesto

| Ruta | JS inicial | CSS | Imágenes iniciales | Terceros |
| --- | ---: | ---: | ---: | ---: |
| Landing | 120 KB gzip | 40 KB gzip | 400 KB | 2 orígenes |
| Catálogo | 180 KB gzip | 60 KB gzip | 700 KB | 3 orígenes |
| Panel autenticado | 220 KB gzip | 80 KB gzip | 300 KB | 2 orígenes |

Son valores de partida, no una norma. Ajústalos según el producto y registra por qué una excepción es necesaria. Un budget que no distingue la ruta o el formato comprimido produce falsos positivos; uno demasiado permisivo deja pasar regresiones.

## Cómo llevarlo a CI

1. Construye una versión comparable con lockfile y variables controladas.
2. Mide rutas representativas en el mismo dispositivo simulado.
3. Compara bundles, requests y Web Vitals contra la baseline.
4. Falla el pipeline solo cuando se supera un umbral definido y repetible.
5. Publica el reporte como artefacto y asigna la regresión a un cambio concreto.

Mantén una revisión manual para cambios intencionales: una función nueva puede aumentar el bundle y aun así ser correcta, pero la decisión debe quedar documentada con el impacto esperado y una fecha para revisarla.

## Monitorear sin datos sensibles

No envíes URLs con tokens, texto de formularios ni identificadores personales al proveedor de RUM. Redacta query params, limita la retención y restringe quién puede ver dashboards. La observabilidad de performance también debe cumplir el modelo de privacidad del producto.
