import { queryCollection } from 'nextjs-studio/server';

import { contentLang, intlLocale, type Locale } from '@/lib/i18n/locales';

export interface LegalDoc {
  title: string;
  slug: string;
  updatedAt: string;
  description: string;
  body: string;
}

/**
 * One of the two documents on /legal, in the language the page is rendering.
 *
 * Same filename convention as posts and talks: `privacy.mdx` is English,
 * `privacy.pt.mdx` is Portuguese. There is no fallback, so a missing
 * translation renders as a missing section rather than as English prose
 * announcing itself in a Portuguese page.
 */
export function getLegalDoc(slug: 'privacy' | 'terms', locale: Locale): LegalDoc | null {
  const lang = contentLang(locale);
  const doc =
    lang === 'en'
      ? queryCollection('legal').where({ slug, lang: 'en' }).first()
      : queryCollection('legal').locale(lang).where({ slug }).first();

  if (!doc) return null;

  return {
    title: String(doc.title ?? ''),
    slug: String(doc.slug ?? slug),
    updatedAt: String(doc.updatedAt ?? ''),
    description: String(doc.description ?? ''),
    body: String(doc.body ?? ''),
  };
}

export type AppLegalKind = 'privacy' | 'terms';

export interface AppLegalApp {
  /** The `[app]` segment of /legal/[app]. Matches the app's slug on /apps when it has one. */
  app: string;
  appName: string;
}

/**
 * Every app with documents on /legal/[app], read from the English files.
 *
 * English is the source of the list because every app has it; a Portuguese
 * translation is optional and its absence only drops that half of the page.
 */
export function getAppLegalApps(): AppLegalApp[] {
  const seen = new Map<string, AppLegalApp>();
  for (const doc of queryCollection('applegal').where({ lang: 'en' })) {
    const app = String(doc.app ?? '');
    if (app && !seen.has(app)) seen.set(app, { app, appName: String(doc.appName ?? app) });
  }
  return [...seen.values()].sort((a, b) => a.appName.localeCompare(b.appName));
}

/**
 * The privacy policy or the terms of one app, in the page's language. No
 * fallback, same as `getLegalDoc`.
 */
export function getAppLegalDoc(app: string, kind: AppLegalKind, locale: Locale): LegalDoc | null {
  const lang = contentLang(locale);
  const doc =
    lang === 'en'
      ? queryCollection('applegal').where({ app, kind, lang: 'en' }).first()
      : queryCollection('applegal').locale(lang).where({ app, kind }).first();

  if (!doc) return null;

  return {
    title: String(doc.title ?? ''),
    slug: kind,
    updatedAt: String(doc.updatedAt ?? ''),
    description: String(doc.description ?? ''),
    body: String(doc.body ?? ''),
  };
}

/** Whether /legal/[app] has anything to show in this language. */
export function appLegalHasLocale(app: string, locale: Locale): boolean {
  return getAppLegalDoc(app, 'privacy', locale) !== null || getAppLegalDoc(app, 'terms', locale) !== null;
}

/**
 * Long form date for the "last updated" line.
 *
 * The stored value is a bare `YYYY-MM-DD`, which `new Date()` reads as midnight
 * UTC. Formatting that in any timezone west of Greenwich, which is every
 * timezone in Brazil, renders the day before. Noon UTC survives the trip.
 */
export function formatLegalDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;

  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
