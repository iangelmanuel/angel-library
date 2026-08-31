---
title: "Untitled UI React"
description: "Colección abierta de componentes React sobre Tailwind CSS y React Aria que se copian al proyecto, con modo oscuro y accesibilidad incluidos."
category: ui-ux
stack: ui-react
order: 8
tags: [react, tailwindcss, componentes, accesibilidad, react-aria, typescript]
website: https://www.untitledui.com/react
github: https://github.com/untitleduico/react
technologies: [technologies/react]
updatedAt: 2026-08-30
---

> Publicado por **[Untitled UI](https://github.com/untitleduico)**. Los componentes abiertos tienen licencia MIT; hay componentes PRO de pago aparte.

Colección de componentes de React construidos con **Tailwind CSS** y **React Aria**. Como shadcn/ui, el código **se copia al proyecto** en vez de instalarse como dependencia: no hay paquete compilado ni dependencia de la que depender después.

## Qué trae

- Componentes base, secciones de marketing y paneles de aplicación.
- Plantillas de página completas: paneles, ajustes, aterrizaje, blog, autenticación.
- Modo oscuro y temas mediante variables CSS, ya resueltos.
- TypeScript en todo.

## Lo que lo distingue: React Aria

La diferencia técnica con la mayoría de colecciones de Tailwind es que el comportamiento viene de **React Aria**, la librería de Adobe para primitivas accesibles.

Eso significa que la gestión del foco, la navegación por teclado, los roles ARIA y el comportamiento en lectores de pantalla vienen resueltos por una capa probada, en vez de estar reimplementados en cada componente. En un menú desplegable o un diálogo, que es donde la accesibilidad se rompe con más facilidad, la diferencia es real.

## Frente a shadcn/ui

Los dos se copian al proyecto y usan Tailwind. La diferencia está en la base:

| | Untitled UI React | [shadcn/ui](/libraries/shadcn-ui) |
| --- | --- | --- |
| Primitivas | React Aria (Adobe) | Radix UI |
| Alcance | Componentes, secciones y plantillas de página | Componentes |
| Modelo | Abierto con capa PRO de pago | Todo abierto |

Ninguna es mejor: si ya usas Radix en el proyecto, mezclar dos librerías de primitivas añade peso sin ganancia.

## Qué tener en cuenta

- **Revisa qué es abierto y qué es PRO** antes de diseñar una pantalla alrededor de un componente concreto.
- **Al copiar el código, el mantenimiento es tuyo.** Es la contrapartida de no tener dependencia: las mejoras posteriores del proyecto no llegan solas.
- **Requiere Tailwind CSS v4** en el proyecto.
