---
title: "REA: un MCP de ingeniería inversa para Claude Code, Codex y Cursor"
description: "Servidor MCP y CLI de código abierto que conecta tu agente con Ghidra, IDA, Hopper, JADX y otras herramientas para analizar binarios, apps Electron, ensamblados .NET, APKs y sitios web sin tener el código fuente."
tags: [ingenieria-inversa, mcp, ghidra, ida, binarios, agentes, seguridad, cli]
sidebar:
  order: 23
draft: false
resourceCategory: developer-tools
official: true
website: https://rea.tools/
github: https://github.com/morluto/rea
technologies:
  - agents/claude-code/claude-code-mcp
  - agents/codex/codex-mcp
  - agents/cursor/cursor-mcp
  - agents/agents-fundamentos/agent-safe-workflow
note: "Licencia MIT para el código de REA. Necesita Node.js 22.19+, 24.11+ o 26+. El análisis nativo usa Hopper, Ghidra o IDA, que instalas y licencias tú: REA no incluye ninguna licencia de esas herramientas."
warnings:
  - "La ingeniería inversa puede estar prohibida por el EULA o los términos de servicio del programa, y en algunas jurisdicciones por ley. Analiza solo software tuyo o que tengas permiso explícito para examinar."
  - "En videojuegos en línea, inspeccionar o modificar el cliente choca con los sistemas anti-cheat y suele acabar en baneo de la cuenta. El propio proyecto rechaza ayudar con trampas, saltarse DRM, licencias o anti-cheat."
  - "Los análisis en tiempo de ejecución ejecutan el programa con tus permisos de usuario: un binario desconocido debe analizarse en una máquina virtual o un entorno aislado."
  - "El análisis corre en local, pero los resultados (pseudocódigo, cadenas, rutas) se envían al proveedor del modelo que use tu agente."
updatedAt: 2026-10-12
---

