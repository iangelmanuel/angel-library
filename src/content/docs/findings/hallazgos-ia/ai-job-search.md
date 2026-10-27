---
title: "AI Job Search: buscar trabajo con Claude Code desde tu propio repositorio"
description: "Plantilla de repositorio que convierte Claude Code en un asistente de búsqueda de empleo: crea tu perfil, busca y puntúa ofertas, adapta el CV y la carta en LaTeX con un agente revisor y prepara entrevistas."
tags: [ia, claude-code, empleo, cv, entrevistas, agentes, latex, plantilla, github]
sidebar:
  order: 25
draft: false
resourceCategory: ia
official: true
url: https://github.com/ai-job-search-dev/ai-job-search
technologies:
  - findings/hallazgos-recursos/midudev-plantillas-cv
  - findings/hallazgos-recursos/guia-entrevistas-devcaress
  - agents/claude-code/claude-code-slash-commands
  - agents/claude-code/claude-code-subagentes
  - agents/claude-code/claude-code-claude-md
note: "Requiere Claude Code con suscripción de pago o créditos de la API de Anthropic, además de Python 3.10+, Bun y una distribución de LaTeX. Licencia MIT."
warnings:
  - "Un fork de un repositorio público siempre es público, y /setup escribe en archivos versionados tus datos personales (contacto, historial laboral, expectativas salariales). Para uso propio, crea un repositorio privado en lugar de un fork."
  - "Las ofertas son entrada no confiable: el proyecto filtra texto oculto e instrucciones incrustadas, pero esas defensas son a nivel de instrucciones, no un sandbox. Revisa lo que se descargó y lo que se escribió antes de enviar nada."
  - "La búsqueda en LinkedIn usa endpoints públicos sin autenticar y su uso automatizado va contra los términos de servicio de LinkedIn: solo uso personal y a bajo volumen."
updatedAt: 2026-10-27
---

