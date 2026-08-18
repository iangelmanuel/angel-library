---
title: Estrategia de testing — qué probar en cada nivel
description: Diseñar una pirámide útil de tests unitarios, integración, contratos y E2E sin duplicar las mismas comprobaciones.
category: testing
tags: [testing, architecture, quality, e2e]
scope: estrategia de pruebas
order: 1
related:
  - guides/nextjs-testing
  - guides/astro-testing
  - libraries/vitest-backend
  - libraries/supertest
updatedAt: 2026-08-18
---

La unidad correcta no siempre es una función. Elige el nivel más bajo que reproduzca el riesgo real sin simular la parte que quieres verificar.

| Nivel | Útil para | Evitar |
| --- | --- | --- |
| Unitario | reglas, parsers, cálculos | mocks de cada línea interna |
| Integración | DB, HTTP, módulos colaborando | reemplazar la dependencia principal |
| Contrato | APIs entre servicios | asumir que OpenAPI y runtime coinciden |
| E2E | flujos críticos de usuario | cubrir cada combinación visual |

## Qué merece prioridad

- Autorización y ownership.
- Pagos, inventario y cálculos.
- Migraciones y queries importantes.
- Formularios y flujos de recuperación.
- Bugs que ya ocurrieron: cada regresión debería dejar una prueba.

## Propiedades directamente buena suite

- Determinista: controla reloj, random y datos.
- Aislada: no depende de orden ni ambiente personal.
- Legible: explica comportamiento, no implementación accidental.
- Rápida en feedback local y completa en CI.
- Con datos mínimos que destaquen el caso relevante.

## Mocks

Mockeá límites lentos o no deterministas —email, pagos, APIs externas—, pero mantén tests de integración para el adapter real. Si todo está mockeado, la suite solo demuestra que los mocks coinciden entre sí.

## CI mínima

Ejecutar formato/lint, tipos, unitarios, build y un conjunto E2E crítico. Separa tests lentos, pero no permitas que queden permanentemente fuera del camino de publicación.

## Elegir el nivel por riesgo

Si una regla puede expresarse como una función pura, pruébala con muchos casos pequeños. Si depende de SQL, serialización, cookies o headers, usa integración con la dependencia real en un entorno controlado. Si el riesgo está en la navegación, el streaming o la composición de varias piezas, usa E2E. La cantidad de tests debe seguir el costo directamente regresión, no una proporción rígida.

| Riesgo | Prueba recomendada | Señal de éxito |
| --- | --- | --- |
| Precio o descuento incorrecto | unitario con límites | total exacto y errores claros |
| Query no autorizada | integración con DB | usuario ajeno recibe rechazo |
| API consumida por otro equipo | contrato + integración | schema y errores compatibles |
| Compra completa | E2E con proveedor simulado | usuario puede terminar el flujo |

## Datos, aislamiento y tiempo

Usa una base de datos efímera o un schema por suite para integración. Limpia por test o genera identificadores únicos; depender de un orden compartido crea fallos que solo aparecen en CI paralelo. Congela reloj y random cuando sean parte del resultado, pero agrega al menos un test de límites reales de zona horaria y fechas.

## Testear fallos

Incluye timeout, respuesta parcial, reintento, doble clic, sesión expirada, permiso revocado y dependencia caída. Un sistema confiable no solo devuelve el resultado feliz: conserva invariantes cuando una operación se repite o falla a mitad. Los bugs descubiertos en producción deben transformarse en una prueba de regresión antes de cerrar el incidente.

## Mantener la suite

Mide duración, flaky rate y cobertura de rutas críticas. Elimina tests duplicados cuando una prueba superior ya cubre el mismo riesgo, pero no borres un caso porque “ya pasó una vez”. Revisa cada test que falla por un cambio de texto o estructura: quizá el selector está acoplado a implementación y debe migrar a un rol o contrato más estable.
