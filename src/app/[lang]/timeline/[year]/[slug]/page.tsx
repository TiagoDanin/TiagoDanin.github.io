import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { Calendar } from 'lucide-react';

import { getRandomColorWithDarkMode, toISODate } from '@/utils/parse';
import { findTimelineEvent, getTimelineEvents } from '@/lib/timeline';
import { localePath, HTML_LANG } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, openGraphDefaults, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  // The slug is the English one in every language, so the two locales list the
  // same pairs. The locale still drives the read, because the Portuguese file
  // is what the Portuguese page renders.
  const locale = resolveLocale(params.lang);

  return getTimelineEvents(locale)
    .filter((event) => event.date && event.slug)
    .map((event) => ({ year: event.date, slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/timeline/[year]/[slug]'>): Promise<Metadata> {
  const { lang, year, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);

  const event = findTimelineEvent(locale, year, slug);

  if (!event) {
    return {
      title: t(i18n)`Event Not Found`,
      description: t(i18n)`The requested timeline event could not be found.`,
    };
  }

  // Truncate description to 160 characters
  const truncatedDescription = event.description.length > 160
    ? event.description.substring(0, 157) + '...'
    : event.description;

  return {
    title: `${event.title} (${event.date})`,
    description: truncatedDescription,
    keywords: ['timeline', 'career', 'professional journey', 'milestone', ...event.tags],
    alternates: localeAlternates(locale, `/timeline/${year}/${slug}`),
    openGraph: {
      title: `${event.title} (${event.date})`,
      description: truncatedDescription,
      type: 'article',
      url: pageUrl(locale, `/timeline/${year}/${slug}`),
      publishedTime: toISODate(event.date),
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: `${event.title} | ${event.date} | Tiago Danin`,
      description: truncatedDescription,
    },
  };
}

export default async function TimelineEventPage({ params }: PageProps<'/[lang]/timeline/[year]/[slug]'>) {
  const { lang, year, slug } = await params;
  const locale = resolveLocale(lang);
  initI18n(locale);

  const event = findTimelineEvent(locale, year, slug);

  if (!event) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": toISODate(event.date),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.title
    },
    "organizer": {
      "@type": "Organization",
      "name": event.title
    },
    "performer": {
      "@type": "Person",
      "name": "Tiago Danin"
    },
    "url": pageUrl(locale, `/timeline/${year}/${slug}`),
    "inLanguage": HTML_LANG[locale]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Event header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6" />
              <h1 className="text-3xl font-bold">{event.title}</h1>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm">
                {event.date}
              </span>
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${getRandomColorWithDarkMode(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Back to timeline link */}
          <div className="mt-10">
            <Link
              href={localePath(locale, '/timeline')}
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary text-white font-medium rounded-lg transition-colors"
            >
              <Trans>Back to Timeline</Trans>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
