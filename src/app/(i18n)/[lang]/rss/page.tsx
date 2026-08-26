import type { Metadata } from "next";
import type { I18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";

import { FeedItem } from "@/components/ui/FeedItem";
import { HTML_LANG } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphLocale, ORIGIN, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/rss'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`RSS Feeds`,
    description: t(
      i18n
    )`Subscribe to RSS feeds for blog posts, talks, timeline, and projects. Stay updated with all content from Tiago Danin.`,
    keywords: ['RSS', 'feed', 'subscribe', 'blog RSS', 'updates', 'syndication'],
    alternates: localeAlternates(locale, '/rss'),
    openGraph: {
      title: t(i18n)`RSS Feeds - Tiago Danin`,
      description: t(i18n)`Subscribe to RSS feeds for blog posts, talks, timeline, and projects.`,
      url: pageUrl(locale, '/rss'),
      type: 'website',
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary',
      title: t(i18n)`RSS Feeds - Tiago Danin`,
      description: t(i18n)`Subscribe to RSS feeds for all content updates.`,
    },
  };
}

// Single source for the four feeds: the cards below and the JSON-LD read the
// same rows, so the schema can never claim a feed the page does not show.
// TODO: this copy belongs in a contents/ collection, like the rest of the site.
// Locale-dependent, so it has to be built per render rather than at module
// level: a module-level array would freeze its strings in whichever language
// rendered first.
function getFeeds(i18n: I18n) {
  return [
    {
      title: t(i18n)`Blog Posts`,
      url: '/rss/blog.xml',
      description: t(i18n)`All articles and thoughts about development, technology and more.`,
    },
    {
      title: t(i18n)`Talks`,
      url: '/rss/talks.xml',
      description: t(i18n)`Talks and presentations about development, technology and more.`,
    },
    {
      title: t(i18n)`Timeline`,
      url: '/rss/timeline.xml',
      description: t(i18n)`Professional journey and career milestones.`,
    },
    {
      title: t(i18n)`Projects`,
      url: '/rss/projects.xml',
      description: t(i18n)`All projects by Tiago Danin.`,
    },
  ] as const;
}

export default async function RSSLandingPage({ params }: PageProps<'/[lang]/rss'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const feeds = getFeeds(i18n);

  // A directory of feeds: each one is a DataFeed, the page is the collection.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t(i18n)`RSS Feeds, Tiago Danin`,
    "url": pageUrl(locale, '/rss'),
    "inLanguage": HTML_LANG[locale],
    "isPartOf": { "@type": "WebSite", "name": "Tiago Danin", "url": pageUrl(locale, '/') },
    "hasPart": feeds.map((f) => ({
      "@type": "DataFeed",
      "name": `${f.title}, Tiago Danin`,
      "description": f.description,
      "url": `${ORIGIN}${f.url}`,
      "encodingFormat": "application/rss+xml",
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`RSS Feeds`, "item": pageUrl(locale, '/rss') },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="container mx-auto py-32 px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4"><Trans>RSS Feeds</Trans></h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          <Trans>Subscribe to updates from Tiago Danin. Below are all available RSS feeds:</Trans>
        </p>
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        {feeds.map((feed) => (
          <FeedItem key={feed.url} {...feed} />
        ))}
      </div>
    </div>
    </>
  );
}
