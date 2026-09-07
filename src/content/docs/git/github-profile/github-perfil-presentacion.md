---
title: Perfil público — bio, repos fijados y contribuciones
description: Los campos del perfil de GitHub, cómo elegir los repositorios destacados y qué cuenta realmente el gráfico de contribuciones.
type: guides
order: 2
tags: [github, perfil, contribuciones, organizaciones, privacidad]
scope: presentación pública del perfil
related:
  - git/github-profile/github-perfil-readme
  - git/github-platform/github-forks-upstream
updatedAt: 2026-08-26
---

Además del README, el perfil se compone de campos estructurados y de dos bloques que GitHub genera solo: los repositorios fijados y el gráfico de contribuciones. Conviene saber qué controlas y qué no.

## Los campos del perfil

Se editan en **Settings → Public profile**.

| Campo            | Límite               | Nota                                                                     |
| ---------------- | -------------------- | ------------------------------------------------------------------------ |
| Nombre           | —                    | Es un nombre para mostrar; el identificador real sigue siendo tu usuario |
| Bio              | 160 caracteres       | Admite mencionar a otras cuentas con `@`, pero no enlaces markdown       |
| Pronombres       | Lista + opción libre | Visible junto al nombre                                                  |
| Empresa          | —                    | Con `@organizacion` enlaza a esa organización                            |
| Ubicación        | —                    | Texto libre, sin geolocalización                                         |
| Sitio web        | 1                    | Se muestra como enlace                                                   |
| Cuentas sociales | 4                    | Enlaces con icono reconocido cuando el dominio es conocido               |

Cambiar el **nombre de usuario** es otra cosa y tiene consecuencias reales: GitHub crea redirecciones desde las URLs antiguas de repositorios, pero **no redirige los enlaces a tu perfil ni el remoto de quienes ya clonaron**, y libera tu nombre anterior para que otra persona lo registre. Si tienes proyectos que otros consumen, trátalo como una migración, no como un ajuste de perfil.

## Repositorios fijados

Puedes destacar hasta **seis** elementos: repositorios propios, repositorios a los que contribuiste y gists. Se eligen a mano desde el botón **Customize your pins**.

Es el bloque con mejor relación entre esfuerzo y efecto de todo el perfil, porque sustituye al listado por defecto — que ordena por actividad reciente y suele mostrar el repositorio donde probaste algo ayer.

Al elegirlos, ten en cuenta que de cada tarjeta solo se ven **el nombre, la descripción y el lenguaje principal**. Un repositorio sin descripción llega al perfil como una tarjeta muda, así que la descripción es parte del trabajo de fijarlo.

## El gráfico de contribuciones

Esta es la parte que más confusión genera, porque el gráfico **no cuenta todo lo que haces**.

Cuenta:

- Commits en la rama por defecto o en `gh-pages`.
- Issues y Pull Requests que abres.
- Revisiones de Pull Requests.
- Discusiones que abres o respondes.

No cuenta:

- Commits en ramas que nunca se integraron a la rama por defecto.
- Commits en un fork.
- Ediciones del wiki, comentarios sueltos o estrellas.

### Por qué a veces un commit no aparece

Casi siempre es el correo. Para que un commit cuente, **el correo del autor debe estar asociado y verificado en tu cuenta**. Comprueba con qué correo estás commiteando:

```bash
git config user.email
git log -1 --format="%an <%ae>"
```

Si no coincide con ninguno de tus correos verificados, el commit aparece en el repositorio pero no en tu gráfico. Se arregla añadiendo ese correo en **Settings → Emails**, y a partir de ahí GitHub recalcula el histórico.

Cuando el problema es que estás usando el correo equivocado en un proyecto concreto, configúralo por repositorio en lugar de cambiar el global:

```bash
git config user.email "tu@correo-verificado.com"
```

Para no exponer tu correo real, GitHub ofrece una dirección `noreply` con el formato `ID+usuario@users.noreply.github.com`, que encuentras en la misma pantalla de Settings. Cuenta igual para las contribuciones.

### Contribuciones privadas

Por defecto el trabajo en repositorios privados no se muestra. Puedes activar **Include private contributions on my profile**: los cuadros se rellenan pero sin revelar el repositorio ni el contenido — quien visita tu perfil ve actividad anónima.

## Organizaciones y visibilidad

La pertenencia a una organización es **pública o privada por separado en cada organización**, y por defecto suele ser privada. Si quieres que aparezca en tu perfil, se cambia desde la página de miembros de esa organización, no desde tus ajustes.

## Qué mirar antes de darlo por terminado

Un repaso corto que evita los fallos más comunes:

- Abre tu perfil **en una ventana privada**. Es la única forma de ver lo que ve alguien que no ha iniciado sesión, y es donde se descubre que algo estaba privado.
- Comprueba el perfil en tema claro y oscuro si el README lleva imágenes.
- Revisa que los repositorios fijados tengan descripción.
- Verifica que tu correo de commits esté entre los verificados.

El gráfico de contribuciones es una métrica de actividad, no de calidad ni de competencia. Optimizarlo con commits artificiales es visible para cualquiera que abra el historial, y produce el efecto contrario al buscado.
