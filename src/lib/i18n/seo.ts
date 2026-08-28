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

/**
 * The card image every page falls back to.
 *
 * The avatar rather than a rendered banner: it is the same picture the profile
 * carries on GitHub, npm and LinkedIn, so a shared link looks like the person
 * it is about.
 */
export const OG_IMAGE = {
  url: 'https://avatars.githubusercontent.com/u/5731176?v=4',
  width: 400,
  height: 400,
  alt: 'Tiago Danin - Mobile Developer & Software Engineer',
};

/**
 * The Open Graph fields every page shares: site name, card image, and the
 * locale set (its own, plus the others as alternates).
 *
 * A page's `openGraph` object *replaces* the layout's rather than merging into
 * it, so every page that declared a title of its own silently dropped the
 * layout's `og:image` and `og:site_name`. Forty pages were sharing without a
 * thumbnail before this existed. Spread it first; page-specific keys after it
 * still win.
 */
export function openGraphDefaults(locale: Locale) {
  return {
    siteName: 'Tiago Danin',
    images: [OG_IMAGE],
    locale: OG_LOCALE[locale],
    alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
  };
}

/** The same for the Twitter card, which does not merge either. */
export function twitterDefaults() {
  return {
    card: 'summary_large_image' as const,
    site: '@tiagodanin',
    creator: '@tiagodanin',
    images: [OG_IMAGE.url],
  };
}

/**
 * The `text/markdown` alternate for a route.
 *
 * The English mirror by default: scripts/generateLlms.ts writes one plain-text
 * face of the site's chrome pages, not one per language, so a Portuguese page
 * announces the English document rather than a file that does not exist.
 *
 * Posts and talks are the exception, and the only one. The generator mirrors
 * both languages of every entry, so those pages pass their own locale and get
 * `/br/post/slug.md` instead of the English text of a Portuguese article.
 */
export function markdownAlternate(path: string, locale: Locale = DEFAULT_LOCALE) {
  return { 'text/markdown': markdownUrl(pageUrl(locale, path)) };
}

/**
 * The brand the root layout appends to every child route through
 * `title.template`. Not applied to `[lang]/page.tsx`: Next skips the segment
 * that declares the template, which is why the home page writes its own.
 */
const BRAND = 'Tiago Danin';
const BRAND_SUFFIX = ` | ${BRAND}`;
const BRAND_RE = /\s*\|\s*Tiago Danin\s*$/i;

/**
 * Longest `<title>` worth emitting, brand included.
 *
 * Google renders roughly 60 characters and rewrites the rest; Ahrefs starts
 * flagging at 70. Sixty is the target, so a title that would only fit under
 * the looser bar still loses the brand rather than the words that rank.
 */
const TITLE_MAX = 60;

/** Drops a brand the string already carries, so nothing gets it twice. */
export function stripBrand(title: string): string {
  return title.replace(BRAND_RE, '').trim();
}

/** `<base> | Tiago Danin`, without doubling a brand the base already has. */
export function brandTitle(base: string): string {
  return `${stripBrand(base)}${BRAND_SUFFIX}`;
}

/**
 * The `title` for a page whose layout appends the brand.
 *
 * Takes the candidates longest first (the full title, then the shorter
 * `seoTitle` the content may carry) and returns the first one that still fits
 * under `TITLE_MAX` with the brand on it. When none does, the last candidate is
 * returned as `absolute`, which is what suppresses the template: an article
 * title that already fills the SERP should not spend fourteen more characters
 * repeating a name the reader sees on every other result.
 */
export function metaTitle(...candidates: (string | undefined | null)[]): string | { absolute: string } {
  const options = candidates.map((candidate) => stripBrand(candidate ?? '')).filter(Boolean);
  const fitting = options.find((option) => option.length + BRAND_SUFFIX.length <= TITLE_MAX);
  if (fitting) return fitting;
  return { absolute: options[options.length - 1] ?? BRAND };
}
