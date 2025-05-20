import { Metadata } from 'next';
import posts from '@/data/posts.json';
import { RedirectClient } from "@/components/layout/RedirectClient";
import { toISODate } from '@/utils/parse';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.'
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function Post({ params }: { params: { slug: string } }) {
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    return <div className="container mx-auto py-32 text-center">Post not found</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": toISODate(post.date),
    "url": `https://tiagodanin.com/post/${post.slug}`,
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "author": {
      "@type": "Person",
      "name": "Tiago Danin"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RedirectClient url={post.originalUrl} />

      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto">
          <time className="text-sm text-zinc-400">{post!.date}</time>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
            {post!.title}
          </h1>
          <p className="mt-6 text-base text-zinc-600 blur-lg">
            {post!.description}
          </p>
          <div className="mt-8 text-sm">
            <a href={post.originalUrl} className="text-blue-600 hover:underline font-medium">
              Click here if you are not redirected automatically
            </a>
          </div>
        </div>
      </div>
    </>
  );
}