> Proyecto de **[morluto](https://github.com/morluto)** con licencia MIT. Sitio con guías y casos reales en [rea.tools](https://rea.tools/).

[REA](https://github.com/morluto/rea) (*Reverse Engineer Anything*) es un **servidor MCP** que da a un agente de programación las herramientas para estudiar un programa del que no tienes el código fuente: binarios nativos, apps de JavaScript o Electron, ensamblados .NET, APKs de Android, firmware o sitios web. El agente lo llama, recibe los hallazgos con su evidencia y puede explicar cómo funciona una característica o reimplementarla en tu proyecto.

## Conceptos previos

**Ingeniería inversa** es deducir cómo funciona un programa a partir del programa compilado, no de su código fuente. Las herramientas clásicas son:

- **Desensamblador**: convierte el código máquina en instrucciones de ensamblador legibles.
- **Decompilador**: intenta reconstruir a partir de ese ensamblador un pseudocódigo parecido a C.
- **Análisis estático**: leer el archivo sin ejecutarlo (cadenas, símbolos, imports, referencias).
- **Análisis dinámico**: ejecutar el programa y observar lo que hace (procesos, archivos, tráfico de red).

Un **MCP** (Model Context Protocol) es el estándar con el que un agente se conecta a herramientas externas; aquí, REA pone esas herramientas de análisis al alcance del agente. Más detalle en [MCP en Claude Code](/agents/claude-code/claude-code-mcp).

## Qué puede analizar

REA no reinventa los decompiladores: **envuelve herramientas existentes** y unifica sus resultados.

| Objetivo | Qué devuelve | Qué necesita |
| --- | --- | --- |
| Binarios nativos | Pseudocódigo, ensamblador, cadenas, símbolos, llamadas y referencias | Hopper, Ghidra o IDA |
| Binarios de Go | Versión del compilador, módulos y ajustes de build | Nada extra |
| JavaScript / Electron | Módulos, imports, source maps, rutas, IPC y addons nativos | Node.js y npm |
| Sitios web | Estructura, scripts, tráfico de red y capturas | Un navegador de la familia Chrome |
| Capturas de red (HAR) | Peticiones, respuestas y datos expuestos | mitmdump en Linux para capturas de mitmproxy |
| Ensamblados .NET | Metadatos, instrucciones CIL y dependencias nativas | Nada (solo estático) |
| APKs de Android | Manifiesto, clases y métodos decompilados | JADX y un JDK completo |
| Dispositivos Android | Paquetes, procesos, logs y capturas de pantalla | adb |
| Firmware | Regiones y extracción | Binwalk o Unblob en Linux |
| WASM, bytecode EVM, crashes de Linux | Secciones, selectores, registros | WABT, pwntools, GDB según el caso |

También admite proyectos de JEB y recursos de Android vía Apktool. Ghidra tiene soporte para análisis de DOS de 16 bits y soporte experimental en Windows. El README no menciona radare2.

El análisis estático de JavaScript y .NET lee los archivos sin ejecutar nada; las capturas en tiempo de ejecución sí lanzan o interactúan con el programa.

## Instalación

Con Node.js y npm instalados:

```bash
npx rea-agents setup
```

El asistente pregunta qué agentes configurar (Claude Code, Codex, Cursor, Gemini CLI, Grok Build y otros), muestra los cambios que va a hacer, guarda copia de la configuración existente y añade el servidor MCP más unas instrucciones de flujo de trabajo (una skill). Después hay que reiniciar el agente.

Para tener el comando `rea` disponible siempre:

```bash
npm install --global rea-agents
rea --help
```

El proyecto cambia rápido y recomienda actualizar a menudo:

```bash
rea update
```

## Uso

Desde el agente, en lenguaje natural:

```text
Understand how search works in the Notes app, show me the evidence, and build a
similar feature for my project.
```

Desde la terminal, por ejemplo para una app Electron ya extraída o su archivo ASAR:

```bash
npx -y rea-agents@latest analyze-javascript-application /ruta/absoluta/a/la/app --json
```

Para binarios nativos hay que configurar antes un proveedor (Hopper, Ghidra o IDA). REA arranca Hopper cuando lo necesita; en macOS, la primera vez hay que resolver a mano el diálogo de licencia o modo demo.

## Casos publicados

El sitio documenta tres reconstrucciones completas, dos de ellas de videojuegos antiguos:

- **DX-Ball**: reconstruir en C el cálculo del paneo de sonido según la posición; la versión reconstruida reproduce los 63 bytes de la función compilada original.
- **Notion**: seguir la API del portapapeles desde el renderer de Electron, por el preload y el IPC, hasta el proceso principal.
- **TH04** (Touhou 4, PC-98): recuperar el cálculo de los anillos de balas a partir de instrucciones de 16 bits.

## Cuándo tiene sentido

- Entender cómo resuelve otra app un problema concreto para diseñar tu propia versión.
- Investigación de seguridad, análisis de malware y divulgación coordinada de vulnerabilidades.
- CTFs y aprendizaje.
- Interoperabilidad con un formato o protocolo sin documentar.
- Preservación de software antiguo, como los casos de juegos de DOS.

## Uso legal y ético

El descargo de responsabilidad del proyecto deja claro para qué **no** es: saltarse DRM, comprobaciones de licencia o anti-cheat, crear trampas para juegos o manipular servicios en línea, evadir autenticación, copiar software propietario o su código y recursos protegidos, y evadir las políticas de los proveedores de IA.

Algunas reglas prácticas:

1. **Lee el EULA** del programa. Muchos prohíben expresamente descompilar o desensamblar; las excepciones legales (interoperabilidad, investigación) varían por país.
2. **Que el archivo esté en tu disco no te da permiso** para cualquier operación: el propio descargo lo recuerda.
3. **Entender no es copiar**. Reimplementar una idea con tu propio código es distinto de reproducir el código o los recursos del original.
4. **Juegos en línea**: no lo uses sobre clientes con anti-cheat. Aunque solo quieras mirar, el riesgo de baneo y de incumplir los términos es real.
5. **Herramientas comerciales**: IDA, Hopper o JEB deben estar licenciados legalmente. REA no da licencias y prohíbe copias crackeadas o claves compartidas.
6. **Revisa lo que el agente propone ejecutar**. Autorizar inspeccionar un archivo no equivale a autorizar ejecutarlo, interceptar su tráfico o tocar un dispositivo.

## Fuentes

- [Repositorio y README de REA](https://github.com/morluto/rea)
- [DISCLAIMER.md](https://github.com/morluto/rea/blob/main/DISCLAIMER.md)
- [Sitio, guías y casos](https://rea.tools/)
- [Paquete en npm](https://www.npmjs.com/package/rea-agents)
