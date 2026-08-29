# REFACTORIZACIÓN ESTRUCTURAL DE `angel-library`

## CONTEXTO

Estás trabajando sobre mi proyecto `angel-library`.

El proyecto actualmente funciona y tiene una funcionalidad definida.

Fue construido parcialmente mediante Vibe Coding/IA y actualmente considero que su estructura interna es demasiado compleja para mi nivel actual de comprensión.

Tengo aproximadamente 3 años de experiencia aprendiendo y trabajando con programación, principalmente JavaScript/TypeScript.

Hay partes del proyecto que entiendo perfectamente, pero existe una cantidad considerable de código, abstracciones y estructuras que actualmente me cuesta seguir.

Mi objetivo es hacer que el proyecto sea mucho más sencillo de leer, entender y mantener.

---

# 🚨 REGLA ABSOLUTA DEL PROYECTO

## LA FUNCIONALIDAD DEBE PERMANECER EXACTAMENTE IGUAL.

Esta es la regla más importante de todo este trabajo.

No estamos creando una nueva versión de `angel-library`.

No estamos rediseñando su comportamiento.

No estamos agregando funcionalidades.

No estamos cambiando la API.

No estamos "mejorando" cómo funciona.

Estamos reorganizando y simplificando INTERNAMENTE el código que ya existe.

La condición final debe ser:

```text
COMPORTAMIENTO ANTES
        =
COMPORTAMIENTO DESPUÉS
```

La única diferencia permitida es:

```text
ESTRUCTURA INTERNA
ORGANIZACIÓN DEL CÓDIGO
LEGIBILIDAD
SIMPLICIDAD
```

---

# NO CAMBIAR

No cambies:

- funcionalidades existentes.
- comportamiento existente.
- API pública.
- exports públicos.
- nombres públicos.
- firmas públicas.
- parámetros.
- valores retornados.
- formatos de salida.
- contratos.
- comportamiento asíncrono.
- orden de operaciones observable.
- errores públicos.
- valores por defecto.
- compatibilidad con consumidores.
- comportamiento esperado de la librería.

No agregues:

- nuevas funcionalidades.
- nuevas APIs.
- nuevas dependencias sin necesidad.
- nuevos patrones arquitectónicos.
- nuevos sistemas.
- nuevas capas innecesarias.

---

# SÍ PUEDES CAMBIAR

Está permitido:

- reorganizar carpetas.
- mover archivos.
- dividir archivos demasiado grandes.
- fusionar archivos pequeños relacionados.
- renombrar archivos INTERNOS si mejora la claridad.
- actualizar imports.
- actualizar exports internos.
- reorganizar tipos.
- reorganizar utilidades.
- eliminar código realmente muerto.
- eliminar duplicación innecesaria.
- simplificar implementaciones internas.
- eliminar abstracciones innecesarias.
- reducir complejidad interna.

Siempre que:

**el comportamiento permanezca exactamente igual.**

---

# OBJETIVO ARQUITECTÓNICO

Quiero una arquitectura orientada a:

```text
SIMPLE
    ↓
EXPLÍCITA
    ↓
LEGIBLE
    ↓
PREDECIBLE
    ↓
MANTENIBLE
```

NO quiero:

```text
ENTERPRISE
ABSTRACTA
SOBRE-INGENIERIZADA
FRAGMENTADA
```

---

# PRINCIPIO MÁS IMPORTANTE

Cuando existan dos soluciones funcionalmente equivalentes:

### Solución A

- más archivos.
- más abstracciones.
- más interfaces.
- más clases.
- más patrones.
- más indirectas.

### Solución B

- menos archivos.
- funciones simples.
- flujo explícito.
- nombres claros.
- pocas abstracciones.

Prefiere:

**SOLUCIÓN B.**

---

# NO UTILICES ARQUITECTURA COMPLEJA POR DEFECTO

No introduzcas automáticamente:

- Clean Architecture.
- Hexagonal Architecture.
- DDD.
- CQRS.
- Event Sourcing.
- Repository Pattern.
- Factory Pattern.
- Strategy Pattern.
- Builder Pattern.
- Dependency Injection.
- Service Layers.
- Managers.
- Providers.
- Orchestrators.
- Adapters.
- Registries.

