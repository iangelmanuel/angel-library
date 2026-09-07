---
title: Insomnia — desarrollo y pruebas de APIs
description: Aplicación para enviar solicitudes a una API y revisar sus respuestas antes de crear una interfaz; permite organizar pruebas, autenticación y variables sin exponer secretos.
type: guides
order: 1
tags: [insomnia, api, http, testing, openapi]
website: https://insomnia.rest
related:
  - backend/backend-fundamentos/backend-api-design
  - languages/javascript/http-browser-fundamentals
  - testing/testing-integracion/testing-backend-database
updatedAt: 2026-08-25
---

**Insomnia** es una aplicación de escritorio de código abierto para diseñar, enviar, depurar y probar APIs. Soporta solicitudes HTTP, colecciones, entornos, autenticación, documentos OpenAPI, mocks, scripts y automatización mediante CLI.

## Instalación

```bash
# Windows (winget)
winget install -e --id Insomnia.Insomnia

# macOS (Homebrew)
brew install --cask insomnia

# Linux — también disponible como Snap
sudo snap install insomnia
```

En Linux también hay `.deb`/`.rpm` en la página de descarga directa si no usas Snap. `inso`, el CLI de automatización que se ve más abajo, es un paquete aparte (`brew install --cask inso` en macOS).

## Modelo de trabajo

```text
proyecto
  → colección
    → carpetas por dominio
      → requests
  → entorno base
    → desarrollo / staging / producción
  → scripts y pruebas
```

Una colección debe representar el contrato de la API, no una lista de requests llamadas “test 1”, “nuevo” y “final”. Usa nombres que incluyan intención: `Crear sesión válida`, `Rechazar orden ajena` o `Listar productos paginados`.

## Primera solicitud

```http
GET {{ base_url }}/api/products?limit=20
Accept: application/json
Authorization: Bearer {{ token }}
```

Revisa método, URL, query params, headers, autenticación y body por separado. Insomnia puede generar código cliente, pero el snippet generado sigue necesitando manejo de errores, timeout y secretos apropiado para la aplicación real.

## Environments

```json title="Base Environment"
{
  "base_url": "http://localhost:3000",
  "tenant_id": "demo"
}
```

Los subentornos sobrescriben solo valores diferentes. Separa desarrollo, staging y producción y haz visible cuál está activo antes de enviar una mutación.

No sincronices tokens reales dentro de un entorno compartido. Usa subentornos privados y el vault para secretos cuando corresponda. Una variable llamada `token` no es segura solo por estar fuera de la URL.

## Autenticación

Insomnia incluye helpers para Basic, Bearer, OAuth 2.0 y otros esquemas. El helper construye headers, pero no cambia el modelo de seguridad: el token debe tener alcance mínimo, expiración adecuada y transporte HTTPS.

## Comprobar respuestas con scripts

```js title="After-response script"
const body = insomnia.response.json()

insomnia.test("responde 200", () => {
  insomnia.expect(insomnia.response.code).to.eql(200)
})

insomnia.test("cada producto tiene id", () => {
  insomnia
    .expect(body.items.every((item) => typeof item.id === "string"))
    .to.eql(true)
})
```

Prueba status, headers, forma y reglas relevantes. Evita afirmar un body completo si campos como identificadores o fechas cambian legítimamente.

## Encadenar requests

Un flujo puede crear una entidad, extraer su identificador y usarlo en requests posteriores. Mantén limpieza o datos únicos para que repetir la colección no dependa del estado de una ejecución anterior.

## OpenAPI, importación y Git

Puedes importar OpenAPI, Postman, cURL y otros formatos. Cuando una especificación sea la fuente de verdad, versiona el archivo y valida cambios en CI. Git Sync permite conservar colecciones como archivos revisables; revisa siempre que no incluyan credenciales.

## Automatización

Inso CLI puede ejecutar colecciones, pruebas y validación de especificaciones en CI. La ejecución automatizada debe usar un entorno de prueba aislado, no la colección apuntando accidentalmente a producción.

Fuentes: [documentación de Insomnia](https://developer.konghq.com/insomnia/), [entornos](https://developer.konghq.com/insomnia/environments/) y [testing de APIs](https://developer.konghq.com/insomnia/test/).
