---
title: gh-secure — activar la seguridad de un repo en dos minutos
description: Extensión de GitHub CLI de GitHub Security Lab que activa protección de rama, reporte privado de vulnerabilidades, push protection, Dependabot y CodeQL en un repositorio público.
tags: [github, gh, security, dependabot, codeql, secret-scanning, branch-protection]
sidebar:
  order: 7
draft: false
scope: gh secure
resourceCategory: Repositorio oficial
official: true
url: https://github.com/GitHubSecurityLab/gh-secure
technologies:
  - git/repository-management/repository-rules-security
  - applications/apps-cli/gh-cli-instalacion-auth
  - security/security-infra/security-secrets-supply-chain
note: "Pensada para repositorios públicos, donde todas estas funciones son gratis. Necesitas permisos de admin o maintain; en repos de organización puede hacer falta el scope admin:org (gh auth refresh -s admin:org). Licencia MIT."
warnings:
  - "La protección de rama exige un pull request con una aprobación para fusionar en la rama por defecto. En un repo de una sola persona, nadie más puede aprobar: o fusionas como admin saltándote la regla o la ajustas después."
  - "Usa la protección de rama clásica (legacy), no rulesets. Si el repo ya tiene rulesets activos, la herramienta avisa; mezclar ambos sistemas puede dar reglas duplicadas o contradictorias."
updatedAt: 2026-10-12
---

**gh-secure** es una extensión de [GitHub CLI](/applications/apps-cli/gh-cli-instalacion-auth) publicada por **GitHub Security Lab**, el equipo de investigación de seguridad de GitHub. Con un comando activa en un repositorio las cinco protecciones que ese equipo recomienda para cualquier proyecto open source. No toca el código: solo cambia ajustes del repositorio a través de la API de GitHub.

Es la versión automatizada de lo que se explica en [Rulesets, automatización y seguridad del repositorio](/git/repository-management/repository-rules-security): útil cuando sabes qué quieres activar pero no quieres recorrer cinco pantallas de ajustes en cada repo.

## Instalación

Necesitas `gh` instalado y autenticado (`gh auth status`):

```bash
gh extension install GitHubSecurityLab/gh-secure
```

## Uso

```bash
# Modo interactivo: explica y pregunta por cada función
gh secure

# Ver qué está activado ahora mismo
gh secure status
gh secure status --repo owner/repo

# Simular sin cambiar nada
gh secure --yes --dry-run

# Activar todo sin preguntas
gh secure --yes

# Solo algunas funciones (nombre completo o abreviatura)
gh secure branch-protection dependabot
gh secure bp ss cs -y

# Otro repositorio
gh secure --repo owner/repo code-scanning
```

| Flag | Qué hace |
| --- | --- |
| `-r`, `--repo <owner/repo>` | Repositorio destino (por defecto, el del directorio actual) |
| `-y`, `--yes` | Activa sin pedir confirmación |
| `-n`, `--dry-run` | Muestra qué haría sin aplicar nada |
| `-v`, `--version` | Versión |
| `-h`, `--help` | Ayuda |

Sin nombres de función se incluyen las cinco. Si una ya está activa, la salta.

## Qué cambia exactamente

Leyendo el script (es un único archivo Bash que llama a `gh api`), estos son los cambios:

| Función | Abrev. | Qué activa | Llamada a la API |
| --- | --- | --- | --- |
| `branch-protection` | `bp` | Protección de la rama por defecto (ver abajo) | `PUT /repos/{repo}/branches/{rama}/protection` |
| `vulnerability-reporting` | `vr` | Reporte privado de vulnerabilidades (PVR) | `PUT /repos/{repo}/private-vulnerability-reporting` |
| `secret-scanning` | `ss` | _Push protection_ del secret scanning | `PATCH /repos/{repo}` con `secret_scanning_push_protection: enabled` |
| `dependabot` | `dep` | Alertas de Dependabot y PRs automáticos de seguridad | `PUT .../vulnerability-alerts` y `PUT .../automated-security-fixes` |
| `code-scanning` | `cs` | CodeQL en modo _default setup_ con la suite por defecto | `PATCH .../code-scanning/default-setup` |

