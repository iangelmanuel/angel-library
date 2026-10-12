---
title: e2e — tests E2E con pasos de IA y pasos deterministas
description: Framework de TesterArmy que mezcla objetivos en lenguaje natural con locators y aserciones fijas, cachea las acciones verificadas para no llamar al modelo y usa la misma API en web, iOS y Android.
tags: [testing, ai, e2e, playwright, mobile, ios, android]
sidebar:
  order: 3
draft: false
resourceCategory: Documentación del paquete
website: https://e2e.tester.army/docs
github: https://github.com/tester-army/e2e
technologies:
  - testing/testing-ai/testing-ai-principles
  - testing/testing-e2e/testing-playwright-practico
  - packages/node-midscene/midscene
  - ai/ai-sdk/ai-sdk-vercel
note: "Licencia Apache-2.0. Aún no llega a la 1.0: la API y la configuración pueden cambiar entre versiones menores. Requiere Node.js 24.8+ (o 22.22.3+ en la rama 22); en Windows, solo dentro de WSL."
warnings:
  - "La CLI envía telemetría anónima de uso (comandos, motores, dónde fallan las ejecuciones). Se desactiva con npx e2e telemetry disable o E2E_TELEMETRY_DISABLED=1."
  - "Cada agent.assert, agent.waitFor y agent.extract llama al modelo en todas las ejecuciones; solo agent.act se cachea. Una suite llena de aserciones en lenguaje natural cuesta tokens en cada CI."
updatedAt: 2026-10-12
---

**e2e** es un framework de tests end-to-end (E2E: pruebas que manejan la aplicación entera como lo haría un usuario) para web y móvil. Su idea central es que un mismo test puede combinar dos clases de paso:

- **Objetivos en lenguaje natural** — `agent.act('sube el plan a Pro')` — que un agente de IA resuelve mirando la pantalla.
- **Pasos deterministas** — `screen.getByRole('button', 'Guardar').tap()` y `expect(...)` — que no llaman a ningún modelo.

Lo publica **TesterArmy**, una plataforma comercial de testing con agentes; el framework es de código abierto (Apache-2.0, unas 9.000 estrellas en GitHub).

## Un test

```ts title="tests/checkout.e2e.ts"
import { test, expect } from "e2e"

test("un miembro sube a Pro", async ({ app, agent, screen }) => {
  await app.open("/settings/billing")

  await agent.act("upgrade the workspace to the Pro plan")
  await agent.assert("the invoice preview shows a prorated amount")

  await expect(screen.getByRole("status")).toContainText("Pro")
})
```

Tres _fixtures_ hacen todo el trabajo: `app` abre rutas o la app, `agent` ejecuta pasos con IA y `screen` da locators sin IA. La última línea es la importante: un `expect` determinista que comprueba el resultado del objetivo.

## Cómo decide entre IA y determinista

No decide solo: **lo decides tú** al escribir cada paso.

| Paso | API | ¿Llama al modelo? |
| --- | --- | --- |
| Objetivo | `agent.act` | Sí, salvo que la caché lo reproduzca |
| Aserción | `agent.assert`, `agent.waitFor`, `agent.extract` | Sí, siempre |
| Locator | `screen` y `expect` | No |

Un test sin pasos de agente no necesita modelo ni API key.

### La caché de reproducción

Aquí está la diferencia con otros enfoques de testing con IA. Cuando un `agent.act` termina y una comprobación **posterior** pasa (un `expect` sobre un locator, un `agent.assert`, un `waitFor`), el runner **graba las acciones** que hizo el agente: qué control tocó, identificado por rol, nombre, test id y contexto.

En la siguiente ejecución:

1. Comprueba que la pantalla inicial sea la misma ruta.
2. Busca cada control grabado y repite la acción, **sin llamar al modelo**.
3. Verifica que ocurrió el mismo cambio en la pantalla.
4. Si algo no coincide —un botón cambió de nombre, apareció un paso nuevo—, el agente retoma desde la pantalla actual.

El resumen de cada ejecución lo muestra:

```text
           AI  4.1k tokens · 2 model calls · anthropic/claude-sonnet-4.5
        Cache  4 replayed · 1 handed off · 1 missed
```

Por eso conviene **seguir cada `act` de una comprobación**: sin ella no se graba nada. Para valores que cambian en cada ejecución (un email con timestamp), se envuelven en `unique()` para que la caché no falle siempre:

```ts
import { unique } from "e2e"

const email = `ada+${Date.now()}@example.test`
await agent.act("sign up with email {email}", { params: { email: unique(email) } })
```

Las contraseñas se pasan como `Secret`: el modelo no las ve, y tras rellenar un secreto el intento deja de enviar capturas.

## Instalación

Necesitas Node.js 24.8+ y, para móvil, Xcode con un simulador o el Android SDK con un emulador.

```bash
npx e2e init
```

El asistente pregunta el motor (**Web (Playwright)** o **Mobile (iOS/Android)**) y el proveedor de modelo —o **None** para tests sin IA—, y escribe una configuración, un test de ejemplo y las dependencias. También ofrece instalar una _skill_ y la configuración MCP para tu agente de código.

```bash
npx e2e run
```

