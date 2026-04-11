import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { getCoverImagePath } from "@/lib/cover-image";

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNumber = Number(page) || 1;
  return {
    title: `Blog - Page ${pageNumber}`,
    description: "Articles about software development, mobile apps, AI and technology.",
    alternates: {
      canonical: `https://tiagodanin.com/blog/${pageNumber}`,
    },
    openGraph: {
      title: `Blog - Page ${pageNumber} - Tiago Danin`,
      description: "Articles about software development, mobile apps, and technology.",
      url: `https://tiagodanin.com/blog/${pageNumber}`,
      type: "website",
    },
  };
}

const POSTS_PER_PAGE = 10;

export function generateStaticParams() {
  const posts = queryCollection('posts').where({ lang: 'en' });
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ page: i.toString() });
  }
  return pages;
}

const BlogPage = async ({ params }: { params: Promise<{ page: string }> }) => {
  const { page } = await params;
  const posts = [...queryCollection('posts').where({ lang: 'en' })].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = Number(page) || 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const prevUrl = currentPage === 2
    ? 'https://tiagodanin.com/blog'
    : `https://tiagodanin.com/blog/${currentPage - 1}`;

  return (
    <>
      {currentPage > 1 && <link rel="prev" href={prevUrl} />}
      {currentPage < totalPages && <link rel="next" href={`https://tiagodanin.com/blog/${currentPage + 1}`} />}
    <div className="container mx-auto py-32">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-muted-foreground">
          Thoughts, insights, and ideas about technology and development
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length} articles
        </p>
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
    </>
  );
};

export default BlogPage;
