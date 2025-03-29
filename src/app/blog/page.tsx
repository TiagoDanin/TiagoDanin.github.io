import Link from "next/link";
import posts from "@/data/posts.json";

export const metadata = {
  title: "Blog",
  description: "Articles and thoughts about development, technology and more",
};

const Blog = () => {
  return (
    <div className="container mx-auto py-32">
      <div className="max-w-2xl mx-auto space-y-16">
        {posts.map((post, index) => (
          <article key={index} className="group relative flex flex-col items-start">
            <Link href={`/post/${post.slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">Read {post.title}</span>
            </Link>
            <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl" />
            
            <time className="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 pl-3.5">
              <span className="absolute inset-y-0 left-0 flex items-center">
                <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
              </span>
              {post.date}
            </time>
            
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
    </div>
  );
};

export default Blog;