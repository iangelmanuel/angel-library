---
title: "nodeterm — terminales y agentes sobre un lienzo infinito"
description: "Proyecto que coloca terminales y sesiones de agentes como nodos arrastrables en un canvas; sirve para estudiar cómo una disposición espacial sustituye a las pestañas ocultas."
type: resources
order: 3
tags: [ia, agentes, terminal, tmux, electron, claude-code, canvas]
url: https://github.com/eneskirca/nodeterm
resourceCategory: ia
personalNote: "La idea que vale la pena robar no es el canvas: es que el estado vive en tmux, así que la interfaz puede morir y las sesiones siguen ahí."
updatedAt: 2026-09-01
---

> Creado por **[eneskirca](https://github.com/eneskirca)**, licencia BUSL-1.1 (pasa a MIT cuatro años después de cada publicación). Sitio oficial: [nodeterm.dev](https://nodeterm.dev).

**nodeterm** cambia la metáfora del multiplexor de terminal. En vez de apilar sesiones en pestañas, las coloca como **nodos arrastrables sobre un lienzo infinito** con desplazamiento y zoom. Cada terminal es real y sigue viva; lo que cambia es que la ves en un mapa en lugar de recordar en qué pestaña la dejaste.

Está pensado explícitamente para gente con TDAH y flujos de trabajo dispersos: la posición en el espacio hace de memoria externa.

## Qué explora

**Nodos de tipos distintos en el mismo plano.** Terminales, agentes, notas, editores y vistas de diff conviven como nodos y se enlazan entre sí. El contexto de una sesión de agente puede conectarse con el de otra.

**El proyecto como tablero kanban.** Cada proyecto es además un tablero estilo Trello donde las tarjetas **son** las sesiones en marcha, no una descripción de ellas: se arrastran entre columnas mientras corren. Se integra con GitHub Issues.

**Persistencia real.** Las sesiones sobreviven al cierre de la aplicación y al reinicio de la máquina, porque por debajo hay **tmux**. Al volver, se restauran el scrollback y el estado del agente.

**Varios agentes, una interfaz.** Claude Code, Codex, Gemini, GitHub Copilot y agentes propios.

## Cómo está hecho

Electron para el escritorio, React con **React Flow** para el canvas, **xterm** sobre **tmux** para las terminales y **Monaco** para el editor. Node.js 20+, TypeScript, Vite y Vitest.

Lo interesante en la arquitectura es la costura que llaman _CorePlatform_: separa el código específico de cada plataforma —Electron, servidor, móvil— de los servicios compartidos. El renderer solo depende de una abstracción `TerminalTransport`, de modo que una sesión local y una sesión SSH remota se manejan igual.

Eso habilita tres formas de usarlo: la app de escritorio, una **Server Edition** en el navegador mediante un puente WebSocket-RPC, y una app iOS aparte en SwiftUI que se empareja escaneando un código QR.

## Probarlo

```bash
# macOS
brew tap nodeterm/tap
brew trust nodeterm/tap
brew install --cask nodeterm
```

En Linux hay AppImage y paquete `.deb` en [nodeterm.dev/releases](https://nodeterm.dev/releases); en Windows sigue en beta, con instalador sin firmar y sin continuidad de sesión todavía.

Desde el código:

```bash
npm install
npm run dev
npm run server:dev   # edición navegador, en http://127.0.0.1:8443
```

Necesita Node.js 20+ y **tmux** para que la persistencia funcione (viene con macOS; en Linux hay que instalarlo).

## Qué mirar de cerca

- **Dónde vive el estado.** La interfaz es desechable porque la sesión está en tmux. Es la misma separación que hace que `screen` siga siendo útil cuarenta años después.
- **La licencia.** BUSL-1.1 no es open source en sentido estricto: permite usarlo y modificarlo, pero no ofrecerlo como producto competidor hasta que se convierte en MIT.
- **El coste de la metáfora.** Un lienzo infinito resuelve el "¿dónde dejé esa terminal?" y crea el "¿dónde está todo?". Merece la pena ver cómo lo acotan con el tablero kanban.
