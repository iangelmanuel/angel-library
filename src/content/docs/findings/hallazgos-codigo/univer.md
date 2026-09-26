---
title: "Univer: tu propio Excel, Word o PowerPoint dentro de tu app"
description: SDK de código abierto para integrar hojas de cálculo, documentos y presentaciones editables en un producto, con motor de fórmulas, renderizado en Canvas, API Facade y ejecución en navegador o Node.js — pensado para que personas y agentes de IA editen el mismo contenido.
tags: [univer, spreadsheet, excel, documentos, presentaciones, sdk, typescript, node, ia, agentes]
sidebar:
  order: 13
draft: false
resourceCategory: Documentación oficial
official: true
website: https://univer.ai/
url: https://docs.univer.ai/
github: https://github.com/dream-num/univer
technologies:
  - frontend/react/react
  - packages/react-tanstack-table/tanstack-table
note: "Licencia Apache 2.0 para el núcleo. Colaboración en tiempo real, importar/exportar .xlsx/.docx, impresión, gráficos y SSR forman parte de Univer Pro (comercial)."
updatedAt: 2026-09-26
---

## En pocas palabras

[Univer](https://github.com/dream-num/univer) es un **SDK de ofimática**: te da las piezas para meter una experiencia de hoja de cálculo, documento o presentación **dentro de tu propio producto**, sin depender de una app alojada ni de una interfaz fija. Se define como «el harness de Office para agentes de IA»: agentes y personas trabajan sobre el mismo contenido.

No es solo un visor de archivos: es un framework para construir tu propia superficie de productividad.

- **Isomórfico**: la misma arquitectura en el navegador (con UI) y en Node.js (sin UI).
- **Todo es un plugin**: cada capacidad se añade, quita, reemplaza o carga en diferido.
- **API Facade** (`FUniver`) para trabajar con libros, hojas, rangos, documentos, fórmulas, comandos y eventos.
- **Motor de renderizado en Canvas** compartido por todos los tipos de documento, para superficies grandes y editables.
- UI integrable con React, Vue o Web Components.

## Qué se puede construir

| Área | Código abierto | Univer Pro |
| --- | --- | --- |
| **Sheets** (lo más maduro) | Libros, hojas, rangos, fórmulas, formato numérico, filtro y orden, validación, formato condicional, hipervínculos, comentarios, notas, tablas, buscar y reemplazar, dibujos | Colaboración, historial, importar/exportar, impresión, gráficos, tablas dinámicas |
| **Docs** | Modelo de documento y editor, listas, hipervínculos, comentarios, inserción rápida, dibujos | Colaboración, importar/exportar, impresión, columnas, callouts, bloques de código |
| **Slides** | Modelo y UI en desarrollo activo | Importar/exportar, gráficos y tablas |
| **Bases** | Arquitectura para productos de datos estructurados | Base de datos, fórmulas, vistas |
| **Runtime** | Navegador, Node.js headless, Web Worker/RPC, varias instancias | Servidor de colaboración, SSR, cálculo en servidor |

El núcleo abierto funciona por sí solo con Apache 2.0; Pro es opcional.

## Instalación rápida (modo preset)

Los *presets* son colecciones de plugins ya configuradas, con estilos y registros de la API Facade:

```bash
pnpm add @univerjs/presets @univerjs/preset-sheets-core
```

```ts
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core"
import UniverPresetSheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US"
import { createUniver, LocaleType, mergeLocales } from "@univerjs/presets"
import "@univerjs/preset-sheets-core/lib/index.css"

const { univerAPI } = createUniver({
  locale: LocaleType.EN_US,
  locales: { [LocaleType.EN_US]: mergeLocales(UniverPresetSheetsCoreEnUS) },
  presets: [UniverSheetsCorePreset({ container: "app" })]
})

univerAPI.createWorkbook({})
```

```html
<div id="app" style="height: 100vh"></div>
```

### Tres modos

| Modo | Cuándo |
| --- | --- |
| **Preset** | Quieres Sheets, Docs o Node funcionando con la mínima configuración |
| **Plugin** | Necesitas control fino: paquetes exactos, carga diferida, bundles más pequeños (`univer.registerPlugin(...)` uno a uno) |
| **Headless** | Procesar libros y documentos en el servidor, calcular fórmulas o automatizar sin UI |

Mantén todos los paquetes `@univerjs/*` en la **misma versión** de la misma línea de release.

## Flujos con agentes de IA

- **Edición programática**: los agentes inspeccionan y modifican contenido con APIs estructuradas, no simulando clics.
- **Verificación de la salida**: comprueban el resultado inspeccionando el contenido, con capturas renderizadas y diagnósticos de layout.
- **Worktrees**: el agente trabaja en un borrador aislado; una persona revisa los cambios y decide qué fusionar.

Proyectos del ecosistema construidos con Univer:

| Proyecto | Qué es |
| --- | --- |
| [Univer Workspace](https://github.com/dream-num/univer-workspace) | Espacio de trabajo autoalojable donde personas y agentes crean y revisan contenido; los agentes generan mini-apps (dashboards, informes) ligadas a celdas |
| [Univer CLI](https://github.com/dream-num/univer-cli) | Espacio de trabajo local en la terminal para que un agente cree, edite e inspeccione documentos |
| [univer-mcp](https://github.com/dream-num/univer-mcp) | Servidor MCP para manejar Univer Sheets en lenguaje natural |
| [univer-sdk-skills](https://github.com/dream-num/univer-sdk-skills) | Skills para que un agente de código integre Univer, desarrolle plugins o backends en Node |
| Integraciones | Plugins para DeepSeek Harness, WorkBuddy y OpenClaw |

## Compatibilidad

- **Navegadores**: Chrome/Edge ≥ 88, Firefox ≥ 90, Safari ≥ 14.1, Electron ≥ 12. Necesita `Intl.Segmenter` (polyfill: `@formatjs/intl-segmenter`).
- **React**: la UI está hecha con React 18; soporta 18 y 19, con compatibilidad mínima desde 16.9.
- **Node.js**: el modo headless requiere ≥ 18.17. Desarrollar el monorepo requiere Node ≥ 22.18 y pnpm ≥ 11.
- **Bundlers**: Vite, esbuild o Webpack 5 (el campo `exports` de `package.json` debe estar soportado).

## Probar el repositorio

```bash
git clone https://github.com/dream-num/univer.git
cd univer
pnpm install
pnpm dev   # workbench con Sheets, Docs y Slides
```

## Cuándo conviene

- Tu SaaS, herramienta interna o app de BI necesita una hoja editable de verdad (fórmulas, formato, validación), no una tabla.
- Quieres que un agente genere o modifique hojas y documentos que luego revisa una persona.
- Necesitas procesar libros en el servidor con el mismo modelo que usa el frontend.

Si solo necesitas mostrar datos tabulares con orden y filtros, una librería de tablas como [TanStack Table](/packages/react-tanstack-table/tanstack-table) es mucho más ligera. Revisa qué funciones son Pro antes de comprometerte: importar y exportar `.xlsx` no está en el núcleo abierto.

## Fuentes

- [Repositorio](https://github.com/dream-num/univer) · [Sitio](https://univer.ai/)
- [Documentación](https://docs.univer.ai) — [Instalación de Sheets](https://docs.univer.ai/guides/sheets/getting-started/installation), [Univer en Node.js](https://docs.univer.ai/guides/sheets/getting-started/node), [AI SDK](https://docs.univer.ai/ai), [Univer Pro](https://docs.univer.ai/guides/pro)
- [Referencia de la API Facade](https://docs.univer.ai/reference/classes/univer) · [Showcase](https://docs.univer.ai/showcase)
