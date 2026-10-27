---
title: "Oracle Cloud Always Free — un VPS ARM gratuito sin fecha de caducidad"
description: Capa gratuita permanente de Oracle Cloud Infrastructure con una máquina virtual ARM Ampere A1 de hasta 2 OCPU y 12 GB de RAM, dos micro VM AMD, 200 GB de disco y 10 TB de tráfico saliente al mes; útil para alojar proyectos pequeños y prototipos.
tags: [servicios, vps, cloud, oracle, oci, arm, gratis, hosting, linux]
sidebar:
  order: 5
draft: false
resourceCategory: servicios
official: true
website: https://www.oracle.com/cloud/free/
url: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
technologies:
  - findings/hallazgos-codigo/how-to-secure-a-linux-server
  - applications/apps-devops/application-coolify
  - resources/servicios/uptimerobot
  - devops/cloud-fundamentos/devops-cloud-fundamentals
  - devops/docker-conceptos/docker-que-es
note: "Los límites de esta página son los de la documentación de Oracle a octubre de 2026. El 15 de junio de 2026 Oracle redujo la cuota ARM de 4 OCPU y 24 GB a 2 OCPU y 12 GB sin anuncio público: muchas guías antiguas todavía dan las cifras viejas."
warnings:
  - "Oracle puede reclamar (detener) una instancia gratuita que considere inactiva: si durante 7 días la CPU (percentil 95), la red y, en ARM, la memoria se quedan por debajo del 20 %."
  - "Si al terminar la prueba tienes más ARM de lo que permite Always Free, todas las instancias A1 se desactivan y se borran a los 30 días. Ajusta el tamaño antes de que acabe el periodo de prueba."
  - "Pide tarjeta de crédito o de débito que funcione como crédito; según su FAQ no acepta tarjetas virtuales, de un solo uso ni prepago. Si pasas a Pay As You Go, lo que exceda de Always Free se cobra: pon una alerta de presupuesto."
  - "Sin SLA ni soporte técnico en las cuentas solo gratuitas. Guarda copias de tus datos fuera de Oracle: las condiciones ya cambiaron una vez sin aviso."
updatedAt: 2026-10-27
---

