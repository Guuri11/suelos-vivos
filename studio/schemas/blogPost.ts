import { defineField, defineType } from 'sanity';

const PORTABLE_TEXT_OF = [
  { type: 'block' },
  {
    type: 'image',
    options: { hotspot: true },
    fields: [
      { name: 'alt', type: 'string', title: 'Texto alternativo' },
      { name: 'caption', type: 'string', title: 'Pie de foto' },
    ],
  },
] as const;

export default defineType({
  name: 'blogPost',
  title: 'Artículo del blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'object',
      options: { collapsible: false },
      fields: [
        { name: 'es', title: '🇪🇸 Español', type: 'string', validation: (R) => R.required() },
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
    }),

    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: { source: (doc: any) => doc.title?.es ?? '', maxLength: 96 },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'excerpt',
      title: 'Resumen',
      description: 'Texto corto que aparece en el listado del blog (máx. 160 caracteres en español)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 3, validation: (R: any) => R.required().max(160) },
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 3 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 3 },
      ],
    }),

    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'es', title: '🇪🇸 Español', type: 'array', of: PORTABLE_TEXT_OF },
        { name: 'en', title: '🇬🇧 English', type: 'array', of: PORTABLE_TEXT_OF },
        { name: 'fr', title: '🇫🇷 Français', type: 'array', of: PORTABLE_TEXT_OF },
      ],
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO — Título',
      description: 'Opcional. Si se deja vacío se usa el título del artículo',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'es', title: '🇪🇸 Español', type: 'string' },
        { name: 'en', title: '🇬🇧 English', type: 'string' },
        { name: 'fr', title: '🇫🇷 Français', type: 'string' },
      ],
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO — Descripción',
      description: 'Opcional. Si se deja vacío se usa el resumen',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'es', title: '🇪🇸 Español', type: 'text', rows: 2 },
        { name: 'en', title: '🇬🇧 English', type: 'text', rows: 2 },
        { name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 2 },
      ],
    }),
  ],

  preview: {
    select: { title: 'title', media: 'coverImage', date: 'publishedAt' },
    prepare({ title, media, date }: any) {
      return {
        title: title?.es ?? '(sin título)',
        media,
        subtitle: date ? new Date(date).toLocaleDateString('es-ES') : 'Sin fecha',
      };
    },
  },

  orderings: [
    { title: 'Más recientes primero', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
});
