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

export default function RSSLandingPage() {
  return (
    <div className="container mx-auto py-32 px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">RSS Feeds</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Subscribe to updates from Tiago Danin. Below are all available RSS feeds:
        </p>
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        <FeedItem
          title="Blog Posts"
          url="/rss/blog.xml"
          description="All articles and thoughts about development, technology and more."
        />
        <FeedItem
          title="Talks"
          url="/rss/talks.xml"
          description="Talks and presentations about development, technology and more."
        />
        <FeedItem
          title="Timeline"
          url="/rss/timeline.xml"
          description="Professional journey and career milestones."
        />
        <FeedItem
          title="Projects"
          url="/rss/projects.xml"
          description="All projects by Tiago Danin."
        />
      </div>
    </div>
  );
}