El test de ejemplo no llama al modelo, así que funciona sin API key.

### Configuración

```ts title="e2e.config.ts"
import type { E2EConfig } from "e2e"
import { web } from "@e2e-dev/web"
import { anthropic } from "@ai-sdk/anthropic"

export default {
  agents: { default: { model: anthropic("claude-sonnet-5-5") } },
  targets: [{ engine: web(), app: { url: "http://localhost:3000" } }]
} satisfies E2EConfig
```

Los modelos se configuran con proveedores del [AI SDK de Vercel](/ai/ai-sdk/ai-sdk-vercel): Vercel AI Gateway, OpenAI, Anthropic, Google y el resto de proveedores compatibles con llamadas a herramientas, además de modelos locales y suscripciones (ChatGPT, GitHub Copilot, OpenCode Console, SuperGrok) mediante `npx e2e login`. Cada proveedor necesita su variable (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`…).

Para móvil, se cambia el motor:

```ts title="e2e.config.ts"
import { mobile } from "@e2e-dev/mobile"

// ...
targets: [{ name: "ios", engine: mobile({ platform: "ios" }), app: { bundleId: "Settings" } }]
```

## Web y móvil con la misma API

| Paquete | Qué hace |
| --- | --- |
| `e2e` | SDK, runner y CLI |
| `@e2e-dev/web` | Chromium, Firefox y WebKit a través de Playwright |
| `@e2e-dev/mobile` | Simuladores iOS y emuladores Android a través de agent-device |
| `@e2e-dev/github` | Publica los resultados como comentario en el PR |
| `@e2e-dev/kernel`, `@e2e-dev/smol` | Navegadores alojados |
| `@e2e-dev/limrun`, `@e2e-dev/eas` | Simuladores y emuladores alojados |

El repositorio incluye proyectos de ejemplo con suites que pasan para Vite, Next.js, Astro, Expo, SwiftUI, Jetpack Compose, Kotlin Multiplatform y Flutter. La documentación trae workflows listos para GitHub Actions, Bitrise, Codemagic y EAS Workflows.

## Coste y flakiness

- **Coste.** Pagas tu propio modelo. Un `act` cuesta tokens la primera vez y cuando la UI cambia; después, la caché lo reproduce gratis. Las aserciones con IA cuestan siempre. `maxModelCalls` limita las llamadas por paso (25 por defecto, 100 como máximo).
- **Flakiness** (tests que fallan de forma intermitente). Los pasos de IA son probabilísticos: el mismo `act` puede tomar caminos distintos y un `assert` puede responder `ASSERTION_INCONCLUSIVE`. La caché reduce mucho la variación en las ejecuciones repetidas, y los `expect` deterministas anclan el resultado. Los fallos del proveedor (rate limit, 5xx) se distinguen de los fallos de la app y no invalidan la caché.
- **Regla práctica.** Usa IA para **navegar** por flujos largos o cambiantes y locators para **verificar** lo que importa. Si el texto exacto importa, usa un locator, no un `agent.assert`.

## Comparativa

| | e2e | Playwright | Midscene.js |
| --- | --- | --- | --- |
| Pasos | IA y deterministas en el mismo test | Deterministas | IA dentro de tests de Playwright o Vitest |
| Cómo ve la pantalla | Texto del árbol de accesibilidad, capturas cuando hace falta | DOM y locators | Principalmente visión (capturas) |
| Caché de acciones IA | Sí, verificada por aserciones | — | Caché propia de planificación y localización |
| Móvil nativo | iOS y Android, misma API | No (solo emulación de viewport) | Android e iOS con paquetes aparte |
| Runner | Propio | Propio (`@playwright/test`) | El de Playwright o Vitest |
| Madurez | Pre-1.0 | Muy madura | Estable |

- **Frente a [Playwright](/testing/testing-e2e/testing-playwright-practico):** e2e usa Playwright por debajo para la web. Si tus tests son estables y tus selectores también, Playwright puro es más rápido, gratis y predecible. e2e aporta cuando la UI cambia mucho, los flujos son largos o quieres la misma suite para móvil.
- **Frente a [Midscene.js](/packages/node-midscene/midscene):** Midscene se integra en tus tests de Playwright existentes y se apoya en visión; e2e es un runner completo con su propia API, centrado en el árbol de accesibilidad y en reproducir sin modelo lo ya verificado.

Ver también [Testing asistido por IA: criterios y límites](/testing/testing-ai/testing-ai-principles) para decidir qué partes deben seguir siendo deterministas.

## Límites

- Pre-1.0: espera cambios incompatibles.
- La caché se invalida al renombrar el test, cambiar la instrucción o cambiar de agente; cambiar el modelo no la invalida.
- En Windows hay que usar WSL.
- Una app con mala accesibilidad (controles sin rol ni nombre) obliga al agente a depender de capturas, que son más caras y menos fiables.

## Fuentes

- [github.com/tester-army/e2e](https://github.com/tester-army/e2e) — README.
- Documentación: [quickstart](https://e2e.tester.army/docs/quickstart), [conceptos](https://e2e.tester.army/docs/core-concepts), [caché](https://e2e.tester.army/docs/cache), [agentes](https://e2e.tester.army/docs/agents).
