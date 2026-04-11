import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { Badge } from "@/components/ui/badge";
import { Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { getCoverImagePath } from "@/lib/cover-image";
import { getRandomColorWithDarkMode, titleToSlug, toISODate } from '@/utils/parse';

function getPosts() {
  return [...queryCollection('posts').where({ lang: 'en' })].sort((a, b) => b.date.localeCompare(a.date));
}

function getAllTagsMap() {
  const posts = getPosts();
  const map = new Map<string, string>();
  posts.forEach((post) => {
    ((post.tags as string[]) || []).forEach((tag: string) => {
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
    title: `Posts tagged with "${originalTagName}"`,
    description: `All blog posts tagged with "${originalTagName}" - Software development, mobile apps, and technology articles.`,
    alternates: {
      canonical: `https://tiagodanin.com/blog/tags/${tagSlug}`,
    },
    openGraph: {
      title: `Posts tagged with "${originalTagName}" - Tiago Danin`,
      description: `All blog posts tagged with "${originalTagName}"`,
      url: `https://tiagodanin.com/blog/tags/${tagSlug}`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  const allTagsMap = getAllTagsMap();
  return Array.from(allTagsMap.keys()).map(tag => ({ tag }));
}

const TagPage = async ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag: tagSlug } = await params;
  const posts = getPosts();
  const allTagsMap = getAllTagsMap();
  const originalTagName = allTagsMap.get(tagSlug) || decodeURIComponent(tagSlug);

  const taggedPosts = posts.filter((post) => {
    const postTags = (post.tags as string[]) || [];
    return postTags.some((tag: string) => titleToSlug(tag) === tagSlug);
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `Posts tagged with "${originalTagName}"`,
    "url": `https://tiagodanin.com/blog/tags/${tagSlug}`,
    "blogPost": taggedPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": toISODate(post.date),
      "url": `https://tiagodanin.com/post/${post.slug}`,
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "author": { "@type": "Person", "name": "Tiago Danin" }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Posts tagged with</h1>
            <div className="flex justify-center mb-4">
              <Badge className={`flex items-center gap-2 text-lg px-4 py-2 ${getRandomColorWithDarkMode(originalTagName)}`}>
                <Tag className="h-4 w-4" />
                {originalTagName}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {taggedPosts.length} {taggedPosts.length === 1 ? 'post' : 'posts'} found
            </p>
          </div>
        </div>

        <TagFilter posts={posts} />

        {taggedPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16">
            <p className="text-muted-foreground text-lg">No posts found with this tag.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Posts
              </Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-16">
            {taggedPosts.map((post, index) => (
              <ArticleCard
                key={index}
                post={post}
                locale="en"
                coverImage={getCoverImagePath(post.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TagPage;
