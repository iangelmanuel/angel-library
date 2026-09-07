---
title: "Railway CLI: comandos esenciales"
description: Herramienta de terminal para conectar un proyecto con Railway, publicarlo, consultar registros de ejecución y usar localmente las variables configuradas en la plataforma.
type: guides
order: 9
tags: [cli, railway, deploy]
scope: railway
website: https://docs.railway.com/cli
related: [terminal/cli/cli-prisma]
updatedAt: 2026-08-28
---

**Railway CLI** permite crear y vincular proyectos, desplegar servicios, inspeccionar logs y ejecutar procesos locales con la configuración alojada en Railway. La herramienta se llama `railway`; el producto y la empresa usan el nombre singular **Railway**, no “Railways”.

## Instalación

```bash
pnpm add -g @railway/cli
```

El paquete requiere Node.js 16 o posterior. También existen instalaciones nativas:

```bash
# macOS
brew install railway

# Windows
scoop install railway
```

Railway publica binarios precompilados. Su instalador para macOS, Linux y Windows mediante WSL puede instalar únicamente la CLI o configurar además integraciones para agentes; usa esa variante solo si deseas explícitamente la integración adicional.

```bash
railway --version
```

## Autenticación

```bash
railway login
railway whoami
```

`login` abre el navegador y `whoami` confirma la cuenta activa. En una sesión remota, un contenedor o un equipo sin interfaz gráfica, usa el código de emparejamiento:

```bash
railway login --browserless
```

La automatización utiliza uno de dos secretos, según el alcance:

| Variable            | Alcance            | Uso apropiado                                         |
| ------------------- | ------------------ | ----------------------------------------------------- |
| `RAILWAY_TOKEN`     | Un proyecto        | Desplegar o administrar un proyecto concreto desde CI |
| `RAILWAY_API_TOKEN` | Cuenta o workspace | Operaciones que abarcan varios proyectos o entornos   |

No definas ambas al mismo tiempo: Railway considera la combinación ambigua. Prefiere el token de proyecto cuando sea suficiente y almacénalo como secreto de CI.

## Inicializar un proyecto

```bash
railway init
```

Crea un proyecto nuevo en Railway y lo asocia con la carpeta actual, siguiendo un flujo interactivo.

Si el proyecto ya existe, no ejecutes `init`; vincúlalo para evitar crear un duplicado.

## Vincular con un proyecto existente

```bash
railway link
railway status
```

Asocia la carpeta local con un proyecto de Railway ya creado (en vez de crear uno nuevo) — el equivalente a `vercel link` o `supabase link`.

`status` muestra el proyecto, entorno y servicio seleccionados. Revísalo antes de modificar variables o desplegar, especialmente cuando administras producción y staging desde la misma máquina.

## Deploy

```bash
railway up
```

Sube el directorio actual y dispara un deploy en Railway.

`railway up` puede iniciar autenticación si todavía no existe una sesión. Un despliegue exitoso no garantiza que la aplicación esté sana: consulta logs y el estado del servicio después de publicarlo.

## Correr un comando con las variables del proyecto

```bash
railway run npm start
railway run npx prisma migrate deploy
```

Ejecuta el comando indicado localmente, pero con las variables de entorno del proyecto de Railway (las mismas que usa el servicio desplegado) inyectadas en el proceso — sin tener que copiarlas a un `.env` local a mano.

## Logs

```bash
railway logs
```

Muestra (y sigue) los logs del deployment activo.

## Variables de entorno

```bash
railway variables
```

Lista las variables de entorno configuradas para el servicio vinculado.

Para crear o modificar un valor:

```bash
railway variables set NODE_ENV=production
```

Evita pasar secretos directamente en una terminal compartida o grabada: el comando puede quedar en el historial. Para valores sensibles, el Dashboard o un mecanismo seguro de automatización ofrece mejor control.

## Resumen

| Comando                 | Qué hace                                                         |
| ----------------------- | ---------------------------------------------------------------- |
| `railway login`         | Autentica la CLI con tu cuenta                                   |
| `railway whoami`        | Confirma la cuenta activa                                        |
| `railway init`          | Crea un proyecto nuevo en Railway                                |
| `railway link`          | Vincula la carpeta local a un proyecto existente                 |
| `railway status`        | Muestra proyecto, entorno y servicio seleccionados               |
| `railway up`            | Deploy del directorio actual                                     |
| `railway run <comando>` | Corre un comando local con las variables del proyecto inyectadas |
| `railway logs`          | Logs del deployment activo                                       |
| `railway variables`     | Lista las variables de entorno del servicio                      |
| `railway open`          | Abre el proyecto vinculado en el navegador                       |

## Consideraciones

- `railway run` es el comando más útil para desarrollo local contra una base de datos hosteada en Railway (ej. `railway run npx prisma studio`) — evita mantener un `.env` duplicado sincronizado a mano.
- `railway link` vincula la carpeta a un servicio específico dentro de un proyecto, no solo al proyecto en general — con varios servicios en el mismo proyecto (API + base de datos, por ejemplo) hay que confirmar cuál quedó seleccionado.
- `railway run` entrega variables al proceso local: cualquier comando hijo puede leerlas. No lo uses con scripts que no sean confiables.
- En CI utiliza tokens y comandos no interactivos. No copies la sesión personal del CLI a un servidor.
