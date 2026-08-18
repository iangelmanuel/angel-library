---
title: Core Web Vitals — medir antes de optimizar
description: Interpretar LCP, INP y CLS, encontrar la causa real y validar mejoras con datos de campo y laboratorio.
category: performance
tags: [performance, web-vitals, frontend, ux]
scope: rendimiento web
order: 1
related:
  - guides/astro-image-picture
  - guides/nextjs-image
  - guides/nextjs-font
updatedAt: 2026-08-18
---

## Las tres métricas

| Métrica | Pregunta | Objetivo orientativo |
| --- | --- | --- |
| LCP | ¿cuándo aparece el contenido principal? | ≤ 2.5 s |
| INP | ¿qué tan rápido responde a interacciones? | ≤ 200 ms |
| CLS | ¿cuánto salta el layout? | ≤ 0.1 |

Evalúa percentil 75 y separa móvil/escritorio. Un promedio puede ocultar usuarios con una experiencia muy mala.

## Diagnóstico

### LCP

- Reducir TTFB y trabajo de servidor.
- No lazy-loadear la imagen hero.
- Priorizar fuente/imagen crítica y evitar CSS bloqueante excesivo.
- Servir imágenes con tamaño y formato adecuados.

### INP

- Dividir tareas largas de JavaScript.
- Evitar hidratar árboles enteros por un control pequeño.
- Dar feedback inmediato y mover trabajo pesado fuera del handler.
- Virtualizar listas realmente grandes.

### CLS

- Reservar dimensiones de imágenes, embeds y anuncios.
- Evitar insertar banners por encima del contenido ya visible.
- Cargar fuentes con estrategia que minimice cambios métricos.

## Campo vs laboratorio

Lighthouse reproduce una sesión controlada y ayuda a depurar. CrUX/RUM muestra dispositivos, redes y comportamiento reales. Usa laboratorio para encontrar causas y datos de campo para comprobar impacto.

No persigas una puntuación aislada: mide rutas importantes, regresiones por versión y experiencia de usuarios reales.

## Cómo leer un resultado

La cifra sola no explica la causa. Para LCP separa TTFB, descubrimiento del recurso, descarga y renderizado; para INP identifica la interacción concreta y la tarea que bloqueó el hilo principal; para CLS registra qué elemento cambió de posición y qué lo provocó. Guarda la URL, versión, dispositivo, conexión y plantilla junto a la medición.

| Síntoma | Causa frecuente | Primera comprobación |
| --- | --- | --- |
| LCP alto con servidor rápido | imagen o fuente crítica descubierta tarde | waterfall y prioridad del recurso |
| INP alto en búsqueda | filtrado o renderizado grande en el handler | Performance panel y tareas largas |
| CLS después de cargar | imagen, fuente, anuncio o contenido sin reserva | Layout Shifts y dimensiones iniciales |

## Laboratorio reproducible

Prueba una ruta representativa con caché fría y caliente, CPU limitada y una red móvil simulada. Repite varias veces, porque una sola ejecución puede incluir ruido. DevTools permite grabar el waterfall y el hilo principal; Lighthouse ayuda a comparar cambios; una herramienta de campo confirma si la mejora llega a personas reales.

## Validación después del despliegue

Compara una versión anterior y una nueva en el percentil 75, no solo en el mejor dispositivo. Segmenta por país, tipo de conexión y plantilla para evitar que una ruta pequeña esconda una regresión. Si una métrica empeora, conserva el cambio o activa un flag hasta conocer la causa; optimizar sin poder atribuir el resultado dificulta mantener la mejora.
