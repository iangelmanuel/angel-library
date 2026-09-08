---
title: "Portal de Spotify — enrutar el trabajo de E/S fuera del modelo caro"
description: "Artículo de ingeniería de Spotify y sus plugins públicos: cómo desviar lecturas masivas y código repetitivo de Claude Code hacia modelos más baratos, con una reducción media del 90% de tokens en ese tipo de tarea."
type: resources
order: 5
tags: [ia, agentes, claude-code, tokens, costes, enrutado, plugins, hooks]
url: https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90
github: https://github.com/spotify/portal-ai-plugins
resourceCategory: ia
personalNote: "La frase que justifica el artículo entero: la mayor parte de lo que hace un agente no es pensar, es E/S. El truco no es cambiar de modelo, es clasificar la tarea antes de elegirlo."
updatedAt: 2026-09-07
---

> Artículo de **Dimitri Mazmanov** (Principal Product Manager) en el blog de ingeniería de Spotify, publicado el **3 de septiembre de 2026**. Los plugins que describe son públicos, con licencia **Apache-2.0**, en [spotify/portal-ai-plugins](https://github.com/spotify/portal-ai-plugins).

El punto de partida es un dato incómodo: los responsables de ingeniería gastan hoy entre **200 y 500 dólares al mes por desarrollador** en tokens, y algunos superan los 2.000. La proyección del artículo es que hacia 2028 el coste de las herramientas de IA supere al salario medio de un desarrollador.

La observación que cambia el enfoque es más interesante que el gasto: _«la mayor parte de lo que un agente de programación hace por mí no es pensar. Es E/S»_. Leer diez archivos para responder una pregunta, generar tests repetitivos o actualizar documentación no necesita un modelo de frontera; consume su contexto igual.

## La idea

En lugar de reducir el uso del agente, **se clasifica cada tarea antes de decidir qué modelo la ejecuta**. Las tareas de entrada/salida se desvían a modelos más baratos y el modelo caro se reserva para razonar: depurar, decidir arquitectura, revisar código sensible.

Spotify lo implementa sobre **Portal**, su plataforma interna, cuyos _AiKA Modes_ son agentes declarativos en tiempos de ejecución efímeros —la comparación del artículo es «Lambda para cargas de IA»—: se definen instrucciones, modelo, parámetros y herramientas MCP sin gestionar infraestructura ni claves.

## Las tres capas del enrutador

El plugin de Claude Code se llama **shunt** y funciona en tres niveles:

**1. Hooks.** Interceptan la operación antes de que ocurra, con `PreToolUse`:

- `check-file-size` bloquea las lecturas de más de **350 líneas** (ajustable con `SHUNT_MIN_LINES`) y redirige al modo de lectura masiva.
- `check-bash-read` caza el mismo intento por la puerta de atrás: `cat`, `head`, `tail`, `less`, `more` sobre archivos grandes.

**2. Scripts.** Dos envoltorios en bash que llaman al CLI de Portal: `bulk-read` manda varios archivos con una pregunta, y `code-write` manda una especificación con archivos de referencia.

**3. Skills.** Documentación en Markdown que le enseña al agente **cuándo** y **cómo** invocar esos scripts. La capa que evita tener que recordarlo a mano.

## Los dos modos

| Modo | Para qué | Modelo | Instrucción clave |
| --- | --- | --- | --- |
| `bulk-reader` | Leer varios archivos grandes y responder una pregunta | Gemini 2.5 Flash, temperatura 0.2 | _«Solo viñetas estructuradas. Sin saludos, sin prosa, sin preámbulo.»_ |
| `code-writer` | Generar salida predecible: tests, configuraciones, tipos | Gemini 2.5 Flash, temperatura 0.2 | Devolver solo el código, sin explicaciones |

Ambos son configurables: el modelo no está fijado en el diseño, sino en el modo.

## El resultado medido

Sobre un monorepo de Java, la lectura masiva ahorró de media **cerca del 90%** de los tokens que Claude habría consumido. El segundo caso es más difícil de medir con honestidad, y el artículo lo dice: el código generado **nunca entra en el contexto** del agente porque se escribe directamente en disco.

## Replicarlo

```bash
claude plugin marketplace add spotify/portal-ai-plugins
claude plugin install portal@portal
claude plugin install shunt@portal
```

Después, `/portal:setup` dentro de Claude Code para autenticarse contra una instancia de Portal, y `SHUNT_MIN_LINES` en el perfil del shell o en `.claude/settings.json` para mover el umbral de líneas.

## Qué mirar de cerca

- **Necesita Portal.** Los flujos llaman al CLI (`npx @spotify/portal-cli`) contra una instancia de Portal. Los plugins son públicos y Apache-2.0, pero **no funcionan sueltos**.
- **Lo que no se puede delegar.** Editar no: los resúmenes no traen números de línea fiables. Tampoco razonar ni analizar código crítico para la seguridad.
- **La latencia manda.** Cada delegación cuesta entre **10 y 30 segundos** de red, así que desviar archivos pequeños sale peor que leerlos.
- **La idea sí es portable.** Aunque no tengas Portal, las dos piezas que se pueden copiar hoy son el _hook_ que bloquea lecturas grandes antes de que ocurran y el criterio de fondo: **enrutar por tipo de tarea, no por modelo favorito**.
