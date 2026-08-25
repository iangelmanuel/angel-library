import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Loader de iconos en build: lee el SVG de lucide-static (iconos genéricos,
 * `lucide.dev/icons`), resuelve un puñado de marcas propias en texto/forma
 * ("brand-css", "brand-typescript", "brand-zod", "brand-astro" —el logo real
 * de Astro—, "brand-react", "brand-nextjs", "brand-node" —logo real, el
 * hexágono—, "brand-express") o recolorea un icono lucide existente a un
 * tono fijo en vez de currentColor ("stack-dependency" → `package` en
 * verde, "stack-component" → `component` en amarillo).
 * Los logos oficiales completos de marca a veces no se leen bien a 14-16px
 * (CSS/TS/Zod/Next/Express son glifos simples a propósito por eso); el de
 * Astro y Node sí son el trazo real de su isotipo, que a esta escala se
 * sigue leyendo bien.
 * Devuelve HTML listo para `set:html`. Cero JavaScript en el cliente.
 */

const cache = new Map<string, string>();

const BRAND_ICONS: Record<string, string> = {
  'brand-typescript':
    '<svg viewBox="0 0 24 24"><text x="12" y="16.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="700" fill="#3178C6">TS</text></svg>',
  /** Alias del glifo de TypeScript: entradas con stack "utils" (funciones utilitarias TS) calculan su icono como `brand-${stack}`. */
  'brand-utils':
    '<svg viewBox="0 0 24 24"><text x="12" y="16.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="700" fill="#3178C6">TS</text></svg>',
  /** Isotipo real de CSS3 (el escudo, hermano del de HTML5), en su azul de marca. */
  'brand-css':
    '<svg viewBox="0 0 24 24" fill="#1572B6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.91-.804-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>',
  'brand-zod':
    '<svg viewBox="0 0 24 24"><text x="12" y="17" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="700" fill="#67e8f9">Z</text></svg>',
  'brand-astro':
    '<svg viewBox="0 0 24 24" fill="#FF5D01"><path d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z"/></svg>',
  'brand-nextjs':
    '<svg viewBox="0 0 24 24" fill="#ececee"><path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"/></svg>',
  'brand-react':
    '<svg viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61dafb" /><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2" /><ellipse rx="11" ry="4.2" transform="rotate(60)" /><ellipse rx="11" ry="4.2" transform="rotate(120)" /></g></svg>',
  'brand-node':
    '<svg viewBox="0 0 24 24" fill="#539E43"><path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.276-.072-.312.496-.165.588-.201 1.101-.494.056-.036.129-.02.185.017l1.87 1.12c.074.036.166.036.221 0l7.319-4.237c.074-.036.11-.11.11-.202V7.768c0-.091-.036-.165-.11-.201l-7.319-4.219c-.074-.037-.166-.037-.221 0L4.552 7.566c-.073.036-.11.129-.11.201v8.457c0 .073.037.166.11.202l2.003 1.157c1.09.548 1.762-.095 1.762-.735V8.502c0-.11.091-.221.221-.221h.936c.11 0 .221.092.221.221v8.347c0 1.449-.788 2.288-2.163 2.288-.422 0-.752 0-1.688-.46l-1.925-1.099a1.55 1.55 0 01-.771-1.34V7.768c0-.55.293-1.064.771-1.339l7.316-4.237a1.606 1.606 0 011.552 0l7.316 4.237c.478.276.771.789.771 1.339v8.458c0 .549-.293 1.063-.771 1.34l-7.316 4.236a1.62 1.62 0 01-.79.183zm2.256-5.816c-3.201 0-3.87-1.469-3.87-2.706 0-.11.091-.221.221-.221h.954c.11 0 .202.073.202.184.147.986.568 1.469 2.512 1.469 1.541 0 2.202-.348 2.202-1.175 0-.477-.184-.825-2.587-1.064-1.999-.202-3.24-.643-3.24-2.24 0-1.485 1.241-2.367 3.315-2.367 2.34 0 3.497.808 3.644 2.551a.212.212 0 01-.055.166c-.037.036-.092.073-.147.073h-.955a.202.202 0 01-.201-.164c-.221-1.032-.808-1.377-2.286-1.377-1.65 0-1.833.574-1.833 1.005 0 .531.239.696 2.512.992 2.25.293 3.313.71 3.313 2.287-.02 1.615-1.335 2.548-3.68 2.548z"/></svg>',
  'brand-express':
    '<svg viewBox="0 0 24 24"><text x="12" y="16.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="9.5" font-weight="700" fill="#e5e5e5">Ex</text></svg>',
  'brand-git':
    '<svg viewBox="0 0 24 24" fill="#F05033"><path d="M23.546 10.93 13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.6 0 1.846 1.846 0 0 1-.4-1.994L12.86 8.955v6.525a1.84 1.84 0 1 1-1.516-.05V8.85a1.837 1.837 0 0 1-1-2.416L7.636 3.7.452 10.881a1.55 1.55 0 0 0 0 2.188l10.48 10.48a1.55 1.55 0 0 0 2.187 0l10.427-10.428a1.55 1.55 0 0 0 0-2.191"/></svg>',
  'brand-github':
    '<svg viewBox="0 0 24 24" fill="#ececee"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  'brand-html':
    '<svg viewBox="0 0 24 24" fill="#E34F26"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
  /** Isotipo real de Claude (Anthropic), en su naranja/terracota de marca. */
  'brand-claude-code':
    '<svg viewBox="0 0 24 24" fill="#D97757"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>',
  /** Isotipo real de OpenAI (el nudo hexagonal) — Codex es su producto de código. */
  'brand-codex':
    '<svg viewBox="0 0 24 24" fill="#ececee"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>',
  /** Isotipo real de Cursor (el prisma facetado), en blanco (tema oscuro). */
  'brand-cursor':
    '<svg viewBox="0 0 24 24" fill="#ececee"><path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"/></svg>',
  /** Isotipo real de OpenCode (el marco cuadrado), en blanco (tema oscuro). */
  'brand-opencode':
    '<svg viewBox="0 0 24 24" fill="#ececee"><path d="M22 24H2V0h20zM17 4.8H7v14.4h10z"/></svg>',
};

