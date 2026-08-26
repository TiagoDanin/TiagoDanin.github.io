import type { Metadata } from 'next';
import Link from "next/link";
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft, Mic, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { titleToSlug, toISODate, getRandomColorWithDarkMode } from '@/utils/parse';
import { eventLabel } from '@/lib/talks';
import { contentLang, entryPath, localePath, type Locale } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, openGraphLocale, pageUrl } from '@/lib/i18n/seo';

function getPosts(locale: Locale) {
  return [...queryCollection('posts').where({ lang: contentLang(locale) })].sort((a, b) => b.date.localeCompare(a.date));
}

function getTalks(locale: Locale) {
  return [...queryCollection('talks').where({ lang: contentLang(locale) })].sort((a, b) => b.date.localeCompare(a.date));
}

function getAllTagsMap(locale: Locale) {
  const posts = getPosts(locale);
  const talks = getTalks(locale);
  const map = new Map<string, string>();
  posts.forEach((post) => {
    ((post.tags as string[]) || []).forEach((tag: string) => {
      map.set(titleToSlug(tag), tag);
    });
  });
  talks.forEach((talk) => {
    ((talk.tags as string[]) || []).forEach((tag: string) => {
      map.set(titleToSlug(tag), tag);
    });
  });
  return map;
}

// Overrides never localize: acronyms and brand casing read the same in every
// language.
const TAG_DISPLAY_OVERRIDES: Record<string, string> = {
  ai: 'AI', ios: 'iOS', uiux: 'UI/UX', devops: 'DevOps', api: 'API', css: 'CSS',
};

function prettifyTagSlug(slug: string): string {
  if (TAG_DISPLAY_OVERRIDES[slug]) return TAG_DISPLAY_OVERRIDES[slug];
  return decodeURIComponent(slug)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = resolveLocale(params.lang);
  const allTagsMap = getAllTagsMap(locale);
  return Array.from(allTagsMap.keys()).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/tags/[tag]'>): Promise<Metadata> {
  const { lang, tag: tagSlug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const allTagsMap = getAllTagsMap(locale);
  const originalTagName = allTagsMap.get(tagSlug) || prettifyTagSlug(tagSlug);

  return {
    title: t(i18n)`${originalTagName} - Articles & Talks`,
    description: t(i18n)`All articles and talks about ${originalTagName} by Tiago Danin. Software development, mobile apps, and technology content.`,
    alternates: localeAlternates(locale, `/tags/${tagSlug}`),
    openGraph: {
      title: t(i18n)`${originalTagName} - Articles & Talks | Tiago Danin`,
      description: t(i18n)`All articles and talks about ${originalTagName}`,
      url: pageUrl(locale, `/tags/${tagSlug}`),
      type: "website",
      ...openGraphLocale(locale),
    },
  };
}

export default async function TagPage({ params }: PageProps<'/[lang]/tags/[tag]'>) {
  const { lang, tag: tagSlug } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const posts = getPosts(locale);
  const talks = getTalks(locale);
  const allTagsMap = getAllTagsMap(locale);
  const originalTagName = allTagsMap.get(tagSlug) || prettifyTagSlug(tagSlug);

  const taggedPosts = posts.filter((post) => {
    const postTags = (post.tags as string[]) || [];
    return postTags.some((tag: string) => titleToSlug(tag) === tagSlug);
  });

  const taggedTalks = talks.filter((talk) => {
    const talkTags = (talk.tags as string[]) || [];
    return talkTags.some((tag: string) => titleToSlug(tag) === tagSlug);
  });

  const allContent = [...posts, ...talks];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t(i18n)`${originalTagName} - Articles & Talks`,
    "url": pageUrl(locale, `/tags/${tagSlug}`),
    "description": t(i18n)`All articles and talks about ${originalTagName}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        ...taggedPosts.map((post, i) => ({
          "@type": "BlogPosting",
          "position": i + 1,
          "headline": post.title,
          "description": post.description,
          "datePublished": toISODate(post.date),
          "url": pageUrl(locale, `/post/${post.slug}`),
          "author": { "@type": "Person", "name": "Tiago Danin" },
        })),
        ...taggedTalks.map((talk, i) => ({
          "@type": "Event",
          "position": taggedPosts.length + i + 1,
          "name": talk.title,
          "description": talk.description,
          "startDate": toISODate(talk.date),
          "url": pageUrl(locale, `/talk/${talk.slug}`),
          "performer": { "@type": "Person", "name": "Tiago Danin" },
        })),
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={localePath(locale, '/tags')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <Trans>All Tags</Trans>
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {originalTagName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {taggedPosts.length === 1
                ? <Trans>{taggedPosts.length} article</Trans>
                : <Trans>{taggedPosts.length} articles</Trans>}
              {' '}&middot;{' '}
              {taggedTalks.length === 1
                ? <Trans>{taggedTalks.length} talk</Trans>
                : <Trans>{taggedTalks.length} talks</Trans>}
            </p>
            <TagFilter posts={allContent as Array<{ tags: string[] }>} basePath={localePath(locale, '/tags')} />
          </div>
        </div>

        {taggedPosts.length > 0 && (
          <section className="max-w-2xl mx-auto mb-16">
            <h2 className="text-xl font-semibold tracking-tight mb-8"><Trans>Articles</Trans></h2>
            <div className="space-y-16">
              {taggedPosts.map((post, index) => (
                <ArticleCard
                  key={index}
                  post={post}
                  locale={contentLang(locale) as 'en' | 'pt'}
                />
              ))}
            </div>
          </section>
        )}

        {taggedTalks.length > 0 && (
          <section className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold tracking-tight mb-8"><Trans>Talks</Trans></h2>
            <div className="space-y-8">
              {taggedTalks.map((talk) => (
                <article key={talk.slug} className="group relative flex flex-col items-start">
                  <Link href={entryPath(locale, 'talk', String(talk.slug))} className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-6" aria-label={t(i18n)`View ${talk.title}`} />
                  <div className="absolute -inset-x-4 -inset-y-6 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800 pointer-events-none" />

                  <div className="relative pointer-events-none order-first mb-3 flex items-center gap-2">
                    <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                      <span className="absolute inset-y-0 left-0 flex items-center">
                        <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                      </span>
                      {talk.date}
                    </time>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Mic className="h-3 w-3" />
                      {eventLabel(talk)}
                    </Badge>
                  </div>

                  <h3 className="relative pointer-events-none text-base font-semibold tracking-tight">
                    {talk.title}
                  </h3>

                  <p className="relative pointer-events-none mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {talk.description}
                  </p>

                  <div className="relative z-10 mt-3 flex flex-wrap gap-2 pointer-events-auto">
                    {((talk.tags as string[]) || []).map((tag: string) => (
                      <Link key={tag} href={localePath(locale, `/tags/${titleToSlug(tag)}`)}>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRandomColorWithDarkMode(tag)}`}
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>

                  <div className="relative pointer-events-none mt-4 flex items-center gap-4 text-sm font-medium text-primary">
                    <span className="flex items-center">
                      <Trans>View details</Trans>
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                        <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {talk.youtubeUrl && (
                      <Link
                        href={talk.youtubeUrl}
                        className="flex items-center text-red-600 dark:text-red-400 hover:underline pointer-events-auto"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        <Trans>YouTube</Trans>
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {taggedPosts.length === 0 && taggedTalks.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <p className="text-muted-foreground text-lg"><Trans>No content found with this tag.</Trans></p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={localePath(locale, '/tags')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                <Trans>Back to All Tags</Trans>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
