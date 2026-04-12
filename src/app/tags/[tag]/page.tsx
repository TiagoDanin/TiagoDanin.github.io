import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft, Mic, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { titleToSlug, toISODate, getRandomColorWithDarkMode } from '@/utils/parse';

function getPosts() {
  return [...queryCollection('posts').where({ lang: 'en' })].sort((a, b) => b.date.localeCompare(a.date));
}

function getTalks() {
  return [...queryCollection('talks').where({ lang: 'en' })].sort((a, b) => b.date.localeCompare(a.date));
}

function getAllTagsMap() {
  const posts = getPosts();
  const talks = getTalks();
  const map = new Map<string, string>();
  posts.forEach((post) => {
    ((post.tags as string[]) || []).forEach((tag: string) => {
      map.set(titleToSlug(tag), tag);
    });
  });
  talks.forEach((talk) => {
    ((talk.tags as string[]) || []).forEach((tag: string) => {
      map.set(titleToSlug(tag), tag);
    });
  });
  return map;
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagSlug } = await params;
  const allTagsMap = getAllTagsMap();
  const originalTagName = allTagsMap.get(tagSlug) || decodeURIComponent(tagSlug);

  return {
    title: `${originalTagName} - Articles & Talks`,
    description: `All articles and talks about ${originalTagName} by Tiago Danin. Software development, mobile apps, and technology content.`,
    alternates: {
      canonical: `https://tiagodanin.com/tags/${tagSlug}`,
    },
    openGraph: {
      title: `${originalTagName} - Articles & Talks | Tiago Danin`,
      description: `All articles and talks about ${originalTagName}`,
      url: `https://tiagodanin.com/tags/${tagSlug}`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  const allTagsMap = getAllTagsMap();
  return Array.from(allTagsMap.keys()).map(tag => ({ tag }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagSlug } = await params;
  const posts = getPosts();
  const talks = getTalks();
  const allTagsMap = getAllTagsMap();
  const originalTagName = allTagsMap.get(tagSlug) || decodeURIComponent(tagSlug);

  const taggedPosts = posts.filter((post) => {
    const postTags = (post.tags as string[]) || [];
    return postTags.some((tag: string) => titleToSlug(tag) === tagSlug);
  });

  const taggedTalks = talks.filter((talk) => {
    const talkTags = (talk.tags as string[]) || [];
    return talkTags.some((tag: string) => titleToSlug(tag) === tagSlug);
  });

  const allContent = [...posts, ...talks];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${originalTagName} - Articles & Talks`,
    "url": `https://tiagodanin.com/tags/${tagSlug}`,
    "description": `All articles and talks about ${originalTagName}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        ...taggedPosts.map((post, i) => ({
          "@type": "BlogPosting",
          "position": i + 1,
          "headline": post.title,
          "description": post.description,
          "datePublished": toISODate(post.date),
          "url": `https://tiagodanin.com/post/${post.slug}`,
          "author": { "@type": "Person", "name": "Tiago Danin" },
        })),
        ...taggedTalks.map((talk, i) => ({
          "@type": "Event",
          "position": taggedPosts.length + i + 1,
          "name": talk.title,
          "description": talk.description,
          "startDate": toISODate(talk.date),
          "url": `https://tiagodanin.com/talk/${talk.slug}`,
          "performer": { "@type": "Person", "name": "Tiago Danin" },
        })),
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tags" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                All Tags
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {originalTagName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {taggedPosts.length} {taggedPosts.length === 1 ? 'article' : 'articles'} &middot; {taggedTalks.length} {taggedTalks.length === 1 ? 'talk' : 'talks'}
            </p>
            <TagFilter posts={allContent as Array<{ tags: string[] }>} basePath="/tags" />
          </div>
        </div>

        {taggedPosts.length > 0 && (
          <section className="max-w-2xl mx-auto mb-16">
            <h2 className="text-xl font-semibold tracking-tight mb-8">Articles</h2>
            <div className="space-y-16">
              {taggedPosts.map((post, index) => (
                <ArticleCard
                  key={index}
                  post={post}
                  locale="en"
                />
              ))}
            </div>
          </section>
        )}

        {taggedTalks.length > 0 && (
          <section className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold tracking-tight mb-8">Talks</h2>
            <div className="space-y-8">
              {taggedTalks.map((talk) => (
                <article key={talk.slug} className="group relative flex flex-col items-start">
                  <Link href={`/talk/${talk.slug}`} className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-6" aria-label={`View ${talk.title}`} />
                  <div className="absolute -inset-x-4 -inset-y-6 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800 pointer-events-none" />

                  <div className="relative pointer-events-none order-first mb-3 flex items-center gap-2">
                    <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                      <span className="absolute inset-y-0 left-0 flex items-center">
                        <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                      </span>
                      {talk.date}
                    </time>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Mic className="h-3 w-3" />
                      {talk.event}
                    </Badge>
                  </div>

                  <h3 className="relative pointer-events-none text-base font-semibold tracking-tight">
                    {talk.title}
                  </h3>

                  <p className="relative pointer-events-none mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {talk.description}
                  </p>

                  <div className="relative z-10 mt-3 flex flex-wrap gap-2 pointer-events-auto">
                    {((talk.tags as string[]) || []).map((tag: string) => (
                      <Link key={tag} href={`/tags/${titleToSlug(tag)}`}>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRandomColorWithDarkMode(tag)}`}
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>

                  <div className="relative pointer-events-none mt-4 flex items-center gap-4 text-sm font-medium text-primary">
                    <span className="flex items-center">
                      View details
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                        <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {talk.youtubeUrl && (
                      <Link
                        href={talk.youtubeUrl}
                        className="flex items-center text-red-600 dark:text-red-400 hover:underline pointer-events-auto"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        YouTube
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {taggedPosts.length === 0 && taggedTalks.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <p className="text-muted-foreground text-lg">No content found with this tag.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/tags">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Tags
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
