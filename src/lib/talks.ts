import { queryCollection } from 'nextjs-studio/server';

export interface TalkContent {
  title: string;
  date: string;
  description: string;
  slug: string;
  event: string;
  edition: string;
  lang: string;
  youtubeUrl: string;
  tags: string[];
  body: string;
}

/**
 * The event as a reader sees it: brand plus the edition that hosted the talk.
 * `event` alone is the brand ("DevOpsDays Belém"), so counting or grouping by
 * event must use the raw field, never this label.
 */
export function eventLabel(talk: { event: string; edition?: string }): string {
  return talk.edition ? `${talk.event} ${talk.edition}` : talk.event;
}

export function getTalkBySlug(slug: string, lang: string = 'en'): TalkContent | null {
  const query = lang === 'en'
    ? queryCollection('talks').where({ slug, lang: 'en' })
    : queryCollection('talks').locale(lang).where({ slug });
  const talk = query.first();
  if (!talk) return null;

  return {
    title: talk.title,
    date: talk.date,
    description: talk.description,
    slug: talk.slug,
    event: talk.event,
    edition: talk.edition ?? '',
    lang: talk.lang,
    youtubeUrl: talk.youtubeUrl ?? '',
    tags: talk.tags ?? [],
    body: talk.body ?? '',
  };
}

export function talkHasLocale(slug: string, lang: string): boolean {
  if (lang === 'en') {
    return queryCollection('talks').where({ slug, lang: 'en' }).count() > 0;
  }
  return queryCollection('talks').locale(lang).where({ slug }).count() > 0;
}
