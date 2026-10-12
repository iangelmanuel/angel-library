---
title: "AnyPS5: portar ejecutables de PS5 a Windows y Linux sin emularlos"
description: "Un «relinker» que convierte el ejecutable de un juego de PS5 en un programa nativo de Windows, Linux o macOS, con las bibliotecas del sistema reimplementadas y los shaders recompilados a SPIR-V para Vulkan."
tags: [ps5, videojuegos, compatibilidad, vulkan, spir-v, cpp, ingenieria-inversa, linux, windows]
sidebar:
  order: 15
draft: false
resourceCategory: Repositorio oficial
official: true
url: https://github.com/boykopovar/AnyPS5
note: "Proyecto en fase temprana (versión v0.1.1, septiembre de 2026) con licencia GPL-2.0. La lista oficial de compatibilidad tiene dos títulos verificados: el plataformas 2D Dreaming Sarah y un port casero de DOOM."
warnings:
  - "Usa solo ejecutables de juegos que poseas y hayas extraído tú. Descargar juegos, firmware o claves de terceros es piratería, y AnyPS5 no incluye ni necesita ninguno de ellos."
  - "Necesita un ELF limpio: el ejecutable tiene que estar ya descifrado y fuera de su contenedor SELF/fSELF. Esa extracción no la hace AnyPS5, y saltarse protecciones anticopia puede ser ilegal en tu país aunque el juego sea tuyo."
  - "Ante cualquier estado no soportado el proceso lanza una excepción y termina. Espera cierres, no degradación suave."
updatedAt: 2026-10-12
---

## En pocas palabras

