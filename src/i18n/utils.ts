import es from './es.json';
import en from './en.json';
import fr from './fr.json';

export type Lang = 'es' | 'en' | 'fr';

export const SUPPORTED_LANGS: Lang[] = ['es', 'en', 'fr'];
export const DEFAULT_LANG: Lang = 'es';

const translations: Record<Lang, Record<string, unknown>> = { es, en, fr };

/**
 * Resolve a dot-notation key against a translation dict.
 * Falls back to ES if the key is missing in the requested language.
 */
export function t(lang: string | undefined | null, key: string): string {
  const l: Lang = SUPPORTED_LANGS.includes(lang as Lang) ? (lang as Lang) : DEFAULT_LANG;
  const dict = translations[l];

  const value = key.split('.').reduce((obj: unknown, k: string) => {
    return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[k] : undefined;
  }, dict as unknown);

  if (typeof value === 'string') return value;

  // Fallback to ES
  const fallback = key.split('.').reduce((obj: unknown, k: string) => {
    return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[k] : undefined;
  }, translations.es as unknown);

  return typeof fallback === 'string' ? fallback : key;
}

/**
 * Given an Astro.currentLocale value, return a valid Lang.
 */
export function getLang(locale: string | undefined): Lang {
  return SUPPORTED_LANGS.includes(locale as Lang) ? (locale as Lang) : DEFAULT_LANG;
}

/**
 * Build the URL for a given lang + path.
 * ES uses no prefix (prefixDefaultLocale: false).
 */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return clean;
  return `/${lang}${clean === '/' ? '' : clean}`;
}

/**
 * Build hreflang alternate links for a given pathname.
 * pathname should be the base ES path (e.g. '/el-programa').
 */
export function hreflangLinks(
  siteUrl: string,
  pathname: string,
): Array<{ lang: string; href: string }> {
  const base = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  const links = SUPPORTED_LANGS.map((lang) => ({
    lang,
    href: `${siteUrl}${localePath(lang, base)}`,
  }));

  // x-default points to the ES (default) version
  links.push({ lang: 'x-default', href: `${siteUrl}${base}` });

  return links;
}

/**
 * Strip the locale prefix from a pathname to get the base ES path.
 * e.g. '/en/el-programa' → '/el-programa'
 *      '/fr/' → '/'
 *      '/contacto' → '/contacto'
 */
export function stripLangPrefix(pathname: string): string {
  for (const lang of SUPPORTED_LANGS) {
    if (lang === DEFAULT_LANG) continue;
    if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) {
      const stripped = pathname.slice(lang.length + 1) || '/';
      return stripped;
    }
  }
  return pathname;
}
