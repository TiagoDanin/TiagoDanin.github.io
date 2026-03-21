import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GiscusComments } from '@/components/ui/GiscusComments';
import { CallToAction } from '@/components/sections/CallToAction';
import { getPostBySlug, postHasLocale } from '@/lib/mdx';
import { renderMdx } from '@/lib/render-mdx';
import { toISODate } from '@/utils/parse';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'pt');

  if (!post) {
    return {
      title: 'Post nao encontrado',
      robots: { index: false, follow: true },
    };
  }

  const truncatedDescription = post.description.length > 160
    ? post.description.substring(0, 157) + '...'
    : post.description;

  return {
    title: post.title,
    description: truncatedDescription,
    alternates: {
      canonical: `https://tiagodanin.com/post/${post.slug}/pt`,
    },
    openGraph: {
      title: post.title,
      description: truncatedDescription,
      url: `https://tiagodanin.com/post/${post.slug}/pt`,
      type: 'article',
      publishedTime: toISODate(post.date),
      locale: 'pt_BR',
      siteName: 'Tiago Danin',
    },
  };
}

export function generateStaticParams() {
  const posts = queryCollection('posts').where({ lang: 'en' });
  return posts
    .filter((post: { slug: string; }) => postHasLocale(post.slug, 'pt'))
    .map((post: { slug: string; }) => ({
      slug: post.slug,
    }));
}

export default async function PostPt({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'pt');

  if (!post) {
    notFound();
  }

  const mdxContent = await renderMdx(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": toISODate(post.date),
    "url": `https://tiagodanin.com/post/${post.slug}/pt`,
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "author": { "@type": "Person", "name": "Tiago Danin", "url": "https://tiagodanin.com" },
    "publisher": { "@type": "Person", "name": "Tiago Danin" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back to blog */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="mb-8">
            <time className="text-sm text-muted-foreground">{post.date}</time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {post.description}
            </p>

             {/* Language toggle */}
             <div className="mt-4 flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/post/${post.slug}`} className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  EN
                </Link>
              </Button>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                PT
              </Badge>
            </div>
          </header>

          {/* MDX Content */}
          <div className="prose prose-zinc max-w-none">
            {mdxContent}
          </div>

          {/* Giscus Comments */}
          <GiscusComments term={`${post.slug}-pt`} />

          {/* Original article link */}
          {post.originalUrl && (
            <div className="mt-8">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={post.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ler artigo original
                </a>
              </Button>
            </div>
          )}
        </div>
      </article>

      <CallToAction />
    </>
  );
}
