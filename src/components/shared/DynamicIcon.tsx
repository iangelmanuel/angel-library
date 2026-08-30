import type { ComponentType } from "react"
import {
  Accessibility,
  Activity,
  AppWindow,
  BadgeCheck,
  Blocks,
  BookOpen,
  BookOpenText,
  Bookmark,
  Bot,
  Box,
  Braces,
  Brain,
  BrainCircuit,
  Building2,
  Cloud,
  Code,
  Command,
  Compass,
  Component,
  Container,
  Cpu,
  Database,
  DatabaseBackup,
  DatabaseZap,
  Download,
  FileCode2,
  FileJson,
  FileText,
  FlaskConical,
  FolderGit2,
  Gauge,
  GitBranch,
  Globe,
  Home,
  Layers,
  LayoutTemplate,
  Link,
  ListChecks,
  MessageCircle,
  MessageSquareText,
  Monitor,
  MonitorCog,
  MousePointer2,
  MousePointerClick,
  Network,
  NotebookPen,
  Package,
  PackageSearch,
  Paintbrush,
  Palette,
  PanelsTopLeft,
  Plug,
  PlugZap,
  Puzzle,
  Repeat2,
  Route,
  Scale,
  ScanEye,
  ScanSearch,
  SearchCheck,
  Server,
  ServerCog,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  TableProperties,
  Tags,
  Terminal,
  TestTube2,
  UserRound,
  Workflow,
  Wrench,
  Zap
} from "lucide-react"
import { BRAND_ICONS, RECOLORED_ICONS } from "@/config/icons"

type LucideIcon = ComponentType<{
  className?: string
  color?: string
  "aria-hidden"?: "true"
}>

const LUCIDE: Record<string, LucideIcon> = {
  "accessibility": Accessibility,
  "activity": Activity,
  "app-window": AppWindow,
  "badge-check": BadgeCheck,
  "blocks": Blocks,
  "book-open": BookOpen,
  "book-open-text": BookOpenText,
  "bookmark": Bookmark,
  "bot": Bot,
  "box": Box,
  "braces": Braces,
  "brain": Brain,
  "brain-circuit": BrainCircuit,
  "building-2": Building2,
  "cloud": Cloud,
  "code": Code,
  "command": Command,
  "compass": Compass,
  "component": Component,
  "container": Container,
  "cpu": Cpu,
  "database": Database,
  "database-backup": DatabaseBackup,
  "database-zap": DatabaseZap,
  "download": Download,
  "file-code-2": FileCode2,
  "file-json": FileJson,
  "flask-conical": FlaskConical,
  "folder-git-2": FolderGit2,
  "gauge": Gauge,
  "git-branch": GitBranch,
  "globe": Globe,
  "home": Home,
  "layers": Layers,
  "layout-template": LayoutTemplate,
  "link": Link,
  "list-checks": ListChecks,
  "message-circle": MessageCircle,
  "message-square-text": MessageSquareText,
  "monitor": Monitor,
  "monitor-cog": MonitorCog,
  "mouse-pointer-2": MousePointer2,
  "mouse-pointer-click": MousePointerClick,
  "network": Network,
  "notebook-pen": NotebookPen,
  "package": Package,
  "package-search": PackageSearch,
  "paintbrush": Paintbrush,
  "palette": Palette,
  "panels-top-left": PanelsTopLeft,
  "plug": Plug,
  "plug-zap": PlugZap,
  "puzzle": Puzzle,
  "repeat-2": Repeat2,
  "route": Route,
  "scale": Scale,
  "scan-eye": ScanEye,
  "scan-search": ScanSearch,
  "search-check": SearchCheck,
  "server": Server,
  "server-cog": ServerCog,
  "settings-2": Settings2,
  "shield": Shield,
  "shield-check": ShieldCheck,
  "sparkles": Sparkles,
  "square-terminal": SquareTerminal,
  "table-properties": TableProperties,
  "tags": Tags,
  "terminal": Terminal,
  "test-tube-2": TestTube2,
  "user-round": UserRound,
  "workflow": Workflow,
  "wrench": Wrench,
  "zap": Zap
}

/** Mismo icono que <Icon> de Astro, pero para las islas de React. */
export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const brand = BRAND_ICONS[name]
  if (brand) {
    return (
      <svg
        viewBox={brand.viewBox}
        fill={brand.fill ?? undefined}
        className={className}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: brand.body }}
      />
    )
  }

  const recolored = RECOLORED_ICONS[name]
  const Icon = LUCIDE[recolored?.base ?? name] ?? FileText
  return (
    <Icon
      className={className}
      color={recolored?.color}
      aria-hidden="true"
    />
  )
}
