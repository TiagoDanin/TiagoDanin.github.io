import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { titleToSlug, getRandomColorWithDarkMode } from '@/utils/parse';

export const metadata = {
  title: "Browse by Tags - Articles & Talks",
  description: "Explore all articles and talks by Tiago Danin organized by technology tags. Find content about Flutter, React Native, Android, AI, DevOps, and more.",
  keywords: ["tags", "topics", "Flutter", "React Native", "Android", "AI", "DevOps", "JavaScript", "mobile development"],
  alternates: {
    canonical: 'https://tiagodanin.com/tags',
  },
  openGraph: {
    title: "Browse by Tags - Tiago Danin",
    description: "Explore all articles and talks organized by technology tags.",
    url: "https://tiagodanin.com/tags",
    type: "website",
  },
};

export default function TagsPage() {
  const posts = [...queryCollection('posts').where({ lang: 'en' })];
  const talks = [...queryCollection('talks').where({ lang: 'en' })];

  const tagMap = new Map<string, { posts: number; talks: number; displayName: string }>();

  posts.forEach((post) => {
    ((post.tags as string[]) || []).forEach((tag) => {
      const slug = titleToSlug(tag);
      const existing = tagMap.get(slug) || { posts: 0, talks: 0, displayName: tag };
      existing.posts++;
      tagMap.set(slug, existing);
    });
  });

  talks.forEach((talk) => {
    ((talk.tags as string[]) || []).forEach((tag) => {
      const slug = titleToSlug(tag);
      const existing = tagMap.get(slug) || { posts: 0, talks: 0, displayName: tag };
      existing.talks++;
      tagMap.set(slug, existing);
    });
  });

  const sortedTags = Array.from(tagMap.entries()).sort((a, b) => {
    const totalA = a[1].posts + a[1].talks;
    const totalB = b[1].posts + b[1].talks;
    return totalB - totalA;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Browse by Tags",
    "url": "https://tiagodanin.com/tags",
    "description": "All articles and talks organized by technology tags",
    "author": {
      "@type": "Person",
      "name": "Tiago Danin",
      "url": "https://tiagodanin.com",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
            </div>
            <p className="text-muted-foreground">
              Browse all articles and talks by topic
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTags.map(([slug, data]) => (
              <Link
                key={slug}
                href={`/tags/${slug}`}
                className="group block p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={`text-sm ${getRandomColorWithDarkMode(data.displayName)}`}
                  >
                    {data.displayName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {data.posts + data.talks}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  {data.posts > 0 && (
                    <span>{data.posts} {data.posts === 1 ? 'article' : 'articles'}</span>
                  )}
                  {data.talks > 0 && (
                    <span>{data.talks} {data.talks === 1 ? 'talk' : 'talks'}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
