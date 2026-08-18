---
title: E2E confiable en CI
description: Diseñar pruebas end-to-end deterministas, con selectores estables, aislamiento de datos, trazas y manejo real de flakiness.
category: testing
order: 3
tags: [testing, e2e, ci, playwright]
scope: pruebas de flujos completos
related:
  - guides/testing-strategy
  - guides/cicd-pipeline-fundamentals
updatedAt: 2026-08-18
---

## Qué cubrir

Reservá E2E para flujos donde la integración completa importa: autenticación, compra, permisos, creación crítica y regresiones de navegación. Combinaciones de reglas pertenecen a tests más bajos y rápidos.

## Estabilidad

- Esperá estados observables, nunca sleeps fijos.
- Selecciona por rol/nombre accesible; `data-testid` para elementos sin semántica estable.
- Cada test crea sus datos y no depende del orden.
- Controla reloj, zona horaria, random y proveedores externos.
- Usa cuenta/tenant aislado por worker si corre en paralelo.

## Diagnóstico en CI

Conserva screenshot, video, trace, consola, red y versión solo al fallar para controlar costo. Un retry puede revelar flakiness, pero el run debe reportar que necesitó reintento; no lo conviertas en verde silencioso.

## Pirámide de ejecución

- PR: smoke crítico y navegador principal.
- Main: matriz más amplia y pruebas de integración.
- Programada: navegadores/dispositivos adicionales y journeys largos.

Mide duración y tasa de flaky por test. Pon en cuarentena solo con issue, dueño y fecha; una carpeta permanente de tests ignorados deja de ser una suite.

## Datos y fixtures

Prepara datos por API o fixture de servidor, no haciendo clic por toda la UI en cada test. Usa una cuenta distinta por worker y elimina recursos creados cuando el entorno se comparte. Los datos deben ser deterministas, pero no todos los tests deben usar el mismo usuario: eso oculta problemas de permisos y colisiones.

## Selectores y espera

Prefiere `getByRole`, `getByLabel` y nombres visibles. Un `data-testid` es correcto para una fila sin semántica, pero no debe convertirse en el contrato de cada elemento. Espera la condición que importa —visible, habilitado, respuesta específica o URL— y evita dormir un número fijo de milisegundos.

## Fallos accionables

Guarda el trace con screenshots, consola y requests relevantes. Clasifica cada fallo como producto, ambiente, datos, sincronización o test. Un retry puede ayudar a identificar el problema, pero nunca debe ocultar un fallo reproducible; registra cuántos retries necesitó cada prueba y elimina la cuarentena cuando exista una corrección.

## Seguridad en E2E

Usa credenciales y datos ficticios. No imprimas tokens en traces ni subas cookies de sesión a artefactos públicos. Si el flujo prueba un proveedor externo, simula respuestas en un entorno controlado y deja una prueba separada para verificar el contrato de la integración.
