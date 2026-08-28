import { queryCollection } from 'nextjs-studio/server';

import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { titleToSlug } from '@/utils/parse';

export interface TimelineEvent {
  /** The year, as a string. It is also the `[year]` segment of the detail route. */
  date: string;
  title: string;
  description: string;
  tags: string[];
  /** URL segment. Derived from the English title, so it is the same in every language. */
  slug: string;
}

interface TimelineRow {
  date: string;
  title: string;
  description: string;
  tags?: string[];
}

/**
 * The career timeline in the reader's language, newest first as the files are
 * written.
 *
 * The collection carried one file with the ten most recent events written in
 * Portuguese and the nineteen older ones in English, read with no `.locale()`,
 * so both `/timeline` and `/br/timeline` rendered the same half-translated
 * list. It is two files now, and every consumer passes a locale.
 *
 * The slug comes from the English title, the way a skill's does, so translating
 * a title does not fork the URL: `/timeline/2024/talk-at-google-devfest-belem/`
 * is one page announcing an `hreflang` pair that both resolve. Position is the
 * cross-locale key, which is what keeps the two files in the same order.
 */
export function getTimelineEvents(locale: Locale): TimelineEvent[] {
  const rows = [...queryCollection('timeline').locale(locale)] as unknown as TimelineRow[];
  const enRows =
    locale === DEFAULT_LOCALE
      ? rows
      : ([...queryCollection('timeline').locale(DEFAULT_LOCALE)] as unknown as TimelineRow[]);

  return rows.map((row, index) => ({
    date: String(row.date),
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    slug: titleToSlug(enRows[index]?.title ?? row.title),
  }));
}

export function findTimelineEvent(
  locale: Locale,
  year: string,
  slug: string
): TimelineEvent | null {
  return (
    getTimelineEvents(locale).find((event) => event.date === year && event.slug === slug) ?? null
  );
}
