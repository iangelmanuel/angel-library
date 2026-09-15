---
title: "ClawScan: revisar una skill de IA antes de instalarla"
description: "Arnés que corre varios escáneres de seguridad sobre una skill de agente y compara sus resultados, ejecutándose dentro de un contenedor en vez de en tu máquina."
tags: [seguridad, skills, agentes, escaner, docker, cli, openclaw]
sidebar:
  order: 12
draft: false
resourceCategory: developer-tools
official: true
website: https://clawscanner.app/
url: https://github.com/openclaw/clawscan
updatedAt: 2026-09-14
---

> Mantenido por **[OpenClaw](https://github.com/openclaw)** con licencia MIT.

Una skill de agente es texto con instrucciones, y a veces también scripts y dependencias. Al instalarla, ese texto entra al contexto de una herramienta que puede leer archivos, correr comandos y abrir red. [ClawScan](https://github.com/openclaw/clawscan) existe para revisar ese paquete **antes** de ese momento.

## Qué es exactamente

No es un escáner más: es un **arnés componible** que orquesta escáneres de terceros sobre la misma skill y pone los resultados uno al lado del otro. Entre los motores que integra:

| Motor                        | Procedencia                    |
| ---------------------------- | ------------------------------ |
| SkillSpector                 | NVIDIA                         |
| skill-scanner (AI Defense)   | Cisco                          |
| AI-Infra-Guard (`aig`)       | Tencent                        |
| Snyk Agent Scan              | Snyk                           |
| Socket CLI                   | Socket                         |
| VirusTotal API               | VirusTotal                     |
| AgentVerus                   | AgentVerus                     |
| Relyable                     | verificación funcional         |
| ClawScan Static              | escáner determinista propio    |

También analiza plugins de OpenClaw, no solo skills.

## Instalación y uso

```bash
pnpm add -g @openclaw/clawscan
```

```bash
clawscan ./mi-skill --scanner skillspector --scanner cisco
```

Por defecto la ejecución ocurre **en Docker**, no en tu sistema: el código sospechoso se analiza dentro del contenedor. Eso implica tener Docker corriendo para los escaneos locales. El sandbox se puede desactivar:

```bash
clawscan ./mi-skill --sandbox off
```

Desactivarlo es exactamente lo contrario de lo que pide el caso de uso: hazlo solo sobre código que ya revisaste a mano.

## Qué busca

Las categorías que cubren estos motores, en conjunto: patrones de código malicioso, exfiltración de datos, comandos destructivos, dependencias comprometidas, instrucciones que intentan cambiar el comportamiento del agente (prompt injection) y errores funcionales que hacen que la skill no haga lo que promete.

## Antes de confiar en el resultado

1. Comprueba que Docker esté activo; sin él, los escaneos locales no arrancan.
2. Varios motores piden **clave de API o variables de entorno** propias: sin configurarlas, ese escáner no aporta nada al informe.
3. Relyable no viene preinstalado y hay que configurarlo aparte.
4. Corre al menos dos motores: el valor del arnés está en comparar, no en un único veredicto.
5. Lee los hallazgos con el código delante — un aviso sin contexto no distingue entre una skill peligrosa y una que simplemente usa la red.

## Límites

- Ningún escáner estático detecta todo: una skill puede ser inofensiva en el análisis y peligrosa según lo que el agente decida hacer con ella.
- Un informe limpio no autoriza permisos amplios; sigue valiendo ejecutar el agente con el menor acceso posible.
- Los motores son de terceros y cambian: la lista de arriba es el estado que declara el repositorio en la fecha de consulta.
- Enviar la skill a APIs externas (VirusTotal, por ejemplo) significa compartir ese contenido con ese servicio.

## Fuentes

- [Repositorio y README de ClawScan](https://github.com/openclaw/clawscan)
- [Sitio oficial](https://clawscanner.app/)
