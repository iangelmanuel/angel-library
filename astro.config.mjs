import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { transformerMetaHighlight, transformerNotationDiff } from '@shikijs/transformers';
import { rehypeCodeBlocks } from './src/lib/rehype-code-blocks.mjs';
import { transformerCodeFilename } from './src/lib/shiki-transformers.mjs';

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeCodeBlocks],
    }),
    shikiConfig: {
      theme: 'github-dark-default',
      transformers: [
        transformerCodeFilename(),
        transformerMetaHighlight(),
        transformerNotationDiff(),
      ],
    },
  },
});
