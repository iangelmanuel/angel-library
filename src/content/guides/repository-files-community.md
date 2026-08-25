---
title: Archivos esenciales y documentación comunitaria
description: README, CONTRIBUTING, LICENSE, SECURITY, CODEOWNERS, plantillas, configuración y archivos que hacen entendible un repositorio.
category: git
stack: repository-management
order: 2
tags: [github, readme, contributing, codeowners, repository]
related:
  - guides/repository-management-fundamentals
  - guides/repository-licenses
  - guides/repository-rules-security
updatedAt: 2026-08-25
---

Los archivos de raíz forman el contrato operativo del proyecto. Algunos ejecutan herramientas; otros explican expectativas a personas y plataformas como GitHub.

## Mapa recomendado

```text
.
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── SUPPORT.md
├── CHANGELOG.md
├── .gitignore
├── .editorconfig
├── .env.example
├── package.json
├── pnpm-lock.yaml
└── .github/
    ├── CODEOWNERS
    ├── pull_request_template.md
    ├── ISSUE_TEMPLATE/
    │   ├── bug.yml
    │   ├── feature.yml
    │   └── config.yml
    ├── dependabot.yml
    └── workflows/
```

No todos son obligatorios. Añádelos cuando resuelvan una necesidad real y mantenlos como parte del producto.

## Qué responde cada archivo

| Archivo | Debe responder |
| --- | --- |
| `README.md` | qué es, para quién, estado, instalación, uso y enlaces principales |
| `CONTRIBUTING.md` | cómo preparar entorno, rama, pruebas, commits y Pull Request |
| `LICENSE` | qué permisos y obligaciones tiene quien reutiliza el trabajo |
| `SECURITY.md` | versiones soportadas y canal privado para vulnerabilidades |
| `CODE_OF_CONDUCT.md` | comportamiento esperado y proceso ante incumplimientos |
| `SUPPORT.md` | qué consultas se atienden y dónde pedir ayuda |
| `CHANGELOG.md` | cambios relevantes por versión para consumidores humanos |
| `.editorconfig` | reglas básicas de formato entre editores |
| `.env.example` | nombres y propósito de variables, nunca valores secretos |
| `CODEOWNERS` | personas o equipos responsables de rutas concretas |

## README orientado a tareas

El primer bloque debe permitir decidir si el proyecto sirve. Después debe permitir ejecutarlo.

```md
# Nombre del proyecto

Qué problema resuelve y para quién.

## Requisitos
## Instalación
## Variables de entorno
## Desarrollo y pruebas
## Arquitectura breve
## Despliegue
## Contribución, seguridad y licencia
```

Evita empezar con una historia extensa y esconder la instalación al final. Si el proyecto está incompleto, dilo de forma visible.

## Configuración compartida frente a preferencias personales

Versiona configuración del proyecto cuando mejora consistencia: extensiones recomendadas, formatter, lint, charset o final de línea. No impongas temas, tamaño de letra o atajos personales sin una razón de equipo.

```ini title=".editorconfig"
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
```

## Variables y secretos

```dotenv title=".env.example"
DATABASE_URL=postgresql://user:password@localhost:5432/app
SESSION_SECRET=replace-with-a-long-random-value
```

El ejemplo muestra formato, no credenciales válidas. El `.env` real debe estar ignorado y los secretos de CI deben vivir en el almacén de secretos de la plataforma. Si un secreto llegó a Git, eliminar el archivo no basta: se debe rotar la credencial y revisar el historial.

## CODEOWNERS

```text title=".github/CODEOWNERS"
*                    @equipo-core
/src/payments/       @equipo-pagos
/.github/            @mantenedores
```

`CODEOWNERS` solicita revisores automáticamente; solo se vuelve un requisito si una regla de rama exige su aprobación. Protege también el propio archivo para evitar que una PR cambie quién debe revisarla.

## Plantillas sin burocracia

Una plantilla debe solicitar información accionable, no producir casillas por costumbre. Para una PR suelen bastar propósito, evidencia, riesgo, migración y rollback. Para un bug: comportamiento actual, esperado, reproducción, entorno y evidencia sin datos sensibles.

Fuente oficial: [archivos comunitarios y plantillas en GitHub](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions).

