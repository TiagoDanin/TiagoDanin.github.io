import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { getCoverImagePath } from "@/lib/cover-image";
import { toISODate } from '@/utils/parse';

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

      <TagFilter posts={posts} />

      <div className="max-w-2xl mx-auto space-y-16">
        {currentPosts.map((post, index) => (
          <ArticleCard
            key={index}
            post={post}
            locale="en"
            coverImage={getCoverImagePath(post.slug)}
          />
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
