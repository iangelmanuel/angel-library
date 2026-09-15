---
title: "tgrep: búsqueda indexada de código"
description: Herramienta de Microsoft escrita en Rust que indexa un repositorio una vez y permite buscarlo mediante una arquitectura cliente-servidor y un observador de archivos.
tags: [tgrep, rust, busqueda-de-codigo, ripgrep, github-copilot, herramientas-de-desarrollo]
sidebar:
  order: 7
draft: false
resourceCategory: developer-tools
official: true
url: https://github.com/microsoft/tgrep
technologies: [findings/hallazgos-codigo/node-best-practices]
updatedAt: 2026-09-09
---

> Proyecto open source de **Microsoft**. Su repositorio indica que GitHub Copilot CLI lo usa internamente para buscar código.

## Para qué sirve

`tgrep` es una alternativa orientada a repositorios grandes cuando buscar el mismo código muchas veces hace costoso recorrer el disco en cada consulta. Construye un índice basado en trigramas y después separa el trabajo en dos procesos:

1. un servidor mantiene el índice en memoria;
2. un cliente envía consultas al servidor y recibe los resultados.

Un **trigrama** es una secuencia de tres caracteres. El índice registra en qué archivos aparece cada secuencia, por lo que una búsqueda puede reducir primero el conjunto de candidatos y verificar después las coincidencias reales. No es un reemplazo semántico de un buscador de símbolos: busca texto y patrones dentro de archivos.

## Cuándo tiene sentido

- repositorios grandes que se consultan durante toda la sesión de desarrollo;
- herramientas que hacen búsquedas repetitivas, como agentes de código o servidores de lenguaje;
- equipos que pueden mantener un proceso de búsqueda compartido en la misma máquina;
- entornos donde el tiempo de respuesta después de indexar importa más que el tiempo inicial de preparación.

Para una consulta aislada, un repositorio pequeño o una carpeta que cambia constantemente, `rg` (ripgrep) suele tener menos pasos y no necesita conservar un índice. La ganancia depende del tamaño del repositorio, el sistema operativo, la caché y de si el índice ya estaba construido.

## Instalación y primera búsqueda

El repositorio ofrece binarios para Linux, macOS y Windows, además de compilación con Cargo. La compilación local requiere Rust 1.85 o posterior y la edición 2024.

```bash
git clone https://github.com/microsoft/tgrep.git
cd tgrep
cargo install --path tgrep-cli --locked
```

Desde la raíz del repositorio que quieres consultar, crea el índice y levanta el servidor:

```bash
tgrep index .
tgrep serve .
```

En otra terminal, ejecuta las consultas con el cliente:

```bash
tgrep "useState" .
tgrep "createContext" src/
```

Los nombres exactos de las opciones pueden cambiar mientras el proyecto evoluciona. Consulta `tgrep --help` y el README de la versión instalada antes de automatizar un comando.

## Qué ocurre cuando cambian los archivos

El servidor puede observar cambios del sistema de archivos y actualizar las partes afectadas del índice. Eso evita reconstruir el repositorio completo después de cada edición, pero añade un proceso que debe permanecer activo y un consumo de almacenamiento para el índice.

En un flujo local conviene:

1. ignorar `node_modules`, artefactos de compilación y carpetas generadas;
2. indexar desde la raíz correcta para que las rutas devueltas sean útiles;
3. cerrar el servidor cuando termines o integrarlo en el ciclo de vida de tu herramienta;
4. comprobar que los cambios generados no se estén buscando como si fueran código fuente.

## Rendimiento sin titulares engañosos

Los benchmarks publicados por el proyecto comparan `tgrep` con ripgrep en repositorios y plataformas concretas. Algunos escenarios muestran aceleraciones de varios múltiplos y otros tienen diferencias menores. Las cifras no describen una mejora universal: el índice debe existir, la consulta debe beneficiarse de él y el coste de mantenerlo debe compensar la preparación inicial.

Si vas a elegirlo para una herramienta, mide tres fases por separado:

| Fase | Qué medir |
| --- | --- |
| Preparación | tiempo de indexación y espacio usado |
| Consulta en caliente | latencia de varias búsquedas consecutivas |
| Actualización | coste de editar, crear y eliminar archivos |

## Límites y decisiones prácticas

- **Búsqueda textual:** no entiende por sí solo tipos, referencias ni el significado de un símbolo.
- **Estado persistente:** un índice desactualizado puede ocultar cambios si el observador no está activo o si un proceso modifica archivos de forma no observable.
- **Coste inicial:** el primer índice puede tardar más que una búsqueda directa.
- **Integración:** una aplicación debe gestionar el ciclo de vida del servidor, los errores de conexión y la limpieza del índice.
- **Madurez:** revisa la versión y los benchmarks del repositorio antes de convertirlo en una dependencia crítica.

## Siguiente paso

Lee el [README de tgrep](https://github.com/microsoft/tgrep) para la instalación vigente y revisa sus [benchmarks](https://github.com/microsoft/tgrep/blob/main/BENCHMARKS.md) con el tamaño y sistema operativo que realmente usarás.
