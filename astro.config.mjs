// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.suelosvivos.com',
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
        'https://www.suelosvivos.com/',
        'https://www.suelosvivos.com/el-programa',
        'https://www.suelosvivos.com/quienes-somos',
        'https://www.suelosvivos.com/blog',
        'https://www.suelosvivos.com/preguntas-frecuentes',
        'https://www.suelosvivos.com/contacto',
        'https://www.suelosvivos.com/en/',
        'https://www.suelosvivos.com/en/el-programa',
        'https://www.suelosvivos.com/en/quienes-somos',
        'https://www.suelosvivos.com/en/blog',
        'https://www.suelosvivos.com/en/preguntas-frecuentes',
        'https://www.suelosvivos.com/en/contacto',
        'https://www.suelosvivos.com/fr/',
        'https://www.suelosvivos.com/fr/el-programa',
        'https://www.suelosvivos.com/fr/quienes-somos',
        'https://www.suelosvivos.com/fr/blog',
        'https://www.suelosvivos.com/fr/preguntas-frecuentes',
        'https://www.suelosvivos.com/fr/contacto',
      ],
      filter: (page) =>
        !page.includes('aviso-legal') &&
        !page.includes('politica-privacidad') &&
        !page.includes('panel-suelos'),
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
