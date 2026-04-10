import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { Badge } from "@/components/ui/badge";
import { Video, ChevronRight, Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toISODate, formatDate, getRandomColorWithDarkMode, titleToSlug } from '@/utils/parse';

const POSTS_PER_PAGE = 10;

export function generateMetadata() {
  const posts = queryCollection('posts').where({ lang: 'en' });

  return {
    title: "Blog: Articles on Development & AI",
    description: "Blog about software development, mobile, AI and security. Weekly articles about Flutter, React Native, AI agents and technology.",
    keywords: ["blog", "software development", "mobile development", "Flutter", "React Native", "AI agents", "security", "programming", "technical articles"],
    alternates: {
      canonical: 'https://tiagodanin.com/blog',
      types: {
        'application/rss+xml': [
          { url: '/rss/blog.xml', title: 'Blog RSS Feed' }
        ],
      },
    },
    openGraph: {
      title: "Blog: Development, Mobile & AI",
      description: "Weekly articles about software development, mobile apps, AI agents and security.",
      url: "https://tiagodanin.com/blog",
      type: "website",
      siteName: "Tiago Danin",
      locale: "en_US",
    },
    twitter: {
      card: 'summary_large_image',
      title: "Blog: Development & AI | Tiago Danin",
      description: "Articles about mobile, AI agents, security and programming.",
      creator: "@tiagodanin",
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog: Articles on Development & AI",
          "description": "Blog about software development, mobile, AI and security",
          "url": "https://tiagodanin.com/blog",
          "inLanguage": "en",
          "author": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": "https://tiagodanin.com"
          },
          "blogPost": posts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "datePublished": toISODate(post.date),
            "url": `https://tiagodanin.com/post/${post.slug}`,
            "inLanguage": "en",
            "isAccessibleForFree": true,
            "author": {
              "@type": "Person",
              "name": "Tiago Danin"
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tiagodanin.com/blog" }
          ]
        }
      ])
    }
  };
}

const Blog = () => {
  const posts = [...queryCollection('posts').where({ lang: 'en' })].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPosts = posts.slice(0, POSTS_PER_PAGE);
  const hasNextPage = totalPages > 1;

  const isYouTubePost = (url: string) => url.includes("youtube.com");

  return (
    <>
      {hasNextPage && <link rel="next" href="https://tiagodanin.com/blog/2" />}
    <div className="container mx-auto py-32">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-muted-foreground">
          Thoughts, insights, and ideas about technology and development
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length} articles
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog/pt">PT</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-16">
        {currentPosts.map((post, index) => (
          <article key={index} className="group relative flex flex-col items-start cursor-pointer">
            <Link href={`/post/${post.slug}`} className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-6" aria-label={`Read ${post.title}`} />
            <div className="absolute -inset-x-4 -inset-y-6 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl pointer-events-none" />

            <div className="relative pointer-events-none order-first mb-3 flex items-center gap-2">
              <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                <span className="absolute inset-y-0 left-0 flex items-center">
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                </span>
                {formatDate(post.date)}
              </time>
              {isYouTubePost(post.originalUrl) ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  Video
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Text className="h-3 w-3" />
                  Article
                </Badge>
              )}
            </div>

            <h2 className="relative pointer-events-none text-base font-semibold tracking-tight">
              {post.title}
            </h2>

            <p className="relative pointer-events-none mt-2 text-sm text-zinc-600">
              {post.description}
            </p>

            <div className="relative z-10 mt-3 flex flex-wrap gap-2 pointer-events-auto">
              {(post.tags || []).map((tag: string) => (
                <Link key={tag} href={`/blog/tags/${titleToSlug(tag)}`}>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getRandomColorWithDarkMode(tag)}`}
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="relative pointer-events-none mt-4 flex items-center text-sm font-medium text-primary">
              Read article
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          <Button variant="outline" disabled>
            <span className="flex items-center">Previous</span>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page 1 of {totalPages}
            </span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog/2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
    </>
  );
};

export default Blog;
