---
title: "CodeRabbit — revisión de pull requests con IA"
description: Servicio que revisa pull requests con IA en GitHub, GitLab, Azure DevOps y Bitbucket; gratis para repositorios públicos, con resumen de PRs gratuito en privados, configuración por .coderabbit.yaml, comandos en comentarios, CLI y extensión para el editor.
tags: [servicios, ia, code-review, github, pull-requests, gratis, open-source]
sidebar:
  order: 2
draft: false
resourceCategory: servicios
official: true
website: https://www.coderabbit.ai
url: https://docs.coderabbit.ai/
technologies:
  - skills/ia-skills/skill-code-review
  - skills/ia-plugins/plugin-code-review
  - git/github/gh-cli-pull-requests
  - git/git/git-workflow-colaborativo
note: "Los planes cambian: los límites de esta página son los de la documentación de planes de CodeRabbit a octubre de 2026. En repositorios públicos con menos de 10 estrellas la revisión hay que pedirla a mano."
warnings:
  - "La GitHub App pide lectura y escritura sobre código, pull requests, issues, checks y workflows: instálala solo en los repositorios que quieras revisar."
  - "Una revisión de IA no sustituye la revisión humana: puede dar falsos positivos y pasar por alto errores de lógica de negocio."
updatedAt: 2026-10-12
---

**CodeRabbit** es un revisor de código con IA que se instala en tu plataforma de Git. Cada vez que abres o actualizas un pull request, lee el diff con contexto del repositorio, escribe un **resumen** de los cambios y deja **comentarios en línea** con posibles bugs, problemas de seguridad, mejoras y sugerencias de código que puedes aplicar con un clic. Funciona con GitHub, GitLab, Azure DevOps y Bitbucket.

## Qué es una revisión de código (y por qué automatizarla)

En un flujo con pull requests (ver [flujo colaborativo](/git/git/git-workflow-colaborativo)), otra persona revisa los cambios antes de fusionarlos. Esa revisión atrapa errores, pero es lenta y depende de que alguien tenga tiempo. Un revisor automático hace una primera pasada en minutos: el humano llega con lo obvio ya señalado y se centra en diseño y lógica. Si trabajas solo o en un proyecto open source, es lo más parecido a tener un segundo par de ojos.

## Plan gratuito

