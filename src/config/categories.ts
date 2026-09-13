export const CATEGORIES = {
  accessibility: {
    label: "Accesibilidad",
    icon: "accessibility",
    description: "Interfaces y contenido que pueden utilizar más personas.",
    color: "--cat-accessibility",
    group: "calidad",
    order: 3,
    subcategories: {
      "a11y-fundamentos": {
        label: "Fundamentos de accesibilidad",
        description:
          "Por qué importa y a quién deja fuera una interfaz descuidada."
      },
      "a11y-contenido": {
        label: "Contenido perceptible",
        description:
          "Que el contenido se pueda percibir: contraste, texto e imágenes."
      },
      "a11y-interaccion": {
        label: "Semántica e interacción",
        description: "Que se pueda usar con teclado y lector de pantalla."
      },
      "a11y-testing": {
        label: "Pruebas de accesibilidad",
        description: "Comprobar accesibilidad a mano y de forma automática."
      }
    }
  },
  agents: {
    label: "Agentes",
    icon: "bot",
    description:
      "Asistentes de programación con IA: configuración, memoria, comandos, extensiones y flujos de trabajo.",
    color: "--cat-agents",
    group: "producto",
    order: 1,
    subcategories: {
      "agents-fundamentos": {
        label: "Fundamentos de agentes",
        description:
          "Cómo trabaja un agente de programación: contexto, herramientas, permisos, autonomía, subagentes y verificación."
      },
      "claude-code": {
        label: "Claude Code",
        description:
          "El asistente de Anthropic en la terminal: configuración y flujos."
      },
      codex: {
        label: "Codex CLI",
        description: "El asistente de OpenAI en la terminal."
      },
      cursor: {
        label: "Cursor",
        description: "Editor de código con IA integrada."
      },
      opencode: {
        label: "OpenCode",
        description: "Asistente de código abierto para la terminal."
      }
    }
  },
  ai: {
    label: "IA SDK",
    icon: "brain",
    description:
      "Programar contra modelos de IA desde el código: SDKs, prompts, contexto, RAG, agentes y evaluaciones.",
    color: "--cat-ai",
    group: "producto",
    order: 3,
    subcategories: {
      "ai-fundamentos": {
        label: "Fundamentos de IA",
        description:
          "Cómo funciona un modelo de lenguaje y qué puede o no puede hacer."
      },
      "ai-prompts": {
        label: "Prompts y contexto",
        description:
          "Escribir instrucciones y dar contexto para obtener buenas respuestas."
      },
      "ai-rag": {
        label: "Embeddings y RAG",
        description:
          "Buscar en tus propios datos para que el modelo responda con ellos."
      },
      "ai-agentes": {
        label: "Agentes, herramientas y evaluación",
        description:
          "Modelos que usan herramientas y toman pasos, y cómo evaluarlos."
      },
      "ai-sdk": {
        label: "SDK para IA",
        description: "Programar contra modelos desde tu código."
      }
    }
  },
  applications: {
    label: "Aplicaciones",
    icon: "app-window",
    description:
      "Programas que acompañan el trabajo de desarrollo: escribir y ejecutar código, probar APIs, administrar despliegues, diseñar interfaces y colaborar. Cada módulo explica qué resuelve la herramienta y cuándo conviene usarla.",
    color: "--cat-applications",
    group: "referencia",
    order: 0,
    subcategories: {
      "apps-editors": {
        label: "Editores de código",
        description:
          "Programas para escribir, navegar, ejecutar y depurar código desde un mismo espacio de trabajo."
      },
      "apps-browsers": {
        label: "Navegadores",
        description:
          "Navegadores alternativos, su modelo de privacidad, compatibilidad, instalación y límites reales."
      },
      "apps-terminal": {
        label: "Terminales",
        description:
          "Aplicaciones para ejecutar comandos con búsqueda, historial y sesiones más fáciles de organizar."
      },
      "apps-cli": {
        label: "Herramientas de terminal (CLI)",
        description:
          "Programas sin interfaz gráfica que se controlan escribiendo comandos; aquí se explica qué administran y cómo empezar."
      },
      "apps-api": {
        label: "Pruebas de APIs",
        description:
          "Aplicaciones para enviar solicitudes a una API, inspeccionar sus respuestas y detectar errores sin construir primero una interfaz."
      },
      "apps-devops": {
        label: "DevOps y contenedores",
        description:
          "Herramientas para ejecutar servicios en contenedores y administrar el entorno donde se desarrolla o publica una aplicación."
      },
      "apps-design": {
        label: "Diseño y diagramación",
        description:
          "Aplicaciones para definir el aspecto de una interfaz, preparar prototipos y comunicar ideas mediante diagramas."
      },
      "apps-video": {
        label: "Video y grabación",
        description:
          "Herramientas para grabar, transcribir, doblar y convertir audio o video en demostraciones, tutoriales y otras piezas publicables."
      },
      "apps-media": {
        label: "Música y multimedia",
        description:
          "Reproductores y clientes de escritorio para consumir música, audio y video sin depender del navegador."
      },
      "apps-productivity": {
        label: "Notas y documentación",
        description:
          "Espacios para organizar notas, documentación, decisiones y datos que debe consultar un equipo."
      },
      "apps-comms": {
        label: "Comunicación",
        description:
          "Canales para conversar, dar soporte y conectar notificaciones o automatizaciones con un equipo o comunidad."
      }
    }
  },
  architecture: {
    label: "Arquitectura",
    icon: "network",
    description:
      "Decisiones estructurales y patrones para proyectos mantenibles.",
    color: "--cat-architecture",
    group: "calidad",
    order: 0,
    subcategories: {
      principios: {
        label: "Principios",
        description:
          "Reglas generales para que el código siga siendo mantenible."
      },
      "patrones-diseno": {
        label: "Patrones de diseño",
        description:
          "Soluciones conocidas a problemas que se repiten en el código."
      },
      "patrones-arquitectonicos": {
        label: "Patrones arquitectónicos",
        description: "Cómo se organiza un sistema completo por dentro."
      }
    }
  },
  backend: {
    label: "Backend",
    icon: "server",
    description:
      "Servidores, interfaces de programación de aplicaciones (APIs) y arquitectura de backend.",
    color: "--cat-backend",
    group: "construir",
    order: 3,
    subcategories: {
      "backend-fundamentos": {
        label: "Fundamentos de backend",
        description:
          "Qué hace un servidor: peticiones, respuestas y arquitectura de una API."
      },
      node: {
        label: "Node.js",
        description: "Ejecutar JavaScript fuera del navegador."
      },
      express: {
        label: "Express",
        description: "Framework mínimo para montar una API en Node.js."
      },
      astro: {
        label: "Astro",
        description:
          "Framework orientado a sitios de contenido, con muy poco JavaScript en el cliente."
      },
      nextjs: {
        label: "Next.js",
        description:
          "Framework sobre React con renderizado en servidor y enrutado por archivos."
      }
    }
  },
  benchmarks: {
    label: "Benchmarks",
    icon: "gauge",
    description:
      "Pruebas comparativas de IA, web, frameworks, bases de datos y hardware. Cada ficha explica qué se mide, cómo se obtiene el resultado, quién lo respalda y qué límites tiene la comparación.",
    color: "--cat-benchmarks",
    group: "referencia",
    order: 3,
    subcategories: {
      "benchmarks-ia": {
        label: "IA",
        description:
          "Evaluaciones de modelos y agentes de IA: capacidad, velocidad, coste y calidad en tareas reales o controladas."
      },
      "benchmarks-web": {
        label: "Web y navegadores",
        description:
          "Pruebas para comparar la respuesta de navegadores y diagnosticar cómo carga y se comporta una página."
      },
      "benchmarks-frameworks": {
        label: "Frameworks",
        description:
          "Comparativas reproducibles de frameworks frontend y backend bajo cargas y operaciones delimitadas."
      },
      "benchmarks-databases": {
        label: "Bases de datos",
        description:
          "Cargas de trabajo para medir consultas, transacciones, ingestión y almacenamiento en motores de datos."
      },
      "benchmarks-hardware": {
        label: "Hardware y sistemas",
        description:
          "Suites para comparar procesadores, gráficos, memoria, almacenamiento y sistemas completos bajo condiciones documentadas."
      }
    }
  },
  courses: {
    label: "Cursos",
    icon: "book-open",
    description:
      "Cursos, programas, plataformas y certificaciones cuyo propósito principal es enseñar o validar el aprendizaje sobre una tecnología o herramienta.",
    color: "--cat-courses",
    group: "referencia",
    order: 1,
    subcategories: {
      "cursos-midudev": {
        label: "Midudev",
        description:
          "Cursos y materiales gratuitos en español de Miguel Ángel Durán, con rutas desde fundamentos hasta proyectos completos."
      },
      "cursos-microsoft": {
        label: "Microsoft",
        description:
          "Sesiones, currículos y certificados de Microsoft sobre desarrollo, nube e inteligencia artificial."
      },
      "cursos-google": {
        label: "Google",
        description:
          "Programas guiados de Google sobre inteligencia artificial y computación en la nube, algunos con requisitos o convocatorias."
      },
      "cursos-mongodb": {
        label: "MongoDB",
        description:
          "Rutas, sesiones y credenciales oficiales para aprender MongoDB y validar conocimientos prácticos."
      },
      "cursos-amazon": {
        label: "Amazon",
        description:
          "Certificaciones y evaluaciones prácticas de AWS para validar conocimientos dentro de entornos reales de la nube de Amazon."
      },
      "cursos-plataformas": {
        label: "Plataformas educativas",
        description:
          "Sitios con cursos y ejercicios guiados para alcanzar un objetivo de aprendizaje concreto."
      }
    }
  },
  database: {
    label: "Bases de datos",
    icon: "database",
    description:
      "Bases de datos, mapeadores objeto-relacionales (ORM), consultas y persistencia.",
    color: "--cat-database",
    group: "construir",
    order: 5,
    subcategories: {
      "database-fundamentos": {
        label: "Fundamentos",
        description:
          "Qué es una base de datos y cómo se decide entre los tipos que existen."
      },
      "database-modelado": {
        label: "Modelado y relaciones",
        description:
          "Diseñar tablas y relaciones para que los datos se mantengan coherentes."
      },
      "database-sql": {
        label: "SQL y consultas",
        description: "Escribir consultas para leer y modificar datos."
      },
      "database-postgresql": {
        label: "PostgreSQL",
        description:
          "El motor relacional más usado: configuración, mantenimiento y seguridad."
      },
      "database-nosql": {
        label: "NoSQL",
        description: "Bases de datos sin tablas: documentos y clave-valor."
      },
      "database-prisma": {
        label: "Prisma ORM",
        description:
          "Esquemas, consultas e integración de Prisma con servidores JavaScript."
      },
      "database-operacion": {
        label: "Operación y recuperación",
        description:
          "Mantener una base de datos viva: copias, migraciones y diagnóstico."
      }
    }
  },
  devops: {
    label: "DevOps",
    icon: "container",
    description:
      "Desarrollo y operaciones (DevOps): entrega continua, despliegue, infraestructura y observabilidad.",
    color: "--cat-devops",
    group: "construir",
    order: 7,
    subcategories: {
      "devops-fundamentos": {
        label: "Fundamentos de DevOps",
        description: "Llevar código a producción y mantenerlo funcionando."
      },
      "cloud-fundamentos": {
        label: "Fundamentos de nube",
        description: "Conceptos de la nube: qué se alquila y qué se paga."
      },
      "infraestructura-codigo": {
        label: "Infraestructura como código",
        description: "Declarar servidores y servicios en archivos versionables."
      },
      "docker-conceptos": {
        label: "Conceptos básicos",
        description: "Qué es un contenedor y qué problema resuelve."
      },
      "docker-imagenes": {
        label: "Imágenes",
        description:
          "Construir la plantilla desde la que arranca un contenedor."
      },
      "docker-contenedores": {
        label: "Contenedores",
        description: "Ejecutar, inspeccionar y depurar contenedores."
      },
      "docker-redes-volumenes": {
        label: "Redes y volúmenes",
        description:
          "Comunicar contenedores entre sí y guardar datos que sobrevivan."
      },
      "docker-compose": {
        label: "Docker Compose",
        description:
          "Levantar varios contenedores a la vez con un solo archivo."
      },
      "docker-bases-datos": {
        label: "Bases de datos",
        description:
          "Correr bases de datos en contenedores para desarrollo local."
      },
      "ci-cd": {
        label: "CI/CD y despliegue",
        description: "Automatizar pruebas y despliegues en cada cambio."
      },
      observabilidad: {
        label: "Observabilidad y operación",
        description:
          "Ver qué hace un sistema en producción: registros, métricas y alertas."
      }
    }
  },
  findings: {
    label: "Hallazgos",
    icon: "telescope",
    description:
      "Repositorios y proyectos de la comunidad que presentan soluciones, herramientas, material educativo, espacios de interacción o experimentos interesantes.",
    color: "--cat-findings",
    group: "referencia",
    order: 2,
    subcategories: {
      "hallazgos-ia": {
        label: "IA y agentes",
        description:
          "Proyectos para estudiar cómo varios agentes colaboran, conservan contexto o actúan dentro de un producto real."
      },
      "hallazgos-web": {
        label: "Web y producto",
        description:
          "Implementaciones web que convierten ideas poco habituales en experiencias, herramientas o arquitecturas concretas."
      },
      "hallazgos-codigo": {
        label: "Código y desarrollo",
        description:
          "Repositorios con código, explicaciones y prácticas que permiten estudiar una tecnología o mejorar la forma de desarrollar."
      },
      "hallazgos-recursos": {
        label: "Recursos de la comunidad",
        description:
          "Repositorios, guías, plantillas y colecciones de la comunidad que facilitan tareas o reúnen información útil."
      }
    }
  },
  frontend: {
    label: "Frontend",
    icon: "monitor",
    description:
      "Frontend, interfaz de usuario (UI), renderizado en el navegador y frameworks de componentes.",
    color: "--cat-frontend",
    group: "construir",
    order: 2,
    subcategories: {
      "frontend-fundamentos": {
        label: "Fundamentos de frontend",
        description:
          "Cómo funciona una interfaz en el navegador, antes de elegir framework."
      },
      astro: {
        label: "Astro",
        description:
          "Framework orientado a sitios de contenido, con muy poco JavaScript en el cliente."
      },
      react: {
        label: "React",
        description: "Construir interfaces con componentes y estado."
      },
      nextjs: {
        label: "Next.js",
        description:
          "Framework sobre React con renderizado en servidor y enrutado por archivos."
      }
    }
  },
  general: {
    label: "General",
    icon: "globe",
    description:
      "TypeScript, utilidades, snippets y patrones reutilizables para el desarrollo diario.",
    color: "--cat-general",
    group: "construir",
    order: 0,
    subcategories: {
      "general-fundamentos": { label: "Empieza aquí" },
      config: {
        label: "Config",
        description:
          "Archivos y herramientas que configuran un proyecto antes de escribir código."
      },
      monorepo: {
        label: "Monorepo",
        description:
          "Varios paquetes conviviendo en un mismo repositorio y cómo se coordinan."
      },
      typescript: {
        label: "TypeScript",
        description: "Tipado sobre JavaScript: qué añade y cómo se configura."
      },
      utils: {
        label: "Utils",
        description:
          "Funciones pequeñas y reutilizables para tareas del día a día."
      },
      whatsapp: {
        label: "WhatsApp API",
        description:
          "Conectar una aplicación con WhatsApp mediante un gateway propio."
      }
    }
  },
  git: {
    label: "Git & GitHub",
    icon: "git-branch",
    description:
      "Git, GitHub y su ecosistema: comandos, repositorios, colaboración, perfil y automatización con Actions.",
    color: "--cat-git",
    group: "flujo",
    order: 0,
    subcategories: {
      git: {
        label: "Git",
        description:
          "Control de versiones: guardar historia y trabajar en paralelo."
      },
      "github-platform": {
        label: "GitHub",
        description: "La plataforma: repositorios, issues y pull requests."
      },
      "repository-management": {
        label: "Gestión de repositorios",
        description: "Dejar un repositorio listo para que otros colaboren."
      },
      "github-profile": {
        label: "Perfil y cuenta",
        description: "Tu perfil público, claves SSH y commits verificados."
      },
      github: {
        label: "GitHub CLI",
        description: "Manejar GitHub desde la terminal."
      },
      "github-actions": {
        label: "GitHub Actions",
        description: "Automatizar tareas que se disparan con cada cambio."
      }
    }
  },
  languages: {
    label: "Lenguajes",
    icon: "code",
    description:
      "HTML, CSS y JavaScript: fundamentos, APIs del navegador y prácticas del lenguaje.",
    color: "--cat-languages",
    group: "construir",
    order: 1,
    subcategories: {
      html: {
        label: "HTML",
        description:
          "La estructura de una página: etiquetas, semántica y formularios."
      },
      css: {
        label: "CSS",
        description:
          "Dar estilo y disposición a una página: color, espacio y responsive."
      },
      javascript: {
        label: "JavaScript y Web APIs",
        description:
          "El lenguaje del navegador y las APIs que trae incorporadas."
      }
    }
  },
  packages: {
    label: "Paquetes",
    icon: "package",
    description:
      "Paquetes y librerías instalables para proyectos JavaScript, Node.js, Astro, React y testing.",
    color: "--cat-general",
    group: "construir",
    order: 4,
    subcategories: {
      "javascript-zod": {
        label: "JavaScript - Zod",
        description: "Definir esquemas y validar datos en tiempo de ejecución."
      },
      "css-pico-css": {
        label: "CSS - Pico CSS",
        description:
          "Estilos semánticos y ligeros para HTML sin clases complejas."
      },
      "css-bootstrap": {
        label: "CSS - Bootstrap",
        description:
          "Componentes y utilidades CSS para construir interfaces rápidamente."
      },
      "css-bulma": {
        label: "CSS - Bulma",
        description: "Framework CSS basado en Flexbox para interfaces web."
      },
      "css-daisyui": {
        label: "CSS - daisyUI",
        description: "Componentes con clases semánticas sobre Tailwind CSS."
      },
      "css-flowbite": {
        label: "CSS - Flowbite",
        description: "Componentes y patrones de interfaz para Tailwind CSS."
      },
      "css-hyperui": {
        label: "CSS - HyperUI",
        description: "Ejemplos de componentes accesibles para Tailwind CSS."
      },
      "css-preline": {
        label: "CSS - Preline UI",
        description:
          "Componentes y plugins para construir interfaces con Tailwind CSS."
      },
      "css-tailwind-plus": {
        label: "CSS - Tailwind Plus",
        description: "Plantillas y componentes premium basados en Tailwind CSS."
      },
      "astro-nanostores": {
        label: "Astro - Nanostores",
        description:
          "Estado compartido y ligero para islas y componentes Astro."
      },
      "astro-gsap": {
        label: "Astro - GSAP",
        description:
          "Animaciones de alto rendimiento integradas en proyectos Astro."
      },
      "react-axios": {
        label: "React - Axios",
        description: "Cliente HTTP para consumir APIs desde aplicaciones React."
      },
      "react-tanstack-query": {
        label: "React - TanStack Query",
        description: "Consultar, cachear y sincronizar datos remotos en React."
      },
      "react-hook-form": {
        label: "React - React Hook Form",
        description:
          "Gestionar formularios React con poco código y buen rendimiento."
      },
      "react-zustand": {
        label: "React - Zustand",
        description: "Estado global sencillo para aplicaciones React."
      },
      "react-router": {
        label: "React - React Router",
        description: "Enrutado declarativo para aplicaciones React."
      },
      "react-shadcn-ui": {
        label: "React - shadcn/ui",
        description:
          "Componentes editables y accesibles para construir interfaces React."
      },
      "react-mantine": {
        label: "React - Mantine",
        description: "Biblioteca amplia de componentes y hooks para React."
      },
      "react-chakra-ui": {
        label: "React - Chakra UI",
        description: "Componentes accesibles y composables para React."
      },
      "react-material-ui": {
        label: "React - Material UI",
        description:
          "Implementación de Material Design para aplicaciones React."
      },
      "react-ant-design": {
        label: "React - Ant Design",
        description:
          "Sistema de componentes empresariales para aplicaciones React."
      },
      "react-heroui": {
        label: "React - HeroUI",
        description: "Componentes modernos y accesibles para React."
      },
      "react-untitled-ui-react": {
        label: "React - Untitled UI React",
        description:
          "Sistema de componentes y pantallas reutilizables para React."
      },
      "react-magic-ui": {
        label: "React - Magic UI",
        description: "Componentes visuales y animados para React."
      },
      "react-boneyard": {
        label: "React - Boneyard",
        description:
          "Colección de componentes y recursos experimentales para React."
      },
      "react-motion": {
        label: "React - Motion",
        description: "Animaciones declarativas para interfaces React."
      },
      "react-atropos": {
        label: "React - Atropos",
        description: "Efectos 3D y parallax para interfaces React."
      },
      "react-dropzone": {
        label: "React - React Dropzone",
        description: "Cargas de archivos mediante arrastrar y soltar en React."
      },
      "react-gridstack": {
        label: "React - GridStack.js",
        description:
          "Cuadrículas redimensionables y arrastrables para interfaces React."
      },
      "react-email": {
        label: "React - React Email",
        description: "Crear plantillas de correo con componentes React."
      },
      "node-npm-check-updates": {
        label: "Node - npm-check-updates",
        description:
          "Revisar y actualizar dependencias declaradas en package.json."
      },
      "node-express-validator": {
        label: "Node - express-validator",
        description: "Validar y sanitizar datos de entrada en APIs Node.js."
      },
      "node-bcrypt": {
        label: "Node - bcrypt",
        description: "Hash seguro de contraseñas en aplicaciones Node.js."
      },
      "node-pug": {
        label: "Node - PUG",
        description: "Motor de plantillas para generar HTML desde Node.js."
      },
      "node-resend": {
        label: "Node - Resend",
        description:
          "Enviar correos transaccionales desde aplicaciones Node.js."
      },
      "node-vitest": {
        label: "Node - Vitest",
        description:
          "Ejecutar pruebas unitarias e integración en proyectos JavaScript."
      },
      "node-supertest": {
        label: "Node - Supertest",
        description: "Probar endpoints HTTP de servidores Node.js."
      },
      "node-msw": {
        label: "Node - MSW",
        description: "Interceptar solicitudes HTTP para pruebas y desarrollo."
      },
      "node-testcontainers": {
        label: "Node - Testcontainers",
        description:
          "Levantar dependencias reales en contenedores durante las pruebas."
      },
      "node-midscene": {
        label: "Node - Midscene.js",
        description:
          "Automatización y pruebas de interfaces con ayuda de modelos de IA."
      }
    }
  },
  performance: {
    label: "Performance",
    icon: "gauge",
    description:
      "Rendimiento de carga, renderizado, tiempo de ejecución y optimización de recursos.",
    color: "--cat-performance",
    group: "calidad",
    order: 2,
    subcategories: {
      "performance-fundamentos": {
        label: "Fundamentos y métricas",
        description: "Qué se mide y con qué métricas."
      },
      "performance-carga": {
        label: "Carga y recursos",
        description:
          "Que la página aparezca antes: recursos, imágenes y fuentes."
      },
      "performance-runtime": {
        label: "JavaScript y renderizado",
        description: "Que la página responda rápido una vez cargada."
      },
      "performance-operacion": {
        label: "Red y operación",
        description: "Red, caché y entrega desde el servidor."
      }
    }
  },
  resources: {
    label: "Recursos",
    icon: "bookmark",
    description:
      "Herramientas y referencias externas para resolver tareas concretas de diseño, desarrollo e inteligencia artificial. Cada ficha explica para qué sirve el recurso y qué conviene revisar antes de incorporarlo a un proyecto.",
    color: "--cat-resources",
    group: "referencia",
    order: 4,
    subcategories: {
      "ui-inspiration": {
        label: "Inspiración de interfaces",
        description:
          "Galerías y componentes de ejemplo para estudiar cómo otras interfaces resuelven su estructura, jerarquía visual y estilo.",
        badge: false
      },
      css: {
        label: "CSS",
        description:
          "Herramientas que generan estilos CSS para sombras, degradados y otros efectos; el resultado se puede copiar y adaptar al diseño del proyecto."
      },
      colors: {
        label: "Colores",
        description:
          "Generadores de paletas y comprobadores de contraste para elegir colores coherentes, legibles y accesibles.",
        badge: false
      },
      icons: {
        label: "Iconos",
        description:
          "Colecciones de símbolos visuales para representar acciones, estados y conceptos dentro de una interfaz.",
        badge: false
      },
      animations: {
        label: "Animaciones",
        description:
          "Recursos para comunicar cambios de estado o guiar la atención mediante movimiento y transiciones.",
        badge: false
      },
      loaders: {
        label: "Indicadores de carga",
        description:
          "Animaciones que informan que una tarea sigue en proceso, como indicadores giratorios, barras o esqueletos de contenido.",
        badge: false
      },
      illustrations: {
        label: "Ilustraciones",
        description:
          "Dibujos y gráficos para explicar ideas, dar contexto visual o completar un prototipo sin crearlos desde cero.",
        badge: false
      },
      images: {
        label: "Imágenes y mockups",
        description:
          "Herramientas para optimizar imágenes y presentar capturas dentro de marcos o composiciones de producto.",
        badge: false
      },
      apis: {
        label: "APIs",
        description:
          "Catálogos de servicios que permiten a una aplicación solicitar datos o ejecutar funciones de otro sistema.",
        badge: false
      },
      generators: {
        label: "Generadores",
        description:
          "Herramientas que convierten unas opciones visuales en código o archivos que después se pueden adaptar al proyecto.",
        badge: false
      },
      "developer-tools": {
        label: "Herramientas de desarrollo",
        description:
          "Utilidades web para resolver tareas frecuentes sin instalar una aplicación o escribir una herramienta propia.",
        badge: false
      },
      learning: {
        label: "Aprendizaje",
        description:
          "Libros, catálogos, ejercicios y referencias externas para aprender o profundizar en un tema.",
        badge: false
      },
      ia: {
        label: "IA",
        description:
          "Herramientas y directorios para trabajar con modelos, agentes e integraciones de inteligencia artificial.",
        badge: false
      }
    }
  },
  security: {
    label: "Seguridad",
    icon: "shield-check",
    description: "Prácticas de seguridad para frontend, backend y APIs.",
    color: "--cat-security",
    group: "calidad",
    order: 1,
    subcategories: {
      "security-fundamentos": {
        label: "Fundamentos y amenazas",
        description: "Qué se ataca y por qué, antes de defender nada."
      },
      "security-aplicacion": {
        label: "Aplicación y API",
        description:
          "Proteger la aplicación y su API: entrada, sesión y permisos."
      },
      "security-infra": {
        label: "Infraestructura y disponibilidad",
        description: "Proteger el servidor y mantener el servicio disponible."
      },
      "security-testing": {
        label: "Verificación de seguridad",
        description: "Comprobar que las defensas realmente funcionan."
      }
    }
  },
  seo: {
    label: "SEO",
    icon: "search-check",
    description:
      "Optimización para motores de búsqueda (SEO): metadatos, rastreo, indexación y datos estructurados.",
    color: "--cat-seo",
    group: "calidad",
    order: 4,
    subcategories: {
      seo: {
        label: "Fundamentos de SEO",
        description:
          "Cómo encuentra Google una página y qué necesita para entenderla."
      },
      "seo-tecnico": {
        label: "SEO técnico",
        description: "Rastreo, indexación, sitemap y datos estructurados."
      },
      "seo-contenido": {
        label: "Contenido y autoridad",
        description: "Contenido y enlaces que hacen que una página posicione."
      },
      astro: {
        label: "Astro",
        description:
          "Framework orientado a sitios de contenido, con muy poco JavaScript en el cliente."
      },
      nextjs: {
        label: "Next.js",
        description:
          "Framework sobre React con renderizado en servidor y enrutado por archivos."
      }
    }
  },
  skills: {
    label: "IA Tools",
    icon: "sparkles",
    description:
      "Recursos reutilizables para asistentes de IA: fundamentos, comandos, skills, plugins y protocolos.",
    color: "--cat-skills",
    group: "producto",
    order: 2,
    subcategories: {
      "skills-fundamentos": {
        label: "Fundamentos de IA Tools",
        description:
          "Cómo elegir y combinar comandos, skills, plugins, hooks y conexiones MCP sin ampliar permisos innecesariamente."
      },
      "ia-comandos": {
        label: "Comandos",
        description:
          "Comandos propios que automatizan tareas repetidas con el asistente."
      },
      "ia-skills": {
        label: "Skills",
        description:
          "Instrucciones empaquetadas que enseñan al asistente a hacer algo concreto."
      },
      "ia-plugins": {
        label: "Plugins",
        description: "Extensiones que añaden capacidades al asistente."
      },
      "ia-mcp": {
        label: "MCP",
        description:
          "El protocolo que conecta un modelo con herramientas y datos externos."
      }
    }
  },
  terminal: {
    label: "Terminal & CLI",
    icon: "terminal",
    description:
      "Terminales e interfaces de línea de comandos (CLI) para Windows, macOS y Linux.",
    color: "--cat-terminal",
    group: "flujo",
    order: 1,
    subcategories: {
      terminal: {
        label: "Terminal",
        description: "Moverse y trabajar desde la línea de comandos."
      },
      cli: {
        label: "CLI",
        description: "Herramientas de línea de comandos y cómo se combinan."
      }
    }
  },
  testing: {
    label: "Testing",
    icon: "test-tube-2",
    description:
      "Pruebas unitarias, de integración y de extremo a extremo (E2E), además de estrategias de validación.",
    color: "--cat-testing",
    group: "construir",
    order: 6,
    subcategories: {
      "testing-fundamentos": {
        label: "Fundamentos y estrategia",
        description: "Qué probar y por qué, antes de elegir una herramienta."
      },
      "testing-unitario": {
        label: "Pruebas unitarias",
        description: "Probar funciones y componentes de forma aislada."
      },
      "testing-integracion": {
        label: "Integración y contratos",
        description:
          "Probar que varias piezas funcionan juntas y respetan su contrato."
      },
      react: {
        label: "React",
        description: "Construir interfaces con componentes y estado."
      },
      astro: {
        label: "Astro",
        description:
          "Framework orientado a sitios de contenido, con muy poco JavaScript en el cliente."
      },
      nextjs: {
        label: "Next.js",
        description:
          "Framework sobre React con renderizado en servidor y enrutado por archivos."
      },
      "testing-e2e": {
        label: "Pruebas E2E",
        description:
          "Probar la aplicación completa simulando a una persona usándola."
      },
      "testing-ai": {
        label: "Testing asistido por IA",
        description:
          "Usar IA para escribir y mantener pruebas, con sus límites."
      }
    }
  },
  "ui-ux": {
    label: "UI / UX",
    icon: "palette",
    description:
      "Interfaz de usuario (UI), experiencia de usuario (UX), interacción y sistemas visuales.",
    color: "--cat-ui-ux",
    group: "producto",
    order: 0,
    subcategories: {
      "ui-ux-fundamentos": {
        label: "Fundamentos de UI / UX",
        description:
          "Vocabulario y principios básicos de interfaz y experiencia."
      },
      "ui-ux-estilos": {
        label: "Estilos visuales",
        description: "Lenguajes visuales completos y cuándo conviene cada uno."
      },
      "ui-ux-design-systems": {
        label: "Sistemas de diseño",
        description:
          "Convertir decisiones de diseño en tokens y componentes reutilizables."
      },
      "ui-ux-interaccion": {
        label: "Diseño de interacción",
        description:
          "Cómo responde la interfaz: estados, feedback y formularios."
      }
    }
  }
} as const
