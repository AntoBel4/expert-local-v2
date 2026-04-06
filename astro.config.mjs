import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap'; // À décommenter après installation

// https://astro.build/config
export default defineConfig({
  site: 'https://expert-local.fr',
  integrations: [
    // sitemap() // À décommenter après installation
  ],
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
