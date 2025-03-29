import Link from "next/link";
import posts from "@/data/posts.json";
import { Badge } from "@/components/ui/badge";
import { Flag, Video, ChevronLeft, ChevronRight, Text } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: { page: string } }) {
  const pageNumber = Number(params.page) || 1;
  return {
    title: `Blog - Page ${pageNumber}`,
    description: "Articles and thoughts about development, technology and more",
  };
}

const POSTS_PER_PAGE = 10;
const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

export async function generateStaticParams() {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ page: i.toString() });
  }
  return pages;
}

const BlogPage = async ({
  params
}: {
  params: { page: string }
}) => {
  const currentPage = Number(params.page) || 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const isYouTubePost = (url: string) => url.includes("youtube.com");

  return (
    <div className="container mx-auto py-32">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <Badge variant="outline" className="flex items-center gap-1">
            <Flag className="h-3 w-3" />
            Only PT-BR
          </Badge>
        </div>
        <p className="mt-4 text-muted-foreground">
          Thoughts, insights, and ideas about technology and development
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Total posts: {posts.length}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-16">
        {currentPosts.map((post, index) => (
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

            <div className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
              Read article
              <Link href={`/post/${post.slug}`} className="relative z-10">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                  <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={currentPage === 2 ? "/blog" : `/blog/${currentPage - 1}`}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="flex items-center">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </span>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`/blog/${currentPage + 1}`}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex items-center">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPage; 