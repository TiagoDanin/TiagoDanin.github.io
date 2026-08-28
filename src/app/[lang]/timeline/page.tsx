import type { Metadata } from 'next';
import Link from "next/link";
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import { titleToSlug, getRandomColor, toISODate } from '@/utils/parse';
import { feedPath, localePath, intlLocale, HTML_LANG } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/timeline'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);
  const timelineData = queryCollection('timeline');

  return {
    title: t(i18n)`Professional Timeline & Career Journey`,
    description: t(i18n)`Career timeline from education to senior mobile developer. Professional milestones, projects, and achievements in mobile development, cybersecurity, and open source.`,
    keywords: ["timeline", "career", "professional journey", "work history", "experience", "mobile developer career", "career milestones", "professional background"],
    alternates: {
      ...localeAlternates(locale, '/timeline'),
      types: {
        ...markdownAlternate('/timeline'),
        'application/rss+xml': [
          { url: feedPath('timeline', locale), title: t(i18n)`Timeline RSS Feed` }
        ],
      },
    },
    openGraph: {
      title: t(i18n)`Professional Timeline & Career Journey`,
      description: t(i18n)`Career milestones from education to senior mobile developer. Professional journey in mobile development, cybersecurity, and open source.`,
      url: pageUrl(locale, '/timeline'),
      type: "profile",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Career Timeline | Tiago Danin`,
      description: t(i18n)`Professional journey: education, projects, and career milestones in mobile development.`,
      creator: "@tiagodanin",
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": timelineData.map((item) => ({
            "@type": "Event",
            "name": item.title,
            "description": item.description,
            "startDate": toISODate(item.date),
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": item.title
            },
            "organizer": {
              "@type": "Organization",
              "name": item.title
            },
            "performer": {
              "@type": "Person",
              "name": "Tiago Danin"
            },
            "url": `${ORIGIN}${localePath(locale, `/timeline/${item.date.toString()}/${titleToSlug(item.title)}`)}`,
            "inLanguage": HTML_LANG[locale]
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": t(i18n)`Home`,
              "item": pageUrl(locale, '/')
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": t(i18n)`Timeline`,
              "item": pageUrl(locale, '/timeline')
            }
          ]
        }
      ])
    }
  };
}

export default async function Timeline({ params }: PageProps<'/[lang]/timeline'>) {
  const locale = resolveLocale((await params).lang);
  initI18n(locale);
  const timelineData = queryCollection('timeline');

  return (
    <>
      <div className="container mx-auto py-16 sm:py-20 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-3xl w-full mx-auto mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4"><Trans>Professional Timeline & Career Journey</Trans></h1>
          <p className="text-center text-sm sm:text-base text-muted-foreground">
            <Trans>Career milestones from education to senior mobile developer. Professional journey in mobile development, cybersecurity, and open source.</Trans>
          </p>
        </div>

        <ol className="relative border-s border-gray-200 dark:border-gray-700 max-w-3xl w-full mx-auto">
          {timelineData.map((item, index) => {
            const year = item.date.toString();
            const slug = titleToSlug(item.title);

            return (
              <li key={index} className="mb-10 ms-4">
                {/* Timeline dot */}
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                <div className="mb-2">
                  {/* Year tag */}
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    {item.date.toString().includes('-')
                      ? new Date(item.date).toLocaleDateString(intlLocale(locale), {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                      : item.date}
                  </span>

                  {/* Tags */}
                  {item.tags && item.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className={`text-sm font-medium px-3 ml-2 py-1 rounded-full ${getRandomColor()}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <Link href={localePath(locale, `/timeline/${year}/${slug}`)} className="block group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
