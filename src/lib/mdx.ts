import { queryCollection } from 'nextjs-studio/server';
import type { PostVariant } from '@/components/ui/AdaptivePost';
import { contentLang, type Locale } from '@/lib/i18n/locales';

export interface PostContent {
  title: string;
  /** Shorter `<title>` for the SERP, when the article title overflows it. */
  seoTitle?: string;
  date: string;
  description: string;
  slug: string;
  originalUrl: string;
  lang: string;
  cover: string;
  tags: string[];
  /** Present on an adaptive post: the versions a reader can pick from. */
  variants?: PostVariant[];
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
    seoTitle: post.seoTitle || undefined,
    date: post.date,
    description: post.description,
    slug: post.slug,
    originalUrl: post.originalUrl,
    lang: post.lang,
    cover: post.cover ?? '',
    tags: post.tags ?? [],
    variants: post.variants?.length ? post.variants : undefined,
    body: post.body ?? '',
  };
}

export function postHasLocale(slug: string, lang: string): boolean {
  if (lang === 'en') {
    return queryCollection('posts').where({ slug, lang: 'en' }).count() > 0;
  }
  return queryCollection('posts').locale(lang).where({ slug }).count() > 0;
}

/** The videos are in Portuguese, so only the pt-BR blog lists them. */
export function blogListsVideos(locale: Locale): boolean {
  return locale === 'br';
}

/** The posts a blog list shows in a locale, newest first. */
export function listBlogPosts(locale: Locale) {
  return [...queryCollection('posts').where({ lang: contentLang(locale) })]
    .filter((post) => blogListsVideos(locale) || !((post.tags as string[]) || []).includes('Video'))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Other posts of the blog list in `locale`, most shared tags first; ties keep the newest first. */
export function relatedPosts(post: Pick<PostContent, 'slug' | 'tags'>, locale: Locale, limit = 3) {
  const tags = new Set(post.tags);
  return listBlogPosts(locale)
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({ other, shared: ((other.tags as string[]) || []).filter((tag) => tags.has(tag)).length }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);
}