Si alguno ya existe, analiza si realmente es necesario.

Si solamente agrega complejidad y puede eliminarse sin cambiar comportamiento:

**elimínalo.**

---

# PRINCIPIO DE CÓDIGO OBVIO

Prefiero código que pueda leer y comprender directamente.

Por ejemplo:

```js
const result = parse(value)

if (!result) {
  return null
}

return transform(result)
```

antes que una arquitectura donde ese mismo flujo pase por múltiples capas.

Quiero poder seguir mentalmente:

```text
entrada
   ↓
validación
   ↓
procesamiento
   ↓
resultado
```

sin tener que saltar innecesariamente entre muchos archivos.

---

# FASE 1 — ANALIZAR TODO EL PROYECTO

Antes de modificar código, analiza completamente el repositorio.

Revisa:

- estructura de carpetas.
- archivos.
- `package.json`.
- configuración.
- entry points.
- exports.
- API pública.
- dependencias.
- scripts.
- tests.
- build.
- tipos.
- utilidades.
- módulos.
- flujo principal.

Identifica:

- archivos demasiado grandes.
- funciones demasiado grandes.
- responsabilidades mezcladas.
- abstracciones innecesarias.
- carpetas demasiado profundas.
- código duplicado.
- código muerto.
- imports complejos.
- dependencias innecesarias.
- archivos mal ubicados.
- módulos excesivamente acoplados.
- lógica difícil de seguir.

NO MODIFIQUES NADA DURANTE ESTA FASE.

Primero comprende el proyecto.

---

# FASE 2 — CONSTRUIR UN MAPA DEL PROYECTO

Antes de refactorizar, identifica claramente:

## API pública

Determina:

- entry point.
- exports públicos.
- funciones públicas.
- clases públicas.
- tipos públicos.
- contratos públicos.

Estos elementos deben considerarse protegidos.

---

## Flujo principal

Determina cómo funciona realmente la librería:

```text
entrada
   ↓
procesamiento
   ↓
transformación
   ↓
ejecución
   ↓
resultado
```

Utiliza el flujo real del proyecto.

---

## Responsabilidades

Determina qué responsabilidad tiene realmente cada módulo.

Por ejemplo:

```text
parser.ts
→ parsear

validator.ts
→ validar

renderer.ts
→ renderizar
```

Si un archivo está haciendo muchas cosas diferentes, identifica esas responsabilidades.

---

# FASE 3 — DISEÑAR UNA ESTRUCTURA MÁS SIMPLE

Después de comprender el proyecto, diseña una nueva estructura de directorios.

La estructura debe ser intuitiva.

Quiero poder responder rápidamente:

> "¿Dónde está la lógica relacionada con X?"

Evita estructuras excesivamente profundas como:

```text
src/
  core/
    infrastructure/
      abstractions/
        implementations/
          factories/
            managers/
```

cuando no sean necesarias.

Prefiere estructuras simples.

Por ejemplo:

```text
src/
├── index.ts
├── core/
├── utils/
├── types/
└── ...
```

La estructura exacta debe depender de la naturaleza real de `angel-library`.

NO copies este ejemplo literalmente.

---

# REGLA DE DIRECTORIOS

Cada carpeta debe tener una razón clara para existir.

Cada archivo debe tener una responsabilidad clara.

Evita carpetas genéricas como:

```text
misc/
common/
stuff/
helpers/
```

cuando realmente sea posible nombrarlas por su responsabilidad.

---

# REGLA DE ARCHIVOS

Quiero archivos pequeños y fáciles de leer.

Como orientación:

- intenta mantenerlos por debajo de 150 líneas.
- evita superar aproximadamente 250 líneas.
- no dividas archivos artificialmente.

Estas cifras NO son reglas absolutas.

La prioridad es:

**claridad sobre métricas.**

---

# FASE 4 — REORGANIZAR

Una vez definida la estructura, reorganiza físicamente el proyecto.

