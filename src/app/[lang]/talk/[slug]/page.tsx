import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft, Mic, Tag, Video } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GiscusComments } from '@/components/ui/GiscusComments';
import { CallToAction } from '@/components/sections/CallToAction';
import { getTalkBySlug, eventLabel } from '@/lib/talks';
import { talkEventSchema, talkVideoSchema } from '@/lib/talk-jsonld';
import { renderMdx } from '@/lib/render-mdx';
import { toISODate, formatDate, getRandomColorWithDarkMode } from '@/utils/parse';
import { getCallToActionData } from '@/lib/sections';
import { contentLang, DEFAULT_LOCALE, HTML_LANG, intlLocale, localePath } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, metaTitle, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = resolveLocale(params.lang);
  return queryCollection('talks')
    .where({ lang: contentLang(locale) })
    .map((talk: { slug: string }) => ({ slug: talk.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/talk/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const talk = getTalkBySlug(slug, contentLang(locale));

  if (!talk) {
    return {
      title: t(i18n)`Talk Not Found`,
      description: t(i18n)`The requested talk could not be found.`,
    };
  }

  const description = talk.description.length > 160
    ? `${talk.description.substring(0, 157)}...`
    : talk.description;

  return {
    // The event is what tells two editions of the same talk apart, so it
    // leads; the bare title, then the content's own short form, take over as
    // the label pushes the tag past what a SERP shows.
    title: metaTitle(`${talk.title} - ${eventLabel(talk)}`, talk.title, talk.seoTitle),
    description,
    keywords: ['talk', 'presentation', 'workshop', talk.event, eventLabel(talk), ...(talk.tags || [])],
    alternates: {
      ...localeAlternates(locale, `/talk/${slug}`),
      types: markdownAlternate(`/talk/${slug}`, locale),
    },
    openGraph: {
      title: talk.title,
      description,
      url: pageUrl(locale, `/talk/${slug}`),
      type: 'article',
      publishedTime: toISODate(talk.date),
      authors: [`${ORIGIN}/about/`],
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: talk.title,
      description,
      site: '@tiagodanin',
    },
  };
}

export default async function Talk({ params }: PageProps<'/[lang]/talk/[slug]'>) {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const talk = getTalkBySlug(slug, contentLang(locale));
  if (!talk) notFound();

  const mdxContent = await renderMdx(talk.body);
  const url = pageUrl(locale, `/talk/${slug}`);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`Talks`, "item": pageUrl(locale, '/talks') },
      { "@type": "ListItem", "position": 3, "name": talk.title, "item": url },
    ],
  };

  const video = talkVideoSchema(talk);
  const jsonLd = {
    "@context": "https://schema.org",
    ...talkEventSchema(talk, locale, url),
    ...(video && { recordedIn: video }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href={localePath(locale, '/talks')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <Trans>Back to Talks</Trans>
              </Link>
            </Button>
          </div>

          <header className="mb-8">
            <time className="text-sm text-muted-foreground">
              {formatDate(talk.date, intlLocale(locale))}
            </time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{talk.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{talk.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Mic className="h-3 w-3" />
                {eventLabel(talk)}
              </Badge>
              {talk.youtubeUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={talk.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-red-600">
                    <Video className="h-3 w-3" />
                    YouTube
                  </a>
                </Button>
              )}
            </div>

            {talk.tags && talk.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {talk.tags.map((tag, index) => (
                  <span key={index} className={`px-2 py-0.5 rounded-full text-xs ${getRandomColorWithDarkMode(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-zinc max-w-none">{mdxContent}</div>

          <GiscusComments
            term={`${talk.slug}-${contentLang(locale)}`}
            category="Talk Comments"
            categoryId="DIC_kwDONy7kws4C6oQH"
          />

          {locale === DEFAULT_LOCALE && (
            <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <Trans>
                  This talk content was translated from Portuguese with the help of an LLM. The
                  original version may contain nuances not fully captured in this translation.
                </Trans>
              </p>
            </div>
          )}
        </div>
      </article>

      <CallToAction {...getCallToActionData(locale)} />
    </>
  );
}
