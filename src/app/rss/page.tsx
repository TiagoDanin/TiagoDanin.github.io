import Link from 'next/link';
import { FeedItem } from "@/components/ui/FeedItem";

export const metadata = {
  title: 'RSS Feeds',
  description: 'Subscribe to RSS feeds for blog posts, talks, timeline, and projects. Stay updated with all content from Tiago Danin.',
  keywords: ['RSS', 'feed', 'subscribe', 'blog RSS', 'updates', 'syndication'],
  alternates: {
    canonical: 'https://tiagodanin.com/rss/',
  },
  openGraph: {
    title: 'RSS Feeds - Tiago Danin',
    description: 'Subscribe to RSS feeds for blog posts, talks, timeline, and projects.',
    url: 'https://tiagodanin.com/rss/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'RSS Feeds - Tiago Danin',
    description: 'Subscribe to RSS feeds for all content updates.',
  },
};

// Single source for the four feeds: the cards below and the JSON-LD read the
// same rows, so the schema can never claim a feed the page does not show.
// TODO: this copy belongs in a contents/ collection, like the rest of the site.
const FEEDS = [
  {
    title: 'Blog Posts',
    url: '/rss/blog.xml',
    description: 'All articles and thoughts about development, technology and more.',
  },
  {
    title: 'Talks',
    url: '/rss/talks.xml',
    description: 'Talks and presentations about development, technology and more.',
  },
  {
    title: 'Timeline',
    url: '/rss/timeline.xml',
    description: 'Professional journey and career milestones.',
  },
  {
    title: 'Projects',
    url: '/rss/projects.xml',
    description: 'All projects by Tiago Danin.',
  },
] as const;

export default function RSSLandingPage() {
  // A directory of feeds: each one is a DataFeed, the page is the collection.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "RSS Feeds, Tiago Danin",
    "url": "https://tiagodanin.com/rss/",
    "inLanguage": "en-US",
    "isPartOf": { "@type": "WebSite", "name": "Tiago Danin", "url": "https://tiagodanin.com/" },
    "hasPart": FEEDS.map((f) => ({
      "@type": "DataFeed",
      "name": `${f.title}, Tiago Danin`,
      "description": f.description,
      "url": `https://tiagodanin.com${f.url}`,
      "encodingFormat": "application/rss+xml",
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com/" },
      { "@type": "ListItem", "position": 2, "name": "RSS Feeds", "item": "https://tiagodanin.com/rss/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="container mx-auto py-32 px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">RSS Feeds</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Subscribe to updates from Tiago Danin. Below are all available RSS feeds:
        </p>
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        {FEEDS.map((feed) => (
          <FeedItem key={feed.url} {...feed} />
        ))}
      </div>
    </div>
    </>
  );
}
