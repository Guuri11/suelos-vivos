import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'REPLACE_ME',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
