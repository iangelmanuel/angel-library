---
title: "security-audit — la skill de auditoría de seguridad de Cloudflare"
description: "Skill de código abierto con la que Cloudflare arrancó su harness interno de descubrimiento de vulnerabilidades: convierte al agente en un auditor que trabaja en seis fases con verificación independiente y hallazgos en JSON."
tags: [ai, skill, seguridad, auditoria, cloudflare, vulnerabilidades, pentesting, subagentes]
sidebar:
  order: 22
draft: false
tool: Cross-tool
resourceCategory: Repositorio oficial
github: https://github.com/cloudflare/security-audit-skill
technologies:
  - skills/ia-comandos/comando-security-audit
  - skills/ia-plugins/plugin-security-guidance
  - security/security-testing/security-sdlc-testing
note: Licencia MIT. Requiere un modelo con herramientas y subagentes en paralelo, Node.js para los validadores y un sandbox del sistema operativo para ejecutar código del objetivo.
warnings:
  - Si la auditoría compila, prueba o ejecuta el código auditado, hazlo en un sandbox sin red externa, con entorno saneado, límites de recursos y escritura solo en carpetas temporales.
  - Un hallazgo `needs_validation` no es una vulnerabilidad confirmada; no lo reportes como tal.
updatedAt: 2026-09-26
---

**security-audit** es la skill que Cloudflare usó como semilla de su sistema de descubrimiento de vulnerabilidades, descrito en [Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness). Ese harness creció hasta ser un sistema de varias etapas para toda su flota; la skill es el punto de partida para **un solo repositorio**.

Orquesta agentes aislados que recorren el código en seis fases y, lo más importante, **nunca deja que el agente que encontró un fallo sea el que lo confirma**.

## Instalación

