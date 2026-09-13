/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Starlight expone este componente como módulo virtual; no trae tipos.
declare module "virtual:starlight/components/MobileMenuFooter" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js"
  const MobileMenuFooter: AstroComponentFactory
  export default MobileMenuFooter
}
