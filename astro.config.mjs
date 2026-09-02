import { defineConfig } from "astro/config"
import { unified } from "@astrojs/markdown-remark"
import react from "@astrojs/react"
import {
  transformerMetaHighlight,
  transformerNotationDiff
} from "@shikijs/transformers"
import tailwindcss from "@tailwindcss/vite"
import { SITE } from "@/config/site"
import {
  rehypeCodeBlocks,
  transformerCodeFilename,
  transformerPackageManagerMeta
} from "./src/markdown/code-blocks.mjs"
import { rehypeExternalLinks } from "./src/markdown/external-links.mjs"
import { remarkPackageManagerTabs } from "./src/markdown/package-manager.mjs"

const { SITE_URL } = SITE.config

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  compressHTML: true,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkPackageManagerTabs],
      rehypePlugins: [rehypeCodeBlocks, rehypeExternalLinks]
    }),
    shikiConfig: {
      theme: "tokyo-night",
      transformers: [
        transformerCodeFilename(),
        transformerPackageManagerMeta(),
        transformerMetaHighlight(),
        transformerNotationDiff()
      ]
    }
  }
})
