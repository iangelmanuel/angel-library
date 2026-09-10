---
title: "Omarchy: entorno Linux opinionado para desarrollo y agentes"
description: Distribución Linux basada en Arch y Hyprland que reúne herramientas de desarrollo, terminal, edición y automatización en una instalación coherente.
type: resources
order: 10
tags: [omarchy, linux, arch, hyprland, terminal, desarrollo]
url: https://github.com/omacom/omarchy
website: https://omarchy.org/
resourceCategory: developer-tools
official: true
personalNote: Es una opción para quien quiere un entorno de trabajo completo y acepta aprender Linux; no es una librería que se añada a un proyecto Astro o Node.
updatedAt: 2026-09-10
---

## En pocas palabras

[Omarchy](https://omarchy.org/) es una distribución Linux opinionada, basada en Arch Linux, Hyprland y Quickshell. Está pensada como un entorno listo para desarrollar: incluye terminal, Neovim, Chromium, Obsidian, LibreOffice, Kdenlive, OBS, herramientas de IA y utilidades de consola.

La instalación reemplaza o comparte el sistema operativo según la opción elegida. Por eso debe estudiarse como infraestructura de desarrollo, no como una dependencia de JavaScript.

## Qué reúne

El manual oficial organiza el entorno alrededor de:

- aplicaciones de escritorio y herramientas de terminal;
- Neovim y configuración de shell;
- atajos, portapapeles, temas y personalización;
- monitores, red, seguridad, snapshots y mantenimiento;
- herramientas de desarrollo y agentes de IA;
- arranque dual y configuración de hardware.

El [manual de Omarchy](https://github.com/omacom/omarchy/tree/master/manual) es la fuente de procedimiento. La [guía de aprendizaje](https://learn.omacom.io/) contiene explicaciones más progresivas.

## Antes de instalar

1. Haz una copia de seguridad que puedas restaurar y prueba que el medio de instalación arranca.
2. Decide si usarás todo el disco, espacio libre o arranque dual.
3. Lee la sección de hardware y confirma que tu Wi-Fi, gráficos y monitor funcionan con Linux.
4. Ten claro que la instalación con todo el disco borra la unidad seleccionada.
5. Revisa las indicaciones de Secure Boot y TPM del manual para tu equipo; no las desactives sin entender las consecuencias.

La instalación habitual consiste en escribir la ISO en una USB, arrancar desde ella y seguir el instalador. Los detalles de particiones, cifrado y arranque cambian entre versiones, así que no copies una orden de una guía antigua sin contrastarla con el manual vigente.

## Primer recorrido para una persona desarrolladora

Después del primer arranque, avanza en este orden:

1. actualiza el sistema y aprende el gestor de paquetes;
2. configura teclado, idioma, red, monitores y atajos;
3. abre la terminal y prueba navegación, permisos, procesos y Git;
4. configura Neovim o tu editor preferido sin borrar la configuración de respaldo;
5. instala Node.js mediante el método recomendado por el proyecto y comprueba `node --version`;
6. crea un repositorio pequeño, ejecuta sus pruebas y practica un snapshot antes de personalizar más.

Este orden separa el aprendizaje del sistema de las decisiones del proyecto. Si algo falla, sabrás si el problema está en Linux, en el editor o en tu aplicación.

## Cuándo conviene

- cuando quieres una estación Linux reproducible y con decisiones visuales ya tomadas;
- cuando trabajas principalmente con terminal, Git, contenedores y editores configurables;
- cuando te interesa integrar herramientas de agentes en el mismo entorno;
- cuando aceptas mantener un sistema basado en Arch y resolver incidencias de hardware.

Puede ser excesivo para una persona que solo necesita ejecutar Node.js en Windows o macOS. Una máquina virtual, WSL o una distribución menos opinionada reducen el cambio de sistema.

## Límites y mantenimiento

- Es una distribución completa: una actualización puede afectar drivers, compositor o atajos.
- La comodidad inicial depende de que tu hardware sea compatible.
- El flujo está diseñado alrededor de Hyprland y herramientas elegidas por el proyecto; cambiar muchas piezas elimina parte de su ventaja.
- Los snapshots y las copias no sustituyen una copia externa de tus repositorios y datos.

Lee las notas de versión y el manual antes de actualizar. Para aprender comandos Linux sin instalarlo, practica primero en un contenedor o máquina virtual.

## Fuentes

- [Repositorio y código de Omarchy](https://github.com/omacom/omarchy)
- [Sitio oficial](https://omarchy.org/)
- [Manual de instalación y uso](https://github.com/omacom/omarchy/tree/master/manual)
- [Guías de aprendizaje](https://learn.omacom.io/)
