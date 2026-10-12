---
title: "InditexTech: el open source del equipo técnico de Inditex"
description: "La organización de GitHub donde Inditex (Zara, Massimo Dutti, Bershka…) publica sus herramientas: servidores MCP para Microsoft Teams y el simulador de iOS, la pizarra colaborativa Weave.js, los guardarraíles de CerbIA y operadores de Kubernetes."
tags: [open-source, inditex, mcp, kubernetes, typescript, python, go, guardarrailes, colaboracion]
sidebar:
  order: 6
draft: false
resourceCategory: Sitio oficial
official: true
website: https://opensource.inditex.com
github: https://github.com/InditexTech
technologies:
  - agents/claude-code/claude-code-mcp
note: "La mayoría de proyectos son Apache-2.0. Las extensiones de k6 (xk6-*) son AGPL-3.0, y contribuir a varios repos exige firmar un CLA."
warnings:
  - "Un servidor MCP con credenciales de Teams lee y escribe mensajes en nombre de una aplicación de tu tenant. Dale los permisos mínimos y no lo conectes a canales con información sensible sin revisarlo."
  - "Weave.js avisa en su README de que su documentación necesita más rodaje fuera de Inditex. Cuenta con huecos al integrarlo."
  - "CerbIA devuelve señales heurísticas o de modelos, no una certificación de seguridad. No sustituye a otras defensas contra la inyección de prompts."
updatedAt: 2026-10-12
---

## En pocas palabras

