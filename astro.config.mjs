import { defineConfig } from "astro/config"
import { unified } from "@astrojs/markdown-remark"
import sitemap from "@astrojs/sitemap"
import starlight from "@astrojs/starlight"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"
import { SIDEBAR } from "./src/config/sidebar.ts"
import { SITE } from "./src/config/site.ts"
import { remarkPackageManagerTabs } from "./src/markdown/package-manager.mjs"

const { SITE_URL } = SITE.config

const picomatchCjsAdapter = {
  name: "picomatch-cjs-adapter",
  enforce: "pre",
  async resolveId(source, importer) {
    if (source !== "picomatch") return undefined
    const resolved = await this.resolve(source, importer, { skipSelf: true })
    return resolved?.id
  },
  load(id) {
    if (!id.replaceAll("\\", "/").endsWith("/picomatch/index.js")) {
      return undefined
    }

    return `import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const picomatch = require(${JSON.stringify(id)});
export default picomatch;
export const scan = picomatch.scan;
export const parse = picomatch.parse;
export const makeRe = picomatch.makeRe;
export const test = picomatch.test;`
  }
}

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  compressHTML: true,

  integrations: [
    icon({ iconDir: "src/icons" }),
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
      favicon: "/favicon.png",

      social: [
        { icon: "github", label: "GitHub", href: SITE.social.github },
        { icon: "x.com", label: "X", href: SITE.social.x }
      ],

      sidebar: SIDEBAR,

      components: {
        Header: "./src/components/starlight/Header.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        Sidebar: "./src/components/starlight/Sidebar.astro",
        ThemeSelect: "./src/components/starlight/ThemeSelect.astro"
      },

      customCss: ["./src/styles/starlight.css"],

      expressiveCode: {
        themes: ["night-owl", "night-owl-light"],
        styleOverrides: {
          borderRadius: "var(--radius-lg)",
          borderWidth: "1px",
          borderColor: "var(--line)",
          codeBackground: "var(--bg-code)",
          codeFontFamily: "var(--font-mono)",
          codeFontSize: "0.875rem",
          uiFontFamily: "var(--font-sans)",
          frames: {
            terminalTitlebarDotsOpacity: "0.35",
            editorTabBarBackground: "var(--bg-code-chrome)",
            editorActiveTabBackground: "var(--bg-code)",
            editorActiveTabForeground: "var(--text-strong)",
            editorActiveTabIndicatorTopColor: "var(--accent)",
            editorActiveTabIndicatorBottomColor: "transparent",
            editorTabBarBorderBottomColor: "var(--line)",
            terminalTitlebarBackground: "var(--bg-code-chrome)",
            terminalTitlebarForeground: "var(--text-muted)",
            terminalTitlebarBorderBottomColor: "var(--line)",
            terminalBackground: "var(--bg-code)",
            frameBoxShadowCssValue: "none"
          }
        }
      },

      head: [
        {
          tag: "link",
          attrs: { rel: "manifest", href: "/manifest.webmanifest" }
        },
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            media: "(prefers-color-scheme: dark)",
            content: SITE.seo.themeColor.dark
          }
        },
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            media: "(prefers-color-scheme: light)",
            content: SITE.seo.themeColor.light
          }
        },
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
    processor: unified({ remarkPlugins: [remarkPackageManagerTabs] })
  },

  vite: {
    plugins: [picomatchCjsAdapter, tailwindcss()]
  }
})
