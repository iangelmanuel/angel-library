---
title: "Floci: emulador local de AWS gratuito y MIT"
description: "Emulador de AWS de código abierto que sirve más de cien servicios en localhost:4566 sin cuenta ni token, usa contenedores reales para RDS, Lambda o EKS y se presenta como sustituto directo de LocalStack Community."
tags: [aws, emulador, localstack, docker, testing, ci, terraform, testcontainers, java]
sidebar:
  order: 19
draft: false
runtime: Docker o binario nativo (Linux, macOS, Windows)
resourceCategory: developer-tools
official: true
website: https://floci.io/floci/
github: https://github.com/floci-io/floci
technologies:
  - findings/hallazgos-codigo/aws-emulator
  - devops/cloud-fundamentos/devops-cloud-fundamentals
  - devops/infraestructura-codigo/devops-infraestructura-como-codigo
  - devops/docker-conceptos/docker-que-es
note: "Licencia MIT, sin cuenta, sin token y sin funciones de pago. Los servicios que levantan contenedores reales (Lambda, RDS, ECS, EKS…) necesitan Docker y acceso a su socket."
warnings:
  - "Montar /var/run/docker.sock dentro del contenedor (y arrancarlo con -u root, como indica el README) le da a Floci control total sobre el Docker del anfitrión, que en Linux equivale a root. Úsalo solo en tu máquina o en runners de CI desechables."
  - "Por defecto acepta cualquier credencial no vacía y no comprueba políticas de IAM. Publica el puerto como 127.0.0.1:4566:4566 para no exponer el emulador a toda tu red, y no lo uses para validar permisos."
  - "No todo está emulado con la misma profundidad: Bedrock Runtime, Textract o Transcribe son stubs que devuelven respuestas de relleno. Que un test pase en Floci no garantiza que pase en AWS."
updatedAt: 2026-11-16
---

