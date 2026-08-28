import type { Metadata } from 'next';
import Link from "next/link";
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { titleToSlug, toISODate } from '@/utils/parse';
import { allTagSlugs, buildBlogTagIndex, tagName } from '@/lib/tags';
import { contentLang, localePath, type Locale } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, openGraphDefaults, pageUrl } from '@/lib/i18n/seo';

function getPosts(locale: Locale) {
  return [...queryCollection('posts').where({ lang: contentLang(locale) })]
    .filter((p) => !((p.tags as string[]) || []).includes('Video'))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const dynamicParams = false;

export async function generateStaticParams() {
  // Unioned across locales, like `/tags/[tag]`: the page announces an hreflang
  // pair either way, so generating one half of it would publish a link to a 404.
  return allTagSlugs('blog').map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/blog/tags/[tag]'>): Promise<Metadata> {
  const { lang, tag: tagSlug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const originalTagName = tagName(buildBlogTagIndex(locale), tagSlug);

  return {
    title: t(i18n)`Posts tagged with "${originalTagName}"`,
    description: t(i18n)`All blog posts tagged with "${originalTagName}" - Software development, mobile apps, and technology articles.`,
    alternates: localeAlternates(locale, `/blog/tags/${tagSlug}`),
    openGraph: {
      title: t(i18n)`Posts tagged with "${originalTagName}" - Tiago Danin`,
      description: t(i18n)`All blog posts tagged with "${originalTagName}"`,
      url: pageUrl(locale, `/blog/tags/${tagSlug}`),
      type: "website",
      ...openGraphDefaults(locale),
    },
  };
}

export default async function TagPage({ params }: PageProps<'/[lang]/blog/tags/[tag]'>) {
  const { lang, tag: tagSlug } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const posts = getPosts(locale);
  const originalTagName = tagName(buildBlogTagIndex(locale), tagSlug);

  const taggedPosts = posts.filter((post) => {
    const postTags = (post.tags as string[]) || [];
    return postTags.some((tag: string) => titleToSlug(tag) === tagSlug);
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": t(i18n)`Posts tagged with "${originalTagName}"`,
    "url": pageUrl(locale, `/blog/tags/${tagSlug}`),
    "blogPost": taggedPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": toISODate(post.date),
      "url": pageUrl(locale, `/post/${post.slug}`),
      "inLanguage": contentLang(locale),
      "isAccessibleForFree": true,
      "author": { "@type": "Person", "name": "Tiago Danin" }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={localePath(locale, '/blog')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <Trans>Back to Blog</Trans>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={localePath(locale, '/blog/tags')} className="flex items-center gap-2">
                <Trans>All Topics</Trans>
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              <Trans>Posts tagged with &ldquo;{originalTagName}&rdquo;</Trans>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {taggedPosts.length === 1
                ? <Trans>{taggedPosts.length} post found</Trans>
                : <Trans>{taggedPosts.length} posts found</Trans>}
            </p>
            <TagFilter posts={posts} basePath={localePath(locale, '/blog/tags')} />
          </div>
        </div>

        {taggedPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16">
            <p className="text-muted-foreground text-lg"><Trans>No posts found with this tag.</Trans></p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={localePath(locale, '/blog')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                <Trans>Back to All Posts</Trans>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-16">
            {taggedPosts.map((post, index) => (
              <ArticleCard
                key={index}
                post={post}
                locale={locale}
                tagBasePath="/blog/tags"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