### La protección de rama, en detalle

La regla que aplica sobre la rama por defecto (`main` o la que tengas):

- exige **pull request** con **1 aprobación** antes de fusionar;
- **descarta aprobaciones** cuando llegan commits nuevos (`dismiss_stale_reviews`);
- exige **resolver las conversaciones** del PR;
- **bloquea force push** y **borrado** de la rama;
- no exige revisión de CODEOWNERS ni checks de estado concretos;
- **no se aplica a administradores** (`enforce_admins: false`): un admin puede saltársela.

Ese último punto es lo que permite seguir trabajando en un repo personal, pero también significa que la protección no te frena a ti. Si tu CI tiene checks, añádelos después como obligatorios en los ajustes de la rama o en un ruleset.

### Las demás funciones

- **Reporte privado de vulnerabilidades.** Añade un botón para que cualquiera reporte un fallo de seguridad en privado, en `https://github.com/{repo}/security/advisories/new`, en lugar de abrir un issue público. El script **no crea** un `SECURITY.md`; al final te sugiere añadirlo si falta (ver [archivos de comunidad](/git/repository-management/repository-files-community)).
- **Secret scanning con push protection.** En repos públicos el escaneo ya viene activo; lo que añade es el bloqueo: un `git push` que contenga un token reconocido (más de 300 tipos de más de 180 proveedores, según la herramienta) se rechaza antes de llegar al repositorio.
- **Dependabot.** Avisa cuando una dependencia tiene una vulnerabilidad conocida y abre PRs para actualizarla. Tú decides si fusionarlos. No crea un `dependabot.yml`: las actualizaciones de versión rutinarias (no de seguridad) se configuran aparte.
- **CodeQL.** El análisis estático de GitHub se ejecuta en cada push y PR y reporta alertas. No bloquea fusiones salvo que lo configures. El repositorio debe tener algún lenguaje soportado; al activarlo dispara un primer análisis.

## Cómo revertirlo

No hay comando para deshacer. Todo se revierte a mano desde la web del repositorio, sin efecto sobre el código:

| Para quitar | Dónde |
| --- | --- |
| Protección de rama | _Settings → Branches_ → editar o borrar la regla |
| PVR, push protection, Dependabot, CodeQL | La página de seguridad de los ajustes: `https://github.com/{repo}/settings/security_analysis` (la misma que el script muestra al terminar) |

También puedes hacerlo con `gh api` y el método `DELETE` sobre los mismos endpoints (por ejemplo `gh api -X DELETE repos/owner/repo/branches/main/protection`).

## Cuándo usarlo

- Al **publicar un repo nuevo** o al hacer público uno privado: un `gh secure --yes` deja la base cubierta.
- Para **auditar** de un vistazo con `gh secure status` qué tiene activado cada repo.
- En lote, recorriendo tus repos con un bucle sobre `gh repo list`.

No es la herramienta adecuada si tu organización ya gestiona la seguridad con **rulesets** o configuraciones de seguridad a nivel de organización: ahí la protección de rama clásica estorba más de lo que aporta. Y en repositorios privados varias de estas funciones requieren GitHub Advanced Security, de pago; el script avisa de que está pensado para repos públicos.

## Errores frecuentes

- **403 Forbidden:** faltan permisos de admin/maintain o, en una organización, el scope `admin:org`.
- **Falla CodeQL:** el repo no tiene lenguajes soportados o el plan no incluye code scanning.
- **Falla la protección de rama:** la organización la restringe; si usas rulesets, puede que no la necesites.

## Fuentes

- [github.com/GitHubSecurityLab/gh-secure](https://github.com/GitHubSecurityLab/gh-secure) — README y script `gh-secure`.
- [Acerca del secret scanning](https://docs.github.com/code-security/secret-scanning/about-secret-scanning)
- [Reporte privado de vulnerabilidades](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
- [Acerca del code scanning](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning)