> Mantenido por la organización **[floci-io](https://github.com/floci-io)** bajo licencia **MIT**. Unas 32.000 estrellas, versión 2.5.0 (noviembre de 2026) y publicaciones fijas los días 15 y último de cada mes.

## En pocas palabras

**Floci** es un emulador de AWS que corre en tu máquina. Escucha en `http://localhost:4566` y responde con el mismo protocolo que AWS, así que la AWS CLI, los SDK, Terraform, OpenTofu o CDK funcionan contra él cambiando solo el _endpoint_. Un **emulador** imita la API de un servicio sin ser ese servicio: los recursos que creas (un bucket, una cola, una tabla) viven en tu portátil y no cuestan nada.

Nace como respuesta directa a LocalStack: desde marzo de 2026 la imagen de LocalStack pide un token de cuenta y la edición Community dejó de recibir actualizaciones. Floci se anuncia como sustituto directo: mismo puerto, mismas variables y mismos scripts de inicio.

## Qué problema resuelve

Probar código que habla con AWS contra la nube real tiene tres costes: dinero, lentitud y el riesgo de dejar recursos olvidados. Con un emulador local:

- practicas AWS sin tarjeta ni cuenta;
- los tests de integración corren en CI sin credenciales reales;
- cada ejecución empieza con un estado limpio si usas el modo en memoria.

## Cómo funciona

Floci está escrito en Java (Quarkus) y se distribuye como imagen compilada a nativo. Un router HTTP recibe las llamadas y las reparte en tres tipos de servicio:

| Tipo                       | Ejemplos                                                         | Cómo se emula                                       |
| -------------------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| Sin estado, en proceso     | SQS, SNS, IAM, STS, KMS, Step Functions, API Gateway, CloudWatch | Lógica propia dentro del proceso de Floci           |
| Con estado, en proceso     | S3, DynamoDB, DynamoDB Streams                                   | Almacenamiento propio con modos de persistencia     |
| Respaldados por contenedor | Lambda, RDS, ElastiCache, MSK, ECS, EC2, EKS, OpenSearch         | Floci arranca un contenedor real a través de Docker |

Lo de "contenedor real" es literal, pero conviene saber qué hay dentro: RDS levanta `postgres:16-alpine`, `mysql:8.0` o `mariadb:11`; EKS levanta **k3s** (una distribución ligera de Kubernetes, no el plano de control de EKS); MSK usa Redpanda en lugar de Kafka; ElastiCache usa Valkey. Athena ejecuta SQL con un _sidecar_ de DuckDB.

El estado se guarda según `FLOCI_STORAGE_MODE`: `memory` (por defecto, se pierde al parar), `persistent`, `hybrid` (vuelca a disco cada 5 segundos) o `wal`. Si la clave de acceso son 12 dígitos, Floci la usa como ID de cuenta y aísla los recursos por cuenta.

## Instalación

Con Docker Compose, que es la vía más directa:

```yaml
services:
  floci:
    image: floci/floci:latest
    ports:
      - "127.0.0.1:4566:4566"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

El volumen del socket solo hace falta si vas a usar servicios respaldados por contenedor. Con la CLI oficial (macOS y Linux, vía Homebrew):

```bash
brew install floci-io/floci/floci
floci start
eval $(floci env)
```

Cada release incluye además un binario nativo `floci-aws` para Linux, macOS y Windows, para equipos sin Docker.

## Uso

Si no usas `floci env`, exporta las variables a mano y trabaja como siempre:

```bash
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

aws s3 mb s3://mi-bucket
aws dynamodb list-tables
```

Para tests hay módulos de Testcontainers (por ejemplo `testcontainers-floci` en Python) y una consola web en `http://localhost:4566/_floci/ui`, que se arranca como contenedor aparte la primera vez que la abres.

Si vienes de LocalStack, basta con cambiar la imagen: `localstack/localstack` pasa a `floci/floci:latest`. Las variables como `PERSISTENCE=1` se traducen solas y los scripts de `/etc/localstack/init/` se ejecutan sin cambios.

## Las cifras del README (medidas por Floci)

| Dato                 | Floci | LocalStack Community |
| -------------------- | ----------------------- | -------------------------------------- |
| Arranque             | ~24 ms                  | ~3,3 s                                 |
| Memoria en reposo    | ~13 MiB                 | ~143 MiB                               |
| Tamaño de la imagen  | ~90 MB                  | ~1,0 GB                                |
| Token de cuenta      | No                      | Sí                                     |
| Licencia             | MIT                     | Comercial; plan gratuito no comercial  |

Son mediciones del propio proyecto, no independientes. El arranque de 24 ms es el del proceso nativo: un servicio como RDS o EKS tarda lo que tarde en descargar y arrancar su contenedor. En Docker Hub la imagen `latest` ocupa unos 75–78 MB comprimida.

## Cuándo conviene y cuándo no

Conviene para practicar AWS sin cuenta, para tests de integración en CI y para equipos que ya usaban LocalStack Community y no quieren depender de un token.

No sustituye a una cuenta real cuando lo que pruebas es IAM, cuotas, latencias de red, comportamiento entre regiones o servicios que aquí son stubs. Úsalo como primera capa de pruebas, no como la última.

## Alternativas

| Herramienta                                            | Origen      | Licencia            | Puerto | Diferencia principal                                                                  |
| ------------------------------------------------------ | ----------- | ------------------- | ------ | ------------------------------------------------------------------------------------- |
| Floci                                                  | Comunidad   | MIT                 | 4566   | Contenedores reales para bases de datos y cómputo, persistencia opcional, multicuenta |
| [AWS Emulator](/findings/hallazgos-codigo/aws-emulator) | AWS oficial | CC0 1.0             | 9297   | Generado desde los modelos de API de AWS, todo en memoria, HTTPS con firma SigV4      |
| LocalStack                                             | Empresa     | Comercial; plan gratuito no comercial | 4566   | El más veterano; desde 2026 requiere token y la edición Community está congelada      |

La diferencia práctica con AWS Emulator: Floci prioriza la ejecución real (un Postgres de verdad, un k3s de verdad) y la persistencia entre reinicios; AWS Emulator prioriza la fidelidad de la API frente a AWS y mide esa fidelidad con tests publicados.

## Límites y precauciones

- Es un proyecto joven (primer commit en febrero de 2026) con un ritmo de cambios muy alto. Fija una versión (`floci/floci:x.y.z`) en CI en lugar de `latest`.
- Los grupos de seguridad de EC2 y ECS se guardan pero no filtran tráfico salvo que actives `FLOCI_NETWORK_SECURITY_GROUP_ENFORCEMENT_ENABLED`.
- La compatibilidad se mide con unos 2.600 tests automáticos sobre cinco SDK y tres herramientas de IaC, según el README; revisa la [lista de servicios](https://floci.io/floci/services/) para ver qué operaciones cubre cada uno.

## Fuentes

- [Repositorio y README de Floci](https://github.com/floci-io/floci)
- [Documentación oficial](https://floci.io/floci/)
- [floci-cli](https://github.com/floci-io/floci-cli)
- [Imagen en Docker Hub](https://hub.docker.com/r/floci/floci)
- [The road ahead for LocalStack](https://blog.localstack.cloud/the-road-ahead-for-localstack/)