> Creado por **[Mads Lorentzen](https://github.com/MadsLorentzen)** con licencia MIT. El repositorio empezó en su cuenta personal y ahora vive en la organización [ai-job-search-dev](https://github.com/ai-job-search-dev). No está afiliado a Anthropic.

[AI Job Search](https://github.com/ai-job-search-dev/ai-job-search) es un repositorio que clonas, rellenas con tu perfil y usas desde Claude Code. No es una app ni un servicio: es un conjunto de **comandos, skills e instrucciones** que convierten al agente en un asistente para todo el proceso de buscar trabajo, desde encontrar ofertas hasta registrar el resultado de cada candidatura. Todo corre en tu máquina y tus datos se quedan en tu copia.

El autor, geofísico, lo construyó cuando perdió su puesto a finales de 2025 y según el README lo usó en su propia búsqueda: 69 candidaturas adaptadas, 20 primeras entrevistas y un contrato como ingeniero de IA en junio de 2026. Ronda las 66.000 estrellas y publica versiones con frecuencia (v1.7.3 en octubre de 2026).

## Conceptos en dos frases

- Un **slash command** es una orden que escribes dentro de Claude Code (`/apply`, `/setup`) y que ejecuta un flujo definido en un archivo Markdown del repositorio. Ver [comandos personalizados](/agents/claude-code/claude-code-slash-commands).
- Un **subagente** es una segunda instancia del modelo con su propio contexto, que el agente principal lanza para una tarea concreta. Aquí se usa para que un revisor critique lo que escribió el redactor. Ver [subagentes](/agents/claude-code/claude-code-subagentes).
- Un **ATS** (_applicant tracking system_) es el software con el que las empresas filtran CV. Lee el texto incrustado en el PDF, no lo que ves en pantalla.

## El flujo

Tres comandos forman el núcleo y el resto lo amplía:

| Comando         | Qué hace                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| `/setup`        | Construye tu perfil desde una carpeta de documentos, un CV pegado o una entrevista |
| `/scrape`       | Busca ofertas que encajen con tu perfil, elimina duplicados y las ordena       |
| `/apply`        | Evalúa el encaje y redacta, revisa y compila un CV y una carta a medida        |
| `/rank`         | Puntúa en bloque las ofertas encontradas y devuelve una lista corta            |
| `/interview`    | Prepara un dosier para una entrevista concreta y hace una simulación           |
| `/outcome`      | Registra el resultado, archiva lo enviado y redacta seguimientos               |
| `/upskill`      | Detecta qué habilidades te faltan y arma un plan de estudio                    |
| `/add-portal`   | Genera una skill de búsqueda para un portal de empleo de tu país               |
| `/add-template` | Registra tu propia plantilla de CV o carta (LaTeX, Typst u otra)               |

También hay `/expand`, `/gmail-sync`, `/notion-sync`, `/html-report` y `/reset`.

## Cómo funciona `/apply`

Es la parte con más diseño detrás:

1. Lee la oferta (URL o texto pegado) y la pasa por un filtro determinista que detecta texto oculto, caracteres invisibles y líneas con forma de instrucción.
2. Evalúa el encaje con tu perfil: habilidades, experiencia, cultura, ubicación y trayectoria.
3. Redacta el CV y la carta en LaTeX.
4. Lanza un **agente revisor** con contexto limpio que investiga la empresa y critica los borradores.
5. Revisa con ese feedback.
6. Compila los PDF y los inspecciona hasta que el CV ocupa exactamente 2 páginas y la carta 1, sin títulos huérfanos.
7. Extrae el texto del PDF como lo haría un ATS y comprueba datos de contacto, orden de lectura y palabras clave de la oferta.

La regla que se repite en todo el proyecto: **no inventar**. Las afirmaciones se verifican contra tu perfil, y una palabra clave que no puedes respaldar queda como hueco visible en lugar de meterse a la fuerza.

## Instalación

Necesitas Claude Code, Python 3.10+, [Bun](https://bun.sh) y una distribución de LaTeX con `lualatex` y `xelatex` (TeX Live, MacTeX, TinyTeX o MiKTeX). `pypdf` es opcional, para la comprobación ATS.

El README usa `gh repo fork`, pero avisa de que el fork será público. Para tu búsqueda personal, clona y apunta a un repositorio privado tuyo, dejando el original como `upstream` para recibir actualizaciones (lo explica la sección 8 de `SETUP.md`):

```bash
git clone https://github.com/ai-job-search-dev/ai-job-search.git
cd ai-job-search
git remote rename origin upstream
git remote add origin <url-de-tu-repositorio-privado>

python3 tools/install_portal_clis.py   # en Windows: python tools\install_portal_clis.py
```

Después, dentro de Claude Code:

```text
/setup
/scrape
/apply https://ejemplo.com/oferta/1234
```

Los archivos más sensibles (el registro de candidaturas, los datos salariales, `documents/` y el archivo de candidaturas) están en `.gitignore`. El perfil que genera `/setup` sí se versiona: vive en el [`CLAUDE.md`](/agents/claude-code/claude-code-claude-md) del repositorio y en los archivos de la skill principal.

## Fuera de Dinamarca

El flujo central es independiente del idioma y del país, pero las skills de portales que trae son danesas (Jobindex, Jobnet, Jobdanmark, Akademikernes Jobbank). Para otros mercados incluye dos opciones genéricas, `linkedin-search` y `freehire-search` (agregador de empleo tecnológico con API pública), y el comando `/add-portal` para generar la de un portal local. La comunidad comparte adaptaciones en un [hilo de discusiones](https://github.com/ai-job-search-dev/ai-job-search/discussions/78).

Si copias una skill de portal de otro fork, el README insiste en leer todo el código antes: esas CLI se ejecutan sin pedir permiso (están en la lista permitida de `.claude/settings.json`) y tienen acceso a tus datos.

## Cuándo conviene y cuándo no

**Conviene** si ya usas Claude Code, vas a enviar muchas candidaturas y quieres un proceso ordenado con seguimiento, en lugar de pegar ofertas sueltas en un chat.

**No conviene** si buscas algo sin coste ni instalación: necesita una suscripción de pago y una toolchain de LaTeX. Tampoco sustituye tu criterio: la calidad depende de lo detallado que sea tu perfil, y para la estructura del CV sigue siendo útil partir de una buena plantilla, como la de [Midudev](/findings/hallazgos-recursos/midudev-plantillas-cv), y de una [guía de entrevistas](/findings/hallazgos-recursos/guia-entrevistas-devcaress).

## Fuentes

- [Repositorio ai-job-search-dev/ai-job-search](https://github.com/ai-job-search-dev/ai-job-search): README, `SETUP.md` y releases
- [Licencia MIT](https://github.com/ai-job-search-dev/ai-job-search/blob/master/LICENSE)
