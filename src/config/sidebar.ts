export const SIDEBAR = [
  {
    label: "Construir",
    items: [
      {
        label: "General",
        collapsed: true,
        items: [
          {
            label: "Empieza aquí",
            collapsed: true,
            items: [
              { autogenerate: { directory: "general/general-fundamentos" } }
            ]
          },
          {
            label: "Config",
            collapsed: true,
            items: [{ autogenerate: { directory: "general/config" } }]
          },
          {
            label: "Monorepo",
            collapsed: true,
            items: [{ autogenerate: { directory: "general/monorepo" } }]
          },
          {
            label: "TypeScript",
            collapsed: true,
            items: [{ autogenerate: { directory: "general/typescript" } }]
          },
          {
            label: "Utils",
            collapsed: true,
            items: [{ autogenerate: { directory: "general/utils" } }]
          },
          {
            label: "WhatsApp API",
            collapsed: true,
            items: [{ autogenerate: { directory: "general/whatsapp" } }]
          }
        ]
      },
      {
        label: "Lenguajes",
        collapsed: true,
        items: [
          {
            label: "HTML",
            collapsed: true,
            items: [{ autogenerate: { directory: "languages/html" } }]
          },
          {
            label: "CSS",
            collapsed: true,
            items: [{ autogenerate: { directory: "languages/css" } }]
          },
          {
            label: "JavaScript y Web APIs",
            collapsed: true,
            items: [{ autogenerate: { directory: "languages/javascript" } }]
          }
        ]
      },
      {
        label: "Frontend",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de frontend",
            collapsed: true,
            items: [
              { autogenerate: { directory: "frontend/frontend-fundamentos" } }
            ]
          },
          {
            label: "Astro",
            collapsed: true,
            items: [{ autogenerate: { directory: "frontend/astro" } }]
          },
          {
            label: "React",
            collapsed: true,
            items: [{ autogenerate: { directory: "frontend/react" } }]
          },
          {
            label: "Next.js",
            collapsed: true,
            items: [{ autogenerate: { directory: "frontend/nextjs" } }]
          }
        ]
      },
      {
        label: "Backend",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de backend",
            collapsed: true,
            items: [
              { autogenerate: { directory: "backend/backend-fundamentos" } }
            ]
          },
          {
            label: "Node.js",
            collapsed: true,
            items: [{ autogenerate: { directory: "backend/node" } }]
          },
          {
            label: "Express",
            collapsed: true,
            items: [{ autogenerate: { directory: "backend/express" } }]
          },
          {
            label: "Astro",
            collapsed: true,
            items: [{ autogenerate: { directory: "backend/astro" } }]
          },
          {
            label: "Next.js",
            collapsed: true,
            items: [{ autogenerate: { directory: "backend/nextjs" } }]
          }
        ]
      },
      {
        label: "Paquetes",
        collapsed: true,
        items: [
          {
            label: "JavaScript - Zod",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/javascript-zod" } }]
          },
          {
            label: "CSS - Pico CSS",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/css-pico-css" } }]
          },
          {
            label: "CSS - Bootstrap",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/css-bootstrap" } }]
          },
          {
            label: "CSS - Bulma",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/css-bulma" } }]
          },
          {
            label: "CSS - daisyUI",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/css-daisyui" } }]
          },
          {
            label: "CSS - Flowbite",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/css-flowbite" } }]
          },
          {
            label: "CSS - HyperUI",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/css-hyperui" } }]
          },
          {
            label: "CSS - Preline UI",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/css-preline" } }]
          },
          {
            label: "CSS - Tailwind Plus",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/css-tailwind-plus" } }
            ]
          },
          {
            label: "Astro - Nanostores",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/astro-nanostores" } }
            ]
          },
          {
            label: "Astro - GSAP",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/astro-gsap" } }]
          },
          {
            label: "React - Axios",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-axios" } }]
          },
          {
            label: "React - TanStack Query",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/react-tanstack-query" } }
            ]
          },
          {
            label: "React - React Hook Form",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-hook-form" } }]
          },
          {
            label: "React - Zustand",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-zustand" } }]
          },
          {
            label: "React - React Router",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-router" } }]
          },
          {
            label: "React - shadcn/ui",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-shadcn-ui" } }]
          },
          {
            label: "React - Mantine",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-mantine" } }]
          },
          {
            label: "React - Chakra UI",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-chakra-ui" } }]
          },
          {
            label: "React - Material UI",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/react-material-ui" } }
            ]
          },
          {
            label: "React - Ant Design",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/react-ant-design" } }
            ]
          },
          {
            label: "React - HeroUI",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-heroui" } }]
          },
          {
            label: "React - Untitled UI React",
            collapsed: true,
            items: [
              {
                autogenerate: { directory: "packages/react-untitled-ui-react" }
              }
            ]
          },
          {
            label: "React - Magic UI",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-magic-ui" } }]
          },
          {
            label: "React - Boneyard",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-boneyard" } }]
          },
          {
            label: "React - Motion",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-motion" } }]
          },
          {
            label: "React - Atropos",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-atropos" } }]
          },
          {
            label: "React - React Dropzone",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-dropzone" } }]
          },
          {
            label: "React - GridStack.js",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-gridstack" } }]
          },
          {
            label: "React - React Email",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/react-email" } }]
          },
          {
            label: "Node - npm-check-updates",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/node-npm-check-updates" } }
            ]
          },
          {
            label: "Node - express-validator",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/node-express-validator" } }
            ]
          },
          {
            label: "Node - bcrypt",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/node-bcrypt" } }]
          },
          {
            label: "Node - PUG",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/node-pug" } }]
          },
          {
            label: "Node - Resend",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/node-resend" } }]
          },
          {
            label: "Node - Vitest",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/node-vitest" } }]
          },
          {
            label: "Node - Supertest",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/node-supertest" } }]
          },
          {
            label: "Node - MSW",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/node-msw" } }]
          },
          {
            label: "Node - Testcontainers",
            collapsed: true,
            items: [
              { autogenerate: { directory: "packages/node-testcontainers" } }
            ]
          },
          {
            label: "Node - Midscene.js",
            collapsed: true,
            items: [{ autogenerate: { directory: "packages/node-midscene" } }]
          }
        ]
      },
      {
        label: "Bases de datos",
        collapsed: true,
        items: [
          {
            label: "Fundamentos",
            collapsed: true,
            items: [
              { autogenerate: { directory: "database/database-fundamentos" } }
            ]
          },
          {
            label: "Modelado y relaciones",
            collapsed: true,
            items: [
              { autogenerate: { directory: "database/database-modelado" } }
            ]
          },
          {
            label: "SQL y consultas",
            collapsed: true,
            items: [{ autogenerate: { directory: "database/database-sql" } }]
          },
          {
            label: "PostgreSQL",
            collapsed: true,
            items: [
              { autogenerate: { directory: "database/database-postgresql" } }
            ]
          },
          {
            label: "NoSQL",
            collapsed: true,
            items: [{ autogenerate: { directory: "database/database-nosql" } }]
          },
          {
            label: "Prisma ORM",
            collapsed: true,
            items: [{ autogenerate: { directory: "database/database-prisma" } }]
          },
          {
            label: "Operación y recuperación",
            collapsed: true,
            items: [
              { autogenerate: { directory: "database/database-operacion" } }
            ]
          }
        ]
      },
      {
        label: "Testing",
        collapsed: true,
        items: [
          {
            label: "Fundamentos y estrategia",
            collapsed: true,
            items: [
              { autogenerate: { directory: "testing/testing-fundamentos" } }
            ]
          },
          {
            label: "Pruebas unitarias",
            collapsed: true,
            items: [{ autogenerate: { directory: "testing/testing-unitario" } }]
          },
          {
            label: "Integración y contratos",
            collapsed: true,
            items: [
              { autogenerate: { directory: "testing/testing-integracion" } }
            ]
          },
          {
            label: "React",
            collapsed: true,
            items: [{ autogenerate: { directory: "testing/react" } }]
          },
          {
            label: "Astro",
            collapsed: true,
            items: [{ autogenerate: { directory: "testing/astro" } }]
          },
          {
            label: "Next.js",
            collapsed: true,
            items: [{ autogenerate: { directory: "testing/nextjs" } }]
          },
          {
            label: "Pruebas E2E",
            collapsed: true,
            items: [{ autogenerate: { directory: "testing/testing-e2e" } }]
          },
          {
            label: "Testing asistido por IA",
            collapsed: true,
            items: [{ autogenerate: { directory: "testing/testing-ai" } }]
          }
        ]
      },
      {
        label: "DevOps",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de DevOps",
            collapsed: true,
            items: [
              { autogenerate: { directory: "devops/devops-fundamentos" } }
            ]
          },
          {
            label: "Fundamentos de nube",
            collapsed: true,
            items: [{ autogenerate: { directory: "devops/cloud-fundamentos" } }]
          },
          {
            label: "Infraestructura como código",
            collapsed: true,
            items: [
              { autogenerate: { directory: "devops/infraestructura-codigo" } }
            ]
          },
          {
            label: "Conceptos básicos",
            collapsed: true,
            items: [{ autogenerate: { directory: "devops/docker-conceptos" } }]
          },
          {
            label: "Imágenes",
            collapsed: true,
            items: [{ autogenerate: { directory: "devops/docker-imagenes" } }]
          },
          {
            label: "Contenedores",
            collapsed: true,
            items: [
              { autogenerate: { directory: "devops/docker-contenedores" } }
            ]
          },
          {
            label: "Redes y volúmenes",
            collapsed: true,
            items: [
              { autogenerate: { directory: "devops/docker-redes-volumenes" } }
            ]
          },
          {
            label: "Docker Compose",
            collapsed: true,
            items: [{ autogenerate: { directory: "devops/docker-compose" } }]
          },
          {
            label: "Bases de datos",
            collapsed: true,
            items: [
              { autogenerate: { directory: "devops/docker-bases-datos" } }
            ]
          },
          {
            label: "CI/CD y despliegue",
            collapsed: true,
            items: [{ autogenerate: { directory: "devops/ci-cd" } }]
          },
          {
            label: "Observabilidad y operación",
            collapsed: true,
            items: [{ autogenerate: { directory: "devops/observabilidad" } }]
          }
        ]
      }
    ]
  },
  {
    label: "Producto",
    items: [
      {
        label: "UI / UX",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de UI / UX",
            collapsed: true,
            items: [{ autogenerate: { directory: "ui-ux/ui-ux-fundamentos" } }]
          },
          {
            label: "Estilos visuales",
            collapsed: true,
            items: [{ autogenerate: { directory: "ui-ux/ui-ux-estilos" } }]
          },
          {
            label: "Sistemas de diseño",
            collapsed: true,
            items: [
              { autogenerate: { directory: "ui-ux/ui-ux-design-systems" } }
            ]
          },
          {
            label: "Diseño de interacción",
            collapsed: true,
            items: [{ autogenerate: { directory: "ui-ux/ui-ux-interaccion" } }]
          }
        ]
      },
      {
        label: "Agentes",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de agentes",
            collapsed: true,
            items: [
              { autogenerate: { directory: "agents/agents-fundamentos" } }
            ]
          },
          {
            label: "Claude Code",
            collapsed: true,
            items: [{ autogenerate: { directory: "agents/claude-code" } }]
          },
          {
            label: "Codex CLI",
            collapsed: true,
            items: [{ autogenerate: { directory: "agents/codex" } }]
          },
          {
            label: "Cursor",
            collapsed: true,
            items: [{ autogenerate: { directory: "agents/cursor" } }]
          },
          {
            label: "OpenCode",
            collapsed: true,
            items: [{ autogenerate: { directory: "agents/opencode" } }]
          }
        ]
      },
      {
        label: "IA Tools",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de IA Tools",
            collapsed: true,
            items: [
              { autogenerate: { directory: "skills/skills-fundamentos" } }
            ]
          },
          {
            label: "Comandos",
            collapsed: true,
            items: [{ autogenerate: { directory: "skills/ia-comandos" } }]
          },
          {
            label: "Skills",
            collapsed: true,
            items: [{ autogenerate: { directory: "skills/ia-skills" } }]
          },
          {
            label: "Plugins",
            collapsed: true,
            items: [{ autogenerate: { directory: "skills/ia-plugins" } }]
          },
          {
            label: "MCP",
            collapsed: true,
            items: [{ autogenerate: { directory: "skills/ia-mcp" } }]
          }
        ]
      },
      {
        label: "IA SDK",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de IA",
            collapsed: true,
            items: [{ autogenerate: { directory: "ai/ai-fundamentos" } }]
          },
          {
            label: "Prompts y contexto",
            collapsed: true,
            items: [{ autogenerate: { directory: "ai/ai-prompts" } }]
          },
          {
            label: "Embeddings y RAG",
            collapsed: true,
            items: [{ autogenerate: { directory: "ai/ai-rag" } }]
          },
          {
            label: "Agentes, herramientas y evaluación",
            collapsed: true,
            items: [{ autogenerate: { directory: "ai/ai-agentes" } }]
          },
          {
            label: "SDK para IA",
            collapsed: true,
            items: [{ autogenerate: { directory: "ai/ai-sdk" } }]
          }
        ]
      }
    ]
  },
  {
    label: "Flujo",
    items: [
      {
        label: "Git & GitHub",
        collapsed: true,
        items: [
          {
            label: "Git",
            collapsed: true,
            items: [{ autogenerate: { directory: "git/git" } }]
          },
          {
            label: "GitHub",
            collapsed: true,
            items: [{ autogenerate: { directory: "git/github-platform" } }]
          },
          {
            label: "Gestión de repositorios",
            collapsed: true,
            items: [
              { autogenerate: { directory: "git/repository-management" } }
            ]
          },
          {
            label: "Perfil y cuenta",
            collapsed: true,
            items: [{ autogenerate: { directory: "git/github-profile" } }]
          },
          {
            label: "GitHub CLI",
            collapsed: true,
            items: [{ autogenerate: { directory: "git/github" } }]
          },
          {
            label: "GitHub Actions",
            collapsed: true,
            items: [{ autogenerate: { directory: "git/github-actions" } }]
          }
        ]
      },
      {
        label: "Terminal & CLI",
        collapsed: true,
        items: [
          {
            label: "Terminal",
            collapsed: true,
            items: [{ autogenerate: { directory: "terminal/terminal" } }]
          },
          {
            label: "CLI",
            collapsed: true,
            items: [{ autogenerate: { directory: "terminal/cli" } }]
          }
        ]
      }
    ]
  },
  {
    label: "Calidad",
    items: [
      {
        label: "Arquitectura",
        collapsed: true,
        items: [
          {
            label: "Principios",
            collapsed: true,
            items: [{ autogenerate: { directory: "architecture/principios" } }]
          },
          {
            label: "Patrones de diseño",
            collapsed: true,
            items: [
              { autogenerate: { directory: "architecture/patrones-diseno" } }
            ]
          },
          {
            label: "Patrones arquitectónicos",
            collapsed: true,
            items: [
              {
                autogenerate: {
                  directory: "architecture/patrones-arquitectonicos"
                }
              }
            ]
          }
        ]
      },
      {
        label: "Seguridad",
        collapsed: true,
        items: [
          {
            label: "Fundamentos y amenazas",
            collapsed: true,
            items: [
              { autogenerate: { directory: "security/security-fundamentos" } }
            ]
          },
          {
            label: "Aplicación y API",
            collapsed: true,
            items: [
              { autogenerate: { directory: "security/security-aplicacion" } }
            ]
          },
          {
            label: "Infraestructura y disponibilidad",
            collapsed: true,
            items: [{ autogenerate: { directory: "security/security-infra" } }]
          },
          {
            label: "Verificación de seguridad",
            collapsed: true,
            items: [
              { autogenerate: { directory: "security/security-testing" } }
            ]
          }
        ]
      },
      {
        label: "Performance",
        collapsed: true,
        items: [
          {
            label: "Fundamentos y métricas",
            collapsed: true,
            items: [
              {
                autogenerate: {
                  directory: "performance/performance-fundamentos"
                }
              }
            ]
          },
          {
            label: "Carga y recursos",
            collapsed: true,
            items: [
              { autogenerate: { directory: "performance/performance-carga" } }
            ]
          },
          {
            label: "JavaScript y renderizado",
            collapsed: true,
            items: [
              { autogenerate: { directory: "performance/performance-runtime" } }
            ]
          },
          {
            label: "Red y operación",
            collapsed: true,
            items: [
              {
                autogenerate: { directory: "performance/performance-operacion" }
              }
            ]
          }
        ]
      },
      {
        label: "Accesibilidad",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de accesibilidad",
            collapsed: true,
            items: [
              { autogenerate: { directory: "accessibility/a11y-fundamentos" } }
            ]
          },
          {
            label: "Contenido perceptible",
            collapsed: true,
            items: [
              { autogenerate: { directory: "accessibility/a11y-contenido" } }
            ]
          },
          {
            label: "Semántica e interacción",
            collapsed: true,
            items: [
              { autogenerate: { directory: "accessibility/a11y-interaccion" } }
            ]
          },
          {
            label: "Pruebas de accesibilidad",
            collapsed: true,
            items: [
              { autogenerate: { directory: "accessibility/a11y-testing" } }
            ]
          }
        ]
      },
      {
        label: "SEO",
        collapsed: true,
        items: [
          {
            label: "Fundamentos de SEO",
            collapsed: true,
            items: [{ autogenerate: { directory: "seo/seo" } }]
          },
          {
            label: "SEO técnico",
            collapsed: true,
            items: [{ autogenerate: { directory: "seo/seo-tecnico" } }]
          },
          {
            label: "Contenido y autoridad",
            collapsed: true,
            items: [{ autogenerate: { directory: "seo/seo-contenido" } }]
          },
          {
            label: "Astro",
            collapsed: true,
            items: [{ autogenerate: { directory: "seo/astro" } }]
          },
          {
            label: "Next.js",
            collapsed: true,
            items: [{ autogenerate: { directory: "seo/nextjs" } }]
          }
        ]
      }
    ]
  },
  {
    label: "Referencia",
    items: [
      {
        label: "Aplicaciones",
        collapsed: true,
        items: [
          {
            label: "Editores de código",
            collapsed: true,
            items: [
              { autogenerate: { directory: "applications/apps-editors" } }
            ]
          },
          {
            label: "Navegadores",
            collapsed: true,
            items: [
              { autogenerate: { directory: "applications/apps-browsers" } }
            ]
          },
          {
            label: "Terminales",
            collapsed: true,
            items: [
              { autogenerate: { directory: "applications/apps-terminal" } }
            ]
          },
          {
            label: "Herramientas de terminal (CLI)",
            collapsed: true,
            items: [{ autogenerate: { directory: "applications/apps-cli" } }]
          },
          {
            label: "Pruebas de APIs",
            collapsed: true,
            items: [{ autogenerate: { directory: "applications/apps-api" } }]
          },
          {
            label: "DevOps y contenedores",
            collapsed: true,
            items: [{ autogenerate: { directory: "applications/apps-devops" } }]
          },
          {
            label: "Diseño y diagramación",
            collapsed: true,
            items: [{ autogenerate: { directory: "applications/apps-design" } }]
          },
          {
            label: "Video y grabación",
            collapsed: true,
            items: [{ autogenerate: { directory: "applications/apps-video" } }]
          },
          {
            label: "Música y multimedia",
            collapsed: true,
            items: [{ autogenerate: { directory: "applications/apps-media" } }]
          },
          {
            label: "Notas y documentación",
            collapsed: true,
            items: [
              { autogenerate: { directory: "applications/apps-productivity" } }
            ]
          },
          {
            label: "Comunicación",
            collapsed: true,
            items: [{ autogenerate: { directory: "applications/apps-comms" } }]
          }
        ]
      },
      {
        label: "Cursos",
        collapsed: true,
        items: [
          {
            label: "Midudev",
            collapsed: true,
            items: [{ autogenerate: { directory: "courses/cursos-midudev" } }]
          },
          {
            label: "Microsoft",
            collapsed: true,
            items: [{ autogenerate: { directory: "courses/cursos-microsoft" } }]
          },
          {
            label: "Google",
            collapsed: true,
            items: [{ autogenerate: { directory: "courses/cursos-google" } }]
          },
          {
            label: "MongoDB",
            collapsed: true,
            items: [{ autogenerate: { directory: "courses/cursos-mongodb" } }]
          },
          {
            label: "Amazon",
            collapsed: true,
            items: [{ autogenerate: { directory: "courses/cursos-amazon" } }]
          },
          {
            label: "Plataformas educativas",
            collapsed: true,
            items: [
              { autogenerate: { directory: "courses/cursos-plataformas" } }
            ]
          }
        ]
      },
      {
        label: "Hallazgos",
        collapsed: true,
        items: [
          {
            label: "IA y agentes",
            collapsed: true,
            items: [{ autogenerate: { directory: "findings/hallazgos-ia" } }]
          },
          {
            label: "Web y producto",
            collapsed: true,
            items: [{ autogenerate: { directory: "findings/hallazgos-web" } }]
          },
          {
            label: "Código y desarrollo",
            collapsed: true,
            items: [
              { autogenerate: { directory: "findings/hallazgos-codigo" } }
            ]
          },
          {
            label: "Recursos de la comunidad",
            collapsed: true,
            items: [
              { autogenerate: { directory: "findings/hallazgos-recursos" } }
            ]
          }
        ]
      },
      {
        label: "Benchmarks",
        collapsed: true,
        items: [
          {
            label: "IA",
            collapsed: true,
            items: [{ autogenerate: { directory: "benchmarks/benchmarks-ia" } }]
          },
          {
            label: "Web y navegadores",
            collapsed: true,
            items: [
              { autogenerate: { directory: "benchmarks/benchmarks-web" } }
            ]
          },
          {
            label: "Frameworks",
            collapsed: true,
            items: [
              {
                autogenerate: { directory: "benchmarks/benchmarks-frameworks" }
              }
            ]
          },
          {
            label: "Bases de datos",
            collapsed: true,
            items: [
              { autogenerate: { directory: "benchmarks/benchmarks-databases" } }
            ]
          },
          {
            label: "Hardware y sistemas",
            collapsed: true,
            items: [
              { autogenerate: { directory: "benchmarks/benchmarks-hardware" } }
            ]
          }
        ]
      },
      {
        label: "Recursos",
        collapsed: true,
        items: [
          {
            label: "Inspiración de interfaces",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/ui-inspiration" } }]
          },
          {
            label: "CSS",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/css" } }]
          },
          {
            label: "Colores",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/colors" } }]
          },
          {
            label: "Iconos",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/icons" } }]
          },
          {
            label: "Animaciones",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/animations" } }]
          },
          {
            label: "Indicadores de carga",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/loaders" } }]
          },
          {
            label: "Ilustraciones",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/illustrations" } }]
          },
          {
            label: "Imágenes y mockups",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/images" } }]
          },
          {
            label: "APIs",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/apis" } }]
          },
          {
            label: "Generadores",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/generators" } }]
          },
          {
            label: "Herramientas de desarrollo",
            collapsed: true,
            items: [
              { autogenerate: { directory: "resources/developer-tools" } }
            ]
          },
          {
            label: "Aprendizaje",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/learning" } }]
          },
          {
            label: "IA",
            collapsed: true,
            items: [{ autogenerate: { directory: "resources/ia" } }]
          }
        ]
      }
    ]
  }
] as const
