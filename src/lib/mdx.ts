import { queryCollection } from 'nextjs-studio/server';

export interface PostContent {
  title: string;
  date: string;
  description: string;
  slug: string;
  originalUrl: string;
  lang: string;
  tags: string[];
  body: string;
}

export function getPostBySlug(slug: string, lang: string = 'en'): PostContent | null {
  const query = lang === 'en'
    ? queryCollection('posts').where({ slug, lang: 'en' })
    : queryCollection('posts').locale(lang).where({ slug });
  const post = query.first();
  if (!post) return null;

  return {
    title: post.title,
    date: post.date,
    description: post.description,
    slug: post.slug,
    originalUrl: post.originalUrl,
    lang: post.lang,
    tags: post.tags ?? [],
    body: post.body ?? '',
  };
}

export function postHasLocale(slug: string, lang: string): boolean {
  if (lang === 'en') {
    return queryCollection('posts').where({ slug, lang: 'en' }).count() > 0;
  }
  return queryCollection('posts').locale(lang).where({ slug }).count() > 0;
}
