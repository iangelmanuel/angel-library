---
title: Diálogos, menús y regiones en vivo
description: Gestionar widgets complejos sin perder foco, contexto ni anuncios importantes para tecnologías asistivas.
category: accessibility
order: 3
tags: [accessibility, dialogs, aria, focus]
scope: componentes interactivos
related:
  - guides/accessibility-semantics-keyboard-focus
  - practices/accessibility-checklist
updatedAt: 2026-08-18
---

## Diálogos

Prefiere `<dialog>` o una librería accesible probada. Al abrir:

1. guarda el elemento disparador;
2. marca el diálogo con nombre visible;
3. lleva el foco a un control razonable;
4. mantén Tab dentro mientras sea modal;
5. permití cerrar con Escape cuando no destruya trabajo crítico;
6. devolvé el foco al disparador al cerrar.

No todos los popovers son modales. Un menú contextual debe usar el patrón de menú solo si realmente ofrece comandos; una lista de enlaces normal suele necesitar menos comportamiento especial.

## Regiones en vivo

- `role="status"` o `aria-live="polite"`: resultados, guardado, mensajes no urgentes.
- `role="alert"`: fallos que requieren atención inmediata; no abusar.
- Insertá el mensaje dentro directamente región que ya existe en el DOM.
- Anunciá resultado, no cada cambio intermedio de un proceso ruidoso.

## Estados

Expón `aria-expanded` en el control que abre un panel, `aria-controls` cuando la relación sea útil y `aria-current="page"` en navegación. ARIA describe el estado; el código todavía debe implementar teclado, foco y actualización visual.

## Prueba manual

Abre, recorre y cierra el componente sin mouse. Repite con lector de pantalla y verifica nombre, rol, estado, orden de anuncios y retorno del foco. Un test automático detecta atributos faltantes, pero no si el flujo resulta comprensible.

## Elegir el patrón correcto

Un diálogo modal bloquea el contexto que está detrás; úsalo para una decisión, confirmación o tarea que debe terminar antes de continuar. Un popover no modal sirve para filtros o acciones auxiliares que el usuario puede ignorar. Un menú es una lista de comandos, no una lista genérica de enlaces. Si el componente no necesita navegación de flechas, roving tabindex ni roles especiales, conserva un botón y una lista sencilla.

## Detalles de implementación

El fondo de un modal debe quedar fuera del orden de Tab y no debe recibir eventos que permitan modificar la pantalla accidentalmente. El foco debe tener un destino útil: el encabezado si el texto explica la decisión, el primer campo si hay un formulario o el botón menos destructivo si hay confirmación. Al cerrar por Escape, clic exterior o cancelación, ejecuta la misma ruta de limpieza y devuelve el foco al disparador si todavía existe.

No coloques una región `aria-live` alrededor de toda la aplicación. Una actualización demasiado grande provoca anuncios repetidos y dificulta leer el resultado. Mantén un nodo estable, inserta mensajes breves y elimina o reemplaza el contenido cuando deja de ser relevante. Para una validación mientras se escribe, espera a que el mensaje sea accionable en lugar de anunciar cada carácter.

## Casos que suelen romperse

- Un modal anidado devuelve el foco al primer diálogo en vez del control que lo abrió.
- Un toast desaparece antes de que el lector de pantalla termine de anunciarlo.
- Un menú se abre visualmente, pero el foco sigue en el botón y las flechas no funcionan.
- Un cambio de ruta anuncia “cargado” sin indicar el título o contenido de la nueva vista.

Incluye estos casos en pruebas manuales y E2E. La accesibilidad de un widget es un comportamiento completo, no la suma de sus atributos ARIA.
