// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration/
export default defineConfig({
  site: 'https://expert-local.fr',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
