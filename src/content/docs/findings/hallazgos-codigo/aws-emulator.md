---
title: "AWS Emulator: el emulador local oficial de AWS"
description: "Emulador oficial de las APIs de AWS, escrito en Rust y publicado por AWS en noviembre de 2026: corre en Linux como paquete nativo, en macOS y Windows mediante Docker, y sirve las APIs por HTTPS en 127.0.0.1:9297 sin cuenta de AWS."
tags: [aws, emulador, testing, ci, rust, localstack, sdk, oficial]
sidebar:
  order: 20
draft: false
runtime: Linux nativo (x86_64, aarch64); Docker en macOS y Windows
resourceCategory: Documentación oficial
official: true
website: https://docs.aws.amazon.com/emulator/latest/userguide/what-is-service.html
github: https://github.com/aws/aws-emulator
technologies:
  - findings/hallazgos-codigo/floci
  - devops/cloud-fundamentos/devops-cloud-fundamentals
  - devops/docker-conceptos/docker-que-es
note: "Sin coste y sin cuenta de AWS. Código bajo CC0 1.0 (dominio público), salvo vendor/, que es Apache-2.0. Solo hay paquete nativo para Linux: en macOS y Windows construyes tú la imagen de Docker con el Dockerfile de la guía."
warnings:
  - "Envía por defecto telemetría anónima de uso y errores a AWS. Desactívala con aws-emulator --telemetry off, EMULATOR_TELEMETRY=off o enabled = false en ~/.aws/emulator/config.toml."
  - "No evalúa políticas de IAM ni políticas de recursos como AWS: una petición que AWS deniega puede funcionar en el emulador. AWS indica expresamente que no se use para probar seguridad."
  - "Si AWS_ENDPOINT_URL no está definida en la shell de los tests, el SDK llama a la AWS real con las credenciales que encuentre. No dejes credenciales reales en el entorno de los jobs de prueba."
  - "En Docker, publica el puerto como -p 127.0.0.1:9297:9297. La forma corta -p 9297:9297 expone el emulador a toda tu red."
updatedAt: 2026-11-16
---

