---
title: Licencias de software — cuál elegir y qué significa
description: Diferencias prácticas entre no usar licencia, licencias permisivas y copyleft para escoger conscientemente en un repositorio.
type: guides
order: 5
tags: [github, license, open-source, mit, apache, gpl]
related:
  - git/repository-management/repository-management-fundamentals
  - git/repository-management/repository-files-community
updatedAt: 2026-08-25
---

Una licencia comunica qué puede hacer otra persona con el código. Que un repositorio sea público permite verlo y hacer fork dentro de las funciones de GitHub, pero no concede automáticamente permiso general para copiarlo, modificarlo o redistribuirlo.

## Decisión rápida

| Intención                                        | Opción habitual                             | Punto importante                                     |
| ------------------------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| Conservar todos los derechos                     | sin licencia pública o licencia propietaria | terceros no reciben permiso general de reutilización |
| Permitir uso amplio con atribución               | MIT o BSD-3-Clause                          | pocas obligaciones para derivados                    |
| Permisiva con concesión expresa de patentes      | Apache-2.0                                  | incluye avisos y condiciones adicionales             |
| Exigir que derivados distribuidos sigan abiertos | GPL-3.0                                     | copyleft fuerte al distribuir                        |
| Incluir software ofrecido por red                | AGPL-3.0                                    | amplía obligaciones al uso como servicio             |
| Copyleft limitado por archivo                    | MPL-2.0                                     | permite combinar con archivos bajo otras licencias   |

Esta tabla orienta, pero no sustituye la lectura de la licencia ni asesoría legal cuando el proyecto tiene impacto comercial o contractual.

## Permisiva y copyleft

Una licencia **permisiva** permite reutilizar con pocas obligaciones, normalmente conservar copyright y licencia. **Copyleft** exige que determinadas redistribuciones o trabajos derivados mantengan libertades equivalentes. No significa que una sea mejor: expresan objetivos diferentes para el ecosistema.

## Preguntas antes de elegir

1. ¿Quiero permitir uso comercial y código cerrado?
2. ¿Quiero una concesión explícita relacionada con patentes?
3. ¿Quiero que mejoras distribuidas permanezcan abiertas?
4. ¿El proyecto incluye dependencias o código con licencias incompatibles?
5. ¿Tengo derecho a licenciar todo lo que contiene el repositorio?
6. ¿Mi empleador, cliente o contrato es propietario de alguna parte?

## Cómo añadirla

Coloca el texto completo en `LICENSE` o `LICENSE.txt`, sin resumir ni modificar una licencia estándar. Añade el nombre de la licencia en el README y conserva avisos requeridos al incorporar código de terceros.

```md
## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta [LICENSE](./LICENSE).
```

No copies una licencia desde un repositorio aleatorio: usa su texto oficial y completa únicamente los campos indicados, como año y titular.

## Dependencias y recursos

La licencia del proyecto no reemplaza la de sus dependencias, fuentes, iconos, datos o modelos. Mantén atribuciones cuando correspondan y revisa compatibilidad antes de redistribuir un bundle, una aplicación móvil o una imagen de contenedor.

Fuentes: [Licenciar un repositorio — GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) y [Choose a License](https://choosealicense.com/).
