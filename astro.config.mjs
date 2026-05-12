// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://suelosvivos.com',
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      customPages: [
        'https://suelosvivos.com/',
        'https://suelosvivos.com/el-programa',
        'https://suelosvivos.com/quienes-somos',
        'https://suelosvivos.com/blog',
        'https://suelosvivos.com/contacto',
        'https://suelosvivos.com/en/',
        'https://suelosvivos.com/en/el-programa',
        'https://suelosvivos.com/en/quienes-somos',
        'https://suelosvivos.com/en/blog',
        'https://suelosvivos.com/en/contacto',
        'https://suelosvivos.com/fr/',
        'https://suelosvivos.com/fr/el-programa',
        'https://suelosvivos.com/fr/quienes-somos',
        'https://suelosvivos.com/fr/blog',
        'https://suelosvivos.com/fr/contacto',
      ],
      filter: (page) =>
        !page.includes('aviso-legal') && !page.includes('politica-privacidad'),
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en',
          fr: 'fr',
        },
      },
    }),
    sanity({
      projectId: process.env.SANITY_PROJECT_ID || '2slodmgn',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
  ],
});
