---
title: Excalidraw — diagramas y bocetos a mano alzada
description: Pizarra para dibujar diagramas, flujos y bocetos rápidos sin conocimientos de diseño; permite colaborar y exportar el resultado como imagen o diagrama editable.
category: applications
stack: apps-design
order: 2
tags: [excalidraw, diagramas, whiteboard, pwa]
website: https://excalidraw.com
related:
  - guides/architecture-modulos-limites
updatedAt: 2026-08-26
---

**Excalidraw** es una pizarra colaborativa para diagramas y bocetos con un estilo deliberadamente "dibujado a mano" — útil para diagramas de arquitectura, flujos y wireframes rápidos donde el objetivo es comunicar una idea, no producir un mockup de precisión pixel-perfect como Figma.

## Instalación: no hay app de escritorio oficial

Este es el punto que conviene aclarar antes que nada, porque genera confusión buscando en la web: Excalidraw **tuvo** una app de escritorio basada en Electron, y el propio equipo la **deprecó** en favor de la versión web, apostando por PWA (Progressive Web App) como camino hacia adelante.

La forma oficial de "instalar" Excalidraw es como PWA desde el navegador:

1. Abre [excalidraw.com](https://excalidraw.com/) en Chrome, Edge o cualquier navegador basado en Chromium.
2. En la barra de direcciones aparece un icono de instalar (o **Menú → Instalar Excalidraw**).
3. Queda como app independiente, con su propio icono, ventana y funcionamiento sin conexión — sin necesitar tienda de aplicaciones.

No hace falta instalarlo para usarlo offline: la propia página funciona sin conexión una vez cargada una vez. Lo que da la instalación como PWA es un acceso directo del sistema y una ventana sin la barra del navegador.

Existen wrappers de Electron no oficiales de terceros (buscando "excalidraw desktop" en GitHub aparecen varios) — no son del equipo de Excalidraw, y su nivel de mantenimiento varía. Para uso serio, la PWA oficial es la opción con soporte real.

## La biblioteca de formas

La barra superior tiene las herramientas básicas: rectángulo, rombo, elipse, flecha, línea, texto, y una herramienta de dibujo libre. Cada forma tiene un panel de propiedades a la izquierda: color de trazo, color de relleno, estilo de relleno (sólido, rayado, cross-hatch — el que le da el look "a mano"), grosor de línea y estilo de esquina.

Las **flechas** se conectan a las formas: si arrastras el extremo de una flecha cerca de un rectángulo, se ancla a él — mover el rectángulo después mueve la flecha con él. Es lo que hace viable un diagrama de arquitectura que cambia sin tener que redibujar las conexiones.

## Frames — agrupar sin fusionar

Un **Frame** en Excalidraw agrupa elementos visualmente y permite moverlos juntos, sin fusionarlos en un objeto único — a diferencia de un Group, un elemento puede entrar o salir del Frame simplemente arrastrándolo dentro o fuera de sus bordes. Útil para separar secciones de un diagrama grande (por ejemplo, "Frontend" y "Backend" como dos Frames dentro del mismo lienzo).

## Colaboración en vivo

El botón **Share** de la esquina superior genera un enlace de sesión colaborativa: quien lo abre edita el mismo lienzo en tiempo real, con cursores con nombre visibles, sin necesitar cuenta ni registro.

El contenido de una sesión colaborativa se cifra de extremo a extremo — el servidor de Excalidraw no puede leer lo que estás dibujando, solo retransmite los cambios cifrados entre quienes tienen el enlace. Cerrar la pestaña sin guardar localmente pierde el diagrama si nadie más lo tenía abierto: no hay persistencia en el servidor salvo que uses **Excalidraw+** (el producto de pago del mismo equipo, con guardado en la nube).

## Guardar y exportar

| Acción | Cómo |
| --- | --- |
| Guardar el archivo | `Ctrl/Cmd+S` descarga un `.excalidraw` (JSON) — es el formato nativo, reabrible y editable |
| Exportar imagen | Menú → Export image → SVG o PNG, con fondo transparente opcional |
| Copiar como código | Selecciona elementos → clic derecho → **Copy to clipboard as SVG/PNG** |
| Convertir a Mermaid | Menú → **Mermaid to Excalidraw** hace la conversión inversa: pega un diagrama Mermaid y lo convierte a formas editables |

El `.excalidraw` guardado localmente (o vía `localStorage` del navegador, que es donde vive el lienzo activo si no lo descargas) es el que hay que versionar en un repositorio si el diagrama documenta una decisión de arquitectura — el enlace de una sesión colaborativa no es permanente.

## Cuándo usarlo

Para un diagrama rápido en una reunión, un boceto de flujo antes de escribir código, o una arquitectura que se explica mejor con cajas y flechas que con prosa. No es la herramienta para un mockup de interfaz con precisión de píxel — ahí la herramienta correcta es [Figma](/guides/application-figma).

Fuentes: [documentación de Excalidraw](https://docs.excalidraw.com/) y el anuncio oficial de [deprecación de Excalidraw Electron](https://plus.excalidraw.com/blog/deprecating-excalidraw-electron).
