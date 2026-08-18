---
title: "Contenedores vs máquinas virtuales"
description: Qué comparten y qué no un contenedor, una máquina virtual y un proceso nativo — por qué los contenedores son mucho más livianos.
category: devops
stack: docker-conceptos
order: 2
tags: [docker, conceptos, virtualizacion]
scope: contenedores vs VMs
related: [guides/docker-arquitectura]
updatedAt: 2026-08-17
---

## Tres formas de correr una app

```text
Proceso nativo        Máquina virtual         Contenedor
┌─────────────┐       ┌─────────────┐         ┌─────────────┐
│    App      │       │    App      │         │    App      │
├─────────────┤       ├─────────────┤         ├─────────────┤
│   SO host   │       │  SO invitado│         │  (sin SO propio)
│             │       ├─────────────┤         ├─────────────┤
│             │       │  Hypervisor │         │Docker Engine│
│             │       ├─────────────┤         ├─────────────┤
│             │       │   SO host   │         │   SO host   │
└─────────────┘       └─────────────┘         └─────────────┘
```

## La diferencia clave: el kernel

- **Máquina virtual**: el hypervisor (VMware, VirtualBox, Hyper-V) virtualiza hardware completo, y arriba corre un sistema operativo **invitado** completo con su propio kernel — pesado (GBs de disco, arranca en minutos), pero aislamiento total.
- **Contenedor**: comparte el kernel del sistema operativo **host** — no arranca un SO nuevo, solo aísla el proceso usando funciones del kernel (namespaces, cgroups en Linux). Resultado: arranca en segundos, pesa MBs, y el overhead de rendimiento es mínimo.
- **Proceso nativo**: sin aislamiento — corre directo contra el sistema operativo, comparte todo con el resto de procesos.

## Tabla comparativa

| | Proceso nativo | Contenedor | Máquina virtual |
|---|---|---|---|
| Arranque | Instantáneo | Segundos | Minutos |
| Tamaño típico | — | MBs–cientos de MBs | GBs |
| Aislamiento | Ninguno | Proceso + filesystem + red | Total (kernel propio) |
| Kernel | Compartido | Compartido con el host | Propio |
| Densidad (cuántos por máquina) | — | Decenas a cientos | Unas pocas |
| Caso de uso típico | Desarrollo directo | Apps, microservicios, bases de datos para dev | Aislamiento fuerte, SOs distintos al host |

## Por qué esto importa en la práctica

- Puedes correr 5-10 contenedores (app, base de datos, cache, etc.) en una laptop sin que se note, algo impensable con 5-10 máquinas virtuales.
- El aislamiento de un contenedor **no es tan fuerte** como el directamente VM — comparte kernel con el host. Para casos de aislamiento de seguridad extremo (multi-tenant hostil) se usan capas extra (gVisor, Kata Containers) o directamente VMs.
- En Windows/Mac, Docker igual necesita una VM liviana por debajo (Docker Desktop usa una VM con Linux, vía WSL2 en Windows) porque los contenedores Linux necesitan un kernel Linux — ver [Instalación](/guides/docker-instalacion).

## Consideraciones

- "Contenedor" no es exclusivo de Docker — es un concepto del kernel de Linux; Docker es la herramienta que lo hizo accesible con una CLI simple y un formato de imagen estándar (OCI).
- En Windows, un contenedor **Windows** (no Linux) sí necesita el kernel de Windows — pero la inmensa mayoría de imágenes públicas (Node, Postgres, Nginx...) son Linux, por eso Docker Desktop en Windows corre sobre WSL2.