Puedes:

- mover archivos.
- dividir archivos.
- fusionar archivos relacionados.
- actualizar imports.
- actualizar exports internos.
- reorganizar tipos.
- reorganizar utilidades.

Pero evita cambiar la implementación interna todavía si no es necesario.

Piensa:

> "Estoy moviendo el código, no cambiando lo que hace."

---

# FASE 5 — SIMPLIFICAR LA IMPLEMENTACIÓN

Después de reorganizar el proyecto, revisa el código interno.

Busca oportunidades para reducir complejidad.

Especialmente:

- wrappers innecesarios.
- funciones que solamente llaman a otra función.
- clases innecesarias.
- factories innecesarias.
- managers innecesarios.
- providers innecesarios.
- abstracciones de una sola implementación.
- código duplicado.
- condiciones excesivamente complejas.
- utilidades demasiado genéricas.
- lógica innecesariamente fragmentada.

---

# EJEMPLO

Si actualmente existe:

```text
A
 ↓
Manager
 ↓
Factory
 ↓
Builder
 ↓
Function
```

y realmente todo termina haciendo:

```text
Function
```

considera simplificarlo a:

```text
A
 ↓
Function
```

pero únicamente si puedes garantizar que el comportamiento es idéntico.

---

# REGLA CONTRA SOBRE-REFACTORIZAR

No refactorices algo solamente porque "podría estar mejor".

Si una parte ya es suficientemente clara:

**déjala intacta.**

No quiero cambios innecesarios.

---

# REGLA DE SEGURIDAD

Si no puedes demostrar razonablemente que un cambio mantiene el comportamiento existente:

**NO HAGAS EL CAMBIO.**

La estabilidad tiene prioridad sobre la elegancia.

---

# FASE 6 — TESTS Y VALIDACIÓN

Después de cada grupo significativo de cambios ejecuta las herramientas disponibles.

Por ejemplo:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Utiliza los comandos reales definidos por el proyecto.

No inventes comandos.

Si existen tests:

- ejecútalos antes de refactorizar.
- ejecútalos durante la refactorización.
- ejecútalos después.

Si los tests fallan:

Primero determina si el fallo fue provocado por la reorganización.

No cambies comportamiento simplemente para conseguir que un test pase.

---

# API PÚBLICA

Antes de finalizar, compara cuidadosamente la API pública.

Debe permanecer igual.

Comprueba:

- exports.
- nombres.
- parámetros.
- tipos.
- retornos.
- entry points.
- package exports.

Si algo público cambió accidentalmente:

**corrígelo.**

---

# DEPENDENCIAS

Analiza las dependencias.

Si existe una dependencia que ya no se necesita después de la reorganización, puedes eliminarla.

Pero solamente si puedes comprobar que no afecta:

- runtime.
- build.
- tests.
- API.
- compatibilidad.

No agregues dependencias salvo que exista una razón realmente necesaria.

---

# TYPESCRIPT

Si el proyecto utiliza TypeScript:

Mantén los tipos sencillos.

Prefiere:

```ts
type User = {
  id: string
  name: string
}
```

cuando sea suficiente.

Evita tipos extremadamente genéricos o complejos sin una necesidad real.

Los tipos deben facilitar la lectura.

No demostrar conocimientos avanzados.

---

# JAVASCRIPT

Prefiere código JavaScript/TypeScript idiomático y sencillo.

Utiliza construcciones normales cuando sean suficientes:

```js
const
let
function
if
for
map
filter
async
await
try
catch
```

Evita metaprogramación, reflection, proxies o abstracciones avanzadas cuando no sean necesarias.

---

# COMENTARIOS

No llenes el código de comentarios.

El código debe explicarse mediante:

- buenos nombres.
- funciones pequeñas.
- estructura clara.

Utiliza comentarios solamente para explicar decisiones que no sean obvias.

---

# NOMBRES

Los nombres deben explicar claramente qué hace algo.

Prefiere:

```text
parseConfig
validateOptions
createPlugin
loadPlugin
executePlugin
```

sobre nombres ambiguos como:

