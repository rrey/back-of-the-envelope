import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://rrey.github.io',
  base: '/back-of-the-envelope',
  integrations: [react()],
});
