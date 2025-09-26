import Link from "next/link";
import posts from "@/data/posts.json";
import { Badge } from "@/components/ui/badge";
import { Tag, Video, ChevronLeft, Text, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractTagsFromPost, getRandomColorWithDarkMode, titleToSlug, toISODate } from '@/utils/parse';

interface Post {
  date: string;
  title: string;
  description: string;
  slug: string;
  originalUrl: string;
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tagName = decodeURIComponent(params.tag);
  return {
    title: `Posts tagged with "${tagName}"`,
    description: `All blog posts tagged with "${tagName}" - Articles and thoughts about development, technology and more`,
  };
}

export async function generateStaticParams() {
  const allTags = new Set<string>();

  posts.forEach(post => {
    const tags = extractTagsFromPost(post.title, post.description);
    tags.forEach(tag => allTags.add(titleToSlug(tag)));
  });

  return Array.from(allTags).map(tag => ({
    tag: tag
  }));
}

const TagPage = async ({
  params
}: {
  params: { tag: string }
}) => {
  const tagSlug = params.tag;
  const tagName = decodeURIComponent(tagSlug);

  // Find the original tag name by matching slug
  let originalTagName = tagName;
  const allTagsMap = new Map<string, string>();

  posts.forEach(post => {
    const tags = extractTagsFromPost(post.title, post.description);
    tags.forEach(tag => {
      allTagsMap.set(titleToSlug(tag), tag);
    });
  });

  originalTagName = allTagsMap.get(tagSlug) || tagName;

  // Filter posts that have this tag
  const taggedPosts = posts.filter(post => {
    const postTags = extractTagsFromPost(post.title, post.description);
    return postTags.some(tag => titleToSlug(tag) === tagSlug);
  });

  const isYouTubePost = (url: string) => url.includes("youtube.com");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `Posts tagged with "${originalTagName}"`,
    "description": `All blog posts tagged with "${originalTagName}"`,
    "url": `https://tiagodanin.com/blog/tags/${tagSlug}`,
    "blogPost": taggedPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": toISODate(post.date),
      "url": `https://tiagodanin.com/post/${post.slug}`,
      "inLanguage": "pt-BR",
      "isAccessibleForFree": true,
      "keywords": originalTagName,
      "author": {
        "@type": "Person",
        "name": "Tiago Danin"
      }
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
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-3xl font-bold tracking-tight">Posts tagged with</h1>
            </div>
            <div className="flex justify-center mb-4">
              <Badge
                className={`flex items-center gap-2 text-lg px-4 py-2 ${getRandomColorWithDarkMode(originalTagName)}`}
              >
                <Tag className="h-4 w-4" />
                {originalTagName}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {taggedPosts.length} {taggedPosts.length === 1 ? 'post' : 'posts'} found
            </p>
          </div>
        </div>

        {taggedPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16">
            <p className="text-muted-foreground text-lg">
              No posts found with this tag.
            </p>
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
              <article key={index} className="group relative flex flex-col items-start hover:shadow-lg">
                <Link href={`/post/${post.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Read {post.title}</span>
                </Link>
                <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl" />

                <div className="relative z-10 order-first mb-3 flex items-center gap-2">
                  <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                    <span className="absolute inset-y-0 left-0 flex items-center">
                      <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                    </span>
                    {post.date}
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

                <h2 className="relative z-10 text-base font-semibold tracking-tight">
                  <Link href={`/post/${post.slug}`} className="relative z-10">
                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                    {post.title}
                  </Link>
                </h2>

                <p className="relative z-10 mt-2 text-sm text-zinc-600">
                  <Link href={`/post/${post.slug}`} className="relative z-10">
                    {post.description}
                  </Link>
                </p>

                <div className="relative z-10 mt-3 flex flex-wrap gap-2">
                  {extractTagsFromPost(post.title, post.description).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`text-xs ${getRandomColorWithDarkMode(tag)}`}
                    >
                      <Link href={`/blog/tags/${titleToSlug(tag)}`}>
                        {tag}
                      </Link>
                    </Badge>
                  ))}
                </div>

                <div className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
                  {isYouTubePost(post.originalUrl) ? (
                    <div className="flex gap-4">
                      <Link
                        href={`/post/${post.slug}`}
                        className="flex items-center hover:underline"
                      >
                        Read article
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                          <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                      <Link
                        href={post.originalUrl}
                        className="flex items-center text-red-600 dark:text-red-400 hover:underline z-20"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Watch on YouTube
                      </Link>
                    </div>
                  ) : (
                    <>
                      Read article
                      <Link href={`/post/${post.slug}`} className="relative z-10">
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                          <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TagPage;