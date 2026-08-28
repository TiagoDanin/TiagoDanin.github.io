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
