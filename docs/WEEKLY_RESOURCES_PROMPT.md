# Prompt semanal: añadir una lista de recursos

Plantilla para pasarle a Claude Code una lista grande de recursos
(repositorios, webs, cursos, posts) y que los documente en la biblioteca.

Uso: copia el bloque de la sección 1 y pega debajo tu lista con el formato de
la sección 2.

---

## 1 · Prompt

```text
Necesito añadir estos recursos a la biblioteca. Lee la lista de abajo y
documenta cada recurso siguiendo docs/CONTENT_GUIDE.md y el patrón de las
entradas vecinas de su subcategoría.

Proceso:

1. Antes de escribir nada, busca en src/content/docs/ si cada recurso ya
   existe (por nombre, repo y URL). Si existe, revisa si está al día: si lo
   está, omítelo; si no, actualiza lo desactualizado y su `updatedAt` sin
   moverlo de sitio.
2. Decide la categoría y subcategoría de cada recurso. Mi sugerencia es
   orientativa: si pongo «?» o veo que encaja mejor en otro lado, decide tú
   con base en lo que ya existe en src/config/categories.ts. Prefiere una
   subcategoría existente; crea una nueva solo si sigue un patrón del
   proyecto (por ejemplo, un paquete = una subcategoría en Paquetes) y
   regístrala en categories.ts y sidebar.ts.
3. Reparte los recursos entre agentes docs-writer en paralelo (unos 5 por
   agente), cada uno con su tabla de archivo destino, recurso + mis notas
   y sidebar.order (siguiente libre en la carpeta; sin order si las
   vecinas no lo usan). Cada entrada debe llevar en la cabecera la web
   oficial y el repositorio si existen, `draft: false`, `updatedAt` con la
   fecha de hoy y `resourceCategory` cuando haya website o url.
4. Mis notas vienen de posts de redes y pueden exagerar: verifica cifras,
   plataformas, licencias y estrellas contra la fuente, y escribe la
   versión correcta. Si algo tiene riesgos (legales, de seguridad, de
   privacidad), recógelo en `warnings`.
5. Si un recurso es pirata, fraudulento o dañino, no lo publiques:
   explícame qué encontraste y deja que yo decida.
6. Al terminar, pasa el lote completo por el agente docs-reviewer
   (build + prettier).
7. Recalcula las cifras (entradas públicas, categorías y subcategorías;
   sin contar secrets/, private ni draft) y actualízalas donde aparezcan:
   README.md, docs/ARCHITECTURE.md, PRODUCT.md (incluido el número de
   páginas y el tamaño de dist/ del último build). Añade el resumen a
   CHANGELOG.md en [Unreleased]. La portada las calcula sola.
8. No hagas commit.

Al final, dame:
- una tabla con cada recurso y dónde quedó (o «omitido: ya estaba al día»),
- las correcciones a mis notas,
- lo que quede pendiente de mi decisión.

Lista:
```

---

## 2 · Formato de cada recurso

Un bloque por recurso. La línea `#` es la ubicación que sugieres; la `##`
es el nombre. Debajo van tus notas libres (puedes pegar el post tal cual) y
los enlaces.

```markdown
# <Categoría> - <Subcategoría o «?»>

## <nombre del recurso>

<notas o texto del post, tal cual>
<instrucciones extra opcionales: créditos, «investiga a fondo», etc.>
<url principal>
<url secundaria, si hay>
```

Ejemplo:

```markdown
# IA Tools - Plugins

## betterclaude

Créditos a Midudev, como ya se hace en el proyecto.
✓ Image Preview: muestra las imágenes al hacer hover
✓ Sub Meter: puedes ver en todo momento tu consumo
✓ Commit: sube tus cambios sin peligro usando Haiku
https://betterclaude.dev
```

Notas sobre el formato:

- Si no sabes dónde va, escribe `# ?` o una duda tal cual
  («# Hallazgos o Cursos, tú decides»).
- Si solo tienes el enlace, basta con `## nombre` + URL y una línea
  «Investiga qué es»: Claude lo investigará antes de ubicarlo.
- Los créditos a una persona (Midudev u otra) van como una línea más en las
  notas.
