import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rankrgv.com',
  integrations: [
    sitemap({
      // Keep noindex pages out of the sitemap — client onboarding hubs live under /start/
      filter: (page) =>
        ![
          'https://rankrgv.com/thank-you/',
          'https://rankrgv.com/welcome/',
          'https://rankrgv.com/privacy-policy/',
          'https://rankrgv.com/terms/',
          'https://rankrgv.com/google-ads-tool/',
        ].includes(page) &&
        !page.startsWith('https://rankrgv.com/start/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
