import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rankrgv.com',
  integrations: [
    sitemap({
      // Keep noindex pages out of the sitemap — client onboarding hubs live under /start/
      filter: (page) =>
        page !== 'https://rankrgv.com/thank-you/' &&
        page !== 'https://rankrgv.com/welcome/' &&
        !page.startsWith('https://rankrgv.com/start/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
