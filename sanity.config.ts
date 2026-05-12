import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './studio/schemas';

export default defineConfig({
  name: 'suelos-vivos',
  title: 'Suelos Vivos CMS',
  projectId: process.env.SANITY_PROJECT_ID || '2slodmgn',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('📝 Blog')
              .child(S.documentTypeList('blogPost').title('Artículos')),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
