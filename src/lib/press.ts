import { queryCollection } from 'nextjs-studio/server';

export interface PressItem {
  outlet: string;
  title: string;
  url: string;
  date: string;
  author: string;
  lang: string;
  topic: string;
  summary: string;
  quote: string;
}

/**
 * Formats an ISO date without going through the Date constructor, which would
 * shift the day depending on the build machine's timezone.
 */
export function pressDate(iso: string, locale: string = 'en'): string {
  const [year, month, day] = iso.split('-');
  if (!year || !month) return iso;

  // UTC, so a day-precision date does not slip to the previous day west of
  // Greenwich. Without a day the month and year are all there is to show.
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day ?? 1)));
  const formatted = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    ...(day ? { day: 'numeric' } : {}),
    timeZone: 'UTC',
  }).format(date);

  // Portuguese writes month names lowercase, so a date that starts with one
  // reads as a typo next to "Maio 2026" from formatDate. Capitalized here for
  // the same reason it is there: it opens a line, not a sentence.
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function pressHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Press coverage, most recent first. */
export function getPressItems(): PressItem[] {
  return [...queryCollection('press')]
    .map(entry => ({
      outlet: String(entry.outlet ?? ''),
      title: String(entry.title ?? ''),
      url: String(entry.url ?? ''),
      date: String(entry.date ?? ''),
      author: String(entry.author ?? ''),
      lang: String(entry.lang ?? 'pt'),
      topic: String(entry.topic ?? ''),
      summary: String(entry.summary ?? ''),
      quote: String(entry.quote ?? ''),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
