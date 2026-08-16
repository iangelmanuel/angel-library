import type { ComponentType } from 'react';
import {
  Blocks,
  Accessibility,
  BadgeCheck,
  BookOpen,
  Bookmark,
  Bot,
  Brain,
  Code,
  Component,
  Container,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Gauge,
  Globe,
  Home,
  LayoutTemplate,
  Link,
  ListChecks,
  Monitor,
  Package,
  Palette,
  Network,
  Repeat2,
  SearchCheck,
  ShieldCheck,
  Search,
  Server,
  Sparkles,
  Tags,
  TestTube2,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;

/**
 * Marcas propias en texto: un glifo simple en el color de marca, no el
 * logo oficial completo (a 14-16px se veía borroso e ilegible). El mismo
 * glifo se usa en `Icon.astro` vía `getIcon()` — acá va a mano porque las
 * islas React no leen archivos.
 */
const BrandCss: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fontFamily="ui-monospace, monospace"
      fontSize="15"
      fontWeight="700"
      fill="#c4b5fd"
    >
      {'{}'}
    </text>
  </svg>
);

const BrandTypescript: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <text
      x="12"
      y="16.5"
      textAnchor="middle"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontSize="10.5"
      fontWeight="700"
      fill="#3178C6"
    >
      TS
    </text>
  </svg>
);

const BrandZod: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontSize="14"
      fontWeight="700"
      fill="#67e8f9"
    >
      Z
    </text>
  </svg>
);

/** Isotipo real de Astro (el cohete), no una letra — se lee bien incluso chico. */
const BrandAstro: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="#FF5D01" {...props}>
    <path d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z" />
  </svg>
);

/** Isotipo real de Next.js (el círculo con la "N" cortada), no una letra. */
const BrandNextjs: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="#ececee" {...props}>
    <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
  </svg>
);

/** El átomo de React: mismo viewBox/geometría que usa React en su propio logo. */
const BrandReact: IconComponent = (props) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" {...props}>
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

/** Icono lucide "package" recoloreado a verde: entradas tipo `libraries` (dependencia npm). */
const StackDependency: IconComponent = (props) => <Package color="#4ade80" {...props} />;

/** Icono lucide "component" recoloreado a amarillo: entradas tipo `components`. */
const StackComponent: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
    <path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z" />
    <path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z" />
    <path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
  </svg>
);

/**
 * Mapa de iconos por nombre para las islas React.
 * En componentes Astro se usa `Icon.astro` (SVG inline en build);
 * aquí se usa lucide-react más los dos logos de marca de arriba.
 * Los nombres son los de lucide, salvo "brand-css"/"brand-typescript".
 */
const ICONS: Record<string, IconComponent> = {
  'brand-css': BrandCss,
  'brand-typescript': BrandTypescript,
  'brand-zod': BrandZod,
  'brand-astro': BrandAstro,
  'brand-nextjs': BrandNextjs,
  'brand-react': BrandReact,
  'stack-dependency': StackDependency,
  'stack-component': StackComponent,
  blocks: Blocks,
  accessibility: Accessibility,
  'badge-check': BadgeCheck,
  'book-open': BookOpen,
  bookmark: Bookmark,
  bot: Bot,
  brain: Brain,
  code: Code,
  component: Component,
  container: Container,
  cpu: Cpu,
  database: Database,
  globe: Globe,
  home: Home,
  'layout-template': LayoutTemplate,
  link: Link,
  'list-checks': ListChecks,
  monitor: Monitor,
  package: Package,
  search: Search,
  server: Server,
  sparkles: Sparkles,
  tags: Tags,
  terminal: Terminal,
  wrench: Wrench,
  zap: Zap,
  'git-branch': GitBranch,
  gauge: Gauge,
  network: Network,
  palette: Palette,
  'repeat-2': Repeat2,
  'search-check': SearchCheck,
  'shield-check': ShieldCheck,
  'test-tube-2': TestTube2,
};

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? FileText;
  return <Icon className={className} aria-hidden="true" />;
}
