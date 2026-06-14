import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://back-of-the-envelope.suited.sh',
  integrations: [react()],
});
