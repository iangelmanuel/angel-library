---
title: "AX: el orquestador de agentes de Google, declarativo y con sandbox"
description: Orquestador de código abierto escrito en Go que ejecuta agentes de IA en un clúster de Kubernetes — defines la tarea en YAML y AX la aísla en un sandbox con límites de CPU y memoria, prepara su workspace y deja pausarla, reanudarla o inspeccionarla.
tags: [ax, google, agentes, orquestacion, go, kubernetes, sandbox, yaml, mcp]
sidebar:
  order: 20
draft: false
resourceCategory: ia
official: true
github: https://github.com/google/ax
technologies:
  - applications/apps-orchestration/herdr
  - devops/docker-conceptos/docker-contenedores-vs-vms
note: Licencia Apache 2.0. API en `ax.io/v1alpha1`; el proyecto avisa de que habrá cambios incompatibles antes de una versión estable.
warnings:
  - Requiere un clúster de Kubernetes con Agent Substrate instalado; no es una herramienta para ejecutar un agente en tu portátil.
updatedAt: 2026-09-26
---

## En pocas palabras

[AX](https://github.com/google/ax) es un orquestador declarativo de Google para ejecutar cargas de agentes autónomos en un clúster, pensado para escalar a miles de millones de tareas. Si has usado Kubernetes, `ax` te resultará familiar: escribes manifiestos YAML y los aplicas.

La motivación: un agente no es un microservicio sin estado ni un job que termina. **Acumula estado, necesita aislamiento estricto, llama a APIs de modelos y a servidores de herramientas, y si nadie lo vigila puede quemar dinero en un bucle.** AX resuelve eso con tres primitivas pequeñas.

## Las primitivas

| Quieres… | AX te da |
| --- | --- |
| Ejecutar código de agente no confiable en un sandbox con límites de CPU y memoria | **`Task`** |
| Tener repos Git, servidores MCP y paquetes de skills listos para que cada agente arranque en caliente | **`Workspace`** |
| Configurar qué LLM usa la plataforma, con credenciales en un secret de Kubernetes | **`Model`** |
| Pausar un agente inactivo y retomarlo exactamente donde estaba | `ax suspend` / `ax resume` |
| Entrar en un agente en ejecución para ver qué hace | `ax ssh` |

## Una tarea en YAML

```yaml
# task.yaml
apiVersion: ax.io/v1alpha1
kind: Workspace
metadata:
  name: golang
spec:
  git:
    - repo: https://github.com/golang/go.git
      branch: "my-fix"
---
apiVersion: ax.io/v1alpha1
kind: Task
metadata:
  name: test
spec:
  workspaces:
    - name: golang
      goal: "Ensure that Go tool chain is available and is built from source"
  debug: true   # permite `ax ssh` dentro del sandbox
```

```bash
ax apply -f task.yaml
ax watch task test
ax ssh test -- ls -al /workspace
```

### Límites de recursos

Una `Task` declara imagen, comando, variables y **requests/limits** de CPU y memoria, igual que un pod:

```yaml
spec:
  image: "ghcr.io/my-org/my-agent-image"
  command: ["python", "agent.py"]
  resources:
    requests: { cpu: "500m", memory: "1Gi" }
    limits:   { cpu: "2",    memory: "4Gi" }
  workspaces:
    - name: default-workspace
      path: "/workspace"
      goal: "Install dependencies and run the test suite"
```

El `goal` de un workspace describe el estado en que debe quedar preparado en el primer arranque. Una tarea puede montar varios workspaces (el código a trabajar y un set de herramientas compartido, por ejemplo).

### Workspace con MCP y skills

```yaml
kind: Workspace
spec:
  git:
    - name: origin
      repo: "https://github.com/chalk/chalk.git"
      branch: "main"
  files:
    - path: "AGENTS.md"
      content: |
        - Run `go test ./...` before submitting changes.
  mcp:
    servers:
      - name: git-tools
        endpoint: "http://git-mcp.default.svc.cluster.local:8080"
  skills:
    path: "/.agents/skills"
```

### Model

```yaml
kind: Model
metadata:
  name: claude-model
spec:
  provider: anthropic        # o google
  model: claude-opus-5
  secretKey:
    name: anthropic-api-secret
    key: ANTHROPIC_API_KEY
  parameters:
    maxTokens: 16000
```

La clave vive en un secret (`kubectl create secret generic anthropic-api-secret --from-literal=ANTHROPIC_API_KEY=...`), no en el manifiesto.

## Instalación

Requisitos: un clúster con [Agent Substrate](https://github.com/agent-substrate/substrate) (namespace `ate-system`), Go, `kubectl`, [`ko`](https://ko.build/) y un registro de contenedores accesible desde el clúster.

```bash
kubectl get svc api -n ate-system          # comprobar que Substrate responde
go install github.com/google/ax/cmd/ax@latest
make deploy AX_IMAGE_REPO=<tu-registro>    # despliega Redis y el plano de control en ax-system
ax apply -f examples/task.yaml
```

`./demo.sh` recorre el ciclo completo: aplicar, esperar, ejecutar comandos por `ax ssh` y suspender.

## CLI

Tiene forma de `kubectl` y habla con el plano de control por gRPC:

```bash
ax get tasks                     # listar (NAME, ATESPACE, PHASE, ACTOR, WORKER-IP, AGE)
ax describe task task123
ax watch task task123            # cambios de fase y condiciones en vivo
ax suspend task task123          # checkpoint y pausa
ax resume task task123
ax delete task task123
ax ssh task123 -- python3 main.py
ax get workspaces | ax get models
ax ctx                           # contexto activo y cómo se conecta
ax --context=dev-cluster get tasks
```

Sigue el contexto de `kubectx`. Flags globales: `-a/--atespace`, `-n/--namespace` (`ax-system`), `--context` y `--server` (o `$AX_SERVER`).

## Cuándo conviene

- Plataformas que ejecutan muchos agentes para muchos usuarios y necesitan aislarlos.
- Equipos que ya operan Kubernetes y quieren tratar a los agentes como una carga más.
- Tareas largas que conviene pausar sin perder el estado.

Para uno o dos agentes locales, un sandbox con Docker o un worktree por agente es mucho más simple.

## Límites

- AX limita **CPU y memoria** y aísla la ejecución; el gasto en tokens del modelo lo sigues controlando tú (límites en el proveedor, `maxTokens`, suspender tareas inactivas).
- Proyecto en fase alfa: conceptos, protocolos y especificaciones pueden cambiar.
- Depende de Agent Substrate, que añade su propia operación.

## Fuentes

- [Repositorio y README](https://github.com/google/ax)
- Documentación del repo: [Conceptos](https://github.com/google/ax/blob/main/docs/concepts.md), [Manifiestos](https://github.com/google/ax/blob/main/docs/manifests.md), [Sandbox](https://github.com/google/ax/blob/main/docs/sandbox.md), [Arquitectura](https://github.com/google/ax/blob/main/DESIGN.md), [Roadmap](https://github.com/google/ax/blob/main/docs/roadmap.md)
- [Agent Substrate](https://github.com/agent-substrate/substrate)
