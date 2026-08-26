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
 * Routes that render from `src/app/(i18n)/[lang]` and therefore exist under a
 * locale prefix. Everything else is still served only from `(legacy)`.
 *
 * Prefixing a path that has not migrated produces a link to a page the build
 * never generated. Grow this set as routes move, and delete it once they all
 * have.
 */
export const LOCALIZED_ROUTES = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/blog',
  '/talks',
  '/ai-automation',
  '/all-contacts',
  '/chrome-extensions',
  '/cybersecurity',
  '/game-development',
  '/mentorship',
  '/mobile',
] as const;

const LOCALIZED_ROUTE_SET = new Set<string>(LOCALIZED_ROUTES);

/**
 * Route prefixes whose every child exists in every locale.
 *
 * Posts and talks cannot be listed one by one, and they do not need to be: the
 * MDX filename suffix guarantees both languages exist for each slug.
 */
export const LOCALIZED_PREFIXES = ['/post/', '/talk/'] as const;

function isLocalized(path: string): boolean {
  return LOCALIZED_ROUTE_SET.has(path) || LOCALIZED_PREFIXES.some((p) => path.startsWith(p));
}

/**
 * Routes whose translation lives at the old suffix path rather than under the
 * prefix. Disappears with `(legacy)`.
 */
const LEGACY_LOCALE_PATHS: Record<string, Partial<Record<Locale, string>>> = {
  // /blog and /talks moved to the prefix; their old suffix URLs survive as
  // aliases that canonicalise to the new address, so nothing links at them.
};

/**
 * Path a link should point at. The default locale uses the bare path, because
 * that is the URL the canonical tag and every existing backlink use.
 *
 * A route with no version in this locale keeps its bare path: sending a reader
 * to a 404 is worse than sending them to a page in the other language.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  if (locale === DEFAULT_LOCALE) return clean || '/';

  const legacy = LEGACY_LOCALE_PATHS[path]?.[locale];
  if (legacy) return legacy;

  if (!isLocalized(path)) return clean || '/';
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
 * The same page in another language, or null when it does not exist.
 *
 * Null is the useful answer: a language switcher that silently drops the reader
 * on the home page is worse than one that shows the language as unavailable.
 */
export function switchLocalePath(pathname: string, target: Locale): string | null {
  const { base } = splitLocale(pathname);

  if (target === DEFAULT_LOCALE) return base;
  if (LEGACY_LOCALE_PATHS[base]?.[target]) return LEGACY_LOCALE_PATHS[base][target]!;
  if (isLocalized(base)) return base === '/' ? `/${target}` : `/${target}${base}`;

  return null;
}
