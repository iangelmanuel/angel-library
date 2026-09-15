---
title: "Flowsint: investigaciones OSINT sobre un grafo de entidades"
description: "Plataforma autoalojada que enlaza dominios, IPs, correos, alias y billeteras en un grafo navegable, con enriquecedores automáticos por tipo de entidad."
tags: [osint, seguridad, grafo, fastapi, neo4j, docker, autoalojado]
sidebar:
  order: 6
draft: false
resourceCategory: developer-tools
website: https://flowsint.io
url: https://github.com/reconurge/flowsint
updatedAt: 2026-09-14
---

> Publicado por **[reconurge](https://github.com/reconurge)** con licencia Apache-2.0. Incluye un [ETHICS.md](https://github.com/reconurge/flowsint/blob/main/ETHICS.md) propio.

[Flowsint](https://github.com/reconurge/flowsint) es una plataforma de investigación OSINT que representa el caso como un **grafo de entidades y relaciones**, navegable visualmente. Está pensada para analistas de seguridad, investigación y threat intelligence.

## Enriquecedores

Cada tipo de entidad tiene sus consultas automáticas:

| Entidad              | Qué consulta                                        |
| -------------------- | --------------------------------------------------- |
| Dominio              | DNS, WHOIS, subdominios, histórico                  |
| IP                   | Resolución y datos de ASN                           |
| Alias de usuario     | Búsqueda en redes sociales (Maigret)                |
| Correo               | Filtraciones conocidas, Gravatar                    |
| Billetera cripto     | Análisis de la dirección                            |
| Sitio web            | Rastreo y extracción de contenido                   |
| Persona u organización | Construcción de perfil a partir de lo anterior    |

El flujo de trabajo es expandir un nodo, ver qué aparece, y decidir qué rama seguir — en lugar de acumular resultados sueltos sin relación entre ellos.

## Arquitectura

- **Backend:** Python con FastAPI y Celery, PostgreSQL, Neo4j y Redis.
- **Frontend:** JavaScript/Node.js.
- **Despliegue:** Docker Compose.

Neo4j es lo que hace que el grafo sea consultable de verdad y no solo un dibujo.

## Instalación

Linux y macOS (con Docker y Make):

```bash
git clone https://github.com/reconurge/flowsint.git
cd flowsint && make prod
```

Windows (con Docker Desktop):

```bash
git clone https://github.com/reconurge/flowsint.git
cd flowsint
copy .env.example .env
docker compose -f docker-compose.prod.yml up -d
```

Queda disponible en `http://localhost:5173`. Los datos se guardan localmente, en tus contenedores.

## Marco legal y ético

El proyecto es explícito: está pensado **estrictamente para investigación lícita y ética**. Quedan fuera la vigilancia no autorizada, el acoso, el doxxing y la manipulación política.

Lo que eso significa en la práctica antes de ejecutar una consulta:

1. Ten una base legítima para investigar a esa entidad — un encargo, un incidente propio, un permiso.
2. Consultar datos públicos sobre una persona identificable sigue siendo tratamiento de datos personales: en la UE, el RGPD aplica igual.
3. Las consultas automáticas dejan rastro y pueden violar los términos de servicio del sitio consultado o cruzar la línea del escaneo no autorizado.
4. Minimiza: guarda lo necesario para el caso, no todo lo que el enriquecedor devuelva.
5. Documenta la fuente de cada nodo — un grafo sin procedencia no sirve como evidencia.

## Límites

- Está en desarrollo temprano y las suites de pruebas están incompletas.
- Desplegarlo en red requiere conocimiento técnico: son varios servicios, no un binario.
- Los enriquecedores dependen de fuentes externas: un resultado vacío puede ser ausencia de dato o un límite de cuota.
- Un grafo sugiere relaciones que a veces son coincidencias; la inferencia sigue siendo humana.

## Fuentes

- [Repositorio y README de Flowsint](https://github.com/reconurge/flowsint)
- [Sitio oficial](https://flowsint.io)
- [ETHICS.md del proyecto](https://github.com/reconurge/flowsint/blob/main/ETHICS.md)
