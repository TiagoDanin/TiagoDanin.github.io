import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GiscusComments } from '@/components/ui/GiscusComments';
import { AdaptivePost, DEFAULT_VARIANT } from '@/components/ui/AdaptivePost';
import { CallToAction } from '@/components/sections/CallToAction';
import { RelatedPosts } from '@/components/sections/RelatedPosts';
import { getPostBySlug, relatedPosts, type PostContent } from '@/lib/mdx';
import { renderMdx } from '@/lib/render-mdx';
import { toISODate, formatDate } from '@/utils/parse';
import { getCallToActionData } from '@/lib/sections';
import { contentLang, DEFAULT_LOCALE, HTML_LANG, intlLocale, localePath } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, metaTitle, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

export const dynamicParams = false;

/** `variant` is only set when `[variant]/page.tsx` renders this page. */
type PostParams = { lang: string; slug: string; variant?: string };

/**
 * The version a page renders. An adaptive post serves each variant at
 * `/post/<slug>/<id>/` with its own title and description; the post's own URL
 * is the `all` version. Null when the variant does not exist.
 */
function resolveVersion(post: PostContent, variant?: string) {
  if (!variant) {
    return { id: DEFAULT_VARIANT, path: `/post/${post.slug}`, title: post.title, seoTitle: post.seoTitle, description: post.description };
  }
  const version = post.variants?.find((candidate) => candidate.id === variant);
  if (!version) return null;
  return { id: version.id, path: `/post/${post.slug}/${version.id}`, title: version.title, seoTitle: version.seoTitle, description: version.description };
}

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = resolveLocale(params.lang);
  return queryCollection('posts')
    .where({ lang: contentLang(locale) })
    .map((post: { slug: string }) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/post/[slug]'>): Promise<Metadata> {
  const { lang, slug, variant } = (await params) as PostParams;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const post = getPostBySlug(slug, contentLang(locale));
  const version = post && resolveVersion(post, variant);

  if (!post || !version) {
    return { title: t(i18n)`Post not found`, robots: { index: false, follow: true } };
  }

  const description = version.description.length > 160
    ? `${version.description.substring(0, 157)}...`
    : version.description;

  const coverUrl = post.cover ? `${ORIGIN}${post.cover}` : undefined;

  return {
    title: metaTitle(version.title, version.seoTitle),
    description,
    keywords: post.tags.length > 0
      ? [...post.tags, 'Tiago Danin', 'blog']
      : ['blog', 'software development', 'technology'],
    alternates: {
      ...localeAlternates(locale, version.path),
      // Only the post's own URL has a Markdown mirror.
      ...(!variant && { types: markdownAlternate(version.path, locale) }),
    },
    openGraph: {
      title: version.title,
      description,
      url: pageUrl(locale, version.path),
      type: 'article',
      publishedTime: toISODate(post.date),
      authors: [`${ORIGIN}/about/`],
      ...openGraphDefaults(locale),
      ...(coverUrl && { images: [{ url: coverUrl, alt: version.title }] }),
    },
    twitter: {
      ...twitterDefaults(),
      title: version.title,
      description,
      ...(coverUrl && { images: [coverUrl] }),
    },
  };
}

export default async function Post({ params }: PageProps<'/[lang]/post/[slug]'>) {
  const { lang, slug, variant } = (await params) as PostParams;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const post = getPostBySlug(slug, contentLang(locale));
  if (!post) notFound();
  const version = resolveVersion(post, variant);
  if (!version) notFound();

  const mdxContent = await renderMdx(post.body, version.id);
  const url = pageUrl(locale, version.path);
  const coverUrl = post.cover ? `${ORIGIN}${post.cover}` : undefined;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`Blog`, "item": pageUrl(locale, '/blog') },
      { "@type": "ListItem", "position": 3, "name": version.title, "item": url },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": version.title,
    "description": version.description,
    "datePublished": toISODate(post.date),
    "dateModified": toISODate(post.date),
    "url": url,
    "inLanguage": HTML_LANG[locale],
    "isAccessibleForFree": true,
    ...(coverUrl && { "image": coverUrl }),
    "author": {
      "@type": "Person",
      "name": "Tiago Danin",
      "url": pageUrl(locale, '/'),
      "image": "https://avatars.githubusercontent.com/u/5731176?v=4"
    },
    "publisher": { "@type": "Person", "name": "Tiago Danin", "url": pageUrl(locale, '/') },
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    ...(post.tags.length > 0 && { "keywords": post.tags.join(', ') }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href={localePath(locale, '/blog')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <Trans>Back to Blog</Trans>
              </Link>
            </Button>
          </div>

          <header className="mb-8">
            <time className="text-sm text-muted-foreground">
              {formatDate(post.date, intlLocale(locale))}
            </time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{version.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{version.description}</p>
            {/* The EN | PT pair that used to sit here is gone: the footer
                switcher covers every route, and this one linked at the old
                trailing-segment address. */}
          </header>

          {post.variants ? (
            <AdaptivePost locale={locale} slug={post.slug} variants={post.variants} active={version.id}>
              <div className="prose prose-zinc max-w-none">{mdxContent}</div>
            </AdaptivePost>
          ) : (
            <div className="prose prose-zinc max-w-none">{mdxContent}</div>
          )}

          <RelatedPosts posts={relatedPosts(post, locale)} locale={locale} />

          {/* Keyed on the content language, not the locale code: renaming the
              URL segment to br must not orphan the existing comment threads. */}
          <GiscusComments term={`${post.slug}-${contentLang(locale)}`} />

          {/* Posts are written in Portuguese. Only the translation carries the
              notice; the original has nothing to disclose. */}
          {locale === DEFAULT_LOCALE && (
            <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <Trans>
                  This article was translated from Portuguese with the help of an LLM. The
                  original version may contain nuances not fully captured in this translation.
                </Trans>
              </p>
            </div>
          )}

          {post.originalUrl && (
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <a href={post.originalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <Trans>Read original article</Trans>
                </a>
              </Button>
            </div>
          )}
        </div>
      </article>

      <CallToAction {...getCallToActionData(locale)} />
    </>
  );
}