[AnyPS5](https://github.com/boykopovar/AnyPS5) es una herramienta que **porta automáticamente** el ejecutable de un juego de PS5 a Linux y Windows (y, de forma experimental, a macOS). No es un emulador: según su README, no hay «emulación ni proceso de runtime separado». El juego convertido se ejecuta como un programa normal del sistema operativo y llama a implementaciones nativas de las bibliotecas del sistema de la consola.

Lo publica [boykopovar](https://github.com/boykopovar) bajo **GPL-2.0**, está escrito en C++ y supera las 31.000 estrellas. Es muy reciente: el repositorio se creó en agosto de 2026.

## Emulador, capa de compatibilidad y relinker

Para entender qué hace AnyPS5 conviene separar tres ideas:

- **Emulador.** Simula el hardware de otra máquina: su CPU, su memoria, su GPU. Es lo que necesitas cuando la arquitectura no coincide, como ejecutar una consola ARM o PowerPC en un PC x86. Es caro en rendimiento.
- **Capa de compatibilidad.** Si la CPU es la misma, no hace falta simularla: basta con traducir las **llamadas al sistema** y a las bibliotecas. Es lo que hace [Wine](https://www.winehq.org/) con los programas de Windows en Linux, y [Proton](https://github.com/ValveSoftware/Proton) (Wine con extras de Valve) para los juegos de Steam. El código del programa corre directamente en tu procesador.
- **Relinker (lo que hace AnyPS5).** Va un paso más allá que Wine: en vez de cargar el ejecutable original con un cargador especial, lo **reescribe antes** en el formato nativo del sistema destino (ELF en Linux, PE en Windows, Mach-O en macOS). Las importaciones del juego quedan apuntando a bibliotecas propias del proyecto, y es el cargador normal del sistema operativo el que las enlaza.

Funciona porque la PS5 usa una CPU **x86-64** (AMD Zen 2), la misma familia que un PC. Las instrucciones del juego ya se entienden; lo que falta es todo lo que la consola da por hecho: su núcleo, sus bibliotecas y, sobre todo, su GPU.

La comparación natural es [shadPS4](https://github.com/shadps4-emu/shadPS4), el proyecto equivalente para PS4. A pesar de llamarse emulador, también ejecuta el código x86-64 de forma nativa y reimplementa las bibliotecas del sistema (lo que se llama emulación de alto nivel), y también recompila los shaders a SPIR-V. La diferencia de AnyPS5 es que no tiene un programa contenedor que cargue el juego: el resultado es un ejecutable independiente.

## Cómo funciona por dentro

El proyecto tiene tres piezas:

1. **El relinker** (`core/relinker`). Lee las importaciones del ejecutable por su **NID** (el identificador numérico que la consola usa para cada función del sistema), comprueba las llamadas al sistema, descarta las importaciones que no se usan y genera una sección dinámica estándar. Después parchea el binario como ELF de Linux o PE de Windows. Los módulos propios del juego (`sce_module/`) se convierten igual.
2. **Las bibliotecas del sistema** (`core/libs/prx`). Cada biblioteca de la PS5 (núcleo, hilos, memoria, audio, entrada…) se reimplementa como biblioteca compartida nativa. Al compilarlas, una herramienta renombra cada exportación a su NID para que el juego las encuentre como si fueran las originales.
3. **El recompilador de shaders** (`core/shader/recompiler`). La GPU de la PS5 es una AMD RDNA 2. Sus shaders se decodifican, se pasa el flujo de control a una representación intermedia, se optimiza y se emite **SPIR-V**, el formato de shaders de Vulkan. Las variantes compiladas se guardan en memoria y en una caché en disco, así que la primera partida va a tirones y las siguientes no.

Los listados de comandos de la GPU que genera el juego se interpretan y se convierten en pipelines de **Vulkan**. Si tu GPU soporta las extensiones de _graphics pipeline library_, el proyecto enlaza los pipelines por piezas para reducir los tirones de compilación.

La entrada de mando va por SDL (mandos compatibles, sticks y gatillos analógicos), y el teclado y el ratón se configuran con un archivo `anyps5-input.ini`.

## Estado real del proyecto

Hay que leer los porcentajes del README con cuidado: el indicador de bibliotecas mide el porcentaje de las funciones **que el proyecto ya conoce y ha declarado**, no de todas las funciones del sistema de la PS5. El total crece a medida que se declaran más.

La [lista de compatibilidad](https://github.com/boykopovar/AnyPS5/blob/main/docs/user/COMPATIBILITY.md) recoge:

| Juego                     | Windows                  | Linux                  | Notas                                       |
| ------------------------- | ------------------------ | ---------------------- | ------------------------------------------- |
| Dreaming Sarah            | Dentro del juego, jugable | Sin probar            | 60 FPS en GTX 1050 Ti con i5-7500           |
| DOOM Shareware (homebrew) | Dentro del juego          | Dentro del juego      | Port casero público; probado en NVIDIA y AMD |

Linux con GPU Intel no está verificado. Es una prueba de concepto seria y muy activa, no una forma de jugar a tu biblioteca de PS5 en el PC.

## Requisitos

- **Sistema**: Windows o Linux de 64 bits. La salida para macOS genera un Mach-O x86-64 pensado para Rosetta en Apple Silicon.
- **GPU con Vulkan** y drivers recientes.
- **CPU**: idealmente AMD. Algunos juegos usan instrucciones exclusivas de AMD; la opción `--to-intel` reescribe las que encuentra en el ejecutable, pero no las que el juego genere en tiempo de ejecución.
- **Memoria**: en Windows, la memoria directa que pide el juego (hasta 13.824 MiB) se reserva entera al pedirla, así que el límite de memoria comprometida (RAM más archivo de paginación) tiene que cubrirla.
- **En Linux**, si el driver importa memoria dma-buf (no es el caso del driver propietario de NVIDIA), el usuario necesita acceso de lectura y escritura a `/dev/udmabuf`, normalmente entrando en el grupo `kvm`.

## Cómo se usa

Las [releases](https://github.com/boykopovar/AnyPS5/releases) publican el binario del relinker y las bibliotecas ya compiladas para Linux y Windows (`prx-linux-*` y `prx-windows-*`). El ejecutable de entrada tiene que ser un ELF limpio, con sus módulos al lado:

```text
source/
    input.elf
    sce_module/
        <módulos ELF del juego>
```

Conversión según el sistema destino:

```bash
# Linux (es la salida por defecto, aunque el nombre acabe en .exe)
relinker source/input.elf app.elf

# Windows
relinker --windows source/input.elf app.exe

# macOS para Rosetta
relinker --macos --to-rosetta source/input.elf eboot
```

El resultado necesita esta estructura junto al ejecutable: las bibliotecas de AnyPS5 compiladas para el sistema destino en `libs/` (no las `.prx` originales de la consola), y los recursos del juego en `app0/`.

```text
app.elf (Linux) o app.exe (Windows)
libs/
    *.prx
app0/
    <recursos del juego>
    sce_module/
        <módulos convertidos>
```

Después se ejecuta como cualquier programa (`./app.elf` en Linux, `.\app.exe` en Windows). La [guía de uso](https://github.com/boykopovar/AnyPS5/blob/main/docs/user/USAGE.md) documenta el resto de opciones y la de [compilación](https://github.com/boykopovar/AnyPS5/blob/main/docs/dev/BUILD.md) explica cómo construirlo desde el código (CMake y un compilador C++20; el relinker solo se puede compilar sin SDL ni Vulkan).

## Por qué es interesante aunque no vayas a jugar

- Es un caso de estudio muy completo de **cómo funciona un cargador dinámico**: NIDs, secciones dinámicas, reubicaciones y formatos ELF y PE.
- El recompilador es un ejemplo real de **compilador de shaders**: decodificación de la ISA de RDNA 2, estructuración del flujo de control, SSA y emisión de SPIR-V, todo documentado en [ARCHITECTURE.md](https://github.com/boykopovar/AnyPS5/blob/main/docs/dev/ARCHITECTURE.md).
- La documentación es inusualmente honesta: cada juego de la lista indica commit, hardware, driver y qué se probó y qué no. Además publica un registro de deuda técnica.

## Aspectos legales

El README lo plantea como un proyecto de **interoperabilidad, investigación, preservación y compatibilidad**. No incluye, distribuye ni exige software con derechos de autor, firmware, claves criptográficas ni bibliotecas propietarias de Sony. La responsabilidad sobre los binarios que conviertas es tuya:

1. Usa solo copias de juegos que hayas comprado y extraído de tu propia consola. Descargar ejecutables de terceros es piratería, se llame como se llame la herramienta.
2. No necesitas BIOS ni firmware de PS5, y no deberías descargarlos: las bibliotecas del sistema las reimplementa el proyecto.
3. Para obtener un ELF limpio hay que descifrar el ejecutable, y eso suele requerir una consola con un exploit. Saltarse medidas anticopia tiene regulación propia en muchos países (en EE. UU. la DMCA y en la UE la Directiva de derechos de autor), incluso con copias legítimas. Infórmate antes.
4. Los homebrew públicos, como el port de DOOM de la lista, son la forma más limpia de probarlo.

## Fuentes

- [Repositorio y README de AnyPS5](https://github.com/boykopovar/AnyPS5)
- [Guía de uso del relinker](https://github.com/boykopovar/AnyPS5/blob/main/docs/user/USAGE.md)
- [Arquitectura](https://github.com/boykopovar/AnyPS5/blob/main/docs/dev/ARCHITECTURE.md)
- [Lista de compatibilidad](https://github.com/boykopovar/AnyPS5/blob/main/docs/user/COMPATIBILITY.md)
- [Instrucciones de compilación](https://github.com/boykopovar/AnyPS5/blob/main/docs/dev/BUILD.md)
- [Releases](https://github.com/boykopovar/AnyPS5/releases)
