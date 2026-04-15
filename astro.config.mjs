import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rankrgv.com',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://rankrgv.com/thank-you/',
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
