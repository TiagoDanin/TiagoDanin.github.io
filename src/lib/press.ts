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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Formats an ISO date without going through the Date constructor, which would
 * shift the day depending on the build machine's timezone.
 */
export function pressDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const name = MONTHS[Number(month) - 1];
  if (!name) return iso;
  return day ? `${name} ${Number(day)}, ${year}` : `${name} ${year}`;
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