A octubre de 2026, según la [página de planes](https://docs.coderabbit.ai/management/plans):

| Plan            | Qué incluye gratis                                                                                       | Límites por desarrollador                             |
| --------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Open source** | Repositorios públicos ilimitados, sin tarjeta, con funciones del plan Team                               | 1–10 revisiones de PR por hora según estrellas y comunidad del repo; 100–300 archivos por revisión |
| **Free**        | Repositorios públicos y privados ilimitados, sin tarjeta; **solo resumen de PRs**, sin revisión completa | 1 resumen de PR/hora; 3 revisiones/hora en IDE y 3 en CLI; 150 archivos |

Puntos que conviene leer con calma:

- En **repositorios privados** el plan gratuito resume el PR pero **no lo revisa**. La revisión completa en privado está en los planes de pago (Essentials, Team, Advanced, Enterprise; desde 24 USD por desarrollador al mes con pago anual) o en el editor y el CLI con su límite gratuito.
- En open source, los límites de revisión se aplican **por repositorio** y crecen con la popularidad del proyecto. En repos con **menos de 10 estrellas** no hay revisión automática: hay que pedirla con un comando.
- Las organizaciones nuevas empiezan con una **prueba de 14 días** del plan Advanced y, si no pagan, vuelven a Free.
- Solo se cobran asientos de quien abre pull requests.

## Instalación en GitHub

1. Entra en [app.coderabbit.ai](https://app.coderabbit.ai) y pulsa **Login with GitHub**.
2. Autoriza `coderabbitai` (lectura de organizaciones, equipos y email).
3. Elige dónde instalar la GitHub App: una organización o tu cuenta personal.
4. Elige el acceso a repositorios: todos (incluidos los futuros) o **solo los seleccionados**. Lo segundo es lo prudente; se puede cambiar después.
5. Revisa los permisos y pulsa **Install & Authorize**.
6. Abre un pull request (o lanza una revisión sobre uno existente): CodeRabbit publica el resumen, un check llamado "CodeRabbit" y, según tu plan, la revisión.

Para GitLab, Azure DevOps y Bitbucket el proceso es equivalente con la integración de cada plataforma.

## Configuración con `.coderabbit.yaml`

La configuración puede hacerse en el panel web, pero lo recomendable es versionarla en un archivo **`.coderabbit.yaml` en la raíz del repositorio**. CodeRabbit usa el que haya en la rama del PR que revisa, así que los cambios de configuración se pueden probar en el propio PR.

```yaml
# .coderabbit.yaml
language: "es-ES" # idioma de los comentarios
reviews:
  profile: "chill" # "assertive" para comentarios más exigentes
  request_changes_workflow: false
  high_level_summary: true
  auto_review:
    enabled: true
    drafts: false # no revisar PRs en borrador
```

Hay muchas más opciones (filtros de rutas, instrucciones por carpeta, herramientas de análisis estático) en la [referencia de configuración](https://docs.coderabbit.ai/reference/configuration). Si ya lo tienes configurado en el panel, el comando `@coderabbitai generate configuration` abre un PR con tu configuración actual en YAML.

## Comandos en comentarios

Se escriben como comentario en el PR, mencionando al bot:

| Comando                                   | Qué hace                                                    |
| ----------------------------------------- | ----------------------------------------------------------- |
| `@coderabbitai review`                    | Revisión incremental de los cambios nuevos                  |
| `@coderabbitai full review`               | Revisión completa de todos los archivos                     |
| `@coderabbitai pause` / `resume`          | Pausa o reanuda las revisiones automáticas en ese PR        |
| `@coderabbitai ignore`                    | En la descripción del PR: desactiva la revisión automática  |
| `@coderabbitai summary`                   | Marca dónde insertar el resumen en la descripción           |
| `@coderabbitai generate docstrings`       | Genera docstrings para el código del PR                     |
| `@coderabbitai generate unit tests`       | Genera tests unitarios                                      |
| `@coderabbitai resolve`                   | Marca como resueltos todos sus comentarios                  |
| `@coderabbitai rate limit`                | Muestra cuántas revisiones te quedan y cuándo vuelve a haber |
| `@coderabbitai configuration`             | Enseña la configuración efectiva y de dónde sale cada valor |
| `@coderabbitai help`                      | Lista de comandos                                           |

También puedes **responder a cualquier comentario del bot** para discutirlo: si le explicas una preferencia ("en este repo usamos early returns"), la guarda como **learning** y la aplica en revisiones futuras del repositorio o de la organización; su respuesta lo indica con una sección "Learnings Added".

## CLI y extensión del editor

CodeRabbit puede revisar **antes** de abrir el PR:

- **Extensión** para VS Code, Cursor y Windsurf: revisa los cambios locales desde el editor.
- **CLI** `coderabbit` (alias `cr`), pensado también para agentes de código como Claude Code, Cursor o Codex:

```bash
# macOS / Linux
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
# o con Homebrew
brew install coderabbit
```

En Windows (PowerShell): `irm https://cli.coderabbit.ai/install.ps1 | iex`.

```bash
cr auth login            # autenticación (añade --region eu para la región europea)
cr review                # revisa los cambios rastreados
cr review --uncommitted  # solo lo que no has commiteado
cr --base develop        # compara contra otra rama base
```

La opción `cr --agent` saca la revisión en NDJSON para que un agente la consuma. Para revisión de código con agentes sin servicio externo, compara con la [skill de code review](/skills/ia-skills/skill-code-review) o el [plugin de code review](/skills/ia-plugins/plugin-code-review).

## Privacidad

Según su trust center y su documentación: el código **no se usa para entrenar modelos** (ni por CodeRabbit ni por sus proveedores de LLM), el entorno de revisión se borra al terminar y la empresa tiene informe **SOC 2 Type II** y cumplimiento GDPR. Sí se guardan por defecto embeddings de los "aprendizajes" que salen de tus conversaciones con el bot y de los issues enlazados, para personalizar revisiones; se puede desactivar a costa de perder esa personalización. Si trabajas con código sujeto a contrato, revisa la política de privacidad vigente antes de instalarlo.

## Cuándo conviene y cuándo no

**Conviene** para proyectos open source (la revisión es gratis), equipos pequeños sin tiempo para revisar cada PR y para recibir resúmenes legibles de PRs largos.

**No conviene** como único filtro: los comentarios de IA pueden ser ruidosos o equivocados, y no conocen el contexto de producto. Úsalo como primera pasada y mantén la aprobación humana. Si el ruido molesta, `profile: "chill"` y las instrucciones por ruta reducen comentarios menores.

## Fuentes

- [coderabbit.ai](https://www.coderabbit.ai) y [precios](https://www.coderabbit.ai/pricing)
- [Planes y límites](https://docs.coderabbit.ai/management/plans)
- [Configuración YAML](https://docs.coderabbit.ai/getting-started/yaml-configuration)
- [Comandos de revisión](https://docs.coderabbit.ai/reference/review-commands)
- [CLI](https://docs.coderabbit.ai/cli)
- [GitHub App: instalación y permisos](https://docs.coderabbit.ai/platforms/github-com)
- [Learnings](https://docs.coderabbit.ai/knowledge-base/learnings)
- [Trust center](https://www.coderabbit.ai/trust-center)
