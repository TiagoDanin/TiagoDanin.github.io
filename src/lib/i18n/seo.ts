import { markdownUrl } from '@/lib/markdown-alternate';

import { DEFAULT_LOCALE, HTML_LANG, LOCALES, OG_LOCALE, localePath, type Locale } from './locales';

export const ORIGIN = 'https://tiagodanin.com';

/** Absolute URL of a route, with the trailing slash the site's HTML pages use. */
export function pageUrl(locale: Locale, path: string): string {
  const route = localePath(locale, path);
  return route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}/`;
}

/**
 * `canonical` plus the full `hreflang` set for a route.
 *
 * The canonical is the page's own locale URL, which for the default locale is
 * the bare path. That is what makes `/en/about/` and `/about/` agree on one
 * address: the copy at the root is the original, the prefixed one is the twin.
 */
export function localeAlternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const other of LOCALES) {
    languages[HTML_LANG[other]] = pageUrl(other, path);
  }
  languages['x-default'] = pageUrl(DEFAULT_LOCALE, path);

  return {
    canonical: pageUrl(locale, path),
    languages,
  };
}

/** Open Graph locale tags: the page's own, plus the others as alternates. */
export function openGraphLocale(locale: Locale) {
  return {
    locale: OG_LOCALE[locale],
    alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
  };
}

/**
 * The `text/markdown` alternate for a route.
 *
 * Always the English mirror: scripts/generateLlms.ts writes one plain-text face
 * of the site, not one per language, so a Portuguese page announces the English
 * document rather than a file that does not exist.
 */
export function markdownAlternate(path: string) {
  return { 'text/markdown': markdownUrl(pageUrl(DEFAULT_LOCALE, path)) };
}
