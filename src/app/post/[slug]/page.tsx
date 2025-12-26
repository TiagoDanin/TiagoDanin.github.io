import { Metadata } from 'next';
import posts from '@/data/posts.json';
import { RedirectClient } from "@/components/layout/RedirectClient";
import { toISODate } from '@/utils/parse';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  // Truncate description to 160 characters
  const truncatedDescription = post.description.length > 160
    ? post.description.substring(0, 157) + '...'
    : post.description;

  return {
    title: post.title,
    description: truncatedDescription,
    keywords: ['blog', 'artigo', 'software development', 'technology', 'pt-br', 'desenvolvimento', 'programação'],
    alternates: {
      canonical: `https://tiagodanin.com/post/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: truncatedDescription,
      url: `https://tiagodanin.com/post/${post.slug}`,
      type: 'article',
      publishedTime: toISODate(post.date),
      authors: ['https://tiagodanin.com/about'],
      locale: 'pt_BR',
      siteName: 'Tiago Danin',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: truncatedDescription,
      creator: '@tiagodanin',
      site: '@tiagodanin',
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tiagodanin.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://tiagodanin.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://tiagodanin.com/post/${post.slug}`
      }
    ]
  };

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
      "name": "Tiago Danin",
      "url": "https://tiagodanin.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Tiago Danin"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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