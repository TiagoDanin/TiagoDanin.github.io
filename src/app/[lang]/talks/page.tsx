import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { queryCollection } from 'nextjs-studio/server';
import { Mic, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDate, getRandomColor } from '@/utils/parse';
import { eventLabel } from '@/lib/talks';
import { talkEventSchema } from '@/lib/talk-jsonld';
import { contentLang, entryPath, feedPath, intlLocale } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/talks'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  const alternates = localeAlternates(locale, '/talks');

  return {
    title: t(i18n)`Tech Talks - Flutter, React Native & Security`,
    description: t(
      i18n
    )`Watch talks on mobile development, Flutter, React Native, and cybersecurity. Presentations at DevFest, DevOpsDays, and developer meetups. Slides and videos available.`,
    alternates: {
      ...alternates,
      types: {
        ...markdownAlternate('/talks'),
        'application/rss+xml': [{ url: feedPath('talks', locale), title: 'Talks RSS Feed' }],
      },
    },
    openGraph: {
      title: t(i18n)`Talks & Presentations`,
      description: t(
        i18n
      )`Talks about mobile development, Flutter, React Native and cybersecurity. Presentations at tech events.`,
      url: pageUrl(locale, '/talks'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Tech Talks | Tiago Danin`,
      description: t(i18n)`Talks about mobile, Flutter, React Native and security at tech events.`,
      creator: "@tiagodanin",
    },
  };
}

const TalksPage = async ({ params }: PageProps<'/[lang]/talks'>) => {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const talks = queryCollection('talks').where({ lang: contentLang(locale) });
  const sortedTalks = [...talks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const talkUrl = (slug: string) => entryPath(locale, 'talk', slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`Talks`, "item": pageUrl(locale, '/talks') }
    ]
  };

  /**
   * The list as an `ItemList` of `ListItem`s.
   *
   * The elements used to be bare `Event` objects with no `position` and no
   * wrapper, which is not what Google reads `itemListElement` as, and each of
   * those Events named a `Place` with no address on top of that. One shared
   * builder now produces the same Event the detail page emits.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t(i18n)`Talks by Tiago Danin`,
    "numberOfItems": sortedTalks.length,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "itemListElement": sortedTalks.map((talk, index) => {
      const url = `${ORIGIN}${talkUrl(String(talk.slug))}/`;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "url": url,
        "item": talkEventSchema(talk, locale, url),
      };
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight"><Trans>Talks</Trans></h1>
          <p className="mt-4 text-muted-foreground">
            <Trans>Talks, presentations and workshops about technology and development</Trans>
          </p>
          {/* The EN / PT pair that used to sit here is gone: the footer switcher
              does that job for every route, and this one still pointed at the
              old /talks/pt address. */}
          <p className="mt-2 text-sm text-muted-foreground">
            <Trans>Total talks: {talks.length}</Trans>
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-16">
          {sortedTalks.map((talk) => (
            <article key={talk.slug} className="group relative flex flex-col items-start hover:shadow-lg">
              <Link href={talkUrl(String(talk.slug))} className="absolute inset-0 z-10">
                <span className="sr-only"><Trans>View {talk.title}</Trans></span>
              </Link>
              <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl" />

              <div className="relative z-10 order-first mb-3 flex items-center gap-2">
                <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                  <span className="absolute inset-y-0 left-0 flex items-center">
                    <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                  </span>
                  {formatDate(String(talk.date), intlLocale(locale))}
                </time>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Mic className="h-3 w-3" />
                  {eventLabel(talk)}
                </Badge>
              </div>

              <h2 className="relative z-10 text-base font-semibold tracking-tight">
                <Link href={talkUrl(String(talk.slug))} className="relative z-10">
                  <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                  {talk.title}
                </Link>
              </h2>

              <p className="relative z-10 mt-2 text-sm text-zinc-600">
                <Link href={talkUrl(String(talk.slug))} className="relative z-10">
                  {talk.description}
                </Link>
              </p>

              <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                {talk.tags && talk.tags.map((tag: string, index: number) => (
                  <span key={index} className={`text-xs px-2 py-1 rounded-full ${getRandomColor()}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
                {talk.youtubeUrl ? (
                  <div className="flex gap-4">
                    <Link href={talkUrl(String(talk.slug))} className="flex items-center hover:underline">
                      <Trans>View details</Trans>
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                        <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                    <Link
                      href={talk.youtubeUrl}
                      className="flex items-center text-red-600 hover:underline z-20"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      <Trans>Watch on YouTube</Trans>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Trans>View details</Trans>
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                      <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default TalksPage;
