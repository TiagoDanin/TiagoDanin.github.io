import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { Calendar } from 'lucide-react';

import { queryCollection } from 'nextjs-studio/server';
import { titleToSlug, getRandomColorWithDarkMode, toISODate } from '@/utils/parse';
import { localePath, HTML_LANG } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, openGraphLocale, pageUrl } from '@/lib/i18n/seo';

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  // Timeline has no Portuguese variant in contents/ (no index.br.json), so the
  // same events are listed under every locale prefix.
  resolveLocale(params.lang);
  const timelineData = queryCollection('timeline');
  const staticParams: { year: string, slug: string }[] = [];

  timelineData.forEach((event) => {
    const year = event.date.toString();
    const slug = titleToSlug(event.title);

    if (year && slug) {
      staticParams.push({ year, slug });
    }
  });

  return staticParams;
}

export async function generateMetadata({ params }: PageProps<'/[lang]/timeline/[year]/[slug]'>): Promise<Metadata> {
  const { lang, year, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const timelineData = queryCollection('timeline');

  const event = timelineData.find((item) => {
    const itemYear = item.date.toString();
    const itemSlug = titleToSlug(item.title);
    return itemYear === year && itemSlug === slug;
  });

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
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} | ${event.date} | Tiago Danin`,
      description: truncatedDescription,
    },
  };
}

export default async function TimelineEventPage({ params }: PageProps<'/[lang]/timeline/[year]/[slug]'>) {
  const { lang, year, slug } = await params;
  const locale = resolveLocale(lang);
  initI18n(locale);

  const timelineData = queryCollection('timeline');

  const event = timelineData.find((item) => {
    const itemYear = item.date.toString();
    const itemSlug = titleToSlug(item.title);
    return itemYear === year && itemSlug === slug;
  });

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