Con la [Skills CLI](https://skills.sh):

```bash
npx skills add https://github.com/cloudflare/security-audit-skill \
  --skill security-audit
```

A nivel de usuario (todas las carpetas):

```bash
npx skills add https://github.com/cloudflare/security-audit-skill \
  --skill security-audit \
  --global
```

`npx skills --help` muestra cómo elegir el agente destino (Claude Code, Codex, Cursor, OpenCode…) y las opciones no interactivas.

## Uso

Abre el agente en el repositorio que quieres auditar y pídeselo en lenguaje natural:

```text
security audit this codebase
```

```text
find security vulnerabilities in ./src
```

```text
do a security review, output to ~/audits/my-project
```

La skill se activa sola cuando la petición encaja (auditoría de seguridad, buscar vulnerabilidades, pentest del código…). Hay dos modos:

- **Auditoría completa**: una petición directa de auditar o hacer pentest al código. Genera todos los artefactos.
- **Modo guía**: preguntas de seguridad o trabajo sobre una vulnerabilidad concreta. No genera informes salvo que los pidas.

La salida va por defecto a `~/security-audit-skill/<nombre-del-repo>/run-<N>`.

## Las seis fases

| # | Fase | Qué hace | Artefacto |
| --- | --- | --- | --- |
| 1 | Reconocimiento | Mapea arquitectura, fronteras de confianza, superficies de entrada, evidencia previa y cobertura determinista | `architecture.md`, `coverage-ledger.json` |
| 2 | Caza guiada por cobertura | Asigna «cazadores» aislados a unidades del ledger, registra qué comprobaron y usa críticos de cobertura para encontrar huecos | Candidatos |
| 3 | Validación de candidatos | Cada candidato único pasa a un verificador nuevo cuyo trabajo es **refutarlo** | Candidatos validados |
| 4 | Salida estructurada | Escribe registros `confirmed`, `needs_validation` y `rejected` y los valida contra el esquema | `findings.json` |
| 5 | Verificación independiente | Agentes nuevos comprueban las afirmaciones finales sobre el código; un reemplazo material recibe otro verificador | `findings.json` revisado |
| 6 | Informe neutral | Deriva los informes a partir de los registros verificados y del ledger | `REPORT.md`, `FINDINGS-DETAIL.md`, `NEEDS-VALIDATION.md` |

El agente principal ejecuta `validate-coverage-ledger.cjs` tras crear el ledger y tras cada actualización, y `validate-findings.cjs` en la fase 4 y después de cada reemplazo de la fase 5. Ambos validadores no tienen dependencias.

### Los tres veredictos

| Veredicto | Requisito |
| --- | --- |
| `confirmed` | Traza completa en el código y un resultado observado acotado |
| `needs_validation` | Un hecho exacto sin resolver; **sin severidad** |
| `rejected` | Un candidato refutado, que queda registrado |

### Ejecuciones acumulativas

Varias ejecuciones sobre el mismo repositorio se suman: la skill usa los ledgers y hallazgos previos para apuntar a los huecos, revalidar código que cambió y arrastrar la evidencia vigente, sin dar por cubierto el trabajo obsoleto o sin resolver. En las pruebas de Cloudflare, **una sola ejecución encontró aproximadamente la mitad** de las vulnerabilidades que sumaron varias.

## Archivos de la skill

| Archivo | Contenido |
| --- | --- |
| `SKILL.md` | Configuración, principios, terminología por plataforma, flujo y antipatrones |
| `RECONNAISSANCE.md` | Prompts y síntesis de la fase 1 |
| `HUNTING.md` | Orquestación, metodología de caza y reglas de validación de la fase 2 |
| `ATTACK-CLASSES.md` | Prompts de ataque base, comodín y «lo obvio» |
| `MEMORY-SAFETY-AND-BINARY.md` | Seguridad de memoria, binarios y kernel |
| `AI-AND-LLM.md` | Prompt injection, agentes/herramientas y manejo de salidas de LLM |
| `WEB-PROTOCOL-AND-AUTH.md` | Framing HTTP, caché y protocolos de autenticación |
| `CLIENT-SIDE.md` | Inyección en el DOM, confianza en mensajería, UI redress y prototype pollution |
| `SUPPLY-CHAIN-AND-RELEASE.md` | Dependencias, CI, releases, firmas, actualizaciones, plugins y extensiones |
| `CLOUD-AND-DEPLOYMENT.md` | IAM, IaC, contenedores, serverless, ingress y configuración en runtime |
| `PROTOCOLS-RPC-AND-MESSAGING.md` | RPC, serialización, colas, brokers, webhooks y streaming |
| `RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` | Recursos compartidos, cuotas, colas, workers y gasto del operador |
| `DATA-ISOLATION-AND-LIFECYCLE.md` | Aislamiento entre tenants, caché, búsqueda, exportación, backups, migraciones y borrado |
| `DESKTOP-MOBILE-AND-LOCAL-IPC.md` | Apps nativas, deep links, webviews, componentes exportados, daemons e IPC local |
| `VALIDATION-AND-REPORTING.md` | Fases 3 a 6 |
| `report-schema.json` | Esquema JSON de los tres veredictos |
| `validate-findings.cjs` / `.test.cjs` | Validador de `findings.json` y sus pruebas |
| `validate-coverage-ledger.cjs` / `.test.cjs` | Validador de `coverage-ledger.json` y sus pruebas |

## Principios de diseño

- **Solo se confirman fallos de frontera establecidos.** Una pista bloqueada pero con base en el código queda como `needs_validation`, con el hecho exacto que falta.
- **Validación adversarial.** Quien verifica nunca es quien encontró.
- **La severidad exige impacto**: probabilidad × impacto, no «se desvía de una checklist».
- **Un hueco de defensa en profundidad no es una vulnerabilidad.** Si la capa A impide el ataque, la ausencia de la capa B es una nota de hardening.
- **Más ejecuciones, más cobertura.**

## Requisitos

- Un agente de código con un modelo que soporte herramientas y **subagentes en paralelo**.
- Node.js para los validadores.
- Un **sandbox impuesto por el sistema operativo** para builds, tests, procesos, navegadores, emuladores, fuzzers y fixtures del objetivo: sin red externa, entorno saneado con lista blanca, límites de recursos y escritura solo en rutas temporales asignadas.

## Cuándo usarla

- Antes de publicar un servicio o una librería, como segunda opinión estructurada.
- Para repasar un repositorio heredado del que no conoces las superficies de ataque.
- Para alimentar un proceso de triage: el JSON validado se puede importar a un tracker.

No sustituye a una revisión humana ni a un pentest con alcance acordado. Audita solo código que te pertenece o para el que tienes autorización.

## Fuentes

- [Repositorio oficial](https://github.com/cloudflare/security-audit-skill)
- [Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness) — blog de Cloudflare
- Contacto: security-ai-research@cloudflare.com
