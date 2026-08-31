import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { transformerMetaHighlight, transformerNotationDiff } from '@shikijs/transformers';
import { rehypeCodeBlocks } from './src/lib/rehype-code-blocks.mjs';
import { rehypeExternalLinks } from './src/lib/rehype-external-links.mjs';
import { transformerCodeFilename, transformerPackageManagerMeta } from './src/lib/shiki-transformers.mjs';
import { remarkPmTabs } from './src/lib/remark-pm-tabs.mjs';

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkPmTabs],
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
