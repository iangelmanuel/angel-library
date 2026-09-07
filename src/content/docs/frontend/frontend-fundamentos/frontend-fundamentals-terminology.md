---
title: "Frontend: fundamentos y terminología"
description: Modelo mental del navegador, renderizado, componentes, estado, hidratación, paquetes y arquitectura de una interfaz web.
type: guides
tags: [frontend, navegador, renderizado, componentes, fundamentos]
order: 1
updatedAt: 2026-08-19
---

El **frontend** es la parte de un producto digital que se ejecuta cerca del usuario y presenta la interfaz. En la Web, su runtime principal es el navegador. HTML expresa estructura y significado, CSS define presentación y adaptación, y JavaScript coordina comportamiento y datos dinámicos.

**UI** significa _User Interface_ o interfaz de usuario: controles, contenido y estados con los que una persona interactúa. **UX** significa _User Experience_ o experiencia de usuario: el recorrido completo, incluida la claridad, velocidad, accesibilidad y confianza que produce el sistema.

## Del URL a una página interactiva

Cuando se navega a una URL, ocurre una secuencia parecida a esta:

```text
URL → solicitud HTTP → respuesta HTML → DOM
                           + CSS → CSSOM
                           + recursos → layout → pintura → composición
                           + JavaScript → comportamiento e interacción
```

**URL** significa _Uniform Resource Locator_, localizador uniforme de recursos. **HTTP** es el protocolo con el que cliente y servidor intercambian solicitudes y respuestas.

El **DOM** (_Document Object Model_) es la representación en objetos del documento. El **CSSOM** (_CSS Object Model_) representa las reglas de estilo. El navegador combina ambos para calcular qué se renderiza.

## Cliente, servidor y frontera de confianza

El navegador es el **cliente**: inicia solicitudes y presenta resultados. El servidor procesa reglas, accede a datos y responde. Esta división no es solo técnica; también es una frontera de seguridad.

Todo código y dato entregado al navegador puede ser inspeccionado o modificado por la persona que controla ese navegador. La validación de cliente mejora la experiencia, pero permisos, precios y reglas críticas se vuelven a comprobar en el servidor.

```ts
// Útil para dar respuesta inmediata en la interfaz.
const isEmailShape = /^[^@]+@[^@]+$/.test(email)

// El servidor todavía valida formato, permisos y reglas de negocio.
```

## Componentes, propiedades y estado

Un **componente** encapsula una parte de la interfaz y su comportamiento. Sus **props**, abreviatura de _properties_, son datos recibidos desde el exterior. El **estado** es información que cambia durante la vida de la interfaz.

```tsx
function Counter({ initialValue = 0 }: { initialValue?: number }) {
  const [count, setCount] = useState(initialValue)

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      Total: {count}
    </button>
  )
}
```

`initialValue` configura el componente. `count` representa estado actual. La función pasada a `setCount` recibe el valor más reciente, lo que evita depender de un cierre obsoleto cuando se agrupan actualizaciones.

No todo dato visible debe guardarse como estado. Si puede calcularse a partir de props o de otro estado durante el render, almacenarlo por separado introduce dos fuentes de verdad.

## Renderizado y ciclo de vida

**Renderizar** es producir la representación de la interfaz para un estado dado. Un nuevo render no significa necesariamente reconstruir todo el DOM; frameworks como React comparan representaciones y aplican cambios concretos.

Un **efecto** sincroniza el componente con algo externo al cálculo de interfaz: una suscripción, un temporizador, una API del navegador o una conexión. Calcular un total a partir de una lista no es un efecto; es un valor derivado.

El **ciclo de vida** describe montaje, actualizaciones y desmontaje. Cualquier suscripción creada debe tener una estrategia de limpieza para no conservar listeners, conexiones o temporizadores después de que el componente desaparece.

## SPA, MPA, CSR, SSR y SSG

Estos acrónimos describen decisiones diferentes:

| Sigla | Significado               | Idea principal                                                      |
| ----- | ------------------------- | ------------------------------------------------------------------- |
| SPA   | _Single-Page Application_ | La navegación suele actualizar una misma página mediante JavaScript |
| MPA   | _Multi-Page Application_  | Cada navegación principal solicita un nuevo documento               |
| CSR   | _Client-Side Rendering_   | El navegador produce gran parte del contenido con JavaScript        |
| SSR   | _Server-Side Rendering_   | El servidor genera HTML para cada solicitud                         |
| SSG   | _Static Site Generation_  | El HTML se genera durante el build                                  |

Una aplicación puede mezclar estrategias por ruta. Un catálogo público puede ser estático, una página personalizada puede usar SSR y un editor complejo puede incorporar CSR.

## Hidratación e islas

La **hidratación** conecta JavaScript del cliente con HTML renderizado previamente para volverlo interactivo. Tiene costo de descarga, análisis y ejecución aunque el HTML ya sea visible.

Una arquitectura de **islas** envía JavaScript solo para componentes interactivos concretos. El contenido estático permanece como HTML. Astro usa este modelo para reducir JavaScript inicial cuando la mayor parte de la página no necesita estado en el cliente.

Hidratar todo por costumbre puede empeorar rendimiento; evitar JavaScript a cualquier costo también puede complicar una experiencia realmente interactiva. La decisión parte de las necesidades del componente.

## Estado local, compartido y remoto

- **Estado local:** solo importa a un componente o sección, como si un menú está abierto.
- **Estado compartido:** varias partes de la interfaz necesitan la misma fuente, como una preferencia de tema.
- **Estado remoto:** representa datos cuyo propietario es un servidor, como productos o comentarios.
- **Estado de URL:** filtros o selección que deben poder enlazarse, recargarse o compartirse.

El estado remoto incluye carga, error, revalidación y posible desactualización. Una biblioteca de consultas puede administrar caché y reintentos; no convierte automáticamente esos datos en estado local.

## Bundle, dependencia y carga diferida

El **bundle** es uno o varios archivos resultantes del empaquetado. Una **dependencia** añade código propio y transitivo. Su costo incluye descarga, análisis, ejecución, actualización y superficie de seguridad.

La **división de código** separa módulos y la **carga diferida** posterga trabajo hasta que sea necesario:

```ts
async function openRichEditor() {
  const { createEditor } = await import("./rich-editor")
  return createEditor()
}
```

La importación dinámica crea un límite que el bundler puede convertir en otro fragmento. Es útil para funciones costosas y poco frecuentes, no para dividir cada componente pequeño y añadir solicitudes innecesarias.

## Mejora progresiva y resiliencia

La **mejora progresiva** empieza con una base funcional y añade capacidades cuando el navegador las soporta. Un formulario HTML puede enviar datos sin JavaScript y recibir validación más rápida cuando el script carga.

Diseña estados explícitos: inicial, carga, éxito, vacío, error, sin conexión y permiso denegado. Una interfaz no está completa si solo funciona en el camino exitoso.

## Curva de aprendizaje recomendada

1. HTML semántico, formularios y navegación.
2. CSS, layout adaptable y estados de interacción.
3. JavaScript, DOM, eventos, red y asincronía.
4. Componentes, estado y composición.
5. Renderizado del framework y fronteras cliente-servidor.
6. Accesibilidad, pruebas, seguridad y rendimiento.
7. Herramientas de construcción y operación en producción.
