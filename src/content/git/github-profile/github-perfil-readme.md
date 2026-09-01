---
title: README de perfil — el repositorio especial
description: El repositorio con tu propio nombre de usuario que GitHub muestra en la cabecera del perfil; qué markdown admite, qué se sanea y cómo mantenerlo actualizado.
type: guides
order: 1
tags: [github, perfil, readme, markdown, presentacion]
scope: repositorio especial de perfil
related:
  - git/github-platform/github-repositorio-configuracion
  - git/repository-management/repository-files-community
updatedAt: 2026-08-26
---

GitHub reserva un repositorio con un comportamiento especial: si creas uno cuyo nombre coincide **exactamente** con tu nombre de usuario y contiene un `README.md`, ese archivo se renderiza en la parte superior de tu perfil público.

Es la única superficie del perfil donde escribes contenido libre en lugar de rellenar campos de un formulario.

## Crear el repositorio

Tres condiciones, y las tres son obligatorias:

| Condición | Detalle |
| --- | --- |
| Nombre exacto | Idéntico a tu usuario, respetando mayúsculas: usuario `AngelDM` → repositorio `AngelDM` |
| Visibilidad | **Público**. En uno privado el README no se muestra en el perfil |
| Archivo | `README.md` en la raíz del repositorio |

Desde la terminal con GitHub CLI:

```bash
gh repo create TU-USUARIO --public --add-readme --clone
```

Si el nombre coincide, la propia interfaz de GitHub lo señala con un aviso de que has encontrado un repositorio secreto. Cuando creas el repositorio y no aparece nada en el perfil, revisa esas tres condiciones antes que ninguna otra cosa: casi siempre es la visibilidad o una mayúscula.

## Qué markdown admite

El README de perfil pasa por el mismo saneador que cualquier otro markdown de GitHub, con una consecuencia importante: **no se ejecuta JavaScript y la mayoría del HTML se filtra**.

| Funciona | No funciona |
| --- | --- |
| Markdown completo, incluidas tablas y listas de tareas | `<script>` y cualquier controlador de eventos (`onclick`) |
| Emoji con `:sparkles:` y emoji Unicode | CSS propio: `<style>` y atributos `style` |
| `<img>`, `<a>`, `<details>`, `<summary>`, `<picture>`, `<table>` | Iframes y formularios |
| Imágenes SVG remotas servidas por HTTPS | Animaciones o interacción que dependan de scripts |
| Diagramas Mermaid en bloques ```` ```mermaid ```` | Rutas relativas a archivos fuera del repositorio |

`<details>` es la forma habitual de plegar secciones largas sin CSS:

```markdown
<details>
<summary>Stack que uso a diario</summary>

- TypeScript, Astro, Next.js
- PostgreSQL y Prisma

</details>
```

### Adaptarse al tema claro y oscuro

Como no puedes escribir CSS, la forma admitida de cambiar una imagen según el tema del visitante es `<picture>` con `prefers-color-scheme`:

```markdown
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./banner-light.png">
  <img alt="Banner del perfil" src="./banner-light.png">
</picture>
```

Sin esto, una imagen con fondo transparente y texto oscuro desaparece para quien navega en modo oscuro — que en GitHub es mucha gente.

## Imágenes y badges

Las rutas relativas funcionan si el archivo vive en el mismo repositorio:

```markdown
![Banner](./assets/banner.png)
```

Los badges de shields.io son imágenes SVG remotas normales:

```markdown
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
```

Dos advertencias sobre servicios externos:

- **GitHub cachea las imágenes remotas a través de su propio proxy** (Camo). Un badge que cambia no se actualiza al instante en el perfil.
- Las tarjetas de estadísticas de terceros dependen de un servicio ajeno con su propio límite de peticiones. Cuando ese servicio está saturado, tu perfil muestra una imagen rota. No es un fallo tuyo, pero se ve igual de mal.

Escribe siempre el texto alternativo. Es lo único que queda visible cuando la imagen no carga, y es lo que leen los lectores de pantalla.

## Mantenerlo actualizado

Un README de perfil desactualizado es peor que no tenerlo: anuncia tecnologías que dejaste hace dos años. Hay dos estrategias.

**Manual y corto.** Escribe solo lo que no caduca: en qué trabajas, cómo contactarte, dos o tres enlaces. Es la opción que menos mantenimiento pide.

**Automático con Actions.** Un workflow programado reescribe una sección del README y commitea el cambio:

```yaml title=".github/workflows/update-readme.yml"
name: Actualizar README

on:
  schedule:
    - cron: "0 6 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generar contenido
        run: node scripts/build-readme.mjs
      - name: Commitear si hubo cambios
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add README.md
          git diff --staged --quiet || git commit -m "chore: actualizar README"
          git push
```

`permissions: contents: write` es necesario para que el workflow pueda escribir en el repositorio. `git diff --staged --quiet ||` evita crear un commit vacío cuando nada cambió, algo que de otro modo ensuciaría el historial una vez al día.

Ten en cuenta que **los commits de un bot no cuentan como contribuciones tuyas** en el gráfico del perfil. Automatizar el README no infla tu actividad, y ese nunca debería ser el motivo para hacerlo.

## Un aviso sobre privacidad

Todo lo que pongas aquí es público y queda indexado por buscadores. El correo, en particular, se convierte en objetivo de spam en cuanto aparece en texto plano. Si quieres recibir mensajes, usa la dirección `noreply` que GitHub te asigna o un formulario externo, no tu correo personal.
