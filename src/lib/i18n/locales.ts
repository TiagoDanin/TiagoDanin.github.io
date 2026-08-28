/**
 * The site's locales, and the single place that knows how one maps to a URL, to
 * an HTML `lang`, and to a filename suffix in `contents/`.
 *
 * The default locale is served from the site root and from nowhere else: `/` is
 * the English page, not `/en/`. Every other locale lives under its own prefix.
 *
 * `br` is the URL segment, not a language tag. The tag is `pt-BR`, which is what
 * `<html lang>` and every `hreflang` carry; `/br/` is only the address.
 *
 * Adding a language is one entry here plus a `messages.po` and the matching
 * `index.<locale>.json` files in `contents/`. No new route file.
 */
export const LOCALES = ['en', 'br'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * BCP 47 tag for `<html lang>`, `hreflang` and Intl formatting.
 *
 * English is region-neutral on purpose: the site is not written for readers in
 * the United States in particular. Portuguese is not, because it is Brazilian
 * Portuguese specifically.
 */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  br: 'pt-BR',
};

/**
 * Open Graph wants `language_TERRITORY`, which has no region-neutral form, so
 * `og:locale` keeps a territory even where `hreflang` drops it.
 */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  br: 'pt_BR',
};

/**
 * Suffix the older content layer uses: `post.pt.mdx`, `/blog/pt`, `/post/x/pt`.
 *
 * It stays `pt` while the URL prefix is `br`. Renaming it would migrate every
 * indexed Portuguese post URL, which buys nothing.
 */
const CONTENT_SUFFIX: Record<Locale, string> = {
  en: '',
  br: 'pt',
};

/** The `lang` value carried in post and talk frontmatter. */
export function contentLang(locale: Locale): string {
  return CONTENT_SUFFIX[locale] || 'en';
}

/**
 * BCP 47 tag for a locale code, for anything that formats: Intl, `lang`, hreflang.
 *
 * Never hand a raw locale code to Intl. `br` is the site's URL segment, but it
 * is also a real language subtag (Breton), so `Intl.DateTimeFormat("br")` does
 * not throw. It formats the wrong language, silently.
 */
export function intlLocale(code: string): string {
  return HTML_LANG[code as Locale] ?? code;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Path a link should point at. The default locale uses the bare path, because
 * that is the URL the canonical tag and every existing backlink use.
 *
 * Every route lives under `(i18n)/[lang]` and is rendered in every language, so
 * there is nothing to look up: the prefix applies to any in-site path. This
 * used to consult two hand-kept registries of migrated routes, and a route
 * missing from both still built, rendered at `/br/x/`, and got linked to in
 * English from everywhere. Adding a page is now enough.
 *
 * A path that is not ours to rewrite comes back untouched: an absolute URL, a
 * `mailto:`, a bare anchor. Menu and card hrefs come from `contents/`, where an
 * external link sits next to an internal one, and `/br/https://github.com/...`
 * is the shape that mistake takes.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  if (locale === DEFAULT_LOCALE) return clean || '/';
  if (!path.startsWith('/')) return path;

  return `/${locale}${clean}`;
}

/**
 * A post or talk detail page. Both languages share one slug, and both now live
 * under the locale prefix like every other migrated route.
 *
 * The old trailing-segment form (`/post/x/pt`) still resolves, as an alias that
 * canonicalises here.
 */
export function entryPath(locale: Locale, kind: 'post' | 'talk', slug: string): string {
  return localePath(locale, `/${kind}/${slug}`);
}

/** The four RSS feeds, each generated once per locale. */
export const FEED_NAMES = ['blog', 'talks', 'timeline', 'projects'] as const;

export type FeedName = (typeof FEED_NAMES)[number];

/**
 * The feed file for a locale: `/rss/blog.xml` for the default, `/rss/blog-br.xml`
 * for the others.
 *
 * Feeds are static files, so they take the no-trailing-slash rule, not the
 * route one. `scripts/generateRss.ts` writes exactly these names; a page that
 * built the URL by hand would be free to advertise a feed nobody generated.
 */
export function feedPath(name: FeedName, locale: Locale): string {
  return `/rss/${name}${locale === DEFAULT_LOCALE ? '' : `-${locale}`}.xml`;
}

const SECONDARY = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** Strips the trailing slash `trailingSlash: true` puts on every route. */
function normalize(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Splits a pathname into the locale it is in and the path without that marker. */
export function splitLocale(pathname: string): { locale: Locale; base: string } {
  const path = normalize(pathname);

  for (const locale of SECONDARY) {
    // Prefix form, the migrated routes: /br, /br/about
    if (path === `/${locale}`) return { locale, base: '/' };
    if (path.startsWith(`/${locale}/`)) return { locale, base: path.slice(locale.length + 1) };

    // Suffix form, what (legacy) still uses: /blog/pt, /post/some-slug/pt
    const suffix = CONTENT_SUFFIX[locale];
    if (suffix && path.endsWith(`/${suffix}`)) {
      return { locale, base: path.slice(0, -(suffix.length + 1)) };
    }
  }

  return { locale: DEFAULT_LOCALE, base: path };
}

/**
 * The same page in another language.
 *
 * Always a path now. It returned `null` for a route that existed in one
 * language only, which was the honest answer while the migration was running
 * and no route is in that state any more. `LanguageSelect` still has a null
 * branch, for the language already being read.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const { base } = splitLocale(pathname);

  if (target === DEFAULT_LOCALE) return base;
  return base === '/' ? `/${target}` : `/${target}${base}`;
}
