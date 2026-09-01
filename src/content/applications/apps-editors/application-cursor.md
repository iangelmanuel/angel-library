---
title: Cursor — editor y agente de código
description: Editor de código basado en VS Code que incorpora un asistente capaz de explicar y modificar archivos; la guía enseña a controlar su contexto, revisar sus cambios y proteger datos sensibles.
type: guides
order: 2
tags: [cursor, editor, ai, agent, rules]
website: https://www.cursor.com
related:
  - skills/cursor/cursor-rules
  - skills/cursor/cursor-config
  - skills/skills-fundamentos/ai-tools-safe-workflow
updatedAt: 2026-08-25
---

**Cursor** es un editor de código con funciones de inteligencia artificial integradas para consulta, edición y trabajo mediante agentes. Mantiene una experiencia cercana a VS Code, pero añade contexto del repositorio, modelos y herramientas capaces de proponer o ejecutar cambios.

## Instalación

Cursor no se distribuye por winget ni Homebrew: el propio equipo mantiene un script de instalación y binarios directos.

```bash
# macOS y Linux — script oficial
curl https://cursor.com/install -fsS | bash
```

Windows, y quien prefiera no correr un script remoto, descarga el instalador desde la [página de descargas](https://cursor.com/downloads): `.exe` para Windows (x64/ARM64), `.deb`/`.rpm`/AppImage para Linux, universal para macOS. Antes de correr `curl | bash` de cualquier sitio, revisa qué hace: aquí el script solo descarga el binario y lo coloca en el PATH, sin pedir privilegios de root.

## Modelo de uso

```text
objetivo y restricciones
  → contexto relevante
  → plan o cambio propuesto
  → diff revisable
  → tipos, pruebas y build
  → aprobación humana
```

El agente acelera exploración e implementación, pero no conoce automáticamente las reglas del producto ni puede decidir por sí solo qué riesgo es aceptable.

## Contexto

Incluye solo los archivos, símbolos o documentación necesarios para la tarea. Más contexto no siempre significa mejor respuesta: también puede introducir decisiones antiguas, secretos o señales contradictorias.

- menciona el archivo o símbolo concreto;
- describe el resultado observable esperado;
- indica qué no debe cambiar;
- proporciona comandos de validación;
- separa exploración, implementación y revisión cuando el cambio sea amplio.

## Project Rules

Las reglas versionadas viven en `.cursor/rules` y usan archivos `.mdc`. Sustituyen al formato heredado `.cursorrules` para configuraciones nuevas.

```md title=".cursor/rules/testing.mdc"
---
description: Reglas al modificar pruebas
globs: ["**/*.test.ts", "**/*.spec.ts"]
alwaysApply: false
---

- Prueba comportamiento público, no estructura interna.
- Ejecuta la suite afectada antes de terminar.
- No actualices snapshots sin explicar el cambio visual.
```

Una regla eficaz es breve, accionable y tiene un ámbito claro. Un manual completo incluido en cada solicitud desperdicia contexto y puede ocultar instrucciones importantes.

## Memoria, reglas y documentación

Una memoria automática puede recordar una preferencia inferida. Una regla expresa una decisión deliberada. La documentación del proyecto continúa siendo la fuente humana. No conviertas una conversación temporal en política sin revisarla.

## Revisar trabajo del agente

1. lee el diff completo, incluidos archivos generados y configuración;
2. busca eliminaciones, permisos o dependencias no solicitadas;
3. confirma que no aparezcan tokens ni datos privados;
4. ejecuta pruebas relevantes y observa el resultado;
5. solicita explicación de decisiones que no puedas defender tú mismo;
6. divide el cambio si una sola revisión resulta inmanejable.

Aceptar cambios línea por línea sin entender el comportamiento traslada la velocidad del agente al costo de mantenimiento futuro.

## Privacidad

Cursor ofrece modos de privacidad y opciones de indexación. La documentación oficial indica que las solicitudes pasan por su backend para construir el prompt final. Antes de usarlo con código de empresa, revisa políticas internas, modo activo, proveedores de modelos, retención y clasificación de datos.

No incluyas secretos, datos personales ni material contractual en prompts o reglas. Usa archivos de ejemplo y valores anonimizados.

## Cuándo usarlo

Resulta especialmente útil para navegar un repositorio desconocido, preparar refactors acotados, generar casos iniciales de prueba y explicar errores. Mantén intervención humana alta en autenticación, migraciones destructivas, pagos, infraestructura y seguridad.

Fuentes: [Rules de Cursor](https://docs.cursor.com/context/rules) y [privacidad y seguridad](https://docs.cursor.com/account/privacy).
