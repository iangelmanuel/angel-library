---
title: "Aprende Rust — curso interactivo y gratuito desde cero"
description: "Curso interactivo en español de midudev para aprender Rust desde cero: 26 lecciones y 95 ejercicios con editor integrado, exámenes por sección y certificado gratuito."
tags: [cursos, midudev, rust, ownership, certificado, gratis, espanol]
sidebar:
  order: 6
draft: false
resourceCategory: learning
url: https://aprenderust.dev/
technologies:
  - courses/cursos-midudev/midudev-aprende-sql
  - courses/cursos-midudev/midudev-cursos-por-tecnologia
note: "Gratis y sin instalar nada para seguir las lecciones. Para enviar los exámenes, guardar el progreso y obtener el certificado hay que iniciar sesión con GitHub."
updatedAt: 2026-11-16
---

> Creado por **Miguel Ángel Durán**, [Midudev](https://midu.dev). Gratuito.

**Aprende Rust** es un curso interactivo de Rust en español, con el mismo formato que [Aprende SQL](/courses/cursos-midudev/midudev-aprende-sql): **cada lección trae un editor** donde escribes el código, pulsas _Ejecutar_, se compila y ves la salida sin salir de la página. No necesitas instalar `rustup` ni Cargo para empezar.

Rust es un lenguaje de sistemas que garantiza la seguridad de memoria sin recolector de basura. Lo consigue con el **ownership** (cada valor tiene un único dueño) y el **préstamo** de referencias, reglas que el compilador comprueba antes de ejecutar nada. Es el concepto que más cuesta al llegar desde JavaScript o Python, y el curso le dedica una sección entera.

## Qué incluye

|             |                                                             |
| ----------- | ----------------------------------------------------------- |
| Lecciones   | 26, en 7 secciones                                          |
| Ejercicios  | 95, validados con tests ocultos                             |
| Exámenes    | Uno al final de cada sección                                |
| Herramientas | Playground y glosario de Rust                              |
| Idioma      | Español                                                     |
| Precio      | Gratis                                                      |
| Certificado | Sí, en PDF, con página pública de verificación y para LinkedIn |

## Temario

1. **Primeros pasos**: tu primer programa, variables y mutabilidad, tipos de datos, funciones y expresiones, control de flujo (`if`, `loop`, `while`, `for`).
2. **Ownership y préstamos**: quién es dueño de cada valor, referencias y préstamos, slices y el tipo `&str`.
3. **Structs, enums y patrones**: structs, métodos con `impl`, enums y `match`, y `Option` como alternativa a `null`.
4. **Colecciones y errores**: `Vec<T>`, strings en profundidad, `HashMap` y manejo de errores con `Result` y el operador `?`.
5. **Genéricos, traits y módulos**: tipos genéricos, traits, lifetimes, y módulos, crates y Cargo.
6. **Rust funcional**: closures, iteradores y smart pointers (`Box`, `Rc` y `RefCell`).
7. **Concurrencia y ecosistema**: hilos ("concurrencia sin miedo"), tests en Rust y una lectura final sobre el ecosistema.

## Cómo funciona cada lección

- Una parte de teoría por pasos y, debajo, los retos con la **salida esperada**.
- Al ejecutar, **unos tests ocultos** comprueban tus funciones; no basta con que la salida se parezca.
- Si te atascas, puedes pedir una pista a Ferris (la mascota de Rust) o ver la solución en modo de solo lectura.
- Al cerrar cada sección hay un examen. Completar ejercicios y exámenes desbloquea el certificado.

La página no detalla dónde se compila el código (en el navegador o en un servidor) ni qué edición de Rust usa. Si vas a seguir por tu cuenta, el propio curso recomienda instalar Rust con `rustup` y trabajar con `cargo run`, `cargo build` y `cargo check`.

## Para quién es

- **Si vienes de otro lenguaje**: es el perfil ideal. El curso parte de cero en Rust, aunque ayuda haber programado antes.
- **Si nunca has programado**: se puede seguir, pero Rust es exigente como primer lenguaje; quizá te convenga empezar por algo más permisivo.
- **El certificado** acredita que completaste el curso; no es una certificación oficial del lenguaje.

Para errores o sugerencias, el curso tiene un repositorio de incidencias en GitHub: [midudev/aprenderust-issues](https://github.com/midudev/aprenderust-issues). El resto de cursos del autor están en [Cursos de midudev por tecnología](/courses/cursos-midudev/midudev-cursos-por-tecnologia).

## Fuentes

- [Aprende Rust](https://aprenderust.dev/)
- [Lección «Hola, Rust»](https://aprenderust.dev/hola-mundo)
- [Repositorio de incidencias](https://github.com/midudev/aprenderust-issues)
