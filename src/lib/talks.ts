import { queryCollection } from 'nextjs-studio/server';

export interface TalkContent {
  title: string;
  date: string;
  description: string;
  slug: string;
  event: string;
  lang: string;
  youtubeUrl: string;
  tags: string[];
  body: string;
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
