import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import starlight from "@astrojs/starlight"
import tailwindcss from "@tailwindcss/vite"
import { buildSidebar } from "@/config/sidebar"
import { SITE } from "@/config/site"
import { remarkPackageManagerTabs } from "./src/markdown/package-manager.mjs"

const { SITE_URL } = SITE.config

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  compressHTML: true,

  integrations: [
    starlight({
      title: SITE.info.name,
      description: SITE.seo.description,
      defaultLocale: "root",
      locales: {
        root: { label: "Español", lang: "es" }
      },

      logo: {
        src: "./src/assets/logo/angel-library-logo.webp",
        alt: SITE.info.name
      },

      social: [
        { icon: "github", label: "GitHub", href: SITE.social.github },
        { icon: "x.com", label: "X", href: SITE.social.x }
      ],

      sidebar: buildSidebar(),

      components: {
        // Relaciones al pie y sin selector de tema.
        Footer: "./src/components/starlight/Footer.astro",
        Header: "./src/components/starlight/Header.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        Sidebar: "./src/components/starlight/Sidebar.astro",
        ThemeSelect: "./src/components/starlight/ThemeSelect.astro"
      },

      customCss: ["./src/styles/starlight.css"],

      expressiveCode: {
        themes: ["tokyo-night"],
        styleOverrides: {
          borderRadius: "var(--radius-field)",
          borderWidth: "0",
          frames: {
            terminalTitlebarDotsOpacity: "0",
            editorTabBarBackground: "var(--code-chrome)",
            editorActiveTabBackground: "var(--code-chrome)",
            editorActiveTabIndicatorTopColor: "transparent",
            editorTabBarBorderBottomColor: "transparent",
            terminalTitlebarBackground: "var(--code-chrome)",
            terminalBackground: "var(--code-bg)",
            frameBoxShadowCssValue: "none"
          }
        }
      },

      head: [
        {
          tag: "script",
          attrs: { src: "/pm-tabs.js", defer: true }
        }
      ],

      lastUpdated: true,
      credits: false,
      pagination: true
    }),
    sitemap()
  ],

  markdown: {
    remarkPlugins: [remarkPackageManagerTabs]
  },

  vite: {
    plugins: [tailwindcss()]
  }
})