/** Icono lucide recoloreado a un tono fijo (en vez de heredar currentColor). */
const RECOLORED_ICONS: Record<string, { base: string; color: string }> = {
  'stack-component': { base: 'component', color: '#facc15' },
  'stack-dependency': { base: 'package', color: '#4ade80' },
  'brand-frontend-fundamentos': { base: 'monitor-cog', color: '#38bdf8' },
  'brand-libs': { base: 'package', color: '#4ade80' },
  'brand-backend-fundamentos': { base: 'server-cog', color: '#4ade80' },
  'brand-ai-sdk': { base: 'bot', color: '#22d3ee' },
  'brand-database-fundamentos': { base: 'database', color: '#c084fc' },
  'brand-database-modelado': { base: 'table-properties', color: '#a78bfa' },
  'brand-database-sql': { base: 'file-code-2', color: '#60a5fa' },
  'brand-database-postgresql': { base: 'database-zap', color: '#38bdf8' },
  'brand-database-nosql': { base: 'file-json', color: '#4ade80' },
  'brand-database-operacion': { base: 'database-backup', color: '#fb923c' },
  'brand-ai-fundamentos': { base: 'brain-circuit', color: '#f472b6' },
  'brand-ai-prompts': { base: 'message-square-text', color: '#c084fc' },
  'brand-ai-rag': { base: 'scan-search', color: '#38bdf8' },
  'brand-ai-agentes': { base: 'bot', color: '#34d399' },
  'brand-tools-fundamentos': { base: 'wrench', color: '#2dd4bf' },
  'brand-tools-editor': { base: 'panels-top-left', color: '#38bdf8' },
  'brand-tools-calidad': { base: 'badge-check', color: '#4ade80' },
  'brand-tools-build': { base: 'blocks', color: '#fbbf24' },
  'brand-tools-debugging': { base: 'bug', color: '#fb7185' },
  'brand-tools-documentacion': { base: 'book-open', color: '#a78bfa' },
  'brand-seo-tecnico': { base: 'scan-search', color: '#2dd4bf' },
  'brand-seo-contenido': { base: 'file-code-2', color: '#a3e635' },
  'brand-a11y-fundamentos': { base: 'accessibility', color: '#818cf8' },
  'brand-a11y-contenido': { base: 'book-open-text', color: '#38bdf8' },
  'brand-a11y-interaccion': { base: 'mouse-pointer-click', color: '#c084fc' },
  'brand-a11y-testing': { base: 'scan-eye', color: '#4ade80' },
  'brand-performance-fundamentos': { base: 'gauge', color: '#fbbf24' },
  'brand-performance-carga': { base: 'download', color: '#38bdf8' },
  'brand-performance-runtime': { base: 'cpu', color: '#fb923c' },
  'brand-performance-operacion': { base: 'activity', color: '#34d399' },
  'brand-security-fundamentos': { base: 'shield', color: '#fb7185' },
  'brand-security-aplicacion': { base: 'app-window', color: '#f97316' },
  'brand-security-infra': { base: 'server', color: '#facc15' },
  'brand-security-testing': { base: 'shield-check', color: '#4ade80' },
  'brand-testing-fundamentos': { base: 'test-tube-2', color: '#4ade80' },
  'brand-testing-unitario': { base: 'flask-conical', color: '#38bdf8' },
  'brand-testing-integracion': { base: 'plug-zap', color: '#c084fc' },
  'brand-testing-e2e': { base: 'route', color: '#fb923c' },
  'brand-testing-ai': { base: 'sparkles', color: '#f472b6' },
  'brand-repository-management': { base: 'folder-git-2', color: '#fbbf24' },
  'brand-apps-editors': { base: 'panels-top-left', color: '#38bdf8' },
  'brand-apps-terminal': { base: 'square-terminal', color: '#c084fc' },
  'brand-apps-api': { base: 'braces', color: '#fb923c' },
  'brand-ui-ux-design-systems': { base: 'layout-template', color: '#c084fc' },
  'brand-ui-ux-interaccion': { base: 'mouse-pointer-2', color: '#38bdf8' },
  'brand-ui-css': { base: 'paintbrush', color: '#f472b6' },
  'brand-ui-react': { base: 'component', color: '#61dafb' },
  'brand-cloud-fundamentos': { base: 'cloud', color: '#38bdf8' },
  'brand-infraestructura-codigo': { base: 'blocks', color: '#a78bfa' },
  'brand-devops-fundamentos': { base: 'workflow', color: '#fb923c' },
  'brand-ui-ux-fundamentos': { base: 'palette', color: '#c084fc' },
  'brand-skills-fundamentos': { base: 'brain-circuit', color: '#f472b6' },
  'brand-ia-comandos': { base: 'terminal', color: '#34d399' },
  'brand-ia-skills': { base: 'sparkles', color: '#fbbf24' },
  'brand-ia-plugins': { base: 'blocks', color: '#a78bfa' },
  'brand-ia-mcp': { base: 'plug', color: '#22d3ee' },
  'brand-docker-conceptos': { base: 'compass', color: '#2496ED' },
  'brand-docker-imagenes': { base: 'layers', color: '#2496ED' },
  'brand-docker-contenedores': { base: 'box', color: '#2496ED' },
  'brand-docker-redes-volumenes': { base: 'network', color: '#2496ED' },
  'brand-docker-compose': { base: 'workflow', color: '#2496ED' },
  'brand-docker-bases-datos': { base: 'database', color: '#2496ED' },
  'brand-ci-cd': { base: 'workflow', color: '#a78bfa' },
  'brand-observabilidad': { base: 'activity', color: '#22d3ee' },
  'brand-javascript': { base: 'braces', color: '#facc15' },
  'brand-terminal': { base: 'square-terminal', color: '#34d399' },
  'brand-cli': { base: 'command', color: '#818cf8' },
  'brand-seo': { base: 'search-check', color: '#2dd4bf' },
  'brand-principios': { base: 'scale', color: '#fb7185' },
  'brand-patrones-diseno': { base: 'puzzle', color: '#c084fc' },
  'brand-patrones-arquitectonicos': { base: 'building-2', color: '#fb923c' },
};

