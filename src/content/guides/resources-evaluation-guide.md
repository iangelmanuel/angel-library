---
title: Cómo evaluar y conservar recursos técnicos
description: Criterios para elegir documentación, herramientas, APIs, licencias y referencias que sigan siendo útiles y confiables.
category: resources
tags: [recursos, documentacion, herramientas, licencias, evaluacion]
order: 1
updatedAt: 2026-08-19
---

Una colección de enlaces se vuelve útil cuando explica **por qué existe cada recurso, cuándo usarlo y qué riesgo tiene**. Guardar cientos de páginas sin contexto crea un cementerio de marcadores: el enlace permanece, pero la decisión que lo hizo valioso se pierde.

## Fuente primaria y fuente secundaria

Una **fuente primaria** es documentación producida por quienes mantienen la tecnología: especificación, manual oficial, repositorio o publicación original. Una **fuente secundaria** interpreta, compara o enseña esa información.

Para conocer una API o un cambio de versión, se prefiere la fuente primaria. Para construir un modelo mental, un tutorial bien mantenido puede ser más claro. Lo ideal es conservar ambos papeles sin presentar una opinión como si fuera una garantía oficial.

## Criterios de evaluación

Antes de añadir una herramienta o guía, revisa:

| Criterio | Pregunta |
| --- | --- |
| Autoridad | ¿Quién publica y mantiene el contenido? |
| Vigencia | ¿Indica versión o fecha de actualización? |
| Alcance | ¿Resuelve el problema real o solo una demostración? |
| Evidencia | ¿Enlaza especificaciones, mediciones o código verificable? |
| Seguridad | ¿Solicita archivos, credenciales o permisos innecesarios? |
| Privacidad | ¿Qué datos se cargan y cuánto tiempo se conservan? |
| Licencia | ¿Se permite usar, modificar o redistribuir el resultado? |
| Portabilidad | ¿Se puede exportar el trabajo si el servicio desaparece? |

Una interfaz atractiva no demuestra calidad técnica. Se prueba la salida con un caso conocido antes de incorporarla al flujo del proyecto.

## Versiones y compatibilidad

Una explicación puede ser correcta para una versión y errónea para otra. Registra la versión, fecha y entorno cuando el comportamiento depende de ellos.

**SemVer** significa *Semantic Versioning* o versionado semántico. Aunque una biblioteca use versiones `MAJOR.MINOR.PATCH`, las notas de versión y las pruebas siguen siendo necesarias. No todos los proyectos interpretan compatibilidad de la misma forma.

Para APIs del navegador se comprueba soporte por funcionalidad, no solo por nombre del navegador. Un **polyfill** implementa una capacidad ausente; una estrategia de **progressive enhancement** o mejora progresiva ofrece una base funcional y añade la capacidad cuando existe.

## Licencias

Una licencia define qué se puede hacer con código, imágenes, iconos, fuentes o datos. “Gratis” puede significar gratuito para uso personal, no necesariamente para un producto comercial.

Conceptos frecuentes:

- **MIT, BSD o Apache-2.0:** licencias permisivas con condiciones diferentes.
- **GPL:** licencia con obligaciones de copyleft al distribuir trabajo derivado en ciertos escenarios.
- **CC:** familia *Creative Commons* para contenido; sus variantes cambian atribución y usos permitidos.
- **Dominio público:** obra sin las restricciones patrimoniales habituales, según jurisdicción y declaración aplicable.

No se copia un recurso sin revisar el texto de su licencia. Cuando el impacto legal importa, se consulta asesoría adecuada.

## Herramientas que procesan archivos

Compresores de imágenes, convertidores, analizadores y servicios de IA pueden recibir material privado. Antes de subir un archivo se revisan términos, ubicación de procesamiento, retención y posibilidad de entrenamiento.

Una herramienta que funciona completamente en el navegador puede procesar localmente, pero esto se confirma en su documentación o mediante inspección de red. “Funciona en la web” no significa automáticamente “el archivo nunca sale del dispositivo”.

## APIs y límites

**API** significa *Application Programming Interface* o interfaz de programación de aplicaciones. Un recurso de API debe documentar autenticación, límites de solicitudes, errores, paginación, versiones y política de uso.

**Rate limit** es el límite de operaciones en un período. **Quota** o cuota es una asignación total o periódica. Un servicio gratuito puede cambiar ambos, por lo que una integración crítica necesita manejo de errores y una alternativa.

## Nota personal útil

Al guardar un recurso, añade una nota con esta estructura:

```text
Qué resuelve: comprime imágenes AVIF y WebP.
Cuándo usarlo: antes de subir imágenes editoriales.
Entrada sensible: no usar con documentos privados sin revisar procesamiento.
Alternativa: herramienta local del pipeline.
Revisado: 2026-08-19.
```

Esta nota conserva el contexto aunque cambie la página. También permite retirar recursos duplicados o que ya no cumplen el criterio.

## Mantenimiento de la colección

1. Revisa enlaces rotos y redirecciones.
2. Marca recursos oficiales y versión aplicable.
3. Elimina duplicados que no aporten una diferencia clara.
4. Comprueba licencia, privacidad y permisos.
5. Conserva una alternativa local o exportable para herramientas críticas.
6. Actualiza la nota cuando cambie el flujo de trabajo.

