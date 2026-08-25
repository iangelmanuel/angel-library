---
title: Evitar que tumben la página — DDoS y resiliencia
description: Diseñar capas de protección, límites y recuperación para mantener el sitio disponible ante abuso o picos reales.
category: security
stack: security-infra
order: 5
tags: [security, ddos, rate-limit, resilience, availability]
scope: disponibilidad y abuso
related:
  - guides/security-threat-modeling
  - guides/observability-incident-response
  - guides/observability-fundamentals
updatedAt: 2026-08-18
---

## Cómo pueden dejarte fuera de línea

- Saturar ancho de banda o conexiones.
- Enviar muchas requests HTTP aparentemente válidas.
- Golpear búsquedas, exportaciones, login o generación de IA que consumen CPU/dinero.
- Evitar caché cambiando query params o headers.
- Abrir conexiones lentas, subir archivos enormes o provocar fan-out a terceros.

Un límite de solicitudes dentro de una única instancia no detiene un ataque volumétrico: el tráfico ya alcanzó el servidor de origen.

## Capas de defensa

1. **Edge/CDN con mitigación DDoS:** absorber volumen y cachear contenido.
2. **Ocultar/proteger el origen:** DNS proxied, firewall que acepte solo el proxy y conexión autenticada al origen.
3. **WAF y bot controls:** reglas administradas, challenges y bloqueo gradual.
4. **Rate limits distribuidos:** por cuenta, token, IP y acción; límites más estrictos para endpoints caros.
5. **Límites de recursos:** body, uploads, concurrencia, tiempo de query y llamadas externas.
6. **Degradación:** servir caché, desactivar funciones no esenciales y poner trabajos en cola.

## Diseño resistente

- Timeouts en cliente, servidor, DB y terceros.
- Circuit breaker para no amplificar la caída de un proveedor.
- Colas con tamaño máximo y backpressure.
- Caché con claves normalizadas para evitar bypass accidental.
- Idempotencia para reintentos de operaciones mutables.
- Presupuesto/circuito para APIs cobradas por uso.

## Preparación

Alerta por requests, ancho de banda, hit ratio, p95/p99, `429`, `5xx`, saturación y costo. Documenta cómo activar reglas más estrictas, contactar al proveedor, escalar capacidad y comunicar estado. Prueba el runbook con carga autorizada; nunca lances pruebas contra infraestructura ajena.

## Rate limiting que representa el riesgo

Un límite global por IP no basta para un sistema con usuarios autenticados y proxies. Combina varias claves y define una respuesta clara:

```ts
const key = `${accountId ?? 'anon'}:${action}:${ipPrefix}`
const result = await limiter.consume(key, { points: 1, duration: 10 })

if (!result.allowed) {
  return new Response('Too many requests', {
    status: 429,
    headers: { 'Retry-After': String(result.retryAfterSeconds) },
  })
}
```

El almacén debe ser compartido entre instancias y la dirección IP debe obtenerse de una cadena de proxies confiable, no de un encabezado que cualquiera pueda inventar. Para inicio de sesión, recuperación, búsquedas costosas y generación de archivos, usa límites diferentes.

## Proteger el origen y el costo

Si un CDN está delante, restringe el firewall del origen a sus rangos o usa autenticación entre edge y origen. El contenido público debe cachearse con claves normalizadas; las rutas dinámicas necesitan límites de concurrencia, timeouts y consultas acotadas. Desactiva temporalmente una función cara o pásala a una cola antes de dejar que una avalancha consuma la base de datos.

## Runbook de disponibilidad

1. Confirma si el problema es volumen, aplicación, proveedor o despliegue.
2. Activa una regla temporal y protege endpoints caros.
3. Sirve caché o una página degradada si el negocio lo permite.
4. Revisa logs agregados, costo, errores y saturación sin buscar request por request.
5. Retira la regla gradualmente y documenta qué señal la activó.