[InditexTech](https://github.com/InditexTech) es la organización de GitHub donde el equipo técnico de **Inditex**, el grupo de Zara, Pull&Bear, Massimo Dutti, Bershka, Stradivarius, Oysho y Zara Home, publica sus contribuciones al software libre. Tiene unos 40 repositorios: proyectos propios nacidos de problemas internos y _forks_ de herramientas a las que contribuyen (Grafana, Micrometer, Hoppscotch, Spring Cloud Stream…).

El portal [opensource.inditex.com](https://opensource.inditex.com), en inglés y español, recoge los proyectos destacados y un **manifiesto FOSS**: adoptar open source de forma deliberada, apoyar a las comunidades de las que dependen y publicar con documentación, vías de contribución claras y guías de seguridad y cumplimiento. Las plantillas y el manifiesto viven en el repositorio [foss](https://github.com/InditexTech/foss).

Merece la pena seguirla porque son herramientas de una empresa con tráfico y equipos enormes, no proyectos de fin de semana: Java y Spring en el backend, Go en la plataforma, Kubernetes y, cada vez más, IA aplicada al desarrollo.

## Proyectos destacados

### MCP Teams Server

[mcp-teams-server](https://github.com/InditexTech/mcp-teams-server) es el proyecto más popular de la organización (unas 440 estrellas). Un **servidor MCP** es un programa que expone herramientas a un asistente de IA siguiendo el _Model Context Protocol_, para que el asistente pueda actuar sobre otro sistema (ver [MCP en Claude Code](/agents/claude-code/claude-code-mcp)). Este conecta con **Microsoft Teams** y permite:

- abrir hilos en un canal con título y contenido, mencionando a usuarios;
- responder en hilos existentes;
- leer las respuestas de un hilo y los mensajes de un canal;
- listar los miembros del equipo.

Está en Python 3.12 y se gestiona con `uv`:

```bash
git clone https://github.com/InditexTech/mcp-teams-server
cd mcp-teams-server
uv venv
uv sync --frozen --all-extras --dev
uv run mcp-teams-server
```

Necesita una aplicación registrada en Microsoft Entra ID y variables como `TEAMS_APP_ID`, `TEAMS_APP_PASSWORD`, `TEAMS_APP_TENANT_ID`, `TEAM_ID` y `TEAMS_CHANNEL_ID`. El transporte por defecto es `stdio`; con `--transport streamable-http` sirve por HTTP. También hay imagen en `ghcr.io/inditextech/mcp-teams-server`.

### MCP Server for iOS Simulator

[mcp-server-simulator-ios-idb](https://github.com/InditexTech/mcp-server-simulator-ios-idb) deja que un modelo controle los **simuladores de iOS** en lenguaje natural, apoyándose en [idb](https://github.com/facebook/idb), la herramienta de Meta para automatizar simuladores. Puede crear y arrancar simuladores, instalar y lanzar apps, tocar, deslizar y escribir, leer elementos de accesibilidad, grabar vídeo, capturar pantallas y logs, simular ubicaciones y más.

Requiere **macOS** con Xcode, Node.js 20 o superior y Homebrew:

```bash
git clone https://github.com/InditexTech/mcp-server-simulator-ios-idb.git
cd mcp-server-simulator-ios-idb
python3 -m venv venv
source venv/bin/activate
npm install
npm run build
npm start
```

La instalación añade `idb-companion` con Homebrew y `fb-idb` con pip dentro del entorno virtual. Después se registra en el cliente MCP apuntando a `dist/index.js`. Es útil para que un agente pruebe flujos de una app iOS sin que tú toques el simulador.

### Weave.js

[Weave.js](https://github.com/InditexTech/weavejs) es una biblioteca **headless** en TypeScript para construir aplicaciones colaborativas en tiempo real sobre **HTML5 Canvas**: pizarras, editores de diagramas y similares, con tu propia interfaz. _Headless_ significa que da la lógica (estado, interacción, sincronización) sin imponer los componentes visuales.

Por dentro:

- **Estado compartido** con [Yjs](https://github.com/yjs/yjs) y SyncedStore. Yjs es una implementación de **CRDT**, estructuras de datos que varios usuarios pueden editar a la vez y que convergen al mismo resultado sin un servidor que arbitre cada cambio.
- **Renderizado** con [Konva.js](https://konvajs.org/) y un _React Reconciler_ propio.
- Requisitos: Node.js 18.18 o superior y React 18 como dependencia _peer_ (todavía no React 19).

El arranque rápido crea un backend y un frontend de ejemplo:

```bash
pnpm create weave-backend-app
pnpm create weave-frontend-app
```

El backend queda en `http://localhost:8080` y el frontend en `http://localhost:3030`. Hay repos de ejemplo completos: [weavejs-frontend](https://github.com/InditexTech/weavejs-frontend) (TanStack Start, shadcn y Tailwind) y [weavejs-backend](https://github.com/InditexTech/weavejs-backend) (Express, Yjs y Azure Web PubSub). Según su README, lleva meses en producción en aplicaciones internas de Inditex. Documentación en [inditextech.github.io/weavejs](https://inditextech.github.io/weavejs).

### CerbIA

[CerbIA](https://github.com/InditexTech/cerbia) construye **puertas de seguridad** alrededor de las entradas y salidas de agentes de IA. Una puerta carga el contenido, lo preprocesa si hace falta, pasa una serie de escáneres, agrega el riesgo y devuelve un veredicto `SAFE` o `UNSAFE`. Los escáneres incluidos detectan texto invisible, palabras clave sospechosas, patrones de inyección de prompts, secretos, URL maliciosas y URL fuera de una lista permitida. Como extras opcionales hay detección de datos personales con Presidio y un detector local de inyección de ProtectAI.

Requiere Python 3.12 o superior:

```bash
pip install "cerbia[cli]"
cerbia validate examples/cli-usage/config.cerbia.yaml
cerbia scan --config examples/cli-usage/config.cerbia.yaml --text "A short message"
```

Encaja como primera línea de defensa antes de pasar contenido externo (correos, webs, documentos) a un modelo. Documentación en [inditextech.github.io/cerbia](https://inditextech.github.io/cerbia/).

### Kumoss

[Kumoss](https://github.com/InditexTech/kumoss) convierte peticiones en lenguaje natural en **infraestructura como código** (HCL compatible con Terraform) revisada y conforme a tus reglas. Lee tu código IaC y lo que hay desplegado de verdad, propone un cambio con un informe de impacto y coste, y bloquea la sesión para revisión humana si el cambio es de alto impacto o no cumple las normas. Es multinube (AWS, Azure, Google Cloud, Oracle Cloud y Kubernetes), usa cualquier modelo compatible con LiteLLM y cada integración es un servicio aparte detrás de un contrato OpenAPI. Está hecho con FastAPI y React.

## Tabla de repositorios

Estrellas aproximadas a octubre de 2026.

| Repositorio | Lenguaje | Estrellas | Para qué sirve |
| --- | --- | --- | --- |
| [mcp-teams-server](https://github.com/InditexTech/mcp-teams-server) | Python | 440 | Servidor MCP para leer y escribir en Microsoft Teams |
| [mcp-server-simulator-ios-idb](https://github.com/InditexTech/mcp-server-simulator-ios-idb) | TypeScript | 330 | Servidor MCP para controlar simuladores de iOS |
| [weavejs](https://github.com/InditexTech/weavejs) | TypeScript | 240 | Biblioteca para apps colaborativas en Canvas (pizarras, diagramas) |
| [k8s-overcommit-operator](https://github.com/InditexTech/k8s-overcommit-operator) | Go | 130 | Operador de Kubernetes que ajusta las _requests_ de CPU y memoria según clases de sobrecompromiso |
| [gh-sherpa](https://github.com/InditexTech/gh-sherpa) | Go | 90 | Extensión de GitHub CLI que crea ramas y PR a partir de issues de Jira o GitHub |
| [kumoss](https://github.com/InditexTech/kumoss) | Python | 70 | Infraestructura como código a partir de lenguaje natural, con guardarraíles |
| [scs-outbox](https://github.com/InditexTech/scs-outbox) | Java | 30 | Patrón _transactional outbox_ para Spring Cloud Stream |
| [karatetools-oss](https://github.com/InditexTech/karatetools-oss) | Java | 30 | Utilidades para proyectos de tests con Karate (arquetipo Maven y generación) |
| [cerbia](https://github.com/InditexTech/cerbia) | Python | 24 | Puertas de seguridad para entradas y salidas de agentes de IA |
| [redkey-operator](https://github.com/InditexTech/redkey-operator) | Go | 20 | Operador de Kubernetes para clústeres de Redis y Valkey |
| [xk6-sftp](https://github.com/InditexTech/xk6-sftp), [xk6-smb](https://github.com/InditexTech/xk6-smb), [xk6-grpcresolver](https://github.com/InditexTech/xk6-grpcresolver), [xk6-jsonparser](https://github.com/InditexTech/xk6-jsonparser) | Go | 15 c/u | Extensiones de k6 para pruebas de carga con SFTP, SMB, gRPC y JSON |
| [swagger-ui-plugin-diff-highlight](https://github.com/InditexTech/swagger-ui-plugin-diff-highlight) | JavaScript | 12 | Plugin de Swagger UI que marca los cambios de una API |
| [docouture](https://github.com/InditexTech/docouture) | JavaScript | 7 | Plataforma de documentación común basada en Antora para sus proyectos |
| [provider-ceph](https://github.com/InditexTech/provider-ceph) | Go | 5 | Proveedor de Crossplane para buckets S3 en varios clústeres Ceph |

Por ejemplo, gh-sherpa se instala como cualquier extensión de GitHub CLI:

```bash
gh extension install InditexTech/gh-sherpa
```

## Cómo aprovecharla

- **Si trabajas con agentes de IA**, los dos servidores MCP y CerbIA son lo más directamente útil: Teams para avisos y resúmenes de equipo, el simulador para que un agente pruebe apps iOS y CerbIA para filtrar lo que entra y sale del modelo.
- **Si construyes producto colaborativo**, Weave.js resuelve la parte difícil (sincronización con CRDT e interacción en canvas) y deja la interfaz en tus manos.
- **Si llevas plataforma**, los operadores de Kubernetes y las extensiones de k6 son piezas pequeñas y concretas que se pueden adoptar por separado.
- **Si quieres montar el open source en tu empresa**, el repositorio [foss](https://github.com/InditexTech/foss) es una plantilla real de manifiesto y documentación.

## Fuentes

- [Organización InditexTech en GitHub](https://github.com/InditexTech)
- [Portal Inditex Tech Open Source](https://opensource.inditex.com)
- [Manifiesto y plantillas FOSS](https://github.com/InditexTech/foss)
- READMEs de [mcp-teams-server](https://github.com/InditexTech/mcp-teams-server), [mcp-server-simulator-ios-idb](https://github.com/InditexTech/mcp-server-simulator-ios-idb), [weavejs](https://github.com/InditexTech/weavejs), [cerbia](https://github.com/InditexTech/cerbia), [kumoss](https://github.com/InditexTech/kumoss), [k8s-overcommit-operator](https://github.com/InditexTech/k8s-overcommit-operator) y [gh-sherpa](https://github.com/InditexTech/gh-sherpa)