> Publicado por **[AWS](https://github.com/aws)** en la organización oficial `aws` de GitHub, disponible de forma general desde el 11 de noviembre de 2026. Unas 8.900 estrellas. Según AWS, lo escriben y mantienen agentes de IA, con varias versiones al día, y el repositorio no acepta pull requests.

## En pocas palabras

**AWS Emulator** es un programa local que sirve las APIs de AWS en tu máquina. Arrancas el emulador, apuntas la AWS CLI o tu SDK a su _endpoint_ con variables de entorno y tu código crea buckets, tablas o colas que viven en memoria, sin tocar la nube ni necesitar una cuenta. No tiene interfaz gráfica.

Es la primera herramienta de este tipo que publica la propia AWS; hasta ahora el hueco lo ocupaban proyectos de terceros como LocalStack o [Floci](/findings/hallazgos-codigo/floci).

## Qué problema resuelve

AWS lo plantea para tres usos:

- **Pruebas locales**, incluidas llamadas que cruzan servicios (una Lambda que escribe en SQS, por ejemplo).
- **Tests de integración en CI/CD** sin cuenta ni recursos reales.
- **Prototipos con agentes de IA**, que pueden crear y probar infraestructura sin gastar ni romper nada.

## Cómo funciona

- Está escrito en **Rust**, con un _crate_ por servicio. Cada servicio parte de su **modelo Smithy**, la descripción formal de la API que AWS publica en el repositorio [api-models-aws](https://github.com/aws/api-models-aws). Por eso cubre, en principio, cualquier servicio que tenga modelo ahí.
- Si una operación no está implementada, responde HTTP 501 con el código `NotImplemented`, de modo que el test falla en el acto en vez de dar un falso positivo.
- La **fidelidad** (cuánto se parece a AWS) se mide con _fidelity tests_: programas cortos que ejecutan un flujo con un SDK y comprueban resultado, estado y errores exactos. Cada release publica una puntuación por servicio ("40 de 50") y los tests están en [aws-emulator-evaluation-suite](https://github.com/aws/aws-emulator-evaluation-suite).
- Según la guía, el plano de control (crear, describir, listar recursos) es lo que mejor coincide hoy; el plano de datos y el soporte de CloudFormation, Terraform o CDK varían por servicio.
- Sirve **HTTPS** en `127.0.0.1:9297` con un certificado propio y exige firmas **SigV4** (el mismo esquema de firma que AWS). Al arrancar genera claves de acceso, un `config` y el certificado en `~/.aws/emulator/9297/`; al parar borra esos archivos y todos los recursos.

## Instalación

En Linux (glibc 2.17 o superior), con el paquete Debian para amd64:

```bash
curl -fsSLo aws-emulator.deb https://downloads.aws.com/aws-emulator/packages/aws-emulator/LTS/latest/aws-emulator_amd64.deb
sudo apt-get install -y ./aws-emulator.deb
aws-emulator -v
```

Hay paquetes RPM y Debian para x86_64 y aarch64, firmados con GPG; la guía explica cómo verificar la firma antes de instalar.

En macOS y Windows no hay imagen publicada: creas un `Dockerfile` con el contenido de la [guía de Docker](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html), que instala el RPM sobre Amazon Linux 2023, y lo construyes con `docker build -t aws-emulator .`.

También existe un **modo embebido** para tests en Rust con el AWS SDK for Rust: el emulador se compila dentro del binario de tests, con estado aislado por test. La primera compilación es pesada; la guía pide hasta 100 GB libres para `target/` si compilas desde el código fuente.

## Uso

Arranca el emulador en una terminal (`aws-emulator`) y en otra apunta el SDK a él:

```bash
export AWS_ENDPOINT_URL=https://127.0.0.1:9297
export AWS_SHARED_CREDENTIALS_FILE=~/.aws/emulator/9297/emulator_credentials
export AWS_CONFIG_FILE=~/.aws/emulator/9297/config
export AWS_CA_BUNDLE=~/.aws/emulator/9297/ca.pem
export AWS_EC2_METADATA_DISABLED=true
export AWS_DISABLE_HOST_PREFIX_INJECTION=true
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=us-east-1
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE

aws sts get-caller-identity
```

Si la respuesta muestra la cuenta `000000000000`, estás hablando con el emulador. Algunos SDK necesitan un ajuste extra para confiar en el certificado: `NODE_EXTRA_CA_CERTS` en Node.js, un _truststore_ PKCS12 en Java o `SSL_CERT_FILE` en Rust y .NET.

Con un agente de IA (Kiro, Cursor, Claude Code…) y AWS CLI 2.35.0 o superior, puedes instalar la skill oficial y pedirle al agente que lo configure:

```bash
aws agent-toolkit add-skill --skill-name aws-emulator --region us-east-1
```

## Cuándo conviene y cuándo no

Conviene cuando quieres errores y validaciones idénticos a los de AWS (un nombre de tabla demasiado corto falla con el mismo mensaje) y una medida pública de qué tan fiel es cada servicio.

No conviene para pruebas de larga duración o de carga, para multicuenta o multirregión (todo comparte una cuenta y conviene usar una sola región por instancia) ni cuando necesitas que el estado sobreviva a un reinicio: todo vive en memoria. Tampoco para probar IAM.

## Alternativas

| Herramienta                               | Licencia                    | Endpoint                      | Persistencia                 | Punto fuerte                                                       |
| ----------------------------------------- | --------------------------- | ----------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| AWS Emulator                              | CC0 1.0                     | HTTPS `127.0.0.1:9297`, SigV4 | Solo en memoria              | Oficial, generado de los modelos de API, fidelidad medida y pública |
| [Floci](/findings/hallazgos-codigo/floci) | MIT                         | HTTP `localhost:4566`         | Memoria, disco, híbrida, WAL | Contenedores reales (Postgres, k3s, Lambda), multicuenta, consola web |
| LocalStack                                | Comercial; plan gratuito no comercial | HTTP `localhost:4566` | Según plan                   | El más veterano; desde 2026 pide token y Community está congelada  |

Floci y LocalStack comparten puerto y convenciones, así que se intercambian cambiando la imagen. AWS Emulator usa otro puerto, HTTPS y credenciales generadas, de modo que migrar a él implica cambiar la configuración del SDK.

## Límites y precauciones

- La guía avisa de que solo se verifica contra AWS en `us-west-2` (y `us-east-1` para servicios globales); las diferencias de disponibilidad entre regiones no se reflejan.
- Consume unos 160 MiB en reposo y crece con los recursos; la guía recomienda limitar la memoria (`--memory=2g` en Docker o `systemd-run` en Linux).
- Las peticiones de S3 Control y las que el SDK reescribe con prefijos de host no llegan al emulador sin ajustes; usa `127.0.0.1` y no `localhost` en el endpoint.
- Que el código lo generen agentes de IA es una afirmación de AWS. Como cualquier herramienta de desarrollo, revisa las puntuaciones de fidelidad de los servicios que uses antes de confiar en él.

## Fuentes

- [Repositorio y README](https://github.com/aws/aws-emulator)
- [Guía de usuario: qué es AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/what-is-service.html)
- [Primeros pasos en Linux](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-linux.html)
- [Primeros pasos con Docker](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html)
- [Apuntar el SDK al emulador](https://docs.aws.amazon.com/emulator/latest/userguide/point-sdk-to-emulator.html)
- [Fidelidad](https://docs.aws.amazon.com/emulator/latest/userguide/fidelity.html)
- [Anuncio en el AWS News Blog](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/)
