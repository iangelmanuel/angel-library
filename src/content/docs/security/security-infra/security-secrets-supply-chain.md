---
title: Secretos, dependencias y cadena de suministro
description: Evitar filtraciones y paquetes comprometidos desde el equipo local hasta CI, imágenes y producción.
type: guides
order: 6
tags: [security, secrets, dependencies, supply-chain]
scope: seguridad del ciclo de desarrollo
related:
  - security/security-testing/web-security-checklist
  - devops/ci-cd/cicd-pipeline-fundamentals
updatedAt: 2026-08-18
---

## Secretos

- Nunca en Git, bundle cliente, logs, capturas, artefactos o Docker layers.
- Usa secret manager del entorno y credenciales distintas por ambiente.
- Prefiere tokens de corta duración e identidades de workload sobre claves permanentes.
- Rota por calendario y de inmediato ante exposición.
- Si un secreto llegó a Git, borrarlo del último commit no basta: revocalo.

Todo valor público inyectado al frontend debe considerarse visible. Un prefijo como `PUBLIC_` o `NEXT_PUBLIC_` es una decisión de exposición, no una protección.

## Dependencias

Bloquea versiones con lockfile, revisa cambios de resolución y mantén el registry explícito. Automatiza advisories, pero evalúa alcanzabilidad e impacto antes de aplicar upgrades mayores a ciegas.

Reduce paquetes triviales y scripts de instalación innecesarios. En integración continua, instala de forma reproducible, con permisos mínimos y sin entregar secretos a builds de contribuciones no confiables.

## CI/CD

- Pinnear actions o imágenes por versión/digest según riesgo.
- Proteger ramas y requerir revisión para workflows.
- Separar build de deploy y aprobar producción.
- Generar SBOM/provenance cuando el contexto lo justifique.
- Firmar y verificar artefactos críticos.

## Respuesta

Ante una dependencia comprometida: congela despliegues, identifica versiones y entornos afectados, rota credenciales accesibles, reconstruye desde una base limpia y busca indicadores en los registros. La recuperación debe asumir que el atacante pudo leer todos los secretos disponibles para el proceso.

## Errores habituales

- Un secreto se filtra en un error de build, aunque no exista en el bundle final.
- Una credencial de producción está disponible para todos los pull requests.
- Un workflow instala una acción mutable sin revisión y ejecuta código con permisos de escritura.
- Un Dockerfile copia `.env`, cachea un secreto en una capa o deja herramientas de depuración en la imagen.
- Un paquete abandonado mantiene acceso a un hook de instalación con más permisos de los necesarios.

Revisa el repositorio, historial, artefactos, logs de CI, imágenes y sistemas de observabilidad. Buscar solo en el árbol actual no detecta una clave que estuvo comprometida en un commit anterior.

## Rotación paso a paso

1. Revoca la credencial expuesta antes de iniciar una limpieza larga.
2. Identifica qué sistemas, ambientes y periodos pudo afectar.
3. Emite un reemplazo con alcance menor y actualiza el secret manager.
4. Despliega desde un build limpio; no reutilices artefactos hechos con la clave comprometida.
5. Busca uso anómalo y conserva evidencia para el análisis.
6. Añade un detector o prueba que evite repetir la filtración.

La rotación debe estar practicada. Si solo existe como una instrucción teórica, el tiempo de recuperación será mucho mayor durante un incidente.
