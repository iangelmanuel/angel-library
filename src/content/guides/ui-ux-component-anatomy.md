---
title: Anatomía de un componente confiable
description: Diseñar API, estados, contenido, interacción, accesibilidad y responsive de un componente antes de pulir su apariencia.
category: ui-ux
stack: ui-ux-interaccion
order: 4
tags: [ui, ux, components, states, accessibility]
related:
  - guides/ui-ux-estados-interfaz
  - guides/ui-ux-forms-feedback
  - guides/accessibility-semantics-keyboard-focus
updatedAt: 2026-08-25
---

Un componente no es solo su estado ideal. Su contrato incluye contenido, acciones, espera, error, permisos, teclado, tamaños y cómo convive con el layout.

## Las capas

```text
propósito
  → contenido y jerarquía
  → interacción y estados
  → semántica y accesibilidad
  → layout responsive
  → estilo y movimiento
  → métricas y pruebas
```

## Ejemplo: tarjeta de archivo

Define primero qué permite: abrir, descargar, renombrar o eliminar. La tarjeta completa no debe ser un botón si contiene varios controles interactivos anidados.

```html
<article aria-labelledby="file-42-title">
  <h3 id="file-42-title"><a href="/files/42">reporte.pdf</a></h3>
  <p>2,4 MB · PDF</p>
  <button type="button" aria-label="Más acciones para reporte.pdf">•••</button>
</article>
```

El nombre accesible del menú incluye el archivo porque “Más acciones” aislado se repite sin contexto.

## Matriz de estados

| Estado | Pregunta |
| --- | --- |
| default | ¿se entiende propósito y acción principal? |
| hover/focus | ¿el indicador no depende solo de color? |
| loading | ¿se bloquea solo lo necesario? |
| vacío | ¿explica causa y siguiente paso? |
| error | ¿conserva datos y permite recuperar? |
| disabled | ¿por qué no está disponible? |
| contenido extremo | ¿nombres largos y traducciones caben? |
| permiso limitado | ¿se oculta o explica la acción? |

## API del componente

Prefiere props que expresen intención (`status="error"`, `onRetry`) sobre combinaciones contradictorias (`isLoading`, `hasError`, `isEmpty` simultáneas). Para estados mutuamente excluyentes usa una unión discriminada.

```ts
type ResultState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string; retry: () => void };
```

## Validación

Prueba teclado, zoom, lector de pantalla, viewport estrecho, traducción larga y red lenta. Una story aislada ayuda a enumerar estados; una prueba integrada confirma foco, datos y recuperación reales.

## Regla de diseño

La apariencia final debe reforzar el contrato. Si el componente solo se entiende por una animación, color o tooltip, todavía falta información en su estructura.

