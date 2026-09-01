import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { transformerMetaHighlight, transformerNotationDiff } from '@shikijs/transformers';
import { rehypeCodeBlocks, transformerCodeFilename, transformerPackageManagerMeta } from './src/markdown/code-blocks.mjs';
import { rehypeExternalLinks } from './src/markdown/external-links.mjs';
import { remarkPackageManagerTabs } from './src/markdown/package-manager.mjs';

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkPackageManagerTabs],
      rehypePlugins: [rehypeCodeBlocks, rehypeExternalLinks],
    }),
    shikiConfig: {
      theme: 'tokyo-night',
      transformers: [
        transformerCodeFilename(),
        transformerPackageManagerMeta(),
        transformerMetaHighlight(),
        transformerNotationDiff(),
      ],
    },
  },
});