```text
process
handle
manage
run
execute
```

cuando sea posible ser más específico.

---

# DOCUMENTACIÓN

Después de terminar la refactorización crea o actualiza:

```text
docs/ARCHITECTURE.md
```

Debe ser corta.

Debe explicar:

## ¿Qué es `angel-library`?

Descripción sencilla.

## Estructura

```text
src/
├── ...
├── ...
└── ...
```

## ¿Qué hace cada carpeta?

Una explicación breve.

## Flujo principal

Explicación sencilla de cómo funciona.

## Módulos importantes

Solo los realmente importantes.

## Cómo agregar código nuevo

Dónde debe colocar un futuro desarrollador una nueva funcionalidad.

## Reglas

Por ejemplo:

- mantener responsabilidades claras.
- evitar abstracciones innecesarias.
- mantener archivos pequeños.
- preservar la API pública.
- no agregar complejidad sin necesidad.

---

# REGLA SOBRE MARKDOWN

No quiero una cantidad excesiva de documentación Markdown.

Los Markdown deben ser:

- cortos.
- útiles.
- accionables.
- fáciles de leer.

No documentes cada función trivial.

---

# AUDITORÍA FINAL

Cuando consideres terminada la refactorización, NO la des por terminada inmediatamente.

Haz una segunda revisión completa.

Pregúntate:

> ¿Existe alguna parte que todavía sea innecesariamente compleja?

> ¿Hay archivos que podrían ser más claros?

> ¿Hay abstracciones que realmente no aportan valor?

> ¿Hay módulos que podrían estar juntos?

> ¿Hay módulos que deberían estar separados?

> ¿Puedo entender el flujo principal leyendo pocos archivos?

---

# CRITERIO DE ÉXITO

El resultado debe sentirse:

```text
ANTES

complejo
↓
fragmentado
↓
difícil de navegar
↓
difícil de entender
```

y convertirse en:

```text
DESPUÉS

simple
↓
ordenado
↓
predecible
↓
fácil de navegar
↓
fácil de entender
```

---

# CRITERIO MÁS IMPORTANTE

Quiero poder abrir `angel-library` dentro de varios meses y entenderlo sin depender de una IA.

Si una solución es técnicamente sofisticada pero difícil de entender:

**NO la quiero.**

Si una solución es sencilla, explícita y fácil de entender:

**PREFIÉRELA.**

---

# REGLA FINAL Y NO NEGOCIABLE

Antes de terminar, revisa el diff completo.

Para cada cambio importante pregunta:

> ¿Este cambio modifica el comportamiento o solamente la organización interna?

Si modifica comportamiento:

**REVÍERTELO**, salvo que sea estrictamente necesario para mantener el funcionamiento después de mover la estructura.

La refactorización debe conservar:

```text
FUNCIONALIDAD
API
COMPORTAMIENTO
CONTRATOS
RESULTADOS
COMPATIBILIDAD
```

La meta es únicamente mejorar:

```text
ESTRUCTURA
ORGANIZACIÓN
LEGIBILIDAD
SIMPLICIDAD
MANTENIBILIDAD
```

---

# INFORME FINAL

Cuando termines, entrega un resumen con:

## 1. Estructura anterior

```text
...
```

## 2. Estructura nueva

```text
...
```

## 3. Archivos movidos

Lista los principales.

## 4. Archivos divididos

Lista los principales.

## 5. Archivos fusionados

Lista los principales.

## 6. Abstracciones eliminadas

Explica brevemente.

## 7. Código simplificado

Explica las principales simplificaciones.

## 8. API

Confirma si permaneció idéntica.

## 9. Funcionalidad

Confirma que no se agregaron, eliminaron ni modificaron funcionalidades.

## 10. Validación

Indica:

```text
Tests: PASS / FAIL
Lint: PASS / FAIL
Typecheck: PASS / FAIL
Build: PASS / FAIL
```

## 11. Conclusión

Confirma explícitamente:

> `angel-library` fue reorganizado y simplificado internamente manteniendo exactamente la funcionalidad y el comportamiento público existentes.
