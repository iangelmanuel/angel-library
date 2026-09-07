---
title: "AWS CLI: configuración y patrones de uso"
description: Instalación por sistema operativo (AWS CLI v2), configuración inicial con aws configure, verificar identidad y manejar múltiples cuentas con profiles.
type: guides
order: 6
tags: [cli, aws, cloud]
scope: aws
updatedAt: 2026-08-17
---

## Instalación (AWS CLI v2)

Difiere por sistema operativo — cada uno usa el instalador nativo oficial:

```powershell
# Windows: instalador MSI oficial (silencioso)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi /qn
```

```bash
# macOS: instalador .pkg oficial
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# macOS alternativa: Homebrew
brew install awscli
```

```bash
# Linux: script oficial (curl + unzip)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

Verificar la instalación:

```bash
aws --version
```

AWS CLI v2 trae su propio runtime de Python embebido — no depende de tener Python instalado en el sistema.

## Configuración inicial

```bash
aws configure
```

Pide cuatro datos interactivamente: Access Key ID, Secret Access Key, región por defecto (ej. `us-east-1`) y formato de salida (`json`, `table`, `text`).

## Verificar identidad

```bash
aws sts get-caller-identity
```

Confirma contra qué cuenta y con qué identidad (usuario o rol) está autenticada la CLI en este momento — el primer chequeo antes de correr cualquier comando que modifique algo, para no operar sobre la cuenta equivocada.

## Estructura general de los comandos

Todo comando de AWS CLI sigue el mismo patrón:

```bash
aws <servicio> <acción> [opciones]
```

Ejemplos:

```bash
aws s3 ls
aws s3 cp archivo.txt s3://mi-bucket/
aws ec2 describe-instances
```

Es una CLI enorme — cubre prácticamente todos los servicios de AWS. En vez de memorizar comandos, `aws <servicio> help` y `aws <servicio> <acción> help` documentan cada uno desde la propia terminal.

## Profiles: manejar múltiples cuentas

```bash
aws configure --profile nombre-cuenta
aws s3 ls --profile nombre-cuenta
```

Cada profile guarda su propio set de credenciales y región, identificado por nombre en `~/.aws/credentials` y `~/.aws/config`. Sin `--profile`, los comandos usan el profile `default`.

## Resumen

| Comando                            | Qué hace                                           |
| ---------------------------------- | -------------------------------------------------- |
| `aws configure`                    | Configura credenciales, región y formato de salida |
| `aws sts get-caller-identity`      | Muestra qué cuenta/identidad está activa           |
| `aws <servicio> <acción>`          | Patrón general de cualquier comando                |
| `aws configure --profile <nombre>` | Crea/edita un profile separado                     |
| `--profile <nombre>`               | Usa un profile específico en cualquier comando     |

## Consideraciones

- Correr `aws sts get-caller-identity` antes de cualquier comando destructivo (borrar un bucket, terminar instancias) es la forma más rápida de confirmar que no se está apuntando a la cuenta equivocada.
- Con varias cuentas (personal, trabajo, distintos clientes) los profiles evitan mezclar credenciales — la variable de entorno `AWS_PROFILE` permite fijar el profile activo para toda una sesión de terminal sin repetir `--profile` en cada comando.
- Es una CLI con cientos de subcomandos por servicio — no tiene sentido memorizarlos todos; `help` al final de cualquier comando trae la referencia completa ahí mismo.