> La guía paso a paso que inspira esta entrada es de **Antoine Guilbert**: [VPS gratuit Oracle : idéal pour tester un projet](https://www.antoineguilbert.fr/vps-gratuit-oracle-ideal-pour-tester-un-projet/) (en francés, publicada en 2023 y actualizada en octubre de 2026).

**Oracle Cloud Always Free** es la parte permanente de la capa gratuita de Oracle Cloud Infrastructure (OCI). A diferencia de las pruebas de otros proveedores, que caducan al cabo de unos meses, estos recursos no tienen fecha de fin: mientras respetes los límites y la cuenta siga activa, no pagas. Lo que la hace conocida es que incluye un **VPS ARM** con bastante más memoria de lo habitual en un plan gratuito, suficiente para alojar una API, un bot, un panel autoalojado o la app pequeña que acabas de construir con Claude Code o Codex.

## Conceptos en dos frases

- Un **VPS** (servidor privado virtual) es una máquina virtual en un centro de datos a la que entras por SSH y en la que instalas lo que quieras, como en tu propio Linux.
- Una **OCPU** es la unidad de CPU con la que Oracle mide y factura el cómputo. **Ampere A1** es la familia de procesadores ARM de 64 bits que usa la forma (`shape`) `VM.Standard.A1.Flex`, que te deja repartir CPU y memoria a tu medida.
- La **región de origen** (_home region_) es la región que eliges al registrarte. No se puede cambiar y solo ahí se crean los recursos Always Free.

## Qué incluye

A octubre de 2026, según la [documentación de recursos Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm):

| Recurso                     | Límite gratuito                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Cómputo ARM (Ampere A1)     | 1.500 horas de OCPU y 9.000 GB·hora al mes, equivalente a 2 OCPU y 12 GB fijos     |
| Reparto ARM                 | Una o dos instancias que sumen como máximo 2 OCPU y 12 GB                          |
| Cómputo AMD                 | Hasta 2 VM `VM.Standard.E2.1.Micro` de 1/8 de OCPU y 1 GB de RAM cada una          |
| Block Volume                | 200 GB en total entre discos de arranque y volúmenes, más 5 copias de seguridad    |
| Disco de arranque mínimo    | 47 GB por instancia (50 GB por defecto), que cuentan contra los 200 GB             |
| Object Storage              | 20 GB y 50.000 peticiones de API al mes                                            |
| Tráfico saliente            | 10 TB al mes                                                                       |
| Autonomous AI Database      | 2 bases, cada una con 1 OCPU y 20 GB                                               |
| Balanceador de carga        | 1 flexible de 10 Mbps                                                              |

Al registrarte también recibes una **prueba** de 300 USD en créditos durante 30 días para cualquier servicio de OCI (en países seleccionados). Cuando termina, lo que creaste con créditos se borra y la cuenta sigue como Always Free. Oracle permite una cuenta gratuita por persona.

### El recorte de junio de 2026

Hasta junio de 2026 la cuota ARM era de 3.000 horas de OCPU y 18.000 GB·hora, es decir, **4 OCPU y 24 GB**. Según [InfoQ](https://infoq.com/news/2026/07/oracle-cloud-free-tier-limits/), Oracle la redujo a la mitad el 15 de junio de 2026 sin anuncio público. En cuentas solo gratuitas, las instancias que superaban el nuevo límite se detuvieron hasta redimensionarlas. Si sigues un tutorial anterior a esa fecha, ajusta las cifras.

## Cómo empezar

El artículo de Antoine Guilbert recorre el proceso completo con capturas. El resumen:

1. Regístrate en [signup.cloud.oracle.com](https://signup.cloud.oracle.com/) con tus datos reales y elige una región de origen cercana. Piénsalo bien: no se puede cambiar.
2. Verifica la tarjeta. Oracle hace una retención temporal de autorización, no un cargo.
3. En la consola, ve a **Compute → Instances → Create instance**.
4. Elige la imagen (Ubuntu u Oracle Linux) y, en **Change shape**, selecciona **Ampere → VM.Standard.A1.Flex** con 2 OCPU y 12 GB. Comprueba que aparece la etiqueta _Always Free-eligible_.
5. Pega tu clave pública SSH o deja que Oracle genere el par y descarga la privada en ese momento: después no se puede recuperar.
6. Con la instancia en marcha, copia la IP pública y entra. El usuario depende de la imagen:

```bash
# Imagen Ubuntu
ssh -i ~/.ssh/mi-clave-oracle ubuntu@<ip-publica>

# Imagen Oracle Linux
ssh -i ~/.ssh/mi-clave-oracle opc@<ip-publica>
```

### Abrir puertos: dos capas

Si tu app escucha en el puerto 80 o 443 y no responde desde fuera, casi siempre es esto. En OCI el tráfico pasa por **dos cortafuegos**:

- La **security list** (o _network security group_) de la red virtual (VCN), que se edita en la consola añadiendo una regla de entrada (_ingress rule_).
- El **cortafuegos del sistema operativo**. Según el blog de desarrolladores de Oracle, las imágenes de Ubuntu de OCI traen reglas de `iptables` propias y UFW desactivado, así que abrir solo la security list no basta.

El artículo de referencia no cubre este paso. Antes de tocar reglas, lee una guía de endurecimiento como [How To Secure A Linux Server](/findings/hallazgos-codigo/how-to-secure-a-linux-server) para no dejarte fuera de la máquina.

## El error «Out of capacity»

Las instancias ARM gratuitas salen de un fondo limitado por región. Si al crearla ves _out of host capacity_, Oracle recomienda probar otro dominio de disponibilidad (_availability domain_) o reintentar más tarde. Según Oracle, pasar la cuenta a **Pay As You Go** da acceso a más capacidad; los recursos Always Free siguen sin cobrarse, pero todo lo que los exceda se factura.

## Qué alojar ahí

Ideas que propone el artículo: WordPress, Docker con Portainer, una VPN WireGuard (mejor en la micro AMD), AdGuard Home, Uptime Kuma o Home Assistant para pruebas. Para apps propias, una opción cómoda es instalar [Docker](/devops/docker-conceptos/docker-que-es) o una plataforma autoalojada tipo [Coolify](/applications/apps-devops/application-coolify) y desplegar desde Git.

Ten en cuenta que la máquina es **ARM (aarch64)**: las imágenes Docker y los binarios tienen que tener versión `arm64`. La mayoría de imágenes oficiales la tienen, pero no todas.

## Cuándo conviene y cuándo no

**Conviene** si:

- Quieres un Linux completo con IP pública para prototipos, bots, demos o servicios personales.
- Necesitas más memoria de la que dan otras capas gratuitas (12 GB es mucho para una app pequeña).
- Te sirve aprender a administrar un servidor: SSH, cortafuegos, actualizaciones, copias.

**No conviene** si:

- El servicio es crítico: no hay SLA, la instancia puede reclamarse por inactividad y Oracle ya cambió los límites una vez sin avisar.
- No quieres administrar un servidor. Un PaaS con plan gratuito te ahorra parches, cortafuegos y copias.
- No tienes una tarjeta de crédito aceptada.

## Fuentes

- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) y su [FAQ](https://www.oracle.com/cloud/free/faq/)
- [Always Free Resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) (documentación de OCI)
- [VPS gratuit Oracle : idéal pour tester un projet](https://www.antoineguilbert.fr/vps-gratuit-oracle-ideal-pour-tester-un-projet/), de Antoine Guilbert
- [Oracle Quietly Halves Free Tier Ampere A1 Compute Limits](https://infoq.com/news/2026/07/oracle-cloud-free-tier-limits/) (InfoQ, julio de 2026)
- [Enabling network traffic to Ubuntu images in OCI](https://blogs.oracle.com/developers/post/enabling-network-traffic-to-ubuntu-images-in-oracle-cloud-infrastructure) (blog de desarrolladores de Oracle)
