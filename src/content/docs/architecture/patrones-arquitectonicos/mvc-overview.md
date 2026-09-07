---
title: MVC (Model-View-Controller)
description: El patrón que separa datos, presentación y coordinación en tres piezas — de dónde viene y por qué sigue vivo, sobre todo en el backend.
type: patterns
order: 1
tags: [arquitectura, patrones-arquitectonicos, mvc]
problem: Mezclar datos, lógica de presentación y flujo de control en el mismo lugar hace que cambiar una cosa obligue a tocar todas las demás.
related: [backend/express/backend-mvc-structure]
updatedAt: 2026-08-17
---

## Las tres piezas

```text
Input (usuario, HTTP, evento)
      │
      ▼
 Controller ───► Model ───► Controller ───► View ───► Output
```

- **Model** — los datos y las reglas de negocio. No sabe nada de cómo se muestra ni de quién lo pidió.
- **View** — la presentación. Toma datos y los renderiza. No decide qué hacer con un input.
- **Controller** — coordina: recibe el input, le pide algo al model, elige qué view mostrar (o qué responder).

Cada pieza tiene una sola responsabilidad y no conoce los detalles internos de las otras dos.

## Por qué separar esto importa

- Cambiar cómo se ve algo (la view) no debería requerir tocar las reglas de negocio (el model).
- Cambiar una regla de negocio no debería requerir tocar el código que dibuja la UI o arma la respuesta HTTP.
- El model es la pieza más testeable: sin HTTP, sin DOM, sin nada de infraestructura de por medio.
- El controller queda delgado a propósito: su trabajo es orquestar, no decidir.

Cuando estas líneas se difuminan (un controller que hace queries directo, una view con lógica de negocio adentro) el código se vuelve difícil de cambiar sin romper algo no relacionado.

## MVC clásico vs. frontend moderno

El MVC que describe este documento es el clásico, pensado originalmente para aplicaciones con estado en el servidor. En frameworks de frontend modernos (React, Vue, Svelte) no hay una separación tan limpia: el estado y la UI están mucho más entrelazados — un componente suele ser view y controller (y a veces hasta model) al mismo tiempo. Eso está más cerca de MVVM (Model-View-ViewModel) o directamente de un modelo de "componentes" propio, no del MVC clásico.

Por eso hoy el MVC clásico se ve sobre todo en el **backend**: APIs REST, aplicaciones server-rendered, frameworks tipo Rails/Django/Express-con-estructura.

## Implementación real

Este documento es la versión conceptual. Para ver MVC aplicado en código real, con estructura de carpetas, flujo de request y el error handler central, ver [Estructura MVC para APIs Express](/backend/express/backend-mvc-structure) — la implementación completa para un backend Express (`routes` → `controllers` → `services` → `repositories`, donde `controllers` + `services` juntos cubren el rol de Controller y `services`/`repositories` el de Model).