function readLucideSvg(name: string): string {
  let svg = cache.get(name);
  if (!svg) {
    try {
      svg = readFileSync(
        join(process.cwd(), 'node_modules', 'lucide-static', 'icons', `${name}.svg`),
        'utf8',
      );
    } catch {
      throw new Error(
        `Icono "${name}" no encontrado en lucide-static. Revisa el nombre en https://lucide.dev/icons`,
      );
    }
    cache.set(name, svg);
  }
  return svg;
}

export function getIcon(name: string, className?: string): string {
  const brand = BRAND_ICONS[name];
  if (brand) {
    const navColors: Partial<Record<string, string>> = {
      'brand-nextjs': '#a1a1aa',
      'brand-express': '#facc15',
      'brand-github': '#a1a1aa',
      'brand-codex': '#10a37f',
      'brand-cursor': '#38bdf8',
      'brand-opencode': '#fb7185',
    };
    const coloredBrand = navColors[name]
      ? brand.replace(/fill="#[a-f\d]+"/i, `fill="${navColors[name]}"`)
      : brand;
    return coloredBrand.replace(
      '<svg',
      `<svg class="${className ?? 'size-4'}" aria-hidden="true" focusable="false"`,
    );
  }

  const recolor = RECOLORED_ICONS[name];
  let svg = readLucideSvg(recolor?.base ?? name);

  svg = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<svg[\s\S]*?)\sclass="[^"]*"/, '$1');

  if (recolor) {
    svg = svg.replace(/currentColor/g, recolor.color);
  }

  return svg
    .replace(
      '<svg',
      `<svg class="${className ?? 'size-4'}" aria-hidden="true" focusable="false"`,
    )
    .trim();
}
